import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const dailyTasks = [
  { id: "silver", name: "은화" },
  { id: "grain", name: "곡물" },
  { id: "black_hole", name: "검은 구멍 3회" },
  { id: "barrier", name: "결계 2회" },
  { id: "daily_dungeon", name: "요일 던전" },
  { id: "part_time", name: "아르바이트" },
  { id: "phantom_tower", name: "망령의 탑 5회" },
  { id: "cash_shop", name: "캐쉬샵 (무료 물품, 데카 은화, 골드 보석함)" },
];

const DailyTaskList = () => {
  const [tasks, setTasks] = useState<Record<string, boolean>>({});

  // 로컬스토리지에서 상태 불러오기
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("dailyTasks") || "{}");
    const lastReset = localStorage.getItem("dailyTasksResetTime");
    const now = new Date();

    // 자정에 초기화
    if (!lastReset || new Date(lastReset).toDateString() !== now.toDateString()) {
      localStorage.setItem("dailyTasksResetTime", now.toISOString());
      setTasks({});
    } else {
      setTasks(storedTasks);
    }
  }, []);

  // 상태 변경 시 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem("dailyTasks", JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">일일 숙제</h2>
      <ul className="space-y-2">
        {dailyTasks.map((task) => (
          <li key={task.id} className="flex items-center space-x-2">
            <Checkbox
              checked={tasks[task.id] || false}
              onCheckedChange={() => toggleTask(task.id)}
            />
            <span>{task.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyTaskList;
