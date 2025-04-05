import { publicProcedure, router } from "./server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
const appRouter = router({
  // ...
  userList: publicProcedure.query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    const users = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
    ];
    return users;
  }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);
