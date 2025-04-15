import { UserButton } from "@clerk/clerk-react";

const TopBar = () => {
  return (
    <div className="top-bar z-20  p-2">
      <div className="flex items-center justify-between h-fit py-2 text-white px-4 rounded-xl bg-orange-600 ">
        <div className="text-md font-bold">Task Manager</div>
        <div className="flex items-center justify-center">
          <UserButton />
        </div>
      </div>
    </div>
  );
};
export default TopBar;
