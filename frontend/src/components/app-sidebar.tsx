import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar";
import mockData from "@/mock-data";

export function AppSidebar() {
  return (
    <Sidebar className="w-64  text-black px-4 h-full border-none  ">
      {/* <SidebarHeader>Projects</SidebarHeader> */}
      <SidebarContent>
        <SidebarGroup>Projects</SidebarGroup>
        <div>
          {mockData.projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between w-full px-2 py-1 text-md font-medium text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <span>{project.name}</span>
              {/* <span className="text-xs text-gray-500">{project.id}</span> */}
            </div>
          ))}
        </div>
        <SidebarGroup>
          Teams
          <div>
            {mockData.teams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between w-full px-2 py-1 text-md font-medium text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <span>{team.name}</span>
                {/* <span className="text-xs text-gray-500">{team.id}</span> */}
              </div>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
