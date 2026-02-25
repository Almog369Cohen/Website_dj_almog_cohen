export type EventType = "wedding" | "bar_mitzvah" | "private" | "corporate" | "other";

export type QuestionType =
  | "single_select"
  | "multi_select"
  | "slider"
  | "text"
  | "number"
  | "demographics";

export type SwipeAction = "like" | "dislike" | "super_like" | "unsure";

export type SongCategory = "reception" | "food" | "dancing" | "ceremony";

export type RequestType = "free_text" | "do" | "dont" | "link" | "special_moment";

export type MomentType =
  | "ceremony"
  | "ceremony_groom"
  | "ceremony_bride"
  | "glass_break"
  | "slow"
  | "ending"
  | "entrance"
  | "parents"
  | "other";

export type ThemeMode = "night" | "day";

export type PlanTier = "free" | "basic" | "pro";

export interface DJCustomLink {
  id: string;
  title: string;
  url: string;
  icon: "music" | "video" | "link" | "headphones" | "play";
}

export interface DJGalleryPhoto {
  id: string;
  url: string;
  caption?: string;
}

export interface DJProfile {
  id: string;
  email: string;
  fullName: string;
  role: string;
  plan: PlanTier;
  djSlug: string | null;
  businessName: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  accentColor: string;
  tagline: string | null;
  bio: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  websiteUrl: string | null;
  whatsappNumber: string | null;
  soundcloudUrl: string | null;
  spotifyUrl: string | null;
  youtubeUrl: string | null;
  customLinks: DJCustomLink[];
  galleryPhotos: DJGalleryPhoto[];
  reviews: any[];
  onboardingComplete: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanTier;
  status: "active" | "expired" | "cancelled";
  startedAt: string;
  expiresAt: string | null;
  couponCode: string | null;
}

export interface Coupon {
  id: string;
  code: string;
  plan: PlanTier;
  durationDays: number;
  maxUses: number | null;
  usesCount: number;
  isActive: boolean;
}

export interface PlanLimits {
  eventsPerMonth: number;
  maxQuestions: number;
  canUploadSongs: boolean;
  canBrand: boolean;
  maxUpsells: number;
  canExportPdf: boolean;
  hasAnalytics: boolean;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    eventsPerMonth: 2,
    maxQuestions: 3,
    canUploadSongs: false,
    canBrand: false,
    maxUpsells: 0,
    canExportPdf: false,
    hasAnalytics: false,
  },
  basic: {
    eventsPerMonth: 8,
    maxQuestions: 10,
    canUploadSongs: true,
    canBrand: true,
    maxUpsells: 3,
    canExportPdf: true,
    hasAnalytics: true,
  },
  pro: {
    eventsPerMonth: 20,
    maxQuestions: 999,
    canUploadSongs: true,
    canBrand: true,
    maxUpsells: 999,
    canExportPdf: true,
    hasAnalytics: true,
  },
};

export interface EventData {
  id: string;
  magicToken: string;
  eventType: EventType;
  eventDate?: string;
  venue?: string;
  city?: string;
  coupleNameA?: string;
  coupleNameB?: string;
  contactPhone?: string;
  contactRole?: string;
  currentStage: number;
  theme: ThemeMode;
  createdAt: string;
}

export interface QuestionOption {
  label: string;
  value: string;
  icon?: string;
}

export interface Question {
  id: string;
  eventType: EventType;
  eventTypes?: EventType[];
  sortOrder: number;
  questionHe: string;
  questionType: QuestionType;
  options?: QuestionOption[];
  sliderMin?: number;
  sliderMax?: number;
  sliderLabels?: string[];
  isActive: boolean;
}

export interface QuestionAnswer {
  id: string;
  eventId: string;
  questionId: string;
  answerValue: string | string[] | number;
  answeredAt: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  previewUrl?: string;
  clipStartSec?: number;
  clipEndSec?: number;
  externalLink?: string;
  category: SongCategory;
  tags: string[];
  energy: number;
  decade?: string;
  language: string;
  isSafe: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface SongSwipe {
  id: string;
  eventId: string;
  songId: string;
  action: SwipeAction;
  reasonChips: string[];
  swipedAt: string;
}

export interface EventRequest {
  id: string;
  eventId: string;
  requestType: RequestType;
  content: string;
  momentType?: MomentType;
  createdAt: string;
}

export interface Upsell {
  id: string;
  titleHe: string;
  descriptionHe: string;
  priceHint?: string;
  ctaTextHe: string;
  imageUrl?: string;
  placement: "stage_4" | "post_brief" | "inline";
  sortOrder: number;
  isActive: boolean;
}

export interface UpsellClick {
  id: string;
  eventId: string;
  upsellId: string;
  clickedAt: string;
}

export interface MusicBrief {
  event: EventData;
  answers: QuestionAnswer[];
  questions: Question[];
  swipes: SongSwipe[];
  songs: Song[];
  requests: EventRequest[];
  likedSongs: Song[];
  superLikedSongs: Song[];
  dislikedSongs: Song[];
  redLines: string[];
  crowdNotes: string[];
}
