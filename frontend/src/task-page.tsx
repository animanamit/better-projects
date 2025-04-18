import {
  getTaskById,
  getTaskHistoryById,
  getTaskCommentsById,
  getTaskAttachmentsById,
} from "@/mock-data";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTaskById } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedTask } from "@/store/slices/taskSlice";
import { useEffect } from "react";

const TaskPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const selectedTask = useAppSelector((state) => state.tasks.selectedTask);
  
  // Use React Query to fetch data from API or mock data
  const { data: task, isLoading } = useQuery({
    queryKey: ["task", id],
    queryFn: () => id ? fetchTaskById(id) : Promise.reject("No task ID provided"),
    enabled: !!id,
  });
  
  // Use local functions for related data that doesn't need to be fetched separately
  const taskHistory = id ? getTaskHistoryById(id) : [];
  const taskComments = id ? getTaskCommentsById(id) : [];
  const taskAttachments = id ? getTaskAttachmentsById(id) : [];
  
  // Store the current task in Redux for access by other components
  useEffect(() => {
    if (task) {
      dispatch(setSelectedTask(task));
    }
    return () => {
      dispatch(setSelectedTask(null));
    };
  }, [task, dispatch]);
  
  if (isLoading) {
    return <div className="p-4">Loading task...</div>;
  }
  
  if (!task) {
    return <div className="p-4">Task not found</div>;
  }
  
  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-3xl font-medium">{task?.title}</h1>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500 uppercase">Description</span>
        <h4 className="text-xl ">{task?.description}</h4>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-sm text-gray-500 uppercase">Attachments</h2>
        <div className="flex flex-col gap-2">
          {taskAttachments.map((attachment) => (
            <div key={attachment.id}>
              <p>{attachment.fileName}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm text-gray-500 uppercase">Comments</h2>
          <div className="flex flex-col gap-2">
            {taskComments.map((comment) => (
              <div key={comment.id}>
                <p>{comment.content}</p>
                <p>{comment.createdAt.toLocaleString().split("T")[0]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;