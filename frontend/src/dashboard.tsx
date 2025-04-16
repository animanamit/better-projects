import { AppSidebar } from "@/components/app-sidebar";
import TopBar from "@/components/top-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CreateTask } from "./components/create-task";

import { mockData, TaskStatus, type Task } from "@/mock-data";

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
    <div className="p-4 mb-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        <span className="text-sm font-semibold text-gray-700 mr-2">
          {task.assigneeId}
        </span>
        <span className={`text-sm ${statusClassMap[task.status]}`}>
          {task.status}
        </span>
      </div>
      <h3 className="text-xl font-bold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
      <p className="text-sm text-gray-500 font-mono">
        {task.dueDate?.toString().split("T")[0]}
      </p>
      <div>
        <span className="text-sm tracking-tight">Related Tasks</span>
      </div>
      <span className="uppercase text-xs">{task.projectId}</span>
    </div>
  );
};

function Dashboard() {
  return (
    <SidebarProvider>
      <main className="flex flex-col  h-screen w-full">
        <TopBar />
        <div className="flex flex-row h-full">
          <AppSidebar />
          <div className="flex-1 p-4">
            {mockData.tasks.slice(0, 2).map((task: Task) => (
              <div
                key={task.id}
                className="p-4 mb-4 bg-white rounded-lg shadow-md"
              >
                <h3 className="text-xl font-bold">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                {/* <p className="text-sm text-gray-500 font-mono">
                  {task.dueDate?.toString().split("T")[0]}
                </p> */}
                <span className="uppercase text-xs">{task.projectId}</span>
              </div>
            ))}
            <div className="flex flex-col gap-4">
              {mockData.tasks
                // .slice(2, 4)
                .map((task: Task) => (
                  <TaskDetailsCard key={task.id} task={task} />
                ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <CreateTask />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default Dashboard;
