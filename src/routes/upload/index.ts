// EXPRESS
import { Router } from 'express';
// CONTROLLERS
import uploadController from '@/controllers/upload';
import { busboyMiddleware } from '@/middlewares/busboy';
// HELPERS
import { uploadFile } from '@/utils/helpers';

const uploadRouter: Router = Router();

/**
 * @openapi
 * /upload:
 *   post:
 *     summary: Upload one or more image files
 *     description: >
 *       Uploads image files to the server. Supports JPEG, PNG and GIF formats.
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded successfully.
 *       400:
 *         description: Invalid request payload or file type.
 *       500:
 *         description: Internal server error.
 */
uploadRouter.post(
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
