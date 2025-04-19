import { mockData, type Task, TaskStatus, TaskPriority } from "@/mock-data";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

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

// Status badge component with click handling
const StatusBadge = ({
  status,
  onClick,
}: {
  status: TaskStatus;
  onClick: (e: React.MouseEvent) => void;
}) => (
  <Badge
    variant="outline"
    className={`${statusColorMap[status].bg} ${statusColorMap[status].text} hover:cursor-pointer`}
    onClick={onClick}
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

// Assignee avatar component
const AssigneeAvatar = ({ userId }: { userId: string | null | undefined }) => {
  if (!userId) return null;

  const user = mockData.users.find((user) => user.id === userId);
  if (!user) return null;

  return (
    <Avatar className="w-6 h-6">
      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-xs font-medium">
        {user.name ? user.name.charAt(0) : user.email.charAt(0)}
      </div>
    </Avatar>
  );
};

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
    <SelectTrigger className="h-7 text-xs px-2 w-full">
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

// Task card component
const TaskDetailsCard = ({
  task,
  onStatusChange,
}: {
  task: Task;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
}) => {
  const [showStatusSelector, setShowStatusSelector] = useState(false);

  const project = mockData.projects.find((p) => p.id === task.projectId);

  const handleStatusBadgeClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to task page
    e.stopPropagation(); // Stop event bubble
    setShowStatusSelector(!showStatusSelector);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus !== task.status) {
      onStatusChange(task, newStatus);
    }
    setShowStatusSelector(false);
  };

  return (
    <Link to={`/dashboard/task/${task.id}`} className="block">
      <Card className="mb-2 hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="p-2 flex flex-row items-start justify-between">
          <div className="flex flex-col">
            <span className="font-semibold hover:underline">{task.title}</span>
            <div className="flex items-center gap-1 mt-1">
              <StatusBadge
                status={task.status}
                onClick={handleStatusBadgeClick}
              />
              {task.priority && <PriorityBadge priority={task.priority} />}
            </div>
            {showStatusSelector && (
              <div className="mt-1 w-36" onClick={(e) => e.preventDefault()}>
                <StatusSelector
                  currentStatus={task.status}
                  onStatusChange={handleStatusChange}
                />
              </div>
            )}
          </div>
          <AssigneeAvatar userId={task.assigneeId} />
        </CardHeader>

        {task.description && (
          <CardContent className="p-2 pt-0">
            <p className="text-sm text-gray-600 line-clamp-2">
              {task.description}
            </p>
          </CardContent>
        )}

        <CardFooter className="p-2 pt-0 flex items-center justify-between text-xs">
          <span className="text-gray-500 truncate max-w-32">
            {project?.name || task.projectId}
          </span>
          <div className="flex items-center gap-2">
            {task.numComments > 0 && (
              <span className="text-gray-500">{task.numComments} comments</span>
            )}
            {task.dueDate && (
              <span className="text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

// Column header component
const ColumnHeader = ({ title, count }: { title: string; count: number }) => (
  <div className="font-medium mb-2 flex items-center justify-between">
    <h3>{title}</h3>
    <Badge variant="outline">{count}</Badge>
  </div>
);

// Column component
const TaskColumn = ({
  status,
  title,
  tasks,
  onStatusChange,
}: {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
}) => {
  const columnTasks = tasks.filter((task) => task.status === status);

  return (
    <div className="board-column rounded-md border p-2 bg-gray-50">
      <ColumnHeader title={title} count={columnTasks.length} />
      <div className="board-column-content">
        {columnTasks.map((task) => (
          <TaskDetailsCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
          />
        ))}
        {columnTasks.length === 0 && (
          <div className="text-center py-3 text-gray-400 text-sm">
            No tasks here
          </div>
        )}
      </div>
    </div>
  );
};

// Main board component
export default function TaskBoard() {
  const [tasks, setTasks] = useState(mockData.tasks);

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    // In a real app, this would make an API call
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === task.id
          ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const columns = [
    { status: TaskStatus.BLOCKED, title: "Blocked" },
    { status: TaskStatus.TODO, title: "To Do" },
    { status: TaskStatus.IN_PROGRESS, title: "In Progress" },
    { status: TaskStatus.IN_REVIEW, title: "In Review" },
    { status: TaskStatus.COMPLETED, title: "Done" },
  ];

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {columns.map((column) => (
          <TaskColumn
            key={column.status}
            status={column.status}
            title={column.title}
            tasks={tasks}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
