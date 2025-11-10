import { z } from "zod";

export const placeOrderSchema = z.object({
  body: z
    .array(
      z.object({
        productId: z.string().uuid("Invalid productId"),
        quantity: z
          .number()
          .int("quantity must be an integer")
          .min(1, "quantity must be at least 1"),
      }),
    )
    .min(1, "At least one product is required"),
});

