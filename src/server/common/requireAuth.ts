import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";

export const requireAuth =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session =
      ctx.req &&
      ctx.res &&
      (await unstable_getServerSession(ctx.req, ctx.res, nextAuthOptions));

    if (!session) {
      return {
        redirect: {
          destination: "/", // login path
          permanent: false,
        },
      };
    }

    return await func(ctx);
  };
