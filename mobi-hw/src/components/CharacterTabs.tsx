import { useState } from "react";
import type { FormEvent } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useTaskStore } from "../store/taskStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const CharacterTabs = () => {
  const {
    characters,
    selectedCharacterId,
    selectCharacter,
    addCharacter,
    editCharacter,
    deleteCharacter,
  } = useTaskStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [characterName, setCharacterName] = useState("");
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);

  // 캐릭터 추가 핸들러
  const handleAddCharacter = (e: FormEvent) => {
    e.preventDefault();
    if (characterName.trim()) {
      addCharacter(characterName);
      setCharacterName("");
      setIsAddDialogOpen(false);
    }
  };

  // 캐릭터 수정 핸들러
  const handleEditCharacter = (e: FormEvent) => {
    e.preventDefault();
    if (characterName.trim() && editingCharacterId) {
      editCharacter(editingCharacterId, characterName);
      setCharacterName("");
      setIsEditDialogOpen(false);
    }
  };

  // 캐릭터가 없는 경우 안내 메시지 표시
  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center p-4 border rounded-md">
        <p className="mb-4 text-center">캐릭터를 추가해서 숙제를 관리해보세요!</p>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <PlusCircle size={16} /> 캐릭터 추가
        </Button>

        {/* 캐릭터 추가 다이얼로그 */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>캐릭터 추가</DialogTitle>
              <DialogDescription>새로운 캐릭터를 추가하여 숙제를 관리하세요.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCharacter}>
              <div className="py-4">
                <Input
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="캐릭터 이름"
                  className="w-full"
                  autoFocus
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit">추가</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // 캐릭터 삭제 핸들러
  const handleDeleteCharacter = (id: string) => {
    if (window.confirm("이 캐릭터를 삭제하시겠습니까? 모든 숙제 데이터가 함께 삭제됩니다.")) {
      deleteCharacter(id);
    }
  };

  // 캐릭터 수정 시작
  const startEditingCharacter = (id: string, name: string) => {
    setEditingCharacterId(id);
    setCharacterName(name);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold">캐릭터</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCharacterName("");
            setIsAddDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} /> 캐릭터 추가
        </Button>
      </div>

      <div className="flex overflow-x-auto pb-2">
        <Tabs
          value={selectedCharacterId || undefined}
          onValueChange={selectCharacter}
          className="w-full"
        >
          <TabsList className="flex">
            {characters.map((character) => (
              <div key={character.id} className="flex items-center">
                <TabsTrigger value={character.id} className="px-4">
                  {character.name}
                </TabsTrigger>
                <div className="flex items-center ml-1 space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingCharacter(character.id, character.name);
                    }}
                    className="p-1 hover:text-blue-500"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCharacter(character.id);
                    }}
                    className="p-1 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* 캐릭터 추가 다이얼로그 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>캐릭터 추가</DialogTitle>
            <DialogDescription>새로운 캐릭터를 추가하여 숙제를 관리하세요.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCharacter}>
            <div className="py-4">
              <Input
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="캐릭터 이름"
                className="w-full"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                취소
              </Button>
              <Button type="submit">추가</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 캐릭터 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>캐릭터 수정</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCharacter}>
            <div className="py-4">
              <Input
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="캐릭터 이름"
                className="w-full"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                취소
              </Button>
              <Button type="submit">수정</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CharacterTabs;
