import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server";
import * as trpc from "@trpc/server";
import {
  findUserByEmail,
  validatePassword,
} from "../../../server/services/user.service";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        // try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };
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

          return user;
      },
    }),
    // ...add more providers here
  ],
  jwt: {
    secret: env.NEXTAUTH_SECRET,
    maxAge: 3000,
  },
  session: {
    strategy: "jwt",
    maxAge: 3000,
  },
  pages: {
    signIn: "/",
    newUser: "/sign-up"
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
