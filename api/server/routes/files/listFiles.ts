import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import exifr from 'exifr';
import { SensitiveMetadata } from './types/sensitiveMetadata.js';
import { mapSensitiveMetadata } from './utils/mapSensitiveMetadata.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listFiles = Router();

listFiles.get('/', async (req, res) => {
  const dirPath = __dirname + '/../../storage/files';
  const files = fs.readdirSync(dirPath);
  const metadata:Record<string, SensitiveMetadata | null> = {};
  await Promise.all(
    files.map(async (filename) => {
      try {
        const rawExif = await exifr.parse(
          path.join(dirPath, filename),
          { gps: true, exif: true, tiff: true },
        );

        metadata[filename] = rawExif
          ? mapSensitiveMetadata(rawExif)
          : null;
      } catch {
        metadata[filename] = null;
      }
    }),
  );

  res.json({
    success: true,
    message: '✅ Files listed successfully',
    params: {
      files,
      metadata,
    },
  });
});

export default listFiles;