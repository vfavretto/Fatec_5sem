import { useCallback, useEffect, useMemo, useState } from 'react';
import { createMovie, deleteMovie, listMovies, updateMovie } from '../api/movies';
import { Movie, MoviePayload } from '../types/movie';
import { DatabaseDriver } from '../types/database';

type UseMoviesResult = {
  movies: Movie[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refresh(): Promise<void>;
  addMovie(payload: MoviePayload): Promise<void>;
  editMovie(id: string, payload: MoviePayload): Promise<void>;
  removeMovie(id: string): Promise<void>;
};

export function useMovies(driver: DatabaseDriver | null): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async () => {
    if (!driver) {
      setMovies([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await listMovies(driver);
      setMovies(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar filmes', err);
      setError('Não foi possível carregar os filmes.');
    } finally {
      setIsLoading(false);
    }
  }, [driver]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const refresh = useCallback(async () => {
    await fetchMovies();
  }, [fetchMovies]);

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
        await fetchMovies();
      } catch (err) {
        console.error('Erro ao salvar filme', err);
        setError('Não foi possível salvar as alterações.');
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [driver, fetchMovies]
  );

  const addMovie = useCallback(
    async (payload: MoviePayload) => {
      await runMutation(async () => {
        if (!driver) return;
        await createMovie(driver, payload);
      });
    },
    [driver, runMutation]
  );

  const editMovie = useCallback(
    async (id: string, payload: MoviePayload) => {
      await runMutation(async () => {
        if (!driver) return;
        await updateMovie(driver, id, payload);
      });
    },
    [driver, runMutation]
  );

  const removeMovie = useCallback(
    async (id: string) => {
      await runMutation(async () => {
        if (!driver) return;
        await deleteMovie(driver, id);
      });
    },
    [driver, runMutation]
  );

  return useMemo(
    () => ({
      movies,
      isLoading,
      isSaving,
      error,
      refresh,
      addMovie,
      editMovie,
      removeMovie
    }),
    [movies, isLoading, isSaving, error, refresh, addMovie, editMovie, removeMovie]
  );
}

