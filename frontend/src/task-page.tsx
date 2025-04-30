import { useParams } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AIContext } from "./App";
import { useState, useContext, useEffect } from "react";
import AISummaryDialog from "@/components/ai-summary-dialog";
import { TaskPriority, TaskStatus } from "@/mock-data/types";
import { users } from "@/mock-data/users";
import { projects } from "@/mock-data/projects";
import { teamMembers } from "@/mock-data/team-members";
import { useMockData } from "@/lib/mock-data-context";
import {
  getTaskAttachmentsById,
  getTaskCommentsById,
  getTaskHistoryById,
  getTaskById,
} from "@/mock-data/index";

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

// Status selector component
const StatusSelector = ({
  currentStatus,
  onStatusChange,
}: {
  currentStatus: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
}) => (
  <select
    value={currentStatus}
    onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
    className="text-xs h-8 px-2 bg-white"
  >
    {Object.values(TaskStatus).map((status) => (
      <option key={status} value={status}>
        {status.replace(/_/g, " ")}
      </option>
    ))}
  </select>
);

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

// Comment component
const Comment = ({ comment, taskComments, userInfo }) => {
  const isReply = !!comment.parentCommentId;
  const parentComment = isReply
    ? taskComments.find((c) => c.id === comment.parentCommentId)
    : null;

  return (
    <div key={comment.id} className={`${isReply ? "ml-6" : ""} mb-2`}>
      <div className="bg-white p-3">
        {isReply && (
          <p className="text-xs text-black/50 mb-1">
            Replying to: "{parentComment?.content.substring(0, 40)}..."
          </p>
        )}

        <div className="flex items-center gap-2">
          <UserAvatar
            user={{
              name: userInfo.name,
              email: userInfo.name,
              avatarUrl: userInfo.avatarUrl,
            }}
            size="sm"
          />
          <span className="font-normal text-sm">{userInfo.name}</span>
          <span className="text-xs text-black/50">{userInfo.role}</span>
          {userInfo.teams && userInfo.teams.length > 0 && (
            <div className="bg-[#f0f0f0] text-black/70 text-xs px-1.5 py-0.5">
              {userInfo.teams[0].name}
            </div>
          )}
          <span className="text-xs text-black/40 ml-auto">
            {new Date(comment.createdAt).toLocaleString()}
            {comment.isEdited && " (edited)"}
          </span>
        </div>
      </div>

      <div className="bg-white p-3 mt-px">
        <p className="text-black/80 text-sm">{comment.content}</p>
      </div>
    </div>
  );
};

// History item component
const HistoryItem = ({ history }) => {
  const user = users.find((u) => u.id === history.changedBy);
  return (
    <div key={history.id} className="bg-white p-3 mb-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-normal text-sm">
            Changed {history.fieldChanged} from{" "}
            <span className="inline-block bg-[#f0f0f0] px-1.5 font-mono text-xs">
              {history.oldValue}
            </span>{" "}
            to{" "}
            <span className="inline-block bg-[#f0f0f0] px-1.5 font-mono text-xs">
              {history.newValue}
            </span>
          </p>
          <p className="text-xs text-black/60 mt-1 flex items-center gap-1">
            <UserAvatar user={user} size="sm" />
            {user?.name || "Unknown"}
          </p>
        </div>
        <p className="text-xs text-black/50">
          {new Date(history.changedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

// Attachment item component
const AttachmentItem = ({ attachment }) => {
  const user = users.find((u) => u.id === attachment.userId);
  return (
    <div key={attachment.id} className="bg-white p-3 mb-2">
      <div className="flex items-center gap-2 mb-1">
        <svg
          className="w-4 h-4 text-black/50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <p className="font-normal truncate flex-1 text-sm">
          {attachment.fileName}
        </p>
      </div>
      <div className="flex justify-between text-xs text-black/50">
        <span>{(attachment.fileSize / 1024).toFixed(0)} KB</span>
        <span className="flex items-center gap-1">
          <UserAvatar user={user} size="sm" />
          {user?.name || "Unknown"}
        </span>
      </div>
    </div>
  );
};

// Task metadata component
const TaskMetadata = ({ task }) => {
  const metadata = [];

  if (task.createdAt) {
    metadata.push({
      label: "Created",
      value: new Date(task.createdAt).toLocaleDateString(),
    });
  }

  if (task.updatedAt) {
    metadata.push({
      label: "Updated",
      value: new Date(task.updatedAt).toLocaleDateString(),
    });
  }

  if (task.startDate) {
    metadata.push({
      label: "Start Date",
      value: new Date(task.startDate).toLocaleDateString(),
    });
  }

  if (task.dueDate) {
    metadata.push({
      label: "Due Date",
      value: new Date(task.dueDate).toLocaleDateString(),
    });
  }

  if (task.storyPoints) {
    metadata.push({ label: "Story Points", value: task.storyPoints });
  }

  if (task.estimatedHours) {
    metadata.push({
      label: "Estimated Hours",
      value: `${task.estimatedHours}h`,
    });
  }

  if (task.actualHours) {
    metadata.push({ label: "Actual Hours", value: `${task.actualHours}h` });
  }

  return (
    <div className="bg-[#f0f0f0] py-2 px-3">
      <h3 className="text-base font-normal text-black/80 mb-2">Task Details</h3>
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

// Main component
const TaskPage = () => {
  const { id } = useParams();
  const mockData = useMockData();
  
  // Get task from context if available, otherwise use the static mock data
  const contextTask = mockData?.getTaskById ? mockData.getTaskById(id) : undefined;
  const [task, setTask] = useState(contextTask || getTaskById(id));
  
  // Use an effect to update the task when it changes in the context
  useEffect(() => {
    if (mockData?.getTaskById && id) {
      const updatedTask = mockData.getTaskById(id);
      if (updatedTask) {
        setTask(updatedTask);
      }
    }
  }, [mockData, id, mockData?.tasks]);
  
  const [taskHistory, setTaskHistory] = useState(getTaskHistoryById(id));
  const taskComments = getTaskCommentsById(id);
  const taskAttachments = getTaskAttachmentsById(id);
  const { selectedModel } = useContext(AIContext);
  const [showAISummary, setShowAISummary] = useState(false);
  const [activeTab, setActiveTab] = useState("comments");

  // Get user information for comments
  const getUserInfo = (userId: string) => {
    const user = users.find((user) => user.id === userId);
    if (!user) return { name: "Unknown User", role: "Unknown" };

    // Find team membership for this user
    const teamMemberships = teamMembers.filter((tm) => tm.userId === userId);
    const userTeams = teamMemberships
      .map((tm) => {
        // Import the teams array from the mock-data module
        const team = projects.find((p) => p.teamId === tm.teamId);
        return team ? { id: tm.teamId, name: team.name } : null;
      })
      .filter(Boolean);

    return {
      name: user.name || user.email,
      role: user.role || "Team Member",
      teams: userTeams,
      avatarUrl: user.avatarUrl,
    };
  };

  if (!task) {
    return <div className="p-3">Task not found</div>;
  }

  const assignee = task.assigneeId
    ? users.find((user) => user.id === task.assigneeId)
    : null;
  const reporter = task.reporterId
    ? users.find((user) => user.id === task.reporterId)
    : null;
  const project = projects.find((p) => p.id === task.projectId);

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (!task || newStatus === task.status) return;

    const now = new Date().toISOString();
    const historyEntry = {
      id: `hist_${Date.now()}`,
      taskId: task.id,
      fieldChanged: "status",
      oldValue: task.status,
      newValue: newStatus,
      changedAt: now,
      changedBy: users[0].id, // Assume current user is first user
    };

    // Update task
    const updatedTask = {
      ...task,
      status: newStatus,
      updatedAt: now,
    };

    // Update using context if available, or local state
    if (mockData?.updateTask) {
      mockData.updateTask({
        id: task.id,
        status: newStatus,
      });
    }
    
    setTask(updatedTask);
    setTaskHistory([historyEntry, ...taskHistory]);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="text-xs text-black/60 mb-1">TASK {task.id}</div>
        <h1 className="text-2xl font-normal mb-3">{task.title}</h1>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="flex items-center gap-1 mr-2">
            <span className="text-xs font-medium text-black/60">Status:</span>
            <StatusBadge status={task.status} />
          </div>

          {task.priority && (
            <div className="flex items-center gap-1 mr-2">
              <span className="text-xs font-medium text-black/60">
                Priority:
              </span>
              <PriorityBadge priority={task.priority} />
            </div>
          )}

          {project && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-black/60">
                Project:
              </span>
              <div className="bg-[#f0f0f0] text-black/70 text-xs px-1.5 py-0.5">
                {project.name}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-56">
            <StatusSelector
              currentStatus={task.status}
              onStatusChange={handleStatusChange}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 border-[#F44A00] text-[#F44A00] hover:bg-[#FFF4ED] font-normal"
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
            Generate AI Summary
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            {task.description && (
              <div className="mb-4">
                <h3 className="text-base font-normal text-black/80 mb-1">
                  Description
                </h3>
                <div className="text-black/80 whitespace-pre-line text-sm bg-[#f0f0f0] p-2">
                  {task.description}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-[#f0f0f0] p-3 mb-4">
              {assignee && (
                <div className="flex flex-col mb-3">
                  <span className="text-xs font-medium text-black/60">
                    Assignee
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <UserAvatar user={assignee} showName={true} />
                  </div>
                </div>
              )}

              {reporter && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-black/60">
                    Reporter
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <UserAvatar user={reporter} showName={true} />
                  </div>
                </div>
              )}
            </div>

            <TaskMetadata task={task} />
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 text-sm font-normal ${
              activeTab === "comments"
                ? "border-b-2 border-black"
                : "text-black/60"
            }`}
            onClick={() => setActiveTab("comments")}
          >
            Comments ({taskComments.length})
          </button>
          <button
            className={`px-4 py-2 text-sm font-normal ${
              activeTab === "history"
                ? "border-b-2 border-black"
                : "text-black/60"
            }`}
            onClick={() => setActiveTab("history")}
          >
            History ({taskHistory.length})
          </button>
          <button
            className={`px-4 py-2 text-sm font-normal ${
              activeTab === "attachments"
                ? "border-b-2 border-black"
                : "text-black/60"
            }`}
            onClick={() => setActiveTab("attachments")}
          >
            Attachments ({taskAttachments.length})
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "comments" && (
          <div>
            {taskComments.length === 0 ? (
              <div className="text-center py-3 text-black/50 font-normal">
                No comments yet
              </div>
            ) : (
              taskComments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  taskComments={taskComments}
                  userInfo={getUserInfo(comment.userId)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div>
            {taskHistory.length === 0 ? (
              <div className="text-center py-3 text-black/50 font-normal">
                No history available
              </div>
            ) : (
              taskHistory.map((history) => (
                <HistoryItem key={history.id} history={history} />
              ))
            )}
          </div>
        )}

        {activeTab === "attachments" && (
          <div>
            {taskAttachments.length === 0 ? (
              <div className="text-center py-3 text-black/50 font-normal">
                No attachments
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {taskAttachments.map((attachment) => (
                  <AttachmentItem key={attachment.id} attachment={attachment} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Summary Dialog */}
      <AISummaryDialog
        isOpen={showAISummary}
        onClose={() => setShowAISummary(false)}
        itemId={task.id}
        summaryType="task"
        selectedModel={selectedModel}
      />
    </div>
  );
};

export default TaskPage;
