export function track(eventName: string, metadata?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "development") {
    console.log("[track]", eventName, metadata ?? "");
  }
}
