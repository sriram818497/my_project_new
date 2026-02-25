export type RightsRequestStatus = "pending" | "in_progress" | "completed";

export interface RightsRequestPayload {
  requestType: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  relationship: string;
  complaintReason: string;
  complaintReasonOther: string;
  complaintTarget: string;
  complaintTargetOther: string;
  accessExplanation: string;
  grievanceExplanation: string;
  correctionType: string;
  nomineeRelationship: string;
  nomineeName: string;
  nomineeEstablishment: string;
  consents: {
    accuracy: boolean;
    verification: boolean;
  };
}

export interface RightsRequestRecord extends RightsRequestPayload {
  id: string;
  createdAt: string;
  status: RightsRequestStatus;
}

