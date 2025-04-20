import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { generateProjectSummary, generateTaskSummary, generateTeamSummary } from "@/lib/ai";
import { useTransition } from "react";

type SummaryType = "project" | "task" | "team";

interface AISummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  summaryType: SummaryType;
  selectedModel: string;
}

// Custom hook for streaming text effect
function useTextStreaming(fullText: string, isActive: boolean, streamingSpeed = 5) {
  const [streamedText, setStreamedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const streamingRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use this to delay streaming for cached results to simulate generation
  const [canStart, setCanStart] = useState(false);
  
  // Set up delayed start for cached results
  useEffect(() => {
    if (isActive && !canStart) {
      const timer = setTimeout(() => {
        setCanStart(true);
      }, 300); // Small delay to make it feel like processing
      
      return () => clearTimeout(timer);
    }
  }, [isActive, canStart]);
  
  // Reset streaming state when full text changes
  useEffect(() => {
    if (fullText !== streamedText && !isActive) {
      // If not actively streaming, just set the full text immediately
      setStreamedText(fullText);
      setIsComplete(true);
    } else if (fullText !== streamedText && isActive) {
      // If streaming is active, reset the streaming process
      setStreamedText("");
      setIsComplete(false);
    }
  }, [fullText, isActive]);
  
  // Start or continue streaming when active
  useEffect(() => {
    if (!isActive || !canStart || isComplete) return;
    
    if (streamingRef.current) {
      clearInterval(streamingRef.current);
    }
    
    let currentLength = streamedText.length;
    
    streamingRef.current = setInterval(() => {
      // Number of chars to add per interval (randomize slightly for natural effect)
      const charsToAdd = Math.floor(Math.random() * 3) + streamingSpeed;
      
      if (currentLength < fullText.length) {
        // Find the next word boundary up to charsToAdd chars ahead
        let nextWordBoundary = currentLength + charsToAdd;
        while (
          nextWordBoundary < fullText.length && 
          fullText[nextWordBoundary] !== ' ' && 
          fullText[nextWordBoundary] !== '\n'
        ) {
          nextWordBoundary++;
        }
        
        const nextText = fullText.substring(0, nextWordBoundary);
        setStreamedText(nextText);
        currentLength = nextText.length;
        
        // Check if we've reached the end
        if (currentLength >= fullText.length) {
          setIsComplete(true);
          if (streamingRef.current) {
            clearInterval(streamingRef.current);
            streamingRef.current = null;
          }
        }
      }
    }, 30); // Update interval
    
    return () => {
      if (streamingRef.current) {
        clearInterval(streamingRef.current);
        streamingRef.current = null;
      }
    };
  }, [fullText, streamedText, isActive, canStart, isComplete, streamingSpeed]);
  
  // Skip to end function
  const skipToEnd = useCallback(() => {
    if (streamingRef.current) {
      clearInterval(streamingRef.current);
      streamingRef.current = null;
    }
    setStreamedText(fullText);
    setIsComplete(true);
  }, [fullText]);
  
  return { streamedText, isComplete, skipToEnd };
}

// Component to render streamed Markdown
const StreamedMarkdown = ({ text, isComplete }: { text: string, isComplete: boolean }) => {
  const renderedContent = useMemo(() => {
    // Only process if there is text
    if (!text) return null;
    
    return text.split("\n").map((line, index) => {
      if (line.startsWith("##")) {
        return <h2 key={index} className="text-xl font-bold mt-4">{line.replace("##", "").trim()}</h2>;
      } else if (line.startsWith("###")) {
        return <h3 key={index} className="text-lg font-bold mt-3">{line.replace("###", "").trim()}</h3>;
      } else if (line.startsWith("-")) {
        return <li key={index} className="ml-4">{line.substring(1).trim()}</li>;
      } else if (line.startsWith("*")) {
        return <li key={index} className="ml-4">{line.trim()}</li>;
      } else if (line.trim() === "") {
        return <div key={index} className="my-2"></div>;
      } else {
        return <p key={index}>{line}</p>;
      }
    });
  }, [text]);
  
  return (
    <div className="prose prose-sm max-w-none">
      {renderedContent}
      {!isComplete && (
        <span className="inline-block animate-pulse w-2 h-4 bg-orange-500 ml-1"></span>
      )}
    </div>
  );
};

const AISummaryDialog = ({
  isOpen,
  onClose,
  itemId,
  summaryType,
  selectedModel,
}: AISummaryDialogProps) => {
  // React 18 useTransition for non-blocking UI updates
  const [isPending, startTransition] = useTransition();
  
  const [fullSummary, setFullSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<Date | null>(null);

  // Use the streaming hook
  const { streamedText, isComplete, skipToEnd } = useTextStreaming(
    fullSummary,
    isStreaming,
    5 // Characters per tick - adjust for speed
  );

  const fetchSummary = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    setIsStreaming(false);
    
    try {
      let result;
      switch (summaryType) {
        case "project":
          result = await generateProjectSummary(itemId, selectedModel, forceRefresh);
          break;
        case "task":
          result = await generateTaskSummary(itemId, selectedModel, forceRefresh);
          break;
        case "team":
          result = await generateTeamSummary(itemId, selectedModel, forceRefresh);
          break;
      }

      setIsCached(result.isCached || false);
      
      // Use React 18 startTransition for smoother UI
      startTransition(() => {
        setFullSummary(result.summary);
        setIsStreaming(true);
      });
      
      setError(result.error);
      
      if (!result.isCached || forceRefresh) {
        setLastGeneratedAt(new Date());
      } else if (result.generatedAt) {
        setLastGeneratedAt(new Date(result.generatedAt));
      }
    } catch (err) {
      setError("Failed to generate summary. Please try again.");
      console.error("Error generating summary:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch when dialog opens
  useEffect(() => {
    if (isOpen && itemId) {
      fetchSummary(false);
    }
  }, [isOpen, itemId, summaryType, selectedModel]);

  const handleRefresh = () => {
    fetchSummary(true);
  };

  const getTitle = () => {
    switch (summaryType) {
      case "project":
        return "Project AI Summary";
      case "task":
        return "Task AI Summary";
      case "team":
        return "Team AI Summary";
    }
  };

  // Format the last generated time
  const formatTimestamp = () => {
    if (!lastGeneratedAt) return null;
    
    const now = new Date();
    const diffMs = now.getTime() - lastGeneratedAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{getTitle()}</DialogTitle>
            
            <div className="flex items-center gap-2">
              {!isLoading && !error && lastGeneratedAt && (
                <span className="text-xs text-gray-500">Generated {formatTimestamp()}</span>
              )}
              
              {!isLoading && isStreaming && !isComplete && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-1"
                  onClick={skipToEnd}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="13 17 18 12 13 7"></polyline>
                    <polyline points="6 17 11 12 6 7"></polyline>
                  </svg>
                  Skip
                </Button>
              )}
              
              {!isLoading && !error && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-1"
                  onClick={handleRefresh}
                  disabled={isLoading || (isStreaming && !isComplete)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                    <path d="M8 16H3v5"></path>
                  </svg>
                  Refresh
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-sm text-gray-500">
                {isCached ? "Generating fresh summary..." : "Generating summary..."}
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-600">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => fetchSummary(false)}
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <StreamedMarkdown text={streamedText} isComplete={isComplete} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AISummaryDialog;