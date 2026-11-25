
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';


export const projectRoot = fileURLToPath(new URL('src/database/game.db', import.meta.url));
const dbPath = process.env.DB_PATH || path.join(projectRoot, 'database', 'game.db');
export const db = new Database(dbPath);