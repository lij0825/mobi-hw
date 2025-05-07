import { useEffect, useState, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTaskStore } from "@/store/taskStore";
import { TaskHeader } from "./task/TaskHeader";
import { TaskCategory } from "./task/TaskCategory";
import { AddTaskForm, EditTaskForm, AddTaskButton } from "./task/TaskForm";
import { calculateWeeklyResetTime } from "@/lib/utils";
import { WEEKLY_CATEGORIES, DEFAULT_WEEKLY_CATEGORY } from "@/lib/constants";
import type { Task } from "@/store/taskStore";

const WeeklyTaskList = () => {
  const {
    characters,
    selectedCharacterId,
    toggleWeeklyTask,
    checkAndResetTasks,
    addWeeklyTask,
    editWeeklyTask,
    deleteWeeklyTask,
  } = useTaskStore();

  const selectedCharacter = characters.find((c) => c.id === selectedCharacterId);
  const weeklyTaskItems = selectedCharacter?.weeklyTaskItems || [];
  const tasks = selectedCharacter?.weeklyTasks || {};

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState<string>("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_WEEKLY_CATEGORY);

  // 카테고리 목록
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    weeklyTaskItems.forEach((task) => {
      if (task.category) categories.add(task.category);
    });
    return [...WEEKLY_CATEGORIES, ...Array.from(categories)].filter(
      (value, index, self) => self.indexOf(value) === index
    );
  }, [weeklyTaskItems]);

  // 컴포넌트가 마운트될 때 초기화 체크
  useEffect(() => {
    checkAndResetTasks();

    const updateTimeUntilReset = () => {
      const { timeString } = calculateWeeklyResetTime();
      setTimeUntilReset(timeString);
    };

    updateTimeUntilReset();
    const interval = setInterval(updateTimeUntilReset, 1000);
    return () => clearInterval(interval);
  }, [checkAndResetTasks]);

  // 카테고리별로 작업 그룹화
  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {};
    weeklyTaskItems.forEach((task) => {
      const category = task.category || "기타";
      if (!groups[category]) groups[category] = [];
      groups[category].push(task);
    });

    // 초기 확장 상태 설정
    if (Object.keys(expandedCategories).length === 0) {
      const initialState: Record<string, boolean> = {};
      Object.keys(groups).forEach((category) => {
        initialState[category] = true;
      });
      setExpandedCategories(initialState);
    }

    return groups;
  }, [weeklyTaskItems, expandedCategories]);

  // 카테고리 토글 처리
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // 캐릭터가 선택되지 않은 경우 안내 메시지 표시
  if (!selectedCharacterId) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <p className="text-xl">캐릭터를 추가하여 숙제를 관리해보세요!</p>
      </div>
    );
  }

  const totalTasks = weeklyTaskItems.length;
  const completedTasks = weeklyTaskItems.filter((task) => tasks[task.id]).length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // 작업 추가 핸들러
  const handleAddTask = (name: string, category: string) => {
    addWeeklyTask(name, category);
    setIsAdding(false);
  };

  // 작업 수정 핸들러
  const handleEditTask = (id: string, name: string) => {
    editWeeklyTask(id, name);
    setEditingTask(null);
  };

  // 작업 삭제 확인
  const handleDeleteTask = (id: string) => {
    if (window.confirm("이 작업을 삭제하시겠습니까?")) {
      deleteWeeklyTask(id);
    }
  };

  // 편집 모드 시작
  const startEditing = (task: Task) => {
    setEditingTask(task);
    setIsAdding(false);
  };

  // 작업 추가 모드 시작
  const startAdding = () => {
    setEditingTask(null);
    setSelectedCategory(DEFAULT_WEEKLY_CATEGORY);
    setIsAdding(true);
  };

  // 편집/추가 취소
  const cancelEditing = () => {
    setEditingTask(null);
    setIsAdding(false);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-4">
        <TaskHeader
          title="주간 숙제"
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          timeUntilReset={timeUntilReset}
          progress={progress}
        />

        {/* 카테고리별 작업 목록 */}
        {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
          <TaskCategory
            key={category}
            category={category}
            tasks={categoryTasks}
            expanded={expandedCategories[category] || false}
            onToggle={() => toggleCategory(category)}
            onTaskToggle={toggleWeeklyTask}
            onTaskEdit={startEditing}
            onTaskDelete={handleDeleteTask}
            tasksStatus={tasks}
          />
        ))}

        {/* 작업 추가 폼 */}
        {isAdding && (
          <AddTaskForm
            onSubmit={handleAddTask}
            onCancel={cancelEditing}
            categories={availableCategories}
            defaultCategory={selectedCategory}
          />
        )}

        {/* 작업 수정 폼 */}
        {editingTask && (
          <EditTaskForm task={editingTask} onSubmit={handleEditTask} onCancel={cancelEditing} />
        )}

        {/* 추가 버튼 (추가/수정 중이 아닐 때만 표시) */}
        {!isAdding && !editingTask && <AddTaskButton onClick={startAdding} />}
      </CardContent>
    </Card>
  );
};

export default WeeklyTaskList;
