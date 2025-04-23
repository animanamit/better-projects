import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
// Clerk auth commented out for personal website deployment
// import { useUser } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
// Real API calls commented out for personal website deployment
// import { uploadFile, getFiles, deleteFile } from "@/lib/api";
import { type FileAttachment, mockData } from "@/mock-data";

interface FileUploaderProps {
  taskId?: string;
  onUploadComplete?: (file: FileAttachment) => void;
}

export function FileUploader({ taskId, onUploadComplete }: FileUploaderProps) {
  // Mock user for personal website deployment
  const user = {
    id: "user-01",
    primaryEmailAddress: { emailAddress: "demo@example.com" },
    fullName: "Demo User",
  };

  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState("");
  const [fileDescription, setFileDescription] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        // Set default title to file name without extension
        const fileName = acceptedFiles[0].name;
        const nameWithoutExt = fileName.split(".").slice(0, -1).join(".");
        setFileTitle(nameWithoutExt || fileName);
      }
    },
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "application/vnd.ms-excel": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "text/plain": [],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading,
  });

  // Mock file fetching for personal website deployment
  const fetchFiles = useCallback(async () => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 500));

    // Filter mock files based on taskId or userId
    const fetchedFiles = mockData.fileAttachments
      .filter((f) => {
        if (taskId && f.taskId === taskId) return true;
        if (user?.id && f.userId === user.id) return true;
        return false;
      })
      .slice(0, 5);

    setFiles(fetchedFiles);
  }, [user?.id, taskId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Mock file upload function for personal website deployment
  async function handleFileUpload() {
    if (!user?.id || !user.primaryEmailAddress?.emailAddress) {
      setError("User information not available");
      return;
    }

    if (!selectedFile) {
      setError("No file selected");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      setError(null);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 300);

      // Simulate API delay
      await new Promise((r) => setTimeout(r, 800));

      // Create a mock file upload response
      const uploadedFile: FileAttachment = {
        id: `file-${Date.now()}`,
        fileName: fileTitle.trim() || selectedFile.name,
        fileUrl: URL.createObjectURL(selectedFile),
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        userId: user.id,
        taskId: taskId || null,
        createdAt: new Date().toISOString(),
        description: fileDescription.trim() || undefined,
      };

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Add new file to the list
      setFiles((prev) => [uploadedFile, ...prev]);

      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete(uploadedFile);
      }

      // Reset progress and form after 1 second
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
        setSelectedFile(null);
        setFileTitle("");
        setFileDescription("");
      }, 1000);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to upload file");
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  // Mock file delete function for personal website deployment
  async function handleDeleteFile(fileId: string) {
    try {
      // Simulate API delay
      await new Promise((r) => setTimeout(r, 300));

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
      {!selectedFile ? (
        <div className="border border-dashed border-black/20">
          <div
            {...getRootProps()}
            className={`p-6 cursor-pointer text-center transition-colors ${
              isUploading
                ? "bg-[#f0f0f0] cursor-not-allowed"
                : "hover:bg-[#f0f0f0]"
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
                className="mb-2 text-black/50"
              >
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                <path d="M12 12v9"></path>
                <path d="m16 16-4-4-4 4"></path>
              </svg>
              <p className="text-sm font-normal">
                Drop file here or click to upload
              </p>
              <p className="text-xs text-black/50">
                Supports images, PDF, Word, Excel, and text files (Max 10MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4">
          <div className="pb-3">
            <div className="flex items-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black/50"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <div className="text-sm font-normal">{selectedFile.name}</div>
              <span className="text-xs text-black/50">
                ({formatFileSize(selectedFile.size)})
              </span>
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedFile(null);
                    setFileTitle("");
                    setFileDescription("");
                  }}
                  className="ml-auto h-7 w-7 p-0"
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
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                  <span className="sr-only">Cancel</span>
                </Button>
              )}
            </div>
          </div>
          <div>
            {isUploading ? (
              <div className="w-full">
                <div className="text-sm mb-1">
                  Uploading... {uploadProgress}%
                </div>
                <Progress value={uploadProgress} className="w-full h-1" />
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label
                      htmlFor="file-title"
                      className="text-xs text-black/70"
                    >
                      File Title
                    </Label>
                    <Input
                      id="file-title"
                      value={fileTitle}
                      onChange={(e) => setFileTitle(e.target.value)}
                      placeholder="Enter a title for your file"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor="file-description"
                      className="text-xs text-black/70"
                    >
                      Description (optional)
                    </Label>
                    <Textarea
                      id="file-description"
                      value={fileDescription}
                      onChange={(e) => setFileDescription(e.target.value)}
                      placeholder="Add a description"
                      className="resize-none min-h-20 text-sm"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {!isUploading && (
            <div className="flex justify-end pt-3">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleFileUpload();
                }}
                className="h-8 text-sm bg-black text-white hover:bg-black/90"
              >
                Upload File
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-[#FFF0F0] p-3">
          <div className="py-1 text-sm text-[#E11D48]">
            <div className="flex items-center space-x-2">
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
                className="text-[#E11D48]"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* File list */}
      <div className="bg-white">
        <div className="pb-2 pt-3 px-3">
          <div className="text-sm font-normal">
            {taskId ? "Files for this task" : "Your files"}
          </div>
        </div>
        <div>
          {files.length === 0 ? (
            <p className="text-sm text-black/50 p-3">No files yet</p>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-[#f0f0f0]">
                <thead className="bg-[#f8f8f8]">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-normal text-black/50 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-normal text-black/50 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-normal text-black/50 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-normal text-black/50 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-normal text-black/50 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f0]">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-[#f8f8f8]">
                      <td className="px-3 py-2 text-sm">
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#F44A00] hover:underline flex items-center"
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
                            className="mr-1.5"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          {file.fileName}
                        </a>
                        {file.description && (
                          <div className="text-xs text-black/50 mt-1 ml-5">
                            {file.description}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-sm text-black/50">
                        {file.fileType.split("/")[1] || file.fileType}
                      </td>
                      <td className="px-3 py-2 text-sm text-black/50">
                        {formatFileSize(file.fileSize)}
                      </td>
                      <td className="px-3 py-2 text-sm text-black/50">
                        {new Date(file.createdAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-sm text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFile(file.id)}
                          className="h-7 text-xs font-normal border-[#E11D48] text-[#E11D48] hover:bg-[#FFF0F0]"
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
                            className="mr-1"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
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
    </div>
  );
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}
