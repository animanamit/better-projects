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
    className={`${statusColorMap[status].bg} ${statusColorMap[status].text} hover:cursor-pointer text-sm font-medium`}
    onClick={onClick}
  >
    {status.replace(/_/g, " ")}
  </Badge>
);

// Priority badge component
const PriorityBadge = ({ priority }: { priority: TaskPriority }) => (
  <Badge
    variant="outline"
    className={`${priorityColorMap[priority].bg} ${priorityColorMap[priority].text} text-sm font-medium`}
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
    <Avatar className="w-7 h-7">
      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-sm font-medium">
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
    <SelectTrigger className="h-8 text-sm px-2 w-full font-medium">
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
            <span className="font-medium">{status.replace(/_/g, " ")}</span>
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
        <CardHeader className="py-1 px-3 flex flex-row items-start justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-lg hover:underline">{task.title}</span>
            <div className="flex items-center gap-1">
              <StatusBadge
                status={task.status}
                onClick={handleStatusBadgeClick}
              />
              {task.priority && <PriorityBadge priority={task.priority} />}
            </div>
            {showStatusSelector && (
              <div className="mt-1 w-40" onClick={(e) => e.preventDefault()}>
                <StatusSelector
                  currentStatus={task.status}
                  onStatusChange={handleStatusChange}
                />
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <AssigneeAvatar userId={task.assigneeId} />
            {task.assigneeId && (
              <span className="text-sm font-medium text-gray-600">
                {mockData.users.find(u => u.id === task.assigneeId)?.name?.split(' ')[0] || 'Assignee'}
              </span>
            )}
          </div>
        </CardHeader>

        <CardFooter className="py-1 px-3 flex items-center justify-between">
          <span className="font-medium text-gray-700 truncate max-w-44 text-sm">
            {project?.name || task.projectId}
          </span>
          <div className="flex items-center gap-2 text-sm">
            {task.numComments > 0 && (
              <span className="text-gray-600 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {task.numComments}
              </span>
            )}
            {task.dueDate && (
              <span className="text-gray-600 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(task.dueDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
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
  <div className="font-bold text-lg mb-1 flex items-center justify-between">
    <h3>{title}</h3>
    <Badge variant="outline" className="font-medium text-sm">{count}</Badge>
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
    <div className="board-column rounded-md border p-2 bg-gray-50 min-w-[375px] w-[375px]">
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
          <div className="text-center py-2 text-gray-400 text-base font-medium">
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
    <div className="flex gap-3 overflow-x-scroll py-1">
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
  );
}
