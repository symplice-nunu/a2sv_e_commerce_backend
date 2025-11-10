import { NextFunction, Request, Response } from "express";
import { ParsedQs } from "qs";
import { ZodSchema } from "zod";
import { badRequest } from "../common/errors";

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      throw badRequest("Validation failed", errors);
    }

  const { body, query, params } = result.data as {
    body?: unknown;
    query?: unknown;
    params?: Record<string, string>;
  };

  if (body !== undefined) {
    req.body = body;
  }

  if (query !== undefined) {
    req.query = query as ParsedQs;
  }

  if (params !== undefined) {
    req.params = params;
  }
    return next();
  };

