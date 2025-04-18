import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { FileUploader } from "./file-uploader";
import { FileAttachment } from "@/mock-data";

export function FileManagement() {
  const { isSignedIn } = useUser();
  const [recentUploads, setRecentUploads] = useState<FileAttachment[]>([]);

  const handleUploadComplete = (file: FileAttachment) => {
    setRecentUploads((prev) => [file, ...prev.slice(0, 4)]);
  };

  if (!isSignedIn) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">File Management</h2>
        <p className="text-gray-600">Please sign in to manage your files.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">File Management</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
        <FileUploader onUploadComplete={handleUploadComplete} />
      </div>

      {recentUploads.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recently Uploaded</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentUploads.map((file) => (
              <div
                key={file.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="text-sm font-medium mb-1 truncate">
                  {file.fileName}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {new Date(file.createdAt).toLocaleString()}
                </div>
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
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
