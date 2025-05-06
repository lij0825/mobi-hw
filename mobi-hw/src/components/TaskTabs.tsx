import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DailyTaskList from "./DailyTaskList";
import WeeklyTaskList from "./WeeklyTaskList";

function TaskTabs() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md">
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="justify-center">
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

export default TaskTabs;
