export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly errors: string[] | null = null,
    message?: string,
  ) {
    super(message ?? "Application error");
    this.name = "AppError";
  }
}

export const badRequest = (message: string, errors?: string[]) =>
  new AppError(400, errors ?? [message], message);

export const unauthorized = (message = "Unauthorized") =>
  new AppError(401, [message], message);

export const forbidden = (message = "Forbidden") => new AppError(403, [message], message);

export const notFound = (message = "Not found") => new AppError(404, [message], message);

