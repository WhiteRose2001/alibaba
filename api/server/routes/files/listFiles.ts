import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import exifr from 'exifr';
import { SensitiveMetadata } from './types/sensitiveMetadata.js';
import { mapSensitiveMetadata } from './utils/mapSensitiveMetadata.js';
import { getMySqlPool } from '../../../db/mysql/connections.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listFiles = Router();

listFiles.get('/', async (req, res) => {
  const dirPath = __dirname + '/../../storage/files';
  const files = fs.readdirSync(dirPath);
  const metadata: Record<string, SensitiveMetadata | null> = {};

  const rows = await getFilesData();

  const metadataMap = new Map<string, 'T' | 'N'>();
  rows.forEach((row: Record<string, any>) => {
    metadataMap.set(row.filename, row.METADATA);
  });

  await Promise.all(
    files.map(async (filename) => {
      try {
        if (metadataMap.get(filename) !== 'T') {
          metadata[filename] = null;
          return;
        }
        const rawExif = await exifr.parse(path.join(dirPath, filename), {
          gps: true,
          exif: true,
          tiff: true,
        });

        metadata[filename] = rawExif ? mapSensitiveMetadata(rawExif) : null;
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

async function getFilesData() {
  const pool = await getMySqlPool();
  const [rows] = await pool.execute('SELECT filename, METADATA FROM files');
  return Array.isArray(rows) ? rows : [];
}
