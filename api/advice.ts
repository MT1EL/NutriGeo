import { api } from "./client";
import type { ApiResponse } from "./types";

export type AdviceCategory =
  | "logging"
  | "macros"
  | "hydration"
  | "weight"
  | "activity"
  | "sleep"
  | "mindset"
  | "general";

export type AdviceReasonCode =
  | "streak_milestone"
  | "low_logging"
  | "low_protein"
  | "weight_stale"
  | "kcal_high"
  | "fallback";

export type DailyAdvice = {
  id: string;
  date: string; // YYYY-MM-DD in user TZ
  text: string; // <=180 chars, localized
  category: AdviceCategory;
  reason_code: AdviceReasonCode;
  cta?: { label: string; deeplink: string };
};

// Date is optional — omit for today. Backend resolves the day through the
// user's timezone (X-Timezone header sent by the client).
export function getDailyAdvice(date?: string) {
  return api.get<ApiResponse<DailyAdvice>>("/v1/advice/daily", {
    query: date ? { date } : undefined,
  });
}
