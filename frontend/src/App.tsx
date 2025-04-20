import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import { useState, createContext, useEffect } from "react";
import { defaultModel } from "@/lib/ai";

export const AIContext = createContext({
  selectedModel: defaultModel,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSelectedModel: (model: string) => {},
});

function App() {
  const [selectedModel, setSelectedModel] = useState(defaultModel);

  // Ensure we always initialize with the default model, and log it for debugging
  useEffect(() => {
    console.log("App initialized with default model:", defaultModel);
  }, []);

  return (
    <AIContext.Provider value={{ selectedModel, setSelectedModel }}>
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
    </AIContext.Provider>
  );
}

export default App;
