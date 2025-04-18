import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import taskReducer from './slices/taskSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    tasks: taskReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Allows non-serializable values
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;