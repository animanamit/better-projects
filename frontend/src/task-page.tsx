import {
  getTaskById,
  getTaskHistoryById,
  getTaskCommentsById,
  getTaskAttachmentsById,
} from "@/mock-data";
import { useParams } from "react-router-dom";

const TaskPage = () => {
  const { id } = useParams();
  const task = getTaskById(id);
  const taskHistory = getTaskHistoryById(id);
  const taskComments = getTaskCommentsById(id);
  const taskAttachments = getTaskAttachmentsById(id);
  // const taskTags = getTaskTagsById(id);
  return (
    <div className="p-4">
      <h1 className="text-3xl font-medium">{task?.title}</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">History</h2>
          <div className="flex flex-col gap-2">
            {taskHistory.map((history) => (
              <div key={history.id}>
                <p>{history.fieldChanged}</p>
                <p>{history.oldValue}</p>
                <p>{history.newValue}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">Comments</h2>
          <div className="flex flex-col gap-2">
            {taskComments.map((comment) => (
              <div key={comment.id}>
                <p>{comment.content}</p>
                <p>{comment.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">Attachments</h2>
          <div className="flex flex-col gap-2">
            {taskAttachments.map((attachment) => (
              <div key={attachment.id}>
                <p>{attachment.fileName}</p>
                <p>{attachment.fileUrl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
