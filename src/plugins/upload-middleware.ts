import type { Plugin, ViteDevServer } from 'vite';
import multer from 'multer';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
}).single('file');

export function uploadMiddleware(): Plugin {
  return {
    name: 'upload-middleware',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/upload', (req, res, next) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        upload(req, res, (err) => {
          if (err) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: err.message }));
            return;
          }

          const file = (req as any).file;
          if (!file) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'No file uploaded' }));
            return;
          }

          const url = `/uploads/${file.filename}`;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ url, filename: file.filename }));
        });
      });
    },
  };
}
