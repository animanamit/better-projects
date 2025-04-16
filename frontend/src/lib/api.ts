import { Task } from "@/mock-data";
import { mockData } from "@/mock-data";

// API configuration
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api";

// Use mock data in development if API is not available
const USE_MOCK_DATA = import.meta.env.NODE_ENV === 'development' && 
                      (!import.meta.env.VITE_BACKEND_URL || 
                       import.meta.env.VITE_USE_MOCK_DATA === 'true');

// Simple request deduplication mechanism
const pendingRequests = new Map<string, Promise<any>>();

// Helper function to deduplicate requests
function deduplicateRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<T>;
  }
  
  const promise = requestFn().finally(() => {
    pendingRequests.delete(key);
  });
  
  pendingRequests.set(key, promise);
  return promise;
}

// Fetch all tasks for a user
export const fetchTasks = async (userId: string, _userEmail?: string): Promise<Task[]> => {
  return deduplicateRequest(`tasks-${userId}`, async () => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(r => setTimeout(r, 500));
      return mockData.tasks.filter(task => 
        task.assigneeId === userId || task.reporterId === userId
      ).slice(0, 5);
    }
    
    try {
      const response = await fetch(`${API_URL}/tasks?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch tasks');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  });
};

// Fetch a single task by ID
export const fetchTaskById = async (taskId: string): Promise<Task> => {
  return deduplicateRequest(`task-${taskId}`, async () => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(r => setTimeout(r, 300));
      const task = mockData.tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    }
    
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch task');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  });
};

// Create a new task
export const createTask = async (data: { 
  title: string; 
  description: string; 
  userId: string;
  userEmail: string;
  userName?: string;
}): Promise<Task> => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600));
    
    // Create a mock task
    return {
      id: `task-${Date.now()}`,
      title: data.title,
      description: data.description,
      status: "TODO" as any,
      priority: "MEDIUM" as any,
      projectId: "proj-01", // Default project
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create task');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (data: { 
  id: string; 
  title?: string; 
  description?: string; 
  status?: "todo" | "in_progress" | "done";
}): Promise<Task> => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 400));
    
    const task = mockData.tasks.find(t => t.id === data.id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    // Mapping status to enum if needed
    let mappedStatus = task.status;
    if (data.status) {
      switch(data.status) {
        case 'todo': mappedStatus = 'TODO' as any; break;
        case 'in_progress': mappedStatus = 'IN_PROGRESS' as any; break;
        case 'done': mappedStatus = 'COMPLETED' as any; break;
      }
    }
    
    return {
      ...task,
      ...data,
      status: mappedStatus,
      updatedAt: new Date().toISOString(),
    };
  }
  
  try {
    const response = await fetch(`${API_URL}/tasks/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update task');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id: string): Promise<{ success: boolean }> => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 300));
    return { success: true };
  }
  
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete task');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};