import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
function App() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex flex-col items-center justify-center h-screen w-full">
        <h1>Hello World</h1>
      </main>
    </SidebarProvider>
  );
}

export default App;
