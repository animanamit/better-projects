import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockData, Task, TaskStatus, TaskPriority } from '@/mock-data';

// Define the context shape
interface MockDataContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'numComments'>) => Task;
  updateTask: (updatedTask: Partial<Task> & { id: string }) => Task;
  deleteTask: (taskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
}

// Create the context with a default value
const MockDataContext = createContext<MockDataContextType>({
  tasks: [],
  addTask: () => {
    throw new Error('addTask not implemented');
    return {} as Task;
  },
  updateTask: () => {
    throw new Error('updateTask not implemented');
    return {} as Task;
  },
  deleteTask: () => {
    throw new Error('deleteTask not implemented');
  },
  getTaskById: () => {
    throw new Error('getTaskById not implemented');
    return undefined;
  }
});

// Custom hook to use the mock data context
export const useMockData = () => useContext(MockDataContext);

// Function to find task by ID that can be used by components outside of the context
// This matches the getTaskById function in the mock-data module
export const getTaskByIdFromContext = (taskId: string): Task | undefined => {
  const context = useContext(MockDataContext);
  return context.tasks.find(task => task.id === taskId);
};

// Provider component
export const MockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with the mock data
  const [tasks, setTasks] = useState<Task[]>([...mockData.tasks]);

  // Function to add a new task
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'numComments'>): Task => {
    // Generate an ID and timestamps
    const newTask: Task = {
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      numComments: 0,
      ...taskData,
      // Ensure status and priority have default values
      status: taskData.status || TaskStatus.TODO,
      priority: taskData.priority || TaskPriority.MEDIUM,
    };

    // Add to state
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    
    // In a real implementation, we would make an API call here:
    // await createTask(newTask);
    
    return newTask;
  };

  // Function to update an existing task
  const updateTask = (updatedTask: Partial<Task> & { id: string }): Task => {
    let finalTask: Task = {} as Task;
    
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id === updatedTask.id) {
          finalTask = {
            ...task,
            ...updatedTask,
            updatedAt: new Date().toISOString(),
          };
          return finalTask;
        }
        return task;
      });
    });
    
    // In a real implementation, we would make an API call here:
    // await updateTask(finalTask);
    
    return finalTask;
  };

  // Function to delete a task
  const deleteTask = (taskId: string): void => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    
    // In a real implementation, we would make an API call here:
    // await deleteTask(taskId);
  };

  // Function to get a task by ID
  const getTaskById = (taskId: string): Task | undefined => {
    return tasks.find(task => task.id === taskId);
  };

  // Provide the context value
  const contextValue: MockDataContextType = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
  };

  return (
    <MockDataContext.Provider value={contextValue}>
      {children}
    </MockDataContext.Provider>
  );
};