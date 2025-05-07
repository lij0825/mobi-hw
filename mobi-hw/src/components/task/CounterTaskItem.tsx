import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Minus, Plus } from "lucide-react";
import type { Task } from "@/store/taskStore";
import { Progress } from "@/components/ui/progress";

interface CounterTaskItemProps {
  task: Task;
  currentCount: number;
  maxCount: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const CounterTaskItem = React.memo(
  ({
    task,
    currentCount,
    maxCount,
    onIncrement,
    onDecrement,
    onEdit,
    onDelete,
  }: CounterTaskItemProps) => {
    const isCompleted = currentCount >= maxCount;
    const progress = Math.min((currentCount / maxCount) * 100, 100);

    return (
      <li className="flex flex-col p-3 rounded-md bg-card hover:bg-muted">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span className={`text-lg ${isCompleted ? "text-muted-foreground line-through" : ""}`}>
              {task.name}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(task)} className="h-8 w-8 p-0">
              <Pencil size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0 hover:text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        <div className="flex items-center mb-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDecrement(task.id)}
            disabled={currentCount <= 0}
            className={`h-8 w-8 p-0 rounded-r-none ${currentCount <= 0 ? "opacity-50" : ""}`}
          >
            <Minus size={16} />
          </Button>
          <div className="px-4 py-1 bg-muted border-y">
            <span className="font-medium">
              {currentCount}/{maxCount}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onIncrement(task.id)}
            disabled={isCompleted}
            className={`h-8 w-8 p-0 rounded-l-none ${isCompleted ? "opacity-50" : ""}`}
          >
            <Plus size={16} />
          </Button>
        </div>

        <Progress value={progress} className="h-2" />
      </li>
    );
  }
);
