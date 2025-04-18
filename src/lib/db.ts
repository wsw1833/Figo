import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// MongoDB connection URI from environment variables
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/myProject';

// Connection options
const options: mongoose.ConnectOptions = {
  autoIndex: true,
};

class DatabaseConnection {
  private static instance: DatabaseConnection;

  private constructor() {
    // Set up mongoose connection events
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connection established successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB connection disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<typeof mongoose> {
    if (mongoose.connection.readyState === 1) {
      return mongoose;
    }

    try {
      await mongoose.connect(MONGODB_URI, options);
      return mongoose;
    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('MongoDB connection closed');
    }
  }

  public getConnection(): typeof mongoose {
    return mongoose;
  }
}

export default DatabaseConnection;
