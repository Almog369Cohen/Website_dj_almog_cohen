/**
 * טעינה שלא דורסת שמירה: תשובה שהתחילה לפני שמירה עלולה להחזיר את המצב הישן.
 * ברקע: מוותרים (null) ומרעננים בפעם הבאה. בטעינה רגילה: מחכים שהשמירות יסתיימו וטוענים שוב.
 */
export async function freshLoad<T>(o: { loadAll(): Promise<T>; waitWrites(): Promise<unknown>; seq(): number; pending(): number; background: boolean; tries?: number }): Promise<T | null> {
  for (let i = 0; i < (o.tries ?? 4); i++) {
    await o.waitWrites();
    const seq = o.seq();
    const got = await o.loadAll();
    if (!o.pending() && seq === o.seq()) return got;
    if (o.background) return null;
  }
  return null;
}
