import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

sqlite3.verbose();

let database: sqlite3.Database | null = null;

function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getDatabasePath() {
  const configuredPath = process.env.SQLITE_PATH;
  const resolvedPath = configuredPath
    ? path.resolve(configuredPath)
    : path.resolve(process.cwd(), 'backend', 'data', 'books.sqlite');

  ensureDirectoryExists(resolvedPath);
  return resolvedPath;
}

type RunResult = {
  lastID: number;
  changes: number;
};

function wrapRun(db: sqlite3.Database, sql: string, params: unknown[] = []) {
  return new Promise<RunResult>((resolve, reject) => {
    db.run(sql, params, function (this: sqlite3.RunResult, err: Error | null) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

function wrapGet<T>(db: sqlite3.Database, sql: string, params: unknown[] = []) {
  return new Promise<T | undefined>((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as T | undefined);
      }
    });
  });
}

function wrapAll<T>(db: sqlite3.Database, sql: string, params: unknown[] = []) {
  return new Promise<T[]>((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as T[]);
      }
    });
  });
}

async function ensureSchema(db: sqlite3.Database) {
  await wrapRun(
    db,
    `
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('lido', 'planejado')),
      nota REAL,
      criado_em TEXT NOT NULL DEFAULT (datetime('now')),
      atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
    );
    `
  );
}

export async function getSqliteDatabase() {
  if (database) {
    return database;
  }

  const dbPath = getDatabasePath();

  database = new sqlite3.Database(dbPath);

  await wrapRun(database, `PRAGMA foreign_keys = ON;`);
  await ensureSchema(database);

  return database;
}

export const sqliteHelpers = {
  run: wrapRun,
  get: wrapGet,
  all: wrapAll
};

