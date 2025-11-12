import { createMongoBookService } from './mongoBookService';
import { createSqliteBookService } from './sqliteBookService';
import { BookService, DatabaseDriver } from './types';

let sqliteService: Promise<BookService> | null = null;
let mongoService: Promise<BookService> | null = null;

function normalizeDriver(input?: string): DatabaseDriver {
  if (input?.toLowerCase() === 'mongo') {
    return 'mongo';
  }
  return 'sqlite';
}

export async function getBookService(driver?: string): Promise<BookService> {
  const normalized = normalizeDriver(driver);

  if (normalized === 'mongo') {
    if (!mongoService) {
      mongoService = createMongoBookService();
    }
    return mongoService;
  }

  if (!sqliteService) {
    sqliteService = createSqliteBookService();
  }

  return sqliteService;
}

export { normalizeDriver };

