import { Role } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";
import { badRequest, unauthorized } from "../../common/errors";
import { hashPassword, comparePassword } from "../../utils/password";
import { signJwt } from "../../utils/jwt";

type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export const registerUser = async ({ username, email, password }: RegisterInput) => {
  const [existingEmail, existingUsername] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.user.findUnique({ where: { username } }),
  ]);

  if (existingEmail) {
    throw badRequest("Email already registered", ["Email already in use"]);
  }

  if (existingUsername) {
    throw badRequest("Username already taken", ["Username already in use"]);
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: passwordHash,
      role: Role.USER,
    },
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw unauthorized("Invalid credentials");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw unauthorized("Invalid credentials");
  }

  const token = signJwt({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

