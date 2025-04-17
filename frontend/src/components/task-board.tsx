import { mockData, type Task, TaskStatus } from "@/mock-data";

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
    <a href={`/task/${task.id}`}>
      <div className="p-4 mb-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <span className="text-sm font-semibold text-gray-700 mr-2">
            {task.assigneeId}
          </span>
          <span className={`text-sm ${statusClassMap[task.status]}`}>
            {task.status}
          </span>
        </div>
        <h3 className="text-lg font-bold">{task.title}</h3>
        {/* <p className="text-gray-600">{task.description}</p> */}
        {/* <p className="text-sm text-gray-500 font-mono">
          {task.dueDate?.toString().split("T")[0]}
        </p> */}
        <span className="uppercase text-xs">{task.projectId}</span>
      </div>
    </a>
  );
};

export default function TaskBoard() {
  const tasks = mockData.tasks;

  return (
    <div className="flex flex-col">
      <div className="board flex flex-row gap-4">
        <div className="board-column max-w-1/4 flex-1">
          <div className="board-column-header">TODO</div>
          <div className="board-column-content">
            {tasks
              .filter((task) => task.status === TaskStatus.TODO)
              .map((task) => (
                <TaskDetailsCard key={task.id} task={task} />
              ))}
          </div>
        </div>
        <div className="board-column max-w-1/4 flex-1">
          <div className="board-column-header">IN PROGRESS</div>
          <div className="board-column-content">
            {tasks
              .filter((task) => task.status === TaskStatus.IN_PROGRESS)
              .map((task) => (
                <TaskDetailsCard key={task.id} task={task} />
              ))}
          </div>
        </div>
        <div className="board-column max-w-1/4 flex-1">
          <div className="board-column-header">IN REVIEW</div>
          <div className="board-column-content">
            {tasks
              .filter((task) => task.status === TaskStatus.IN_REVIEW)
              .map((task) => (
                <TaskDetailsCard key={task.id} task={task} />
              ))}
          </div>
        </div>
        <div className="board-column max-w-1/4 flex-1">
          <div className="board-column-header">DONE</div>
          <div className="board-column-content">
            {tasks
              .filter((task) => task.status === TaskStatus.COMPLETED)
              .map((task) => (
                <TaskDetailsCard key={task.id} task={task} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
