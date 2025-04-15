/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { type Task } from "@/mock-data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, createTask } from "@/lib/api";

export function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useUser();
  const queryClient = useQueryClient();
  const userId = user?.id;

  // Query for tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", userId],
    queryFn: () =>
      fetchTasks(userId!, user?.primaryEmailAddress?.emailAddress || ""),
    enabled: !!userId && !!user?.primaryEmailAddress?.emailAddress,
  });

  // Mutation for creating tasks
  const { mutate, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      // Reset form
      setTitle("");
      setDescription("");

      // Refresh the tasks list
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !user?.primaryEmailAddress?.emailAddress) return;

    mutate({
      title,
      description,
      userId,
      userEmail: user.primaryEmailAddress.emailAddress,
      userName: user.fullName || undefined,
    });
  };

  if (!userId) {
    return <div>Please sign in to create tasks</div>;
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 
focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isPending ? "Creating..." : "Create Task"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
        <ul className="mt-4 space-y-4">
          {tasks.map((task: Task) => (
            <li key={task.id} className="rounded-lg border p-4">
              <h3 className="font-medium">{task.title}</h3>
              {task.description && (
                <p className="text-gray-600">{task.description}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
