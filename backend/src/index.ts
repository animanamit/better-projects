import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from './routes/tasks';
import { verifyWebhook } from "@clerk/express/webhooks";
import * as path from 'path';

// Load environment variables with proper path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Log environment variables for debugging (except secrets)
console.log("Environment loaded:");
console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("WEBHOOK_SECRET exists:", !!process.env.CLERK_WEBHOOK_SIGNING_SECRET);

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
      "svix-timestamp"
    ],
    exposedHeaders: ["svix-id", "svix-signature", "svix-timestamp"],
  })
);

// Setup JSON parsing for all routes except webhook
// This must come after the webhook route setup
app.use((req, res, next) => {
  if (req.path === '/api/webhooks') {
    return next();
  }
  express.json()(req, res, next);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Setup raw body parsing for webhook endpoint
app.use('/api/webhooks', express.raw({ type: 'application/json' }));

// Add a debugging middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} received`);
  next();
});

// Webhook route 
app.post('/api/webhooks', (req, res) => {
  try {
    console.log('Webhook received at:', new Date().toISOString());
    console.log('Webhook headers:', req.headers);
    
    // Verify webhook signature
    verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET
    }).then(evt => {
      // Process webhook event
      const { id } = evt.data;
      const eventType = evt.type;
      console.log(`Processed webhook with ID ${id} and type ${eventType}`);
      console.log('Webhook payload:', evt.data);
      
      res.status(200).send('Webhook received');
    }).catch(err => {
      console.error('Error verifying webhook:', err);
      res.status(400).send('Error verifying webhook');
    });
  } catch (err) {
    console.error('Unexpected error in webhook handler:', err);
    res.status(500).send('Server error');
  }
});

// Routes
app.use('/api/tasks', taskRoutes);

const port = process.env.PORT || 3001; // Changed to 3001 to avoid conflicts

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Webhook endpoint: http://localhost:${port}/api/webhooks`);
});
