export interface Movie {
  id: string;
  titulo: string;
  diretor: string;
  ano: number;
  genero: string;
  notaPessoal?: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface MoviePayload {
  titulo: string;
  diretor: string;
  ano: number;
  genero: string;
  notaPessoal?: number;
}

export type MovieUpdatePayload = Partial<MoviePayload>;

export interface MovieService {
  list(): Promise<Movie[]>;
  getById(id: string): Promise<Movie | null>;
  create(payload: MoviePayload): Promise<Movie>;
  update(id: string, payload: MovieUpdatePayload): Promise<Movie>;
  remove(id: string): Promise<void>;
}

export type DatabaseDriver = 'sqlite' | 'mongo';

