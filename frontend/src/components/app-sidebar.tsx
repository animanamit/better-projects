"use client";

import { useTabContext } from "@/dashboard";
import { mockData } from "@/mock-data";
import { Link } from "react-router-dom";

export function AppSidebar() {
  const { activeTab, setActiveTab } = useTabContext();

  return (
    <div className="w-56 h-full bg-[#f8f8f8] flex flex-col overflow-hidden">
      <div className="px-4 py-3 text-xs text-black/60">UNIT 2025</div>

      <div className="flex-1 overflow-auto">
        <div className="px-3 py-2">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`text-sm px-2 py-1.5 text-left ${
                activeTab === "tasks"
                  ? "bg-black text-white"
                  : "text-black/70 hover:bg-black/5"
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`text-sm px-2 py-1.5 text-left ${
                activeTab === "files"
                  ? "bg-black text-white"
                  : "text-black/70 hover:bg-black/5"
              }`}
            >
              Files
            </button>
          </div>
        </div>

        <div className="mt-4 px-3">
          <div className="text-xs font-medium text-black/60 mb-1">PROJECTS</div>
          <div className="flex flex-col space-y-0.5">
            {mockData.projects.map((project) => (
              <Link
                key={project.id}
                to={`/dashboard/project/${project.id}`}
                className="text-sm px-2 py-1.5 text-black/70 hover:bg-black/5"
              >
                {project.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 px-3">
          <div className="text-xs font-medium text-black/60 mb-1">TEAMS</div>
          <div className="flex flex-col space-y-0.5">
            {mockData.teams.map((team) => (
              <Link
                key={team.id}
                to={`/dashboard/team/${team.id}`}
                className="text-sm px-2 py-1.5 text-black/70 hover:bg-black/5"
              >
                {team.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
