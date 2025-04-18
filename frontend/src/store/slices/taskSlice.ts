import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus } from '@/mock-data';

interface TaskState {
  selectedTask: Task | null;
  filteredStatus: TaskStatus | null;
  searchQuery: string;
}

const initialState: TaskState = {
  selectedTask: null,
  filteredStatus: null,
  searchQuery: '',
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    setFilteredStatus: (state, action: PayloadAction<TaskStatus | null>) => {
      state.filteredStatus = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.filteredStatus = null;
      state.searchQuery = '';
    },
  },
});

export const {
  setSelectedTask,
  setFilteredStatus,
  setSearchQuery,
  clearFilters,
} = taskSlice.actions;

export default taskSlice.reducer;