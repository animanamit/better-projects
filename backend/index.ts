import { publicProcedure, router } from "./trpc";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { z } from "zod";

const appRouter = router({
  greeting: publicProcedure.query(() => "hello tRPC v10!"),
  notifications: publicProcedure
    // This validates the input data using zod
    .input(
      z.object({
        message: z.string(),
        type: z.enum(["success", "error", "info", "warning"]).default("info"),
      })
    )
    // This defines what happens when the procedure is called
    .mutation(({ input }) => {
      // Here you would typically:
      // 1. Store the notification in a database
      // 2. Send it to the client via WebSockets (for real-time)

      // For now, we just return a response
      return {
        success: true,
        message: input.message,
      };
    }),
});

// Export only the type of a router!
export type AppRouter = typeof appRouter;

// Create an Express app
const app = express();

// Enable CORS
app.use(cors({ origin: "http://localhost:5174" })); // Allow requests from the frontend

// Add the tRPC middleware to the Express app
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
  })
);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
