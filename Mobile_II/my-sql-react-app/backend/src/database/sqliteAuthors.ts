import { getSqliteDatabase, sqliteHelpers } from './sqlite';

export async function ensureAuthorsSchema() {
  const db = await getSqliteDatabase();
  
  await sqliteHelpers.run(
    db,
    `
    CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      biografia TEXT,
      nacionalidade TEXT,
      ano_nascimento INTEGER,
      criado_em TEXT NOT NULL DEFAULT (datetime('now')),
      atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
    );
    `
  );
}

