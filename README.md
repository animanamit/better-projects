## **🚀 Overview**
This is a **Linear/JIRA-inspired project management tool** built to showcase my expertise in **frontend and backend development** using modern technologies. The app allows users to:
- **Authenticate** using **Clerk**.
- **Create, update, and manage tasks and projects**.
- **Upload files (e.g., images) to AWS S3**.
- **Leverage AI insights** for tasks and projects using **OpenAI/OpenRouter**.
- **Collaborate in real-time** with a responsive and modern UI.

This project is designed to demonstrate my ability to work across the full stack, integrate cloud services, and build scalable, maintainable applications.

---

## **🧰 Tech Stack**

### **Frontend**
- **React**: For building the user interface.
- **React Router**: For client-side routing.
- **Redux Toolkit**: For global state management.
- **React Query**: For server-side state management and API calls.
- **tRPC**: For type-safe API communication between the frontend and backend.
- **Tailwind CSS**: For styling the app.
- **ShadCN**: For pre-built, accessible UI components.
- **Clerk**: For user authentication.
- **TypeScript**: For type safety and better developer experience.

### **Backend**
- **Node.js**: For the server runtime.
- **Express.js**: For building RESTful APIs and integrating tRPC.
- **Prisma**: For database ORM and schema management.
- **AWS S3**: For file storage (e.g., task attachments).
- **Supabase**: For the database during development (migrating to AWS RDS later).
- **tRPC**: For type-safe API endpoints.
- **TypeScript**: For type safety and better developer experience.

### **Testing**
- **Vitest**: For unit testing.
- **React Testing Library**: For component testing.
- **Playwright**: For end-to-end testing.

### **Deployment**
- **Frontend**: Deployed to **Vercel** during development (migrating to AWS Amplify later).
- **Backend**: Deployed to **Railway** during development (migrating to AWS EC2 and API Gateway later).

---

## **📂 Folder Structure**

This project is organized as a **monorepo** with separate folders for the frontend and backend:

```plaintext
project-root/
├── frontend/               # React app (client-side)
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # React Router pages
│   │   ├── redux/          # Redux slices and store
│   │   ├── api/            # tRPC client and API utilities
│   │   ├── styles/         # Tailwind CSS styles
│   │   └── utils/          # Helper functions
│   ├── public/             # Static assets (e.g., fonts)
│   ├── tailwind.config.js  # Tailwind configuration
│   └── package.json        # Frontend dependencies
├── backend/                # Node.js + Express backend
│   ├── src/
│   │   ├── routes/         # REST API and tRPC routes
│   │   ├── prisma/         # Prisma schema and client
│   │   ├── utils/          # AWS S3 helpers, Zod validation
│   │   ├── middlewares/    # Middleware (e.g., Clerk auth)
│   │   └── index.ts        # Entry point for the server
│   ├── prisma/
│   │   ├── schema.prisma   # Prisma schema
│   │   └── migrations/     # Database migrations
│   ├── package.json        # Backend dependencies
│   └── .env                # Environment variables
├── README.md               # Project documentation
└── .gitignore              # Ignored files
```

---

## **🛠️ How It Works**

### **Frontend**
1. **React + React Router**:
   - The app uses **React Router** for client-side routing (e.g., `/tasks`, `/projects`).
   - Pages are dynamically rendered based on the user’s actions.

2. **Redux Toolkit**:
   - Global state (e.g., user authentication, task/project data) is managed using **Redux Toolkit**.
   - Redux slices are used to organize state logic.

3. **React Query**:
   - Server-side state (e.g., fetching tasks from the backend) is managed using **React Query**.
   - This ensures efficient data fetching, caching, and synchronization.

4. **tRPC**:
   - The frontend communicates with the backend using **tRPC**, ensuring type-safe API calls.
   - All API endpoints are defined in the backend and consumed directly in the frontend.

5. **Styling**:
   - The app is styled using **Tailwind CSS** for utility-first styling.
   - **ShadCN** components are used for accessible, pre-built UI elements.

6. **Authentication**:
   - **Clerk** handles user authentication, providing sign-in, sign-up, and session management.

---

### **Backend**
1. **Express.js**:
   - The backend is built with **Express.js**, which serves RESTful APIs and integrates **tRPC** for type-safe communication.

2. **Prisma**:
   - **Prisma** is used as the ORM to interact with the database (Supabase during development, AWS RDS later).
   - The `schema.prisma` file defines the database models (e.g., `User`, `Task`, `Project`).

3. **AWS S3**:
   - File uploads (e.g., task attachments) are handled using **AWS S3**.
   - The backend uses the AWS SDK to upload files and return their URLs to the frontend.

4. **tRPC**:
   - The backend defines **tRPC routers** for type-safe API endpoints.
   - These routers are consumed directly by the frontend.

5. **Zod**:
   - **Zod** is used for input validation in both the backend (e.g., validating API requests) and the frontend (e.g., validating forms).

---

### **How Everything Connects**
1. **Frontend to Backend**:
   - The frontend communicates with the backend via **tRPC** and RESTful APIs.
   - For example, when a user creates a task, the frontend sends a request to the backend, which stores the task in the database and returns the updated task list.

2. **Backend to AWS**:
   - The backend integrates with **AWS S3** for file uploads.
   - In the future, the backend will connect to **AWS RDS** for database storage.

3. **AI Insights**:
   - The backend integrates with **OpenAI/OpenRouter** to provide AI-generated insights for tasks and projects.
   - For example, the backend can generate task summaries or suggest related tasks.

---

## **🧪 Testing**

### **Unit Testing**
- **Vitest**: For testing backend utilities (e.g., AWS S3 integration) and frontend Redux slices.

### **Component Testing**
- **React Testing Library**: For testing React components in isolation.

### **End-to-End Testing**
- **Playwright**: For testing the entire app, including frontend-backend interactions and file uploads.

---