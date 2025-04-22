// Clerk auth commented out for personal website deployment
// import { UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { aiModels, defaultModel } from "@/lib/ai";

interface TopBarProps {
  setSelectedModel?: (model: string) => void;
  selectedModel?: string;
}

const TopBar = ({ setSelectedModel, selectedModel }: TopBarProps) => {
  // Local state to ensure we always have a valid selection
  const [currentModel, setCurrentModel] = useState(defaultModel);

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

  return (
    <div className="top-bar z-20 sticky top-0 p-2">
      <div className="flex items-center justify-between h-fit py-2 text-white px-4 rounded-xl bg-orange-600">
        <div className="text-md font-normal">Task Manager</div>
        <div className="flex items-center gap-3">
          {/* AI Model Selector */}
          {setSelectedModel && (
            <div className="w-52">
              <Select value={currentModel} onValueChange={handleModelChange}>
                <SelectTrigger className="text-xs h-8 bg-white/10 border-white/20 text-white">
                  <div className="flex items-center gap-1 max-w-full truncate">
                    <span className="truncate">{currentModelName}</span>
                    <span className="text-[10px] bg-white/20 px-1 rounded text-white/80">
                      {aiModels.find((m) => m.id === currentModel)?.provider ||
                        ""}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {aiModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex flex-col">
                        <span>{model.name}</span>
                        <span className="text-xs text-gray-500">
                          {model.provider}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* User button replaced with mock avatar for personal website */}
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-600 font-normal">
            D
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
