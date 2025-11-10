import { Request, Response } from "express";
import { sendPaginatedResponse, sendResponse } from "../../common/response";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from "./product.service";

export const createProductHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return;
  }

  const product = await createProduct({
    ...req.body,
    userId: req.user.userId,
  });
  return sendResponse(res, 201, "Product created successfully", product);
};

export const updateProductHandler = async (req: Request, res: Response) => {
  const product = await updateProduct(req.params.id, req.body);
  return sendResponse(res, 200, "Product updated successfully", product);
};

export const deleteProductHandler = async (req: Request, res: Response) => {
  await deleteProduct(req.params.id);
  return sendResponse(res, 200, "Product deleted successfully", { id: req.params.id });
};

export const getProductHandler = async (req: Request, res: Response) => {
  const product = await getProductById(req.params.id);
  return sendResponse(res, 200, "Product retrieved successfully", product);
};

export const listProductsHandler = async (req: Request, res: Response) => {
  const { page, pageSize, search } = req.query as unknown as {
    page: number;
    pageSize: number;
    search?: string;
  };

  const { items, total } = await listProducts(page, pageSize, search);
  return sendPaginatedResponse(
    res,
    200,
    "Products retrieved successfully",
    items,
    page,
    pageSize,
    total,
  );
};

