"use client";

import { useEffect, useState } from "react";
import { aiModels, defaultModel } from "@/lib/ai";

interface TopBarProps {
  setSelectedModel?: (model: string) => void;
  selectedModel?: string;
}

const TopBar = ({ setSelectedModel, selectedModel }: TopBarProps) => {
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
    <div className="sticky top-0 z-20 px-4 py-3 bg-[#f8f8f8]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black flex items-center justify-center text-white text-xs">
            TM
          </div>
          <span className="text-sm font-medium">Task Manager</span>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Model Selector */}
          {setSelectedModel && (
            <div className="relative">
              <button
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                className="flex items-center gap-1 text-xs bg-[#f0f0f0] hover:bg-[#e8e8e8] px-3 py-1.5 rounded-sm"
              >
                <span className="truncate max-w-[120px]">
                  {currentModelName}
                </span>
                {currentModelProvider && (
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
