import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router";

function App() {
  return (
    <main>
      <SignedIn>
        <Navigate to="/dashboard" />
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold mb-4">Welcome to Task Manager</h1>
          <p className="text-lg mb-8">Please sign in to continue</p>
          <a
            href="/sign-in"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </SignedOut>
    </main>
  );
}

export default App;
