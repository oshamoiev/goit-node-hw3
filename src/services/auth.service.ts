import createHttpError from "http-errors";
import prisma from "../../prisma/client.ts";
import { hashPassword } from "./password.service.ts";
import { createTokens } from "./token.service.ts";

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

  const tokens = await createTokens(user.id);

  return { user, tokens };
};
