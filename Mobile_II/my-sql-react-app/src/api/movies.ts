import { api } from './client';
import { Movie, MoviePayload, MovieUpdatePayload } from '../types/movie';
import { DatabaseDriver } from '../types/database';

type MovieListResponse = {
  data: Movie[];
  driver: DatabaseDriver;
};

type MovieSingleResponse = {
  data: Movie;
  driver: DatabaseDriver;
};

export async function listMovies(driver: DatabaseDriver): Promise<Movie[]> {
  const response = await api.get<MovieListResponse>('/api/movies', {
    params: { db: driver }
  });
  return response.data.data;
}

export async function createMovie(driver: DatabaseDriver, payload: MoviePayload): Promise<Movie> {
  const response = await api.post<MovieSingleResponse>('/api/movies', payload, {
    params: { db: driver }
  });
  return response.data.data;
}

export async function updateMovie(
  driver: DatabaseDriver,
  id: string,
  payload: MovieUpdatePayload
): Promise<Movie> {
  const response = await api.put<MovieSingleResponse>(`/api/movies/${id}`, payload, {
    params: { db: driver }
  });
  return response.data.data;
}

export async function deleteMovie(driver: DatabaseDriver, id: string): Promise<void> {
  await api.delete(`/api/movies/${id}`, {
    params: { db: driver }
  });
}

