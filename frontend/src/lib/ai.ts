import { mockData, TaskPriority, TaskStatus } from "@/mock-data";

// Available AI models on OpenRouter
export const aiModels = [
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
  },
  {
    id: "anthropic/claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
  },
  {
    id: "anthropic/claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
  },
  { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
  {
    id: "meta-llama/llama-3-70b-instruct",
    name: "Llama 3 70B",
    provider: "Meta",
  },
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
      Date.now() - cachedData.timestamp < CACHE_EXPIRATION
    ) {
      console.log(`Returning cached project summary for ${projectId}`);
      return {
        summary: cachedData.summary,
        isLoading: false,
        error: null,
        isCached: true,
        generatedAt: cachedData.timestamp,
      };
    }
  }

  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000));

    // Find the project
    const project = mockData.projects.find((p) => p.id === projectId);
    if (!project) {
      return {
        summary: "",
        isLoading: false,
        error: "Project not found",
        isCached: false,
      };
    }

    // Get tasks for this project
    const projectTasks = mockData.tasks.filter(
      (task) => task.projectId === projectId
    );

    // Calculate task statistics
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(
      (t) => t.status === TaskStatus.COMPLETED
    ).length;
    const inProgressTasks = projectTasks.filter(
      (t) => t.status === TaskStatus.IN_PROGRESS
    ).length;
    const todoTasks = projectTasks.filter(
      (t) => t.status === TaskStatus.TODO
    ).length;
    const blockedTasks = projectTasks.filter(
      (t) => t.status === TaskStatus.BLOCKED
    ).length;

    // Get team information
    const team = project.teamId
      ? mockData.teams.find((t) => t.id === project.teamId)
      : null;

    // Generate mock summary with enhanced markdown formatting
    const summary = `# Executive Overview: ${project.name}

Status: **${project.status.toUpperCase()}** | Progress: **${
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    }%** complete

${project.description || "No description provided."}

## For Executive Leadership
This project is currently ${
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    }% complete and is ${
      project.targetEndDate
        ? new Date(project.targetEndDate) > new Date()
          ? "**on track**"
          : "**behind schedule**"
        : "**timeline undefined**"
    } relative to target completion. Resource allocation is appropriate with ${
      team
        ? `the ${team.name} team fully engaged`
        : "no team currently assigned"
    }.

> The project's strategic value remains high, with expected market impact in Q3 along with a 15-20% improvement in customer engagement metrics.

## For Product Management
User story completion rate is **${
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    }%** with ${completedTasks} features delivered to date. Initial user testing shows positive reception, with usability scores ${
      completedTasks > 5 ? "exceeding" : "meeting"
    } targets.

${
  blockedTasks > 0
    ? `There are **${blockedTasks} blocked tasks** that require product owner attention, primarily related to requirement clarification.`
    : "All features have clear requirements and no product-level blockers exist."
}

## For Engineering Leadership
Technical implementation is ${
      inProgressTasks > todoTasks ? "proceeding well" : "in early stages"
    } with **${inProgressTasks} tasks** actively in development. The architecture decisions have proven sound, with no major refactoring required.

Code quality metrics show ${
      completedTasks > 3 ? "strong" : "acceptable"
    } test coverage and code review thoroughness. ${
      blockedTasks > 0
        ? `Technical challenges exist around ${blockedTasks} specific implementation areas.`
        : "No significant technical blockers have been identified."
    }

## Current Focus Areas
1. **Task completion** - Focus on the ${inProgressTasks} in-progress tasks
2. **Quality assurance** - Comprehensive testing of the ${completedTasks} completed features
${
  blockedTasks > 0
    ? `3. **Blocker resolution** - Addressing the ${blockedTasks} blocked tasks`
    : `3. **Planning** - Preparing for the next phase of development`
}

## Risk Management
* **${blockedTasks > 0 ? "High" : "Low"} risk**: Development blockers - ${
      blockedTasks > 0
        ? `${blockedTasks} tasks currently delayed, requiring intervention`
        : "No current blockers, developers are progressing smoothly"
    }
* **Medium risk**: Timeline pressure - ${
      project.targetEndDate
        ? `Target date of ${new Date(
            project.targetEndDate
          ).toLocaleDateString()} requires focused execution`
        : "Undefined target date creates scheduling uncertainty"
    }
* **Low risk**: Resource constraints - ${
      team
        ? `${team.name} team is adequately staffed`
        : "Team assignment pending, which may impact velocity"
    }

### Timeline
${
  project.startDate
    ? `* **Start Date**: ${new Date(project.startDate).toLocaleDateString()}`
    : "* **Start Date**: Not yet specified"
}
${
  project.targetEndDate
    ? `* **Target Completion**: ${new Date(
        project.targetEndDate
      ).toLocaleDateString()}`
    : "* **Target Completion**: Not yet specified"
}`;

    // Update cache with new summary
    const now = Date.now();
    summaryCache.project.set(cacheKey, {
      summary,
      timestamp: now,
      model,
    });

    return {
      summary,
      isLoading: false,
      error: null,
      isCached: false,
      generatedAt: now,
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
        forceRefresh,
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
      model,
    });

    return {
      summary: data.summary,
      isLoading: false,
      error: null,
      isCached: false,
      generatedAt: now,
    };
  } catch (error) {
    console.error("Error generating project summary:", error);
    return {
      summary: "",
      isLoading: false,
      error: (error as Error).message,
      isCached: false,
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
      Date.now() - cachedData.timestamp < CACHE_EXPIRATION
    ) {
      console.log(`Returning cached team summary for ${teamId}`);
      return {
        summary: cachedData.summary,
        isLoading: false,
        error: null,
        isCached: true,
        generatedAt: cachedData.timestamp,
      };
    }
  }

  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000));

    // Find the team
    const team = mockData.teams.find((t) => t.id === teamId);
    if (!team) {
      return {
        summary: "",
        isLoading: false,
        error: "Team not found",
        isCached: false,
      };
    }

    // Get team members
    const teamMembers = mockData.teamMembers.filter(
      (tm) => tm.teamId === teamId
    );

    // Get projects assigned to this team
    const teamProjects = mockData.projects.filter((p) => p.teamId === teamId);

    // Get all tasks for this team's projects
    const allTeamTasks = mockData.tasks.filter((task) =>
      teamProjects.some((p) => p.id === task.projectId)
    );

    // Calculate task statistics
    const totalTasks = allTeamTasks.length;
    const completedTasks = allTeamTasks.filter(
      (t) => t.status === TaskStatus.COMPLETED
    ).length;
    const inProgressTasks = allTeamTasks.filter(
      (t) => t.status === TaskStatus.IN_PROGRESS
    ).length;
    // const todoTasks = allTeamTasks.filter(t => t.status === TaskStatus.TODO).length;
    const blockedTasks = allTeamTasks.filter(
      (t) => t.status === TaskStatus.BLOCKED
    ).length;

    // Generate mock summary with proper markdown formatting
    const summary = `# Team Performance Report: ${team.name}
      
${team.description || "No team description provided."}

## For the CEO
This team is responsible for **${
      teamProjects.length
    } active projects** representing approximately 40% of our current development pipeline. Their work has contributed to an estimated **18% increase in feature delivery** compared to last quarter.

> Team productivity is trending upward with a ${
      completedTasks > 5 ? "strong" : "moderate"
    } completion rate of ${
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    }% on assigned tasks.

## For the CTO
The team demonstrates ${
      completedTasks > inProgressTasks ? "excellent" : "good"
    } technical execution with **${completedTasks} completed tasks** this cycle. Code quality metrics show consistent test coverage and code review practices.

${
  blockedTasks > 0
    ? `There are currently **${blockedTasks} blocked tasks** that require technical intervention, primarily related to integration points with external systems.`
    : "No significant technical blockers exist at this time."
}

## For the Director of Product
Cross-functional collaboration is ${
      teamMembers.length > 3 ? "strong" : "developing"
    }, with the team actively engaging stakeholders throughout the development process. Requirements gathering has improved by an estimated 25% since last quarter.

${
  inProgressTasks > 0
    ? `The team is making good progress on ${inProgressTasks} in-flight tasks, with estimated completion in the next sprint cycle.`
    : "The team is preparing to begin the next set of prioritized features."
}

## Current Focus & Capacity
* Project planning: **30%** of capacity - ${
      teamProjects.length > 0 ? "Active" : "Not started"
    }
* Feature development: **${inProgressTasks > 0 ? 50 : 30}%** of capacity - ${
      inProgressTasks > 0 ? "In progress" : "Planning phase"
    }
* Testing and QA: **${completedTasks > 0 ? 20 : 10}%** of capacity - ${
      completedTasks > 0 ? "Active" : "Not started"
    }
${blockedTasks > 0 ? `* Addressing blockers: **20%** of capacity - Urgent` : ""}

## Team Composition
${
  teamMembers.length > 0
    ? teamMembers
        .map((tm, i) => {
          const user = mockData.users.find((u) => u.id === tm.userId);
          return `${i + 1}. **${
            user?.name || user?.email || "Unknown user"
          }** - ${tm.role}`;
        })
        .join("\n")
    : "No team members assigned at this time."
}

## Project Portfolio
${
  teamProjects.length > 0
    ? teamProjects
        .map((p) => {
          const projectTasks = mockData.tasks.filter(
            (t) => t.projectId === p.id
          );
          const projectCompletedTasks = projectTasks.filter(
            (t) => t.status === TaskStatus.COMPLETED
          ).length;
          const progress =
            projectTasks.length > 0
              ? Math.round((projectCompletedTasks / projectTasks.length) * 100)
              : 0;
          return `* **${p.name}**: ${progress}% complete (${p.status})`;
        })
        .join("\n")
    : "No projects currently assigned to this team."
}`;

    // Update cache with new summary
    const now = Date.now();
    summaryCache.team.set(cacheKey, {
      summary,
      timestamp: now,
      model,
    });

    return {
      summary,
      isLoading: false,
      error: null,
      isCached: false,
      generatedAt: now,
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
        forceRefresh,
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
      model,
    });

    return {
      summary: data.summary,
      isLoading: false,
      error: null,
      isCached: false,
      generatedAt: now,
    };
  } catch (error) {
    console.error("Error generating team summary:", error);
    return {
      summary: "",
      isLoading: false,
      error: (error as Error).message,
      isCached: false,
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
      Date.now() - cachedData.timestamp < CACHE_EXPIRATION
    ) {
      console.log(`Returning cached task summary for ${taskId}`);
      return {
        summary: cachedData.summary,
        isLoading: false,
        error: null,
        isCached: true,
        generatedAt: cachedData.timestamp,
      };
    }
  }

  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000));

    // Find the task
    const task = mockData.tasks.find((t) => t.id === taskId);
    if (!task) {
      return {
        summary: "",
        isLoading: false,
        error: "Task not found",
        isCached: false,
      };
    }

    // Get project information
    const project = mockData.projects.find((p) => p.id === task.projectId);

    // Get assignee information
    const assignee = task.assigneeId
      ? mockData.users.find((u) => u.id === task.assigneeId)
      : null;

    // Get task comments
    const taskComments = mockData.comments.filter((tc) => tc.taskId === taskId);

    // Get task history
    const taskHistory = mockData.taskHistory.filter(
      (th) => th.taskId === taskId
    );

    // Get task attachments
    const taskAttachments = mockData.fileAttachments.filter(
      (fa) => fa.taskId === taskId
    );

    // Calculate time metrics
    const createdAt = task.createdAt ? new Date(task.createdAt) : null;
    const now = new Date();
    const daysOpen = createdAt
      ? Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

    // Generate mock summary with rich markdown formatting
    const summary = `# Executive Summary: ${task.title}

Status: **${task.status.replace(/_/g, " ")}** | ${
      task.priority ? `Priority: **${task.priority}**` : ""
    } | ${project ? `Project: **${project.name}**` : ""}

${task.description || "No description provided."}

${
  assignee
    ? `> This task is assigned to **${
        assignee.name || assignee.email
      }** and has been open for **${daysOpen} days**.`
    : "> This task is currently **unassigned** and requires attention."
}

## For the Product Owner
This task ${
      task.status === TaskStatus.COMPLETED
        ? "has been **successfully completed**"
        : task.status === TaskStatus.IN_PROGRESS
        ? "is **in active development**"
        : task.status === TaskStatus.BLOCKED
        ? "is currently **blocked**"
        : "is **awaiting development**"
    } and represents a ${
      task.priority === TaskPriority.HIGH ||
      task.priority === TaskPriority.HIGHEST
        ? "**critical**"
        : task.priority === TaskPriority.MEDIUM
        ? "**moderate**"
        : "**minor**"
    } component of the ${project ? project.name : "project"}.

${
  taskComments.length > 0
    ? `Team communication is active with **${taskComments.length} comments**, indicating good collaboration.`
    : "Communication on this task is limited, suggesting a need for more team engagement."
}

## For the CTO
The technical implementation ${
      task.status === TaskStatus.COMPLETED
        ? "has been completed successfully"
        : task.status === TaskStatus.IN_PROGRESS
        ? "is progressing according to design specifications"
        : task.status === TaskStatus.BLOCKED
        ? "has encountered technical challenges"
        : "is planned and ready for development"
    }.

${
  task.storyPoints
    ? `Complexity is estimated at **${
        task.storyPoints
      } story points**, indicating a ${
        task.storyPoints > 5
          ? "significant"
          : task.storyPoints > 2
          ? "moderate"
          : "small"
      } technical footprint.`
    : ""
}

${
  task.status === TaskStatus.BLOCKED
    ? `**Technical blockers**: This task requires intervention to resolve integration issues with existing systems.`
    : ""
}

## For Team Leadership
Resource allocation appears ${
      assignee ? "appropriate" : "incomplete, as the task remains unassigned"
    } for this ${
      task.priority === TaskPriority.HIGH ||
      task.priority === TaskPriority.HIGHEST
        ? "high-priority"
        : task.priority === TaskPriority.MEDIUM
        ? "medium-priority"
        : "low-priority"
    } task.

${
  task.estimatedHours
    ? `Time estimation is **${task.estimatedHours}h** ${
        task.actualHours
          ? `with **${task.actualHours}h** already invested (${Math.round(
              (task.actualHours / task.estimatedHours) * 100
            )}% of estimate)`
          : "with no time tracked yet"
      }.`
    : "No time estimation has been provided for this task."
}

${
  taskHistory.length > 0
    ? `**Activity tracking**: The task shows healthy progress with ${taskHistory.length} recorded status changes.`
    : "**Activity tracking**: Limited history suggests this task may need more attention."
}

## Risk Assessment
* **${
      task.status === TaskStatus.BLOCKED
        ? "High"
        : task.status === TaskStatus.IN_PROGRESS
        ? "Medium"
        : "Low"
    } risk**: Completion timeline - ${
      task.status === TaskStatus.BLOCKED
        ? "Currently blocked with no clear resolution timeline"
        : task.status === TaskStatus.IN_PROGRESS
        ? "Progress being made but requires monitoring"
        : task.status === TaskStatus.COMPLETED
        ? "Successfully completed with no lingering concerns"
        : "Not yet started but appears straightforward"
    }

* **${
      taskAttachments.length === 0 ? "Medium" : "Low"
    } risk**: Documentation - ${
      taskAttachments.length > 0
        ? `Well-documented with ${taskAttachments.length} supporting files`
        : "Limited documentation could impact knowledge transfer"
    }

## Key Metrics
* **Duration**: Open for ${daysOpen} days
${task.storyPoints ? `* **Complexity**: ${task.storyPoints} story points` : ""}
${task.estimatedHours ? `* **Estimated effort**: ${task.estimatedHours}h` : ""}
${task.actualHours ? `* **Actual effort**: ${task.actualHours}h` : ""}
* **Engagement**: ${taskComments.length} comments, ${
      taskHistory.length
    } status updates, ${taskAttachments.length} attachments

## Recent Activity
${
  taskHistory.length > 0
    ? `Last updated on **${new Date(
        taskHistory[0].changedAt
      ).toLocaleDateString()}**:  
  Changed **${taskHistory[0].fieldChanged}** from "${
        taskHistory[0].oldValue
      }" to "${taskHistory[0].newValue}"`
    : "No recent updates recorded for this task."
}

## Next Steps
${
  task.status === TaskStatus.TODO
    ? "1. **Assign resources** to this task\n2. **Begin development** according to specifications\n3. **Update status** once work has commenced"
    : task.status === TaskStatus.IN_PROGRESS
    ? "1. **Continue development** of remaining features\n2. **Document progress** regularly\n3. **Prepare for review** once implementation is complete"
    : task.status === TaskStatus.IN_REVIEW
    ? "1. **Complete review process** with appropriate stakeholders\n2. **Address feedback** from reviewers\n3. **Prepare for release** once approved"
    : task.status === TaskStatus.BLOCKED
    ? "1. **Identify and resolve blockers** preventing progress\n2. **Escalate if necessary** to appropriate leadership\n3. **Resume development** once obstacles are cleared"
    : "1. **Verify completeness** against acceptance criteria\n2. **Document lessons learned** for future reference\n3. **Close related items** if applicable"
}`;

    // Update cache with new summary
    const currentTime = Date.now();
    summaryCache.task.set(cacheKey, {
      summary,
      timestamp: currentTime,
      model,
    });

    return {
      summary,
      isLoading: false,
      error: null,
      isCached: false,
      generatedAt: currentTime,
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
        forceRefresh,
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
      model,
    });

    return {
      summary: data.summary,
      isLoading: false,
      error: null,
      isCached: false,
      generatedAt: now,
    };
  } catch (error) {
    console.error("Error generating task summary:", error);
    return {
      summary: "",
      isLoading: false,
      error: (error as Error).message,
      isCached: false,
    };
  }
};
