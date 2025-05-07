import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task } from "@/store/taskStore";
import type { CheckedState } from "@radix-ui/react-checkbox"; // CheckedState 타입 임포트 추가

interface AddTaskFormProps {
  onSubmit: (name: string, category: string, count?: number) => void;
  onCancel: () => void;
  categories: string[];
  defaultCategory: string;
}

export const AddTaskForm = ({
  onSubmit,
  onCancel,
  categories,
  defaultCategory,
}: AddTaskFormProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [hasCounter, setHasCounter] = useState(false);
  const [count, setCount] = useState(1);

  // onCheckedChange 핸들러 추가
  const handleCheckedChange = (checked: CheckedState) => {
    setHasCounter(checked === true); // 명시적으로 boolean으로 변환
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name, category, hasCounter ? count : undefined);
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="새 작업 이름"
            className="flex-1 text-lg"
            autoFocus
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 카운터 옵션 추가 - onCheckedChange 핸들러 사용 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="counter-option"
              checked={hasCounter}
              onCheckedChange={handleCheckedChange}
            />
            <label htmlFor="counter-option" className="text-sm">
              카운트 추가
            </label>
          </div>

          {hasCounter && (
            <div className="flex items-center gap-2">
              <label htmlFor="counter-value" className="text-sm">
                필요 횟수:
              </label>
              <Input
                id="counter-value"
                type="number"
                value={count}
                onChange={(e) => setCount(Number(e.target.value) || 1)}
                min="1"
                className="w-16 h-8"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} className="text-lg">
          취소
        </Button>
        <Button type="submit" className="text-lg">
          추가
        </Button>
      </div>
    </form>
  );
};

interface EditTaskFormProps {
  task: Task;
  onSubmit: (id: string, name: string) => void;
  onCancel: () => void;
}

export const EditTaskForm = ({ task, onSubmit, onCancel }: EditTaskFormProps) => {
  const [name, setName] = useState(task.name);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(task.id, name);
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-6">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="작업 이름 수정"
        className="flex-1 text-lg"
        autoFocus
      />
      <Button type="submit" size="lg" className="text-lg">
        수정
      </Button>
      <Button type="button" variant="outline" size="lg" onClick={onCancel} className="text-lg">
        취소
      </Button>
    </form>
  );
};

interface AddTaskButtonProps {
  onClick: () => void;
}

export const AddTaskButton = ({ onClick }: AddTaskButtonProps) => (
  <Button
    onClick={onClick}
    variant="outline"
    className="w-full mt-4 flex items-center justify-center gap-2 text-lg py-6"
  >
    <PlusCircle size={24} /> 새 작업 추가
  </Button>
);
