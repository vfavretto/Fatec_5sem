import { Router, Request, Response, NextFunction } from 'express';
import {
  moviePayloadSchema,
  movieUpdateSchema
} from '../schemas/movieSchema';
import { getMovieService, normalizeDriver } from '../services/movieServiceFactory';
import { MovieService, DatabaseDriver } from '../services/movieTypes';

interface MovieRequest extends Request {
  movieService?: MovieService;
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

async function attachService(req: MovieRequest, _res: Response, next: NextFunction) {
  try {
    const driverParam = getDriverParam(req);
    req.dbDriver = normalizeDriver(driverParam);
    req.movieService = await getMovieService(req.dbDriver);
    next();
  } catch (error) {
    next(error);
  }
}

const asyncHandler =
  (handler: (req: MovieRequest, res: Response) => Promise<void>) =>
  (req: MovieRequest, res: Response, next: NextFunction) => {
    handler(req, res).catch(next);
  };

const router = Router();

router.use(attachService);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const movies = await req.movieService!.list();
    res.json({ data: movies, driver: req.dbDriver });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const movie = await req.movieService!.getById(req.params.id);
    if (!movie) {
      res.status(404).json({ message: 'Filme não encontrado.' });
      return;
    }
    res.json({ data: movie, driver: req.dbDriver });
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    try {
      const payload = moviePayloadSchema.parse(req.body);
      const created = await req.movieService!.create(payload);
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
      const payload = movieUpdateSchema.parse(req.body);
      const updated = await req.movieService!.update(req.params.id, payload);
      res.json({ data: updated, driver: req.dbDriver });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          message: 'Erro de validação nos dados enviados.',
          issues: error.issues
        });
        return;
      }
      if (error.message === 'Filme não encontrado.') {
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
      await req.movieService!.remove(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Filme não encontrado.') {
        res.status(404).json({ message: error.message });
        return;
      }
      throw error;
    }
  })
);

export default router;

