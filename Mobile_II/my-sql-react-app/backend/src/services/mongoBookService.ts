import { connectMongo } from '../database/mongo';
import { MongoBookModel } from '../models/MongoBook';
import { BookPayload, BookRecord, BookUpdatePayload } from '../schemas/bookSchema';
import { BookService } from './types';

function toBookRecord(document: any): BookRecord {
  return {
    id: document._id.toString(),
    titulo: document.titulo,
    autor: document.autor,
    status: document.status,
    nota: typeof document.nota === 'number' ? document.nota : undefined,
    criadoEm: document.criadoEm?.toISOString?.() ?? document.criadoEm,
    atualizadoEm: document.atualizadoEm?.toISOString?.() ?? document.atualizadoEm
  };
}

export async function createMongoBookService(): Promise<BookService> {
  await connectMongo(process.env.MONGO_URI);

  return {
    async list() {
      const docs = await MongoBookModel.find().sort({ criadoEm: -1 }).lean();
      return docs.map(toBookRecord);
    },
    async getById(id: string) {
      const doc = await MongoBookModel.findById(id).lean();
      return doc ? toBookRecord(doc) : null;
    },
    async create(payload: BookPayload) {
      const created = await MongoBookModel.create(payload);
      return toBookRecord(created.toObject());
    },
    async update(id: string, payload: BookUpdatePayload) {
      const updated = await MongoBookModel.findByIdAndUpdate(
        id,
        { ...payload },
        { new: true, runValidators: true }
      ).lean();

      if (!updated) {
        throw new Error('Livro não encontrado.');
      }

      return toBookRecord(updated);
    },
    async remove(id: string) {
      const result = await MongoBookModel.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Livro não encontrado.');
      }
    }
  };
}

