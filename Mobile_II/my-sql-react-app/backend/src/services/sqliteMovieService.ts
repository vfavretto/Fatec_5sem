import { getSqliteDatabase, sqliteHelpers } from '../database/sqlite';
import { ensureMoviesSchema } from '../database/sqliteMovies';
import { MoviePayload, MovieRecord, MovieUpdatePayload } from '../schemas/movieSchema';
import { MovieService } from './movieTypes';

type SqliteRow = {
  id: number;
  titulo: string;
  diretor: string;
  ano: number;
  genero: string;
  nota_pessoal: number | null;
  criado_em: string;
  atualizado_em: string;
};

function toMovieRecord(row: SqliteRow): MovieRecord {
  return {
    id: row.id.toString(),
    titulo: row.titulo,
    diretor: row.diretor,
    ano: row.ano,
    genero: row.genero,
    notaPessoal: row.nota_pessoal ?? undefined,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em
  };
}

export async function createSqliteMovieService(): Promise<MovieService> {
  const db = await getSqliteDatabase();
  await ensureMoviesSchema();

  const service: MovieService = {
    async list() {
      const rows = await sqliteHelpers.all<SqliteRow>(
        db,
        `
        SELECT id, titulo, diretor, ano, genero, nota_pessoal, criado_em, atualizado_em
        FROM movies
        ORDER BY titulo ASC;
        `
      );
      return rows.map(toMovieRecord);
    },
    async getById(id: string) {
      const row = await sqliteHelpers.get<SqliteRow>(
        db,
        `
        SELECT id, titulo, diretor, ano, genero, nota_pessoal, criado_em, atualizado_em
        FROM movies WHERE id = ?;
        `,
        [Number(id)]
      );

      return row ? toMovieRecord(row) : null;
    },
    async create(payload: MoviePayload) {
      const result = await sqliteHelpers.run(
        db,
        `
        INSERT INTO movies (titulo, diretor, ano, genero, nota_pessoal, criado_em, atualizado_em)
        VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'));
        `,
        [payload.titulo, payload.diretor, payload.ano, payload.genero, payload.notaPessoal ?? null]
      );

      const created = await service.getById(result.lastID.toString());
      if (!created) {
        throw new Error('Falha ao criar filme.');
      }
      return created;
    },
    async update(id: string, payload: MovieUpdatePayload) {
      const result = await sqliteHelpers.run(
        db,
        `
        UPDATE movies
        SET
          titulo = COALESCE(?, titulo),
          diretor = COALESCE(?, diretor),
          ano = COALESCE(?, ano),
          genero = COALESCE(?, genero),
          nota_pessoal = CASE WHEN ? IS NULL THEN nota_pessoal ELSE ? END,
          atualizado_em = datetime('now')
        WHERE id = ?;
        `,
        [
          payload.titulo ?? null,
          payload.diretor ?? null,
          payload.ano ?? null,
          payload.genero ?? null,
          payload.notaPessoal ?? null,
          payload.notaPessoal ?? null,
          Number(id)
        ]
      );

      if (result.changes === 0) {
        throw new Error('Filme não encontrado.');
      }

      const updated = await service.getById(id);
      if (!updated) {
        throw new Error('Falha ao carregar filme atualizado.');
      }

      return updated;
    },
    async remove(id: string) {
      const result = await sqliteHelpers.run(
        db,
        `DELETE FROM movies WHERE id = ?;`,
        [Number(id)]
      );

      if (result.changes === 0) {
        throw new Error('Filme não encontrado.');
      }
    }
  };

  return service;
}

