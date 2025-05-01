import { useState } from "react";
// import { useUser } from "@clerk/clerk-react";
import { FileUploader } from "./file-uploader";
import { FileAttachment } from "@/mock-data";
import { useIsMobile } from "@/hooks/use-mobile";

export function FileManagement() {
  // Mock signed in state for personal website deployment
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isSignedIn = true; // Hardcoded to true
  const isMobile = useIsMobile();
  const [recentUploads, setRecentUploads] = useState<FileAttachment[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'recent'>('upload');

  const handleUploadComplete = (file: FileAttachment) => {
    setRecentUploads((prev) => [file, ...prev.slice(0, 4)]);
    
    // Switch to recent uploads tab after successful upload on mobile
    if (isMobile) {
      setActiveTab('recent');
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-xl font-normal mb-4">File Management</h1>
      
      {/* Mobile tabs */}
      {isMobile && (
        <div className="flex mb-4 border-b border-black/10">
          <button 
            className={`py-2 px-4 text-sm font-normal ${activeTab === 'upload' ? 'border-b-2 border-black' : 'text-black/60'}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload
          </button>
          <button 
            className={`py-2 px-4 text-sm font-normal ${activeTab === 'recent' ? 'border-b-2 border-black' : 'text-black/60'}`}
            onClick={() => setActiveTab('recent')}
          >
            Recent Files {recentUploads.length > 0 && `(${recentUploads.length})`}
          </button>
        </div>
      )}

      {/* Upload section */}
      <div className={`bg-[#f8f8f8] p-3 sm:p-4 mb-6 ${isMobile && activeTab !== 'upload' ? 'hidden' : ''}`}>
        <h2 className="text-base font-normal mb-3">Upload Files</h2>
        <FileUploader onUploadComplete={handleUploadComplete} />
      </div>

      {/* Recent uploads section */}
      {recentUploads.length > 0 && (
        <div className={`bg-[#f8f8f8] p-3 sm:p-4 ${isMobile && activeTab !== 'recent' ? 'hidden' : ''}`}>
          <h2 className="text-base font-normal mb-3">Recently Uploaded</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentUploads.map((file) => (
              <div key={file.id} className="bg-white p-3 hover:bg-[#f0f0f0] rounded-sm">
                <div className="flex items-start mb-1">
                  <div className="w-8 h-8 bg-[#f0f0f0] flex items-center justify-center rounded-sm mr-2 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-normal mb-1 truncate">
                      {file.fileName}
                    </div>
                    <div className="text-xs text-black/50">
                      {new Date(file.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#F44A00] hover:underline"
                  >
                    View File
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Space for bottom navigation on mobile */}
      {isMobile && <div className="h-16"></div>}
    </div>
  );
}
