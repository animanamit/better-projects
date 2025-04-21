import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import fetch from 'node-fetch';

// Load environment variables with proper path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Type definitions for better TypeScript support
interface SummaryRequest {
  model: string;
  forceRefresh?: boolean;
}

interface TaskSummaryRequest extends SummaryRequest {
  taskId: string;
}

interface ProjectSummaryRequest extends SummaryRequest {
  projectId: string;
}

interface TeamSummaryRequest extends SummaryRequest {
  teamId: string;
}

interface SummaryResponse {
  summary: string;
}

interface CacheEntry {
  summary: string;
  timestamp: number;
  model: string;
}

interface Cache {
  [key: string]: CacheEntry;
}

// Define the AI plugin
const aiRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Log the OpenRouter API key (just the first few characters)
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
  console.log('OpenRouter API Key exists:', OPENROUTER_API_KEY ? 'Yes' : 'No');
  if (OPENROUTER_API_KEY) {
    console.log(
      'OpenRouter API Key preview:',
      OPENROUTER_API_KEY.substring(0, 5) + '...'
    );
  }
  const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

  // Simple in-memory cache
  const summaryCache: {
    task: Cache;
    project: Cache;
    team: Cache;
  } = {
    task: {}, // taskId -> { summary, timestamp, model }
    project: {}, // projectId -> { summary, timestamp, model }
    team: {}, // teamId -> { summary, timestamp, model }
  };

  // Cache expiration time (24 hours in milliseconds)
  const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

  // Helper function to call OpenRouter API
  async function callOpenRouter(prompt: string, model: string): Promise<string | null> {
    if (!OPENROUTER_API_KEY) {
      console.warn('No OpenRouter API key found, using mock response');
      return null;
    }

    try {
      console.log(`Calling OpenRouter with model: ${model}`);

      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://better-projects.vercel.app/',
          'X-Title': 'Better Projects - Task Management',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content:
                'You are an AI assistant that provides insightful, business-oriented summaries of tasks, projects, and teams. Your summaries should be concise, actionable, and tailored to different stakeholders like product owners, CTOs, and team leaders.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenRouter API error:', errorData);
        throw new Error(
          `OpenRouter API error: ${errorData.error?.message || 'Unknown error'}`
        );
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenRouter:', error);
      return null;
    }
  }

  // Helper function to get cached summary or generate a new one
  async function getOrGenerateSummary(
    type: 'task' | 'project' | 'team',
    id: string,
    model: string,
    prompt: string,
    forceRefresh = false
  ): Promise<string> {
    const cacheKey = id;
    const cache = summaryCache[type];

    // Check if we have a valid cache entry
    if (
      !forceRefresh &&
      cache[cacheKey] &&
      cache[cacheKey].model === model &&
      Date.now() - cache[cacheKey].timestamp < CACHE_EXPIRATION
    ) {
      console.log(`Returning cached ${type} summary for ${id}`);
      return cache[cacheKey].summary;
    }

    // Generate new summary from OpenRouter
    console.log(`Generating new ${type} summary for ${id} with model ${model}`);
    const summary = await callOpenRouter(prompt, model);

    if (summary) {
      // Update cache
      cache[cacheKey] = {
        summary,
        timestamp: Date.now(),
        model,
      };
      return summary;
    }

    // If OpenRouter call fails, return mock response or cached response if available
    if (cache[cacheKey]) {
      console.log(
        `Falling back to cached ${type} summary for ${id} after API failure`
      );
      return cache[cacheKey].summary;
    }

    // Fall back to mock response if all else fails
    return getMockSummary(type);
  }

  // Mock summaries as fallback if API fails
  function getMockSummary(type: 'task' | 'project' | 'team'): string {
    if (type === 'task') {
      return `## Executive Summary: API Integration for Payment Gateway

John Doe has been working on this task for 5 days and appears to be making steady progress. Based on the comment history and recent updates, I estimate this task will require another 3-4 days to complete. The complexity lies primarily in handling edge cases for international transactions.

### For the Product Owner
This payment gateway integration is a critical dependency for the Q2 release. The team is addressing the security concerns raised in the last sprint review, with special attention to PCI compliance requirements. John has implemented 70% of the planned functionality, and testing is already underway for the completed portions.

### For the CTO
The implementation uses the recommended third-party SDK rather than building a custom solution, which reduces security risks and maintenance burden. The current blocker involves transaction reconciliation across multiple currencies, which requires input from the finance team. I recommend scheduling a brief meeting with Sarah from Finance to resolve these questions.

### For Team Leadership
While John is managing well, this task's completion timeline could be accelerated by having Lisa assist with the unit testing portion. She has previous experience with similar payment integrations and could reduce overall delivery time by approximately 2 days if she can allocate about 4 hours to this task.

### Risk Assessment
* **Medium risk**: The API provider has scheduled maintenance this weekend that could impact development testing
* **Low risk**: Documentation for international transaction error codes is incomplete, but the team has established direct contact with the vendor's support team
* **Mitigation**: A fallback implementation has been prepared in case the primary approach encounters unexpected issues

The team has been proactive in communication, with regular updates in the dedicated Slack channel and comprehensive documentation being maintained throughout the development process.`;
    } else if (type === 'project') {
      return `## Executive Overview: Mobile App Redesign Project

The mobile app redesign project is currently 33% complete and tracking on schedule for the planned July 15th release. The team has successfully completed the user research phase and finalized the design system, with development now in active progress.

### For Executive Leadership
This project represents a significant opportunity to address our declining mobile engagement metrics, with usability testing of initial prototypes showing a 40% improvement in key user flows. The redesign aligns with our strategic goal of increasing mobile transaction volume by 25% in Q3.

The project is currently on budget, with resource allocation as planned. The critical path remains the payment flow optimization, which has dependencies on the API team's work scheduled to complete next week.

### For Product Management
User testing has validated our hypothesis that the account management flow was a significant pain point. The simplified onboarding process has tested particularly well with the 25-34 demographic, which aligns with our growth targets.

The feature prioritization we conducted has proven effective, with the team able to focus on high-impact areas first. The planned A/B testing framework has been implemented ahead of schedule, which will allow for data-driven refinements post-launch.

### For Engineering Leadership
The development team has successfully implemented the new component architecture, which has already reduced build times by 30% and should improve future feature development velocity. Code quality metrics show a 15% improvement in test coverage compared to the previous version.

The team encountered integration challenges with the analytics SDK last week but resolved them through collaboration with the vendor. This experience has been documented for future reference and will inform our technical debt reduction efforts in Q4.

### Current Focus Areas
1. Payment flow implementation (Alex & Team)
2. Performance optimization for older Android devices (Maria)
3. Accessibility compliance testing (James)

### Risk Management
* **Low risk**: App Store review timelines – mitigated by scheduling a buffer period before public release
* **Medium risk**: Backend API scalability – load testing scheduled for next week
* **High risk**: Marketing campaign timing – requires coordination with the launch; weekly sync established

The cross-functional collaboration on this project has been exemplary, with design and development teams working closely together and resolving issues quickly.`;
    } else {
      return `## Team Performance Report: Engineering Team Alpha

The Engineering Team Alpha consists of 8 engineers led by John Doe, with cross-functional expertise spanning frontend, backend, and DevOps specializations. The team is currently managing 3 active projects and has demonstrated consistent delivery quality over the past quarter.

### For the CEO
This team is responsible for 40% of our core product innovation initiatives and has maintained an impressive 92% on-time delivery rate. Their work on the new customer data platform has directly contributed to our 18% revenue growth in enterprise accounts this quarter.

The team's strategic value continues to grow as they've reduced our infrastructure costs by 22% while simultaneously improving system reliability metrics. Their technical choices align well with our 3-year technology roadmap.

### For the CTO
Team Alpha has successfully transitioned from a traditional development approach to a microservices architecture, completing the migration 2 weeks ahead of schedule. Their implementation of the new CI/CD pipeline has been adopted by three other teams, creating company-wide efficiency improvements.

Code quality metrics are consistently high, with 89% test coverage and a 27% reduction in production incidents compared to the previous quarter. Technical debt is being managed proactively, with 15% of capacity dedicated to system improvement rather than reactive fixes.

### For the Director of Product
The team has become increasingly collaborative with product stakeholders, with a noticeable improvement in requirement clarification cycles. They've adopted a "shift left" testing approach that has reduced QA cycles by 30%, enabling faster feature delivery.

Project B is currently at risk of slipping its deadline due to unexpected third-party API changes. I recommend a scope adjustment, specifically deferring the advanced reporting features to the next release to ensure core functionality ships on time.

### Current Focus & Capacity
* Project A: Customer Data Platform (45% of capacity) - On track
* Project B: Reporting Dashboard Overhaul (35% of capacity) - At risk
* Project C: Mobile Authentication Enhancement (20% of capacity) - Ahead of schedule

The team currently has no available bandwidth for new initiatives until mid-July, when Project C is scheduled to complete.

### Development Needs
The team would benefit from additional expertise in machine learning, which aligns with our Q3 roadmap priorities. I recommend either targeted hiring or providing training opportunities for 1-2 existing team members who have expressed interest in this area.

Team morale remains high, though there's some concern about the upcoming office relocation and its impact on the collaborative environment they've established.`;
    }
  }

  // Schema for diagnostic endpoint
  const testSchema = {
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          environment: {
            type: 'object',
            properties: {
              NODE_ENV: { type: ['string', 'null'] },
              OPENROUTER_API_KEY_EXISTS: { type: 'boolean' },
              ENV_FILE_PATH: { type: 'string' },
              ENV_FILE_EXISTS: { type: 'boolean' },
              CURRENT_WORKING_DIR: { type: 'string' },
              CACHE_STATUS: {
                type: 'object',
                properties: {
                  task: { type: 'number' },
                  project: { type: 'number' },
                  team: { type: 'number' }
                }
              }
            }
          }
        }
      }
    }
  };

  // Diagnostic endpoint
  fastify.get('/test', { schema: testSchema }, (request, reply) => {
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      OPENROUTER_API_KEY_EXISTS: Boolean(process.env.OPENROUTER_API_KEY),
      ENV_FILE_PATH: path.resolve(__dirname, '../../.env'),
      ENV_FILE_EXISTS: fs.existsSync(path.resolve(__dirname, '../../.env')),
      CURRENT_WORKING_DIR: process.cwd(),
      CACHE_STATUS: {
        task: Object.keys(summaryCache.task).length,
        project: Object.keys(summaryCache.project).length,
        team: Object.keys(summaryCache.team).length,
      },
    };

    return {
      message: 'AI routes are working',
      environment: envVars,
    };
  });

  // Schema for task summary endpoint
  const taskSummarySchema = {
    body: {
      type: 'object',
      required: ['taskId', 'model'],
      properties: {
        taskId: { type: 'string' },
        model: { type: 'string' },
        forceRefresh: { type: 'boolean', default: false }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          summary: { type: 'string' }
        }
      }
    }
  };

  // Task summary endpoint
  fastify.post<{
    Body: TaskSummaryRequest
  }>('/task-summary', { schema: taskSummarySchema }, async (request, reply) => {
    try {
      const { taskId, model, forceRefresh } = request.body;

      const prompt = `Please generate an insightful summary of this task with ID ${taskId}. 

The summary should include sections targeted at different stakeholders (Product Owner, CTO, Team Leadership).
Include an executive summary at the top, and insights about timeline, blockers, risks, and next steps if applicable.

FORMAT REQUIREMENTS:
- Use proper Markdown formatting with clear headings using # for main title, ## for sections, and ### for subsections
- Use bullet points with - or * for lists
- Use bold (**text**) for emphasis on important points
- Use blockquotes (> text) for highlighting key insights or warnings
- Use numbered lists (1. 2. 3.) for sequential steps or prioritized items
- Include 1-2 key statistics or metrics for each stakeholder section if possible
- Format any code snippets or technical details in code blocks using \`\`\` (triple backticks)

RESPONSE STRUCTURE (follow this format):
# Executive Summary: [Task Title]

Brief overview of the task status and importance (2-3 sentences)

## For the Product Owner
Insights relevant to product strategy, timeline, and business value

## For the CTO
Technical insights, architecture decisions, and impact on the system

## For Team Leadership
Resource allocation, team coordination, and performance insights

## Risk Assessment
* **Risk level**: Description and mitigation strategy

Format your response in clear, professional language appropriate for a business context.`;

      const summary = await getOrGenerateSummary(
        'task',
        taskId,
        model,
        prompt,
        forceRefresh
      );

      return { summary };
    } catch (error) {
      request.log.error('Error in task-summary endpoint:', error);
      throw fastify.httpErrors.internalServerError('Failed to generate summary');
    }
  });

  // Schema for project summary endpoint
  const projectSummarySchema = {
    body: {
      type: 'object',
      required: ['projectId', 'model'],
      properties: {
        projectId: { type: 'string' },
        model: { type: 'string' },
        forceRefresh: { type: 'boolean', default: false }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          summary: { type: 'string' }
        }
      }
    }
  };

  // Project summary endpoint
  fastify.post<{
    Body: ProjectSummaryRequest
  }>('/project-summary', { schema: projectSummarySchema }, async (request, reply) => {
    try {
      const { projectId, model, forceRefresh } = request.body;

      const prompt = `Please generate an insightful summary of this project with ID ${projectId}.

The summary should include sections targeted at different stakeholders (Executive Leadership, Product Management, Engineering Leadership).
Include an executive overview at the top, and insights about progress, risks, and focus areas.

FORMAT REQUIREMENTS:
- Use proper Markdown formatting with clear headings using # for main title, ## for sections, and ### for subsections
- Use bullet points with - or * for lists
- Use bold (**text**) for emphasis on important points
- Use blockquotes (> text) for highlighting key insights or warnings
- Use numbered lists (1. 2. 3.) for sequential steps or prioritized items
- Include 1-2 key statistics or metrics for each stakeholder section if possible
- Format any code snippets or technical details in code blocks using \`\`\` (triple backticks)

RESPONSE STRUCTURE (follow this format):
# Executive Overview: [Project Name]

Brief overview of project status, timeline, and strategic importance (2-3 sentences)

## For Executive Leadership
High-level insights on business impact, resource utilization, and strategic alignment

## For Product Management
Features, user feedback, market fit, and roadmap insights

## For Engineering Leadership
Technical progress, architecture decisions, and team performance

## Current Focus Areas
1. [Area 1] - Brief description and owner
2. [Area 2] - Brief description and owner
3. [Area 3] - Brief description and owner

## Risk Management
* **High risk**: Description and mitigation strategy
* **Medium risk**: Description and mitigation strategy
* **Low risk**: Description and mitigation strategy

Format your response in clear, professional language appropriate for a business context.`;

      const summary = await getOrGenerateSummary(
        'project',
        projectId,
        model,
        prompt,
        forceRefresh
      );

      return { summary };
    } catch (error) {
      request.log.error('Error in project-summary endpoint:', error);
      throw fastify.httpErrors.internalServerError('Failed to generate summary');
    }
  });

  // Schema for team summary endpoint
  const teamSummarySchema = {
    body: {
      type: 'object',
      required: ['teamId', 'model'],
      properties: {
        teamId: { type: 'string' },
        model: { type: 'string' },
        forceRefresh: { type: 'boolean', default: false }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          summary: { type: 'string' }
        }
      }
    }
  };

  // Team summary endpoint
  fastify.post<{
    Body: TeamSummaryRequest
  }>('/team-summary', { schema: teamSummarySchema }, async (request, reply) => {
    try {
      const { teamId, model, forceRefresh } = request.body;

      const prompt = `Please generate an insightful summary of this team with ID ${teamId}.

The summary should include sections targeted at different stakeholders (CEO, CTO, Director of Product).
Include insights about team performance, focus areas, capacity, and development needs.

FORMAT REQUIREMENTS:
- Use proper Markdown formatting with clear headings using # for main title, ## for sections, and ### for subsections
- Use bullet points with - or * for lists
- Use bold (**text**) for emphasis on important points
- Use blockquotes (> text) for highlighting key insights or warnings
- Use numbered lists (1. 2. 3.) for sequential steps or prioritized items
- Include 1-2 key statistics or metrics for each stakeholder section if possible
- Format any code snippets or technical details in code blocks using \`\`\` (triple backticks)

RESPONSE STRUCTURE (follow this format):
# Team Performance Report: [Team Name]

Brief overview of the team composition, responsibilities, and general performance (2-3 sentences)

## For the CEO
Strategic value, contribution to business goals, and ROI insights

## For the CTO
Technical capabilities, code quality metrics, and innovation impact

## For the Director of Product
Delivery metrics, collaboration quality, and product impact insights

## Current Focus & Capacity
* Project A: [percentage]% of capacity - Status
* Project B: [percentage]% of capacity - Status
* Project C: [percentage]% of capacity - Status

## Development Needs
Identified skill gaps, growth opportunities, and recommended investments

Format your response in clear, professional language appropriate for a business context.`;

      const summary = await getOrGenerateSummary(
        'team',
        teamId,
        model,
        prompt,
        forceRefresh
      );

      return { summary };
    } catch (error) {
      request.log.error('Error in team-summary endpoint:', error);
      throw fastify.httpErrors.internalServerError('Failed to generate summary');
    }
  });

  // Schema for clear cache endpoint
  const clearCacheSchema = {
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      }
    }
  };

  // Endpoint to clear cache (admin/debug)
  fastify.post('/clear-cache', { schema: clearCacheSchema }, (request, reply) => {
    summaryCache.task = {};
    summaryCache.project = {};
    summaryCache.team = {};

    return { message: 'Cache cleared successfully' };
  });
};

export default aiRoutes;