import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import Dashboard from "@/dashboard.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a React Query client with optimized settings to reduce requests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Disable automatic refetching based on stale time
      cacheTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
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
        <ClerkProvider
          publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
          signUpFallbackRedirectUrl="/dashboard"
          signInFallbackRedirectUrl="/dashboard"
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<App />} />
            <Route
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
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <>
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/sign-in" />
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </ClerkProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
