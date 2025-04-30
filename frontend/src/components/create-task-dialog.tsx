import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateTask } from "./create-task";

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTaskDialog({ isOpen, onClose }: CreateTaskDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-normal">Create Task</DialogTitle>
        </DialogHeader>
        <CreateTask />
      </DialogContent>
    </Dialog>
  );
}