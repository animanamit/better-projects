# Better Projects - Modern Task Management Platform

## **🚀 Overview**
This is a **Linear/JIRA-inspired project management tool** built to showcase expertise in **modern frontend development** with a focus on React and TypeScript. The app allows users to:

- **Create, update, and manage tasks** with an intuitive kanban board interface
- **Create tasks using AI** with a global command palette (Cmd+K / Ctrl+K) 
- **Generate AI summaries** for tasks using OpenAI/OpenRouter
- **Upload files** as task attachments
- **Track task history** and status changes
- **Filter and organize tasks** by various criteria

This project demonstrates advanced React patterns, state management solutions, and integration with AI services to create a modern, responsive user interface.

---

## **✨ Features**

### **Implemented Features**
- ✅ **Task Management**: Create, view, and update tasks with a kanban-style board
- ✅ **AI Task Creation**: Generate structured task data from natural language descriptions
- ✅ **AI Task Summaries**: Generate executive summaries of task details for different stakeholders
- ✅ **Command Palette**: Global command interface (Cmd+K) for quick task creation
- ✅ **Mock Data Context**: In-memory data store that simulates a backend database
- ✅ **Task Details View**: Comprehensive task details with comments, history, and attachments

### **WIP Features (TODO)**
- 🔲 **Responsive Design**: Mobile and tablet optimized layouts that work across various screen sizes
- 🔲 **Authentication**: User authentication system with role-based permissions 
- 🔲 **Real-time Updates**: Live updates when task statuses change
- 🔲 **Advanced Filtering**: Filter tasks by assignee, due date, priority, etc.
- 🔲 **Testing**: Comprehensive test suite using Vitest and React Testing Library
- 🔲 **Backend Integration**: Connect to a real backend API for persistent storage
- 🔲 **Offline Support**: Progressive Web App capabilities for offline access
- 🔲 **Performance Optimizations**: Implement React.memo, useMemo, and useCallback for optimized rendering

---

## **🧰 Tech Stack**

### **Frontend**
- **React**: UI component library for building the interface
- **TypeScript**: For type safety throughout the codebase
- **TanStack Query**: For server-state management and data fetching
- **React Router**: For client-side routing between pages
- **Tailwind CSS**: For styling with utility-first approach
- **ShadCN UI**: For accessible, customizable UI components
- **Context API**: For global state management with mock data
- **Command-K**: Command palette for global actions

### **AI Integration**
- **OpenRouter API**: For AI-powered task creation and summaries
- **Prompt Engineering**: Structured system prompts for consistent AI responses

### **Testing (Planned)**
- **Vitest**: For unit and integration testing *(TODO)*
- **React Testing Library**: For component testing *(TODO)*
- **MSW**: For mocking API requests in tests *(TODO)*

---

## **📂 Project Structure**

```plaintext
project-root/
├── frontend/               # React app (client-side)
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── ui/         # Base UI components from ShadCN
│   │   │   └── ...         # Feature-specific components
│   │   ├── lib/            # Utilities and services
│   │   │   ├── ai.ts       # AI processing utilities
│   │   │   ├── api.ts      # API client utilities
│   │   │   └── mock-data-context.tsx # Mock data store
│   │   ├── mock-data/      # Mock data for development
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.tsx         # Main application component
│   │   ├── dashboard.tsx   # Dashboard page
│   │   ├── task-page.tsx   # Task details page
│   │   └── ...
├── backend/                # NodeJS + Fastify backend
│   ├── src/
│   │   ├── routes/         # API routes including AI endpoints
│   │   ├── controllers/    # Business logic controllers
│   │   ├── prisma/         # Database schema and client
│   │   └── ...
├── task-creation.md        # Technical documentation for AI task creation
└── README.md               # Project documentation
```

---

## **🛠️ How It Works**

### **AI-Powered Task Creation**
1. **Command Palette**: Press Cmd+K (or Ctrl+K) to open the global command palette
2. **Natural Language Input**: Describe your task in plain language
3. **AI Processing**: The system uses AI to extract structured task data (title, description, priority, due date, etc.)
4. **Preview & Edit**: Review and edit the extracted data before creating the task
5. **Task Creation**: The task is saved to the mock data context and appears on the board

### **Mock Data Architecture**
1. **React Context API**: Provides an in-memory data store that simulates a backend database
2. **CRUD Operations**: Implements create, read, update, and delete operations for tasks
3. **TypeScript Interfaces**: Ensures type safety for all data structures
4. **Component Integration**: Components read from and write to the shared context

### **Task Board UI**
1. **Kanban Layout**: Tasks are organized by status in columns
2. **Drag & Drop**: *(WIP)* Move tasks between columns to update status
3. **Quick Actions**: Update task status directly from the board
4. **Task Cards**: Display essential information for at-a-glance understanding

---

## **🔮 Future Directions**

- **Full Backend Integration**: Connect to a real backend API for persistent storage
- **Authentication System**: Implement user accounts and permissions
- **Real-time Collaboration**: Add WebSocket support for live updates
- **Advanced Analytics**: Track task completion rates and team productivity

---