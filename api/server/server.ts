import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import fs from 'node:fs';
// import path from 'node:path';
import https from 'node:https';
import cookieParser from 'cookie-parser';
import {
  CERT_FILE,
  CERTS_DIR,
  checkForCerts,
  KEY_FILE,
} from '../certs/setupCerts.js';
import { connectToDB } from '../db/connection.js';
import uploadFile from './routes/files/uploadFile.js';
import listFiles from './routes/files/listFiles.js';
import deleteFile from './routes/files/deleteFile.js';
import addUser from './routes/users/addUser.js';
import getUser from './routes/users/getUser.js';
import deleteUser from './routes/users/deleteUser.js';
import loginUser from './routes/users/loginUser.js';
import { setupSession } from './session/setupSession.js';
import logoutUser from './routes/users/logoutUser.js';
import meUser from './routes/users/meUser.js';

dotenv.config();
if (!process.env.SESSION_SECRET) {
  console.error('❌ Error: SESSION_SECRET is missing in your environment variables. Possibly .env file missing.');
  process.exit(1);
}
//TODO: delete metadata

const app = express();
const PORT = process.env.PORT || 8081;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';

const allowedOrigins = [
  'https://localhost:5173',
  'http://localhost:4173',
  'http://localhost:8081',
  'http://localhost:5000',
];

app.set('trust proxy', true);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'https: data:'],
    },
  }),
);
app.use(cookieParser());

// // SERVE STATIC FILES -- possibility to enable in future
// if (NODE_ENV === 'production') {
//   const staticPath = path.join(__dirname, '../../');

//   console.log('[DEBUG] Static path:', staticPath);
//   console.log('[DEBUG] Assets path:', path.join(staticPath, 'assets'));

//   app.use(express.static(staticPath, {
//     setHeaders: (res, filePath) => {
//       if (filePath.endsWith('.html')) {
//         res.setHeader('Cache-Control', 'no-store');
//       } else {
//         res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
//       }
//     },
//   }));

//   //index.html
//   app.get('/', (req, res) => {
//     res.sendFile(path.join(staticPath, 'index.html'));
//   });

//   // Catch-all route to serve index.html for all paths other than API requests (used by SPA in web React app)
//   app.get('/*splat', (req, res, next) => {
//     if (req.path.startsWith('/api')) return next(); // let API requests pass through
//     res.sendFile(path.join(staticPath, 'index.html'));
//   });
// }

async function startServer() {
  console.log(`[ENV] NODE_ENV: ${NODE_ENV}`);
  console.log(`[ENV] PORT: ${PORT}`);

  const { sessionStore } = await connectToDB();
  if (sessionStore !== null) {
    const session = setupSession(sessionStore);
    app.use(session);
  }

  // ROUTES
  app.use('/files/upload', uploadFile);
  app.use('/files/list', listFiles);
  app.use('/files/delete', deleteFile);
  app.use('/users/add', addUser);
  app.use('/users/get', getUser);
  app.use('/users/delete', deleteUser);
  app.use('/users/login', loginUser);
  app.use('/users/logout', logoutUser);
  app.use('/users/me', meUser);
  app.get('/test', (req, res) => {
    console.log(req.session);
    const sess = req.session as any;
    sess.counter = (sess.counter || 0) + 1;
    res.json({ visits: sess.counter });
  });
  // 404 handler
  app.use((req, res) => {
    const defMessage = { message: 'Not Found' };
    res.status(404).json(isProd ? defMessage : { ...defMessage, requestedUrl: req.originalUrl, params: req.params, query: req.query });
  });

  if (
    !isProd &&
  (
    !fs.existsSync(`${CERTS_DIR}${CERT_FILE}`) ||
    !fs.existsSync(`${CERTS_DIR}${KEY_FILE}`)
  )
  ) {
    await checkForCerts(KEY_FILE, CERT_FILE);
  }
  // using 0.0.0.0 because server is behing reverse proxy (e.g. GCP App Engine)
  const server =
    isProd
      ? app.listen(Number(PORT), '0.0.0.0', () => {
        //   connectDB();
        console.log(`✅ Server running on port ${PORT}`);
      })
      : https
        .createServer(
          {
            cert: fs.readFileSync(`${CERTS_DIR}${CERT_FILE}`),
            key: fs.readFileSync(`${CERTS_DIR}${KEY_FILE}`),
          },
          app,
        )
        .listen(PORT, async () => {
          console.log(`🔐 Dev server running at https://localhost:${PORT}`);
        });

  // Set server timeouts
  server.timeout = 70000; // 70 seconds
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
}

// Start the server
startServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
