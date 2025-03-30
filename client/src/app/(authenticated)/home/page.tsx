"use client";
import ProjectDashboard from "@/components/projects/project-dashboard";
import Task from "@/components/tasks/task";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { type Task as TaskType, mockTasks } from "@/utils/mock-data";

const Home = () => {
  return (
    <div className="h-screen w-screen ">
      <div id="top-container" className=" p-2">
        <SidebarTrigger className="text-white" />
        {/* <ProjectDashboard /> */}
        {mockTasks.map((task: TaskType) => (
          <Task key={task.id} mockTask={task} />
        ))}
      </div>
    </div>
  );
};

export default Home;
