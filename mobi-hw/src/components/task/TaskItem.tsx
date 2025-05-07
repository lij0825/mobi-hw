import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/store/taskStore";

interface TaskItemProps {
  task: Task;
  checked: boolean;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = React.memo(
  ({ task, checked, onToggle, onEdit, onDelete }: TaskItemProps) => {
    return (
      <li className="flex items-center justify-between p-3 rounded-md bg-card hover:bg-muted">
        <div
          className="flex items-center space-x-3 flex-1 cursor-pointer"
          onClick={() => onToggle(task.id)}
        >
          <Checkbox
            id={`task-${task.id}`}
            checked={checked}
            onCheckedChange={() => onToggle(task.id)}
            className="h-5 w-5"
            onClick={(e) => e.stopPropagation()}
          />
          <label
            htmlFor={`task-${task.id}`}
            className={`text-lg select-none ${checked ? "line-through text-muted-foreground" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              onToggle(task.id);
            }}
          >
            {task.name}
          </label>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="h-8 w-8 p-0"
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="h-8 w-8 p-0 hover:text-destructive"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </li>
    );
  }
);
