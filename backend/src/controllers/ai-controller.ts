import { Request, Response } from "express";
import dotenv from "dotenv";
import * as path from "path";

// Load environment variables with proper path
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// OpenRouter API key - should be stored in environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ""; 
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

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
  `;

  const userPrompt = `
    Please analyze the following task data and generate a comprehensive summary:
    
    ${JSON.stringify(taskData, null, 2)}
    
    Include the following sections in your summary:
    1. Task title and status
    2. Key information (assignee, time open, priority, etc.)
    3. Activity summary (comments, status changes, etc.)
    4. Recent updates
    5. Next steps or recommendations
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
    6. Any critical issues or blockers
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
    6. Any critical issues or blockers
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