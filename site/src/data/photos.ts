// Curated photo set for the new site. Files live in site/public/assets/photos/.
// Web-optimized (max 2400px long edge, JPEG q82). Hebrew alt text for each photo.

export type Photo = { src: string; alt: string; width: number; height: number; orientation: "portrait" | "landscape" };

export const couplePhotos: Photo[] = [
  { src: "/assets/photos/couples/couple-booth-white.jpg", alt: "הזוג עם אלמוג בעמדת הדיג׳יי", width: 2400, height: 1601, orientation: "landscape" },
  { src: "/assets/photos/couples/couple-chuppah-portrait.jpg", alt: "חתן וכלה עם אלמוג ליד החופה", width: 1179, height: 2096, orientation: "portrait" },
  { src: "/assets/photos/couples/couple-booth-purple.jpg", alt: "הזוג בעמדה באורות סגולים", width: 2400, height: 1600, orientation: "landscape" },
  { src: "/assets/photos/couples/couple-chuppah-drapes.jpg", alt: "חתן וכלה עם אלמוג מתחת לחופה", width: 2400, height: 1600, orientation: "landscape" },
  { src: "/assets/photos/couples/couple-dancing-booth.jpg", alt: "הזוג רוקד ליד העמדה", width: 2400, height: 1600, orientation: "landscape" },
  { src: "/assets/photos/couples/couple-chuppah-lights.jpg", alt: "אופק ושיראל עם אלמוג ליד החופה", width: 1600, height: 1067, orientation: "landscape" },
  { src: "/assets/photos/couples/couple-daylight-pool.jpg", alt: "הזוג עם אלמוג באירוע יום", width: 1200, height: 799, orientation: "landscape" },
  { src: "/assets/photos/couples/couple-booth-laughing.jpg", alt: "הזוג צוחק עם אלמוג בעמדה", width: 2400, height: 1600, orientation: "landscape" },
  { src: "/assets/photos/couples/couple-chuppah-tall.jpg", alt: "חתן וכלה עם אלמוג, תאורת נורות", width: 1600, height: 2400, orientation: "portrait" },
];

export const weddingPhotos: Photo[] = [
  { src: "/assets/photos/weddings/crowd-umbrellas.jpg", alt: "הקהל ברחבה עם שמשיות", width: 2400, height: 1601, orientation: "landscape" },
  { src: "/assets/photos/weddings/couple-friends-booth.jpg", alt: "הזוג והחברים ליד שלט ALMOG COHEN", width: 1700, height: 1133, orientation: "landscape" },
  { src: "/assets/photos/weddings/groom-on-shoulders-wide.jpg", alt: "החתן על הכתפיים, מבט רחב", width: 1922, height: 1280, orientation: "landscape" },
  { src: "/assets/photos/weddings/entrance-sparklers.jpg", alt: "כניסת הזוג עם זיקוקים", width: 2400, height: 1601, orientation: "landscape" },
  { src: "/assets/photos/weddings/groom-on-shoulders.jpg", alt: "החתן על הכתפיים ברחבה", width: 2400, height: 1601, orientation: "landscape" },
  { src: "/assets/photos/weddings/henna-procession.jpg", alt: "תהלוכת חינה עם שמשיות", width: 2400, height: 1601, orientation: "landscape" },
  { src: "/assets/photos/weddings/couple-shoulders-almog-singing.jpg", alt: "הזוג על הכתפיים ואלמוג שר", width: 1200, height: 799, orientation: "landscape" },
];

export const atmospherePhotos: Photo[] = [
  { src: "/assets/photos/atmosphere/smoke-stage-tall.jpg", alt: "עשן ואורות סגולים על הבמה", width: 1601, height: 2400, orientation: "portrait" },
  { src: "/assets/photos/atmosphere/street-party-hand-up.jpg", alt: "אלמוג מרים יד במסיבת רחוב", width: 2400, height: 1347, orientation: "landscape" },
  { src: "/assets/photos/atmosphere/lights-crowd-colorful.jpg", alt: "אורות צבעוניים ברחבה", width: 1600, height: 1067, orientation: "landscape" },
  { src: "/assets/photos/atmosphere/booth-smoke-wide.jpg", alt: "עמדת הדיג׳יי עם עשן", width: 2400, height: 1601, orientation: "landscape" },
  { src: "/assets/photos/atmosphere/smoke-stage-wide.jpg", alt: "במה עם עשן, מבט רחב", width: 2400, height: 1601, orientation: "landscape" },
  { src: "/assets/photos/atmosphere/booth-smoke-purple.jpg", alt: "העמדה באורות סגולים ועשן", width: 1700, height: 1133, orientation: "landscape" },
  { src: "/assets/photos/atmosphere/stage-lights-crowd.jpg", alt: "תאורת במה מעל הקהל", width: 2400, height: 1601, orientation: "landscape" },
  { src: "/assets/photos/atmosphere/street-crowd.jpg", alt: "הקהל במסיבת רחוב", width: 2400, height: 1601, orientation: "landscape" },
  { src: "/assets/photos/atmosphere/outdoor-booth-night.jpg", alt: "אלמוג מאחורי העמדה בלילה", width: 2400, height: 1347, orientation: "landscape" },
];

export const almogPhotos: Photo[] = [
  { src: "/assets/photos/almog/almog-laptop-outdoor.jpg", alt: "אלמוג כהן בעמדה בחוץ", width: 1347, height: 2400, orientation: "portrait" },
  { src: "/assets/photos/almog/almog-neon-booth.jpg", alt: "אלמוג כהן ליד שלט הניאון", width: 1700, height: 1133, orientation: "landscape" },
  { src: "/assets/photos/almog/almog-arms-open-bw.jpg", alt: "אלמוג כהן מול הקהל, שחור-לבן", width: 2400, height: 1347, orientation: "landscape" },
  { src: "/assets/photos/almog/almog-arms-spread-bw-tall.jpg", alt: "אלמוג כהן, שחור-לבן", width: 1347, height: 2400, orientation: "portrait" },
  { src: "/assets/photos/almog/almog-neon-hands-head.jpg", alt: "אלמוג כהן בעמדה", width: 1700, height: 1133, orientation: "landscape" },
  { src: "/assets/photos/almog/almog-portrait-bw.jpg", alt: "פורטרט של אלמוג כהן", width: 1347, height: 2400, orientation: "portrait" },
  { src: "/assets/photos/almog/almog-cdj-hands-up.jpg", alt: "אלמוג כהן בעמדה, ידיים למעלה", width: 1600, height: 1067, orientation: "landscape" },
  { src: "/assets/photos/almog/almog-microphone.jpg", alt: "אלמוג כהן עם מיקרופון", width: 2400, height: 1347, orientation: "landscape" },
  { src: "/assets/photos/almog/almog-smiling-bw.jpg", alt: "אלמוג כהן מחייך, שחור-לבן", width: 1600, height: 1067, orientation: "landscape" },
  { src: "/assets/photos/almog/almog-arms-out-color.jpg", alt: "אלמוג כהן בעמדה", width: 1600, height: 1067, orientation: "landscape" },
];

// Suggested hero candidates (wide, high impact).
export const heroCandidates: Photo[] = [
  almogPhotos[1], // almog-neon-booth
  atmospherePhotos[4], // smoke-stage-wide
  weddingPhotos[3], // entrance-sparklers
];
