import { useTabContext } from "@/dashboard";
import { mockData } from "@/mock-data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar() {
  const { activeTab, setActiveTab } = useTabContext();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  // Determine if a project or team page is active
  const isProjectActive = pathname.includes("/dashboard/project/");
  const isTeamActive = pathname.includes("/dashboard/team/");
  const activeProjectId = isProjectActive ? pathname.split("/").pop() : null;
  const activeTeamId = isTeamActive ? pathname.split("/").pop() : null;

  // Function to handle clicking on Tasks or Files buttons
  const handleMainTabClick = (tab) => {
    setActiveTab(tab);
    // If we're on a project or team page, navigate back to the dashboard without page reload
    if (isProjectActive || isTeamActive) {
      navigate("/dashboard");
    }
    
    // Close the mobile sidebar if on mobile
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
  // Function to handle clicking on project or team links
  const handleLinkClick = () => {
    // Close the mobile sidebar if on mobile
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <div className={`${isMobile ? "w-full" : "w-56"} h-full bg-[#f8f8f8] flex flex-col overflow-hidden`}>
      <div className="px-4 py-3 text-xs text-black/60 border-b border-black/10">UNIT 2025</div>

      <div className="flex-1 overflow-auto">
        {/* Main tabs */}
        <div className="px-3 py-2">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleMainTabClick("tasks")}
              className={`text-sm px-2 py-1.5 text-left flex items-center ${
                activeTab === "tasks" && !isProjectActive && !isTeamActive
                  ? "bg-black text-white"
                  : "text-black/70 hover:bg-black/5"
              }`}
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 10h8"></path>
                <path d="M8 14h4"></path>
              </svg>
              Tasks
            </button>
            <button
              onClick={() => handleMainTabClick("files")}
              className={`text-sm px-2 py-1.5 text-left flex items-center ${
                activeTab === "files" && !isProjectActive && !isTeamActive
                  ? "bg-black text-white"
                  : "text-black/70 hover:bg-black/5"
              }`}
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
              Files
            </button>
          </div>
        </div>

        {/* Projects section */}
        <div className="mt-4 px-3">
          <div className="text-xs font-medium text-black/60 mb-1 flex justify-between items-center">
            <span>PROJECTS</span>
            <button className="text-black/60 hover:text-black p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          <div className="flex flex-col space-y-0.5">
            {mockData.projects.map((project) => (
              <Link
                key={project.id}
                to={`/dashboard/project/${project.id}`}
                className={`text-sm px-2 py-1.5 ${
                  activeProjectId === project.id
                    ? "bg-black text-white"
                    : "text-black/70 hover:bg-black/5"
                }`}
                onClick={handleLinkClick}
              >
                {project.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Teams section */}
        <div className="mt-4 px-3 pb-4">
          <div className="text-xs font-medium text-black/60 mb-1 flex justify-between items-center">
            <span>TEAMS</span>
            <button className="text-black/60 hover:text-black p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          <div className="flex flex-col space-y-0.5">
            {mockData.teams.map((team) => (
              <Link
                key={team.id}
                to={`/dashboard/team/${team.id}`}
                className={`text-sm px-2 py-1.5 ${
                  activeTeamId === team.id
                    ? "bg-black text-white"
                    : "text-black/70 hover:bg-black/5"
                }`}
                onClick={handleLinkClick}
              >
                {team.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile-only profile section */}
      {isMobile && (
        <div className="mt-auto border-t border-black/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F44A00] flex items-center justify-center text-white text-sm">
              AA
            </div>
            <div>
              <div className="text-sm font-medium">Anima Namit</div>
              <div className="text-xs text-black/60">animanamit@gmail.com</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
