export type CommunicationPreferenceStatus = "subscribed" | "unsubscribed";
export type CommunicationPreferenceSource =
  | "preference_center"
  | "admin_console"
  | "unsubscribe_link"
  | "imported";

export interface CommunicationPreferences {
  newsletters: boolean;
  productUpdates: boolean;
  promotionalOffers: boolean;
}

export interface CommunicationPreferenceRecord {
  id: string;
  fullName: string;
  email: string;
  preferences: CommunicationPreferences;
  status: CommunicationPreferenceStatus;
  source: CommunicationPreferenceSource;
  consentCapturedAt: string;
  lastUpdated: string;
  lastUpdatedBy: string;
}

export interface CommunicationPreferenceInput {
  fullName: string;
  email: string;
  preferences: CommunicationPreferences;
}

