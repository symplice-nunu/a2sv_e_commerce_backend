import { z } from "zod";

const nameSchema = z
  .string()
  .min(3, "Name must be at least 3 characters long")
  .max(100, "Name must be at most 100 characters long");

const descriptionSchema = z
  .string()
  .min(10, "Description must be at least 10 characters long");

const priceSchema = z.number().positive("Price must be greater than 0");

const stockSchema = z
  .number()
  .int("Stock must be an integer")
  .min(0, "Stock cannot be negative");

const categorySchema = z
  .string()
  .min(1, "Category must not be empty")
  .max(100, "Category must be at most 100 characters long");

export const createProductSchema = z.object({
  body: z.object({
    name: nameSchema,
    description: descriptionSchema,
    price: priceSchema,
    stock: stockSchema,
    category: categorySchema,
  }),
});

export const updateProductSchema = z.object({
  body: z
    .object({
      name: nameSchema.optional(),
      description: descriptionSchema.optional(),
      price: priceSchema.optional(),
      stock: stockSchema.optional(),
      category: categorySchema.optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "At least one field must be provided for update",
    ),
  params: z.object({
    id: z.string().uuid("Invalid product id"),
  }),
});

export const productIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product id"),
  }),
});

export const listProductsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 1))
      .pipe(z.number().int().min(1, "Page must be at least 1")),
    pageSize: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 10))
      .pipe(z.number().int().min(1, "pageSize must be at least 1").max(100, "pageSize too large")),
    search: z.string().optional(),
  }),
});

