import { useState, createContext, useContext, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import TopBar from "@/components/top-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FileManagement } from "./components/file-management";
import TaskBoard from "@/components/task-board";
import { Outlet, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";

// Create a context for the active tab
export type TabType = "tasks" | "files";
export const TabContext = createContext<{
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}>({
  activeTab: "tasks",
  setActiveTab: () => {},
});

// Custom hook to use the tab context
export const useTabContext = () => useContext(TabContext);

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<TabType>("tasks");
  const location = useLocation();
  const [isTaskPage, setIsTaskPage] = useState(false);

  useEffect(() => {
    setIsTaskPage(location.pathname.includes("/task/"));
  }, [location]);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <SidebarProvider>
        <main className="flex flex-col h-screen w-full">
          <TopBar />
          <div className="flex flex-row h-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              {/* Content */}
              <div className="flex-1 overflow-auto">
                {isTaskPage ? (
                  <Outlet />
                ) : (
                  <>
                    {activeTab === "tasks" && (
                      <div className="p-4">
                        <TaskBoard />
                      </div>
                    )}

                    {activeTab === "files" && <FileManagement />}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </TabContext.Provider>
  );
}

// This wrapper ensures Redux is available throughout the dashboard
function Dashboard() {
  return (
    <Provider store={store}>
      <DashboardContent />
    </Provider>
  );
}

export default Dashboard;