import { MockData } from "./types";
import { organizations } from "./organizations";
import { teams } from "./teams";
import { users } from "./users";
import { teamMembers } from "./team-members";
import { projects } from "./projects";
import { tags } from "./tags";
import { tasks } from "./tasks";
import { taskTags } from "./task-tags";
import { comments } from "./comments";
import { fileAttachments } from "./file-attachments";
import { taskHistory } from "./task-history";

export * from "./types";

// Create the mock data with proper typing
export const mockData: MockData = {
  organizations,
  teams,
  users,
  teamMembers,
  projects,
  tags,
  tasks,
  taskTags,
  comments,
  fileAttachments,
  taskHistory,
};

export const getTaskById = (id: string) => {
  return mockData.tasks.find((task) => task.id === id);
};

export const getProjectById = (id: string) => {
  return mockData.projects.find((project) => project.id === id);
};

export const getTeamById = (id: string) => {
  return mockData.teams.find((team) => team.id === id);
};

export const getUserById = (id: string) => {
  return mockData.users.find((user) => user.id === id);
};

export const getTaskHistoryById = (id: string) => {
  return mockData.taskHistory.filter((history) => history.taskId === id);
};

export const getTaskCommentsById = (id: string) => {
  return mockData.comments.filter((comment) => comment.taskId === id);
};

export const getTaskAttachmentsById = (id: string) => {
  return mockData.fileAttachments.filter(
    (attachment) => attachment.taskId === id
  );
};

export const getTaskTagsById = (id: string) => {
  return mockData.taskTags.filter((tag) => tag.taskId === id);
};
