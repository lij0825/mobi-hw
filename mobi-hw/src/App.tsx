import TaskTabs from "./components/TaskTabs";
import { Card } from "@/components/ui/card";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { BarrierAlarm } from "@/components/BarrierAlarm";
import { ResetStorageButton } from "./components/ResetStorageButton"; // 이 줄 추가

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <div className="p-4 flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 text-lg">
        {/* 고정되지 않은 일반 헤더 */}
        <header className="w-full mb-8 py-4">
          <h1 className="text-4xl font-bold text-center text-primary">모비노기 숙제</h1>
        </header>

        <div className="flex-grow flex flex-col items-center justify-center w-full">
          <div className="w-full max-w-lg mb-4">
            <BarrierAlarm />
          </div>
          <Card className="w-full max-w-lg border shadow-lg overflow-hidden">
            <TaskTabs />
          </Card>

          {/* 이 부분 추가 */}
          <div className="w-full max-w-lg mt-4 flex justify-end">
            <ResetStorageButton />
          </div>
        </div>

        <footer className="text-center text-base text-muted-foreground mt-8 mb-4">
          © 월요일 좋아
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
