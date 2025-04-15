import { initTRPC } from "@trpc/server";
import { prisma } from "./prisma";
import { z } from "zod";

const t = initTRPC.create({
  isServer: true,
});

export const publicProcedure = t.procedure;
export const router = t.router;

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const createTaskSchema = taskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
const updateTaskSchema = taskSchema
  .omit({ createdAt: true, updatedAt: true })
  .partial();

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
        console.log("Received create task request with input:", input);

        // Validate the input against the schema
        const validatedInput = createTaskSchema.parse(input);
        console.log("Validated input:", validatedInput);

        const task = await prisma.task.create({
          data: {
            title: validatedInput.title,
            description: validatedInput.description,
            status: validatedInput.status,
            userId: validatedInput.userId,
          },
        });
        console.log("Successfully created task:", task);
        return task;
      } catch (error) {
        console.error("Error creating task:", error);
        if (error instanceof z.ZodError) {
          console.error("Validation errors:", error.errors);
        }
        throw error;
      }
    }),

  update: publicProcedure
    .input(updateTaskSchema)
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
