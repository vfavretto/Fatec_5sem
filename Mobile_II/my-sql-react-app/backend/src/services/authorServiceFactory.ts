import { createMongoAuthorService } from './mongoAuthorService';
import { createSqliteAuthorService } from './sqliteAuthorService';
import { AuthorService } from './authorTypes';
import { DatabaseDriver } from './types';

let sqliteService: Promise<AuthorService> | null = null;
let mongoService: Promise<AuthorService> | null = null;

export async function getAuthorService(driver: DatabaseDriver): Promise<AuthorService> {
  if (driver === 'mongo') {
    if (!mongoService) {
      mongoService = createMongoAuthorService();
    }
    return mongoService;
  }

  if (!sqliteService) {
    sqliteService = createSqliteAuthorService();
  }

  return sqliteService;
}

