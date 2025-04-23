import { useState, createContext, useContext, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import TopBar from "@/components/top-bar";
import { FileManagement } from "./components/file-management";
import { AIContext } from "./App";
import TaskBoard from "@/components/task-board";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

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
  const { selectedModel, setSelectedModel } = useContext(AIContext);

  useEffect(() => {
    // Update what kind of page we're viewing
    const onDetailPage =
      location.pathname.includes("/task/") ||
      location.pathname.includes("/project/") ||
      location.pathname.includes("/team/");
    setIsTaskPage(onDetailPage);

    // If we're back on the dashboard main page, make sure the tab selection works
    if (location.pathname === "/dashboard") {
      // Tab selection is already handled by the sidebar clicks
      // This just ensures the UI is in sync
    }
  }, [location]);

  // Add debug logging for model selection
  useEffect(() => {
    console.log("Dashboard rendering with selected model:", selectedModel);
  }, [selectedModel]);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <SidebarProvider>
        <main className="flex flex-col h-screen w-full bg-[#f8f8f8]">
          <TopBar
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
          <div className="flex flex-row h-full w-full overflow-hidden">
            <AppSidebar />
            <div className="flex-1 overflow-auto">
              {/* Content */}
              <div className="p-4">
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
