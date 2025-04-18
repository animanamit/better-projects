import { useState, createContext, useContext, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import TopBar from "@/components/top-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FileManagement } from "./components/file-management";

import TaskBoard from "@/components/task-board";
import { Outlet, useLocation } from "react-router-dom";

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

function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("tasks");
  const location = useLocation();
  const [isTaskPage, setIsTaskPage] = useState(false);

  useEffect(() => {
    // Update what kind of page we're viewing
    const onDetailPage = location.pathname.includes("/task/") || 
                         location.pathname.includes("/project/") ||
                         location.pathname.includes("/team/");
    setIsTaskPage(onDetailPage);
    
    // If we're back on the dashboard main page, make sure the tab selection works
    if (location.pathname === "/dashboard") {
      // Tab selection is already handled by the sidebar clicks
      // This just ensures the UI is in sync
    }
  }, [location]);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <SidebarProvider>
        <main className="flex flex-col h-screen w-full">
          <TopBar />
          <div className="flex flex-row h-full w-full max-w-screen overflow-hidden">
            <AppSidebar />
            <div className="flex-1 flex flex-col overflow-x-scroll">
              {/* Content */}
              <div className="">
                {isTaskPage ? (
                  <Outlet />
                ) : (
                  <>
                    {activeTab === "tasks" && <TaskBoard />}

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

export default Dashboard;
