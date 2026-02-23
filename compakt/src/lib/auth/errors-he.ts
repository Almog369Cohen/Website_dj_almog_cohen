const errorMap: Record<string, string> = {
  "Invalid login credentials": "אימייל או סיסמה שגויים",
  "Email not confirmed": "האימייל עדיין לא אומת — בדקו את תיבת הדואר",
  "User not found": "לא נמצא משתמש עם האימייל הזה",
  "Invalid email or password": "אימייל או סיסמה שגויים",
  "Signup requires a valid password": "הסיסמה לא תקינה",
  "Password should be at least 6 characters": "הסיסמה חייבת להיות לפחות 6 תווים",
  "User already registered": "האימייל הזה כבר רשום",
  "Email rate limit exceeded": "נשלחו יותר מדי בקשות — נסו שוב בעוד כמה דקות",
  "For security purposes, you can only request this after": "מטעמי אבטחה, אפשר לנסות שוב בעוד כמה שניות",
  "New password should be different from the old password": "הסיסמה החדשה חייבת להיות שונה מהקודמת",
  "Auth session missing!": "הסשן פג — התחברו מחדש",
  "Not supported": "הפעולה לא נתמכת במצב הנוכחי",
};

export function hebrewAuthError(error: string): string {
  for (const [key, value] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  return "שגיאה לא צפויה — נסו שוב";
}
