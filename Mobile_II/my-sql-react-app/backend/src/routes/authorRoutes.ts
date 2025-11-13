import { Router, Request, Response, NextFunction } from 'express';
import {
  authorPayloadSchema,
  authorUpdateSchema
} from '../schemas/authorSchema';
import { getAuthorService } from '../services/authorServiceFactory';
import { normalizeDriver } from '../services/bookServiceFactory';
import { AuthorService, DatabaseDriver } from '../services/authorTypes';

interface AuthorRequest extends Request {
  authorService?: AuthorService;
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

async function attachService(req: AuthorRequest, _res: Response, next: NextFunction) {
  try {
    const driverParam = getDriverParam(req);
    req.dbDriver = normalizeDriver(driverParam);
    req.authorService = await getAuthorService(req.dbDriver);
    next();
  } catch (error) {
    next(error);
  }
}

const asyncHandler =
  (handler: (req: AuthorRequest, res: Response) => Promise<void>) =>
  (req: AuthorRequest, res: Response, next: NextFunction) => {
    handler(req, res).catch(next);
  };

const router = Router();

router.use(attachService);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const authors = await req.authorService!.list();
    res.json({ data: authors, driver: req.dbDriver });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const author = await req.authorService!.getById(req.params.id);
    if (!author) {
      res.status(404).json({ message: 'Autor não encontrado.' });
      return;
    }
    res.json({ data: author, driver: req.dbDriver });
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const payload = authorPayloadSchema.parse(req.body);
      const created = await req.authorService!.create(payload);
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
      const payload = authorUpdateSchema.parse(req.body);
      const updated = await req.authorService!.update(req.params.id, payload);
      res.json({ data: updated, driver: req.dbDriver });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          message: 'Erro de validação nos dados enviados.',
          issues: error.issues
        });
        return;
      }
      if (error.message === 'Autor não encontrado.') {
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
      await req.authorService!.remove(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Autor não encontrado.') {
        res.status(404).json({ message: error.message });
        return;
      }
      throw error;
    }
  })
);

export default router;

