// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import fetch from "node-fetch";

if (!global.fetch) {
  (global.fetch as any) = fetch;
}

import { protectedExampleRouter } from "./protected-example-router";
import { userRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("question.", protectedExampleRouter)
  .merge("user.", userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
