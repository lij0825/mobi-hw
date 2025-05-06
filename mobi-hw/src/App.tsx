import TaskTabs from "./components/TaskTabs";

function App() {
  return (
    <div className="p-4 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center fixed top-0 left-1/2 transform -translate-x-1/2 mt-4">
        모비노기 숙제
      </h1>
      <div className="flex-grow flex items-center justify-center w-full">
        <TaskTabs />
      </div>
    </div>
  );
}

export default App;
