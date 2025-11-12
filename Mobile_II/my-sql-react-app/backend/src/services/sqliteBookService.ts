import { getSqliteDatabase, sqliteHelpers } from '../database/sqlite';
import { BookPayload, BookRecord, BookUpdatePayload } from '../schemas/bookSchema';
import { BookService } from './types';

type SqliteRow = {
  id: number;
  titulo: string;
  autor: string;
  status: string;
  nota: number | null;
  criado_em: string;
  atualizado_em: string;
};

function toBookRecord(row: SqliteRow): BookRecord {
  return {
    id: row.id.toString(),
    titulo: row.titulo,
    autor: row.autor,
    status: row.status as BookRecord['status'],
    nota: typeof row.nota === 'number' ? row.nota : undefined,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em
  };
}

export async function createSqliteBookService(): Promise<BookService> {
  const db = await getSqliteDatabase();

  const service: BookService = {
    async list() {
      const rows = await sqliteHelpers.all<SqliteRow>(
        db,
        `
        SELECT id, titulo, autor, status, nota, criado_em, atualizado_em
        FROM books
        ORDER BY datetime(criado_em) DESC;
        `
      );
      return rows.map(toBookRecord);
    },
    async getById(id: string) {
      const row = await sqliteHelpers.get<SqliteRow>(
        db,
        `
        SELECT id, titulo, autor, status, nota, criado_em, atualizado_em
        FROM books WHERE id = ?;
        `,
        [Number(id)]
      );

      return row ? toBookRecord(row) : null;
    },
    async create(payload: BookPayload) {
      const result = await sqliteHelpers.run(
        db,
        `
        INSERT INTO books (titulo, autor, status, nota, criado_em, atualizado_em)
        VALUES (?, ?, ?, ?, datetime('now'), datetime('now'));
        `,
        [payload.titulo, payload.autor, payload.status, payload.nota ?? null]
      );

      const created = await service.getById(result.lastID.toString());
      if (!created) {
        throw new Error('Falha ao criar livro.');
      }
      return created;
    },
    async update(id: string, payload: BookUpdatePayload) {
      const result = await sqliteHelpers.run(
        db,
        `
        UPDATE books
        SET
          titulo = COALESCE(?, titulo),
          autor = COALESCE(?, autor),
          status = COALESCE(?, status),
          nota = CASE WHEN ? IS NULL THEN nota ELSE ? END,
          atualizado_em = datetime('now')
        WHERE id = ?;
        `,
        [
          payload.titulo ?? null,
          payload.autor ?? null,
          payload.status ?? null,
          payload.nota ?? null,
          payload.nota ?? null,
          Number(id)
        ]
      );

      if (result.changes === 0) {
        throw new Error('Livro não encontrado.');
      }

      const updated = await service.getById(id);
      if (!updated) {
        throw new Error('Falha ao carregar livro atualizado.');
      }

      return updated;
    },
    async remove(id: string) {
      const result = await sqliteHelpers.run(
        db,
        `DELETE FROM books WHERE id = ?;`,
        [Number(id)]
      );

      if (result.changes === 0) {
        throw new Error('Livro não encontrado.');
      }
    }
  };

  return service;
}

