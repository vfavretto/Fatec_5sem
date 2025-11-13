import { connectMongo } from '../database/mongo';
import { MongoAuthorModel } from '../models/MongoAuthor';
import { AuthorPayload, AuthorRecord, AuthorUpdatePayload } from '../schemas/authorSchema';
import { AuthorService } from './authorTypes';

function toAuthorRecord(document: any): AuthorRecord {
  return {
    id: document._id.toString(),
    nome: document.nome,
    biografia: document.biografia,
    nacionalidade: document.nacionalidade,
    anoNascimento: document.anoNascimento,
    criadoEm: document.criadoEm?.toISOString?.() ?? document.criadoEm,
    atualizadoEm: document.atualizadoEm?.toISOString?.() ?? document.atualizadoEm
  };
}

export async function createMongoAuthorService(): Promise<AuthorService> {
  await connectMongo(process.env.MONGO_URI);

  return {
    async list() {
      const docs = await MongoAuthorModel.find().sort({ nome: 1 }).lean();
      return docs.map(toAuthorRecord);
    },
    async getById(id: string) {
      const doc = await MongoAuthorModel.findById(id).lean();
      return doc ? toAuthorRecord(doc) : null;
    },
    async create(payload: AuthorPayload) {
      const created = await MongoAuthorModel.create(payload);
      return toAuthorRecord(created.toObject());
    },
    async update(id: string, payload: AuthorUpdatePayload) {
      const updated = await MongoAuthorModel.findByIdAndUpdate(
        id,
        { ...payload },
        { new: true, runValidators: true }
      ).lean();

      if (!updated) {
        throw new Error('Autor não encontrado.');
      }

      return toAuthorRecord(updated);
    },
    async remove(id: string) {
      const result = await MongoAuthorModel.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Autor não encontrado.');
      }
    }
  };
}

