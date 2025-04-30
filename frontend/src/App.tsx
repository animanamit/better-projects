import { Navigate } from "react-router";
import { useState, createContext, useEffect } from "react";
import { defaultModel } from "@/lib/ai";
import { MockDataProvider } from "@/lib/mock-data-context";

export const AIContext = createContext({
  selectedModel: defaultModel,
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
      <MockDataProvider>
        <main className="bg-[#f8f8f8] min-h-screen">
          <Navigate to="/dashboard" />
          <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="max-w-md w-full bg-white rounded-lg p-8 shadow-sm">
              <div className="mb-6">
                <div className="text-xs text-black/70 mb-2">UNIT 2025</div>
                <h1 className="text-2xl font-normal mb-1">Task Manager</h1>
                <p className="text-sm text-black/70">Status: Disconnected</p>
              </div>

              <div className="space-y-4">
                <a
                  href="/sign-in"
                  className="w-full flex items-center justify-center py-2 px-4 bg-black text-white rounded-md hover:bg-black/90 transition-colors text-sm"
                >
                  Sign In
                </a>

                <div className="text-xs text-black/50 pt-4">
                  <div className="flex justify-between">
                    <span>1. SIGN IN</span>
                    <span>2. PROJECTS</span>
                    <span>3. TASKS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </MockDataProvider>
    </AIContext.Provider>
  );
}

export default App;
