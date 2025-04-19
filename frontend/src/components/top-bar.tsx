// Clerk auth commented out for personal website deployment
// import { UserButton } from "@clerk/clerk-react";

const TopBar = () => {
  return (
    <div className="top-bar z-20 sticky top-0 p-2">
      <div className="flex items-center justify-between h-fit py-2 text-white px-4 rounded-xl bg-orange-600 ">
        <div className="text-md font-bold">Task Manager</div>
        <div className="flex items-center justify-center">
          {/* User button replaced with mock avatar for personal website */}
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-600 font-bold">
            D
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopBar;
