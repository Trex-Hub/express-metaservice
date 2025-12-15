// EXPRESS
import { Request, Response } from 'express';
// CONSTANTS
import { TIMESTAMP as timestamp } from '@/utils/constants';
// TYPES
import type { UploadContext } from '@/middlewares/busboy';

const uploadController = (req: Request, res: Response) => {
  const uploadedFiles = (req.body.uploadedFiles as UploadContext[]) ?? [];

  res.status(200).json({
    message: 'Files uploaded successfully',
    timestamp,
    files: uploadedFiles.map(
      (file: {
        fieldname: string;
        filename: string;
        mimeType: string;
        encoding: string;
      }) => ({
        fieldname: file.fieldname,
        filename: file.filename,
        mimeType: file.mimeType,
        encoding: file.encoding,
      })
    ),
    count: uploadedFiles.length,
  });
};

export default uploadController;
