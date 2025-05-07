import { Clock } from "lucide-react";

interface TaskHeaderProps {
  title: string;
  completedTasks: number;
  totalTasks: number;
  timeUntilReset: string;
  progress: number;
}

export const TaskHeader = ({
  title,
  completedTasks,
  totalTasks,
  timeUntilReset,
  progress,
}: TaskHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="text-base text-muted-foreground">
          {completedTasks}/{totalTasks} 완료
        </div>
      </div>

      <div className="flex items-center mb-4 text-muted-foreground">
        <Clock size={16} className="mr-1" />
        <span className="text-sm">초기화까지 {timeUntilReset} 남음</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-6 dark:bg-gray-700">
        <div className="bg-primary h-3 rounded-full" style={{ width: `${progress}%` }} />
      </div>
    </>
  );
};
