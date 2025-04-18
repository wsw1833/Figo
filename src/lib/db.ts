import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { NextRequest, NextResponse } from 'next/server';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

// Main database connection function
async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('connected to MongoDB');
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// CORS middleware function
export function corsMiddleware(
  req: NextRequest
): Record<string, string> | NextResponse {
  // Define allowed origins - update with your actual domains
  const allowedOrigins = ['http://localhost:3000', 'https://yourdomain.com'];

  const origin = req.headers.get('origin');

  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // If origin exists and is in allowed list, add it to headers
  if (origin && allowedOrigins.includes(origin)) {
    Object.assign(corsHeaders, {
      'Access-Control-Allow-Origin': origin,
    });
  } else {
    // For public APIs you might want to allow any origin
    // Object.assign(corsHeaders, {
    //   'Access-Control-Allow-Origin': '*'
    // });
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  return corsHeaders;
}

export default dbConnect;
