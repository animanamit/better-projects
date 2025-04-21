import {
  getTaskById,
  getTaskHistoryById,
  getTaskCommentsById,
  getTaskAttachmentsById,
  mockData,
  TaskStatus,
  TaskPriority,
} from "@/mock-data";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AISummaryDialog from "@/components/ai-summary-dialog";
import { AIContext } from "./App";
import { useState, useContext } from "react";

// Style maps for task statuses and priorities
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

// Status selector component
const StatusSelector = ({
  currentStatus,
  onStatusChange,
}: {
  currentStatus: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
}) => (
  <Select
    defaultValue={currentStatus}
    onValueChange={(value: string) => onStatusChange(value as TaskStatus)}
  >
    <SelectTrigger className="h-8 text-xs w-full">
      <SelectValue placeholder="Change status" />
    </SelectTrigger>
    <SelectContent>
      {Object.values(TaskStatus).map((status) => (
        <SelectItem key={status} value={status}>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                statusColorMap[status as TaskStatus].bg
              }`}
            ></div>
            {status.replace(/_/g, " ")}
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
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

// Comment component
const Comment = ({ comment, taskComments, userInfo }) => {
  const isReply = !!comment.parentCommentId;
  const parentComment = isReply
    ? taskComments.find((c) => c.id === comment.parentCommentId)
    : null;

  return (
    <Card key={comment.id} className={isReply ? "ml-6" : ""}>
      <CardHeader className="p-3 pb-0">
        {isReply && (
          <p className="text-xs text-gray-500 mb-1">
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
          <span className="font-medium text-sm">{userInfo.name}</span>
          <span className="text-xs text-gray-500">{userInfo.role}</span>
          {userInfo.teams && userInfo.teams.length > 0 && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 text-xs py-0 h-5"
            >
              {userInfo.teams[0].name}
            </Badge>
          )}
          <span className="text-xs text-gray-400 ml-auto">
            {new Date(comment.createdAt).toLocaleString()}
            {comment.isEdited && " (edited)"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-2">
        <p className="text-gray-700 text-sm">{comment.content}</p>
      </CardContent>
    </Card>
  );
};

// History item component
const HistoryItem = ({ history }) => {
  const user = mockData.users.find((u) => u.id === history.changedBy);
  return (
    <Card key={history.id}>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium text-sm">
              Changed {history.fieldChanged} from{" "}
              <Badge variant="outline" className="font-mono text-xs">
                {history.oldValue}
              </Badge>{" "}
              to{" "}
              <Badge variant="outline" className="font-mono text-xs">
                {history.newValue}
              </Badge>
            </p>
            <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
              <UserAvatar user={user} size="sm" />
              {user?.name || "Unknown"}
            </p>
          </div>
          <p className="text-xs text-gray-500">
            {new Date(history.changedAt).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Attachment item component
const AttachmentItem = ({ attachment }) => {
  const user = mockData.users.find((u) => u.id === attachment.userId);
  return (
    <Card key={attachment.id}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <svg
            className="w-4 h-4 text-gray-500"
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
          <p className="font-medium truncate flex-1 text-sm">
            {attachment.fileName}
          </p>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{(attachment.fileSize / 1024).toFixed(0)} KB</span>
          <span className="flex items-center gap-1">
            <UserAvatar user={user} size="sm" />
            {user?.name || "Unknown"}
          </span>
        </div>
      </CardContent>
    </Card>
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
    <div className="border rounded-md py-2 px-3 bg-gray-50 shadow-sm">
      <h3 className="text-base font-bold text-gray-700 mb-2">Task Details</h3>
      <div className="grid grid-cols-2 gap-y-2 gap-x-3">
        {metadata.map((item, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-xs font-semibold text-gray-600">{item.label}</span>
            <span className="text-sm font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component
const TaskPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState(getTaskById(id));
  const [taskHistory, setTaskHistory] = useState(getTaskHistoryById(id));
  const taskComments = getTaskCommentsById(id);
  const taskAttachments = getTaskAttachmentsById(id);
  const { selectedModel } = useContext(AIContext);
  const [showAISummary, setShowAISummary] = useState(false);

  // Get user information for comments
  const getUserInfo = (userId: string) => {
    const user = mockData.users.find((user) => user.id === userId);
    if (!user) return { name: "Unknown User", role: "Unknown" };

    // Find team membership for this user
    const teamMemberships = mockData.teamMembers.filter(
      (tm) => tm.userId === userId
    );
    const teams = teamMemberships
      .map((tm) => {
        const team = mockData.teams.find((t) => t.id === tm.teamId);
        return team ? { id: team.id, name: team.name } : null;
      })
      .filter(Boolean);

    return {
      name: user.name || user.email,
      role: user.role || "Team Member",
      teams,
      avatarUrl: user.avatarUrl,
    };
  };

  if (!task) {
    return <div className="p-3">Task not found</div>;
  }

  const assignee = task.assigneeId
    ? mockData.users.find((user) => user.id === task.assigneeId)
    : null;

  const reporter = task.reporterId
    ? mockData.users.find((user) => user.id === task.reporterId)
    : null;

  const project = mockData.projects.find((p) => p.id === task.projectId);

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
      changedBy: mockData.users[0].id, // Assume current user is first user
    };

    // Update task
    const updatedTask = {
      ...task,
      status: newStatus,
      updatedAt: now,
    };

    setTask(updatedTask);
    setTaskHistory([historyEntry, ...taskHistory]);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="mb-4 border-l-4 border-l-blue-500 shadow-sm">
        <CardHeader className="py-3 px-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold mb-2">
                {task.title}
              </CardTitle>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="flex items-center gap-1 mr-2">
                  <span className="text-xs font-semibold text-gray-600">Status:</span>
                  <StatusBadge status={task.status} />
                </div>

                {task.priority && (
                  <div className="flex items-center gap-1 mr-2">
                    <span className="text-xs font-semibold text-gray-600">Priority:</span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                )}

                {project && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-gray-600">Project:</span>
                    <Badge variant="outline" className="bg-gray-100 font-medium">
                      {project.name}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="w-56">
                  <StatusSelector
                    currentStatus={task.status}
                    onStatusChange={handleStatusChange}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 gap-1 border-orange-200 text-orange-600 hover:bg-orange-50 font-medium"
                  onClick={() => setShowAISummary(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                  Generate AI Summary
                </Button>
              </div>
            </div>

            <div className="flex flex-row gap-4 bg-gray-50 py-2 px-3 rounded-md">
              {assignee && (
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-600">Assignee</span>
                  <div className="flex items-center gap-1">
                    <UserAvatar user={assignee} showName={true} />
                  </div>
                </div>
              )}

              {reporter && (
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-600">Reporter</span>
                  <div className="flex items-center gap-1">
                    <UserAvatar user={reporter} showName={true} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-3 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {task.description && (
                <div>
                  <h3 className="text-base font-bold text-gray-700 mb-1">
                    Description
                  </h3>
                  <div className="text-gray-700 whitespace-pre-line text-sm bg-gray-50 p-2 rounded-md">
                    {task.description}
                  </div>
                </div>
              )}
            </div>

            <TaskMetadata task={task} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="comments" className="w-full">
        <TabsList className="mb-3">
          <TabsTrigger value="comments" className="font-medium text-base">
            Comments ({taskComments.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="font-medium text-base">
            History ({taskHistory.length})
          </TabsTrigger>
          <TabsTrigger value="attachments" className="font-medium text-base">
            Attachments ({taskAttachments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comments" className="space-y-2">
          {taskComments.length === 0 ? (
            <div className="text-center py-3 text-gray-500 font-medium">
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
        </TabsContent>

        <TabsContent value="history" className="space-y-2">
          {taskHistory.length === 0 ? (
            <div className="text-center py-3 text-gray-500 font-medium">
              No history available
            </div>
          ) : (
            taskHistory.map((history) => (
              <HistoryItem key={history.id} history={history} />
            ))
          )}
        </TabsContent>

        <TabsContent value="attachments">
          {taskAttachments.length === 0 ? (
            <div className="text-center py-3 text-gray-500 font-medium">
              No attachments
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {taskAttachments.map((attachment) => (
                <AttachmentItem key={attachment.id} attachment={attachment} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

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