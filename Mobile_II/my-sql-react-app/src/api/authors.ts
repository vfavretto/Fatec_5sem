import { api } from './client';
import { Author, AuthorPayload, AuthorUpdatePayload } from '../types/author';
import { DatabaseDriver } from '../types/database';

type AuthorListResponse = {
  data: Author[];
  driver: DatabaseDriver;
};

type AuthorSingleResponse = {
  data: Author;
  driver: DatabaseDriver;
};

export async function listAuthors(driver: DatabaseDriver): Promise<Author[]> {
  const response = await api.get<AuthorListResponse>('/api/authors', {
    params: { db: driver }
  });
  return response.data.data;
}

export async function createAuthor(driver: DatabaseDriver, payload: AuthorPayload): Promise<Author> {
  const response = await api.post<AuthorSingleResponse>('/api/authors', payload, {
    params: { db: driver }
  });
  return response.data.data;
}

export async function updateAuthor(
  driver: DatabaseDriver,
  id: string,
  payload: AuthorUpdatePayload
): Promise<Author> {
  const response = await api.put<AuthorSingleResponse>(`/api/authors/${id}`, payload, {
    params: { db: driver }
  });
  return response.data.data;
}

export async function deleteAuthor(driver: DatabaseDriver, id: string): Promise<void> {
  await api.delete(`/api/authors/${id}`, {
    params: { db: driver }
  });
}

