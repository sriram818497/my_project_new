export type ApplicantStage =
  | "Applied"
  | "Screening"
  | "Task Assigned"
  | "Task Submitted"
  | "Interview"
  | "Selected"
  | "Rejected";

export type ApplicantGender = "Male" | "Female" | "Non-Binary" | "Prefer not to say";

export interface ApplicantNote {
  id: string;
  text: string;
  createdAt: string;
  internal: boolean;
}

export interface TaskAssignment {
  description: string;
  fileUrl?: string;
  fileName?: string;
  assignedAt: string;
}

export interface StageHistoryEntry {
  stage: ApplicantStage;
  movedAt: string;
}

export type ApplicantStageRatings = Partial<Record<ApplicantStage, number>>;

export interface ApplicantRoundEvaluation {
  interviewerName?: string;
  internalNote?: string;
  updatedAt: string;
}

export type ApplicantRoundEvaluations = Partial<Record<ApplicantStage, ApplicantRoundEvaluation>>;

export interface ApplicantProfile {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  gender?: ApplicantGender;
  education: string;
  location: string;
  experience: string;
  skills: string[];
  resumeUrl: string;
  resumeName: string;
  stage: ApplicantStage;
  rating: number;
  stageRatings?: ApplicantStageRatings;
  roundEvaluations?: ApplicantRoundEvaluations;
  notes: ApplicantNote[];
  rejectionReason?: string;
  taskAssignment?: TaskAssignment;
  taskSubmissionUrl?: string;
  taskSubmissionName?: string;
  stageHistory: StageHistoryEntry[];
  appliedAt: string;
  updatedAt: string;
}
