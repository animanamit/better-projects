import { Request, Response } from "express";
import dotenv from "dotenv";
import * as path from "path";
// Import task status and priority enums
enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  BLOCKED = "BLOCKED",
  COMPLETED = "COMPLETED"
}

enum TaskPriority {
  LOWEST = "LOWEST",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  HIGHEST = "HIGHEST"
}

// Load environment variables with proper path
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// OpenRouter API key - should be stored in environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ""; 
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Interface for parsed task
interface ParsedTask {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  estimatedHours?: number;
  tags?: string[];
  dueDate?: string;
}

// Helper function to make requests to OpenRouter
async function callOpenRouter(
  model: string,
  systemPrompt: string,
  userPrompt: string
) {
  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://better-projects.app", // Replace with your actual domain
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to call OpenRouter API");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    throw error;
  }
}

// Generate a summary for a task
export function taskSummary(req: Request, res: Response) {
  const { taskId, model } = req.body;

  if (!taskId) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  // Using mock data
  const taskData = {
    id: taskId,
    title: "Sample Task",
    description: "This is a sample task description",
    status: "IN_PROGRESS",
  };

  // Define prompts
  const systemPrompt = `
    You are an AI assistant specialized in project management. Your task is to analyze the given task data 
    and provide a concise, informative summary of the task's current status, progress, and key details.
    
    Format your response as Markdown with clear sections for status, description, key information, activity, and next steps.
    Be professional, factual, and highlight actionable insights or issues that need attention.
    
    Important requirements:
    1. Include 1-2 specific points of contact (POCs) for people who need more information about this task
    2. If the task is blocked or encountering difficulties, highlight the situation in a constructive manner, focusing on how others can help
    3. Identify any potential impacts or dependencies with other tasks/projects, especially where conflicts might arise
  `;

  const userPrompt = `
    Please analyze the following task data and generate a comprehensive summary:
    
    ${JSON.stringify(taskData, null, 2)}
    
    Include the following sections in your summary:
    1. Task title and status
    2. Key information (assignee, time open, priority, etc.)
    3. Activity summary (comments, status changes, etc.)
    4. Points of contact for questions or assistance
    5. If blocked, what support is needed to unblock
    6. Related tasks or projects that may be affected
    7. Recent updates
    8. Next steps or recommendations
  `;

  // Call OpenRouter API or use mock response
  if (!OPENROUTER_API_KEY) {
    // Mock response
    const summary = `## Task Summary: Sample Task
    
Status: IN PROGRESS

This is a sample task description.

### Key Information:
- Assigned to: John Doe
- Open for: 5 days
- Priority: Medium

### Activity:
- 3 comments
- 2 status changes
- 1 attachment

### Recent Updates:
Last updated 2023-04-19: Changed status from "TODO" to "IN_PROGRESS"

### Next Steps:
This task is currently in progress. The next step would be to complete the implementation and move to testing.`;

    return res.json({ summary });
  } else {
    // Call actual API
    callOpenRouter(model, systemPrompt, userPrompt)
      .then(summary => {
        res.json({ summary });
      })
      .catch(error => {
        console.error("Error generating task summary:", error);
        res.status(500).json({ error: "Failed to generate task summary" });
      });
  }
}

// Generate a summary for a project
export function projectSummary(req: Request, res: Response) {
  const { projectId, model } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: "Project ID is required" });
  }

  // Using mock data
  const projectData = {
    id: projectId,
    name: "Sample Project",
    description: "This is a sample project description",
    status: "active",
    tasks: [
      { status: "TODO", title: "Task 1" },
      { status: "IN_PROGRESS", title: "Task 2" },
      { status: "COMPLETED", title: "Task 3" },
    ],
    team: {
      name: "Sample Team",
      members: [
        { user: { name: "John Doe", email: "john@example.com" } },
        { user: { name: "Jane Smith", email: "jane@example.com" } },
      ],
    },
  };

  // Define prompts
  const systemPrompt = `
    You are an AI assistant specialized in project management. Your task is to analyze the given project data 
    and provide a concise, informative summary of the project's current status, progress, and key details.
    
    Format your response as Markdown with clear sections for status, description, tasks, team, and timeline.
    Be professional, factual, and highlight actionable insights or issues that need attention.
    
    Important requirements:
    1. Include 1-2 specific points of contact (POCs) for people who need more information about this project
    2. Highlight any blocked individuals or teams in a constructive manner, focusing on how others can help them
    3. Identify any potential impacts or dependencies with other projects, especially where conflicts might arise
  `;

  const userPrompt = `
    Please analyze the following project data and generate a comprehensive summary:
    
    ${JSON.stringify(projectData, null, 2)}
    
    Include the following sections in your summary:
    1. Project name and status
    2. Progress overview (completed vs. total tasks)
    3. Task breakdown by status
    4. Team overview
    5. Timeline information
    6. Points of contact for questions or assistance
    7. Blocked individuals or teams who need help
    8. Cross-project dependencies and potential conflicts
    9. Any critical issues or roadblocks
  `;

  // Call OpenRouter API or use mock response
  if (!OPENROUTER_API_KEY) {
    // Mock response
    const summary = `## Project Summary: Sample Project
    
Status: ACTIVE
Progress: 33% complete

This is a sample project description.

### Tasks:
- Completed: 1/3 (33%)
- In Progress: 1/3
- Todo: 1/3
- Blocked: 0/3

### Team: Sample Team
This project is assigned to the Sample Team with 2 team members.

### Recent Activity:
The team has completed 1 task and has 1 task currently in progress.

### Timeline:
No specific timeline information available.`;

    return res.json({ summary });
  } else {
    // Call actual API
    callOpenRouter(model, systemPrompt, userPrompt)
      .then(summary => {
        res.json({ summary });
      })
      .catch(error => {
        console.error("Error generating project summary:", error);
        res.status(500).json({ error: "Failed to generate project summary" });
      });
  }
}

// Generate a summary for a team
// Create task using natural language
export function createTask(req: Request, res: Response) {
  const { prompt, model } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // Define prompts
  const systemPrompt = `
    You are an AI assistant specializing in project management. Your task is to analyze a natural language 
    description of a task and extract structured information from it. Extract the following components:
    
    1. A concise title for the task (max 60 characters)
    2. A detailed description of what needs to be done
    3. The priority level of the task (LOWEST, LOW, MEDIUM, HIGH, HIGHEST)
    4. Any time estimates mentioned (in hours)
    5. Any tags or categories that should be associated with the task
    6. Any due date mentioned
    
    Respond ONLY with a JSON object containing these fields. Do not include explanations or additional text.
    The JSON should have this structure:
    {
      "title": "string",
      "description": "string",
      "priority": "MEDIUM", // One of: LOWEST, LOW, MEDIUM, HIGH, HIGHEST
      "estimatedHours": number, // Optional
      "tags": ["string"], // Optional array of strings
      "dueDate": "YYYY-MM-DD" // Optional ISO date format
    }
    
    If any field cannot be determined from the input, omit it from the JSON response.
  `;

  const userPrompt = `
    Please extract structured task information from the following description:
    
    ${prompt}
  `;

  // Call OpenRouter API or use mock response
  if (!OPENROUTER_API_KEY) {
    // Mock extraction if no API key is available
    const mockTask = extractTaskDataMock(prompt);
    return res.json({ task: mockTask });
  } else {
    // Call actual API
    callOpenRouter(model, systemPrompt, userPrompt)
      .then(responseContent => {
        try {
          // Parse JSON from the response
          const parsedTask = JSON.parse(responseContent as string) as ParsedTask;
          
          // Ensure task has the basic required fields
          const task: ParsedTask = {
            title: parsedTask.title || prompt.slice(0, 60),
            description: parsedTask.description || prompt,
            status: TaskStatus.TODO,
            priority: parsedTask.priority || TaskPriority.MEDIUM,
            estimatedHours: parsedTask.estimatedHours,
            tags: parsedTask.tags,
            dueDate: parsedTask.dueDate
          };
          
          res.json({ task });
        } catch (error) {
          console.error("Error parsing task data from API response:", error);
          
          // Fall back to mock extraction if parsing fails
          const mockTask = extractTaskDataMock(prompt);
          res.json({ task: mockTask });
        }
      })
      .catch(error => {
        console.error("Error generating task data:", error);
        
        // Fall back to mock extraction if API call fails
        const mockTask = extractTaskDataMock(prompt);
        res.json({ task: mockTask });
      });
  }
}

// Mock implementation for task extraction without API
function extractTaskDataMock(prompt: string): ParsedTask {
  // Extract title (first line or first sentence if single line)
  const lines = prompt.split('\n').filter(line => line.trim() !== '');
  let title = lines[0] || prompt;
  if (lines.length === 1 && prompt.includes('.')) {
    title = prompt.split('.')[0] + '.';
  }
  // Truncate if too long
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }
  
  // Rest is description
  const description = lines.length > 1 
    ? lines.slice(1).join('\n') 
    : (prompt.length > title.length ? prompt.substring(title.length).trim() : '');
  
  // Extract priority if mentioned
  let priority = TaskPriority.MEDIUM;
  if (
    prompt.toLowerCase().includes('urgent') || 
    prompt.toLowerCase().includes('critical') ||
    prompt.toLowerCase().includes('highest priority')
  ) {
    priority = TaskPriority.HIGHEST;
  } else if (
    prompt.toLowerCase().includes('high priority') ||
    prompt.toLowerCase().includes('important')
  ) {
    priority = TaskPriority.HIGH;
  } else if (
    prompt.toLowerCase().includes('low priority') ||
    prompt.toLowerCase().includes('whenever')
  ) {
    priority = TaskPriority.LOW;
  }
  
  // Extract estimated hours if mentioned
  let estimatedHours: number | undefined = undefined;
  const hourMatches = prompt.match(/(\d+)\s*hours?/i) || prompt.match(/take[s]?\s*(\d+)\s*hours?/i);
  if (hourMatches && hourMatches[1]) {
    estimatedHours = parseInt(hourMatches[1], 10);
  }
  
  // Extract tags based on common keywords
  const potentialTags = ['bug', 'feature', 'ui', 'api', 'documentation', 'testing', 'design', 'frontend', 'backend'];
  const tags = potentialTags.filter(tag => 
    prompt.toLowerCase().includes(tag.toLowerCase())
  );
  
  // Extract due date if mentioned
  let dueDate: string | undefined = undefined;
  const dateMatches = prompt.match(/due\s*(?:date|by)?\s*(?:on|by)?\s*([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s*\d{4})?)/i);
  if (dateMatches && dateMatches[1]) {
    try {
      const parsedDate = new Date(dateMatches[1]);
      if (!isNaN(parsedDate.getTime())) {
        dueDate = parsedDate.toISOString().split('T')[0];
      }
    } catch (e) {
      // Parsing failed, ignore
    }
  }
  
  return {
    title,
    description,
    priority,
    status: TaskStatus.TODO,
    estimatedHours,
    tags: tags.length > 0 ? tags : undefined,
    dueDate,
  };
}

export function teamSummary(req: Request, res: Response) {
  const { teamId, model } = req.body;

  if (!teamId) {
    return res.status(400).json({ error: "Team ID is required" });
  }

  // Using mock data
  const teamData = {
    id: teamId,
    name: "Sample Team",
    description: "This is a sample team description",
    members: [
      { user: { name: "John Doe", email: "john@example.com" }, role: "Team Lead" },
      { user: { name: "Jane Smith", email: "jane@example.com" }, role: "Developer" },
    ],
    projects: [
      {
        name: "Project A",
        status: "active",
        tasks: [
          { status: "TODO" },
          { status: "IN_PROGRESS" },
          { status: "COMPLETED" },
        ],
      },
      {
        name: "Project B",
        status: "active",
        tasks: [
          { status: "TODO" },
          { status: "COMPLETED" },
        ],
      },
    ],
    organization: {
      name: "Sample Organization",
    },
  };

  // Define prompts
  const systemPrompt = `
    You are an AI assistant specialized in project management and team coordination. Your task is to analyze the given team data 
    and provide a concise, informative summary of the team's composition, projects, and current workload.
    
    Format your response as Markdown with clear sections for team composition, projects, and task overview.
    Be professional, factual, and highlight actionable insights or issues that need attention.
    
    Important requirements:
    1. Include 1-2 specific points of contact (POCs) for people who need more information about this team
    2. Highlight any blocked individuals or teams in a constructive manner, focusing on how others can help them
    3. Identify any potential impacts or dependencies with other teams/projects, especially where conflicts might arise
  `;

  const userPrompt = `
    Please analyze the following team data and generate a comprehensive summary:
    
    ${JSON.stringify(teamData, null, 2)}
    
    Include the following sections in your summary:
    1. Team name and organization
    2. Team composition (members and roles)
    3. Projects overview
    4. Task distribution and progress
    5. This week's focus areas
    6. Points of contact for questions or assistance
    7. Blocked individuals who need support from other teams
    8. Cross-team dependencies and potential conflicts
    9. Any critical issues or roadblocks
  `;

  // Call OpenRouter API or use mock response
  if (!OPENROUTER_API_KEY) {
    // Mock response
    const summary = `## Team Summary: Sample Team
    
This is a sample team description.

### Team Composition:
- 2 team members
- John Doe (Team Lead)
- Jane Smith (Developer)

### Projects:
- 2 active projects
- Project A: 33% complete (active)
- Project B: 50% complete (active)

### Task Overview:
- Completed: 2/5 (40%)
- In Progress: 1/5 (20%)
- Todo: 2/5 (40%)
- Blocked: 0/5 (0%)

### This Week's Focus:
The team is currently focused on 1 task in progress across 2 projects.`;

    return res.json({ summary });
  } else {
    // Call actual API
    callOpenRouter(model, systemPrompt, userPrompt)
      .then(summary => {
        res.json({ summary });
      })
      .catch(error => {
        console.error("Error generating team summary:", error);
        res.status(500).json({ error: "Failed to generate team summary" });
      });
  }
}