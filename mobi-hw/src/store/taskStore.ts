import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DAILY_CATEGORIES,
  WEEKLY_CATEGORIES,
  DEFAULT_DAILY_CATEGORY,
  DEFAULT_WEEKLY_CATEGORY,
} from "@/lib/constants";

// 작업 유형 정의 확장
export interface Task {
  id: string;
  name: string;
  category?: string;
  icon?: string;
  count?: number; // 필요한 총 반복 횟수
  currentCount?: number; // 현재 완료한 횟수
}

// 캐릭터 유형 정의 - dailyTaskCounts와 weeklyTaskCounts 추가
export interface Character {
  id: string;
  name: string;
  dailyTaskItems: Task[];
  weeklyTaskItems: Task[];
  dailyTasks: Record<string, boolean>;
  weeklyTasks: Record<string, boolean>;
  dailyTaskCounts: Record<string, number>; // 작업별 카운트 저장
  weeklyTaskCounts: Record<string, number>; // 작업별 카운트 저장
}

interface TasksState {
  // 캐릭터 관련 상태
  characters: Character[];
  selectedCharacterId: string | null;

  // 캐릭터 관리 함수
  addCharacter: (name: string) => void;
  selectCharacter: (id: string) => void;
  editCharacter: (id: string, name: string) => void;
  deleteCharacter: (id: string) => void;

  // 현재 선택된 캐릭터의 작업 관리
  toggleDailyTask: (taskId: string) => void;
  toggleWeeklyTask: (taskId: string) => void;
  resetDailyTasks: (characterId?: string) => void;
  resetWeeklyTasks: (characterId?: string) => void;
  checkAndResetTasks: () => void;

  // 작업 관리 함수
  addDailyTask: (name: string, category?: string, count?: number) => void;
  addWeeklyTask: (name: string, category?: string) => void;
  editDailyTask: (id: string, name: string, category?: string) => void;
  editWeeklyTask: (id: string, name: string) => void;
  deleteDailyTask: (id: string) => void;
  deleteWeeklyTask: (id: string) => void;

  // 카운트 관련 함수 추가
  incrementTaskCount: (taskId: string, isWeekly?: boolean) => void;
  decrementTaskCount: (taskId: string, isWeekly?: boolean) => void;
  resetTaskCount: (taskId: string, isWeekly?: boolean) => void;
}

// 기본 작업 목록 수정 - count 필드 추가
const defaultDailyTasks: Task[] = [
  {
    id: "black_hole",
    name: "검은 구멍",
    category: DAILY_CATEGORIES[0],
    icon: "dungeon",
    count: 3, // 필요한 반복 횟수
  },
  {
    id: "barrier",
    name: "결계",
    category: DAILY_CATEGORIES[0],
    icon: "dungeon",
    count: 2, // 필요한 반복 횟수
  },
  { id: "daily_dungeon", name: "요일 던전", category: DAILY_CATEGORIES[0], icon: "dungeon" },
  {
    id: "phantom_tower",
    name: "망령의 탑",
    category: DAILY_CATEGORIES[0],
    icon: "dungeon",
    count: 5,
  },
  { id: "part_time", name: "아르바이트", category: DAILY_CATEGORIES[2], icon: "gold" }, // "일반"
  { id: "cash_shop_free", name: "무료 물품", category: DAILY_CATEGORIES[1], icon: "shop" }, // "캐쉬 샵"
  { id: "cash_shop_deca", name: "데카 은화", category: DAILY_CATEGORIES[1], icon: "shop" }, // "캐쉬 샵"
  { id: "cash_shop_gold", name: "골드 보석함", category: DAILY_CATEGORIES[1], icon: "shop" }, // "캐쉬 샵"
];

const defaultWeeklyTasks: Task[] = [
  { id: "glas_gibnen", name: "글라스 기브넨", category: WEEKLY_CATEGORIES[0], icon: "dungeon" }, // "레이드"
  { id: "abyss_ruins", name: "가라앉은 유적", category: WEEKLY_CATEGORIES[1], icon: "dungeon" }, // "어비스"
  { id: "abyss_altar", name: "무너진 제단", category: WEEKLY_CATEGORIES[1], icon: "dungeon" }, // "어비스"
  { id: "abyss_hall", name: "파멸의 전당", category: WEEKLY_CATEGORIES[1], icon: "dungeon" }, // "어비스"
  { id: "weekly_boss_peri", name: "페리", category: WEEKLY_CATEGORIES[2], icon: "boss" }, // "주간 보스"
  { id: "weekly_boss_krav", name: "크라브바흐", category: WEEKLY_CATEGORIES[2], icon: "boss" }, // "주간 보스"
  { id: "weekly_boss_krama", name: "크라마", category: WEEKLY_CATEGORIES[2], icon: "boss" }, // "주간 보스"
  { id: "cash_shop_weekly", name: "데카 곡물", category: WEEKLY_CATEGORIES[3], icon: "shop" }, // "캐쉬 샵"
  { id: "demon_badge", name: "마족의 증표", category: WEEKLY_CATEGORIES[4], icon: "exchange" }, // "교환"
  { id: "food_material", name: "음식 재료", category: WEEKLY_CATEGORIES[4], icon: "exchange" }, // "교환"
];

// UUID 생성 함수
const generateId = () => Math.random().toString(36).substring(2, 11);

// 기본 캐릭터 생성 함수 수정
const createDefaultCharacter = (name: string): Character => {
  // 기본 task들의 초기 카운트 값 생성
  const initialDailyCounts: Record<string, number> = {};
  const initialWeeklyCounts: Record<string, number> = {};

  defaultDailyTasks.forEach((task) => {
    if (task.count) initialDailyCounts[task.id] = 0;
  });

  defaultWeeklyTasks.forEach((task) => {
    if (task.count) initialWeeklyCounts[task.id] = 0;
  });

  return {
    id: generateId(),
    name,
    dailyTaskItems: [...defaultDailyTasks],
    weeklyTaskItems: [...defaultWeeklyTasks],
    dailyTasks: {},
    weeklyTasks: {},
    dailyTaskCounts: initialDailyCounts,
    weeklyTaskCounts: initialWeeklyCounts,
  };
};

export const useTaskStore = create<TasksState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      characters: [],
      selectedCharacterId: null,

      // 캐릭터 관리
      addCharacter: (name: string) =>
        set((state) => {
          const newCharacter = createDefaultCharacter(name);
          const characters = [...state.characters, newCharacter];
          return {
            characters,
            // 첫 캐릭터면 자동 선택
            selectedCharacterId:
              state.selectedCharacterId === null ? newCharacter.id : state.selectedCharacterId,
          };
        }),

      selectCharacter: (id: string) => set({ selectedCharacterId: id }),

      editCharacter: (id: string, name: string) =>
        set((state) => ({
          characters: state.characters.map((char) => (char.id === id ? { ...char, name } : char)),
        })),

      deleteCharacter: (id: string) =>
        set((state) => {
          const newCharacters = state.characters.filter((char) => char.id !== id);

          // 선택된 캐릭터가 삭제되는 경우 다른 캐릭터 선택
          let selectedId = state.selectedCharacterId;
          if (id === selectedId) {
            selectedId = newCharacters.length > 0 ? newCharacters[0].id : null;
          }

          return {
            characters: newCharacters,
            selectedCharacterId: selectedId,
          };
        }),

      // 작업 토글 함수
      toggleDailyTask: (taskId: string) =>
        set((state) => {
          if (!state.selectedCharacterId) return state;

          return {
            characters: state.characters.map((char) =>
              char.id === state.selectedCharacterId
                ? {
                    ...char,
                    dailyTasks: {
                      ...char.dailyTasks,
                      [taskId]: !char.dailyTasks[taskId],
                    },
                  }
                : char
            ),
          };
        }),

      toggleWeeklyTask: (taskId: string) =>
        set((state) => {
          if (!state.selectedCharacterId) return state;

          return {
            characters: state.characters.map((char) =>
              char.id === state.selectedCharacterId
                ? {
                    ...char,
                    weeklyTasks: {
                      ...char.weeklyTasks,
                      [taskId]: !char.weeklyTasks[taskId],
                    },
                  }
                : char
            ),
          };
        }),

      // 초기화 함수 수정 - 카운트도 리셋
      resetDailyTasks: (characterId) =>
        set((state) => {
          const targetId = characterId || state.selectedCharacterId;
          if (!targetId) return state;

          return {
            characters: state.characters.map((char) =>
              char.id === targetId ? { ...char, dailyTasks: {}, dailyTaskCounts: {} } : char
            ),
          };
        }),

      resetWeeklyTasks: (characterId) =>
        set((state) => {
          const targetId = characterId || state.selectedCharacterId;
          if (!targetId) return state;

          return {
            characters: state.characters.map((char) =>
              char.id === targetId ? { ...char, weeklyTasks: {}, weeklyTaskCounts: {} } : char
            ),
          };
        }),

      // 초기화 확인 함수
      checkAndResetTasks: () => {
        const now = new Date();
        const characters = get().characters;

        if (characters.length === 0) return;

        // 일일 초기화 로직 (매일 오전 6시)
        const lastDailyReset = localStorage.getItem("dailyTasksResetTime");
        const dailyResetTime = new Date();
        dailyResetTime.setHours(6, 0, 0, 0); // 오늘 새벽 6시

        if (now < dailyResetTime) {
          dailyResetTime.setDate(dailyResetTime.getDate() - 1); // 어제 새벽 6시
        }

        if (!lastDailyReset || new Date(lastDailyReset) < dailyResetTime) {
          localStorage.setItem("dailyTasksResetTime", now.toISOString());
          // 모든 캐릭터의 일일 숙제 초기화
          characters.forEach((char) => {
            get().resetDailyTasks(char.id);
          });
        }

        // 주간 초기화 로직 (매주 월요일 새벽 6시)
        const lastWeeklyReset = localStorage.getItem("weeklyTasksResetTime");
        const weeklyResetTime = new Date();
        weeklyResetTime.setDate(weeklyResetTime.getDate() - weeklyResetTime.getDay() + 1); // 이번주 월요일
        weeklyResetTime.setHours(6, 0, 0, 0); // 월요일 새벽 6시

        if (!lastWeeklyReset || new Date(lastWeeklyReset) < weeklyResetTime) {
          localStorage.setItem("weeklyTasksResetTime", now.toISOString());
          // 모든 캐릭터의 주간 숙제 초기화
          characters.forEach((char) => {
            get().resetWeeklyTasks(char.id);
          });
        }
      },

      // 작업 관리 함수
      addDailyTask: (name: string, category?: string, count?: number) =>
        set((state) => {
          if (!state.selectedCharacterId) return state;

          const newTask = {
            id: generateId(),
            name,
            category: category || DEFAULT_DAILY_CATEGORY,
            count, // count 추가
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.selectedCharacterId
                ? {
                    ...char,
                    dailyTaskItems: [...char.dailyTaskItems, newTask],
                    dailyTaskCounts: {
                      ...char.dailyTaskCounts,
                      [newTask.id]: 0, // 카운트 초기화
                    },
                  }
                : char
            ),
          };
        }),

      addWeeklyTask: (name: string, category?: string) =>
        set((state) => {
          if (!state.selectedCharacterId) return state;

          const newTask = {
            id: generateId(),
            name,
            category: category || DEFAULT_WEEKLY_CATEGORY, // 기본 카테고리 사용
          };

          return {
            characters: state.characters.map((char) =>
              char.id === state.selectedCharacterId
                ? { ...char, weeklyTaskItems: [...char.weeklyTaskItems, newTask] }
                : char
            ),
          };
        }),

      editDailyTask: (id: string, name: string, category?: string) =>
        set((state) => {
          if (!state.selectedCharacterId) return state;

          return {
            characters: state.characters.map((char) =>
              char.id === state.selectedCharacterId
                ? {
                    ...char,
                    dailyTaskItems: char.dailyTaskItems.map((task) =>
                      task.id === id ? { ...task, name, ...(category && { category }) } : task
                    ),
                  }
                : char
            ),
          };
        }),

      editWeeklyTask: (id: string, name: string) =>
        set((state) => {
          if (!state.selectedCharacterId) return state;

          return {
            characters: state.characters.map((char) =>
              char.id === state.selectedCharacterId
                ? {
                    ...char,
                    weeklyTaskItems: char.weeklyTaskItems.map((task) =>
                      task.id === id ? { ...task, name } : task
                    ),
                  }
                : char
            ),
          };
        }),

      deleteDailyTask: (id: string) =>
        set((state) => {
          if (!state.selectedCharacterId) return state;

          const selectedChar = state.characters.find(
            (char) => char.id === state.selectedCharacterId
          );
          if (!selectedChar) return state;

          const newDailyTasks = { ...selectedChar.dailyTasks };
          delete newDailyTasks[id];

          return {
            characters: state.characters.map((char) =>
              char.id === state.selectedCharacterId
                ? {
                    ...char,
                    dailyTaskItems: char.dailyTaskItems.filter((task) => task.id !== id),
                    dailyTasks: newDailyTasks,
                  }
                : char
            ),
          };
        }),

      deleteWeeklyTask: (id: string) =>
        set((state) => {
          if (!state.selectedCharacterId) return state;

          const selectedChar = state.characters.find(
            (char) => char.id === state.selectedCharacterId
          );
          if (!selectedChar) return state;

          const newWeeklyTasks = { ...selectedChar.weeklyTasks };
          delete newWeeklyTasks[id];

          return {
            characters: state.characters.map((char) =>
              char.id === state.selectedCharacterId
                ? {
                    ...char,
                    weeklyTaskItems: char.weeklyTaskItems.filter((task) => task.id !== id),
                    weeklyTasks: newWeeklyTasks,
                  }
                : char
            ),
          };
        }),

      // 작업 카운트 증가
      incrementTaskCount: (taskId: string, isWeekly = false) =>
        set((state) => {
          if (!state.selectedCharacterId) return state;
          const selectedChar = state.characters.find(
            (char) => char.id === state.selectedCharacterId
          );
          if (!selectedChar) return state;

          const taskList = isWeekly ? selectedChar.weeklyTaskItems : selectedChar.dailyTaskItems;
          const taskItem = taskList.find((task) => task.id === taskId);
          const maxCount = taskItem?.count || 1;

          const countField = isWeekly ? "weeklyTaskCounts" : "dailyTaskCounts";
          const currentCount = selectedChar[countField][taskId] || 0;

          // 최대 카운트에 도달했는지 확인
          if (currentCount >= maxCount) return state;

          // 카운트 증가
          const newCount = currentCount + 1;

          // 최대 카운트에 도달하면 완료로 표시
          const tasksField = isWeekly ? "weeklyTasks" : "dailyTasks";
          const isCompleted = newCount >= maxCount;

          return {
            characters: state.characters.map((char) =>
              char.id === state.selectedCharacterId
                ? {
                    ...char,
                    [countField]: {
                      ...char[countField],
                      [taskId]: newCount,
                    },
                    [tasksField]: {
                      ...char[tasksField],
                      [taskId]: isCompleted,
                    },
                  }
                : char
            ),
          };
        }),

      // 작업 카운트 감소
      decrementTaskCount: (taskId: string, isWeekly = false) =>
        set((state) => {
          if (!state.selectedCharacterId) return state;
          const selectedChar = state.characters.find(
            (char) => char.id === state.selectedCharacterId
          );
          if (!selectedChar) return state;

          const countField = isWeekly ? "weeklyTaskCounts" : "dailyTaskCounts";
          const currentCount = selectedChar[countField][taskId] || 0;

          // 0보다 작아질 수 없음
          if (currentCount <= 0) return state;

          // 카운트 감소
          const newCount = currentCount - 1;

          // 완료 상태 업데이트
          const taskList = isWeekly ? selectedChar.weeklyTaskItems : selectedChar.dailyTaskItems;
          const taskItem = taskList.find((task) => task.id === taskId);
          const maxCount = taskItem?.count || 1;
          const tasksField = isWeekly ? "weeklyTasks" : "dailyTasks";

          return {
            characters: state.characters.map((char) =>
              char.id === state.selectedCharacterId
                ? {
                    ...char,
                    [countField]: {
                      ...char[countField],
                      [taskId]: newCount,
                    },
                    [tasksField]: {
                      ...char[tasksField],
                      [taskId]: newCount >= maxCount,
                    },
                  }
                : char
            ),
          };
        }),

      // 작업 카운트 리셋
      resetTaskCount: (taskId: string, isWeekly = false) =>
        set((state) => {
          if (!state.selectedCharacterId) return state;

          const countField = isWeekly ? "weeklyTaskCounts" : "dailyTaskCounts";
          const tasksField = isWeekly ? "weeklyTasks" : "dailyTasks";

          return {
            characters: state.characters.map((char) =>
              char.id === state.selectedCharacterId
                ? {
                    ...char,
                    [countField]: {
                      ...char[countField],
                      [taskId]: 0,
                    },
                    [tasksField]: {
                      ...char[tasksField],
                      [taskId]: false,
                    },
                  }
                : char
            ),
          };
        }),
    }),
    {
      name: "mobi-tasks-storage",
      partialize: (state) => ({
        characters: state.characters,
        selectedCharacterId: state.selectedCharacterId,
      }),
    }
  )
);
