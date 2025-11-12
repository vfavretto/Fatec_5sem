import { z } from 'zod';

export const statusEnum = z.enum(['lido', 'planejado']);

export const bookPayloadSchema = z.object({
  titulo: z.string().min(1, 'O título é obrigatório'),
  autor: z.string().min(1, 'O autor é obrigatório'),
  status: statusEnum,
  nota: z
    .number()
    .min(0, 'A nota mínima é 0')
    .max(5, 'A nota máxima é 5')
    .optional()
});

export const bookUpdateSchema = bookPayloadSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'É necessário informar ao menos um campo para atualizar.' }
);

export type BookPayload = z.infer<typeof bookPayloadSchema>;
export type BookUpdatePayload = z.infer<typeof bookUpdateSchema>;
export type BookStatus = z.infer<typeof statusEnum>;

export interface BookRecord extends BookPayload {
  id: string;
  nota?: number;
  criadoEm: string;
  atualizadoEm: string;
}

