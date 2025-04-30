import { TaskPriority, TaskStatus, type Task } from "@/mock-data";
import { useMockData } from "@/lib/mock-data-context";
import { useQuery } from "@tanstack/react-query";

interface TaskListProps {
  userId?: string;
  limit?: number;
  showEmpty?: boolean;
  emptyMessage?: string;
}

export function TaskList({ 
  userId = "user-01", 
  limit = 10,
  showEmpty = true,
  emptyMessage = "No tasks yet"
}: TaskListProps) {
  // Get tasks from mock data context
  const { tasks } = useMockData();

  // Query for tasks filtered for the current user
  const { data: userTasks = [] } = useQuery({
    queryKey: ["tasks", userId, limit],
    queryFn: async () => {
      // Filter tasks for the current user and apply limit
      return tasks
        .filter(task => task.assigneeId === userId || task.reporterId === userId)
        .slice(0, limit);
    },
    // These options ensure the data stays fresh when the mock data changes
    enabled: Boolean(userId),
    staleTime: 0,
  });

  // Display empty state if needed
  if (userTasks.length === 0 && showEmpty) {
    return <div className="text-sm text-black/60 py-3">{emptyMessage}</div>;
  }

  // Determine if there are any tasks to show
  if (userTasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {userTasks.map((task: Task) => (
        <div key={task.id} className="bg-white p-3">
          <div className="flex justify-between">
            <h3 className="font-normal text-sm">{task.title}</h3>
            {task.priority && (
              <span 
                className={`text-xs px-1.5 py-0.5 rounded ${
                  task.priority === TaskPriority.HIGH || task.priority === TaskPriority.HIGHEST
                    ? "bg-orange-100 text-orange-800"
                    : task.priority === TaskPriority.MEDIUM
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {task.priority}
              </span>
            )}
          </div>
          
          {task.description && (
            <p className="text-sm text-black/60 mt-1">
              {task.description}
            </p>
          )}
          
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-1.5 py-0.5 bg-black/5 text-black/70 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex justify-between mt-2 text-xs text-black/50">
            <span>{task.status}</span>
            {task.estimatedHours && (
              <span>{task.estimatedHours}h estimated</span>
            )}
            {task.dueDate && (
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}