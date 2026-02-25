export type AttendanceStatus = "registered" | "attended" | "missed";

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  fullName: string;
  email: string;
  currentRole: string;
  organization: string;
  originCity: string;
  contact?: string;
  consent: boolean;
  registeredAt: string;
  attendanceStatus: AttendanceStatus;
  attendanceUpdatedAt?: string;
}

