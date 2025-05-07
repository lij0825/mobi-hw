import { ChevronsUpDown } from "lucide-react";
import { TaskItem } from "./TaskItem";
import type { Task } from "@/store/taskStore";
import { getCategoryIcon } from "@/lib/utils";

interface TaskCategoryProps {
  category: string;
  tasks: Task[];
  expanded: boolean;
  onToggle: () => void;
  onTaskToggle: (id: string) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (id: string) => void;
  tasksStatus: Record<string, boolean>;
}

export const TaskCategory = ({
  category,
  tasks,
  expanded,
  onToggle,
  onTaskToggle,
  onTaskEdit,
  onTaskDelete,
  tasksStatus,
}: TaskCategoryProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center">
          {getCategoryIcon(category)}
          <h3 className="text-lg font-medium ml-2">{category}</h3>
        </div>
        <ChevronsUpDown
          size={18}
          className={`transition-transform ${expanded ? "transform rotate-180" : ""}`}
        />
      </div>

      {expanded && (
        <ul className="space-y-3 mb-3 pl-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              checked={tasksStatus[task.id] || false}
              onToggle={onTaskToggle}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
