import { AuthorPayload, AuthorRecord, AuthorUpdatePayload } from '../schemas/authorSchema';

export interface AuthorService {
  list(): Promise<AuthorRecord[]>;
  getById(id: string): Promise<AuthorRecord | null>;
  create(payload: AuthorPayload): Promise<AuthorRecord>;
  update(id: string, payload: AuthorUpdatePayload): Promise<AuthorRecord>;
  remove(id: string): Promise<void>;
}

