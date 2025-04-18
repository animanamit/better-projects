import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

// Create a router instance
const router = Router();

// Helper function to make sure a user exists in database (creating if needed)
async function ensureUserExists(clerkId: string, email: string, name?: string) {
  try {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    // If user doesn't exist, create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          name,
        },
      });
      console.log(`Created new user with clerkId: ${clerkId}`);
    }

    return user;
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    throw error;
  }
}

// GET /tasks - Get all tasks for a user
router.get("/", async (req: any, res: any) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "User ID is required" });
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST /tasks - Create a new task
router.post("/", async (req: any, res: any) => {
  try {
    const { title, description, userId, userEmail, userName } = req.body;

    if (!title || !userId || !userEmail) {
      return res.status(400).json({
        error: "Title, userId, and userEmail are required",
      });
    }

    // Ensure the user exists in our database
    await ensureUserExists(userId, userEmail, userName);

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId,
        status: "todo",
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

router.get("/task/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});
export default router;
