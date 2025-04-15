import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from './routes/tasks';

dotenv.config();

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
      "Access-Control-Allow-Origin"
    ],
  })
);

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/tasks', taskRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
