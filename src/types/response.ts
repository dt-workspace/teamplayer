// src/types/response.ts
export type ControllerResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string };