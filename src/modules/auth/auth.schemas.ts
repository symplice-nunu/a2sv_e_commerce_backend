import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric")
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must be at most 30 characters long"),
    email: z
      .string()
      .email("Email must be a valid email address")
      .max(255, "Email must be at most 255 characters long"),
    password: z
      .string()
      .regex(
        passwordRegex,
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      ),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email must be a valid email address"),
    password: z.string().min(1, "Password must not be empty"),
  }),
});

