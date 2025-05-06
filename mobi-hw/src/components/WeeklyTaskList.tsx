import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const weeklyTasks = [
  { id: "glas_gibnen", name: "글라스 기브넨" },
  { id: "weekly_boss", name: "주간 보스 (페리, 크라브바흐, 크라마)" },
  { id: "cash_shop_weekly", name: "캐쉬샵 (데카 곡물)" },
  { id: "demon_badge", name: "마족의 증표(별의 인장) 교환" },
  { id: "food_material", name: "음식 재료 교환" },
];

const WeeklyTaskList = () => {
  const [tasks, setTasks] = useState<Record<string, boolean>>({});

  // 로컬스토리지에서 상태 불러오기
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("weeklyTasks") || "{}");
    const lastReset = localStorage.getItem("weeklyTasksResetTime");
    const now = new Date();

    // 매주 월요일 자정에 초기화
    const currentWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // 월요일
    if (!lastReset || new Date(lastReset).toDateString() !== currentWeek.toDateString()) {
      localStorage.setItem("weeklyTasksResetTime", currentWeek.toISOString());
      setTasks({});
    } else {
      setTasks(storedTasks);
    }
  }, []);

  // 상태 변경 시 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem("weeklyTasks", JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">주간 숙제</h2>
      <ul className="space-y-2">
        {weeklyTasks.map((task) => (
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

export default WeeklyTaskList;
