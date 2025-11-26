import { connectMongo } from '../database/mongo';
import { MongoMovieModel } from '../models/MongoMovie';
import { MoviePayload, MovieRecord, MovieUpdatePayload } from '../schemas/movieSchema';
import { MovieService } from './movieTypes';

function toMovieRecord(document: any): MovieRecord {
  return {
    id: document._id.toString(),
    titulo: document.titulo,
    diretor: document.diretor,
    ano: document.ano,
    genero: document.genero,
    notaPessoal: document.notaPessoal,
    criadoEm: document.criadoEm?.toISOString?.() ?? document.criadoEm,
    atualizadoEm: document.atualizadoEm?.toISOString?.() ?? document.atualizadoEm
  };
}

export async function createMongoMovieService(): Promise<MovieService> {
  await connectMongo(process.env.MONGO_URI);

  return {
    async list() {
      const docs = await MongoMovieModel.find().sort({ titulo: 1 }).lean();
      return docs.map(toMovieRecord);
    },
    async getById(id: string) {
      const doc = await MongoMovieModel.findById(id).lean();
      return doc ? toMovieRecord(doc) : null;
    },
    async create(payload: MoviePayload) {
      const created = await MongoMovieModel.create(payload);
      return toMovieRecord(created.toObject());
    },
    async update(id: string, payload: MovieUpdatePayload) {
      const updated = await MongoMovieModel.findByIdAndUpdate(
        id,
        { ...payload },
        { new: true, runValidators: true }
      ).lean();

      if (!updated) {
        throw new Error('Filme não encontrado.');
      }

      return toMovieRecord(updated);
    },
    async remove(id: string) {
      const result = await MongoMovieModel.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Filme não encontrado.');
      }
    }
  };
}

