import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task } from "@/store/taskStore";

interface AddTaskFormProps {
  onSubmit: (name: string, category: string) => void;
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name, category);
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="flex flex-col gap-2">
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
