import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// Clerk auth commented out for personal website deployment
// import {
//   ClerkProvider,
//   SignedIn,
//   SignedOut,
//   SignIn,
//   SignUp,
// } from "@clerk/clerk-react";
import Dashboard from "@/dashboard.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TaskPage from "@/task-page.tsx";
import ProjectPage from "@/project-page.tsx";
import TeamPage from "@/teams-page.tsx";

// Create a React Query client with optimized settings to reduce requests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Disable automatic refetching based on stale time
      gcTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
      retry: false, // Disable retries
      refetchOnWindowFocus: false, // Disable refetch on window focus
      refetchOnReconnect: false, // Disable refetch on reconnect
      refetchOnMount: false, // Disable refetch on component mount
    },
    mutations: {
      retry: false, // Disable retries for mutations
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Clerk provider removed for personal website deployment */}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<App />} />
          
          {/* Auth routes commented out for personal website deployment */}
          {/* <Route
            path="/sign-in"
            element={<SignIn routing="path" path="/sign-in" />}
          />
          <Route
            path="/sign-up"
            element={<SignUp routing="path" path="/sign-up" />}
          />
          <Route
            path="/sign-in/sso-callback"
            element={<SignIn routing="path" path="/sign-in" />}
          />
          <Route
            path="/sign-up/sso-callback"
            element={<SignUp routing="path" path="/sign-up" />}
          /> */}

          {/* Dashboard routes - now directly accessible without auth */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="task/:id" element={<TaskPage />} />
            <Route path="project/:id" element={<ProjectPage />} />
            <Route path="team/:id" element={<TeamPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
