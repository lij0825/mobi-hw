import TaskTabs from "./components/TaskTabs";
import { Card } from "@/components/ui/card";
import { ThemeProvider } from "@/components/ui/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <div className="p-4 flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 text-lg">
        {/* 고정되지 않은 일반 헤더 */}
        <header className="w-full mb-8 py-4">
          <h1 className="text-4xl font-bold text-center text-primary">모비노기 숙제</h1>
        </header>

        <div className="flex-grow flex items-center justify-center w-full">
          <Card className="w-full max-w-lg border shadow-lg overflow-hidden">
            <TaskTabs />
          </Card>
        </div>

        <footer className="text-center text-base text-muted-foreground mt-8 mb-4">
          © 모비노기 숙제 관리
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
