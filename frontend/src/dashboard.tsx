import { useState, createContext, useContext } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import TopBar from "@/components/top-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CreateTask } from "./components/create-task";
import { FileManagement } from "./components/file-management";

import { mockData, TaskStatus, type Task } from "@/mock-data";

// Create a context for the active tab
export type TabType = 'tasks' | 'files';
export const TabContext = createContext<{
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}>({
  activeTab: 'tasks',
  setActiveTab: () => {},
});

// Custom hook to use the tab context
export const useTabContext = () => useContext(TabContext);

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
  const [activeTab, setActiveTab] = useState<TabType>('tasks');

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <SidebarProvider>
        <main className="flex flex-col h-screen w-full">
          <TopBar />
          <div className="flex flex-row h-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-4" aria-label="Tabs">
                  <button 
                    onClick={() => setActiveTab('tasks')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'tasks' 
                        ? 'border-indigo-500 text-indigo-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Tasks
                  </button>
                  <button 
                    onClick={() => setActiveTab('files')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'files' 
                        ? 'border-indigo-500 text-indigo-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Files
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto">
                {activeTab === 'tasks' && (
                  <div className="p-4">
                    {mockData.tasks.slice(0, 2).map((task: Task) => (
                      <div
                        key={task.id}
                        className="p-4 mb-4 bg-white rounded-lg shadow-md"
                      >
                        <h3 className="text-xl font-bold">{task.title}</h3>
                        <p className="text-gray-600">{task.description}</p>
                        <span className="uppercase text-xs">{task.projectId}</span>
                      </div>
                    ))}
                    <div className="flex flex-col gap-4">
                      {mockData.tasks.map((task: Task) => (
                        <TaskDetailsCard key={task.id} task={task} />
                      ))}
                    </div>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                      <CreateTask />
                    </div>
                  </div>
                )}

                {activeTab === 'files' && (
                  <FileManagement />
                )}
              </div>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </TabContext.Provider>
  );
}

export default Dashboard;
