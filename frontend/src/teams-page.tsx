import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          className={`w-full h-full flex items-center justify-center bg-gray-200 ${textSize} font-medium`}
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
    <Card key={member.id} className="mb-2">
      <CardContent className="p-4">
        <div className="flex items-start">
          <UserAvatar user={user} size="lg" />
          <div className="ml-3 flex-1">
            <h3 className="font-medium text-base">{user.name || user.email}</h3>
            <div className="text-gray-600 text-sm">{role}</div>
            <div className="mt-2 text-xs text-gray-500">
              Joined: {new Date(member.joinedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Project card component
const ProjectCard = ({ project }) => {
  const tasksInProject = mockData.tasks.filter(task => task.projectId === project.id);
  const completedTasks = tasksInProject.filter(task => task.status === "COMPLETED");
  const progress = tasksInProject.length > 0 
    ? Math.round((completedTasks.length / tasksInProject.length) * 100) 
    : 0;
  
  return (
    <Link to={`/dashboard/project/${project.id}`}>
      <Card key={project.id} className="mb-2 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex flex-col">
            <h3 className="font-medium text-base mb-1">{project.name}</h3>
            <div className="text-gray-600 text-xs line-clamp-2 mb-2">
              {project.description || "No description available"}
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <Badge 
                variant="outline" 
                className={`${
                  project.status === "active" 
                    ? "bg-green-100 text-green-700" 
                    : project.status === "completed" 
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
              
              <div className="flex items-center">
                <span className="mr-2">{progress}% Complete</span>
                <span className="text-gray-500">
                  {completedTasks.length}/{tasksInProject.length} Tasks
                </span>
              </div>
            </div>
            
            {/* Simple progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-blue-500 h-1.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// Team metadata component
const TeamMetadata = ({ team }) => {
  const organization = mockData.organizations.find(
    org => org.id === team.organizationId
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
    member => member.teamId === team.id
  ).length;

  metadata.push({
    label: "Members",
    value: teamMembersCount,
  });

  const teamProjects = mockData.projects.filter(
    project => project.teamId === team.id
  );

  metadata.push({
    label: "Projects",
    value: teamProjects.length,
  });

  return (
    <div className="border rounded-md p-3 bg-gray-50">
      <h3 className="text-sm font-medium text-gray-500 mb-2">Team Details</h3>
      <div className="grid grid-cols-2 gap-y-2 gap-x-3">
        {metadata.map((item, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-xs text-gray-500">{item.label}</span>
            <span className="text-sm">{item.value}</span>
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
  
  // Update team when id changes
  useEffect(() => {
    const foundTeam = mockData.teams.find(t => t.id === id);
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
    member => member.teamId === team.id
  );
  
  // Get projects assigned to this team
  const teamProjects = mockData.projects.filter(
    project => project.teamId === team.id
  );

  // Get organization for this team
  const organization = mockData.organizations.find(
    org => org.id === team.organizationId
  );

  return (
    <div className="p-3 max-w-7xl mx-auto">
      <div className="mb-3">
        <button 
          onClick={goBackToDashboard}
          className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
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
      
      <Card className="mb-4">
        <CardHeader className="p-3">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold mb-2">
                {team.name}
              </CardTitle>

              {organization && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">Organization:</span>
                  <Badge variant="outline" className="bg-gray-100">
                    {organization.name}
                  </Badge>
                </div>
              )}
              
              {team.description && (
                <p className="text-gray-600 text-sm mt-1 mb-3">
                  {team.description}
                </p>
              )}

              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={() => setShowAISummary(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
                Generate Team AI Summary
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TeamMetadata team={team} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="mb-3">
          <TabsTrigger value="members">
            Members ({teamMembers.length})
          </TabsTrigger>
          <TabsTrigger value="projects">
            Projects ({teamProjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          {teamMembers.length === 0 ? (
            <div className="text-center p-4 text-gray-500 text-sm">
              No members in this team
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map(member => {
                const user = mockData.users.find(u => u.id === member.userId);
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
        </TabsContent>

        <TabsContent value="projects">
          {teamProjects.length === 0 ? (
            <div className="text-center p-4 text-gray-500 text-sm">
              No projects assigned to this team
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
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