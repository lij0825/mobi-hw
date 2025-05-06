import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
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
      <div className="p-4 text-center">
        <p>캐릭터를 추가하여 숙제를 관리해보세요!</p>
      </div>
    );
  }

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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">주간 숙제</h2>

      {/* 작업 목록 */}
      <ul className="space-y-2 mb-4">
        {weeklyTaskItems.map((task) => (
          <li key={task.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={tasks[task.id] || false}
                onCheckedChange={() => toggleWeeklyTask(task.id)}
              />
              <span className={tasks[task.id] ? "line-through text-gray-500" : ""}>
                {task.name}
              </span>
            </div>
            <div className="flex space-x-1">
              <button onClick={() => startEditing(task)} className="p-1 hover:text-blue-500">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDeleteTask(task.id)} className="p-1 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 작업 추가 폼 */}
      {isAdding && (
        <form onSubmit={handleAddTask} className="flex items-center gap-2 mt-4">
          <Input
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="새 작업 이름"
            className="flex-1"
            autoFocus
          />
          <Button type="submit" size="sm">
            추가
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={cancelEditing}>
            취소
          </Button>
        </form>
      )}

      {/* 작업 수정 폼 */}
      {editingTask && (
        <form onSubmit={handleEditTask} className="flex items-center gap-2 mt-4">
          <Input
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="작업 이름 수정"
            className="flex-1"
            autoFocus
          />
          <Button type="submit" size="sm">
            수정
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={cancelEditing}>
            취소
          </Button>
        </form>
      )}

      {/* 추가 버튼 (추가/수정 중이 아닐 때만 표시) */}
      {!isAdding && !editingTask && (
        <Button
          onClick={startAdding}
          variant="outline"
          className="w-full mt-4 flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} /> 새 작업 추가
        </Button>
      )}
    </div>
  );
};

export default WeeklyTaskList;
