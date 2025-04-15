import { AppSidebar } from "@/components/app-sidebar";
import TopBar from "@/components/top-bar";
import { SidebarProvider } from "@/components/ui/sidebar";

import { mockData, type Task } from "@/mock-data";

function Dashboard() {
  return (
    <SidebarProvider>
      <main className="flex flex-col  h-screen w-full">
        <TopBar />
        <div className="flex flex-row h-full">
          <AppSidebar />
          <div className="flex-1 p-4">
            {mockData.tasks.slice(0, 3).map((task: Task) => (
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
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default Dashboard;
