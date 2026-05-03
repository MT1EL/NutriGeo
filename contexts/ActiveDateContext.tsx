import { todayISO } from "@/utils/date";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ActiveDateApi = {
  date: string; // ISO YYYY-MM-DD
  isToday: boolean;
  setDate: (next: string) => void;
  goToday: () => void;
};

const ActiveDateContext = createContext<ActiveDateApi | null>(null);

export function ActiveDateProvider({ children }: { children: ReactNode }) {
  const [date, setDateState] = useState<string>(() => todayISO());

  const setDate = useCallback((next: string) => {
    setDateState(next);
  }, []);

  const goToday = useCallback(() => setDateState(todayISO()), []);

  const value = useMemo<ActiveDateApi>(
    () => ({
      date,
      isToday: date === todayISO(),
      setDate,
      goToday,
    }),
    [date, setDate, goToday],
  );

  return (
    <ActiveDateContext.Provider value={value}>
      {children}
    </ActiveDateContext.Provider>
  );
}

export function useActiveDate(): ActiveDateApi {
  const ctx = useContext(ActiveDateContext);
  if (!ctx) {
    throw new Error("useActiveDate must be used inside <ActiveDateProvider>");
  }
  return ctx;
}
