import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

// const mockTasks = [
//   {
//     id: 1,
//     title: "Task 1",
//     description: "Description 1",
//     dueDate: "2021-01-01",
//     status: "In Progress",
//     priority: "High",
//     category: "Work",
//     completed: false,
//   },
//   {
//     id: 2,
//     title: "Task 2",
//     description: "Description 2",
//     dueDate: "2021-01-01",
//   },
// ];

// const TaskCard = ({ task }: { task: Task }) => {
//   return <div>{task.title}</div>;
// };

const WeekView = () => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl ">Weekly View</h2>
      <p className="text-gray-600">
        Here you can view your tasks for the week.
      </p>
    </div>
  );
};

const Header = () => {
  return (
    <header className="flex  flex-col  p-4">
      <h1 className="text-black text-2xl">Welcome Animan</h1>
      <WeekView />
    </header>
  );
};

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
      <AppSidebar />

      <main className="flex flex-col  h-screen w-full">
        <Header />
        <TaskDashboard />
      </main>
    </SidebarProvider>
  );
}

export default App;
