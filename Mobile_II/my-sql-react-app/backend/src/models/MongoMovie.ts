import { Schema, model } from 'mongoose';

const movieSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    diretor: {
      type: String,
      required: true,
      trim: true
    },
    ano: {
      type: Number,
      required: true,
      min: 1888
    },
    genero: {
      type: String,
      required: true,
      trim: true
    },
    notaPessoal: {
      type: Number,
      min: 0,
      max: 10,
      default: undefined
    }
  },
  {
    timestamps: {
      createdAt: 'criadoEm',
      updatedAt: 'atualizadoEm'
    }
  }
);

export const MongoMovieModel = model('Movie', movieSchema);

