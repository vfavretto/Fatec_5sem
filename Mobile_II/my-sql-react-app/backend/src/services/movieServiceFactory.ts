import { createMongoMovieService } from './mongoMovieService';
import { createSqliteMovieService } from './sqliteMovieService';
import { MovieService, DatabaseDriver } from './movieTypes';

let sqliteService: Promise<MovieService> | null = null;
let mongoService: Promise<MovieService> | null = null;

function normalizeDriver(input?: string): DatabaseDriver {
  if (input?.toLowerCase() === 'mongo') {
    return 'mongo';
  }
  return 'sqlite';
}

export async function getMovieService(driver?: string): Promise<MovieService> {
  const normalized = normalizeDriver(driver);

  if (normalized === 'mongo') {
    if (!mongoService) {
      mongoService = createMongoMovieService();
    }
    return mongoService;
  }

  if (!sqliteService) {
    sqliteService = createSqliteMovieService();
  }

  return sqliteService;
}

export { normalizeDriver };

