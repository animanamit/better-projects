import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useUser } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { uploadFile, getFiles, deleteFile, FileAttachment } from "@/lib/api";

interface FileUploaderProps {
  taskId?: string;
  onUploadComplete?: (file: FileAttachment) => void;
}

export function FileUploader({ taskId, onUploadComplete }: FileUploaderProps) {
  const { user } = useUser();
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
      "application/vnd.ms-excel": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "text/plain": [],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading,
  });

  useEffect(() => {
    fetchFiles();
  }, [taskId, user?.id]);

  async function fetchFiles() {
    if (!user?.id) return;

    try {
      const fetchedFiles = await getFiles({
        userId: user.id,
        taskId,
      });
      setFiles(fetchedFiles);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to fetch files");
    }
  }

  async function handleFileUpload(acceptedFiles: File[]) {
    if (!user?.id || !user.primaryEmailAddress?.emailAddress) {
      setError("User information not available");
      return;
    }

    // Use the first file
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);
      setError(null);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 300);

      const uploadedFile = await uploadFile({
        file,
        userId: user.id,
        userEmail: user.primaryEmailAddress.emailAddress,
        userName: user.fullName || undefined,
        taskId,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Add new file to the list
      setFiles((prev) => [uploadedFile, ...prev]);
      
      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete(uploadedFile);
      }

      // Reset progress after 1 second
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to upload file");
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  async function handleDeleteFile(fileId: string) {
    try {
      await deleteFile(fileId);
      // Remove deleted file from the list
      setFiles((prev) => prev.filter((file) => file.id !== fileId));
    } catch (err) {
      console.error("Error deleting file:", err);
      setError("Failed to delete file");
    }
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-colors ${
          isUploading
            ? "border-gray-400 bg-gray-100 cursor-not-allowed"
            : "border-gray-300 hover:border-primary hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-2 text-gray-500"
          >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
            <path d="M12 12v9"></path>
            <path d="m16 16-4-4-4 4"></path>
          </svg>
          {isUploading ? (
            <div className="w-full max-w-xs">
              <div className="text-sm mb-1">Uploading... {uploadProgress}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium">Drop file here or click to upload</p>
              <p className="text-xs text-gray-500">
                Supports images, PDF, Word, Excel, and text files (Max 10MB)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 p-2 bg-red-50 rounded">{error}</div>
      )}

      {/* File list */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">
          {taskId ? "Files for this task" : "Your files"}
        </h3>
        {files.length === 0 ? (
          <p className="text-sm text-gray-500">No files yet</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {file.fileName}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {file.fileType.split("/")[1] || file.fileType}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {formatFileSize(file.fileSize)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {new Date(file.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}