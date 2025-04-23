import { useParams, Link, useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { mockData } from "@/mock-data";
import { useState, useEffect, useContext } from "react";
import { useTabContext } from "@/dashboard";
import AISummaryDialog from "@/components/ai-summary-dialog";
import { AIContext } from "./App";

// User avatar component (reused from task-page)
const UserAvatar = ({
  user,
  size = "md",
  showName = false,
}: {
  user: { name?: string; email: string; avatarUrl?: string } | null | undefined;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}) => {
  if (!user) return null;

  let sizeClass = "w-6 h-6";
  let textSize = "text-xs";

  if (size === "sm") {
    sizeClass = "w-5 h-5";
    textSize = "text-[10px]";
  } else if (size === "lg") {
    sizeClass = "w-10 h-10";
    textSize = "text-sm";
  }

  return (
    <div className="flex items-center gap-1">
      <Avatar className={sizeClass}>
        <div
          className={`w-full h-full flex items-center justify-center bg-[#f0f0f0] ${textSize} font-normal text-black/80`}
        >
          {user.name ? user.name.charAt(0) : user.email.charAt(0)}
        </div>
      </Avatar>
      {showName && <span className="text-sm">{user.name || user.email}</span>}
    </div>
  );
};

// Team member card component
const TeamMemberCard = ({ member, user, role }) => {
  return (
    <div key={member.id} className="mb-2 bg-white p-3">
      <div className="flex items-start">
        <UserAvatar user={user} size="lg" />
        <div className="ml-3 flex-1">
          <h3 className="font-normal text-base">{user.name || user.email}</h3>
          <div className="text-black/60 text-sm">{role}</div>
          <div className="mt-2 text-xs text-black/50">
            Joined: {new Date(member.joinedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Project card component
const ProjectCard = ({ project }) => {
  const tasksInProject = mockData.tasks.filter(
    (task) => task.projectId === project.id
  );
  const completedTasks = tasksInProject.filter(
    (task) => task.status === "COMPLETED"
  );
  const progress =
    tasksInProject.length > 0
      ? Math.round((completedTasks.length / tasksInProject.length) * 100)
      : 0;

  return (
    <Link to={`/dashboard/project/${project.id}`}>
      <div
        key={project.id}
        className="mb-2 bg-white p-3 hover:bg-[#f8f8f8] transition-colors"
      >
        <div className="flex flex-col">
          <h3 className="font-normal text-base mb-1">{project.name}</h3>
          <div className="text-black/60 text-xs line-clamp-2 mb-2">
            {project.description || "No description available"}
          </div>

          <div className="flex items-center justify-between text-xs">
            <div
              className={`inline-flex px-2 py-0.5 text-xs ${
                project.status === "active"
                  ? "bg-[#F0FFF4] text-[#16A34A]"
                  : project.status === "completed"
                  ? "bg-[#F0F9FF] text-[#0284C7]"
                  : "bg-[#f0f0f0] text-black/70"
              }`}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </div>

            <div className="flex items-center">
              <span className="mr-2">{progress}% Complete</span>
              <span className="text-black/50">
                {completedTasks.length}/{tasksInProject.length} Tasks
              </span>
            </div>
          </div>

          {/* Simple progress bar */}
          <div className="w-full bg-[#f0f0f0] h-1 mt-2">
            <div
              className="bg-[#F44A00] h-1"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Team metadata component
const TeamMetadata = ({ team }) => {
  const organization = mockData.organizations.find(
    (org) => org.id === team.organizationId
  );

  const metadata = [];

  if (organization) {
    metadata.push({
      label: "Organization",
      value: organization.name,
    });
  }

  if (team.createdAt) {
    metadata.push({
      label: "Created",
      value: new Date(team.createdAt).toLocaleDateString(),
    });
  }

  if (team.updatedAt) {
    metadata.push({
      label: "Updated",
      value: new Date(team.updatedAt).toLocaleDateString(),
    });
  }

  const teamMembersCount = mockData.teamMembers.filter(
    (member) => member.teamId === team.id
  ).length;

  metadata.push({
    label: "Members",
    value: teamMembersCount,
  });

  const teamProjects = mockData.projects.filter(
    (project) => project.teamId === team.id
  );

  metadata.push({
    label: "Projects",
    value: teamProjects.length,
  });

  return (
    <div className="bg-[#f0f0f0] py-2 px-3">
      <h3 className="text-base font-normal text-black/80 mb-2">Team Details</h3>
      <div className="grid grid-cols-2 gap-y-2 gap-x-3">
        {metadata.map((item, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-xs font-medium text-black/60">
              {item.label}
            </span>
            <span className="text-sm font-normal">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component
const TeamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeTab } = useTabContext();
  const [team, setTeam] = useState(null);
  const { selectedModel } = useContext(AIContext);
  const [showAISummary, setShowAISummary] = useState(false);
  const [activeTabState, setActiveTabState] = useState("members");

  // Update team when id changes
  useEffect(() => {
    const foundTeam = mockData.teams.find((t) => t.id === id);
    if (foundTeam) {
      setTeam(foundTeam);
    } else {
      console.error(`Team with id ${id} not found`);
      // Redirect to dashboard if team not found
      navigate("/dashboard");
    }
  }, [id, navigate]);

  // Function to navigate back to dashboard while preserving the active tab
  const goBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (!team) {
    return <div className="p-3">Team not found</div>;
  }

  // Get team members and their user data
  const teamMembers = mockData.teamMembers.filter(
    (member) => member.teamId === team.id
  );

  // Get projects assigned to this team
  const teamProjects = mockData.projects.filter(
    (project) => project.teamId === team.id
  );

  // Get organization for this team
  const organization = mockData.organizations.find(
    (org) => org.id === team.organizationId
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-3">
        <button
          onClick={goBackToDashboard}
          className="flex items-center text-black/60 hover:text-[#F44A00] transition-colors font-normal"
        >
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
            className="mr-1"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="mb-4">
        <div className="py-3 px-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
            <div className="flex-1">
              <div className="text-xs text-black/60 mb-1">TEAM {team.id}</div>
              <h1 className="text-2xl font-normal mb-2">{team.name}</h1>

              {organization && (
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-xs font-medium text-black/60">
                    Organization:
                  </span>
                  <div className="bg-[#f0f0f0] text-black/70 text-xs px-1.5 py-0.5">
                    {organization.name}
                  </div>
                </div>
              )}

              {team.description && (
                <div className="mb-3">
                  <h3 className="text-base font-normal text-black/80 mb-1">
                    Description
                  </h3>
                  <p className="text-black/80 text-sm bg-[#f0f0f0] p-2">
                    {team.description}
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="gap-1 border-[#F44A00] text-[#F44A00] hover:bg-[#FFF4ED] font-normal h-8"
                onClick={() => setShowAISummary(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
                Generate Team AI Summary
              </Button>
            </div>
          </div>
        </div>

        <div className="px-4 pb-3 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TeamMetadata team={team} />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex border-b mb-3">
          <button
            onClick={() => setActiveTabState("members")}
            className={`px-4 py-2 text-sm font-normal ${
              activeTabState === "members"
                ? "border-b-2 border-black"
                : "text-black/60"
            }`}
          >
            Members ({teamMembers.length})
          </button>
          <button
            onClick={() => setActiveTabState("projects")}
            className={`px-4 py-2 text-sm font-normal ${
              activeTabState === "projects"
                ? "border-b-2 border-black"
                : "text-black/60"
            }`}
          >
            Projects ({teamProjects.length})
          </button>
        </div>

        {activeTabState === "members" && (
          <>
            {teamMembers.length === 0 ? (
              <div className="text-center py-3 text-black/50 font-normal">
                No members in this team
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teamMembers.map((member) => {
                  const user = mockData.users.find(
                    (u) => u.id === member.userId
                  );
                  if (!user) return null;
                  return (
                    <TeamMemberCard
                      key={member.id}
                      member={member}
                      user={user}
                      role={member.role}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTabState === "projects" && (
          <>
            {teamProjects.length === 0 ? (
              <div className="text-center py-3 text-black/50 font-normal">
                No projects assigned to this team
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teamProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* AI Summary Dialog */}
      <AISummaryDialog
        isOpen={showAISummary}
        onClose={() => setShowAISummary(false)}
        itemId={team.id}
        summaryType="team"
        selectedModel={selectedModel}
      />
    </div>
  );
};

export default TeamPage;
