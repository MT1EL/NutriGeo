import { makeIdempotencyKey } from "@/utils/idempotency";
import { api } from "./client";
import type { ApiResponse, Range, Units, WeightEntry } from "./types";

export type LogWeightInput = {
  // In the user's stored units. Pass `units` to disambiguate; otherwise
  // backend uses the user's stored units.
  weight: number;
  units?: Units;
  source?: "manual" | "apple_health" | "google_fit";
  logged_at?: string;
};

export function logWeight(input: LogWeightInput, idempotencyKey?: string) {
  return api.post<ApiResponse<WeightEntry>>("/v1/weight", input, {
    idempotencyKey: idempotencyKey ?? makeIdempotencyKey(),
  });
}

export function getWeightHistory(range: Range = "week") {
  return api.get<ApiResponse<WeightEntry[]>>("/v1/weight", {
    query: { range },
  });
}
