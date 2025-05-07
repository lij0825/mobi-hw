import * as React from "react"; // React 가져오기 방식 변경
import {
  Shield,
  ShoppingCart,
  BriefcaseBusiness,
  MoreHorizontal,
  AlertCircle,
  Crown,
  Repeat,
} from "lucide-react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 카테고리별 아이콘 반환 함수
export function getCategoryIcon(category: string): React.ReactElement {
  // JSX.Element 대신 React.ReactElement 사용

  switch (category) {
    case "던전":
      return React.createElement(Shield, { className: "h-5 w-5" }); // JSX 대신 React.createElement 사용
    case "레이드":
      return React.createElement(Shield, { className: "h-5 w-5" });
    case "어비스":
      return React.createElement(AlertCircle, { className: "h-5 w-5" });
    case "주간 보스":
      return React.createElement(Crown, { className: "h-5 w-5" });
    case "캐쉬 샵":
      return React.createElement(ShoppingCart, { className: "h-5 w-5" });
    case "교환":
      return React.createElement(Repeat, { className: "h-5 w-5" });
    case "일반":
      return React.createElement(BriefcaseBusiness, { className: "h-5 w-5" });
    case "기타":
    default:
      return React.createElement(MoreHorizontal, { className: "h-5 w-5" });
  }
}

// 일일 초기화 시간 계산
export function calculateDailyResetTime(): { timeString: string; nextReset: Date } {
  const now = new Date();
  const nextReset = new Date();

  nextReset.setHours(6, 0, 0, 0);
  if (now >= nextReset) {
    nextReset.setDate(nextReset.getDate() + 1);
  }

  const diff = nextReset.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    timeString: `${hours}시간 ${minutes}분 ${seconds}초`,
    nextReset,
  };
}

// 주간 초기화 시간 계산
export function calculateWeeklyResetTime(): { timeString: string; nextReset: Date } {
  const now = new Date();
  const nextReset = new Date();
  const currentDay = now.getDay();

  // 다음 월요일까지 남은 일수 계산
  let daysUntilMonday;
  if (currentDay === 1) {
    // 오늘이 월요일인 경우
    const todayReset = new Date();
    todayReset.setHours(6, 0, 0, 0);

    if (now >= todayReset) {
      // 이미 오늘 초기화 시간을 지났다면, 다음 주 월요일
      daysUntilMonday = 7;
    } else {
      // 아직 오늘 초기화 시간을 지나지 않았다면, 오늘
      daysUntilMonday = 0;
    }
  } else {
    // 월요일이 아닌 경우, 다음 월요일까지 계산
    daysUntilMonday = (1 + 7 - currentDay) % 7;
  }

  // 다음 초기화 날짜 설정
  nextReset.setDate(now.getDate() + daysUntilMonday);
  nextReset.setHours(6, 0, 0, 0);

  const diff = nextReset.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    timeString: `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`,
    nextReset,
  };
}

// 결계 생성 시간 (0, 3, 6, 9, 12, 15, 18, 21시)
export const BARRIER_HOURS = [0, 3, 6, 9, 12, 15, 18, 21];

// 다음 결계 시간 계산
export function calculateBarrierTime(): {
  nextBarrierTime: Date;
  timeUntilNextBarrier: string;
  isBarrierActive: boolean;
  currentBarrierHour: number | null;
} {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // 현재 시각이 결계 시간인지 확인 (시간이 맞고, 15분 이내인 경우)
  const isBarrierHour = BARRIER_HOURS.includes(currentHour);
  const isBarrierActive = isBarrierHour && currentMinute < 15;
  const currentBarrierHour = isBarrierActive ? currentHour : null;

  // 다음 결계 시간 찾기
  let nextBarrierHour = BARRIER_HOURS.find((hour) => hour > currentHour);

  // 다음 결계 시간 계산
  const nextBarrierTime = new Date();

  // 오늘 남은 시간 중에 결계가 없으면 내일 첫 결계(0시)로 설정
  if (nextBarrierHour === undefined) {
    nextBarrierHour = 0;
    nextBarrierTime.setDate(nextBarrierTime.getDate() + 1);
  }

  nextBarrierTime.setHours(nextBarrierHour, 0, 0, 0);

  // 다음 결계까지 남은 시간 계산
  const diffMs = nextBarrierTime.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const timeUntilNextBarrier = `${diffHours}시간 ${diffMinutes}분 ${diffSeconds}초`;

  return {
    nextBarrierTime,
    timeUntilNextBarrier,
    isBarrierActive,
    currentBarrierHour,
  };
}
