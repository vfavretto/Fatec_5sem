export type BookStatus = 'lido' | 'planejado';

export interface Book {
  id: string;
  titulo: string;
  autor: string;
  status: BookStatus;
  nota?: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface BookPayload {
  titulo: string;
  autor: string;
  status: BookStatus;
  nota?: number;
}

export type BookUpdatePayload = Partial<BookPayload>;

