import { Project, projects } from "@/utils/mock-data";

const ProjectRow = ({ project }: { project: Project }) => {
  return <div>{project.name}</div>;
};

const ProjectDashboard = () => {
  return (
    <div className="bg-black w-full text-white">
      ProjectDashboard
      <div>
        {projects.map((project) => (
          <ProjectRow project={project} key={project.id} />
        ))}
      </div>
    </div>
  );
};

export default ProjectDashboard;
