import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

export function ResetStorageButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = () => {
    setIsResetting(true);

    try {
      // 모비 앱 관련 로컬스토리지 항목 초기화
      localStorage.removeItem("mobi-tasks-storage");

      // 세션 스토리지도 초기화 (결계 알람 관련)
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("barrier-")) {
          sessionStorage.removeItem(key);
        }
      });

      // 초기화 완료 후 페이지 새로고침
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("데이터 초기화 중 오류가 발생했습니다:", error);
      setIsResetting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-destructive hover:bg-destructive/10"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-1" /> 데이터 초기화
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>데이터 초기화</DialogTitle>
            <DialogDescription>
              모든 캐릭터와 숙제 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isResetting}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleReset} disabled={isResetting}>
              {isResetting ? "초기화 중..." : "초기화 확인"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
