import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  generateProjectSummary,
  generateTaskSummary,
  generateTeamSummary,
} from "@/lib/ai";
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
function useTextStreaming(
  fullText: string,
  isActive: boolean,
  streamingSpeed = 5
) {
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
          fullText[nextWordBoundary] !== " " &&
          fullText[nextWordBoundary] !== "\n"
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

// Component to render streamed Markdown with enhanced styling
const StreamedMarkdown = ({
  text,
  isComplete,
}: {
  text: string;
  isComplete: boolean;
}) => {
  const renderedContent = useMemo(() => {
    // Only process if there is text
    if (!text) return null;

    // Process the text to identify sections, lists, etc.
    const lines = text.split("\n");
    const result = [];
    let currentListItems: React.ReactNode[] = [];
    let inCodeBlock = false;
    let currentCodeBlock = "";

    lines.forEach((line, index) => {
      // Handle code blocks with triple backticks
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          // End of code block
          result.push(
            <pre
              key={`code-${index}`}
              className="bg-gray-50 rounded-md p-3 overflow-x-auto text-sm font-mono my-3 border border-gray-200"
            >
              {currentCodeBlock}
            </pre>
          );
          currentCodeBlock = "";
          inCodeBlock = false;
        } else {
          // Start of code block
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        // Inside code block - collect the content
        currentCodeBlock += line + "\n";
        return;
      }

      // Handle lists - if the previous line was a list and this isn't, we end the list
      if (
        line.trim().startsWith("-") ||
        line.trim().startsWith("*") ||
        line.trim().match(/^\d+\.\s/)
      ) {
        // Handle bullet and numbered lists
        const content = line.trim();
        let itemContent;
        let listStyle = "";

        // Special case: Check if this is a line that should be a subheading instead of a list item
        // Look for patterns like "Customer Portal Development - " or "High Risk:"
        if (
          content.match(
            /^[\*\-]\s+([A-Z][A-Za-z\s]+)(Development|Risk|Module|Strategy|Implementation|Integration)(\s+-|\s*:)/
          ) ||
          content.match(/^[\*\-]\s+(High|Medium|Low)\s+Risk:/)
        ) {
          // This should be a subheading, not a list item
          const heading = content.substring(1).trim();

          // If we have existing list items, finish that list first
          if (currentListItems.length > 0) {
            result.push(
              <ul key={`list-${index}`} className="my-3 list-disc">
                {currentListItems}
              </ul>
            );
            currentListItems = [];
          }

          // Add this as a subheading instead
          result.push(
            <h4
              key={index}
              className="font-semibold text-base mt-3 mb-1 text-gray-700"
            >
              {formatInlineMarkdown(heading)}
            </h4>
          );

          // Skip the rest of the list processing
          return;
        }

        // Normal list processing
        if (content.startsWith("-")) {
          itemContent = content.substring(1).trim();
          listStyle = "list-disc";
        } else if (content.startsWith("*")) {
          itemContent = content.substring(1).trim();
          listStyle = "list-disc";
        } else {
          // Numbered list
          itemContent = content.replace(/^\d+\.\s/, "").trim();
          listStyle = "list-decimal";
        }

        // Check for bold, italic, and links within list items
        itemContent = formatInlineMarkdown(itemContent);

        currentListItems.push(
          <li key={`list-item-${index}`} className="ml-5 mb-1">
            {itemContent}
          </li>
        );
      } else if (currentListItems.length > 0) {
        // End the previous list if this line is not a list item
        result.push(
          <ul key={`list-${index}`} className="my-3 list-disc">
            {currentListItems}
          </ul>
        );
        currentListItems = [];
      }

      // If we're not adding to a list, process other markdown elements
      if (
        !line.trim().startsWith("-") &&
        !line.trim().startsWith("*") &&
        !line.trim().match(/^\d+\.\s/)
      ) {
        if (line.startsWith("# ")) {
          // H1 header
          result.push(
            <h1
              key={index}
              className="text-2xl font-bold mt-5 mb-3 border-b pb-2 text-gray-800"
            >
              {formatInlineMarkdown(line.replace("# ", "").trim())}
            </h1>
          );
        } else if (line.startsWith("## ")) {
          // H2 header
          result.push(
            <h2
              key={index}
              className="text-xl font-bold mt-4 mb-2 text-gray-800"
            >
              {formatInlineMarkdown(line.replace("## ", "").trim())}
            </h2>
          );
        } else if (line.startsWith("### ")) {
          // H3 header
          result.push(
            <h3
              key={index}
              className="text-lg font-bold mt-3 mb-2 text-gray-700"
            >
              {formatInlineMarkdown(line.replace("### ", "").trim())}
            </h3>
          );
        } else if (line.startsWith("#### ")) {
          // H4 header
          result.push(
            <h4
              key={index}
              className="text-base font-bold mt-3 mb-1 text-gray-700"
            >
              {formatInlineMarkdown(line.replace("#### ", "").trim())}
            </h4>
          );
        } else if (line.startsWith("> ")) {
          // Blockquote
          result.push(
            <blockquote
              key={index}
              className="border-l-4 border-gray-300 pl-4 italic my-3 text-gray-600"
            >
              {formatInlineMarkdown(line.replace("> ", "").trim())}
            </blockquote>
          );
        } else if (line.trim() === "") {
          // Empty line
          result.push(<div key={index} className="my-2" />);
        } else {
          // Regular paragraph
          result.push(
            <p key={index} className="my-2 text-gray-600">
              {formatInlineMarkdown(line)}
            </p>
          );
        }
      }
    });

    // If we have list items at the end, add them
    if (currentListItems.length > 0) {
      result.push(
        <ul key="final-list" className="my-3 list-disc">
          {currentListItems}
        </ul>
      );
    }

    return result;
  }, [text]);

  // Function to format inline markdown (bold, italic, links) and handle colon-separated labels
  function formatInlineMarkdown(text: string): React.ReactNode {
    if (!text) return text;

    // Handle repeated label pattern (e.g., "Label:Label: Content")
    // This fixes issues with "Business Impact:Business Impact:" style repetition
    const labelRepeatRegex = /^([A-Za-z\s]+):([A-Za-z\s]+):\s/;
    const labelMatch = text.match(labelRepeatRegex);
    if (labelMatch && labelMatch[1] === labelMatch[2]) {
      // If we detect a repeated label pattern, fix it
      text = text.replace(labelRepeatRegex, `**${labelMatch[1]}**: `);
    } else {
      // Handle regular label pattern (e.g., "Label: Content")
      const singleLabelRegex = /^([A-Za-z\s]+):\s/;
      const singleMatch = text.match(singleLabelRegex);
      if (singleMatch) {
        text = text.replace(singleLabelRegex, `**${singleMatch[1]}**: `);
      }
    }

    // Split the text into parts with React elements for formatting
    const parts: React.ReactNode[] = [];
    let currentText = "";
    let inBold = false;
    let inItalic = false;
    let linkText = "";
    let linkUrl = "";
    let inLinkText = false;
    let inLinkUrl = false;

    // Simple parsing to handle basic inline markdown
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = i < text.length - 1 ? text[i + 1] : "";

      // Handle bold with ** or __
      if (
        (char === "*" && nextChar === "*") ||
        (char === "_" && nextChar === "_")
      ) {
        if (inBold) {
          // End bold
          if (currentText) {
            parts.push(<strong key={`bold-${i}`}>{currentText}</strong>);
          }
          currentText = "";
          inBold = false;
          i++; // Skip the next character too (second * or _)
        } else {
          // Start bold
          if (currentText) {
            parts.push(currentText);
          }
          currentText = "";
          inBold = true;
          i++; // Skip the next character too (second * or _)
        }
        continue;
      }

      // Handle italic with * or _
      if ((char === "*" || char === "_") && nextChar !== char) {
        if (inItalic) {
          // End italic
          if (currentText) {
            parts.push(<em key={`italic-${i}`}>{currentText}</em>);
          }
          currentText = "";
          inItalic = false;
        } else {
          // Start italic
          if (currentText) {
            parts.push(currentText);
          }
          currentText = "";
          inItalic = true;
        }
        continue;
      }

      // Handle links [text](url)
      if (char === "[" && !inLinkText && !inLinkUrl) {
        if (currentText) {
          parts.push(currentText);
        }
        currentText = "";
        inLinkText = true;
        continue;
      }

      if (char === "]" && inLinkText && !inLinkUrl) {
        linkText = currentText;
        currentText = "";

        // Check if next characters are (
        if (nextChar === "(") {
          inLinkText = false;
          inLinkUrl = true;
          i++; // Skip the ( character
        } else {
          // Not a proper link, revert
          currentText = "[" + linkText + "]";
          linkText = "";
          inLinkText = false;
        }
        continue;
      }

      if (char === ")" && inLinkUrl) {
        linkUrl = currentText;
        currentText = "";
        inLinkUrl = false;

        // Add the link
        parts.push(
          <a
            key={`link-${i}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {linkText}
          </a>
        );

        linkText = "";
        linkUrl = "";
        continue;
      }

      // Add character to current text
      currentText += char;
    }

    // Add any remaining text
    if (currentText) {
      if (inBold) {
        parts.push(<strong>{currentText}</strong>);
      } else if (inItalic) {
        parts.push(<em>{currentText}</em>);
      } else {
        parts.push(currentText);
      }
    }

    return parts.length > 0 ? parts : text;
  }

  return (
    <div className="prose prose-sm max-w-none px-1">
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
  const [, startTransition] = useTransition();

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
          result = await generateProjectSummary(
            itemId,
            selectedModel,
            forceRefresh
          );
          break;
        case "task":
          result = await generateTaskSummary(
            itemId,
            selectedModel,
            forceRefresh
          );
          break;
        case "team":
          result = await generateTeamSummary(
            itemId,
            selectedModel,
            forceRefresh
          );
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

  // const getTitle = () => {
  //   switch (summaryType) {
  //     case "project":
  //       return "Project AI Summary";
  //     case "task":
  //       return "Task AI Summary";
  //     case "team":
  //       return "Team AI Summary";
  //   }
  // };

  // Format the last generated time
  const formatTimestamp = () => {
    if (!lastGeneratedAt) return null;

    const now = new Date();
    const diffMs = now.getTime() - lastGeneratedAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[75vw] max-h-[80vh] overflow-y-auto p-8 gap-0">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle></DialogTitle>

            <div className="flex items-center gap-2">
              {!isLoading && !error && lastGeneratedAt && (
                <span className="text-xs text-gray-500">
                  Generated {formatTimestamp()}
                </span>
              )}

              {!isLoading && isStreaming && !isComplete && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={skipToEnd}
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
                  >
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
                  >
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

        <div className="pb-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-sm text-gray-500">
                {isCached
                  ? "Generating fresh summary..."
                  : "Generating summary..."}
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-600">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => fetchSummary(false)}>
                  Try Again
                </Button>
                <Button variant="outline" onClick={onClose}>
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
