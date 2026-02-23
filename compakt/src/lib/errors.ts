export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code = "UNKNOWN", statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function captureError(error: unknown, context?: Record<string, unknown>) {
  const msg = error instanceof Error ? error.message : String(error);
  console.error("[error]", msg, context ?? "");
}
