import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar";
import mockData from "@/mock-data";
import { useTabContext } from "@/dashboard";
import { Link, useLocation } from "react-router-dom";

export function AppSidebar() {
  const { activeTab, setActiveTab } = useTabContext();
  const location = useLocation();

  return (
    <Sidebar className="w-64 text-black px-4 h-full border-none">
      <SidebarContent>
        {/* Quick Links Section */}
        <SidebarGroup>Quick Links</SidebarGroup>
        <div className="mb-4">
          <Link
            to="/dashboard"
            className={`flex items-center space-x-2 w-full px-2 py-2 text-md font-normal ${
              !location.pathname.includes("/project/") &&
              !location.pathname.includes("/task/") &&
              activeTab === "tasks"
                ? "bg-gray-100 text-orange-500"
                : "text-gray-700 hover:bg-gray-100"
            } rounded-lg cursor-pointer`}
            onClick={() => setActiveTab("tasks")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
              <path d="M13 13h4" />
              <path d="M13 17h4" />
              <path d="M9 13h.01" />
              <path d="M9 17h.01" />
            </svg>
            <span>Tasks</span>
          </Link>

          <Link
            to="/dashboard"
            className={`flex items-center space-x-2 w-full px-2 py-2 text-md font-normal ${
              !location.pathname.includes("/project/") &&
              !location.pathname.includes("/task/") &&
              activeTab === "files"
                ? "bg-gray-100 text-orange-500"
                : "text-gray-700 hover:bg-gray-100"
            } rounded-lg cursor-pointer`}
            onClick={() => setActiveTab("files")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M12 18v-6" />
              <path d="M9 15h6" />
            </svg>
            <span>Files</span>
          </Link>
        </div>

        {/* Projects Section */}
        <SidebarGroup>Projects</SidebarGroup>
        <div className="mb-4">
          {mockData.projects.map((project) => {
            const isActive =
              location.pathname === `/dashboard/project/${project.id}`;
            return (
              <Link
                key={project.id}
                to={`/dashboard/project/${project.id}`}
                // Use replace to force navigation when already on project pages
                replace={location.pathname.includes("/project/")}
                className={`flex items-center justify-between w-full px-2 py-1 text-md font-normal ${
                  isActive
                    ? "bg-gray-100 text-orange-500"
                    : "text-gray-700 hover:bg-gray-100"
                } rounded-lg`}
              >
                <div className="flex items-center">
                  <span>{project.name}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Teams Section */}
        <SidebarGroup>Teams</SidebarGroup>
        <div>
          {mockData.teams.map((team) => {
            const isActive = location.pathname === `/dashboard/team/${team.id}`;
            return (
              <Link
                key={team.id}
                to={`/dashboard/team/${team.id}`}
                replace={location.pathname.includes("/team/")}
                className={`flex items-center justify-between w-full px-2 py-1 text-md font-normal ${
                  isActive
                    ? "bg-gray-100 text-orange-500"
                    : "text-gray-700 hover:bg-gray-100"
                } rounded-lg`}
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>{team.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
