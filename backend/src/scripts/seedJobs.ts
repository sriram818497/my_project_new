import type { JobStatus } from "@prisma/client";
import { prisma } from "../config/prisma";

type SeedJob = {
  id: string;
  jobCode?: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience?: string;
  applicationDeadline?: string;
  walkIn?: boolean;
  roleOverview: string;
  aboutRole: string;
  responsibilities: string[];
  qualifications: string[];
  desiredSkills: string[];
  status: JobStatus;
  isFeatured?: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

const toDateOnly = (value?: string) => (value ? new Date(`${value}T00:00:00.000Z`) : null);

const jobsSeed: SeedJob[] = [
  {
    id: "sales-manager",
    title: "Key Account / Senior Sales Account Manager (B2B)",
    department: "Sales",
    location: "Hyderabad / Remote",
    type: "Full-time",
    experience: "5-12 years",
    applicationDeadline: "2026-02-28",
    walkIn: false,
    roleOverview:
      "Proteccio Data is looking for a driven and results-oriented Senior Sales Account Manager to grow our B2B business.",
    aboutRole:
      "Own full-cycle enterprise sales, from outbound lead generation to commercial closure and relationship expansion.",
    responsibilities: [
      "Identify and pursue new business opportunities in B2B privacy and governance.",
      "Manage the full sales cycle from discovery to close.",
      "Collaborate with product and marketing to align solution messaging.",
    ],
    qualifications: [
      "5-12 years of B2B SaaS or technology sales experience.",
      "Proven track record of meeting or exceeding revenue targets.",
      "Strong communication and negotiation skills.",
    ],
    desiredSkills: [
      "Experience with CRM tools such as Salesforce or HubSpot.",
      "Knowledge of GDPR, CCPA, or similar privacy regulations.",
    ],
    status: "published",
    isFeatured: true,
    publishedAt: "2026-02-01T08:00:00.000Z",
    createdAt: "2026-01-28T10:00:00.000Z",
    updatedAt: "2026-02-01T08:00:00.000Z",
  },
  {
    id: "bd-intern",
    title: "Business Development Intern",
    department: "Growth",
    location: "Remote",
    type: "Internship",
    experience: "0-1 years",
    applicationDeadline: "2026-03-15",
    walkIn: false,
    roleOverview:
      "Support sales operations, prospecting, and outreach execution while learning B2B privacy-tech go-to-market.",
    aboutRole:
      "Assist with lead qualification, campaign support, and documentation for sales and customer conversations.",
    responsibilities: [
      "Conduct market research and identify prospects.",
      "Support outreach and follow-up campaigns.",
      "Maintain CRM hygiene and pipeline updates.",
    ],
    qualifications: [
      "Strong written and verbal communication.",
      "Interest in B2B sales and compliance technology.",
      "Ability to work independently in a remote setup.",
    ],
    desiredSkills: [
      "Familiarity with CRM tools.",
      "Basic understanding of privacy/compliance domain.",
    ],
    status: "published",
    publishedAt: "2026-02-03T08:00:00.000Z",
    createdAt: "2026-01-30T10:00:00.000Z",
    updatedAt: "2026-02-03T08:00:00.000Z",
  },
  {
    id: "marketing-specialist",
    title: "Digital Marketing Specialist",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    experience: "2-5 years",
    applicationDeadline: "2026-03-20",
    walkIn: false,
    roleOverview:
      "Lead digital growth programs across content, paid channels, and lifecycle campaigns for privacy-tech offerings.",
    aboutRole:
      "Execute multi-channel campaigns, analyze outcomes, and continuously optimize conversion and engagement performance.",
    responsibilities: [
      "Run and optimize paid campaigns.",
      "Develop high-quality content and social distribution.",
      "Track campaign metrics and produce actionable insights.",
    ],
    qualifications: [
      "2-5 years of digital marketing experience.",
      "Hands-on SEO/SEM and analytics familiarity.",
      "Strong content and communication skills.",
    ],
    desiredSkills: [
      "Experience with marketing automation platforms.",
      "Exposure to B2B SaaS or privacy/compliance markets.",
    ],
    status: "published",
    publishedAt: "2026-02-05T08:00:00.000Z",
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-02-05T08:00:00.000Z",
  },
  {
    id: "compliance-analyst",
    title: "Data Compliance Analyst",
    department: "Legal",
    location: "Hyderabad",
    type: "Full-time",
    experience: "3-6 years",
    applicationDeadline: "2026-03-10",
    walkIn: true,
    roleOverview:
      "Support privacy governance and compliance execution across global regulatory frameworks and internal controls.",
    aboutRole:
      "Drive DPIA support, policy alignment, and audit readiness with legal and engineering stakeholders.",
    responsibilities: [
      "Monitor compliance with major privacy regulations.",
      "Assist with DPIAs and privacy control assessments.",
      "Maintain key governance documentation such as ROPA.",
    ],
    qualifications: [
      "3-6 years in privacy/compliance or legal operations.",
      "Working knowledge of GDPR/CCPA and related frameworks.",
      "Strong analytical and documentation skills.",
    ],
    desiredSkills: [
      "Privacy certifications are a plus.",
      "Experience collaborating with technical teams.",
    ],
    status: "published",
    publishedAt: "2026-02-08T08:00:00.000Z",
    createdAt: "2026-02-02T10:00:00.000Z",
    updatedAt: "2026-02-08T08:00:00.000Z",
  },
];

const run = async () => {
  for (const job of jobsSeed) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: {
        jobCode: job.jobCode ?? null,
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        experience: job.experience ?? null,
        applicationDeadline: toDateOnly(job.applicationDeadline),
        walkIn: job.walkIn ?? false,
        roleOverview: job.roleOverview,
        aboutRole: job.aboutRole,
        responsibilities: job.responsibilities,
        qualifications: job.qualifications,
        desiredSkills: job.desiredSkills,
        status: job.status,
        isFeatured: job.isFeatured ?? false,
        publishedAt: job.publishedAt ? new Date(job.publishedAt) : null,
        updatedAt: new Date(),
      },
      create: {
        id: job.id,
        jobCode: job.jobCode ?? null,
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        experience: job.experience ?? null,
        skills: [],
        salaryMin: null,
        salaryMax: null,
        postedDate: toDateOnly(job.createdAt.slice(0, 10)),
        applicationDeadline: toDateOnly(job.applicationDeadline),
        walkIn: job.walkIn ?? false,
        roleOverview: job.roleOverview,
        aboutRole: job.aboutRole,
        responsibilities: job.responsibilities,
        qualifications: job.qualifications,
        desiredSkills: job.desiredSkills,
        status: job.status,
        isFeatured: job.isFeatured ?? false,
        publishedAt: job.publishedAt ? new Date(job.publishedAt) : null,
        createdAt: new Date(job.createdAt),
        updatedAt: new Date(job.updatedAt),
      },
    });
  }

  console.log(`Jobs seeded successfully: ${jobsSeed.length}`);
};

run()
  .catch((error) => {
    console.error("Failed to seed jobs:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
