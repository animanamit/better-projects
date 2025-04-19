import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockData, TaskStatus, TaskPriority } from "@/mock-data";
import { useState, useEffect } from "react";
import { useTabContext } from "@/dashboard";

// Status color map from task-page
const statusColorMap: Record<TaskStatus, { bg: string; text: string }> = {
  [TaskStatus.TODO]: { bg: "bg-slate-100", text: "text-slate-700" },
  [TaskStatus.IN_PROGRESS]: { bg: "bg-blue-100", text: "text-blue-700" },
  [TaskStatus.IN_REVIEW]: { bg: "bg-purple-100", text: "text-purple-700" },
  [TaskStatus.BLOCKED]: { bg: "bg-red-100", text: "text-red-700" },
  [TaskStatus.COMPLETED]: { bg: "bg-green-100", text: "text-green-700" },
};

const priorityColorMap: Record<TaskPriority, { bg: string; text: string }> = {
  [TaskPriority.LOWEST]: { bg: "bg-slate-100", text: "text-slate-700" },
  [TaskPriority.LOW]: { bg: "bg-teal-100", text: "text-teal-700" },
  [TaskPriority.MEDIUM]: { bg: "bg-blue-100", text: "text-blue-700" },
  [TaskPriority.HIGH]: { bg: "bg-amber-100", text: "text-amber-700" },
  [TaskPriority.HIGHEST]: { bg: "bg-red-100", text: "text-red-700" },
};

// Status badge component
const StatusBadge = ({ status }: { status: TaskStatus }) => (
  <Badge
    variant="outline"
    className={`${statusColorMap[status].bg} ${statusColorMap[status].text}`}
  >
    {status.replace(/_/g, " ")}
  </Badge>
);

// Priority badge component
const PriorityBadge = ({ priority }: { priority: TaskPriority }) => (
  <Badge
    variant="outline"
    className={`${priorityColorMap[priority].bg} ${priorityColorMap[priority].text}`}
  >
    {priority}
  </Badge>
);

// Project status badge component
const ProjectStatusBadge = ({ status }: { status: string }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-700";

  switch (status.toLowerCase()) {
    case "active":
      bgColor = "bg-green-100";
      textColor = "text-green-700";
      break;
    case "completed":
      bgColor = "bg-blue-100";
      textColor = "text-blue-700";
      break;
    case "on hold":
      bgColor = "bg-amber-100";
      textColor = "text-amber-700";
      break;
    case "cancelled":
      bgColor = "bg-red-100";
      textColor = "text-red-700";
      break;
  }

  return (
    <Badge variant="outline" className={`${bgColor} ${textColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// User avatar component (reused from task-page)
const UserAvatar = ({
  user,
  size = "md",
  showName = false,
}: {
  user: { name?: string; email: string; avatarUrl?: string } | null | undefined;
  size?: "sm" | "md";
  showName?: boolean;
}) => {
  if (!user) return null;

  const sizeClass = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <div className="flex items-center gap-1">
      <Avatar className={sizeClass}>
        <div
          className={`w-full h-full flex items-center justify-center bg-gray-200 ${textSize} font-medium`}
        >
          {user.name ? user.name.charAt(0) : user.email.charAt(0)}
        </div>
      </Avatar>
      {showName && <span className="text-sm">{user.name || user.email}</span>}
    </div>
  );
};

// Task card component
const TaskCard = ({ task }) => {
  const assignee = task.assigneeId
    ? mockData.users.find((user) => user.id === task.assigneeId)
    : null;

  return (
    <Link to={`/dashboard/task/${task.id}`}>
      <Card key={task.id} className="mb-2 hover:shadow-md transition-shadow">
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-1">{task.title}</h3>
              <div className="flex flex-wrap gap-2 mb-1">
                <StatusBadge status={task.status} />
                {task.priority && <PriorityBadge priority={task.priority} />}
              </div>
              {task.description && (
                <p className="text-gray-600 text-xs line-clamp-2 mt-1">
                  {task.description}
                </p>
              )}
            </div>
            {assignee && (
              <div className="ml-3">
                <UserAvatar user={assignee} size="sm" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// Project metadata component
const ProjectMetadata = ({ project }) => {
  const metadata = [];

  if (project.startDate) {
    metadata.push({
      label: "Start Date",
      value: new Date(project.startDate).toLocaleDateString(),
    });
  }

  if (project.targetEndDate) {
    metadata.push({
      label: "Target End Date",
      value: new Date(project.targetEndDate).toLocaleDateString(),
    });
  }

  if (project.actualEndDate) {
    metadata.push({
      label: "Actual End Date",
      value: new Date(project.actualEndDate).toLocaleDateString(),
    });
  }

  if (project.createdAt) {
    metadata.push({
      label: "Created",
      value: new Date(project.createdAt).toLocaleDateString(),
    });
  }

  if (project.updatedAt) {
    metadata.push({
      label: "Updated",
      value: new Date(project.updatedAt).toLocaleDateString(),
    });
  }

  return (
    <div className="border rounded-md p-3 bg-gray-50">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Project Details</h3>
      <div className="grid grid-cols-2 gap-y-2 gap-x-3">
        {metadata.map((item, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-xs text-gray-500">{item.label}</span>
            <span className="text-sm">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Team Member List component
const TeamMemberList = ({ teamId }) => {
  // Get team members for this project's team
  const teamMembers = mockData.teamMembers.filter(
    (member) => member.teamId === teamId
  );
  
  if (teamMembers.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500 text-sm">
        No team members found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {teamMembers.map((member) => {
        const user = mockData.users.find((u) => u.id === member.userId);
        if (!user) return null;
        
        return (
          <Card key={member.id} className="flex items-center p-3">
            <UserAvatar user={user} showName={true} />
            <div className="ml-3 flex-1">
              <div className="text-sm font-medium">{user.name || user.email}</div>
              <div className="text-xs text-gray-500">{member.role}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// Main component
const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeTab } = useTabContext();
  const [project, setProject] = useState(null);
  
  // Update project when id changes
  useEffect(() => {
    const foundProject = mockData.projects.find((p) => p.id === id);
    if (foundProject) {
      setProject(foundProject);
    } else {
      console.error(`Project with id ${id} not found`);
      // Redirect to dashboard if project not found
      navigate("/dashboard");
    }
  }, [id, navigate]);
  
  // Function to navigate back to dashboard while preserving the active tab
  const goBackToDashboard = () => {
    navigate("/dashboard");
  };
  
  if (!project) {
    return <div className="p-3">Project not found</div>;
  }

  // Get tasks for this project
  const projectTasks = mockData.tasks.filter(
    (task) => task.projectId === project.id
  );
  
  // Get the team for this project
  const team = project.teamId 
    ? mockData.teams.find((team) => team.id === project.teamId)
    : null;

  // Group tasks by status
  const tasksByStatus = {
    [TaskStatus.TODO]: projectTasks.filter(
      (task) => task.status === TaskStatus.TODO
    ),
    [TaskStatus.IN_PROGRESS]: projectTasks.filter(
      (task) => task.status === TaskStatus.IN_PROGRESS
    ),
    [TaskStatus.IN_REVIEW]: projectTasks.filter(
      (task) => task.status === TaskStatus.IN_REVIEW
    ),
    [TaskStatus.BLOCKED]: projectTasks.filter(
      (task) => task.status === TaskStatus.BLOCKED
    ),
    [TaskStatus.COMPLETED]: projectTasks.filter(
      (task) => task.status === TaskStatus.COMPLETED
    ),
  };

  return (
    <div className="p-3 max-w-7xl mx-auto">
      <div className="mb-3">
        <button 
          onClick={goBackToDashboard}
          className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>
      
      <Card className="mb-4">
        <CardHeader className="p-3">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold mb-2">
                {project.name}
              </CardTitle>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="flex items-center gap-2 mr-3">
                  <span className="text-xs text-gray-500">Status:</span>
                  <ProjectStatusBadge status={project.status} />
                </div>

                {team && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Team:</span>
                    <Badge variant="outline" className="bg-gray-100">
                      {team.name}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {project.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Description
                  </h3>
                  <div className="text-gray-700 whitespace-pre-line text-sm">
                    {project.description}
                  </div>
                </div>
              )}
            </div>

            <ProjectMetadata project={project} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="mb-3">
          <TabsTrigger value="tasks">
            Tasks ({projectTasks.length})
          </TabsTrigger>
          <TabsTrigger value="team">
            Team {team ? `(${team.name})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          {projectTasks.length === 0 ? (
            <div className="text-center p-4 text-gray-500 text-sm">
              No tasks for this project
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* TODO tasks */}
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-slate-300 mr-2"></div>
                  TODO ({tasksByStatus[TaskStatus.TODO].length})
                </h3>
                {tasksByStatus[TaskStatus.TODO].map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>

              {/* IN PROGRESS tasks */}
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                  IN PROGRESS ({tasksByStatus[TaskStatus.IN_PROGRESS].length})
                </h3>
                {tasksByStatus[TaskStatus.IN_PROGRESS].map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>

              {/* COMPLETED tasks */}
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                  COMPLETED ({tasksByStatus[TaskStatus.COMPLETED].length})
                </h3>
                {tasksByStatus[TaskStatus.COMPLETED].map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="team">
          {team ? (
            <TeamMemberList teamId={team.id} />
          ) : (
            <div className="text-center p-4 text-gray-500 text-sm">
              No team assigned to this project
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectPage;