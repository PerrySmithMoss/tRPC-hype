import { CreateUserInput } from "../../schema/user.schema";
import { prisma } from "../db/client";
import { hash } from "argon2";
import argon2 from "argon2";

export async function createUser(user: CreateUserInput) {
  const { firstName, lastName, username, email, password } = user;

  const hashedPassword = await hash(password);

  return await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hashedPassword,
    },
  });
}

export async function findUserByEmail(
  email: string,
  includeRelations: boolean
) {
  if (includeRelations === true) {
    return await prisma.user.findUnique({
      where: { email: email },
    });
  } else {
    return await prisma.user.findUnique({
      where: { email: email },
    });
  }
}

export async function validatePassword(
  userPassword: string,
  userInput: string
) {
  return await argon2.verify(userPassword, userInput);
}
