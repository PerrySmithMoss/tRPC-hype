import { createRouter } from "./context";
import * as trpc from "@trpc/server";
import { createUserSchema, loginUserSchema } from "../../schema/user.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {
  createUser,
  findUserByEmail,
  validatePassword,
} from "../services/user.service";

export const userRouter = createRouter()
  .mutation("register-user", {
    input: createUserSchema,
    // output: createUserOutput,
    async resolve({ input }) {
      try {
        const user = await createUser(input);

        return user;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
          throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      }
    },
  })
  .mutation("login-user", {
    input: loginUserSchema,
    async resolve({ input }) {
      const { email, password } = input;

      const user = await findUserByEmail(email, false);

      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "The email or password provided is incorrect.",
        });
      }

      const isValidUser = await validatePassword(user.password, password);

      if (!isValidUser) {
        throw new trpc.TRPCError({
          code: "BAD_REQUEST",
          message: "The email or password provided is incorrect.",
        });
      }

      return user
    },
  });
