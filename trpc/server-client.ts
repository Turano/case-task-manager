import { createTRPCClient, httpBatchLink } from "@trpc/client";

import type { AppRouter } from "./routers/_app";

function getUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/trpc`;
  }

  return "http://localhost:3000/api/trpc";
}

export const serverTRPC = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getUrl(),
    }),
  ],
});
