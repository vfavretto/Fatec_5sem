import { BookPayload, BookRecord, BookUpdatePayload } from '../schemas/bookSchema';

export interface BookService {
  list(): Promise<BookRecord[]>;
  getById(id: string): Promise<BookRecord | null>;
  create(payload: BookPayload): Promise<BookRecord>;
  update(id: string, payload: BookUpdatePayload): Promise<BookRecord>;
  remove(id: string): Promise<void>;
}

export type DatabaseDriver = 'sqlite' | 'mongo';

