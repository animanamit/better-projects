import { useParams, Link, useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { mockData, TaskStatus, TaskPriority } from "@/mock-data";
import { useState, useEffect, useContext } from "react";
import AISummaryDialog from "@/components/ai-summary-dialog";
import { AIContext } from "./App";

// Status color map
const statusColorMap: Record<TaskStatus, { bg: string; text: string }> = {
  [TaskStatus.TODO]: { bg: "bg-[#f0f0f0]", text: "text-black/70" },
  [TaskStatus.IN_PROGRESS]: { bg: "bg-[#FFF4ED]", text: "text-[#F44A00]" },
  [TaskStatus.IN_REVIEW]: { bg: "bg-[#F5F0FF]", text: "text-[#7928CA]" },
  [TaskStatus.BLOCKED]: { bg: "bg-[#FFF0F0]", text: "text-[#E11D48]" },
  [TaskStatus.COMPLETED]: { bg: "bg-[#F0FFF4]", text: "text-[#16A34A]" },
};

const priorityColorMap: Record<TaskPriority, { bg: string; text: string }> = {
  [TaskPriority.LOWEST]: { bg: "bg-[#f0f0f0]", text: "text-black/70" },
  [TaskPriority.LOW]: { bg: "bg-[#F0F9FF]", text: "text-[#0284C7]" },
  [TaskPriority.MEDIUM]: { bg: "bg-[#FFF4ED]", text: "text-[#F44A00]" },
  [TaskPriority.HIGH]: { bg: "bg-[#FFF7ED]", text: "text-[#EA580C]" },
  [TaskPriority.HIGHEST]: { bg: "bg-[#FFF1F2]", text: "text-[#E11D48]" },
};

// Status badge component
const StatusBadge = ({ status }: { status: TaskStatus }) => (
  <div
    className={`inline-flex px-2 py-0.5 text-xs ${statusColorMap[status].bg} ${statusColorMap[status].text}`}
  >
    {status.replace(/_/g, " ")}
  </div>
);

// Priority badge component
const PriorityBadge = ({ priority }: { priority: TaskPriority }) => (
  <div
    className={`inline-flex px-2 py-0.5 text-xs ${priorityColorMap[priority].bg} ${priorityColorMap[priority].text}`}
  >
    {priority}
  </div>
);

// Project status badge component
const ProjectStatusBadge = ({ status }: { status: string }) => {
  let bgColor = "bg-[#f0f0f0]";
  let textColor = "text-black/70";

  switch (status.toLowerCase()) {
    case "active":
      bgColor = "bg-[#F0FFF4]";
      textColor = "text-[#16A34A]";
      break;
    case "completed":
      bgColor = "bg-[#F0F9FF]";
      textColor = "text-[#0284C7]";
      break;
    case "on hold":
      bgColor = "bg-[#FFF7ED]";
      textColor = "text-[#EA580C]";
      break;
    case "cancelled":
      bgColor = "bg-[#FFF0F0]";
      textColor = "text-[#E11D48]";
      break;
  }

  return (
    <div className={`inline-flex px-2 py-0.5 text-xs ${bgColor} ${textColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

// User avatar component
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
      <Avatar className={`${sizeClass}`}>
        <div
          className={`w-full h-full flex items-center justify-center bg-[#f0f0f0] ${textSize} font-normal text-black/80`}
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
      <div
        key={task.id}
        className="mb-2 bg-white p-3 hover:bg-[#f8f8f8] transition-colors"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-normal text-sm mb-1">{task.title}</h3>
            <div className="flex flex-wrap gap-2 mb-1">
              <StatusBadge status={task.status} />
              {task.priority && <PriorityBadge priority={task.priority} />}
            </div>
            {task.description && (
              <p className="text-black/60 text-xs line-clamp-2 mt-1">
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
      </div>
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
    <div className="bg-[#f0f0f0] py-2 px-3">
      <h3 className="text-base font-normal text-black/80 mb-2">
        Project Details
      </h3>
      <div className="grid grid-cols-2 gap-y-2 gap-x-3">
        {metadata.map((item, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-xs font-medium text-black/60">
              {item.label}
            </span>
            <span className="text-sm font-normal">{item.value}</span>
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
      <div className="text-center p-4 text-black/50 text-sm">
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
          <div key={member.id} className="flex items-center p-3 bg-white">
            <UserAvatar user={user} showName={true} />
            <div className="ml-3 flex-1">
              <div className="text-sm font-normal">
                {user.name || user.email}
              </div>
              <div className="text-xs text-black/50">{member.role}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Main component
const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const { selectedModel } = useContext(AIContext);
  const [showAISummary, setShowAISummary] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");

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
    <div className="max-w-7xl mx-auto">
      <div className="mb-3">
        <button
          onClick={goBackToDashboard}
          className="flex items-center text-black/60 hover:text-[#F44A00] transition-colors font-normal"
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

      <div className="mb-6">
        <div className="text-xs text-black/60 mb-1">PROJECT {project.id}</div>
        <h1 className="text-2xl font-normal mb-3">{project.name}</h1>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="flex items-center gap-1 mr-2">
            <span className="text-xs font-medium text-black/60">Status:</span>
            <ProjectStatusBadge status={project.status} />
          </div>

          {team && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-black/60">Team:</span>
              <div className="bg-[#f0f0f0] text-black/70 text-xs px-1.5 py-0.5">
                {team.name}
              </div>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-1 border-[#F44A00] text-[#F44A00] hover:bg-[#FFF4ED] font-normal mb-4"
          onClick={() => setShowAISummary(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <path d="M12 17h.01"></path>
          </svg>
          Generate Project AI Summary
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {project.description && (
              <div>
                <h3 className="text-base font-normal text-black/80 mb-1">
                  Description
                </h3>
                <div className="text-black/80 whitespace-pre-line text-sm bg-[#f0f0f0] p-2">
                  {project.description}
                </div>
              </div>
            )}
          </div>

          <ProjectMetadata project={project} />
        </div>
      </div>

      <div className="mb-2">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 text-sm font-normal ${
              activeTab === "tasks"
                ? "border-b-2 border-black"
                : "text-black/60"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks ({projectTasks.length})
          </button>
          <button
            className={`px-4 py-2 text-sm font-normal ${
              activeTab === "team" ? "border-b-2 border-black" : "text-black/60"
            }`}
            onClick={() => setActiveTab("team")}
          >
            Team {team ? `(${team.name})` : ""}
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "tasks" && (
          <>
            {projectTasks.length === 0 ? (
              <div className="text-center py-3 text-black/50 font-normal">
                No tasks for this project
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* TODO tasks */}
                <div className="bg-[#f8f8f8] py-2 px-3">
                  <h3 className="text-base font-normal mb-2 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-black/20 mr-2"></div>
                    TODO ({tasksByStatus[TaskStatus.TODO].length})
                  </h3>
                  {tasksByStatus[TaskStatus.TODO].map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>

                {/* IN PROGRESS tasks */}
                <div className="bg-[#f8f8f8] py-2 px-3">
                  <h3 className="text-base font-normal mb-2 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#F44A00] mr-2"></div>
                    IN PROGRESS ({tasksByStatus[TaskStatus.IN_PROGRESS].length})
                  </h3>
                  {tasksByStatus[TaskStatus.IN_PROGRESS].map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>

                {/* COMPLETED tasks */}
                <div className="bg-[#f8f8f8] py-2 px-3">
                  <h3 className="text-base font-normal mb-2 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-black/60 mr-2"></div>
                    COMPLETED ({tasksByStatus[TaskStatus.COMPLETED].length})
                  </h3>
                  {tasksByStatus[TaskStatus.COMPLETED].map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "team" && (
          <>
            {team ? (
              <TeamMemberList teamId={team.id} />
            ) : (
              <div className="text-center py-3 text-black/50 font-normal">
                No team assigned to this project
              </div>
            )}
          </>
        )}
      </div>

      {/* AI Summary Dialog */}
      <AISummaryDialog
        isOpen={showAISummary}
        onClose={() => setShowAISummary(false)}
        itemId={project.id}
        summaryType="project"
        selectedModel={selectedModel}
      />
    </div>
  );
};

export default ProjectPage;
