import { z } from 'zod';

export const moviePayloadSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  diretor: z.string().min(1, 'Diretor é obrigatório'),
  ano: z.number().int().min(1888).max(new Date().getFullYear() + 5),
  genero: z.string().min(1, 'Gênero é obrigatório'),
  notaPessoal: z.number().min(0).max(10).optional()
});

export const movieUpdateSchema = z.object({
  titulo: z.string().min(1).optional(),
  diretor: z.string().min(1).optional(),
  ano: z.number().int().min(1888).max(new Date().getFullYear() + 5).optional(),
  genero: z.string().min(1).optional(),
  notaPessoal: z.number().min(0).max(10).optional()
});

export type MoviePayload = z.infer<typeof moviePayloadSchema>;
export type MovieUpdatePayload = z.infer<typeof movieUpdateSchema>;

export interface MovieRecord {
  id: string;
  titulo: string;
  diretor: string;
  ano: number;
  genero: string;
  notaPessoal?: number;
  criadoEm: string;
  atualizadoEm: string;
}

