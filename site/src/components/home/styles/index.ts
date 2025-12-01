/**
 * 5 סגנונות UI לדף הבית
 * 
 * שימוש:
 * import { HomeMinimal, HomeGlass, HomeBrutalist, HomeNeon, HomeElegant } from "@/components/home/styles";
 * 
 * או:
 * import { homeStyles } from "@/components/home/styles";
 * const CurrentStyle = homeStyles.minimal;
 */

export { HomeMinimal } from "./HomeMinimal";
export { HomeGlass } from "./HomeGlass";
export { HomeBrutalist } from "./HomeBrutalist";
export { HomeNeon } from "./HomeNeon";
export { HomeElegant } from "./HomeElegant";
export { HomeBridalGlass } from "./HomeBridalGlass";

// Object for easy switching
export const homeStyles = {
  minimal: () => import("./HomeMinimal").then(m => m.HomeMinimal),
  glass: () => import("./HomeGlass").then(m => m.HomeGlass),
  brutalist: () => import("./HomeBrutalist").then(m => m.HomeBrutalist),
  neon: () => import("./HomeNeon").then(m => m.HomeNeon),
  elegant: () => import("./HomeElegant").then(m => m.HomeElegant),
};

export type HomeStyleName = keyof typeof homeStyles;
