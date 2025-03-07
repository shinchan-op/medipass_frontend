import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import { rateLimiter } from './middleware/auth';

dotenv.config();

const app = express();

// MongoDB Connection Options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true,
  w: 'majority'
} as mongoose.ConnectOptions;

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medipass';
    console.log(`Connecting to MongoDB in ${process.env.NODE_ENV} mode...`);
    
    await mongoose.connect(mongoURI, mongooseOptions);
    
    console.log('MongoDB Connected Successfully');
    
    // Log when the connection is lost
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB connection lost. Attempting to reconnect...');
    });

    // Log when the connection is reconnected
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Global rate limiter
app.use(rateLimiter());

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
  });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Medipass API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Initialize MongoDB connection before starting the server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`
🚀 Server is running on port ${PORT}
📝 Environment: ${process.env.NODE_ENV}
🔗 Health check: http://localhost:${PORT}/health
📚 API documentation: http://localhost:${PORT}/
      `);
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port or kill the process using this port.`);
        process.exit(1);
      } else {
        console.error('Server error:', error.message);
        process.exit(1);
      }
    });

    // Handle process termination
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed.');
        mongoose.connection.close().then(() => {
          console.log('MongoDB connection closed.');
          process.exit(0);
        });
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 