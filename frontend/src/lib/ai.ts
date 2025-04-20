import { mockData, TaskStatus } from "@/mock-data";

// Available AI models on OpenRouter
export const aiModels = [
  { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic" },
  { id: "anthropic/claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic" },
  { id: "anthropic/claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
  { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
  { id: "meta-llama/llama-3-70b-instruct", name: "Llama 3 70B", provider: "Meta" },
];

// Default model to use
export const defaultModel = "meta-llama/llama-3-70b-instruct";

interface AIResponse {
  summary: string;
  isLoading: boolean;
  error: string | null;
}

// API configuration
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api";

// Use mock data in development if API is not available
const USE_MOCK_DATA =
  import.meta.env.NODE_ENV === "development" &&
  (!import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_USE_MOCK_DATA === "true");

// Local frontend cache
interface CacheEntry {
  summary: string;
  timestamp: number;
  model: string;
}

const summaryCache = {
  task: new Map<string, CacheEntry>(),
  project: new Map<string, CacheEntry>(),
  team: new Map<string, CacheEntry>(),
};

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// Enhanced AIResponse with cache information
interface EnhancedAIResponse extends AIResponse {
  isCached?: boolean;
  generatedAt?: number;
}

// Generate a project summary
export const generateProjectSummary = async (
  projectId: string,
  model: string = defaultModel,
  forceRefresh: boolean = false
): Promise<EnhancedAIResponse> => {
  // Check the cache first (unless forcing refresh)
  const cacheKey = projectId;
  
  if (!forceRefresh) {
    const cachedData = summaryCache.project.get(cacheKey);
    
    if (
      cachedData && 
      cachedData.model === model && 
      (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION
    ) {
      console.log(`Returning cached project summary for ${projectId}`);
      return {
        summary: cachedData.summary,
        isLoading: false,
        error: null,
        isCached: true,
        generatedAt: cachedData.timestamp
      };
    }
  }
  
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000));
    
    // Find the project
    const project = mockData.projects.find(p => p.id === projectId);
    if (!project) {
      return {
        summary: "",
        isLoading: false,
        error: "Project not found",
        isCached: false
      };
    }
    
    // Get tasks for this project
    const projectTasks = mockData.tasks.filter(task => task.projectId === projectId);
    
    // Calculate task statistics
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const inProgressTasks = projectTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
    const todoTasks = projectTasks.filter(t => t.status === TaskStatus.TODO).length;
    const blockedTasks = projectTasks.filter(t => t.status === TaskStatus.BLOCKED).length;
    
    // Get team information
    const team = project.teamId ? mockData.teams.find(t => t.id === project.teamId) : null;
    
    // Generate mock summary
    const summary = `## Project Summary: ${project.name}
      
Status: ${project.status.toUpperCase()}
Progress: ${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% complete

${project.description || "No description provided."}

### Tasks:
- Completed: ${completedTasks}/${totalTasks} (${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%)
- In Progress: ${inProgressTasks}
- Todo: ${todoTasks}
- Blocked: ${blockedTasks}

${team ? `### Team: ${team.name}\nThis project is assigned to the ${team.name} team.` : "No team assigned to this project."}

### Recent Activity:
The team has ${completedTasks > 0 ? `completed ${completedTasks} tasks` : "not completed any tasks yet"} and has ${inProgressTasks} tasks currently in progress.
${blockedTasks > 0 ? `⚠️ There are ${blockedTasks} blocked tasks that need attention.` : ""}

### Timeline:
${project.startDate ? `Start Date: ${new Date(project.startDate).toLocaleDateString()}` : "No start date specified."}
${project.targetEndDate ? `Target End Date: ${new Date(project.targetEndDate).toLocaleDateString()}` : "No target end date specified."}`;

    // Update cache with new summary
    const now = Date.now();
    summaryCache.project.set(cacheKey, {
      summary,
      timestamp: now,
      model
    });
    
    return {
      summary,
      isLoading: false,
      error: null,
      isCached: false,
      generatedAt: now
    };
  }

  try {
    const response = await fetch(`${API_URL}/ai/project-summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        model,
        forceRefresh
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate project summary");
    }

    const data = await response.json();
    
    // Update cache with API response
    const now = Date.now();
    summaryCache.project.set(cacheKey, {
      summary: data.summary,
      timestamp: now,
      model
    });
    
    return {
      summary: data.summary,
      isLoading: false,
      error: null,
      isCached: false,
      generatedAt: now
    };
  } catch (error) {
    console.error("Error generating project summary:", error);
    return {
      summary: "",
      isLoading: false,
      error: (error as Error).message,
      isCached: false
    };
  }
};

// Generate a team summary
export const generateTeamSummary = async (
  teamId: string,
  model: string = defaultModel,
  forceRefresh: boolean = false
): Promise<EnhancedAIResponse> => {
  // Check the cache first (unless forcing refresh)
  const cacheKey = teamId;
  
  if (!forceRefresh) {
    const cachedData = summaryCache.team.get(cacheKey);
    
    if (
      cachedData && 
      cachedData.model === model && 
      (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION
    ) {
      console.log(`Returning cached team summary for ${teamId}`);
      return {
        summary: cachedData.summary,
        isLoading: false,
        error: null,
        isCached: true,
        generatedAt: cachedData.timestamp
      };
    }
  }
  
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000));
    
    // Find the team
    const team = mockData.teams.find(t => t.id === teamId);
    if (!team) {
      return {
        summary: "",
        isLoading: false,
        error: "Team not found",
        isCached: false
      };
    }
    
    // Get team members
    const teamMembers = mockData.teamMembers.filter(tm => tm.teamId === teamId);
    
    // Get projects assigned to this team
    const teamProjects = mockData.projects.filter(p => p.teamId === teamId);
    
    // Get all tasks for this team's projects
    const allTeamTasks = mockData.tasks.filter(task => 
      teamProjects.some(p => p.id === task.projectId)
    );
    
    // Calculate task statistics
    const totalTasks = allTeamTasks.length;
    const completedTasks = allTeamTasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const inProgressTasks = allTeamTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
    const todoTasks = allTeamTasks.filter(t => t.status === TaskStatus.TODO).length;
    const blockedTasks = allTeamTasks.filter(t => t.status === TaskStatus.BLOCKED).length;
    
    // Generate mock summary
    const summary = `## Team Summary: ${team.name}
      
${team.description || "No team description provided."}

### Team Composition:
- ${teamMembers.length} team members
${teamMembers.length > 0 ? teamMembers.map(tm => {
  const user = mockData.users.find(u => u.id === tm.userId);
  return `- ${user?.name || user?.email || "Unknown user"} (${tm.role})`;
}).join('\n') : "No team members assigned."}

### Projects:
- ${teamProjects.length} active projects
${teamProjects.length > 0 ? teamProjects.map(p => {
  const projectTasks = mockData.tasks.filter(t => t.projectId === p.id);
  const projectCompletedTasks = projectTasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const progress = projectTasks.length > 0 ? Math.round((projectCompletedTasks / projectTasks.length) * 100) : 0;
  return `- ${p.name}: ${progress}% complete (${p.status})`;
}).join('\n') : "No projects assigned to this team."}

### Task Overview:
- Completed: ${completedTasks}/${totalTasks} (${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%)
- In Progress: ${inProgressTasks}
- Todo: ${todoTasks}
- Blocked: ${blockedTasks}

### This Week's Focus:
The team is currently focused on ${inProgressTasks > 0 ? `${inProgressTasks} tasks in progress` : "getting started with new tasks"}.
${blockedTasks > 0 ? `⚠️ There are ${blockedTasks} blocked tasks that need attention.` : ""}`;

    // Update cache with new summary
    const now = Date.now();
    summaryCache.team.set(cacheKey, {
      summary,
      timestamp: now,
      model
    });
    
    return {
      summary,
      isLoading: false,
      error: null,
      isCached: false,
      generatedAt: now
    };
  }

  try {
    const response = await fetch(`${API_URL}/ai/team-summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId,
        model,
        forceRefresh
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate team summary");
    }

    const data = await response.json();
    
    // Update cache with API response
    const now = Date.now();
    summaryCache.team.set(cacheKey, {
      summary: data.summary,
      timestamp: now,
      model
    });
    
    return {
      summary: data.summary,
      isLoading: false,
      error: null,
      isCached: false,
      generatedAt: now
    };
  } catch (error) {
    console.error("Error generating team summary:", error);
    return {
      summary: "",
      isLoading: false,
      error: (error as Error).message,
      isCached: false
    };
  }
};

// Generate a task summary
export const generateTaskSummary = async (
  taskId: string,
  model: string = defaultModel,
  forceRefresh: boolean = false
): Promise<EnhancedAIResponse> => {
  // Check the cache first (unless forcing refresh)
  const cacheKey = taskId;
  
  if (!forceRefresh) {
    const cachedData = summaryCache.task.get(cacheKey);
    
    if (
      cachedData && 
      cachedData.model === model && 
      (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION
    ) {
      console.log(`Returning cached task summary for ${taskId}`);
      return {
        summary: cachedData.summary,
        isLoading: false,
        error: null,
        isCached: true,
        generatedAt: cachedData.timestamp
      };
    }
  }
  
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000));
    
    // Find the task
    const task = mockData.tasks.find(t => t.id === taskId);
    if (!task) {
      return {
        summary: "",
        isLoading: false,
        error: "Task not found",
        isCached: false
      };
    }
    
    // Get project information
    const project = mockData.projects.find(p => p.id === task.projectId);
    
    // Get assignee information
    const assignee = task.assigneeId ? mockData.users.find(u => u.id === task.assigneeId) : null;
    
    // Get task comments
    const taskComments = mockData.taskComments.filter(tc => tc.taskId === taskId);
    
    // Get task history
    const taskHistory = mockData.taskHistory.filter(th => th.taskId === taskId);
    
    // Get task attachments
    const taskAttachments = mockData.fileAttachments.filter(fa => fa.taskId === taskId);
    
    // Calculate time metrics
    const createdAt = task.createdAt ? new Date(task.createdAt) : null;
    const now = new Date();
    const daysOpen = createdAt ? Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    // Generate mock summary
    const summary = `## Task Summary: ${task.title}
      
Status: ${task.status.replace(/_/g, " ")}
${task.priority ? `Priority: ${task.priority}` : ""}
${project ? `Project: ${project.name}` : ""}

${task.description || "No description provided."}

### Key Information:
${assignee ? `- Assigned to: ${assignee.name || assignee.email}` : "- Unassigned"}
- Open for: ${daysOpen} days
${task.storyPoints ? `- Story Points: ${task.storyPoints}` : ""}
${task.estimatedHours ? `- Estimated Hours: ${task.estimatedHours}h` : ""}
${task.actualHours ? `- Actual Hours: ${task.actualHours}h` : ""}

### Activity:
- ${taskComments.length} comments
- ${taskHistory.length} status changes
- ${taskAttachments.length} attachments

### Recent Updates:
${taskHistory.length > 0 ? 
  `Last updated ${new Date(taskHistory[0].changedAt).toLocaleDateString()}: 
  Changed ${taskHistory[0].fieldChanged} from "${taskHistory[0].oldValue}" to "${taskHistory[0].newValue}"` 
  : "No recent updates"}

### Next Steps:
${task.status === TaskStatus.TODO ? "This task is ready to be started." : ""}
${task.status === TaskStatus.IN_PROGRESS ? "This task is currently in progress." : ""}
${task.status === TaskStatus.IN_REVIEW ? "This task is waiting for review." : ""}
${task.status === TaskStatus.BLOCKED ? "⚠️ This task is currently blocked and needs attention." : ""}
${task.status === TaskStatus.COMPLETED ? "✅ This task has been completed." : ""}`;

    // Update cache with new summary
    const currentTime = Date.now();
    summaryCache.task.set(cacheKey, {
      summary,
      timestamp: currentTime,
      model
    });
    
    return {
      summary,
      isLoading: false,
      error: null,
      isCached: false,
      generatedAt: currentTime
    };
  }

  try {
    const response = await fetch(`${API_URL}/ai/task-summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId,
        model,
        forceRefresh
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate task summary");
    }

    const data = await response.json();
    
    // Update cache with API response
    const now = Date.now();
    summaryCache.task.set(cacheKey, {
      summary: data.summary,
      timestamp: now,
      model
    });
    
    return {
      summary: data.summary,
      isLoading: false,
      error: null,
      isCached: false,
      generatedAt: now
    };
  } catch (error) {
    console.error("Error generating task summary:", error);
    return {
      summary: "",
      isLoading: false,
      error: (error as Error).message,
      isCached: false
    };
  }
};