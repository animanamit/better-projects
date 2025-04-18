import { getTaskById } from "@/mock-data";
import { useParams } from "react-router-dom";

const TaskPage = () => {
  const { id } = useParams();
  const task = getTaskById(id);
  return <div>{task?.title}</div>;
};

export default TaskPage;
