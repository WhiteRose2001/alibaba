import { Router } from 'express';
import fs from 'node:fs';
import fileStorage from '../../utils/createStorage.js';
import { OkPacketParams } from 'mysql2';
import storageDir from '../../utils/storageDir.js';
import { getMySqlPool } from '../../../db/mysql/connections.js';

type FileData = {
  filename: string;
  path: string;
  userId: number;
};

const uploadFile = Router();

uploadFile.post('/', fileStorage.single('file'), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: 'No file uploaded' });
  }
  const userId = req.body.userId;
  const filename = req.file.filename;

  const path = `${storageDir}/${filename}`;
  if (!userId || !filename) {
    fs.unlinkSync(path);
    return res.status(400).json({
      success: false,
      message: 'UserId and filename are required in body',
    });
  }

  let fileId: number | undefined;
  try {
    fileId = await insertFileData({ filename, path, userId: Number(userId) });
  } catch (err: any) {
    console.error('❌ DB insert failed, deleting uploaded file…');
    try {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    } catch (unlinkErr: any) {
      console.error('⚠️ Failed to remove uploaded file:', unlinkErr?.message);
    }
    return res.status(500).json({
      success: false,
      message: 'Database error during file insert: ' + err?.message,
    });
  }

  res.json({
    success: true,
    message: '✅ File uploaded successfully',
    params: {
      fileUrl: path,
      fileId,
    },
  });
});

async function insertFileData({ filename, path, userId }: FileData) {
  try {
    const pool = await getMySqlPool();
    const [result] = await pool.execute(
      'INSERT INTO files (filename, path, user_id) VALUES (?, ?, ?)',
      [filename, path, userId],
    );
    const fileId = (result as OkPacketParams)?.insertId;
    console.log('✅ File inserted: ', fileId);
    return fileId;
  } catch (err: any) {
    console.error('❌ MySQL error during file insert:', err.message);
    throw new Error('Database insert failed');
  }
}

export default uploadFile;
