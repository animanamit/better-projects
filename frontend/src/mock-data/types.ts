// Define task status and priority enums
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
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
  numComments: number;
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

export interface MockData {
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
}