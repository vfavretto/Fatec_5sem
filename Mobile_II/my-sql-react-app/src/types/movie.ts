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

