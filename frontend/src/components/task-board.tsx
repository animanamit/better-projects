import { mockData, type Task, TaskStatus } from "@/mock-data";
import ExpandedTask from "@/components/expanded-task";

export default function TaskBoard() {
  const tasks = mockData.tasks;

  return (
    <div className="flex flex-col">
      <div>This Sprint's Tasks</div>
      <div className="board flex flex-row">
        <div className="board-column">
          <div className="board-column-header">TODO</div>
          <div className="board-column-content">
            {tasks
              .filter((task) => task.status === TaskStatus.TODO)
              .map((task) => (
                <ExpandedTask key={task.id} task={task} />
              ))}
          </div>
        </div>
        <div className="board-column">
          <div className="board-column-header">IN PROGRESS</div>
          <div className="board-column-content">
            {tasks
              .filter((task) => task.status === TaskStatus.IN_PROGRESS)
              .map((task) => (
                <ExpandedTask key={task.id} task={task} />
              ))}
          </div>
        </div>
        <div className="board-column">
          <div className="board-column-header">IN REVIEW</div>
          <div className="board-column-content">
            {tasks
              .filter((task) => task.status === TaskStatus.IN_REVIEW)
              .map((task) => (
                <ExpandedTask key={task.id} task={task} />
              ))}
          </div>
        </div>
        <div className="board-column">
          <div className="board-column-header">DONE</div>
          <div className="board-column-content">
            {tasks
              .filter((task) => task.status === TaskStatus.COMPLETED)
              .map((task) => (
                <ExpandedTask key={task.id} task={task} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
