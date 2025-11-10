import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";
import { notFound } from "../../common/errors";
import { env } from "../../config/env";
import { createCache } from "../../config/cache";

const productCache = createCache(env.cacheTtlSeconds);

const toNumber = (value: Prisma.Decimal) => Number(value.toString());

const mapProduct = (product: {
  id: string;
  name: string;
  description: string;
  price: Prisma.Decimal;
  stock: number;
  category: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  ...product,
  price: toNumber(product.price),
});

const buildCacheKey = (page: number, pageSize: number, search: string | undefined) =>
  `products:${page}:${pageSize}:${search ?? ""}`;

const invalidateProductCache = () => {
  productCache.clear();
};

type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  userId: string;
};

type UpdateProductInput = Partial<Omit<CreateProductInput, "userId">>;

export const createProduct = async (input: CreateProductInput) => {
  const product = await prisma.product.create({
    data: {
      name: input.name,
      description: input.description,
      price: new Prisma.Decimal(input.price),
      stock: input.stock,
      category: input.category,
      userId: input.userId,
    },
  });
  invalidateProductCache();
  return mapProduct(product);
};

export const updateProduct = async (productId: string, input: UpdateProductInput) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw notFound("Product not found");
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      ...("price" in input && input.price !== undefined
        ? { price: new Prisma.Decimal(input.price) }
        : {}),
      ...("name" in input ? { name: input.name } : {}),
      ...("description" in input ? { description: input.description } : {}),
      ...("stock" in input ? { stock: input.stock } : {}),
      ...("category" in input ? { category: input.category } : {}),
    },
  });
  invalidateProductCache();
  return mapProduct(updated);
};

export const deleteProduct = async (productId: string) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw notFound("Product not found");
  }

  await prisma.product.delete({ where: { id: productId } });
  invalidateProductCache();
};

export const getProductById = async (productId: string) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw notFound("Product not found");
  }

  return mapProduct(product);
};

export const listProducts = async (
  page: number,
  pageSize: number,
  search?: string,
) => {
  const cacheKey = buildCacheKey(page, pageSize, search);
  const cached = productCache.get<{
    items: ReturnType<typeof mapProduct>[];
    total: number;
  }>(cacheKey);
  if (cached) {
    return cached;
  }

  const where: Prisma.ProductWhereInput = search
    ? {
        name: {
          contains: search,
        },
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  const mapped = items.map(mapProduct);
  productCache.set(cacheKey, { items: mapped, total });
  return { items: mapped, total };
};

export const invalidateProductsCache = () => invalidateProductCache();

