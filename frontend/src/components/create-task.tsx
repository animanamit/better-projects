/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskPriority, TaskStatus } from "@/mock-data";
import { useMockData } from "@/lib/mock-data-context";

export function CreateTask() {
  // Context for mock data
  const { addTask } = useMockData();
  
  // Traditional form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  // Mock user for personal website deployment
  const user = {
    id: "user-01",
    primaryEmailAddress: { emailAddress: "demo@example.com" },
    fullName: "Demo User",
  };
  const queryClient = useQueryClient();
  const userId = user?.id;

  // Create task mutation
  const { mutate: createTaskMutation, isPending } = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      userId: string;
      userEmail: string;
      userName?: string;
    }) => {
      // Create a new task using the mock data context
      return addTask({
        title: data.title,
        description: data.description,
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        projectId: "proj-01", // Default project
        assigneeId: data.userId,
        reporterId: data.userId,
      });
    },
    onSuccess: () => {
      // Reset form
      setTitle("");
      setDescription("");
      
      // Invalidate queries to refresh the task list
      queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
    },
  });

  // Traditional form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !user?.primaryEmailAddress?.emailAddress) return;

    createTaskMutation({
      title,
      description,
      userId,
      userEmail: user.primaryEmailAddress.emailAddress,
      userName: user.fullName || undefined,
    });
  };

  return (
    <div>
      <div className="bg-white p-3 border border-black/10 mb-4">
        <h3 className="text-sm font-medium">Create Task</h3>
        <p className="text-xs text-black/60 mt-1">
          Create a task by filling out the structured form fields below
        </p>
      </div>
      
      <form onSubmit={handleFormSubmit} className="space-y-3">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-normal text-black/70 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-white text-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-normal text-black/70 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-white text-sm"
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-black text-white text-sm hover:bg-black/90 disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}
