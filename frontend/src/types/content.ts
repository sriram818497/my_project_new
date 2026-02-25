export type EventStatus = "Upcoming" | "Ongoing";

export interface EventContent {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  image: string;
  description: string;
  featured?: boolean;
  status: EventStatus;
}

export type EventDetailStatus = EventStatus | "Early Bird" | "Closing Soon" | "Live Now";

export interface EventDetailSimpleItem {
  title: string;
  description: string;
}

export interface EventDetailAgendaItem {
  time: string;
  title: string;
  description: string;
}

export interface EventDetailSpeakerItem {
  name: string;
  designation: string;
  company: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
}

export interface EventDetailFaqItem {
  question: string;
  answer: string;
}

export interface EventDetailContent {
  status?: EventDetailStatus;
  time?: string;
  hostedBy?: string;
  hostImage?: string;
  countdownDate?: string;
  capacity?: string;
  level?: string;
  access?: string;
  aboutText?: string;
  aboutPurpose?: string;
  aboutUseCases?: string[];
  aboutImportance?: string;
  whyTrends?: string[];
  whyRegulatory?: string;
  whoShouldAttend?: EventDetailSimpleItem[];
  benefits?: EventDetailSimpleItem[];
  agenda?: EventDetailAgendaItem[];
  speakers?: EventDetailSpeakerItem[];
  faqs?: EventDetailFaqItem[];
}

export interface InsightCapability {
  id: string;
  title: string;
  desc: string;
}

export interface InsightExpertise {
  id: string;
  title: string;
  content: string;
}

export interface InsightArticle {
  id: string;
  category: string;
  image: string;
  title: string;
  date: string;
}

export interface CaseStudyTimelineItem {
  phase: string;
  title: string;
  duration: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  author: string;
  role: string;
}

export type CaseStudyAssetType = "Case Study" | "Whitepaper" | "Success Story";

export interface CaseStudyContent {
  id: string;
  industry: string;
  regulation: string;
  solutionType: string;
  assetType: CaseStudyAssetType;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  overview: string;
  challenges: string[];
  solution_detail: string[];
  outcomes: string[];
  testimonial?: CaseStudyTestimonial;
  timeline?: CaseStudyTimelineItem[];
  certifications?: string[];
}

export type PartnerIconKey =
  | "target"
  | "shield"
  | "rocket"
  | "globe"
  | "zap"
  | "heart";

export interface PartnerHighlightItem {
  id: string;
  title: string;
  desc: string;
  icon: PartnerIconKey;
}

export interface PartnerLogoItem {
  id: string;
  name: string;
  url: string;
}

export interface PartnerTierItem {
  id: string;
  title: string;
  desc: string;
  logos: PartnerLogoItem[];
}

export interface PartnerStepItem {
  id: string;
  num: string;
  title: string;
  desc: string;
}

export interface PartnersPageContent {
  heroBadge: string;
  heroTitle: string;
  heroPrimaryButton: string;
  heroSecondaryButton: string;
  whyPartnerTitle: string;
  whyPartnerItems: PartnerHighlightItem[];
  whyProteccioTitle: string;
  whyProteccioItems: PartnerHighlightItem[];
  waysToPartnerTitle: string;
  partnerTiers: PartnerTierItem[];
  becomePartnerTitle: string;
  becomePartnerSteps: PartnerStepItem[];
  formCompanySizeOptions: string[];
  formDefaultCountry: string;
  formSubmitButton: string;
  formSuccessMessage: string;
  supportTitle: string;
  supportEmail: string;
}
