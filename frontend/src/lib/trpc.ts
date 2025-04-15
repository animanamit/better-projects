import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../backend/src/trpc";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc",
      fetch(url, options) {
        return fetch(url, {
          ...options,
          // DO NOT ADD CONTENT TYPE HEADER, SOME ERROR WITH TRPC CURRENTLY
        }).then(async (response) => {
          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Something went wrong");
          }
          return response;
        });
      },
    }),
  ],
});
