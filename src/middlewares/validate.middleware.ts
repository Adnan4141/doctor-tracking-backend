import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/apiResponse';

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = (error.issues || []).map((err: any) => ({
          field: Array.isArray(err.path) ? err.path.slice(1).join('.') : err.path,
          message: err.message,
        }));
        next(new ApiError(400, 'Validation Error', formattedErrors));
      } else {
        next(error);
      }
    }
  };
