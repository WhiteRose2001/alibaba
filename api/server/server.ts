import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  CERT_FILE,
  CERTS_DIR,
  checkForCerts,
  KEY_FILE,
} from '../certs/setupCerts.js';

import { setupSession } from './session/setupSession.js';

import deleteFile from './routes/files/deleteFile.js';
import listFiles from './routes/files/listFiles.js';
import uploadFile from './routes/files/uploadFile.js';
import addUser from './routes/users/addUser.js';
import deleteUser from './routes/users/deleteUser.js';
import getUser from './routes/users/getUser.js';
import loginUser from './routes/users/loginUser.js';
import logoutUser from './routes/users/logoutUser.js';
import meUser from './routes/users/meUser.js';
import { createMySQLSessionStore } from '../db/mysql/sessions/setupSession.js';
import removeMetadata from './routes/files/removeMetadata.js';
import downloadRouter from './routes/files/downloadFile.js';

dotenv.config();

if (!process.env.SESSION_SECRET) {
  console.error(
    '❌ Error: SESSION_SECRET is missing in your environment variables. Possibly .env file missing.',
  );
  process.exit(1);
}

const app = express();
const PORT = Number(process.env.PORT || 8081);
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';

app.set('trust proxy', true);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: isProd ? true : 'https://localhost:5173',
    credentials: true,
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: isProd
      ? {
          directives: {
            defaultSrc: ["'self'"],
            imgSrc: [
              "'self'",
              'data:',
              'blob:',
              'https://*.tile.openstreetmap.org',
              'https://tile.openstreetmap.org',
            ],
            styleSrc: [
              "'self'",
              "'unsafe-inline'", // Leaflet CSS
            ],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
          },
        }
      : false,
  }),
);

const sessionStore = await createMySQLSessionStore();
if (sessionStore !== null) {
  const session = setupSession(sessionStore);
  app.use(session);
}

app.use('/files/upload', uploadFile);
app.use('/files/list', listFiles);
app.use('/files/delete', deleteFile);
app.use('/files/remove-metadata', removeMetadata);
app.use('/files/download', downloadRouter);

app.use('/users/add', addUser);
app.use('/users/get', getUser);
app.use('/users/delete', deleteUser);
app.use('/users/login', loginUser);
app.use('/users/logout', logoutUser);
app.use('/users/me', meUser);

if (isProd) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontendPath = '/opt/render/project/src/dist';
  console.log('✅ Serving frontend from:', frontendPath);
  app.use(express.static(frontendPath));

  app.get('/*splat', (_, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

let server;

if (!isProd) {
  await checkForCerts(KEY_FILE, CERT_FILE);
  server = https
    .createServer(
      {
        cert: fs.readFileSync(`${CERTS_DIR}${CERT_FILE}`),
        key: fs.readFileSync(`${CERTS_DIR}${KEY_FILE}`),
      },
      app,
    )
    .listen(PORT, () => {
      console.log(`🔐 Dev server running at https://localhost:${PORT}`);
    });
} else {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ PROD HTTP on port ${PORT}`);
  });
}

// Set server timeouts
server.timeout = 30000; // 30 seconds
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

const shutdown = () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });

  // Force exit if server is not shut down within 5 seconds
  setTimeout(async () => {
    console.log('Forcefully shutting down the server.');
    process.exit(1);
  }, 5000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
