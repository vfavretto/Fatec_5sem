export interface Author {
  id: string;
  nome: string;
  biografia?: string;
  nacionalidade?: string;
  anoNascimento?: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface AuthorPayload {
  nome: string;
  biografia?: string;
  nacionalidade?: string;
  anoNascimento?: number;
}

export type AuthorUpdatePayload = Partial<AuthorPayload>;

