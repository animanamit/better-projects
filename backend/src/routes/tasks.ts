import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../prisma';

// Type definitions for request parameters
interface TaskParams {
  id: string;
}

// Type definition for query parameters
interface TaskQueryByUser {
  userId: string;
}

// Type definitions for creating a task
interface CreateTaskBody {
  title: string;
  description?: string;
  userId: string;
  userEmail: string;
  userName?: string;
}

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

// Define the tasks plugin
const taskRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Schema for GET /tasks - Get all tasks for a user
  const getUserTasksSchema = {
    querystring: {
      type: 'object',
      required: ['userId'],
      properties: {
        userId: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: ['string', 'null'] },
            status: { type: 'string' },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  };

  // GET /tasks - Get all tasks for a user
  fastify.get<{
    Querystring: TaskQueryByUser
  }>('/', { schema: getUserTasksSchema }, async (request, reply) => {
    try {
      const { userId } = request.query;

      if (!userId) {
        throw fastify.httpErrors.badRequest('User ID is required');
      }

      const tasks = await prisma.task.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return tasks;
    } catch (error) {
      request.log.error("Error fetching tasks:", error);
      // Using @fastify/sensible's httpErrors
      throw fastify.httpErrors.internalServerError('Failed to fetch tasks');
    }
  });

  // Schema for POST /tasks - Create a task
  const createTaskSchema = {
    body: {
      type: 'object',
      required: ['title', 'userId', 'userEmail'],
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        userId: { type: 'string' },
        userEmail: { type: 'string', format: 'email' },
        userName: { type: 'string' }
      }
    },
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: ['string', 'null'] },
          status: { type: 'string' },
          userId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  };

  // POST /tasks - Create a new task
  fastify.post<{
    Body: CreateTaskBody
  }>('/', { schema: createTaskSchema }, async (request, reply) => {
    try {
      const { title, description, userId, userEmail, userName } = request.body;

      if (!title || !userId || !userEmail) {
        throw fastify.httpErrors.badRequest('Title, userId, and userEmail are required');
      }

      // Ensure the user exists in our database
      await ensureUserExists(userId, userEmail, userName);

      const task = await prisma.task.create({
        data: {
          title,
          description,
          userId,
          status: 'todo',
        },
      });

      return reply.status(201).send(task);
    } catch (error) {
      request.log.error("Error creating task:", error);
      throw fastify.httpErrors.internalServerError('Failed to create task');
    }
  });

  // Schema for GET /tasks/:id - Get a task by ID
  const getTaskByIdSchema = {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: ['string', 'null'] },
          status: { type: 'string' },
          userId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  };

  // GET /tasks/task/:id - Get a task by ID
  fastify.get<{
    Params: TaskParams
  }>('/task/:id', { schema: getTaskByIdSchema }, async (request, reply) => {
    try {
      const { id } = request.params;
      const task = await prisma.task.findUnique({
        where: { id },
      });

      if (!task) {
        throw fastify.httpErrors.notFound('Task not found');
      }

      return task;
    } catch (error) {
      request.log.error("Error fetching task:", error);
      // If it's already an HTTP error (like notFound), it will be passed through
      if ((error as any).statusCode) throw error;
      throw fastify.httpErrors.internalServerError('Failed to fetch task');
    }
  });
};

export default taskRoutes;