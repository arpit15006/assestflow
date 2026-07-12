import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { prisma } from './config/database';
import { logger } from './lib/logger';
import { errorHandler } from './middleware/errorHandler';
import { socketService } from './services/socketService';
import v1Routes from './routes/v1';

const app = express();
const httpServer = createServer(app);

// Socket.IO Setup
const io = new Server(httpServer, {
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },
});

socketService.init(io);

io.on('connection', (socket) => {
  logger.info({ socketId: socket.id }, 'Client connected to socket');
  
  socket.on('join', (userId: string) => {
    socket.join(`user:${userId}`);
    logger.debug({ userId, socketId: socket.id }, 'Socket joined room');
  });

  socket.on('disconnect', () => {
    logger.info({ socketId: socket.id }, 'Client disconnected from socket');
  });
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${Date.now() - start}ms`,
    }, 'HTTP Request');
  });
  next();
});

// Routes
app.use('/api/v1', v1Routes);

// Health Route
app.get('/health', async (req, res) => {
  try {
    // Basic query to check DB
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      version: '1.0.0',
      uptime: process.uptime(),
      database: 'connected',
      timestamp: new Date(),
    });
  } catch (err) {
    logger.error({ err }, 'Health check failed');
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date(),
    });
  }
});

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = env.PORT;
  httpServer.listen(PORT, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });
}

export default app;
