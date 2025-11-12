import { useCallback, useEffect, useMemo, useState } from 'react';
import { createBook, deleteBook, listBooks, updateBook } from '../api/books';
import { Book, BookPayload } from '../types/book';
import { DatabaseDriver } from '../types/database';

type UseBooksResult = {
  books: Book[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refresh(): Promise<void>;
  addBook(payload: BookPayload): Promise<void>;
  editBook(id: string, payload: BookPayload): Promise<void>;
  removeBook(id: string): Promise<void>;
};

export function useBooks(driver: DatabaseDriver | null): UseBooksResult {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    if (!driver) {
      setBooks([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await listBooks(driver);
      setBooks(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar livros', err);
      setError('Não foi possível carregar os livros.');
    } finally {
      setIsLoading(false);
    }
  }, [driver]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const refresh = useCallback(async () => {
    await fetchBooks();
  }, [fetchBooks]);

  const runMutation = useCallback(
    async (action: () => Promise<void>) => {
      if (!driver) {
        setError('Selecione um banco de dados antes de continuar.');
        return;
      }
      setIsSaving(true);
      try {
        await action();
        setError(null);
        await fetchBooks();
      } catch (err) {
        console.error('Erro ao salvar livro', err);
        setError('Não foi possível salvar as alterações.');
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [driver, fetchBooks]
  );

  const addBook = useCallback(
    async (payload: BookPayload) => {
      await runMutation(async () => {
        if (!driver) return;
        await createBook(driver, payload);
      });
    },
    [driver, runMutation]
  );

  const editBook = useCallback(
    async (id: string, payload: BookPayload) => {
      await runMutation(async () => {
        if (!driver) return;
        await updateBook(driver, id, payload);
      });
    },
    [driver, runMutation]
  );

  const removeBook = useCallback(
    async (id: string) => {
      await runMutation(async () => {
        if (!driver) return;
        await deleteBook(driver, id);
      });
    },
    [driver, runMutation]
  );

  return useMemo(
    () => ({
      books,
      isLoading,
      isSaving,
      error,
      refresh,
      addBook,
      editBook,
      removeBook
    }),
    [books, isLoading, isSaving, error, refresh, addBook, editBook, removeBook]
  );
}

