import { ChevronsUpDown } from "lucide-react";
import { TaskItem } from "./TaskItem";
import { CounterTaskItem } from "./CounterTaskItem";
import type { Task } from "@/store/taskStore";
import { getCategoryIcon } from "@/lib/utils";

interface TaskCategoryProps {
  category: string;
  tasks: Task[];
  expanded: boolean;
  onToggle: () => void;
  onTaskToggle: (id: string) => void;
  onTaskIncrement?: (id: string) => void;
  onTaskDecrement?: (id: string) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (id: string) => void;
  tasksStatus: Record<string, boolean>;
  taskCounts?: Record<string, number>;
  isWeekly?: boolean;
}

export const TaskCategory = ({
  category,
  tasks,
  expanded,
  onToggle,
  onTaskToggle,
  onTaskIncrement,
  onTaskDecrement,
  onTaskEdit,
  onTaskDelete,
  tasksStatus,
  taskCounts = {},
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
          className={`transition-transform duration-300 ${expanded ? "transform rotate-180" : ""}`}
        />
      </div>

      {expanded && (
        <ul className="space-y-3 mb-3 pl-2">
          {tasks.map((task) =>
            // 카운트가 있는 작업인지 확인하고 적절한 컴포넌트 렌더링
            task.count ? (
              <CounterTaskItem
                key={task.id}
                task={task}
                currentCount={taskCounts[task.id] || 0}
                maxCount={task.count}
                onIncrement={onTaskIncrement ? (id) => onTaskIncrement(id) : () => {}}
                onDecrement={onTaskDecrement ? (id) => onTaskDecrement(id) : () => {}}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
              />
            ) : (
              <TaskItem
                key={task.id}
                task={task}
                checked={tasksStatus[task.id] || false}
                onToggle={onTaskToggle}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
              />
            )
          )}
        </ul>
      )}
    </div>
  );
};
