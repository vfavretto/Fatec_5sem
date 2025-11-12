import { api } from './client';
import { Book, BookPayload, BookUpdatePayload } from '../types/book';
import { DatabaseDriver } from '../types/database';

type BookListResponse = {
  data: Book[];
  driver: DatabaseDriver;
};

type BookSingleResponse = {
  data: Book;
  driver: DatabaseDriver;
};

export async function listBooks(driver: DatabaseDriver): Promise<Book[]> {
  const response = await api.get<BookListResponse>('/api/books', {
    params: { db: driver }
  });
  return response.data.data;
}

export async function createBook(driver: DatabaseDriver, payload: BookPayload): Promise<Book> {
  const response = await api.post<BookSingleResponse>('/api/books', payload, {
    params: { db: driver }
  });
  return response.data.data;
}

export async function updateBook(
  driver: DatabaseDriver,
  id: string,
  payload: BookUpdatePayload
): Promise<Book> {
  const response = await api.put<BookSingleResponse>(`/api/books/${id}`, payload, {
    params: { db: driver }
  });
  return response.data.data;
}

export async function deleteBook(driver: DatabaseDriver, id: string): Promise<void> {
  await api.delete(`/api/books/${id}`, {
    params: { db: driver }
  });
}

