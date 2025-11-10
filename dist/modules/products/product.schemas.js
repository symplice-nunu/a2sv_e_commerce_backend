"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProductsSchema = exports.productIdParamSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
const nameSchema = zod_1.z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name must be at most 100 characters long");
const descriptionSchema = zod_1.z
    .string()
    .min(10, "Description must be at least 10 characters long");
const priceSchema = zod_1.z.number().positive("Price must be greater than 0");
const stockSchema = zod_1.z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative");
const categorySchema = zod_1.z
    .string()
    .min(1, "Category must not be empty")
    .max(100, "Category must be at most 100 characters long");
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: nameSchema,
        description: descriptionSchema,
        price: priceSchema,
        stock: stockSchema,
        category: categorySchema,
    }),
});
exports.updateProductSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: nameSchema.optional(),
        description: descriptionSchema.optional(),
        price: priceSchema.optional(),
        stock: stockSchema.optional(),
        category: categorySchema.optional(),
    })
        .refine((data) => Object.keys(data).length > 0, "At least one field must be provided for update"),
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid product id"),
    }),
});
exports.productIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid product id"),
    }),
});
exports.listProductsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z
            .string()
            .optional()
            .transform((val) => (val ? Number(val) : 1))
            .pipe(zod_1.z.number().int().min(1, "Page must be at least 1")),
        pageSize: zod_1.z
            .string()
            .optional()
            .transform((val) => (val ? Number(val) : 10))
            .pipe(zod_1.z.number().int().min(1, "pageSize must be at least 1").max(100, "pageSize too large")),
        search: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=product.schemas.js.map