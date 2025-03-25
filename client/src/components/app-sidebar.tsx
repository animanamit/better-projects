import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";

export function AppSidebar() {
  const user = useUser();
  return (
    <Sidebar>
      <SidebarHeader>{user.name}</SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
