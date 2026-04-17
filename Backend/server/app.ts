import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { apiRouter } from './routes/api';

interface CreateAppOptions {
  distDir: string;
}

export const createApp = ({ distDir }: CreateAppOptions) => {
  const app = express();

  app.use(express.json());
  app.use('/api', apiRouter);

  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));

    app.get('*', (request, response, next) => {
      if (request.path.startsWith('/api/')) {
        next();
        return;
      }

      response.sendFile(path.join(distDir, 'index.html'));
    });
  }

  return app;
};
