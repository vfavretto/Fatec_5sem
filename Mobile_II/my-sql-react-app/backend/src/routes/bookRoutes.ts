import { Router, Request, Response, NextFunction } from 'express';
import {
  bookPayloadSchema,
  bookUpdateSchema
} from '../schemas/bookSchema';
import { getBookService, normalizeDriver } from '../services/bookServiceFactory';
import { BookService, DatabaseDriver } from '../services/types';

interface BookRequest extends Request {
  bookService?: BookService;
  dbDriver?: DatabaseDriver;
}

function getDriverParam(req: Request) {
  const param = req.query.db;
  if (Array.isArray(param)) {
    const value = param[0];
    return typeof value === 'string' ? value : undefined;
  }
  return typeof param === 'string' ? param : undefined;
}

async function attachService(req: BookRequest, _res: Response, next: NextFunction) {
  try {
    const driverParam = getDriverParam(req);
    req.dbDriver = normalizeDriver(driverParam);
    req.bookService = await getBookService(req.dbDriver);
    next();
  } catch (error) {
    next(error);
  }
}

const asyncHandler =
  (handler: (req: BookRequest, res: Response) => Promise<void>) =>
  (req: BookRequest, res: Response, next: NextFunction) => {
    handler(req, res).catch(next);
  };

const router = Router();

router.use(attachService);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const books = await req.bookService!.list();
    res.json({ data: books, driver: req.dbDriver });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const book = await req.bookService!.getById(req.params.id);
    if (!book) {
      res.status(404).json({ message: 'Livro não encontrado.' });
      return;
    }
    res.json({ data: book, driver: req.dbDriver });
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const payload = bookPayloadSchema.parse(req.body);
      const created = await req.bookService!.create(payload);
      res.status(201).json({ data: created, driver: req.dbDriver });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          message: 'Erro de validação nos dados enviados.',
          issues: error.issues
        });
        return;
      }
      throw error;
    }
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    try {
      const payload = bookUpdateSchema.parse(req.body);
      const updated = await req.bookService!.update(req.params.id, payload);
      res.json({ data: updated, driver: req.dbDriver });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          message: 'Erro de validação nos dados enviados.',
          issues: error.issues
        });
        return;
      }
      if (error.message === 'Livro não encontrado.') {
        res.status(404).json({ message: error.message });
        return;
      }
      throw error;
    }
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    try {
      await req.bookService!.remove(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Livro não encontrado.') {
        res.status(404).json({ message: error.message });
        return;
      }
      throw error;
    }
  })
);

export default router;

