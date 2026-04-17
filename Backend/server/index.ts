import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app';
import { DATABASE_PATH } from './db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');
const DIST_DIR = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT || 3001);

const app = createApp({ distDir: DIST_DIR });

app.listen(PORT, () => {
  console.log(`Kototsuna backend listening on http://localhost:${PORT}`);
  console.log(`SQLite database: ${DATABASE_PATH}`);
});
