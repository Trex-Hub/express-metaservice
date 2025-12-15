// BUSBOY
import Busboy from 'busboy';
// EXPRESS
import { Request, Response, NextFunction } from 'express';
// LOGGER
import { logger } from '@/utils/logger';
// TYPES
import type { Readable } from 'stream';

export type FilePolicy = {
  maxFiles?: number;
  allowedMimeTypes?: string[];
  maxFileSize?: number;
  requireFiles?: boolean;
};

export type UploadContext = {
  fieldname: string;
  filename: string;
  mimeType: string;
  encoding: string;
};

export type BusboyConfig = {
  filePolicy?: FilePolicy;
  uploadFunction: (fileStream: Readable, ctx: UploadContext) => Promise<void>;
};

export type BusboyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export const busboyMiddleware = (config: BusboyConfig): BusboyMiddleware => {
  // Validate config eagerly
  if (typeof config.uploadFunction !== 'function') {
    throw new Error('uploadFunction is required and must be a function');
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.startsWith('multipart/form-data')) {
      res
        .status(400)
        .json({ message: 'Invalid Content-Type. Must be multipart/form-data' });
      return;
    }

    // Merge filePolicy with defaults
    const filePolicy = config.filePolicy ?? {};
    const {
      maxFiles = 1,
      allowedMimeTypes = [],
      maxFileSize = 1024 * 1024 * 5,
      requireFiles = false,
    } = filePolicy;

    // If allowedMimeTypes is empty or not set, allow any file types
    const hasMimeTypeRestrictions =
      allowedMimeTypes && allowedMimeTypes.length > 0;

    const busboy = Busboy({
      headers: req.headers,
      limits: {
        files: maxFiles,
        fileSize: maxFileSize,
      },
    });

    // Initialize uploaded files tracking
    if (!req.body) {
      req.body = {};
    }
    req.body.uploadedFiles = [];

    // Hard abort mechanism - prevent double processing
    let aborted = false;
    let fileCount = 0;

    const abort = (status: number, payload: Record<string, unknown>) => {
      if (aborted) return;
      aborted = true;

      req.unpipe(busboy);
      busboy.removeAllListeners();

      if (!res.headersSent) {
        res.status(status).json(payload);
      }
    };

    const filePromises: Promise<void>[] = [];

    busboy.on('file', (fieldname, file, info) => {
      if (aborted) {
        file.resume();
        return;
      }

      const { filename, encoding, mimeType } = info;
      fileCount++;

      // Throw Error if the mimetype doesn't match the allowed Mime types
      if (hasMimeTypeRestrictions && !allowedMimeTypes.includes(mimeType)) {
        file.resume(); // Drain the file stream
        abort(400, {
          message: `File type ${mimeType} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`,
        });
        return;
      }

      logger.info(`File upload: ${filename} (${mimeType}, ${encoding})`);

      const ctx: UploadContext = { fieldname, filename, mimeType, encoding };

      // Track uploaded file metadata
      req.body.uploadedFiles.push({
        fieldname,
        filename,
        mimeType,
        encoding,
      });

      // Propagate uploadFunction failures correctly
      const uploadPromise = config.uploadFunction(file, ctx).catch(error => {
        logger.error(`Error uploading file ${filename}:`, error);
        abort(500, {
          message: 'Upload failed',
          error: error instanceof Error ? error.message : String(error),
        });
        throw error; // Re-throw to fail Promise.all
      });

      filePromises.push(uploadPromise);
    });

    // Handle Busboy limit events
    busboy.on('filesLimit', () => {
      abort(400, { message: `Maximum ${maxFiles} file(s) allowed` });
    });

    busboy.on('fileSizeLimit', () => {
      abort(400, {
        message: `File exceeds maximum size of ${maxFileSize} bytes`,
      });
    });

    busboy.on('error', error => {
      logger.error('Busboy error:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      abort(400, { message: 'File upload error', error: errorMessage });
    });

    busboy.on('finish', async () => {
      if (aborted) return;

      // Explicitly handle "no files uploaded"
      if (requireFiles && fileCount === 0) {
        abort(400, { message: 'No files uploaded' });
        return;
      }

      try {
        await Promise.all(filePromises);
        if (!aborted && !res.headersSent) {
          next();
        }
      } catch (error) {
        // Error already handled in uploadPromise catch, but log for completeness
        logger.error('Error processing files:', error);
        if (!aborted && !res.headersSent) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          res
            .status(500)
            .json({ message: 'Error processing files', error: errorMessage });
        }
      }
    });

    req.pipe(busboy);
  };
};
