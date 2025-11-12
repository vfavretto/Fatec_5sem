import 'dotenv/config';
import app from './app';

const port = Number(process.env.PORT ?? 3333);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});

process.on('unhandledRejection', (reason) => {
  console.error('Rejeição não tratada:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Exceção não tratada:', error);
});

