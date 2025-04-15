import { initTRPC } from "@trpc/server";
import { prisma } from "./prisma";
import { z } from "zod";

const t = initTRPC.create({
  isServer: true,
});

export const publicProcedure = t.procedure;
export const router = t.router;

// Simplified schema that matches frontend exactly
const createTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  userId: z.string(),
});

export const appRouter = router({
  getAll: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const tasks = await prisma.task.findMany({
          where: { userId: input.userId },
          orderBy: { createdAt: "desc" },
        });
        return tasks;
      } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const task = await prisma.task.findUnique({
          where: { id: input.id },
        });
        return task;
      } catch (error) {
        console.error("Error fetching task:", error);
        throw error;
      }
    }),

  create: publicProcedure
    .input(createTaskSchema)
    .mutation(async ({ input }) => {
      try {
        console.log("Raw input received:", input);
        console.log("Input type:", typeof input);
        console.log("Input keys:", Object.keys(input));

        const task = await prisma.task.create({
          data: {
            title: input.title,
            description: input.description,
            userId: input.userId,
            status: "todo", // Set default status here
          },
        });
        console.log("Successfully created task:", task);
        return task;
      } catch (error) {
        console.error("Error creating task:", error);
        if (error instanceof z.ZodError) {
          console.error("Validation errors:", error.errors);
          throw new Error(
            `Validation error: ${error.errors.map((e) => e.message).join(", ")}`
          );
        }
        if (error instanceof Error) {
          throw new Error(`Failed to create task: ${error.message}`);
        }
        throw new Error("Failed to create task");
      }
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["todo", "in_progress", "done"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;
        const task = await prisma.task.update({
          where: { id },
          data,
        });
        return task;
      } catch (error) {
        console.error("Error updating task:", error);
        throw error;
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await prisma.task.delete({
          where: { id: input.id },
        });
        return { success: true };
      } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
      }
    }),
});

export type AppRouter = typeof appRouter;
