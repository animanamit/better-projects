import { mockData, type Task, TaskStatus, TaskPriority } from "@/mock-data";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { useState } from "react";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";

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

// Status badge component with click handling
const StatusBadge = ({
  status,
  onClick,
}: {
  status: TaskStatus;
  onClick: (e: React.MouseEvent) => void;
}) => (
  <div
    className={`inline-flex px-2 py-0.5 text-xs ${statusColorMap[status].bg} ${statusColorMap[status].text} hover:cursor-pointer`}
    onClick={onClick}
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

// Assignee avatar component
const AssigneeAvatar = ({ userId }: { userId: string | null | undefined }) => {
  if (!userId) return null;

  const user = mockData.users.find((user) => user.id === userId);
  if (!user) return null;

  return (
    <Avatar className="w-6 h-6">
      <div
        title={user.name || user.email}
        className="w-full h-full flex items-center justify-center bg-[#f0f0f0] text-xs font-normal text-black/80"
      >
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
  <select
    value={currentStatus}
    onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
    className="h-8 text-xs px-2 w-full bg-white"
  >
    {Object.values(TaskStatus).map((status) => (
      <option key={status} value={status}>
        {status.replace(/_/g, " ")}
      </option>
    ))}
  </select>
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
      <div className="mb-2 bg-white p-3 hover:bg-[#f8f8f8] transition-colors">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="font-normal text-sm mb-1">{task.title}</div>
            <div className="flex flex-wrap gap-1 mb-1">
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

          <div className="ml-2">
            <AssigneeAvatar userId={task.assigneeId} />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-black/60">
          <span className="truncate max-w-44">
            {project?.name || task.projectId}
          </span>
          <div className="flex items-center gap-2">
            {task.numComments > 0 && (
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                {task.numComments}
              </span>
            )}
            {task.dueDate && (
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Column header component
const ColumnHeader = ({
  title,
  count,
  color,
  isActive = false,
  onClick = () => {},
}: {
  title: string;
  count: number;
  color: string;
  isActive?: boolean;
  onClick?: () => void;
}) => (
  <div 
    className={`font-normal text-sm mb-2 flex items-center justify-between ${isActive ? 'bg-black/5 p-1 rounded' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center">
      <div className={`w-2 h-2 rounded-full ${color} mr-2`}></div>
      <h3>{title}</h3>
    </div>
    <div className="text-xs text-black/60">{count}</div>
  </div>
);

// Column component
const TaskColumn = ({
  status,
  title,
  tasks,
  onStatusChange,
  color,
  isActive = false,
  onClick = () => {},
}: {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
  color: string;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  const columnTasks = tasks.filter((task) => task.status === status);
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? 'w-full' : 'min-w-[280px] w-[280px]'} ${!isActive && isMobile ? 'hidden' : ''}`}>
      <ColumnHeader 
        title={title} 
        count={columnTasks.length} 
        color={color} 
        isActive={isActive}
        onClick={onClick}
      />
      <div>
        {columnTasks.map((task) => (
          <TaskDetailsCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
          />
        ))}
        {columnTasks.length === 0 && (
          <div className="text-center py-2 text-black/40 text-xs">No tasks</div>
        )}
      </div>
    </div>
  );
};

// Import the CreateTaskDialog
import { CreateTaskDialog } from "./create-task-dialog";
import { useMockData } from "@/lib/mock-data-context";
import { AiCommand } from "./ai-command";

// Main board component
export default function TaskBoard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeColumnIndex, setActiveColumnIndex] = useState(1); // Default to "To Do"
  const isMobile = useIsMobile();
  const isTablet = useBreakpoint('lg');

  // Get tasks from context if available, otherwise use mock data
  const mockDataContext = useMockData();
  const [localTasks, setLocalTasks] = useState(mockData.tasks);

  // Use tasks from context if available, otherwise use local state
  const tasks = mockDataContext?.tasks || localTasks;

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    // If we have context, use it, otherwise use local state
    if (mockDataContext?.updateTask) {
      mockDataContext.updateTask({
        id: task.id,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // In a real app, this would make an API call
      setLocalTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id
            ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
            : t
        )
      );
    }
  };

  const columns = [
    { status: TaskStatus.BLOCKED, title: "Blocked", color: "bg-[#E11D48]" },
    { status: TaskStatus.TODO, title: "To Do", color: "bg-black/60" },
    {
      status: TaskStatus.IN_PROGRESS,
      title: "In Progress",
      color: "bg-[#F44A00]",
    },
    { status: TaskStatus.IN_REVIEW, title: "In Review", color: "bg-[#7928CA]" },
    { status: TaskStatus.COMPLETED, title: "Done", color: "bg-[#16A34A]" },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-normal">Task Board</h1>

        <div className="flex items-center gap-3">
          <span className="text-xs text-black/60 hidden md:inline-flex items-center">
            <kbd className="px-1 py-0.5 bg-black/5 rounded text-black/70 font-mono">
              <h6 className="text-xs">
                {navigator.platform.indexOf("Mac") === 0 ? "⌘" : "Ctrl"}K
              </h6>
            </kbd>
            <span className="ml-1">to create with AI</span>
          </span>

          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="px-2 sm:px-4 py-2 bg-black text-white text-xs sm:text-sm hover:bg-black/90 flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Task
          </button>
        </div>
      </div>
      
      {/* Mobile Column Selector */}
      {isMobile && (
        <div className="flex justify-between mb-3 overflow-x-auto pb-2">
          {columns.map((column, index) => (
            <button
              key={column.status}
              onClick={() => setActiveColumnIndex(index)}
              className={`px-2 py-1 text-xs whitespace-nowrap flex items-center ${
                index === activeColumnIndex 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black/70'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${column.color} mr-1`}></div>
              {column.title}
            </button>
          ))}
        </div>
      )}

      {/* Desktop and tablet view - horizontal scrolling */}
      {!isMobile ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {columns.map((column) => (
            <TaskColumn
              key={column.status}
              status={column.status}
              title={column.title}
              tasks={tasks}
              onStatusChange={handleStatusChange}
              color={column.color}
            />
          ))}
        </div>
      ) : (
        /* Mobile view - only show active column */
        <div className="flex flex-col">
          {columns.map((column, index) => (
            <TaskColumn
              key={column.status}
              status={column.status}
              title={column.title}
              tasks={tasks}
              onStatusChange={handleStatusChange}
              color={column.color}
              isActive={index === activeColumnIndex}
              onClick={() => setActiveColumnIndex(index)}
            />
          ))}
        </div>
      )}
      
      {/* Add spacing for mobile bottom navigation */}
      {isMobile && <div className="h-16"></div>}

      {/* Create Task Dialog */}
      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      {/* AI Command for task creation */}
      <AiCommand />
    </div>
  );
}
