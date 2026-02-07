export type Playlist = { 
  id: string; 
  title: string; 
  description: string;
  language: 'he' | 'en';
  moment: string;
};

export const PLAYLISTS: Playlist[] = [
  // === סלואו ===
  {
    id: "PL3ByUMR4DG0hWCn-Odz0eVTkeBCl8HzQk",
    title: "סלואו - עברית",
    description: "שירים איטיים וחמים לריקוד ראשון ורגעים רומנטיים",
    language: "he",
    moment: "סלואו"
  },
  {
    id: "PL3ByUMR4DG0huEDhXHaB5MYsJftzZvw_j",
    title: "סלואו - אנגלית",
    description: "שירים איטיים רומנטיים לריקוד ראשון",
    language: "en",
    moment: "סלואו"
  },
  
  // === כניסה לחופה ===
  {
    id: "PL3ByUMR4DG0jQ5UFSACapYJV5eszdhwj4",
    title: "כניסה לחופה - עברית",
    description: "שירים מרגשים לכניסת הכלה והורים לחופה",
    language: "he",
    moment: "כניסה לחופה"
  },
  {
    id: "PL3ByUMR4DG0gdDMm_jExmKUnXz0G1o4ei",
    title: "כניסה לחופה - אנגלית",
    description: "שירים מרגשים לכניסת הכלה והורים לחופה",
    language: "en",
    moment: "כניסה לחופה"
  },
  
  // === שבירת כוס ===
  {
    id: "PL3ByUMR4DG0iBhoT7juYuaQcDHCz4Y54P",
    title: "שבירת כוס - עברית",
    description: "שירי התחלה חזקים לרגע הפתיחה של החגיגה",
    language: "he",
    moment: "שבירת כוס"
  },
  {
    id: "PL3ByUMR4DG0hf9iQf0KFja2C_hg4flk_V",
    title: "שבירת כוס - אנגלית",
    description: "שירי התחלה חזקים לרגע הפתיחה של החגיגה",
    language: "en",
    moment: "שבירת כוס"
  },
  
  // === שיר סיום ===
  {
    id: "PL3ByUMR4DG0jgMyEgd4Q7zP2IVn237Awj",
    title: "שיר סיום - עברית",
    description: "שירי סיום מרגשים לסגירת הערב",
    language: "he",
    moment: "שיר סיום"
  },
  {
    id: "PL3ByUMR4DG0iNMHQGaUw7yvtj6ngxcY5F",
    title: "שיר סיום - אנגלית",
    description: "שירי סיום מרגשים לסגירת הערב",
    language: "en",
    moment: "שיר סיום"
  },
];
