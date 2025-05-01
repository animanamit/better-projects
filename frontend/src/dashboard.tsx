import { useState, createContext, useContext, useEffect, useCallback, useRef } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import TopBar from "@/components/top-bar";
import { FileManagement } from "./components/file-management";
import { AIContext } from "./App";
import TaskBoard from "@/components/task-board";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { MockDataProvider } from "@/lib/mock-data-context";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  // Reference to the sidebar container element to find the trigger
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Function to toggle sidebar on mobile
  const toggleMobileSidebar = useCallback(() => {
    console.log("Toggle mobile sidebar called");
    
    // Try to find our specific trigger button first
    const triggerById = document.getElementById('mobile-sidebar-trigger') as HTMLButtonElement;
    if (triggerById) {
      console.log("Found trigger by ID, clicking");
      triggerById.click();
      return;
    }
    
    if (sidebarRef.current) {
      console.log("Sidebar ref found");
      
      // Try different selectors to find the trigger
      let trigger = sidebarRef.current.querySelector('button[data-sidebar="trigger"]') as HTMLButtonElement;
      
      if (!trigger) {
        console.log("Trying alternate selector");
        trigger = sidebarRef.current.querySelector('[data-slot="sidebar-trigger"]') as HTMLButtonElement;
      }
      
      if (!trigger) {
        // Last resort - find any sheet element
        const sheet = document.querySelector('[role="dialog"]');
        if (sheet) {
          console.log("Found sheet dialog, trying to show");
          // Try to change its attribute
          const styles = window.getComputedStyle(sheet);
          if (styles.display === 'none') {
            (sheet as HTMLElement).style.display = 'block';
          } else {
            (sheet as HTMLElement).style.display = 'none';
          }
          return;
        }
      }
      
      if (trigger) {
        console.log("Trigger found, clicking");
        trigger.click();
      } else {
        console.log("Sidebar trigger button not found");
      }
    } else {
      console.log("Sidebar ref not found");
    }
  }, []);

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

  // Let's create a simple state to track sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Function to manually toggle sidebar
  useEffect(() => {
    // Expose the toggle function to the window for debug purposes
    (window as any).toggleSidebar = () => {
      setIsSidebarOpen(prev => !prev);
    };
  }, []);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <MockDataProvider>
        <SidebarProvider defaultOpen={!isMobile} open={isMobile ? undefined : undefined} onOpenChange={isMobile ? setIsSidebarOpen : undefined}>
          <main className="flex flex-col h-screen w-full bg-[#f8f8f8]" ref={sidebarRef}>
            <TopBar
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
            <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
              {/* Desktop sidebar - hidden on mobile */}
              <div className="hidden md:block">
                <AppSidebar />
              </div>
              
              {/* Main content area */}
              <div className="flex-1 overflow-auto">
                {/* Content */}
                <div className="p-2 sm:p-4">
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
              
              {/* Mobile navigation - only shown on mobile */}
              {isMobile && (
                <>
                  {/* Our custom sheet for the mobile sidebar */}
                  <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetContent side="left" className="p-0 w-[280px]">
                      <div className="sr-only">
                        <SheetTitle>Navigation Menu</SheetTitle>
                        <SheetDescription>App navigation for projects and teams</SheetDescription>
                      </div>
                      <AppSidebar />
                    </SheetContent>
                  </Sheet>
                
                  {/* Mobile navigation bar */}
                  <MobileNavigation 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    toggleSidebar={() => setIsSidebarOpen(true)}
                  />
                </>
              )}
            </div>
          </main>
        </SidebarProvider>
      </MockDataProvider>
    </TabContext.Provider>
  );
}

// Mobile navigation component
function MobileNavigation({ 
  activeTab, 
  setActiveTab,
  toggleSidebar
}: { 
  activeTab: TabType; 
  setActiveTab: (tab: TabType) => void;
  toggleSidebar: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-10">
      <button 
        onClick={() => setActiveTab("tasks")} 
        className={`flex flex-col items-center p-2 ${activeTab === "tasks" ? "text-black" : "text-black/60"}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 10h8"></path>
          <path d="M8 14h4"></path>
        </svg>
        <span className="text-xs mt-1">Tasks</span>
      </button>
      <button 
        onClick={() => setActiveTab("files")} 
        className={`flex flex-col items-center p-2 ${activeTab === "files" ? "text-black" : "text-black/60"}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
          <polyline points="13 2 13 9 20 9"></polyline>
        </svg>
        <span className="text-xs mt-1">Files</span>
      </button>
      <button 
        className="flex flex-col items-center p-2 text-black/60"
        onClick={() => {
          console.log("Menu button clicked, toggling sidebar");
          toggleSidebar();
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <span className="text-xs mt-1">Menu</span>
      </button>
    </div>
  );
}

export default Dashboard;
