import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import { fileURLToPath } from 'url';
import { exiftool } from 'exiftool-vendored';
import { getMySqlPool } from '../../../db/mysql/connections.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const removeMetadata = Router();

removeMetadata.post('/', async (req, res) => {
  const { filename } = req.body;

  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Filename is required',
    });
  }

  const safeName = path.basename(filename);
  const filePath = path.resolve(__dirname, '../../storage/files', safeName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'File not found',
    });
  }

  try {
    // remove metadata
    await exiftool.write(filePath, {});

    const pool = await getMySqlPool();
    await pool.execute("UPDATE files SET METADATA = 'N' WHERE filename = ?", [
      filename,
    ]);

    return res.json({
      success: true,
      message: 'Metadata removed',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'ExifTool failed',
    });
  }
});

export default removeMetadata;
