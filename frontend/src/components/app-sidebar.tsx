import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar className="w-64  text-black px-4 h-full border-none  ">
      {/* <SidebarHeader>Projects</SidebarHeader> */}
      <SidebarContent>
        <SidebarGroup>Projects</SidebarGroup>
        <SidebarGroup>Teams</SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
