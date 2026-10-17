import createHttpError from "http-errors";
import prisma from "../../prisma/client.ts";
import { comparePassword, hashPassword } from "./password.service.ts";
import * as tokenService from "./token.service.ts";

export const registerUser = async ({
  username,
  email,
  password,
  name,
}: {
  username: string;
  email: string;
  password: string;
  name: string;
}) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    throw createHttpError(409, "Username or email already taken");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      name,
    },
  });

  const tokens = await tokenService.createTokens(user.id);

  return { user, tokens };
};

export const loginUser = async ({ username, password }: { username: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw createHttpError(401, "Invalid credentials");
  }

  const isPasswordValid: boolean = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw createHttpError(401, "Invalid credentials");
  }

  const tokens = await tokenService.createTokens(user.id);

  return { user, tokens };
};

export const refreshTokens = async (refreshToken: string) => {
  return tokenService.refreshTokens(refreshToken);
};

export const removeRefreshToken = async (userId: number, token: string) => {
  await prisma.refreshToken.deleteMany({
    where: { userId, token },
  });
};

export const findUserById = async (userId: number) => {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
};
