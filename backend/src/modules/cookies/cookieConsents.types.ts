export type ConsentStatus = "accepted_all" | "rejected_all" | "custom";

export interface CookieConsentRecord {
  id: string;
  ipAddress: string;
  state: string;
  country: string;
  status: ConsentStatus;
  essential: boolean;
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
  consentDate: string;
  lastUpdated: string;
  source: "banner_accept" | "banner_decline" | "preference_center";
  cookieSnapshot: Record<string, string | undefined>;
}

