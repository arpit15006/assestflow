import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { failure } from '../types/api.types';

type ValidateTarget = 'body' | 'query' | 'params';

export const validate = (schema: ZodSchema, target: ValidateTarget = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.') || 'root';
        errors[key] = [...(errors[key] || []), issue.message];
      }
      res.status(400).json(failure('Validation failed', errors));
      return;
    }
    req[target] = result.data;
    next();
  };
};
