import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import Dashboard from "@/dashboard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
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
  </StrictMode>
);
