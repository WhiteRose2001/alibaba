import multer from 'multer';
import storageDir from './storageDir.js';

const storage = multer.diskStorage({
  destination: storageDir,
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileStorage = multer({ storage });

export default fileStorage;
