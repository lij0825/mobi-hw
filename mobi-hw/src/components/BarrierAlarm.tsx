import { useEffect, useState } from "react";
import { Shield, Bell, BellOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useTaskStore } from "@/store/taskStore";
import { calculateBarrierTime, BARRIER_HOURS } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function BarrierAlarm() {
  const { barrierAlarmEnabled, toggleBarrierAlarm } = useTaskStore();

  const [barrierInfo, setBarrierInfo] = useState({
    timeUntilNextBarrier: "",
    isBarrierActive: false,
    currentBarrierHour: null as number | null,
  });

  useEffect(() => {
    // 알림 권한 요청
    if (barrierAlarmEnabled && "Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // 초기 결계 정보 계산
    const updateBarrierInfo = () => {
      const { timeUntilNextBarrier, isBarrierActive, currentBarrierHour } = calculateBarrierTime();

      // 상태가 변경된 경우에만 알림 보내기
      if (
        isBarrierActive &&
        barrierAlarmEnabled &&
        currentBarrierHour !== barrierInfo.currentBarrierHour
      ) {
        showBarrierNotification(currentBarrierHour as number);
      }

      setBarrierInfo({ timeUntilNextBarrier, isBarrierActive, currentBarrierHour });
    };

    updateBarrierInfo();

    // 1초마다 업데이트
    const interval = setInterval(updateBarrierInfo, 1000);

    return () => clearInterval(interval);
  }, [barrierAlarmEnabled, barrierInfo.currentBarrierHour]);

  // 결계 알림 표시
  const showBarrierNotification = (hour: number) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      // 현재 시간을 키로 사용하여 중복 알림 방지
      const notificationKey = `barrier-${new Date().toDateString()}-${hour}`;
      const notificationSent = sessionStorage.getItem(notificationKey);

      if (!notificationSent) {
        const notification = new Notification("결계 알림", {
          body: `${hour}시 결계가 생성되었습니다! (15분 안에 입장하세요)`,
          icon: "/favicon.ico", // 파비콘 또는 적절한 아이콘 경로
        });

        // 알림 클릭시 앱으로 포커스
        notification.onclick = () => window.focus();

        // 중복 알림 방지를 위해 세션 스토리지에 저장
        sessionStorage.setItem(notificationKey, "true");
      }
    }
  };

  return (
    <Card
      className={cn(
        "mb-6 transition-all duration-300",
        barrierInfo.isBarrierActive ? "border-primary" : ""
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield
              className={cn(
                "transition-colors",
                barrierInfo.isBarrierActive ? "text-primary" : "text-muted-foreground"
              )}
            />
            <div>
              <h3 className="font-medium">결계 알림</h3>
              <p className="text-sm text-muted-foreground">
                {barrierInfo.isBarrierActive ? (
                  <span className="text-primary font-semibold">
                    결계가 활성화되었습니다! (15분 유효)
                  </span>
                ) : (
                  `다음 결계까지 ${barrierInfo.timeUntilNextBarrier}`
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {barrierAlarmEnabled ? (
              <Bell className="h-4 w-4 text-primary" />
            ) : (
              <BellOff className="h-4 w-4 text-muted-foreground" />
            )}
            <Switch
              checked={barrierAlarmEnabled}
              onCheckedChange={toggleBarrierAlarm}
              aria-label="결계 알림 설정"
            />
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          결계 생성 시간: {BARRIER_HOURS.map((h) => `${h}시`).join(", ")}
        </div>

        {barrierInfo.isBarrierActive && (
          <div
            className={cn(
              "mt-2 p-2 rounded text-sm bg-primary/10 border border-primary/20 text-primary",
              "animate-pulse"
            )}
          >
            {barrierInfo.currentBarrierHour}시 결계가 활성화되었습니다!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
