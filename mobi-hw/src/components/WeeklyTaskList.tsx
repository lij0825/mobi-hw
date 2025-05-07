import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Pencil, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTaskStore } from "../store/taskStore";
import type { Task } from "../store/taskStore";

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

  const [newTaskName, setNewTaskName] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // 컴포넌트가 마운트될 때 초기화 체크
  useEffect(() => {
    checkAndResetTasks();
  }, [checkAndResetTasks]);

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
  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (newTaskName.trim()) {
      addWeeklyTask(newTaskName);
      setNewTaskName("");
      setIsAdding(false);
    }
  };

  // 작업 수정 핸들러
  const handleEditTask = (e: FormEvent) => {
    e.preventDefault();
    if (editingTask && newTaskName.trim()) {
      editWeeklyTask(editingTask.id, newTaskName);
      setNewTaskName("");
      setEditingTask(null);
    }
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
    setNewTaskName(task.name);
    setIsAdding(false);
  };

  // 작업 추가 모드 시작
  const startAdding = () => {
    setEditingTask(null);
    setNewTaskName("");
    setIsAdding(true);
  };

  // 편집/추가 취소
  const cancelEditing = () => {
    setEditingTask(null);
    setNewTaskName("");
    setIsAdding(false);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">주간 숙제</h2>
          <div className="text-base text-muted-foreground">
            {completedTasks}/{totalTasks} 완료
          </div>
        </div>

        {/* 진행 상황 바 */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6 dark:bg-gray-700">
          <div className="bg-primary h-3 rounded-full" style={{ width: `${progress}%` }} />
        </div>

        {/* 작업 목록 */}
        <ul className="space-y-3 mb-5">
          {weeklyTaskItems.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-4 rounded-md bg-card hover:bg-muted"
            >
              {/* 왼쪽 부분 전체를 클릭 가능하게 만들기 */}
              <div
                className="flex items-center space-x-3 flex-1 cursor-pointer"
                onClick={() => toggleWeeklyTask(task.id)}
              >
                <Checkbox
                  id={`weekly-${task.id}`}
                  checked={tasks[task.id] || false}
                  onCheckedChange={() => toggleWeeklyTask(task.id)}
                  className="h-6 w-6"
                  // 부모 요소에 이벤트가 있으므로 여기서는 이벤트 버블링 방지
                  onClick={(e) => e.stopPropagation()}
                />
                <label
                  htmlFor={`weekly-${task.id}`}
                  className={`text-xl select-none ${
                    tasks[task.id] ? "line-through text-muted-foreground" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWeeklyTask(task.id);
                  }}
                >
                  {task.name}
                </label>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // 이벤트 전파 방지
                    startEditing(task);
                  }}
                  className="h-10 w-10 p-0"
                >
                  <Pencil size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // 이벤트 전파 방지
                    handleDeleteTask(task.id);
                  }}
                  className="h-10 w-10 p-0 hover:text-destructive"
                >
                  <Trash2 size={20} />
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {/* 작업 추가 폼 */}
        {isAdding && (
          <form onSubmit={handleAddTask} className="flex items-center gap-2 mt-6">
            <Input
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="새 작업 이름"
              className="flex-1 text-lg"
              autoFocus
            />
            <Button type="submit" size="lg" className="text-lg">
              추가
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={cancelEditing}
              className="text-lg"
            >
              취소
            </Button>
          </form>
        )}

        {/* 작업 수정 폼 */}
        {editingTask && (
          <form onSubmit={handleEditTask} className="flex items-center gap-2 mt-6">
            <Input
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="작업 이름 수정"
              className="flex-1 text-lg"
              autoFocus
            />
            <Button type="submit" size="lg" className="text-lg">
              수정
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={cancelEditing}
              className="text-lg"
            >
              취소
            </Button>
          </form>
        )}

        {/* 추가 버튼 (추가/수정 중이 아닐 때만 표시) */}
        {!isAdding && !editingTask && (
          <Button
            onClick={startAdding}
            variant="outline"
            className="w-full mt-4 flex items-center justify-center gap-2 text-lg py-6"
          >
            <PlusCircle size={24} /> 새 작업 추가
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyTaskList;
