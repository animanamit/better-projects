import { UserButton } from "@clerk/clerk-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchQuery } from "@/store/slices/taskSlice";
import { toggleDarkMode } from "@/store/slices/uiSlice";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TopBar() {
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector((state) => state.tasks);
  const { darkMode } = useAppSelector((state) => state.ui);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <div className="top-bar z-20 p-2">
      <div className="flex items-center justify-between h-fit py-2 text-white px-4 rounded-xl bg-orange-600">
        <div className="flex items-center gap-4">
          <div className="text-md font-bold">Task Manager</div>
        </div>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search tasks..."
            className="max-w-xs ml-4 bg-white text-black"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDarkModeToggle}
            className="text-white hover:text-white hover:bg-orange-700"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
          <UserButton />
        </div>
      </div>
    </div>
  );
}
