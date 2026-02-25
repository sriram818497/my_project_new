export type JobStatus = "draft" | "published" | "archived";

export interface RecruitmentJob {
  id: string;
  jobCode?: string;
  title: string;
  department: string;
  location: string;
  type: string;
  education?: string;
  experience?: string;
  skills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  postedDate?: string;
  applicationDeadline?: string;
  walkIn?: boolean;
  roleOverview: string;
  aboutRole: string;
  responsibilities?: string[];
  qualifications?: string[];
  desiredSkills?: string[];
  status: JobStatus;
  isFeatured?: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
