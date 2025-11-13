import { useCallback, useEffect, useMemo, useState } from 'react';
import { createAuthor, deleteAuthor, listAuthors, updateAuthor } from '../api/authors';
import { Author, AuthorPayload } from '../types/author';
import { DatabaseDriver } from '../types/database';

type UseAuthorsResult = {
  authors: Author[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refresh(): Promise<void>;
  addAuthor(payload: AuthorPayload): Promise<void>;
  editAuthor(id: string, payload: AuthorPayload): Promise<void>;
  removeAuthor(id: string): Promise<void>;
};

export function useAuthors(driver: DatabaseDriver | null): UseAuthorsResult {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthors = useCallback(async () => {
    if (!driver) {
      setAuthors([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await listAuthors(driver);
      setAuthors(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar autores', err);
      setError('Não foi possível carregar os autores.');
    } finally {
      setIsLoading(false);
    }
  }, [driver]);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  const refresh = useCallback(async () => {
    await fetchAuthors();
  }, [fetchAuthors]);

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
        await fetchAuthors();
      } catch (err) {
        console.error('Erro ao salvar autor', err);
        setError('Não foi possível salvar as alterações.');
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [driver, fetchAuthors]
  );

  const addAuthor = useCallback(
    async (payload: AuthorPayload) => {
      await runMutation(async () => {
        if (!driver) return;
        await createAuthor(driver, payload);
      });
    },
    [driver, runMutation]
  );

  const editAuthor = useCallback(
    async (id: string, payload: AuthorPayload) => {
      await runMutation(async () => {
        if (!driver) return;
        await updateAuthor(driver, id, payload);
      });
    },
    [driver, runMutation]
  );

  const removeAuthor = useCallback(
    async (id: string) => {
      await runMutation(async () => {
        if (!driver) return;
        await deleteAuthor(driver, id);
      });
    },
    [driver, runMutation]
  );

  return useMemo(
    () => ({
      authors,
      isLoading,
      isSaving,
      error,
      refresh,
      addAuthor,
      editAuthor,
      removeAuthor
    }),
    [authors, isLoading, isSaving, error, refresh, addAuthor, editAuthor, removeAuthor]
  );
}

