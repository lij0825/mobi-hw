// 또는 이와 유사한 상위 컴포넌트 파일

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DailyTaskList from "@/components/DailyTaskList";
import WeeklyTaskList from "@/components/WeeklyTaskList";
import { BarrierAlarm } from "@/components/BarrierAlarm";

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("daily");

  return (
    <div className="container mx-auto p-4">
      {/* 결계 알람을 탭 상단에 배치 - 항상 보이도록 */}
      <BarrierAlarm />

      <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily">일일 숙제</TabsTrigger>
          <TabsTrigger value="weekly">주간 숙제</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          <DailyTaskList />
        </TabsContent>
        <TabsContent value="weekly">
          <WeeklyTaskList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
