import "server-only";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache } from "react";

import { createCallerFactory, createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  router: appRouter,
  queryClient: getQueryClient,
  ctx: async () => {
    return createTRPCContext({
      headers: await headers(),
    });
  },
});

const createCaller = createCallerFactory(appRouter);

export const getServerTRPC = cache(async () => {
  return createCaller(
    createTRPCContext({
      headers: await headers(),
    }),
  );
});
