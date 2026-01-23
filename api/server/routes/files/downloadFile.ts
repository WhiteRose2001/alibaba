import e, { Router } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const downloadRouter = Router();

downloadRouter.get('/', (req, res) => {
  const { filename } = req.query;
  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Filename query parameter is required',
    });
  }
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const safeName = path.basename(filename);

  const filePath = path.resolve(__dirname, '../../storage/files', safeName);
  res.download(filePath, 'raport.pdf');
});

export default downloadRouter;
