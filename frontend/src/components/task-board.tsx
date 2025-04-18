import { type Task, TaskStatus } from "@/mock-data";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "@/lib/api";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setFilteredStatus, setSearchQuery } from "@/store/slices/taskSlice";
import { useEffect } from "react";
import { useSignIn } from "@clerk/clerk-react";

const statusClassMap: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "text-todo",
  [TaskStatus.IN_PROGRESS]: "text-in-progress",
  [TaskStatus.IN_REVIEW]: "text-in-review",
  [TaskStatus.TESTING]: "text-testing",
  [TaskStatus.BLOCKED]: "text-blocked",
  [TaskStatus.COMPLETED]: "text-completed",
};

const TaskDetailsCard = ({ task }: { task: Task }) => {
  return (
    <Link to={`/dashboard/task/${task.id}`}>
      <div className="p-4 mb-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-2">
          <span className="text-sm font-semibold text-gray-700 mr-2">
            {task.assigneeId}
          </span>
          <span className={`text-sm ${statusClassMap[task.status]}`}>
            {task.status}
          </span>
        </div>
        <h3 className="text-lg font-bold">{task.title}</h3>
        <div className="flex items-center justify-between">
          <span className="uppercase text-xs">{task.projectId}</span>
          <span className="text-xs text-gray-500 ">
            {task.numComments} comments
          </span>
        </div>
      </div>
    </Link>
  );
};

export default function TaskBoard() {
  const dispatch = useAppDispatch();
  const { filteredStatus, searchQuery } = useAppSelector((state) => state.tasks);
  const { isSignedIn, user } = useSignIn();
  
  // Use React Query to fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: () => fetchTasks(user?.id || 'user-01', user?.emailAddress),
    enabled: isSignedIn,
  });
  
  // Reset filters when component unmounts
  useEffect(() => {
    return () => {
      dispatch(setFilteredStatus(null));
      dispatch(setSearchQuery(''));
    };
  }, [dispatch]);
  
  // Filter tasks based on Redux state
  const filteredTasks = tasks.filter(task => {
    // Apply status filter if set
    if (filteredStatus && task.status !== filteredStatus) {
      return false;
    }
    
    // Apply search filter if set
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Group tasks by status
  const todoTasks = filteredTasks.filter(task => task.status === TaskStatus.TODO);
  const inProgressTasks = filteredTasks.filter(task => task.status === TaskStatus.IN_PROGRESS);
  const inReviewTasks = filteredTasks.filter(task => task.status === TaskStatus.IN_REVIEW);
  const completedTasks = filteredTasks.filter(task => task.status === TaskStatus.COMPLETED);
  
  if (isLoading) {
    return <div className="flex justify-center p-4">Loading tasks...</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="board flex flex-row gap-4">
        <div className="board-column max-w-1/4 flex-1">
          <div className="board-column-header">TODO</div>
          <div className="board-column-content">
            {todoTasks.map((task) => (
              <TaskDetailsCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        <div className="board-column max-w-1/4 flex-1">
          <div className="board-column-header">IN PROGRESS</div>
          <div className="board-column-content">
            {inProgressTasks.map((task) => (
              <TaskDetailsCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        <div className="board-column max-w-1/4 flex-1">
          <div className="board-column-header">IN REVIEW</div>
          <div className="board-column-content">
            {inReviewTasks.map((task) => (
              <TaskDetailsCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        <div className="board-column max-w-1/4 flex-1">
          <div className="board-column-header">DONE</div>
          <div className="board-column-content">
            {completedTasks.map((task) => (
              <TaskDetailsCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}