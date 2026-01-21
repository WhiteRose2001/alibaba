import { Router } from 'express';
import { getMySqlPool } from '../../../db/mysql/connections.js';

const removeMetadata = Router();

removeMetadata.post('/', async (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    return res.json({
      success: false,
      message: 'Filename is required',
    });
  }

  const pool = await getMySqlPool();
  console.log(filename);

  try {
    await pool.execute("UPDATE files SET METADATA = 'N' WHERE filename = ?", [
      filename,
    ]);
  } catch (err) {
    console.log(err);
  }
});

export default removeMetadata;
