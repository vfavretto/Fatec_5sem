import { getSqliteDatabase, sqliteHelpers } from '../database/sqlite';
import { ensureAuthorsSchema } from '../database/sqliteAuthors';
import { AuthorPayload, AuthorRecord, AuthorUpdatePayload } from '../schemas/authorSchema';
import { AuthorService } from './authorTypes';

type SqliteRow = {
  id: number;
  nome: string;
  biografia: string | null;
  nacionalidade: string | null;
  ano_nascimento: number | null;
  criado_em: string;
  atualizado_em: string;
};

function toAuthorRecord(row: SqliteRow): AuthorRecord {
  return {
    id: row.id.toString(),
    nome: row.nome,
    biografia: row.biografia ?? undefined,
    nacionalidade: row.nacionalidade ?? undefined,
    anoNascimento: row.ano_nascimento ?? undefined,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em
  };
}

export async function createSqliteAuthorService(): Promise<AuthorService> {
  const db = await getSqliteDatabase();
  await ensureAuthorsSchema();

  const service: AuthorService = {
    async list() {
      const rows = await sqliteHelpers.all<SqliteRow>(
        db,
        `
        SELECT id, nome, biografia, nacionalidade, ano_nascimento, criado_em, atualizado_em
        FROM authors
        ORDER BY nome ASC;
        `
      );
      return rows.map(toAuthorRecord);
    },
    async getById(id: string) {
      const row = await sqliteHelpers.get<SqliteRow>(
        db,
        `
        SELECT id, nome, biografia, nacionalidade, ano_nascimento, criado_em, atualizado_em
        FROM authors WHERE id = ?;
        `,
        [Number(id)]
      );

      return row ? toAuthorRecord(row) : null;
    },
    async create(payload: AuthorPayload) {
      const result = await sqliteHelpers.run(
        db,
        `
        INSERT INTO authors (nome, biografia, nacionalidade, ano_nascimento, criado_em, atualizado_em)
        VALUES (?, ?, ?, ?, datetime('now'), datetime('now'));
        `,
        [payload.nome, payload.biografia ?? null, payload.nacionalidade ?? null, payload.anoNascimento ?? null]
      );

      const created = await service.getById(result.lastID.toString());
      if (!created) {
        throw new Error('Falha ao criar autor.');
      }
      return created;
    },
    async update(id: string, payload: AuthorUpdatePayload) {
      const result = await sqliteHelpers.run(
        db,
        `
        UPDATE authors
        SET
          nome = COALESCE(?, nome),
          biografia = CASE WHEN ? IS NULL THEN biografia ELSE ? END,
          nacionalidade = CASE WHEN ? IS NULL THEN nacionalidade ELSE ? END,
          ano_nascimento = CASE WHEN ? IS NULL THEN ano_nascimento ELSE ? END,
          atualizado_em = datetime('now')
        WHERE id = ?;
        `,
        [
          payload.nome ?? null,
          payload.biografia ?? null,
          payload.biografia ?? null,
          payload.nacionalidade ?? null,
          payload.nacionalidade ?? null,
          payload.anoNascimento ?? null,
          payload.anoNascimento ?? null,
          Number(id)
        ]
      );

      if (result.changes === 0) {
        throw new Error('Autor não encontrado.');
      }

      const updated = await service.getById(id);
      if (!updated) {
        throw new Error('Falha ao carregar autor atualizado.');
      }

      return updated;
    },
    async remove(id: string) {
      const result = await sqliteHelpers.run(
        db,
        `DELETE FROM authors WHERE id = ?;`,
        [Number(id)]
      );

      if (result.changes === 0) {
        throw new Error('Autor não encontrado.');
      }
    }
  };

  return service;
}

