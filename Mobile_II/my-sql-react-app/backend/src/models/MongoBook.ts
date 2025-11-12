import { Schema, model, models } from 'mongoose';
import { statusEnum } from '../schemas/bookSchema';

const bookSchema = new Schema(
  {
    titulo: { type: String, required: true, trim: true },
    autor: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: statusEnum.options,
      required: true
    },
    nota: { type: Number, min: 0, max: 5 }
  },
  {
    timestamps: { createdAt: 'criadoEm', updatedAt: 'atualizadoEm' },
    versionKey: false
  }
);

export const MongoBookModel =
  models.MongoBook ?? model('MongoBook', bookSchema);

