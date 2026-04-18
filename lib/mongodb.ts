import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

let cached = (global as any).mongoose;
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Allows multiple concurrent requests
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;