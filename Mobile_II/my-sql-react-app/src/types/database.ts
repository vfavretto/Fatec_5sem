export type DatabaseDriver = 'mongo' | 'sqlite';

export const DATABASE_OPTIONS: Array<{
  key: DatabaseDriver;
  label: string;
  description: string;
}> = [
  {
    key: 'mongo',
    label: 'MongoDB',
    description: 'Ideal para sincronizar na nuvem e compartilhar dados.'
  },
  {
    key: 'sqlite',
    label: 'SQLite',
    description: 'Armazenamento local simples, prático para testes rápidos.'
  }
];

