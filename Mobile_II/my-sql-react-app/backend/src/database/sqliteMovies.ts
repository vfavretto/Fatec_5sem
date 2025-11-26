import { getSqliteDatabase, sqliteHelpers } from './sqlite';

export async function ensureMoviesSchema() {
  const db = await getSqliteDatabase();
  
  await sqliteHelpers.run(
    db,
    `
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      diretor TEXT NOT NULL,
      ano INTEGER NOT NULL,
      genero TEXT NOT NULL,
      nota_pessoal REAL,
      criado_em TEXT NOT NULL DEFAULT (datetime('now')),
      atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
    );
    `
  );
}

