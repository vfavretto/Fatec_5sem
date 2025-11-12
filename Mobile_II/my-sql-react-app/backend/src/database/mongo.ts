import mongoose from 'mongoose';

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectMongo(uri?: string) {
  if (!uri) {
    throw new Error('MONGO_URI não está definida no ambiente.');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri);
  }

  await connectionPromise;

  return mongoose;
}

