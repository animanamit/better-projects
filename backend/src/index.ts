import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import sensible from '@fastify/sensible';
import dotenv from 'dotenv';
import * as path from 'path';
import { prisma } from './prisma';
import { verifyWebhook } from "@clerk/express/webhooks";

// Import routes
import taskRoutes from './routes/tasks';
import fileRoutes from './routes/files';
import aiRoutes from './routes/ai';

// Load environment variables with proper path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Create Fastify instance
const fastify = Fastify({
  logger: true // Enable built-in logging
});

// Register plugins and start server
async function setup() {
  // CORS setup - Configure allowed origins
  await fastify.register(cors, {
    origin: '*', // Allow all origins for development simplicity
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Pragma',
      'Access-Control-Allow-Origin',
      'svix-id',
      'svix-signature',
      'svix-timestamp',
    ],
    exposedHeaders: ['svix-id', 'svix-signature', 'svix-timestamp'],
  });

  // Register sensible for better error handling
  await fastify.register(sensible);

  // API documentation with Swagger
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Better Projects API',
        description: 'API documentation for Better Projects',
        version: '1.0.0'
      },
    }
  });
  
  // Register Swagger UI
  await fastify.register(swaggerUi, {
    routePrefix: '/documentation',
  });

  // Custom logging decorator
  fastify.addHook('onRequest', async (request, reply) => {
    request.log.info(`${request.method} ${request.url} received`);
  });

  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', message: 'Server is running' };
  });

  // Register route modules
  await fastify.register(taskRoutes, { prefix: '/api/tasks' });
  await fastify.register(fileRoutes, { prefix: '/api/files' });
  await fastify.register(aiRoutes, { prefix: '/api/ai' });

  // Add webhook handling with raw body support
  // This is more complex due to Clerk webhook verification needing Express request format
  // We'll need a custom implementation here
  fastify.addContentTypeParser('application/json', { parseAs: 'buffer' }, (req, body, done) => {
    done(null, body);
  });

  fastify.post('/api/webhooks', async (request, reply) => {
    try {
      console.log("Webhook received at:", new Date().toISOString());
      console.log("Webhook headers:", request.headers);

      // Convert Fastify request to Express-like for Clerk compatibility
      const expressLikeRequest = {
        headers: request.headers,
        body: request.body
      };

      // Verify webhook signature
      const evt = await verifyWebhook(expressLikeRequest as any, {
        signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
      });

      // Process webhook event
      const { id } = evt.data;
      const eventType = evt.type;
      console.log(`Processed webhook with ID ${id} and type ${eventType}`);

      // Handle different event types
      if (eventType === "user.created" || eventType === "user.updated") {
        // Extract user data from the webhook payload
        const userData = evt.data;
        const {
          id: clerkUserId,
          email_addresses,
          first_name,
          last_name,
        } = userData;

        // Get primary email if available
        const primaryEmail =
          email_addresses && email_addresses.length > 0
            ? email_addresses[0].email_address
            : null;

        // Create a name from first and last name if available
        const name =
          [first_name, last_name].filter(Boolean).join(" ") || null;

        if (!primaryEmail) {
          console.error("No email found for user:", clerkUserId);
          return { status: 'error', message: 'No email found' };
        }

        try {
          // Use Prisma upsert to either create or update the user
          const user = await prisma.user.upsert({
            where: {
              clerkId: clerkUserId,
            },
            update: {
              email: primaryEmail,
              name: name,
            },
            create: {
              clerkId: clerkUserId,
              email: primaryEmail,
              name: name,
            },
          });

          console.log(
            `User ${user.id} upserted successfully with clerk ID: ${clerkUserId}`
          );
        } catch (error) {
          console.error("Error syncing user to database:", error);
          // Still return 200 to Clerk so it doesn't retry indefinitely
        }
      } else if (eventType === "session.created") {
        // Handle login events
        const { user_id } = evt.data;

        try {
          // Log the login event
          console.log("User logged in:", user_id);
        } catch (error) {
          console.error("Error processing login event:", error);
        }
      }

      return { status: 'success', message: 'Webhook received' };
    } catch (err) {
      console.error("Error processing webhook:", err);
      return reply.status(400).send({ error: "Error verifying webhook" });
    }
  });

  // Start the server
  const port = parseInt(process.env.PORT || '3001');
  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server is running on port ${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`API Documentation: http://localhost:${port}/documentation`);
    console.log(`Webhook endpoint: http://localhost:${port}/api/webhooks`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Run the server
setup().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});