import { Response } from "express";

type BaseResponse<T> = {
  success: boolean;
  message: string;
  object: T | null;
  errors: string[] | null;
};

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null,
  errors: string[] | null = null,
) => {
  const payload: BaseResponse<T> = {
    success: statusCode >= 200 && statusCode < 400,
    message,
    object: data,
    errors,
  };

  return res.status(statusCode).json(payload);
};

export const sendPaginatedResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T[],
  pageNumber: number,
  pageSize: number,
  totalSize: number,
  errors: string[] | null = null,
) => {
  const totalPages = Math.ceil(totalSize / pageSize);

  const payload = {
    success: statusCode >= 200 && statusCode < 400,
    message,
    object: {
      currentPage: pageNumber,
      pageSize,
      totalPages,
      totalProducts: totalSize,
      products: data,
    },
    errors,
  };

  return res.status(statusCode).json(payload);
};

