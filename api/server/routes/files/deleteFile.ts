import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getMySqlPool } from '../../../db/mysql/connections.js';
import { OkPacketParams } from 'mysql2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteFile = Router();

deleteFile.post('/', async (req, res) => {
  const { filename } = req.body;
  if (!filename || typeof filename !== 'string') {
    return res
      .status(400)
      .json({ success: false, message: 'Filename is required in body' });
  }

  const filePath = path.join(__dirname, '../../storage/files/', filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found' });
  }
  const files = fs.rmSync(filePath, { force: true });
  try {
    const pool = await getMySqlPool();
    const [result] = await pool.execute(
      'DELETE FROM files WHERE filename = ?',
      [filename],
    );

    if ((result as OkPacketParams)?.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: '⚠️ No file found with that filename.',
      });
    }
  } catch (err) {
    console.error('❌ Failed to delete file:', err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
  res.json({
    success: true,
    message: '✅ Files deleted successfully',
    params: {
      files,
    },
  });
});

export default deleteFile;
