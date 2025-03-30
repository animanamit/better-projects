import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { type Task } from "@/utils/mock-data";

const Task = ({ mockTask }: { mockTask: Task }) => {
  return (
    <Card className="w-full rounded-sm gap-2">
      <CardHeader>
        <CardTitle>{mockTask.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{mockTask.description}</CardDescription>
        <CardFooter className="flex flex-row gap-2">
          <span>{mockTask.priority}</span>
          <span>{mockTask.status}</span>
          <div className="flex flex-row gap-2 uppercase">
            {mockTask.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default Task;
