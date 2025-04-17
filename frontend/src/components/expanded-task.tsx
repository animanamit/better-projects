import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Task, TaskStatus } from "@/mock-data";

const statusClassMap: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "text-todo",
  [TaskStatus.IN_PROGRESS]: "text-in-progress",
  [TaskStatus.IN_REVIEW]: "text-in-review",
  [TaskStatus.TESTING]: "text-testing",
  [TaskStatus.BLOCKED]: "text-blocked",
  [TaskStatus.COMPLETED]: "text-completed",
};

const TaskDetailsCard = ({ task }: { task: Task }) => {
  return (
    <div className="p-4 mb-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        <span className="text-sm font-semibold text-gray-700 mr-2">
          {task.assigneeId}
        </span>
        <span className={`text-sm ${statusClassMap[task.status]}`}>
          {task.status}
        </span>
      </div>
      <h3 className="text-xl font-bold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
      <p className="text-sm text-gray-500 font-mono">
        {task.dueDate?.toString().split("T")[0]}
      </p>
      <div>
        <span className="text-sm tracking-tight">Related Tasks</span>
      </div>
      <span className="uppercase text-xs">{task.projectId}</span>
    </div>
  );
};

export default function ExpandedTask({ task }: { task: Task }) {
  return (
    <Drawer>
      <DrawerTrigger>
        <TaskDetailsCard task={task} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
