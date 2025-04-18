// Define task status and priority enums locally
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  TESTING = "TESTING",
  BLOCKED = "BLOCKED",
  COMPLETED = "COMPLETED",
}

export enum TaskPriority {
  LOWEST = "LOWEST",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  HIGHEST = "HIGHEST",
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  clerkId: string;
  name?: string;
  role?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: string;
  joinedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  startDate: string;
  targetEndDate?: string;
  actualEndDate?: string | null;
  organizationId: string;
  teamId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints?: number;
  startDate?: string | null;
  dueDate?: string | null;
  completedDate?: string | null;
  estimatedHours?: number;
  actualHours?: number | null;
  projectId: string;
  assigneeId?: string | null;
  reporterId?: string | null;
  qaId?: string | null;
  parentTaskId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
}

export interface TaskTag {
  taskId: string;
  tagId: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  taskId: string;
  parentCommentId?: string | null;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FileAttachment {
  id: string;
  fileName: string;
  originalFileName?: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  userId: string;
  taskId: string;
  createdAt: string;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  fieldChanged: string;
  oldValue?: string | null;
  newValue?: string | null;
  changedBy: string;
  changedAt: string;
}

// Create the mock data with proper typing
export const mockData: {
  organizations: Organization[];
  teams: Team[];
  users: User[];
  teamMembers: TeamMember[];
  projects: Project[];
  tags: Tag[];
  tasks: Task[];
  taskTags: TaskTag[];
  comments: Comment[];
  fileAttachments: FileAttachment[];
  taskHistory: TaskHistory[];
} = {
  organizations: [
    {
      id: "org-01",
      name: "TechNova Solutions",
      description:
        "A leading technology solutions provider specializing in enterprise software and cloud infrastructure",
      logoUrl: "https://example.com/logos/technova.png",
      createdAt: "2023-01-15T08:00:00Z",
      updatedAt: "2023-06-20T14:30:00Z",
    },
    {
      id: "org-02",
      name: "GreenLeaf Innovations",
      description:
        "Sustainable technology company focused on environmental solutions and clean energy",
      logoUrl: "https://example.com/logos/greenleaf.png",
      createdAt: "2023-02-10T09:15:00Z",
      updatedAt: "2023-07-05T11:45:00Z",
    },
  ],
  teams: [
    {
      id: "team-01",
      name: "Frontend Development",
      description:
        "Team responsible for client-facing application development and user experience",
      organizationId: "org-01",
      createdAt: "2023-01-20T10:00:00Z",
      updatedAt: "2023-06-25T16:45:00Z",
    },
    {
      id: "team-02",
      name: "Backend Engineering",
      description: "Core infrastructure and API development team",
      organizationId: "org-01",
      createdAt: "2023-01-20T10:30:00Z",
      updatedAt: "2023-06-22T13:15:00Z",
    },
    {
      id: "team-03",
      name: "QA & Testing",
      description: "Quality assurance and automated testing team",
      organizationId: "org-01",
      createdAt: "2023-01-22T09:00:00Z",
      updatedAt: "2023-05-18T11:30:00Z",
    },
    {
      id: "team-04",
      name: "Product Design",
      description: "UI/UX design and product experience team",
      organizationId: "org-01",
      createdAt: "2023-01-25T14:00:00Z",
      updatedAt: "2023-06-10T09:45:00Z",
    },
    {
      id: "team-05",
      name: "Renewable Tech",
      description: "Developing software for renewable energy systems",
      organizationId: "org-02",
      createdAt: "2023-02-15T11:00:00Z",
      updatedAt: "2023-07-08T15:30:00Z",
    },
    {
      id: "team-06",
      name: "Data Analytics",
      description: "Environmental data analysis and reporting team",
      organizationId: "org-02",
      createdAt: "2023-02-18T13:45:00Z",
      updatedAt: "2023-06-30T10:15:00Z",
    },
  ],
  users: [
    {
      id: "user-01",
      email: "sarah.johnson@example.com",
      clerkId: "clerk-user-01",
      name: "Sarah Johnson",
      role: "Engineering Manager",
      avatarUrl: "https://example.com/avatars/sarah.jpg",
      createdAt: "2023-01-10T09:00:00Z",
      updatedAt: "2023-06-15T14:30:00Z",
    },
    {
      id: "user-02",
      email: "michael.chen@example.com",
      clerkId: "clerk-user-02",
      name: "Michael Chen",
      role: "Senior Frontend Developer",
      avatarUrl: "https://example.com/avatars/michael.jpg",
      createdAt: "2023-01-12T10:15:00Z",
      updatedAt: "2023-05-20T11:45:00Z",
    },
    {
      id: "user-03",
      email: "emma.rodriguez@example.com",
      clerkId: "clerk-user-03",
      name: "Emma Rodriguez",
      role: "Backend Developer",
      avatarUrl: "https://example.com/avatars/emma.jpg",
      createdAt: "2023-01-15T08:30:00Z",
      updatedAt: "2023-06-10T09:20:00Z",
    },
    {
      id: "user-04",
      email: "david.nguyen@example.com",
      clerkId: "clerk-user-04",
      name: "David Nguyen",
      role: "QA Engineer",
      avatarUrl: "https://example.com/avatars/david.jpg",
      createdAt: "2023-01-18T11:45:00Z",
      updatedAt: "2023-05-25T16:30:00Z",
    },
    {
      id: "user-05",
      email: "olivia.patel@example.com",
      clerkId: "clerk-user-05",
      name: "Olivia Patel",
      role: "Product Designer",
      avatarUrl: "https://example.com/avatars/olivia.jpg",
      createdAt: "2023-01-20T14:00:00Z",
      updatedAt: "2023-06-05T10:15:00Z",
    },
    {
      id: "user-06",
      email: "james.wilson@example.com",
      clerkId: "clerk-user-06",
      name: "James Wilson",
      role: "Frontend Developer",
      avatarUrl: "https://example.com/avatars/james.jpg",
      createdAt: "2023-01-22T09:30:00Z",
      updatedAt: "2023-05-30T13:45:00Z",
    },
    {
      id: "user-07",
      email: "sophia.garcia@example.com",
      clerkId: "clerk-user-07",
      name: "Sophia Garcia",
      role: "Data Scientist",
      avatarUrl: "https://example.com/avatars/sophia.jpg",
      createdAt: "2023-02-01T10:45:00Z",
      updatedAt: "2023-06-12T15:20:00Z",
    },
    {
      id: "user-08",
      email: "ethan.kim@example.com",
      clerkId: "clerk-user-08",
      name: "Ethan Kim",
      role: "DevOps Engineer",
      avatarUrl: "https://example.com/avatars/ethan.jpg",
      createdAt: "2023-02-05T13:15:00Z",
      updatedAt: "2023-06-18T11:30:00Z",
    },
    {
      id: "user-09",
      email: "ava.williams@example.com",
      clerkId: "clerk-user-09",
      name: "Ava Williams",
      role: "Project Manager",
      avatarUrl: "https://example.com/avatars/ava.jpg",
      createdAt: "2023-02-10T08:45:00Z",
      updatedAt: "2023-06-22T14:15:00Z",
    },
    {
      id: "user-10",
      email: "noah.brown@example.com",
      clerkId: "clerk-user-10",
      name: "Noah Brown",
      role: "Engineering Director",
      avatarUrl: "https://example.com/avatars/noah.jpg",
      createdAt: "2023-01-05T11:00:00Z",
      updatedAt: "2023-05-15T09:30:00Z",
    },
    {
      id: "user-11",
      email: "isabella.martinez@example.com",
      clerkId: "clerk-user-11",
      name: "Isabella Martinez",
      role: "UX Researcher",
      avatarUrl: "https://example.com/avatars/isabella.jpg",
      createdAt: "2023-02-12T10:30:00Z",
      updatedAt: "2023-06-25T13:45:00Z",
    },
    {
      id: "user-12",
      email: "william.taylor@example.com",
      clerkId: "clerk-user-12",
      name: "William Taylor",
      role: "Backend Team Lead",
      avatarUrl: "https://example.com/avatars/william.jpg",
      createdAt: "2023-01-08T09:15:00Z",
      updatedAt: "2023-05-28T10:45:00Z",
    },
  ],
  teamMembers: [
    {
      id: "tm-01",
      userId: "user-01",
      teamId: "team-01",
      role: "Team Lead",
      joinedAt: "2023-01-20T10:00:00Z",
    },
    {
      id: "tm-02",
      userId: "user-02",
      teamId: "team-01",
      role: "Senior Developer",
      joinedAt: "2023-01-21T09:30:00Z",
    },
    {
      id: "tm-03",
      userId: "user-06",
      teamId: "team-01",
      role: "Developer",
      joinedAt: "2023-01-25T11:15:00Z",
    },
    {
      id: "tm-04",
      userId: "user-12",
      teamId: "team-02",
      role: "Team Lead",
      joinedAt: "2023-01-20T10:30:00Z",
    },
    {
      id: "tm-05",
      userId: "user-03",
      teamId: "team-02",
      role: "Developer",
      joinedAt: "2023-01-22T13:45:00Z",
    },
    {
      id: "tm-06",
      userId: "user-08",
      teamId: "team-02",
      role: "DevOps Specialist",
      joinedAt: "2023-02-06T09:00:00Z",
    },
    {
      id: "tm-07",
      userId: "user-04",
      teamId: "team-03",
      role: "QA Lead",
      joinedAt: "2023-01-22T09:15:00Z",
    },
    {
      id: "tm-08",
      userId: "user-05",
      teamId: "team-04",
      role: "Design Lead",
      joinedAt: "2023-01-25T14:30:00Z",
    },
    {
      id: "tm-09",
      userId: "user-11",
      teamId: "team-04",
      role: "Researcher",
      joinedAt: "2023-02-15T10:45:00Z",
    },
    {
      id: "tm-10",
      userId: "user-09",
      teamId: "team-01",
      role: "Project Manager",
      joinedAt: "2023-02-12T11:30:00Z",
    },
    {
      id: "tm-11",
      userId: "user-09",
      teamId: "team-02",
      role: "Project Manager",
      joinedAt: "2023-02-12T11:45:00Z",
    },
    {
      id: "tm-12",
      userId: "user-07",
      teamId: "team-06",
      role: "Data Lead",
      joinedAt: "2023-02-20T09:30:00Z",
    },
  ],
  projects: [
    {
      id: "proj-01",
      name: "Customer Portal Redesign",
      description:
        "Modernizing the customer portal with improved UX and new features",
      status: "active",
      startDate: "2023-03-01T08:00:00Z",
      targetEndDate: "2023-06-30T17:00:00Z",
      actualEndDate: null,
      organizationId: "org-01",
      teamId: "team-01",
      createdAt: "2023-02-15T14:30:00Z",
      updatedAt: "2023-06-10T11:45:00Z",
    },
    {
      id: "proj-02",
      name: "API Modernization",
      description:
        "Refactoring the backend API architecture for better performance and scalability",
      status: "active",
      startDate: "2023-03-15T09:00:00Z",
      targetEndDate: "2023-07-15T17:00:00Z",
      actualEndDate: null,
      organizationId: "org-01",
      teamId: "team-02",
      createdAt: "2023-02-20T10:15:00Z",
      updatedAt: "2023-06-05T13:30:00Z",
    },
    {
      id: "proj-03",
      name: "Automated Testing Framework",
      description:
        "Building a comprehensive automated testing framework for all products",
      status: "active",
      startDate: "2023-04-01T08:30:00Z",
      targetEndDate: "2023-07-31T17:00:00Z",
      actualEndDate: null,
      organizationId: "org-01",
      teamId: "team-03",
      createdAt: "2023-03-15T11:00:00Z",
      updatedAt: "2023-06-12T15:45:00Z",
    },
    {
      id: "proj-04",
      name: "Design System Implementation",
      description:
        "Creating and implementing a unified design system across all products",
      status: "completed",
      startDate: "2023-02-15T09:00:00Z",
      targetEndDate: "2023-05-15T17:00:00Z",
      actualEndDate: "2023-05-20T16:30:00Z",
      organizationId: "org-01",
      teamId: "team-04",
      createdAt: "2023-01-30T13:45:00Z",
      updatedAt: "2023-05-20T16:45:00Z",
    },
    {
      id: "proj-05",
      name: "Solar Panel Monitoring Dashboard",
      description:
        "Real-time dashboard for monitoring solar panel efficiency and maintenance",
      status: "active",
      startDate: "2023-03-10T10:00:00Z",
      targetEndDate: "2023-07-10T17:00:00Z",
      actualEndDate: null,
      organizationId: "org-02",
      teamId: "team-05",
      createdAt: "2023-02-25T09:30:00Z",
      updatedAt: "2023-06-15T14:00:00Z",
    },
    {
      id: "proj-06",
      name: "Environmental Data Analytics Platform",
      description:
        "Building a platform for analyzing and visualizing environmental impact data",
      status: "active",
      startDate: "2023-04-05T09:00:00Z",
      targetEndDate: "2023-08-15T17:00:00Z",
      actualEndDate: null,
      organizationId: "org-02",
      teamId: "team-06",
      createdAt: "2023-03-20T11:15:00Z",
      updatedAt: "2023-06-25T10:30:00Z",
    },
    {
      id: "proj-07",
      name: "Mobile App Redesign",
      description:
        "Redesigning the mobile app with new UI and improved performance",
      status: "on-hold",
      startDate: "2023-05-01T08:00:00Z",
      targetEndDate: "2023-08-31T17:00:00Z",
      actualEndDate: null,
      organizationId: "org-01",
      teamId: "team-01",
      createdAt: "2023-04-15T10:45:00Z",
      updatedAt: "2023-06-20T13:15:00Z",
    },
  ],
  tags: [
    {
      id: "tag-01",
      name: "bug",
      color: "#FF0000",
      createdAt: "2023-01-15T08:30:00Z",
    },
    {
      id: "tag-02",
      name: "feature",
      color: "#00FF00",
      createdAt: "2023-01-15T08:31:00Z",
    },
    {
      id: "tag-03",
      name: "enhancement",
      color: "#0000FF",
      createdAt: "2023-01-15T08:32:00Z",
    },
    {
      id: "tag-04",
      name: "documentation",
      color: "#FFFF00",
      createdAt: "2023-01-15T08:33:00Z",
    },
    {
      id: "tag-05",
      name: "design",
      color: "#FF00FF",
      createdAt: "2023-01-15T08:34:00Z",
    },
    {
      id: "tag-06",
      name: "security",
      color: "#FF5500",
      createdAt: "2023-01-15T08:35:00Z",
    },
    {
      id: "tag-07",
      name: "performance",
      color: "#00FFFF",
      createdAt: "2023-01-15T08:36:00Z",
    },
    {
      id: "tag-08",
      name: "ux",
      color: "#5500FF",
      createdAt: "2023-01-15T08:37:00Z",
    },
    {
      id: "tag-09",
      name: "refactor",
      color: "#55FF00",
      createdAt: "2023-01-15T08:38:00Z",
    },
    {
      id: "tag-10",
      name: "testing",
      color: "#FFAA00",
      createdAt: "2023-01-15T08:39:00Z",
    },
  ],
  tasks: [
    {
      id: "task-01",
      title: "Design new user dashboard layout",
      description:
        "Create a modern, responsive layout for the user dashboard that shows key metrics and recent activity",
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      storyPoints: 8,
      startDate: "2023-03-05T09:00:00Z",
      dueDate: "2023-03-15T17:00:00Z",
      completedDate: "2023-03-14T16:30:00Z",
      estimatedHours: 20,
      actualHours: 18.5,
      projectId: "proj-01",
      assigneeId: "user-05",
      reporterId: "user-09",
      qaId: null,
      parentTaskId: null,
      createdAt: "2023-03-01T14:30:00Z",
      updatedAt: "2023-03-14T16:30:00Z",
    },
    {
      id: "task-02",
      title: "Implement new dashboard UI components",
      description:
        "Develop React components for the new dashboard design, including activity feed, metrics cards, and navigation",
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      storyPoints: 13,
      startDate: "2023-03-16T09:00:00Z",
      dueDate: "2023-03-30T17:00:00Z",
      completedDate: "2023-03-29T15:45:00Z",
      estimatedHours: 40,
      actualHours: 44.5,
      projectId: "proj-01",
      assigneeId: "user-02",
      reporterId: "user-09",
      qaId: "user-04",
      parentTaskId: "task-01",
      createdAt: "2023-03-10T11:15:00Z",
      updatedAt: "2023-03-29T15:45:00Z",
    },
    {
      id: "task-03",
      title: "Create API endpoints for dashboard data",
      description:
        "Develop backend API endpoints to provide data for the new dashboard components",
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      storyPoints: 8,
      startDate: "2023-03-16T09:00:00Z",
      dueDate: "2023-03-28T17:00:00Z",
      completedDate: "2023-03-27T14:30:00Z",
      estimatedHours: 24,
      actualHours: 22,
      projectId: "proj-01",
      assigneeId: "user-03",
      reporterId: "user-09",
      qaId: "user-04",
      parentTaskId: "task-01",
      createdAt: "2023-03-10T11:30:00Z",
      updatedAt: "2023-03-27T14:30:00Z",
    },
    {
      id: "task-04",
      title: "Integrate dashboard UI with API",
      description:
        "Connect the frontend dashboard components to the backend API endpoints",
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      storyPoints: 5,
      startDate: "2023-03-30T09:00:00Z",
      dueDate: "2023-04-05T17:00:00Z",
      completedDate: "2023-04-04T16:15:00Z",
      estimatedHours: 16,
      actualHours: 14,
      projectId: "proj-01",
      assigneeId: "user-06",
      reporterId: "user-09",
      qaId: "user-04",
      parentTaskId: null,
      createdAt: "2023-03-25T10:45:00Z",
      updatedAt: "2023-04-04T16:15:00Z",
    },
    {
      id: "task-05",
      title: "Write unit tests for dashboard components",
      description:
        "Develop comprehensive unit tests for all new dashboard React components",
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.MEDIUM,
      storyPoints: 5,
      startDate: "2023-04-06T09:00:00Z",
      dueDate: "2023-04-12T17:00:00Z",
      completedDate: "2023-04-11T15:30:00Z",
      estimatedHours: 16,
      actualHours: 18,
      projectId: "proj-01",
      assigneeId: "user-02",
      reporterId: "user-04",
      qaId: "user-04",
      parentTaskId: "task-02",
      createdAt: "2023-04-01T13:15:00Z",
      updatedAt: "2023-04-11T15:30:00Z",
    },
    {
      id: "task-06",
      title: "Implement user settings page",
      description:
        "Create a new page for users to manage their account settings and preferences",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      storyPoints: 8,
      startDate: "2023-04-17T09:00:00Z",
      dueDate: "2023-04-28T17:00:00Z",
      completedDate: null,
      estimatedHours: 24,
      actualHours: 16,
      projectId: "proj-01",
      assigneeId: "user-06",
      reporterId: "user-09",
      qaId: "user-04",
      parentTaskId: null,
      createdAt: "2023-04-10T11:00:00Z",
      updatedAt: "2023-04-24T14:45:00Z",
    },
    {
      id: "task-07",
      title: "Fix navigation menu responsiveness bug",
      description:
        "Fix issue where navigation menu doesn't display correctly on mobile devices",
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      storyPoints: 3,
      startDate: null,
      dueDate: "2023-05-05T17:00:00Z",
      completedDate: null,
      estimatedHours: 8,
      actualHours: null,
      projectId: "proj-01",
      assigneeId: "user-02",
      reporterId: "user-05",
      qaId: "user-04",
      parentTaskId: null,
      createdAt: "2023-04-20T09:30:00Z",
      updatedAt: "2023-04-20T09:30:00Z",
    },
    {
      id: "task-08",
      title: "Design API architecture",
      description:
        "Create comprehensive architecture documentation for the new API system",
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGHEST,
      storyPoints: 13,
      startDate: "2023-03-15T09:00:00Z",
      dueDate: "2023-03-31T17:00:00Z",
      completedDate: "2023-03-30T16:00:00Z",
      estimatedHours: 40,
      actualHours: 42,
      projectId: "proj-02",
      assigneeId: "user-12",
      reporterId: "user-10",
      qaId: null,
      parentTaskId: null,
      createdAt: "2023-03-10T13:45:00Z",
      updatedAt: "2023-03-30T16:00:00Z",
    },
    {
      id: "task-09",
      title: "Implement authentication microservice",
      description:
        "Develop a new microservice to handle user authentication and authorization",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      storyPoints: 13,
      startDate: "2023-04-03T09:00:00Z",
      dueDate: "2023-04-21T17:00:00Z",
      completedDate: null,
      estimatedHours: 40,
      actualHours: 30,
      projectId: "proj-02",
      assigneeId: "user-03",
      reporterId: "user-12",
      qaId: "user-04",
      parentTaskId: "task-08",
      createdAt: "2023-03-25T10:30:00Z",
      updatedAt: "2023-04-18T15:45:00Z",
    },
    {
      id: "task-10",
      title: "Configure Kubernetes deployment",
      description:
        "Set up Kubernetes configurations for deploying the new microservices architecture",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      storyPoints: 8,
      startDate: "2023-04-10T09:00:00Z",
      dueDate: "2023-04-24T17:00:00Z",
      completedDate: null,
      estimatedHours: 24,
      actualHours: 20,
      projectId: "proj-02",
      assigneeId: "user-08",
      reporterId: "user-12",
      qaId: null,
      parentTaskId: "task-08",
      createdAt: "2023-04-05T11:15:00Z",
      updatedAt: "2023-04-19T14:30:00Z",
    },
    {
      id: "task-11",
      title: "Research test automation frameworks",
      description:
        "Evaluate and recommend frameworks for automated testing across frontend and backend",
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.MEDIUM,
      storyPoints: 5,
      startDate: "2023-04-03T09:00:00Z",
      dueDate: "2023-04-14T17:00:00Z",
      completedDate: "2023-04-13T15:30:00Z",
      estimatedHours: 16,
      actualHours: 14,
      projectId: "proj-03",
      assigneeId: "user-04",
      reporterId: "user-04",
      qaId: null,
      parentTaskId: null,
      createdAt: "2023-03-30T13:45:00Z",
      updatedAt: "2023-04-13T15:30:00Z",
    },
    {
      id: "task-12",
      title: "Implement UI component library",
      description:
        "Create a reusable UI component library based on the new design system",
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      storyPoints: 13,
      startDate: "2023-02-20T09:00:00Z",
      dueDate: "2023-03-17T17:00:00Z",
      completedDate: "2023-03-15T16:30:00Z",
      estimatedHours: 40,
      actualHours: 36,
      projectId: "proj-04",
      assigneeId: "user-05",
      reporterId: "user-05",
      qaId: null,
      parentTaskId: null,
      createdAt: "2023-02-15T11:00:00Z",
      updatedAt: "2023-03-15T16:30:00Z",
    },
    {
      id: "task-13",
      title: "Design solar panel dashboard UI",
      description: "Create UI design for the solar panel monitoring dashboard",
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      storyPoints: 8,
      startDate: "2023-03-15T09:00:00Z",
      dueDate: "2023-03-29T17:00:00Z",
      completedDate: "2023-03-28T15:45:00Z",
      estimatedHours: 24,
      actualHours: 22,
      projectId: "proj-05",
      assigneeId: "user-05",
      reporterId: "user-09",
      qaId: null,
      parentTaskId: null,
      createdAt: "2023-03-10T10:30:00Z",
      updatedAt: "2023-03-28T15:45:00Z",
    },
    {
      id: "task-14",
      title: "Implement real-time data processing",
      description:
        "Develop system for processing and analyzing real-time data from solar panels",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      storyPoints: 13,
      startDate: "2023-04-05T09:00:00Z",
      dueDate: "2023-04-26T17:00:00Z",
      completedDate: null,
      estimatedHours: 40,
      actualHours: 32,
      projectId: "proj-05",
      assigneeId: "user-07",
      reporterId: "user-09",
      qaId: "user-04",
      parentTaskId: null,
      createdAt: "2023-03-30T13:15:00Z",
      updatedAt: "2023-04-20T11:30:00Z",
    },
    {
      id: "task-15",
      title: "Create data visualization components",
      description:
        "Develop reusable data visualization components for environmental data",
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      storyPoints: 8,
      startDate: null,
      dueDate: "2023-05-15T17:00:00Z",
      completedDate: null,
      estimatedHours: 24,
      actualHours: null,
      projectId: "proj-06",
      assigneeId: "user-07",
      reporterId: "user-09",
      qaId: null,
      parentTaskId: null,
      createdAt: "2023-04-15T10:45:00Z",
      updatedAt: "2023-04-15T10:45:00Z",
    },
    {
      id: "task-16",
      title: "Implement activity log feature",
      description:
        "Add user activity logging to track actions in the customer portal",
      status: TaskStatus.BLOCKED,
      priority: TaskPriority.MEDIUM,
      storyPoints: 5,
      startDate: "2023-04-24T09:00:00Z",
      dueDate: "2023-05-05T17:00:00Z",
      completedDate: null,
      estimatedHours: 16,
      actualHours: 8,
      projectId: "proj-01",
      assigneeId: "user-03",
      reporterId: "user-09",
      qaId: "user-04",
      parentTaskId: null,
      createdAt: "2023-04-17T14:30:00Z",
      updatedAt: "2023-04-26T11:15:00Z",
    },
    {
      id: "task-17",
      title: "Fix security vulnerability in authentication",
      description:
        "Address critical security vulnerability identified in the authentication process",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGHEST,
      storyPoints: 3,
      startDate: "2023-04-20T09:00:00Z",
      dueDate: "2023-04-25T17:00:00Z",
      completedDate: null,
      estimatedHours: 8,
      actualHours: 6,
      projectId: "proj-02",
      assigneeId: "user-03",
      reporterId: "user-10",
      qaId: "user-04",
      parentTaskId: "task-09",
      createdAt: "2023-04-19T15:30:00Z",
      updatedAt: "2023-04-22T10:45:00Z",
    },
    {
      id: "task-18",
      title: "Performance optimization for dashboard",
      description:
        "Improve loading time and rendering performance of the customer dashboard",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      storyPoints: 5,
      startDate: null,
      dueDate: "2023-05-12T17:00:00Z",
      completedDate: null,
      estimatedHours: 16,
      actualHours: null,
      projectId: "proj-01",
      assigneeId: "user-02",
      reporterId: "user-01",
      qaId: "user-04",
      parentTaskId: null,
      createdAt: "2023-04-25T11:45:00Z",
      updatedAt: "2023-04-25T11:45:00Z",
    },
    {
      id: "task-19",
      title: "Write documentation for API endpoints",
      description:
        "Create comprehensive documentation for all new API endpoints",
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      storyPoints: 3,
      startDate: null,
      dueDate: "2023-05-19T17:00:00Z",
      completedDate: null,
      estimatedHours: 8,
      actualHours: null,
      projectId: "proj-02",
      assigneeId: "user-12",
      reporterId: "user-12",
      qaId: null,
      parentTaskId: null,
      createdAt: "2023-04-28T09:30:00Z",
      updatedAt: "2023-04-28T09:30:00Z",
    },
    {
      id: "task-20",
      title: "Create automated deployment pipeline",
      description: "Set up CI/CD pipeline for automated testing and deployment",
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      storyPoints: 8,
      startDate: null,
      dueDate: "2023-05-26T17:00:00Z",
      completedDate: null,
      estimatedHours: 24,
      actualHours: null,
      projectId: "proj-03",
      assigneeId: "user-08",
      reporterId: "user-04",
      qaId: null,
      parentTaskId: null,
      createdAt: "2023-04-30T13:15:00Z",
      updatedAt: "2023-04-30T13:15:00Z",
    },
  ],
  taskTags: [
    { taskId: "task-01", tagId: "tag-05" },
    { taskId: "task-01", tagId: "tag-08" },
    { taskId: "task-02", tagId: "tag-02" },
    { taskId: "task-03", tagId: "tag-02" },
    { taskId: "task-04", tagId: "tag-02" },
    { taskId: "task-05", tagId: "tag-10" },
    { taskId: "task-06", tagId: "tag-02" },
    { taskId: "task-07", tagId: "tag-01" },
    { taskId: "task-07", tagId: "tag-08" },
    { taskId: "task-08", tagId: "tag-04" },
    { taskId: "task-08", tagId: "tag-05" },
    { taskId: "task-09", tagId: "tag-02" },
    { taskId: "task-09", tagId: "tag-06" },
    { taskId: "task-10", tagId: "tag-02" },
    { taskId: "task-11", tagId: "tag-10" },
    { taskId: "task-12", tagId: "tag-05" },
    { taskId: "task-12", tagId: "tag-02" },
    { taskId: "task-13", tagId: "tag-05" },
    { taskId: "task-14", tagId: "tag-02" },
    { taskId: "task-14", tagId: "tag-07" },
    { taskId: "task-15", tagId: "tag-02" },
    { taskId: "task-16", tagId: "tag-02" },
    { taskId: "task-17", tagId: "tag-01" },
    { taskId: "task-17", tagId: "tag-06" },
    { taskId: "task-18", tagId: "tag-03" },
    { taskId: "task-18", tagId: "tag-07" },
    { taskId: "task-19", tagId: "tag-04" },
    { taskId: "task-20", tagId: "tag-02" },
  ],
  comments: [
    {
      id: "comment-01",
      content:
        "I've uploaded the design mockups for review. Please check the attachments.",
      userId: "user-05",
      taskId: "task-01",
      parentCommentId: null,
      isEdited: false,
      createdAt: "2023-03-07T11:30:00Z",
      updatedAt: "2023-03-07T11:30:00Z",
    },
    {
      id: "comment-02",
      content:
        "The designs look great! Just one suggestion - can we make the metrics cards a bit more prominent?",
      userId: "user-09",
      taskId: "task-01",
      parentCommentId: "comment-01",
      isEdited: false,
      createdAt: "2023-03-08T09:45:00Z",
      updatedAt: "2023-03-08T09:45:00Z",
    },
    {
      id: "comment-03",
      content:
        "Good point. I'll update the mockups with more prominent metric cards.",
      userId: "user-05",
      taskId: "task-01",
      parentCommentId: "comment-02",
      isEdited: false,
      createdAt: "2023-03-08T13:15:00Z",
      updatedAt: "2023-03-08T13:15:00Z",
    },
    {
      id: "comment-04",
      content:
        "I've started implementing the components based on the approved designs.",
      userId: "user-02",
      taskId: "task-02",
      parentCommentId: null,
      isEdited: false,
      createdAt: "2023-03-17T10:30:00Z",
      updatedAt: "2023-03-17T10:30:00Z",
    },
    {
      id: "comment-05",
      content:
        "Running into some issues with the responsive layout for the activity feed. Will need to refactor the grid system.",
      userId: "user-02",
      taskId: "task-02",
      parentCommentId: null,
      isEdited: false,
      createdAt: "2023-03-22T14:45:00Z",
      updatedAt: "2023-03-22T14:45:00Z",
    },
    {
      id: "comment-06",
      content:
        "Have you tried using Flexbox instead of Grid for that component?",
      userId: "user-06",
      taskId: "task-02",
      parentCommentId: "comment-05",
      isEdited: false,
      createdAt: "2023-03-22T15:30:00Z",
      updatedAt: "2023-03-22T15:30:00Z",
    },
    {
      id: "comment-07",
      content: "Good suggestion. Switching to Flexbox solved the issue.",
      userId: "user-02",
      taskId: "task-02",
      parentCommentId: "comment-06",
      isEdited: false,
      createdAt: "2023-03-23T09:15:00Z",
      updatedAt: "2023-03-23T09:15:00Z",
    },
    {
      id: "comment-08",
      content:
        "First draft of the API architecture is ready for review. I've outlined the microservices structure and data flow.",
      userId: "user-12",
      taskId: "task-08",
      parentCommentId: null,
      isEdited: false,
      createdAt: "2023-03-20T13:45:00Z",
      updatedAt: "2023-03-20T13:45:00Z",
    },
    {
      id: "comment-09",
      content:
        "Looks comprehensive. I think we should add more details about the event-driven communication between services.",
      userId: "user-10",
      taskId: "task-08",
      parentCommentId: "comment-08",
      isEdited: false,
      createdAt: "2023-03-21T10:30:00Z",
      updatedAt: "2023-03-21T10:30:00Z",
    },
    {
      id: "comment-10",
      content:
        "Found a potential security vulnerability in the authentication flow. We're not properly validating JWT expiration.",
      userId: "user-10",
      taskId: "task-17",
      parentCommentId: null,
      isEdited: false,
      createdAt: "2023-04-19T15:15:00Z",
      updatedAt: "2023-04-19T15:15:00Z",
    },
    {
      id: "comment-11",
      content:
        "Critical issue, I'll prioritize this fix. Will implement proper token validation and expiration handling.",
      userId: "user-03",
      taskId: "task-17",
      parentCommentId: "comment-10",
      isEdited: false,
      createdAt: "2023-04-19T16:00:00Z",
      updatedAt: "2023-04-19T16:00:00Z",
    },
    {
      id: "comment-12",
      content:
        "The activity log feature is blocked because we need to finalize the data retention policy first.",
      userId: "user-03",
      taskId: "task-16",
      parentCommentId: null,
      isEdited: false,
      createdAt: "2023-04-26T11:00:00Z",
      updatedAt: "2023-04-26T11:00:00Z",
    },
    {
      id: "comment-13",
      content:
        "I'll schedule a meeting with the compliance team to finalize the data retention requirements.",
      userId: "user-09",
      taskId: "task-16",
      parentCommentId: "comment-12",
      isEdited: false,
      createdAt: "2023-04-26T11:30:00Z",
      updatedAt: "2023-04-26T11:30:00Z",
    },
    {
      id: "comment-14",
      content:
        "Test coverage for the new components is at 87%. We should aim for at least 90% before merging.",
      userId: "user-04",
      taskId: "task-05",
      parentCommentId: null,
      isEdited: false,
      createdAt: "2023-04-10T14:15:00Z",
      updatedAt: "2023-04-10T14:15:00Z",
    },
    {
      id: "comment-15",
      content: "Added more tests for edge cases. Coverage is now at 92%.",
      userId: "user-02",
      taskId: "task-05",
      parentCommentId: "comment-14",
      isEdited: false,
      createdAt: "2023-04-11T10:30:00Z",
      updatedAt: "2023-04-11T10:30:00Z",
    },
  ],
  fileAttachments: [
    {
      id: "file-01",
      fileName: "dashboard_mockups_v1.fig",
      fileUrl: "https://example.com/files/dashboard_mockups_v1.fig",
      fileType: "application/octet-stream",
      fileSize: 2456789,
      userId: "user-05",
      taskId: "task-01",
      createdAt: "2023-03-07T11:25:00Z",
    },
    {
      id: "file-02",
      fileName: "dashboard_mockups_v2.fig",
      fileUrl: "https://example.com/files/dashboard_mockups_v2.fig",
      fileType: "application/octet-stream",
      fileSize: 2567890,
      userId: "user-05",
      taskId: "task-01",
      createdAt: "2023-03-09T14:30:00Z",
    },
    {
      id: "file-03",
      fileName: "component_specs.pdf",
      fileUrl: "https://example.com/files/component_specs.pdf",
      fileType: "application/pdf",
      fileSize: 1234567,
      userId: "user-05",
      taskId: "task-02",
      createdAt: "2023-03-16T09:45:00Z",
    },
    {
      id: "file-04",
      fileName: "api_specs.pdf",
      fileUrl: "https://example.com/files/api_specs.pdf",
      fileType: "application/pdf",
      fileSize: 3456789,
      userId: "user-12",
      taskId: "task-08",
      createdAt: "2023-03-20T13:40:00Z",
    },
    {
      id: "file-05",
      fileName: "api_architecture_diagram.png",
      fileUrl: "https://example.com/files/api_architecture_diagram.png",
      fileType: "image/png",
      fileSize: 789012,
      userId: "user-12",
      taskId: "task-08",
      createdAt: "2023-03-20T13:42:00Z",
    },
    {
      id: "file-06",
      fileName: "dashboard_performance_report.pdf",
      fileUrl: "https://example.com/files/dashboard_performance_report.pdf",
      fileType: "application/pdf",
      fileSize: 567890,
      userId: "user-04",
      taskId: "task-18",
      createdAt: "2023-04-25T11:40:00Z",
    },
    {
      id: "file-07",
      fileName: "security_vulnerability_details.pdf",
      fileUrl: "https://example.com/files/security_vulnerability_details.pdf",
      fileType: "application/pdf",
      fileSize: 345678,
      userId: "user-10",
      taskId: "task-17",
      createdAt: "2023-04-19T15:10:00Z",
    },
    {
      id: "file-08",
      fileName: "test_framework_comparison.xlsx",
      fileUrl: "https://example.com/files/test_framework_comparison.xlsx",
      fileType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      fileSize: 456789,
      userId: "user-04",
      taskId: "task-11",
      createdAt: "2023-04-12T16:30:00Z",
    },
  ],
  taskHistory: [
    {
      id: "history-01",
      taskId: "task-01",
      fieldChanged: "status",
      oldValue: "TODO",
      newValue: "IN_PROGRESS",
      changedBy: "user-05",
      changedAt: "2023-03-05T09:00:00Z",
    },
    {
      id: "history-02",
      taskId: "task-01",
      fieldChanged: "status",
      oldValue: "IN_PROGRESS",
      newValue: "IN_REVIEW",
      changedBy: "user-05",
      changedAt: "2023-03-13T15:30:00Z",
    },
    {
      id: "history-03",
      taskId: "task-01",
      fieldChanged: "status",
      oldValue: "IN_REVIEW",
      newValue: "COMPLETED",
      changedBy: "user-09",
      changedAt: "2023-03-14T16:30:00Z",
    },
    {
      id: "history-04",
      taskId: "task-02",
      fieldChanged: "status",
      oldValue: "TODO",
      newValue: "IN_PROGRESS",
      changedBy: "user-02",
      changedAt: "2023-03-16T09:00:00Z",
    },
    {
      id: "history-05",
      taskId: "task-02",
      fieldChanged: "status",
      oldValue: "IN_PROGRESS",
      newValue: "IN_REVIEW",
      changedBy: "user-02",
      changedAt: "2023-03-28T14:15:00Z",
    },
    {
      id: "history-06",
      taskId: "task-02",
      fieldChanged: "status",
      oldValue: "IN_REVIEW",
      newValue: "COMPLETED",
      changedBy: "user-04",
      changedAt: "2023-03-29T15:45:00Z",
    },
    {
      id: "history-07",
      taskId: "task-03",
      fieldChanged: "status",
      oldValue: "TODO",
      newValue: "IN_PROGRESS",
      changedBy: "user-03",
      changedAt: "2023-03-16T09:00:00Z",
    },
    {
      id: "history-08",
      taskId: "task-03",
      fieldChanged: "status",
      oldValue: "IN_PROGRESS",
      newValue: "IN_REVIEW",
      changedBy: "user-03",
      changedAt: "2023-03-26T13:00:00Z",
    },
    {
      id: "history-09",
      taskId: "task-03",
      fieldChanged: "status",
      oldValue: "IN_REVIEW",
      newValue: "COMPLETED",
      changedBy: "user-04",
      changedAt: "2023-03-27T14:30:00Z",
    },
    {
      id: "history-10",
      taskId: "task-04",
      fieldChanged: "status",
      oldValue: "TODO",
      newValue: "IN_PROGRESS",
      changedBy: "user-06",
      changedAt: "2023-03-30T09:00:00Z",
    },
    {
      id: "history-11",
      taskId: "task-04",
      fieldChanged: "status",
      oldValue: "IN_PROGRESS",
      newValue: "IN_REVIEW",
      changedBy: "user-06",
      changedAt: "2023-04-03T16:00:00Z",
    },
    {
      id: "history-12",
      taskId: "task-04",
      fieldChanged: "status",
      oldValue: "IN_REVIEW",
      newValue: "COMPLETED",
      changedBy: "user-04",
      changedAt: "2023-04-04T16:15:00Z",
    },
    {
      id: "history-13",
      taskId: "task-05",
      fieldChanged: "status",
      oldValue: "TODO",
      newValue: "IN_PROGRESS",
      changedBy: "user-02",
      changedAt: "2023-04-06T09:00:00Z",
    },
    {
      id: "history-14",
      taskId: "task-05",
      fieldChanged: "status",
      oldValue: "IN_PROGRESS",
      newValue: "IN_REVIEW",
      changedBy: "user-02",
      changedAt: "2023-04-10T14:00:00Z",
    },
    {
      id: "history-15",
      taskId: "task-05",
      fieldChanged: "status",
      oldValue: "IN_REVIEW",
      newValue: "COMPLETED",
      changedBy: "user-04",
      changedAt: "2023-04-11T15:30:00Z",
    },
    {
      id: "history-16",
      taskId: "task-06",
      fieldChanged: "status",
      oldValue: "TODO",
      newValue: "IN_PROGRESS",
      changedBy: "user-06",
      changedAt: "2023-04-17T09:00:00Z",
    },
    {
      id: "history-17",
      taskId: "task-08",
      fieldChanged: "status",
      oldValue: "TODO",
      newValue: "IN_PROGRESS",
      changedBy: "user-12",
      changedAt: "2023-03-15T09:00:00Z",
    },
    {
      id: "history-18",
      taskId: "task-08",
      fieldChanged: "status",
      oldValue: "IN_PROGRESS",
      newValue: "IN_REVIEW",
      changedBy: "user-12",
      changedAt: "2023-03-29T14:00:00Z",
    },
    {
      id: "history-19",
      taskId: "task-08",
      fieldChanged: "status",
      oldValue: "IN_REVIEW",
      newValue: "COMPLETED",
      changedBy: "user-10",
      changedAt: "2023-03-30T16:00:00Z",
    },
    {
      id: "history-20",
      taskId: "task-09",
      fieldChanged: "status",
      oldValue: "TODO",
      newValue: "IN_PROGRESS",
      changedBy: "user-03",
      changedAt: "2023-04-03T09:00:00Z",
    },
    {
      id: "history-21",
      taskId: "task-10",
      fieldChanged: "status",
      oldValue: "TODO",
      newValue: "IN_PROGRESS",
      changedBy: "user-08",
      changedAt: "2023-04-10T09:00:00Z",
    },
    {
      id: "history-22",
      taskId: "task-11",
      fieldChanged: "status",
      oldValue: "TODO",
      newValue: "IN_PROGRESS",
      changedBy: "user-04",
      changedAt: "2023-04-03T09:00:00Z",
    },
    {
      id: "history-23",
      taskId: "task-11",
      fieldChanged: "status",
      oldValue: "IN_PROGRESS",
      newValue: "COMPLETED",
      changedBy: "user-04",
      changedAt: "2023-04-13T15:30:00Z",
    },
    {
      id: "history-24",
      taskId: "task-12",
      fieldChanged: "status",
      oldValue: "TODO",
      newValue: "IN_PROGRESS",
      changedBy: "user-05",
      changedAt: "2023-02-20T09:00:00Z",
    },
    {
      id: "history-25",
      taskId: "task-12",
      fieldChanged: "status",
      oldValue: "IN_PROGRESS",
      newValue: "IN_REVIEW",
      changedBy: "user-05",
      changedAt: "2023-03-14T14:30:00Z",
    },
    {
      id: "history-26",
      taskId: "task-12",
      fieldChanged: "status",
      oldValue: "IN_REVIEW",
      newValue: "COMPLETED",
      changedBy: "user-05",
      changedAt: "2023-03-15T16:30:00Z",
    },
    {
      id: "history-27",
      taskId: "task-13",
      fieldChanged: "status",
      oldValue: "TODO",
      newValue: "IN_PROGRESS",
      changedBy: "user-05",
      changedAt: "2023-03-15T09:00:00Z",
    },
    {
      id: "history-28",
      taskId: "task-13",
      fieldChanged: "status",
      oldValue: "IN_PROGRESS",
      newValue: "IN_REVIEW",
      changedBy: "user-05",
      changedAt: "2023-03-27T14:00:00Z",
    },
    {
      id: "history-29",
      taskId: "task-13",
      fieldChanged: "status",
      oldValue: "IN_REVIEW",
      newValue: "COMPLETED",
      changedBy: "user-09",
      changedAt: "2023-03-28T15:45:00Z",
    },
    {
      id: "history-30",
      taskId: "task-14",
      fieldChanged: "status",
      oldValue: "TODO",
      newValue: "IN_PROGRESS",
      changedBy: "user-07",
      changedAt: "2023-04-05T09:00:00Z",
    },
    {
      id: "history-31",
      taskId: "task-16",
      fieldChanged: "status",
      oldValue: "TODO",
      newValue: "IN_PROGRESS",
      changedBy: "user-03",
      changedAt: "2023-04-24T09:00:00Z",
    },
    {
      id: "history-32",
      taskId: "task-16",
      fieldChanged: "status",
      oldValue: "IN_PROGRESS",
      newValue: "BLOCKED",
      changedBy: "user-03",
      changedAt: "2023-04-26T11:15:00Z",
    },
    {
      id: "history-33",
      taskId: "task-17",
      fieldChanged: "status",
      oldValue: "TODO",
      newValue: "IN_PROGRESS",
      changedBy: "user-03",
      changedAt: "2023-04-20T09:00:00Z",
    },
    {
      id: "history-34",
      taskId: "task-06",
      fieldChanged: "estimatedHours",
      oldValue: "20",
      newValue: "24",
      changedBy: "user-09",
      changedAt: "2023-04-12T10:30:00Z",
    },
    {
      id: "history-35",
      taskId: "task-06",
      fieldChanged: "dueDate",
      oldValue: "2023-04-25T17:00:00Z",
      newValue: "2023-04-28T17:00:00Z",
      changedBy: "user-09",
      changedAt: "2023-04-12T10:35:00Z",
    },
    {
      id: "history-36",
      taskId: "task-04",
      fieldChanged: "actualHours",
      oldValue: "12",
      newValue: "14",
      changedBy: "user-06",
      changedAt: "2023-04-04T16:00:00Z",
    },
    {
      id: "history-37",
      taskId: "task-09",
      fieldChanged: "priority",
      oldValue: "MEDIUM",
      newValue: "HIGH",
      changedBy: "user-12",
      changedAt: "2023-04-05T11:15:00Z",
    },
    {
      id: "history-38",
      taskId: "task-14",
      fieldChanged: "actualHours",
      oldValue: "24",
      newValue: "32",
      changedBy: "user-07",
      changedAt: "2023-04-20T11:30:00Z",
    },
    {
      id: "history-39",
      taskId: "task-17",
      fieldChanged: "priority",
      oldValue: "HIGH",
      newValue: "HIGHEST",
      changedBy: "user-10",
      changedAt: "2023-04-19T15:30:00Z",
    },
    {
      id: "history-40",
      taskId: "task-17",
      fieldChanged: "actualHours",
      oldValue: "4",
      newValue: "6",
      changedBy: "user-03",
      changedAt: "2023-04-22T10:45:00Z",
    },
  ],
};

export const getTaskById = (id: string) => {
  return mockData.tasks.find((task) => task.id === id);
};

export default mockData;
