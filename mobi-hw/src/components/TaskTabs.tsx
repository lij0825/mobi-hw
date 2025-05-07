import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DailyTaskList from "./DailyTaskList";
import WeeklyTaskList from "./WeeklyTaskList";
import CharacterTabs from "./CharacterTabs";
import { useTaskStore } from "../store/taskStore";
import { Clock, CalendarDays } from "lucide-react";

function TaskTabs() {
  // 캐릭터 정보 가져오기
  const { characters } = useTaskStore();

  // 로컬스토리지에서 마지막 선택한 탭 값을 가져오거나 기본값으로 'daily' 사용
  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedTab = localStorage.getItem("activeTab");
    return savedTab || "daily";
  });

  // 탭 변경 시 로컬스토리지에 저장
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem("activeTab", value);
  };

  // 컴포넌트 마운트 시 로컬스토리지 값으로 초기화
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* 캐릭터 탭 추가 */}
      <CharacterTabs />

      {/* 캐릭터가 있을 때만 숙제 탭 표시 */}
      {characters.length > 0 ? (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="justify-center mb-4 w-full grid grid-cols-2">
            <TabsTrigger value="daily" className="text-lg py-3">
              <Clock className="mr-2 h-6 w-6" /> 일일 숙제
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-lg py-3">
              <CalendarDays className="mr-2 h-6 w-6" /> 주간 숙제
            </TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="border-none mt-0">
            <DailyTaskList />
          </TabsContent>
          <TabsContent value="weekly" className="border-none mt-0">
            <WeeklyTaskList />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="p-8 text-center rounded-md mt-4">
          <p className="text-gray-500 text-xl">캐릭터를 추가하여 일일/주간 숙제를 관리해보세요!</p>
        </div>
      )}
    </div>
  );
}

export default TaskTabs;
