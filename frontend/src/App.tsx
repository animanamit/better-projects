import { AppSidebar } from "@/components/app-sidebar";
import TopBar from "@/components/top-bar";
import { SidebarProvider } from "@/components/ui/sidebar";

const TaskDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl">Task Dashboard</h2>
      <p className="text-gray-600">Here you can manage your tasks.</p>
    </div>
  );
};

function App() {
  return (
    <SidebarProvider>
      <main className="flex flex-col  h-screen w-full">
        <TopBar />
        <div className="flex flex-row h-full">
          <AppSidebar />
          <div className="flex-1 p-4">
            <TaskDashboard />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default App;
