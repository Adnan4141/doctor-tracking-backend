import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.config';
import { apiLimiter } from './middlewares/rateLimiter.middleware';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import doctorRoutes from './modules/doctors/doctor.routes';
import patientRoutes from './modules/patients/patient.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import { ApiError } from './utils/apiResponse';

const app: Application = express();

app.set('trust proxy', 1);

app.use(helmet());

const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:3005',
  'http://localhost:4000',
  'http://localhost:4005',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3005',
  'http://127.0.0.1:4000',
  'http://127.0.0.1:4005',
];

const configuredOrigins = ENV.CLIENT_URL
  ? ENV.CLIENT_URL.split(',').map((url) => url.trim())
  : [];

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...configuredOrigins]));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

// Root and Health check endpoints
app.get(['/', '/api', '/health'], (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Doctor Tracker API is working smoothly',
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Catch 404
app.use((_req: Request, _res: Response, next) => {
  next(new ApiError(404, 'Route not found'));
});

// Global Error Handler
app.use(errorHandler);

export default app;
