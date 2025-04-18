import {
  getTaskById,
  getTaskHistoryById,
  getTaskCommentsById,
  getTaskAttachmentsById,
  mockData
} from "@/mock-data";
import { useParams } from "react-router-dom";

const TaskPage = () => {
  const { id } = useParams();
  const task = getTaskById(id);
  const taskHistory = getTaskHistoryById(id);
  const taskComments = getTaskCommentsById(id);
  const taskAttachments = getTaskAttachmentsById(id);
  // const taskTags = getTaskTagsById(id);

  // Get user information for comments
  const getUserInfo = (userId: string) => {
    const user = mockData.users.find(user => user.id === userId);
    if (!user) return { name: "Unknown User", role: "Unknown" };
    
    // Find team membership for this user
    const teamMemberships = mockData.teamMembers.filter(tm => tm.userId === userId);
    const teams = teamMemberships.map(tm => {
      const team = mockData.teams.find(t => t.id === tm.teamId);
      return team ? { id: team.id, name: team.name } : null;
    }).filter(Boolean);
    
    return {
      name: user.name || user.email,
      role: user.role || "Team Member",
      teams
    };
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-medium">{task?.title}</h1>
      <p className="text-gray-600 mt-2">{task?.description}</p>
      
      <div className="flex flex-col gap-8 mt-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-medium">History</h2>
          <div className="flex flex-col gap-2">
            {taskHistory.map((history) => {
              const user = mockData.users.find(u => u.id === history.changedBy);
              return (
                <div key={history.id} className="p-2 bg-gray-50 rounded">
                  <div className="flex justify-between">
                    <p className="font-medium">
                      Changed {history.fieldChanged} from <span className="font-mono">{history.oldValue}</span> to <span className="font-mono">{history.newValue}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(history.changedAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">By: {user?.name || "Unknown"}</p>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-medium">Comments</h2>
          <div className="flex flex-col gap-4">
            {taskComments.map((comment) => {
              const userInfo = getUserInfo(comment.userId);
              const isReply = !!comment.parentCommentId;
              const parentComment = isReply 
                ? taskComments.find(c => c.id === comment.parentCommentId) 
                : null;
              
              return (
                <div 
                  key={comment.id} 
                  className={`p-4 rounded-lg ${isReply ? "ml-8 bg-gray-50" : "bg-white border border-gray-200"}`}
                >
                  {isReply && (
                    <p className="text-xs text-gray-500 mb-2">
                      Replying to: "{parentComment?.content.substring(0, 60)}..."
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{userInfo.name}</span>
                    <span className="text-sm text-gray-500">{userInfo.role}</span>
                    {userInfo.teams && userInfo.teams.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {userInfo.teams[0].name}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(comment.createdAt).toLocaleString()}
                      {comment.isEdited && " (edited)"}
                    </span>
                  </div>
                  
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-medium">Attachments</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {taskAttachments.map((attachment) => {
              const user = mockData.users.find(u => u.id === attachment.userId);
              return (
                <div key={attachment.id} className="p-3 border rounded-lg">
                  <p className="font-medium truncate">{attachment.fileName}</p>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>{(attachment.fileSize / 1024).toFixed(0)} KB</span>
                    <span>By: {user?.name || "Unknown"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;