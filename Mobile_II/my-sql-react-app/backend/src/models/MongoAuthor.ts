import { Schema, model, models } from 'mongoose';

const authorSchema = new Schema(
  {
    nome: { type: String, required: true, trim: true },
    biografia: { type: String, trim: true },
    nacionalidade: { type: String, trim: true },
    anoNascimento: { type: Number, min: 1000 }
  },
  {
    timestamps: { createdAt: 'criadoEm', updatedAt: 'atualizadoEm' },
    versionKey: false
  }
);

export const MongoAuthorModel =
  models.MongoAuthor ?? model('MongoAuthor', authorSchema);

