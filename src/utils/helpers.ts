// CONFIG
import config from 'config';
// TYPES
import { Config } from '@/types';
// PATH
import path from 'path';
// FS
import fs from 'fs';
// STREAM
import { pipeline } from 'stream/promises';
// TYPES
import type { Readable } from 'stream';
import type { UploadContext } from '@/middlewares/busboy';

export function getConfig<T>(key: keyof Config): T {
  return config.get<T>(key as string);
}

export async function uploadFile(
  fileStream: Readable,
  ctx: UploadContext
): Promise<void> {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, ctx.filename);
  const writeStream = fs.createWriteStream(filePath);
  await pipeline(fileStream, writeStream);
}
