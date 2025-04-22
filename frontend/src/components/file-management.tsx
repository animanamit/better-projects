import { useState } from "react";
// import { useUser } from "@clerk/clerk-react";
import { FileUploader } from "./file-uploader";
import { FileAttachment } from "@/mock-data";

export function FileManagement() {
  // Mock signed in state for personal website deployment
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isSignedIn = true; // Hardcoded to true
  const [recentUploads, setRecentUploads] = useState<FileAttachment[]>([]);

  const handleUploadComplete = (file: FileAttachment) => {
    setRecentUploads((prev) => [file, ...prev.slice(0, 4)]);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-normal mb-4">File Management</h1>

      <div className="bg-[#f8f8f8] p-4 mb-6">
        <h2 className="text-base font-normal mb-3">Upload Files</h2>
        <FileUploader onUploadComplete={handleUploadComplete} />
      </div>

      {recentUploads.length > 0 && (
        <div className="bg-[#f8f8f8] p-4">
          <h2 className="text-base font-normal mb-3">Recently Uploaded</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentUploads.map((file) => (
              <div key={file.id} className="bg-white p-3 hover:bg-[#f0f0f0]">
                <div className="text-sm font-normal mb-1 truncate">
                  {file.fileName}
                </div>
                <div className="text-xs text-black/50 mb-2">
                  {new Date(file.createdAt).toLocaleString()}
                </div>
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#F44A00] hover:underline"
                >
                  View File
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
