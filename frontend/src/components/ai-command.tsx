import { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskPriority, TaskStatus } from "@/mock-data";
import { processTaskWithAI, ParsedTask } from "@/lib/ai";
import { useMockData } from "@/lib/mock-data-context";
import { AIContext } from "@/App";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";

export function AiCommand() {
  // State for command dialog visibility
  const [open, setOpen] = useState(false);

  // State for AI task creation
  const [aiPrompt, setAiPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedTask, setParsedTask] = useState<ParsedTask | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Context for AI model selection and mock data
  const { selectedModel } = useContext(AIContext);
  const { addTask } = useMockData();

  // Mock user for personal website deployment
  const user = {
    id: "user-01",
    primaryEmailAddress: { emailAddress: "demo@example.com" },
    fullName: "Demo User",
  };
  const queryClient = useQueryClient();
  const userId = user?.id;

  // Listen for keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Create task mutation
  const { mutate: createTaskMutation, isPending } = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      userId: string;
      userEmail: string;
      userName?: string;
      priority?: TaskPriority;
      estimatedHours?: number;
      tags?: string[];
      dueDate?: string;
    }) => {
      if (!addTask) throw new Error("Mock data context not available");

      // Create a new task using the mock data context
      return addTask({
        title: data.title,
        description: data.description,
        status: TaskStatus.TODO,
        priority: data.priority || TaskPriority.MEDIUM,
        projectId: "proj-01", // Default project
        assigneeId: data.userId,
        reporterId: data.userId,
        estimatedHours: data.estimatedHours,
        dueDate: data.dueDate,
      });
    },
    onSuccess: () => {
      // Reset form
      setAiPrompt("");
      setParsedTask(null);
      setShowPreview(false);
      setOpen(false);

      // Invalidate queries to refresh the task list
      queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
    },
  });

  // Process natural language input with AI
  const handleAiProcess = async () => {
    if (!aiPrompt.trim()) return;

    setIsProcessing(true);

    try {
      // Process the natural language prompt using AI
      const result = await processTaskWithAI(aiPrompt, selectedModel);

      // Set the parsed task and show the preview
      setParsedTask(result.task);
      setShowPreview(true);
    } catch (error) {
      console.error("Error processing task with AI:", error);
      alert("Failed to process your task. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Create task from the AI-parsed data
  const handleCreateFromAI = () => {
    if (
      !parsedTask ||
      !userId ||
      !user?.primaryEmailAddress?.emailAddress ||
      !addTask
    )
      return;

    createTaskMutation({
      title: parsedTask.title,
      description: parsedTask.description || "",
      userId,
      userEmail: user.primaryEmailAddress.emailAddress,
      userName: user.fullName || undefined,
      priority: parsedTask.priority,
      estimatedHours: parsedTask.estimatedHours,
      tags: parsedTask.tags,
      dueDate: parsedTask.dueDate,
    });
  };

  // Edit the AI-parsed task before creation
  const handleEditParsedTask = (field: keyof ParsedTask, value: any) => {
    if (!parsedTask) return;

    setParsedTask({
      ...parsedTask,
      [field]: value,
    });
  };

  // Restart the AI process
  const handleRestart = () => {
    setShowPreview(false);
    setAiPrompt("");
    setParsedTask(null);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Create Task with AI"
      description="Describe your task in natural language and our AI will create it for you"
    >
      <div className="flex flex-col p-1 max-h-[80vh] overflow-y-auto">
        {!showPreview ? (
          <>
            <div className="px-3 pt-2 pb-3">
              <h3 className="text-base font-medium mb-1">
                Create Task with AI
              </h3>
              <p className="text-xs text-black/60">
                Describe your task in natural language and AI will extract the
                details
              </p>
            </div>
            <div className="px-3 py-2">
              <textarea
                placeholder="Describe your task in natural language..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full px-3 py-2 bg-white/50 text-sm border border-black/10 min-h-[100px]"
                rows={5}
              />
            </div>
            <div className="p-3 border-t mt-2 flex items-center justify-between">
              <div className="text-xs text-black/60">
                <span>Type details like priority, due date, hours</span>
              </div>
              <button
                onClick={handleAiProcess}
                disabled={isProcessing || !aiPrompt.trim()}
                className="px-4 py-2 bg-black text-white text-sm hover:bg-black/90 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Process with AI"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="px-3 pt-3 pb-2">
              <h3 className="text-base font-medium mb-1">AI Task Preview</h3>
              <p className="text-xs text-black/60">
                Review and edit the AI-generated task before creating
              </p>
            </div>
            <div className="overflow-y-auto px-3 space-y-3">
              {parsedTask && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-normal text-black/70 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={parsedTask.title}
                      onChange={(e) =>
                        handleEditParsedTask("title", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white/50 text-sm border border-black/10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-black/70 mb-1">
                      Description
                    </label>
                    <textarea
                      value={parsedTask.description || ""}
                      onChange={(e) =>
                        handleEditParsedTask("description", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-white/50 text-sm border border-black/10"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-normal text-black/70 mb-1">
                        Priority
                      </label>
                      <select
                        value={parsedTask.priority || TaskPriority.MEDIUM}
                        onChange={(e) =>
                          handleEditParsedTask("priority", e.target.value)
                        }
                        className="w-full px-2 py-1 bg-white/50 text-sm border border-black/10"
                      >
                        <option value={TaskPriority.LOW}>Low</option>
                        <option value={TaskPriority.MEDIUM}>Medium</option>
                        <option value={TaskPriority.HIGH}>High</option>
                        <option value={TaskPriority.HIGHEST}>Highest</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-normal text-black/70 mb-1">
                        Estimated Hours
                      </label>
                      <input
                        type="number"
                        value={parsedTask.estimatedHours || ""}
                        onChange={(e) =>
                          handleEditParsedTask(
                            "estimatedHours",
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        className="w-full px-3 py-2 bg-white/50 text-sm border border-black/10"
                        placeholder="Hours"
                      />
                    </div>
                  </div>

                  {parsedTask.tags && parsedTask.tags.length > 0 && (
                    <div>
                      <label className="block text-sm font-normal text-black/70 mb-1">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {parsedTask.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-black/5 text-black/70 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {parsedTask.dueDate && (
                    <div>
                      <label className="block text-sm font-normal text-black/70 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={parsedTask.dueDate}
                        onChange={(e) =>
                          handleEditParsedTask("dueDate", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white/50 text-sm border border-black/10"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex space-x-2 p-3 border-t mt-3">
              <button
                onClick={handleCreateFromAI}
                disabled={isPending}
                className="px-4 py-2 bg-black text-white text-sm hover:bg-black/90 disabled:opacity-50 flex-1"
              >
                {isPending ? "Creating..." : "Create Task"}
              </button>

              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-white text-black border border-black/20 text-sm hover:bg-black/5"
              >
                Start Over
              </button>
            </div>
          </>
        )}
      </div>
    </CommandDialog>
  );
}
