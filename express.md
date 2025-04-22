# Understanding Express.js, Servers, and Web Applications: A Comprehensive Guide

## Introduction

As a junior frontend engineer transitioning to full-stack development, understanding the backend is crucial. This guide explores Express.js, servers, HTTP, and the complex interactions that happen when you run your application locally. We'll dissect what occurs when you visit `localhost:5173` and explain the fundamental concepts of web architecture that senior engineers understand intuitively.

## Part 1: Express.js - The Foundation of Your Backend

### What is Express.js?

Express.js is a minimal, unopinionated web framework for Node.js. Think of Node.js as the engine, and Express as a well-designed car body built around it. While Node.js provides the core abilities to handle HTTP requests and responses, Express offers elegant abstractions that make building web applications more intuitive.

```javascript
// The most basic Express application
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

Let's break down this code line by line:

1. `const express = require('express');` - Imports the Express library.
2. `const app = express();` - Creates an instance of an Express application. This is your server application.
3. `app.get('/', (req, res) => {...});` - Defines a route handler for HTTP GET requests to the root path ('/').
4. `res.send('Hello, World!');` - Sends a response to the client.
5. `app.listen(3000, () => {...});` - Starts the server on port 3000 and executes the callback when the server is ready.

### Express Application Object

The `app` object is the heart of your Express application. It provides methods for:

- Routing HTTP requests (`app.get()`, `app.post()`, etc.)
- Configuring middleware (`app.use()`)
- Rendering HTML views (`app.render()`)
- Setting application variables (`app.set()`)

```javascript
// Example of various app methods
app.set('view engine', 'ejs');  // Configure view engine
app.use(express.json());        // Use middleware
app.get('/users', getUsers);    // HTTP GET route
app.post('/users', createUser); // HTTP POST route
```

### Express Middleware Architecture

Middleware is the backbone of Express. It's a series of functions that process requests before they reach the final route handler. Each middleware has access to:

- The request object (`req`)
- The response object (`res`)
- The next middleware function (`next`)

```javascript
// Middleware structure
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}: ${req.method} ${req.url}`);
  // Manipulate req or res objects if needed
  next(); // Pass control to the next middleware
});
```

Let's implement a more complete middleware example:

```javascript
// Logging middleware
const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Once response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  
  next(); // Continue to next middleware
};

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  // Verify token, attach user to request
  req.user = { id: 'user123', role: 'admin' }; // Simplified, you'd verify the token
  
  next();
};

// Apply middleware
app.use(loggerMiddleware);
app.use('/api', authMiddleware); // Only apply to routes that start with /api
```

Middleware functions execute in the order they are defined. This creates a "pipeline" through which requests flow. If any middleware doesn't call `next()`, the request stops there (for example, if authentication fails).

## Part 2: The Anatomy of a Server

### What is a Web Server Really?

At its core, a web server is a program that:

1. Opens a socket connection on a specified port
2. Listens for incoming HTTP requests
3. Processes those requests according to programmed rules
4. Sends HTTP responses back to clients

In Express, the `app.listen()` method creates this socket connection. Behind the scenes, Express is using Node's built-in `http` module:

```javascript
// What app.listen() is doing behind the scenes
const http = require('http');
const server = http.createServer((req, res) => {
  // Handle requests
});
server.listen(3000);
```

### Request-Response Cycle

The HTTP protocol is based on a request-response pattern:

1. **Client sends a request**: Contains method (GET, POST, etc.), headers, and sometimes a body
2. **Server processes the request**: Executes the appropriate code based on the URL and method
3. **Server sends a response**: Contains status code, headers, and body content
4. **Connection closes** (in HTTP/1.1) or remains open for reuse (HTTP/2 and above)

Here's how Express handles this cycle:

```javascript
app.get('/api/users/:id', (req, res) => {
  // 1. Extract data from request
  const userId = req.params.id;
  const includeOrders = req.query.includeOrders === 'true';
  
  // 2. Process the request (e.g., database lookup)
  const user = database.findUser(userId);
  
  if (!user) {
    // 3. Send error response if user not found
    return res.status(404).json({ error: 'User not found' });
  }
  
  // 4. Optionally get related data
  let userData = { ...user };
  if (includeOrders) {
    userData.orders = database.getUserOrders(userId);
  }
  
  // 5. Send successful response
  res.status(200).json(userData);
});
```

### Types of Responses

Express provides various methods to send responses:

- `res.send()`: Send a response of various types
- `res.json()`: Send a JSON response
- `res.sendFile()`: Send a file
- `res.render()`: Render a view template
- `res.redirect()`: Redirect to another URL
- `res.status()`: Set the HTTP status code

```javascript
// Examples of different response types
app.get('/plain', (req, res) => {
  res.send('Plain text response');
});

app.get('/json', (req, res) => {
  res.json({ message: 'JSON response' });
});

app.get('/file', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/template', (req, res) => {
  res.render('home', { title: 'Welcome', user: 'John' });
});

app.get('/old-page', (req, res) => {
  res.redirect('/new-page');
});

app.get('/not-found', (req, res) => {
  res.status(404).send('Resource not found');
});
```

## Part 3: The Complete Development Environment

### The Two-Server Architecture

In modern web development, particularly with React and Express, you typically run two separate servers during development:

1. **Frontend Dev Server (Vite)**: Serves your React application on port 5173
2. **Backend API Server (Express)**: Provides API endpoints on port 3000

This separation allows for:
- Independent development and deployment
- Different scaling strategies
- Clearer separation of concerns
- Potentially different hosting environments

```
      Browser
         ↑↓
+--------+--------+
|                 |
| Vite Dev Server | ← Serves HTML, JS, CSS
| (port 5173)     |
|                 |
+--------+--------+
         ↑↓
         |
         | HTTP API Calls
         |
+--------+--------+
|                 |
| Express Server  | ← Processes API requests
| (port 3000)     | ← Connects to databases
|                 | ← Handles business logic
+--------+--------+
         ↑↓
+--------+--------+
|                 |
|    Database     |
|                 |
+-----------------+
```

### What Happens When You Visit localhost:5173

Let's trace the complete sequence when you type `localhost:5173` in your browser:

#### 1. DNS Resolution and Connection Establishment

```
Browser: I need to connect to "localhost" on port 5173
Operating System: "localhost" is special, it maps to 127.0.0.1 (your own computer)
Browser: Opening TCP connection to 127.0.0.1:5173
```

#### 2. HTTP Request to Vite Dev Server

```
Browser sends:
GET / HTTP/1.1
Host: localhost:5173
User-Agent: Mozilla/5.0 ...
Accept: text/html,application/xhtml+xml,...
```

#### 3. Vite Dev Server Response

```
Vite processes the request and returns:
HTTP/1.1 200 OK
Content-Type: text/html
...

<!DOCTYPE html>
<html>
<head>
  <!-- Meta tags, title, etc. -->
  <script type="module" src="/src/main.tsx"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

#### 4. Browser Processes HTML

The browser parses the HTML and discovers it needs the JavaScript file `/src/main.tsx`.

```
Browser sends:
GET /src/main.tsx HTTP/1.1
Host: localhost:5173
...
```

#### 5. Vite Transpiles and Serves JavaScript

Vite transpiles your TypeScript React code and sends it back:

```
Vite returns:
HTTP/1.1 200 OK
Content-Type: application/javascript
...

// Transpiled JavaScript code
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

#### 6. React Application Initializes

The browser executes the JavaScript, and React mounts your application on the DOM.

#### 7. React App Makes API Request

When your React application needs data, it makes an API request to your Express backend:

```javascript
// In your React component
useEffect(() => {
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/tasks');
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchTasks();
}, []);
```

The browser sends:
```
OPTIONS http://localhost:3000/api/tasks HTTP/1.1  // CORS preflight
Host: localhost:3000
Origin: http://localhost:5173
Access-Control-Request-Method: GET
...

Followed by:

GET http://localhost:3000/api/tasks HTTP/1.1
Host: localhost:3000
Origin: http://localhost:5173
...
```

#### 8. Express Server Processes the Request

Your Express server receives the request and routes it to the appropriate handler:

```javascript
// In your Express backend
app.get('/api/tasks', async (req, res) => {
  try {
    // Get user information from authentication middleware
    const userId = req.user.id;
    
    // Query the database
    const tasks = await prisma.task.findMany({
      where: {
        userId: userId
      },
      include: {
        project: true
      }
    });
    
    // Send response back to client
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});
```

#### 9. Database Query and Response

The Express server queries the database, processes the results, and sends them back:

```
Express returns:
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:5173
...

[
  {
    "id": "task1",
    "title": "Implement user authentication",
    "description": "Add login and signup functionality",
    "status": "in-progress",
    "project": {
      "id": "project1",
      "name": "Website Redesign"
    }
  },
  ...
]
```

#### 10. React Updates UI

The React application receives the data, updates its state, and re-renders the UI to display the tasks.

## Part 4: Express Architecture Deep Dive

### RESTful API Design

RESTful APIs organize endpoints around resources. The HTTP method indicates the action to perform:

```javascript
// Complete RESTful API for tasks
// List all tasks
app.get('/api/tasks', getAllTasks);

// Get a specific task
app.get('/api/tasks/:id', getTaskById);

// Create a new task
app.post('/api/tasks', createTask);

// Update a task
app.put('/api/tasks/:id', updateTask);

// Delete a task
app.delete('/api/tasks/:id', deleteTask);
```

### Express Routers for Code Organization

As your application grows, organizing routes becomes crucial. Express provides a Router class for this:

```javascript
// In routes/tasks.js
const express = require('express');
const router = express.Router();

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;

// In index.js
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);
```

This modular approach keeps your code organized and maintainable.

### Error Handling Strategies

Proper error handling is crucial for robust applications. Express provides special middleware for catching errors:

```javascript
// Controller with async/await
const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Determine if error is operational or programming
  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  
  // For programming errors, send generic message
  res.status(500).json({ error: 'Something went wrong on the server' });
});
```

For more structured error handling, create custom error classes:

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Usage
if (!task) {
  throw new AppError('Task not found', 404);
}
```

### Authentication and Authorization

Most applications require authentication. Here's a simplified JWT authentication implementation:

```javascript
// Authentication middleware
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateUser = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user to request object
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Protect routes with middleware
app.get('/api/tasks', authenticateUser, getAllTasks);

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Verify credentials (simplified)
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || !comparePasswords(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
  
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});
```

### Authorization by Role

Role-based authorization ensures users can only access what they're permitted to:

```javascript
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
};

// Endpoint only accessible to admins
app.get('/api/users', authenticateUser, authorizeAdmin, getAllUsers);
```

## Part 5: Cross-Origin Resource Sharing (CORS)

### Understanding CORS

CORS is a security feature implemented by browsers. When your frontend (localhost:5173) makes a request to your backend (localhost:3000), the browser sees this as a cross-origin request because the ports differ.

Without proper CORS headers, the browser blocks these requests. Here's how to configure CORS in Express:

```javascript
const cors = require('cors');

// Simple CORS configuration
app.use(cors());

// Advanced CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourproductionsite.com' 
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies to be sent
  maxAge: 86400 // CORS preflight cache time in seconds
};

app.use(cors(corsOptions));
```

### The CORS Preflight Request

For certain requests (non-simple requests), browsers send a preflight OPTIONS request to check if the actual request is allowed:

```
Browser sends:
OPTIONS /api/tasks HTTP/1.1
Host: localhost:3000
Origin: http://localhost:5173
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: Content-Type, Authorization
```

Your Express server must handle these OPTIONS requests correctly:

```javascript
// Express automatically handles OPTIONS requests when using cors middleware
// The cors middleware adds:
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Part 6: Environment-Specific Configuration

### Development vs Production

Your Express application needs different configurations based on the environment:

```javascript
// Using environment variables for configuration
require('dotenv').config(); // Load .env file

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Database connection string
const dbUrl = isProduction 
  ? process.env.PRODUCTION_DB_URL 
  : process.env.DEVELOPMENT_DB_URL;

// CORS configuration
app.use(cors({
  origin: isProduction ? process.env.FRONTEND_URL : 'http://localhost:5173'
}));

// Error verbosity
app.use((err, req, res, next) => {
  console.error(err);
  
  res.status(err.statusCode || 500).json({
    error: isProduction ? 'Something went wrong' : err.message,
    stack: isProduction ? undefined : err.stack // Only show stack in development
  });
});
```

### Production Deployment Considerations

In production, the architecture typically changes:

1. **Frontend**: Built into static files (HTML, JS, CSS) and served from a CDN or static hosting
2. **Backend**: Running on a production server or cloud platform

The production flow might look like:

```
User → CDN (static frontend files) → API Gateway → Express Backend → Database
```

## Part 7: Express with TypeScript

### Type-Safe Express Applications

TypeScript can significantly improve your Express development experience:

```typescript
// src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod'; // For runtime validation

const app = express();
app.use(express.json());

// Define task schema with Zod
const TaskSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']).default('todo')
});

// Type derived from schema
type Task = z.infer<typeof TaskSchema>;

// Type-safe request handler
app.post('/api/tasks', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate and parse request body
    const taskData = TaskSchema.parse(req.body);
    
    // Now TypeScript knows taskData is valid and has the correct type
    const newTask = await prisma.task.create({
      data: taskData
    });
    
    res.status(201).json(newTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation error
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    next(error);
  }
});

// Custom type for authenticated request
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  }
}

// Type-safe middleware
const authenticateUser = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Authentication logic...
  
  // Cast to authenticated request
  (req as AuthenticatedRequest).user = { 
    id: 'user123', 
    email: 'user@example.com',
    role: 'admin'
  };
  
  next();
};

// Using the authenticated request type
app.get(
  '/api/protected', 
  authenticateUser, 
  (req: AuthenticatedRequest, res: Response) => {
    // TypeScript knows req.user exists and has the right shape
    console.log(`Request from user: ${req.user.email}`);
    res.json({ message: 'Protected data' });
  }
);
```

## Part 8: Advanced Express Concepts

### Streaming Responses

For large payloads, streaming can improve performance:

```javascript
app.get('/api/large-data', (req, res) => {
  // Set appropriate headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked');
  
  // Open array
  res.write('[\n');
  
  let first = true;
  
  // Stream database results
  db.query('SELECT * FROM large_table')
    .stream()
    .on('data', (chunk) => {
      // Add comma for all but first item
      if (!first) {
        res.write(',\n');
      } else {
        first = false;
      }
      
      res.write(JSON.stringify(chunk));
    })
    .on('end', () => {
      // Close array and end response
      res.write('\n]');
      res.end();
    })
    .on('error', (err) => {
      // Handle streaming error
      console.error('Streaming error:', err);
      // If headers not sent yet, send error response
      if (!res.headersSent) {
        res.status(500).json({ error: 'Streaming error' });
      } else {
        // Otherwise, just close the connection
        res.end();
      }
    });
});
```

### Rate Limiting

Protect your API from abuse with rate limiting:

```javascript
const rateLimit = require('express-rate-limit');

// Basic rate limiter - 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to all API endpoints
app.use('/api', apiLimiter);

// More restrictive limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 failed attempts per hour
  message: 'Too many login attempts, please try again after an hour'
});

app.use('/api/login', authLimiter);
```

### WebSockets with Express

For real-time communication, WebSockets complement your Express API:

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Regular Express routes
app.get('/api/tasks', getAllTasks);

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Authenticate socket connection
  socket.on('authenticate', (token) => {
    try {
      const user = jwt.verify(token, JWT_SECRET);
      socket.user = user;
      socket.join(`user:${user.id}`); // Join user-specific room
      socket.emit('authenticated', { success: true });
    } catch (error) {
      socket.emit('authenticated', { success: false, error: 'Invalid token' });
    }
  });
  
  // Task updated event
  socket.on('task:update', async (data) => {
    try {
      // Update task in database
      const updatedTask = await prisma.task.update({
        where: { id: data.id },
        data: { status: data.status }
      });
      
      // Broadcast to all team members
      const teamId = updatedTask.teamId;
      socket.to(`team:${teamId}`).emit('task:updated', updatedTask);
    } catch (error) {
      socket.emit('error', { message: 'Failed to update task' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the HTTP server (not the Express app directly)
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

## Part 9: Performance Optimization

### Caching Strategies

Implementing caching can dramatically improve performance:

```javascript
const mcache = require('memory-cache');

// Cache middleware
const cache = (duration) => {
  return (req, res, next) => {
    // Create a unique key based on URL and any relevant headers
    const key = `__express__${req.originalUrl || req.url}`;
    
    // Check if we have a cached response
    const cachedBody = mcache.get(key);
    
    if (cachedBody) {
      // Return cached response
      res.send(cachedBody);
      return;
    }
    
    // Override res.send to cache the response
    const originalSend = res.send;
    res.send = function(body) {
      mcache.put(key, body, duration * 1000);
      originalSend.call(this, body);
    };
    
    next();
  };
};

// Apply cache middleware to specific routes
app.get('/api/popular-content', cache(300), getPopularContent); // Cache for 5 minutes
```

### Compression

Compress responses to reduce bandwidth:

```javascript
const compression = require('compression');

// Compress all responses
app.use(compression());

// Or with custom configuration
app.use(compression({
  level: 6, // Compression level (0-9)
  threshold: 1024, // Only compress responses larger than threshold
  filter: (req, res) => {
    // Don't compress responses with this header
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // Use compression filter function
    return compression.filter(req, res);
  }
}));
```

### Async Code and Event Loop

Understanding Node.js's event loop is crucial for performance:

```javascript
// Non-blocking I/O
app.get('/api/users', async (req, res) => {
  // This database query doesn't block the event loop
  const users = await prisma.user.findMany();
  res.json(users);
});

// Avoid CPU-intensive operations
app.get('/api/heavy-calculation', (req, res) => {
  // BAD: This blocks the event loop
  // const result = performHeavyCalculation();
  
  // GOOD: Use worker threads for CPU-intensive tasks
  const { Worker } = require('worker_threads');
  
  const worker = new Worker('./workers/heavy-calculation.js');
  
  worker.on('message', (result) => {
    res.json({ result });
  });
  
  worker.on('error', (err) => {
    res.status(500).json({ error: 'Calculation failed' });
  });
  
  worker.postMessage(req.query.input);
});
```

## Part 10: Security Best Practices

### Security Headers

Add security headers to protect your application:

```javascript
const helmet = require('helmet');

// Add various security headers
app.use(helmet());

// Or configure manually
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable if needed
}));
```

### SQL Injection Prevention

When using raw SQL (not recommended with Prisma, but for illustration):

```javascript
const { Pool } = require('pg');
const pool = new Pool(/* config */);

app.get('/api/user/:id', async (req, res) => {
  const userId = req.params.id;
  
  // BAD: SQL injection vulnerability
  // const query = `SELECT * FROM users WHERE id = ${userId}`;
  
  // GOOD: Parameterized query
  const query = 'SELECT * FROM users WHERE id = $1';
  
  try {
    const result = await pool.query(query, [userId]);
    res.json(result.rows[0] || { error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});
```

### XSS Prevention

Protect against Cross-Site Scripting:

```javascript
// Use Content-Security-Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:"],
  },
}));

// Sanitize user input before storing or displaying
const sanitizeHtml = require('sanitize-html');

app.post('/api/comments', (req, res) => {
  const rawComment = req.body.comment;
  
  // Sanitize HTML before storing
  const sanitizedComment = sanitizeHtml(rawComment, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    allowedAttributes: {
      'a': ['href', 'title']
    }
  });
  
  // Store sanitizedComment in database
});
```

## Conclusion

This guide has explored Express.js, servers, and web application architecture in depth. As you continue your journey to becoming a senior full-stack developer, remember that understanding the backend is as crucial as frontend knowledge.

When you run your application and visit `localhost:5173`, you're experiencing a complex but elegant dance between multiple servers, the browser, and potentially databases or external services. The separation between frontend and backend allows for a clean division of concerns, enabling more maintainable and scalable applications.

Express.js gives you the flexibility to build robust APIs while maintaining simplicity. As you grow as a developer, you'll discover even more advanced patterns and techniques, but the fundamentals covered in this guide will serve as a strong foundation for your career.

Keep exploring, keep coding, and remember that every senior developer was once a junior asking the same questions you're asking now.