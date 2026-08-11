import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiResponse';
import { ENV } from '../config/env.config';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || undefined;

  if (ENV.NODE_ENV === 'development' && statusCode === 500) {
    console.error('Unhandled Error:', err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(ENV.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
