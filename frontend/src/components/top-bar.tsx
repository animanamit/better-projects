import { useEffect, useState, useRef } from "react";
import { aiModels, defaultModel } from "@/lib/ai";
import { useIsMobile } from "@/hooks/use-mobile";

interface TopBarProps {
  setSelectedModel?: (model: string) => void;
  selectedModel?: string;
}

const TopBar = ({ setSelectedModel, selectedModel }: TopBarProps) => {
  const isMobile = useIsMobile();
  const modelMenuRef = useRef<HTMLDivElement>(null);
  
  // Local state to ensure we always have a valid selection
  const [currentModel, setCurrentModel] = useState(defaultModel);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  // Initialize model on mount and when props change
  useEffect(() => {
    // If we have a parent-provided model, use it
    if (selectedModel) {
      setCurrentModel(selectedModel);
    } else if (setSelectedModel) {
      // If no model is set but we have the setter, initialize with default
      setSelectedModel(defaultModel);
      setCurrentModel(defaultModel);
    }
  }, [selectedModel, setSelectedModel]);

  // Close the model menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(event.target as Node)) {
        setIsModelMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleModelChange = (value: string) => {
    // Update local state
    setCurrentModel(value);
    setIsModelMenuOpen(false);

    // Propagate to parent if possible
    if (setSelectedModel) {
      setSelectedModel(value);
    }

    // For debugging
    console.log("Model changed to:", value);
  };

  // Find the name of the current model for display purposes
  const currentModelName =
    aiModels.find((m) => m.id === currentModel)?.name || "Select AI Model";
  const currentModelProvider =
    aiModels.find((m) => m.id === currentModel)?.provider || "";

  return (
    <div className="sticky top-0 z-20 px-2 sm:px-4 py-2 sm:py-3 bg-[#f8f8f8] shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black flex items-center justify-center text-white text-xs">
            TM
          </div>
          <span className={`text-sm font-medium ${isMobile ? "hidden sm:inline" : ""}`}>Task Manager</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Model Selector */}
          {setSelectedModel && (
            <div className="relative" ref={modelMenuRef}>
              <button
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                className="flex items-center gap-1 text-xs bg-[#f0f0f0] hover:bg-[#e8e8e8] px-2 sm:px-3 py-1.5 rounded-sm"
              >
                <span className={`truncate ${isMobile ? "max-w-[80px]" : "max-w-[120px]"}`}>
                  {isMobile ? currentModelName.split(" ")[0] : currentModelName}
                </span>
                {currentModelProvider && !isMobile && (
                  <span className="text-[10px] bg-black/10 px-1 rounded text-black/70">
                    {currentModelProvider}
                  </span>
                )}
              </button>

              {isModelMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white shadow-md z-50">
                  {aiModels.map((model) => (
                    <button
                      key={model.id}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#f0f0f0] flex flex-col"
                      onClick={() => handleModelChange(model.id)}
                    >
                      <span>{model.name}</span>
                      <span className="text-xs text-black/50">
                        {model.provider}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Create Task Button - Mobile only */}
          {isMobile && (
            <button
              className="bg-black text-white text-xs py-1.5 px-2 rounded-sm flex items-center gap-1"
              onClick={() => {
                // Find the Create Task button in the task board and click it
                const createTaskBtns = Array.from(document.querySelectorAll('button'))
                  .filter(btn => btn.textContent?.includes('Create Task'));
                if (createTaskBtns.length > 0) {
                  (createTaskBtns[0] as HTMLButtonElement).click();
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New
            </button>
          )}

          {/* User avatar */}
          <div className="w-7 h-7 rounded-full bg-[#F44A00] flex items-center justify-center text-white text-xs">
            AA
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
