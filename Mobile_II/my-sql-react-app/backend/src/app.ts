import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import bookRoutes from './routes/bookRoutes';
import authorRoutes from './routes/authorRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Erro API Livros]', error);

  if (error?.name === 'ValidationError') {
    res.status(400).json({ message: error.message, details: error.errors });
    return;
  }

  res.status(500).json({
    message: 'Erro interno ao processar requisição.',
    detail: error?.message ?? 'Erro não especificado.'
  });
});

export default app;

