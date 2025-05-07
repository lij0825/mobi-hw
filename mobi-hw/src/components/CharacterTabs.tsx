import { useState } from "react";
import type { FormEvent } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Pencil, Trash2, UserCircle } from "lucide-react";
import { useTaskStore } from "../store/taskStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <Card className="w-full border-none shadow-none">
        <CardContent className="flex flex-col items-center py-8">
          <UserCircle className="h-20 w-20 text-muted-foreground mb-4" />
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2 text-lg"
          >
            <PlusCircle size={20} /> 캐릭터 추가
          </Button>

          {/* 캐릭터 추가 다이얼로그 */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl">캐릭터 추가</DialogTitle>
                <DialogDescription className="text-lg">
                  새로운 캐릭터를 추가하여 숙제를 관리하세요.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCharacter}>
                <div className="py-4">
                  <Input
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="캐릭터 이름"
                    className="w-full text-lg"
                    autoFocus
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="text-lg"
                  >
                    취소
                  </Button>
                  <Button type="submit" className="text-lg">
                    추가
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
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
    <div className="w-full mb-6 pt-4">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-2xl font-bold">캐릭터</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setCharacterName("");
            setIsAddDialogOpen(true);
          }}
          className="flex items-center gap-2 text-base"
        >
          <PlusCircle size={20} /> 캐릭터 추가
        </Button>
      </div>

      <div className="px-2">
        <Tabs
          value={selectedCharacterId || undefined}
          onValueChange={selectCharacter}
          className="w-full"
        >
          <TabsList className="flex mb-2 overflow-x-auto justify-start w-full h-auto p-1 rounded-md">
            {characters.map((character) => (
              <div key={character.id} className="flex items-center mb-1">
                <TabsTrigger value={character.id} className="px-4 py-2 text-lg">
                  <div className="relative">
                    {character.name}
                    {selectedCharacterId === character.id && (
                      <Badge className="absolute -top-2 -right-6 h-1 w-1 rounded-full p-0 bg-primary" />
                    )}
                  </div>
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
            <DialogTitle className="text-2xl">캐릭터 추가</DialogTitle>
            <DialogDescription className="text-lg">
              새로운 캐릭터를 추가하여 숙제를 관리하세요.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCharacter}>
            <div className="py-4">
              <Input
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="캐릭터 이름"
                className="w-full text-lg"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="text-lg"
              >
                취소
              </Button>
              <Button type="submit" className="text-lg">
                추가
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 캐릭터 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">캐릭터 수정</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCharacter}>
            <div className="py-4">
              <Input
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="캐릭터 이름"
                className="w-full text-lg"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="text-lg"
              >
                취소
              </Button>
              <Button type="submit" className="text-lg">
                수정
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CharacterTabs;
