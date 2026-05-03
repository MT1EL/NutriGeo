import { makeIdempotencyKey } from "@/utils/idempotency";
import { api } from "./client";
import type { ApiResponse, Range, WeightEntry } from "./types";

export type LogWeightInput = {
  weight_kg: number;
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
