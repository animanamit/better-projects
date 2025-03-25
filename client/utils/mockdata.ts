// Types based on your database schema
export type User = {
  id: number;
  cognitoId: string;
  username: string;
  profilePictureUrl: string | null;
  teamId: number | null;
};

export type Team = {
  id: number;
  teamName: string;
  productOwnerUserId: number;
  projectManagerUserId: number;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string | null; // ISO date string
};

export type Task = {
  id: number;
  title: string;
  description: string;
  status: "Backlog" | "To Do" | "In Progress" | "In Review" | "Done";
  priority: "Low" | "Medium" | "High" | "Critical";
  tags: string[];
  startDate: string | null; // ISO date string
  dueDate: string | null; // ISO date string
  points: number | null;
  projectId: number;
  authorUserId: number;
  assignedUserId: number | null;
};

export type Comment = {
  id: number;
  text: string;
  taskId: number;
  userId: number;
  createdAt: string; // ISO date string
};

export type Attachment = {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
  uploadedAt: string; // ISO date string
};

export type TaskAssignment = {
  id: number;
  userId: number;
  taskId: number;
};

export type ProjectTeam = {
  id: number;
  teamId: number;
  projectId: number;
};

// Mock Users
export const users: User[] = [
  {
    id: 1,
    cognitoId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    username: "johndoe",
    profilePictureUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    teamId: 1,
  },
  {
    id: 2,
    cognitoId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    username: "janedoe",
    profilePictureUrl: "https://randomuser.me/api/portraits/women/1.jpg",
    teamId: 1,
  },
  {
    id: 3,
    cognitoId: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    username: "bobsmith",
    profilePictureUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    teamId: 1,
  },
  {
    id: 4,
    cognitoId: "d4e5f6a7-b8c9-0123-defg-234567890123",
    username: "alicejones",
    profilePictureUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    teamId: 2,
  },
  {
    id: 5,
    cognitoId: "e5f6a7b8-c9d0-1234-efgh-345678901234",
    username: "charliebrown",
    profilePictureUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    teamId: 2,
  },
  {
    id: 6,
    cognitoId: "f6a7b8c9-d0e1-2345-fghi-456789012345",
    username: "lucywilliams",
    profilePictureUrl: "https://randomuser.me/api/portraits/women/3.jpg",
    teamId: 2,
  },
  {
    id: 7,
    cognitoId: "g7b8c9d0-e1f2-3456-ghij-567890123456",
    username: "davidmiller",
    profilePictureUrl: "https://randomuser.me/api/portraits/men/4.jpg",
    teamId: 3,
  },
  {
    id: 8,
    cognitoId: "h8c9d0e1-f2g3-4567-hijk-678901234567",
    username: "evadavis",
    profilePictureUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    teamId: 3,
  },
];

// Mock Teams
export const teams: Team[] = [
  {
    id: 1,
    teamName: "Frontend Development",
    productOwnerUserId: 1,
    projectManagerUserId: 2,
  },
  {
    id: 2,
    teamName: "Backend Development",
    productOwnerUserId: 4,
    projectManagerUserId: 5,
  },
  {
    id: 3,
    teamName: "QA & Testing",
    productOwnerUserId: 7,
    projectManagerUserId: 8,
  },
];

// Mock Projects
export const projects: Project[] = [
  {
    id: 1,
    name: "E-commerce Platform Redesign",
    description:
      "Redesign the user interface and improve the user experience of our e-commerce platform to increase conversion rates and customer satisfaction.",
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2025-04-30T00:00:00Z",
  },
  {
    id: 2,
    name: "Mobile App Development",
    description:
      "Create a native mobile application for iOS and Android that allows users to access our services on the go with full functionality.",
    startDate: "2025-02-15T00:00:00Z",
    endDate: "2025-07-31T00:00:00Z",
  },
  {
    id: 3,
    name: "API Modernization",
    description:
      "Refactor and modernize our existing API infrastructure to improve performance, security, and developer experience.",
    startDate: "2025-03-01T00:00:00Z",
    endDate: null,
  },
  {
    id: 4,
    name: "Data Analytics Dashboard",
    description:
      "Build a comprehensive analytics dashboard that provides real-time insights into business metrics and user behavior.",
    startDate: "2025-02-01T00:00:00Z",
    endDate: "2025-05-15T00:00:00Z",
  },
];

// Mock Tasks
export const tasks: Task[] = [
  {
    id: 1,
    title: "Design homepage wireframes",
    description:
      "Create wireframes for the new homepage design including desktop, tablet, and mobile versions.",
    status: "Done",
    priority: "High",
    tags: ["design", "ui", "wireframe"],
    startDate: "2025-01-05T00:00:00Z",
    dueDate: "2025-01-15T00:00:00Z",
    points: 5,
    projectId: 1,
    authorUserId: 1,
    assignedUserId: 2,
  },
  {
    id: 2,
    title: "Implement responsive navbar",
    description:
      "Code the responsive navigation bar according to the approved design. Should work on all device sizes.",
    status: "In Progress",
    priority: "Medium",
    tags: ["frontend", "responsive", "html", "css"],
    startDate: "2025-01-16T00:00:00Z",
    dueDate: "2025-01-23T00:00:00Z",
    points: 3,
    projectId: 1,
    authorUserId: 2,
    assignedUserId: 3,
  },
  {
    id: 3,
    title: "Product catalog API endpoint",
    description:
      "Create a new API endpoint to fetch product catalog data with filtering, sorting, and pagination capabilities.",
    status: "To Do",
    priority: "High",
    tags: ["backend", "api", "database"],
    startDate: null,
    dueDate: "2025-02-10T00:00:00Z",
    points: 8,
    projectId: 1,
    authorUserId: 4,
    assignedUserId: 5,
  },
  {
    id: 4,
    title: "Setup authentication workflow",
    description:
      "Implement user authentication including login, registration, password reset, and email verification.",
    status: "In Review",
    priority: "Critical",
    tags: ["auth", "security", "backend"],
    startDate: "2025-01-10T00:00:00Z",
    dueDate: "2025-01-30T00:00:00Z",
    points: 13,
    projectId: 2,
    authorUserId: 5,
    assignedUserId: 6,
  },
  {
    id: 5,
    title: "Create onboarding screens",
    description:
      "Design and implement the onboarding flow for new users with interactive tutorials and tooltips.",
    status: "Backlog",
    priority: "Medium",
    tags: ["ux", "onboarding", "frontend"],
    startDate: null,
    dueDate: null,
    points: 5,
    projectId: 2,
    authorUserId: 2,
    assignedUserId: null,
  },
  {
    id: 6,
    title: "Implement push notifications",
    description:
      "Add push notification functionality to the mobile app for order updates, promotions, and user activity.",
    status: "Backlog",
    priority: "Low",
    tags: ["mobile", "notifications"],
    startDate: null,
    dueDate: null,
    points: 5,
    projectId: 2,
    authorUserId: 4,
    assignedUserId: null,
  },
  {
    id: 7,
    title: "Optimize database queries",
    description:
      "Review and optimize slow database queries to improve overall application performance.",
    status: "In Progress",
    priority: "High",
    tags: ["database", "performance", "optimization"],
    startDate: "2025-03-05T00:00:00Z",
    dueDate: "2025-03-15T00:00:00Z",
    points: 8,
    projectId: 3,
    authorUserId: 5,
    assignedUserId: 5,
  },
  {
    id: 8,
    title: "Add GraphQL support",
    description:
      "Extend the API to support GraphQL queries alongside the existing REST endpoints.",
    status: "To Do",
    priority: "Medium",
    tags: ["graphql", "api", "backend"],
    startDate: null,
    dueDate: "2025-04-01T00:00:00Z",
    points: 13,
    projectId: 3,
    authorUserId: 4,
    assignedUserId: 6,
  },
  {
    id: 9,
    title: "Create sales dashboard",
    description:
      "Develop an interactive dashboard showing key sales metrics with filtering options.",
    status: "In Progress",
    priority: "Critical",
    tags: ["dashboard", "analytics", "charts"],
    startDate: "2025-02-10T00:00:00Z",
    dueDate: "2025-03-01T00:00:00Z",
    points: 8,
    projectId: 4,
    authorUserId: 1,
    assignedUserId: 3,
  },
  {
    id: 10,
    title: "Implement data export feature",
    description:
      "Add functionality to export dashboard data in CSV, Excel, and PDF formats.",
    status: "To Do",
    priority: "Medium",
    tags: ["export", "data", "frontend"],
    startDate: null,
    dueDate: "2025-03-15T00:00:00Z",
    points: 5,
    projectId: 4,
    authorUserId: 2,
    assignedUserId: 7,
  },
  {
    id: 11,
    title: "Write automated tests",
    description:
      "Create end-to-end and integration tests for critical user flows in the application.",
    status: "To Do",
    priority: "High",
    tags: ["testing", "automation", "qa"],
    startDate: null,
    dueDate: "2025-04-15T00:00:00Z",
    points: 8,
    projectId: 1,
    authorUserId: 7,
    assignedUserId: 8,
  },
  {
    id: 12,
    title: "Performance testing",
    description:
      "Conduct load and stress testing to identify performance bottlenecks under high traffic conditions.",
    status: "Backlog",
    priority: "Medium",
    tags: ["performance", "testing", "qa"],
    startDate: null,
    dueDate: null,
    points: 5,
    projectId: 2,
    authorUserId: 8,
    assignedUserId: null,
  },
];

// Mock Comments
export const comments: Comment[] = [
  {
    id: 1,
    text: "I've started working on the wireframes. Will share the first draft by tomorrow.",
    taskId: 1,
    userId: 2,
    createdAt: "2025-01-06T10:15:00Z",
  },
  {
    id: 2,
    text: "Looks good! Make sure to include tablet view as well.",
    taskId: 1,
    userId: 1,
    createdAt: "2025-01-07T09:30:00Z",
  },
  {
    id: 3,
    text: "I've uploaded the final wireframes. Ready for review.",
    taskId: 1,
    userId: 2,
    createdAt: "2025-01-14T16:45:00Z",
  },
  {
    id: 4,
    text: "Running into issues with the responsive breakpoints. Will need another day.",
    taskId: 2,
    userId: 3,
    createdAt: "2025-01-20T14:20:00Z",
  },
  {
    id: 5,
    text: "No problem. Let me know if you need any help with the CSS.",
    taskId: 2,
    userId: 2,
    createdAt: "2025-01-20T15:10:00Z",
  },
  {
    id: 6,
    text: "Should we use JWT or session-based authentication?",
    taskId: 4,
    userId: 6,
    createdAt: "2025-01-12T11:05:00Z",
  },
  {
    id: 7,
    text: "Let's go with JWT. It'll work better with our mobile app in the future.",
    taskId: 4,
    userId: 5,
    createdAt: "2025-01-12T13:25:00Z",
  },
  {
    id: 8,
    text: "I've identified the slow queries. Working on optimizing them now.",
    taskId: 7,
    userId: 5,
    createdAt: "2025-03-06T09:15:00Z",
  },
  {
    id: 9,
    text: "Initial version of the sales dashboard is ready for review.",
    taskId: 9,
    userId: 3,
    createdAt: "2025-02-20T17:30:00Z",
  },
  {
    id: 10,
    text: "Looks good! Can we add a date range selector at the top?",
    taskId: 9,
    userId: 1,
    createdAt: "2025-02-21T10:45:00Z",
  },
];

// Mock Attachments
export const attachments: Attachment[] = [
  {
    id: 1,
    fileURL: "/mock/attachments/homepage-wireframes.pdf",
    fileName: "homepage-wireframes.pdf",
    taskId: 1,
    uploadedById: 2,
    uploadedAt: "2025-01-14T16:40:00Z",
  },
  {
    id: 2,
    fileURL: "/mock/attachments/navbar-component-screenshot.png",
    fileName: "navbar-component-screenshot.png",
    taskId: 2,
    uploadedById: 3,
    uploadedAt: "2025-01-18T11:25:00Z",
  },
  {
    id: 3,
    fileURL: "/mock/attachments/auth-flow-diagram.jpg",
    fileName: "auth-flow-diagram.jpg",
    taskId: 4,
    uploadedById: 6,
    uploadedAt: "2025-01-15T09:10:00Z",
  },
  {
    id: 4,
    fileURL: "/mock/attachments/database-optimization-report.pdf",
    fileName: "database-optimization-report.pdf",
    taskId: 7,
    uploadedById: 5,
    uploadedAt: "2025-03-10T14:35:00Z",
  },
  {
    id: 5,
    fileURL: "/mock/attachments/sales-dashboard-screenshot.png",
    fileName: "sales-dashboard-screenshot.png",
    taskId: 9,
    uploadedById: 3,
    uploadedAt: "2025-02-20T17:25:00Z",
  },
];

// Mock Task Assignments (for tasks with multiple assignees)
export const taskAssignments: TaskAssignment[] = [
  {
    id: 1,
    userId: 2,
    taskId: 1,
  },
  {
    id: 2,
    userId: 3,
    taskId: 2,
  },
  {
    id: 3,
    userId: 5,
    taskId: 3,
  },
  {
    id: 4,
    userId: 6,
    taskId: 4,
  },
  {
    id: 5,
    userId: 2,
    taskId: 9,
  },
  {
    id: 6,
    userId: 3,
    taskId: 9,
  },
];

// Mock Project Team associations
export const projectTeams: ProjectTeam[] = [
  {
    id: 1,
    teamId: 1,
    projectId: 1,
  },
  {
    id: 2,
    teamId: 1,
    projectId: 2,
  },
  {
    id: 3,
    teamId: 2,
    projectId: 2,
  },
  {
    id: 4,
    teamId: 2,
    projectId: 3,
  },
  {
    id: 5,
    teamId: 1,
    projectId: 4,
  },
  {
    id: 6,
    teamId: 3,
    projectId: 1,
  },
  {
    id: 7,
    teamId: 3,
    projectId: 2,
  },
];

// Helper functions to simulate API responses
export const mockApi = {
  // User-related functions
  getUsers: () => Promise.resolve([...users]),
  getUserById: (id: number) =>
    Promise.resolve(users.find((user) => user.id === id) || null),
  getUsersByTeamId: (teamId: number) =>
    Promise.resolve(users.filter((user) => user.teamId === teamId)),

  // Team-related functions
  getTeams: () => Promise.resolve([...teams]),
  getTeamById: (id: number) =>
    Promise.resolve(teams.find((team) => team.id === id) || null),
  getTeamsByProjectId: (projectId: number) => {
    const teamIds = projectTeams
      .filter((pt) => pt.projectId === projectId)
      .map((pt) => pt.teamId);
    return Promise.resolve(teams.filter((team) => teamIds.includes(team.id)));
  },

  // Project-related functions
  getProjects: () => Promise.resolve([...projects]),
  getProjectById: (id: number) =>
    Promise.resolve(projects.find((project) => project.id === id) || null),
  getProjectsByTeamId: (teamId: number) => {
    const projectIds = projectTeams
      .filter((pt) => pt.teamId === teamId)
      .map((pt) => pt.projectId);
    return Promise.resolve(
      projects.filter((project) => projectIds.includes(project.id))
    );
  },

  // Task-related functions
  getTasks: () => Promise.resolve([...tasks]),
  getTaskById: (id: number) =>
    Promise.resolve(tasks.find((task) => task.id === id) || null),
  getTasksByProjectId: (projectId: number) =>
    Promise.resolve(tasks.filter((task) => task.projectId === projectId)),
  getTasksByAssignedUserId: (userId: number) =>
    Promise.resolve(tasks.filter((task) => task.assignedUserId === userId)),
  getTasksByStatus: (status: string) =>
    Promise.resolve(tasks.filter((task) => task.status === status)),

  // Comment-related functions
  getCommentsByTaskId: (taskId: number) =>
    Promise.resolve(comments.filter((comment) => comment.taskId === taskId)),

  // Attachment-related functions
  getAttachmentsByTaskId: (taskId: number) =>
    Promise.resolve(
      attachments.filter((attachment) => attachment.taskId === taskId)
    ),

  // Advanced queries
  getTasksWithDetails: () => {
    return Promise.resolve(
      tasks.map((task) => {
        const project = projects.find((p) => p.id === task.projectId);
        const author = users.find((u) => u.id === task.authorUserId);
        const assignee = task.assignedUserId
          ? users.find((u) => u.id === task.assignedUserId)
          : null;
        const taskComments = comments.filter((c) => c.taskId === task.id);
        const taskAttachments = attachments.filter((a) => a.taskId === task.id);

        return {
          ...task,
          project: project ? { id: project.id, name: project.name } : null,
          author: author
            ? {
                id: author.id,
                username: author.username,
                profilePictureUrl: author.profilePictureUrl,
              }
            : null,
          assignee: assignee
            ? {
                id: assignee.id,
                username: assignee.username,
                profilePictureUrl: assignee.profilePictureUrl,
              }
            : null,
          commentsCount: taskComments.length,
          attachmentsCount: taskAttachments.length,
        };
      })
    );
  },

  getUserWithAssignedTasks: (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return Promise.resolve(null);

    const assignedTasks = tasks.filter(
      (task) => task.assignedUserId === userId
    );
    return Promise.resolve({
      ...user,
      assignedTasks,
    });
  },

  getProjectDetails: (projectId: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return Promise.resolve(null);

    const projectTasks = tasks.filter((task) => task.projectId === projectId);
    const teamIds = projectTeams
      .filter((pt) => pt.projectId === projectId)
      .map((pt) => pt.teamId);
    const projectTeamsData = teams.filter((team) => teamIds.includes(team.id));

    const tasksByStatus = {
      Backlog: projectTasks.filter((t) => t.status === "Backlog").length,
      "To Do": projectTasks.filter((t) => t.status === "To Do").length,
      "In Progress": projectTasks.filter((t) => t.status === "In Progress")
        .length,
      "In Review": projectTasks.filter((t) => t.status === "In Review").length,
      Done: projectTasks.filter((t) => t.status === "Done").length,
    };

    return Promise.resolve({
      ...project,
      tasks: projectTasks,
      teams: projectTeamsData,
      tasksByStatus,
      completionPercentage:
        projectTasks.length > 0
          ? Math.round(
              (projectTasks.filter((t) => t.status === "Done").length /
                projectTasks.length) *
                100
            )
          : 0,
    });
  },
};

export default mockApi;
