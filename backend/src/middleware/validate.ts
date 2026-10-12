import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

export const validate =
  (schema: ZodTypeAny): RequestHandler =>
  (req, _res, next) => {
    const result = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.body = result.body ?? req.body;
    if (result.query) req.query = result.query;
    if (result.params) req.params = result.params;
    next();
  };
