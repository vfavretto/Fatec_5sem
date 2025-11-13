import { z } from 'zod';

export const authorPayloadSchema = z.object({
  nome: z.string().min(1, 'O nome do autor é obrigatório'),
  biografia: z.string().optional(),
  nacionalidade: z.string().optional(),
  anoNascimento: z
    .number()
    .int()
    .min(1000, 'Ano de nascimento inválido')
    .max(new Date().getFullYear(), 'Ano de nascimento não pode ser no futuro')
    .optional()
});

export const authorUpdateSchema = authorPayloadSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'É necessário informar ao menos um campo para atualizar.' }
);

export type AuthorPayload = z.infer<typeof authorPayloadSchema>;
export type AuthorUpdatePayload = z.infer<typeof authorUpdateSchema>;

export interface AuthorRecord extends AuthorPayload {
  id: string;
  biografia?: string;
  nacionalidade?: string;
  anoNascimento?: number;
  criadoEm: string;
  atualizadoEm: string;
}

