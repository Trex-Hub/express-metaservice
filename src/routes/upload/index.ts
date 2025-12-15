// EXPRESS
import { Router } from 'express';
// CONTROLLERS
import uploadController from '@/controllers/upload';
import { busboyMiddleware } from '@/middlewares/busboy';
// HELPERS
import { uploadFile } from '@/utils/helpers';
// TYPES
import { UploadRequest, UploadResponse } from '@/types/route/upload/post';

const uploadRouter: Router = Router();

uploadRouter.post<{}, UploadResponse, UploadRequest>(
  '/',
  busboyMiddleware({
    filePolicy: {
      maxFiles: 10,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
      maxFileSize: 1024 * 1024 * 5,
      requireFiles: true,
    },
    uploadFunction: uploadFile,
  }),
  uploadController
);

export default uploadRouter;
