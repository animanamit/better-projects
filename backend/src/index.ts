import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/tasks";
import fileRoutes from "./routes/files";
import { verifyWebhook } from "@clerk/express/webhooks";
import * as path from "path";
import { prisma } from "./prisma";

// Load environment variables with proper path
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Log environment variables for debugging (except secrets)
console.log("Environment loaded:");
console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log(
  "WEBHOOK_SECRET exists:",
  !!process.env.CLERK_WEBHOOK_SIGNING_SECRET
);

const app = express();

// Configure allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173", // Local development
  process.env.FRONTEND_URL, // Production frontend
].filter(Boolean); // Remove undefined values

// Enable CORS for allowed origins
app.use(
  cors({
    origin: "*", // Allow all origins for development simplicity
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Pragma",
      "Access-Control-Allow-Origin",
      "svix-id",
      "svix-signature",
      "svix-timestamp",
    ],
    exposedHeaders: ["svix-id", "svix-signature", "svix-timestamp"],
  })
);

// Setup JSON parsing for all routes except webhook
// This must come after the webhook route setup
// app.use((req: any, res: any, next: express.NextFunction) => {
//   if (req.path === "/api/webhooks") {
//     return next();
//   }
//   express.json()(req, res, next);
// });

// Health check endpoint
app.get("/health", (req: any, res: any) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Setup raw body parsing for webhook endpoint
app.use("/api/webhooks", express.raw({ type: "application/json" }));

// Add a debugging middleware to log all requests
app.use((req: any, res: any, next: any) => {
  console.log(`${req.method} ${req.path} received`);
  next();
});

// Webhook route
app.post("/api/webhooks", (req: any, res: any) => {
  try {
    console.log("Webhook received at:", new Date().toISOString());
    console.log("Webhook headers:", req.headers);

    // Verify webhook signature
    verifyWebhook(req as any, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    })
      .then(async (evt) => {
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
            return;
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
            // Log the login event - note that our schema doesn't track login timestamps
            // You could add this field to the User model if needed
            console.log("User logged in:", user_id);

            // You could add login tracking here if you extend your schema:
            // await prisma.user.update({
            //   where: { clerkId: user_id },
            //   data: { lastLoginAt: new Date() }
            // });
          } catch (error) {
            console.error("Error processing login event:", error);
          }
        }

        res.status(200).send("Webhook received");
      })
      .catch((err) => {
        console.error("Error verifying webhook:", err);
        res.status(400).send("Error verifying webhook");
      });
  } catch (err) {
    console.error("Unexpected error in webhook handler:", err);
    res.status(500).send("Server error");
  }
});

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/files", fileRoutes);

const port = process.env.PORT || 3001; // Changed to 3001 to avoid conflicts

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Webhook endpoint: http://localhost:${port}/api/webhooks`);
});
