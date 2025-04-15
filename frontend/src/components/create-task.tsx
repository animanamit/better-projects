/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@clerk/clerk-react";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { userId } = useAuth();

  const utils = trpc.useUtils();

  const { mutate: createTask, isPending } = trpc.create.useMutation({
    onSuccess: () => {
      setTitle("");
      setDescription("");
      utils.getAll.invalidate();
    },
    onError: (error) => {
      console.error("Error creating task:", error);
    },
  });

  const { data: tasks, isLoading: isLoadingTasks } = trpc.getAll.useQuery(
    { userId: userId! },
    { enabled: !!userId, retry: false }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const taskData = {
      title,
      description,
      userId,
    };

    console.log("Attempting to create task with data:", taskData);
    createTask(taskData);
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
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isPending ? "Creating..." : "Create Task"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
        {isLoadingTasks ? (
          <p>Loading tasks...</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {tasks?.map((task: Task) => (
              <li key={task.id} className="rounded-lg border p-4">
                <h3 className="font-medium">{task.title}</h3>
                {task.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {task.description}
                  </p>
                )}
                <span className="mt-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
