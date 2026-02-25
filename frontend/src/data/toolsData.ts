import React from 'react';
import {
    Zap,
    Globe,
    FileText,
    AlertTriangle,
    Search,
    Eye,
    Shield,
    Database,
    Users
} from "lucide-react";

export interface ToolQuestion {
    id: string;
    text: string;
    type?: "select" | "multiselect" | "text" | "toggle";
    options: {
        label: string;
        value: string | number;
        score?: number;
        domain?: string;
        flag?: boolean;
    }[];
}

export interface ToolResult {
    score?: number | string;
    numericScore?: number; // 0-100 for gauge
    domainBreakdown?: Record<string, number | string>;
    gaps: string[];
    interpretation: string;
    whatItMeans: string;
    bridge: string;
    visualData?: Record<string, unknown>; // For flow diagrams or maps
}

export type AnswerValue = string | number | (string | number)[];
export type Answers = Record<string, AnswerValue>;

export interface ToolConfig {
    id: string;
    name: string;
    description: string;
    problemSolved: string;
    whyPowerful: string;
    category: "must-have" | "nice-to-have";
    icon: React.ComponentType<{ className?: string }>;
    whatYouLearn: string[];
    questions: ToolQuestion[];
    calculateResult: (answers: Answers) => ToolResult;
}

const DPDP_QUESTIONS: ToolQuestion[] = [
    {
        id: "q1_visibility",
        text: "Q1. How comprehensively is personal data mapped and documented across business functions?",
        options: [
            { label: "Fully mapped and regularly updated", value: "3", score: 3 },
            { label: "Partially documented, gaps exist", value: "2", score: 2 },
            { label: "No formal documentation", value: "1", score: 1 }
        ]
    },
    {
        id: "q2_systems",
        text: "Q2. Can you identify all systems storing or processing personal data?",
        options: [
            { label: "All systems clearly identified", value: "3", score: 3 },
            { label: "Only critical systems identified", value: "2", score: 2 },
            { label: "Cannot identify systems", value: "1", score: 1 }
        ]
    },
    {
        id: "q3_governance",
        text: "Q3. Is a Data Protection Officer (or equivalent) formally designated?",
        options: [
            { label: "Yes, formally appointed and accountable", value: "3", score: 3 },
            { label: "Responsibilities shared informally", value: "2", score: 2 },
            { label: "No assigned ownership", value: "1", score: 1 }
        ]
    },
    {
        id: "q4_vendor_trigger",
        text: "Q4. Do third-party vendors process personal data on your behalf?",
        options: [
            { label: "Yes", value: "yes" },
            { label: "Not sure", value: "unsure" },
            { label: "No", value: "no" }
        ]
    },
    {
        id: "q5_vendor_contracts",
        text: "Q5. Are vendor data-protection obligations contractually documented?",
        options: [
            { label: "Yes, for all vendors", value: "3", score: 3 },
            { label: "Only key vendors", value: "2", score: 2 },
            { label: "Not documented", value: "1", score: 1 }
        ]
    },
    {
        id: "q6_incident_process",
        text: "Q6. Do you have a documented data-incident response process?",
        options: [
            { label: "Documented and tested", value: "3", score: 3 },
            { label: "Documented but untested", value: "2", score: 2 },
            { label: "No process", value: "1", score: 1 }
        ]
    },
    {
        id: "q7_breach_lead",
        text: "Q7. Is breach leadership clearly defined?",
        options: [
            { label: "Clearly defined and assigned", value: "3", score: 3 },
            { label: "Depends on situation", value: "2", score: 2 },
            { label: "Not defined", value: "1", score: 1 }
        ]
    }
];

const SCANNER_QUESTIONS: ToolQuestion[] = [
    // Domain A
    {
        id: "q1_scope_inventory",
        text: "Q1. How clearly are repositories documented and inventoried?",
        options: [
            { label: "Fully mapped and regularly updated", value: "3", score: 3 },
            { label: "Partially mapped", value: "2", score: 2 },
            { label: "No formal inventory", value: "1", score: 1 }
        ]
    },
    {
        id: "q2_scope_nested",
        text: "Q2. Are nested folders and subdirectories included in monitoring?",
        options: [
            { label: "Yes, comprehensively", value: "3", score: 3 },
            { label: "Partially", value: "2", score: 2 },
            { label: "No", value: "1", score: 1 }
        ]
    },
    // Domain B
    {
        id: "q3_sensitivity_classification",
        text: "Q3. Is sensitive or personal data identified and classified?",
        options: [
            { label: "Fully identified and classified", value: "3", score: 3 },
            { label: "Partially identified", value: "2", score: 2 },
            { label: "Not identified or unknown", value: "1", score: 1 }
        ]
    },
    {
        id: "q4_sensitivity_data_level",
        text: "Q4. What level of sensitive data is stored?",
        options: [
            { label: "Minimal personal data only", value: "3", score: 3 },
            { label: "Moderate sensitive data (financial/ID)", value: "2", score: 2 },
            { label: "Highly sensitive data (health/identity/financial)", value: "1", score: 1 }
        ]
    },
    // Domain C
    {
        id: "q5_retention_rules",
        text: "Q5. Are data retention rules formally defined?",
        options: [
            { label: "Defined and enforced automatically", value: "3", score: 3 },
            { label: "Defined but inconsistently applied", value: "2", score: 2 },
            { label: "Not defined", value: "1", score: 1 }
        ]
    },
    {
        id: "q6_retention_automation",
        text: "Q6. Are deletion workflows automated?",
        options: [
            { label: "Fully automated", value: "3", score: 3 },
            { label: "Manual but tracked", value: "2", score: 2 },
            { label: "No defined deletion process", value: "1", score: 1 }
        ]
    },
    // Domain D
    {
        id: "q7_sharing_control",
        text: "Q7. How is external file sharing controlled?",
        options: [
            { label: "Rarely shared and monitored", value: "3", score: 3 },
            { label: "Shared with limited tracking", value: "2", score: 2 },
            { label: "Frequently shared without visibility", value: "1", score: 1 }
        ]
    },
    {
        id: "q8_sharing_review",
        text: "Q8. Is external sharing reviewed or approved?",
        options: [
            { label: "Formal approval workflow exists", value: "3", score: 3 },
            { label: "Informal review only", value: "2", score: 2 },
            { label: "No review mechanism", value: "1", score: 1 }
        ]
    }
];

const RISK_QUESTIONS: ToolQuestion[] = [
    {
        id: "risk_inventory",
        text: "Q1. How comprehensively are operational privacy risks documented in a formal risk register?",
        options: [
            { label: "Fully documented and regularly updated", value: "3", score: 3 },
            { label: "Partially documented, gaps exist", value: "2", score: 2 },
            { label: "No formal risk documentation", value: "1", score: 1 }
        ]
    },
    {
        id: "risk_mapping",
        text: "Q2. Are identified risks accurately linked to specific data assets, owners, or systems?",
        options: [
            { label: "Fully mapped with clear ownership", value: "3", score: 3 },
            { label: "Informally linked, inconsistent tracking", value: "2", score: 2 },
            { label: "No clear linkage to assets/owners", value: "1", score: 1 }
        ]
    },
    {
        id: "risk_impact",
        text: "Q3. How regularly is the business and regulatory impact of data risks evaluated?",
        options: [
            { label: "Continuous or trigger-based reviews", value: "3", score: 3 },
            { label: "Annual or periodic reviews only", value: "2", score: 2 },
            { label: "No regular impact assessment", value: "1", score: 1 }
        ]
    },
    {
        id: "risk_mitigation",
        text: "Q4. What is the status of active mitigation plans for identified high-impact risks?",
        options: [
            { label: "Active, tracked plans for all critical risks", value: "3", score: 3 },
            { label: "Plans exist but inconsistent tracking", value: "2", score: 2 },
            { label: "No active mitigation plans", value: "1", score: 1 }
        ]
    },
    {
        id: "risk_ownership",
        text: "Q5. Is there clear executive-level accountability for risk closure and remediation?",
        options: [
            { label: "Formally assigned and monitored at leadership level", value: "3", score: 3 },
            { label: "Responsibilities shared informally", value: "2", score: 2 },
            { label: "No assigned ownership for risk closure", value: "1", score: 1 }
        ]
    },
    {
        id: "risk_closure",
        text: "Q6. How effectively are identified risk gaps closed within target timelines?",
        options: [
            { label: "Consistently meet closure targets", value: "3", score: 3 },
            { label: "Frequent delays in remediation", value: "2", score: 2 },
            { label: "Significant backlog or no closure tracking", value: "1", score: 1 }
        ]
    }
];

const VENDOR_QUESTIONS: ToolQuestion[] = [
    {
        id: "v_count",
        text: "Q1. How many vendors are currently monitored or active?",
        options: [
            { label: "1–50 vendors", value: "small", score: 3 },
            { label: "51–200 vendors", value: "medium", score: 2 },
            { label: "200+ vendors", value: "large", score: 1 }
        ]
    },
    {
        id: "v_criticality",
        text: "Q2. How critical are these vendors to your operations?",
        options: [
            { label: "Mission-critical dependencies", value: "high", score: 1 },
            { label: "Important but replaceable", value: "medium", score: 2 },
            { label: "Low operational dependency", value: "low", score: 3 }
        ]
    },
    {
        id: "v_posture",
        text: "Q3. Overall, how would you rate your vendors’ risk posture?",
        options: [
            { label: "Strong / Low risk", value: "low", score: 3 },
            { label: "Moderate risk", value: "moderate", score: 2 },
            { label: "Weak / High risk", value: "high", score: 1 }
        ]
    },
    {
        id: "v_data",
        text: "Q4. Do vendors handle personal, sensitive, or regulated data?",
        options: [
            { label: "Sensitive / regulated data", value: "sensitive", score: 1 },
            { label: "Minimal or indirect access", value: "minimal", score: 2 },
            { label: "No personal data access", value: "none", score: 3 }
        ]
    },
    {
        id: "v_contracts",
        text: "Q5. Are vendor contracts and data protection clauses consistently in place?",
        options: [
            { label: "Yes, across all vendors", value: "all", score: 3 },
            { label: "For most critical vendors", value: "most", score: 2 },
            { label: "Not consistently or missing", value: "none", score: 1 }
        ]
    },
    {
        id: "v_reviews",
        text: "Q6. Are vendors periodically reviewed for compliance and risk?",
        options: [
            { label: "Regular formal audits", value: "regular", score: 3 },
            { label: "Ad-hoc / Informal", value: "adhoc", score: 2 },
            { label: "No regular reviews", value: "none", score: 1 }
        ]
    },
    {
        id: "v_events",
        text: "Q7. Have vendor-related risk events occurred recently?",
        options: [
            { label: "Yes, recently ( < 6mo )", value: "recent", score: 1 },
            { label: "Older incidents recorded", value: "old", score: 2 },
            { label: "No known incidents", value: "none", score: 3 }
        ]
    },
    {
        id: "v_impact",
        text: "Q8. If a high-risk vendor issue occurs, what is the likely business impact?",
        options: [
            { label: "High business impact", value: "high", score: 1 },
            { label: "Moderate business impact", value: "moderate", score: 2 },
            { label: "Minimal / Low impact", value: "low", score: 3 }
        ]
    }
];

const MAP_QUESTIONS: ToolQuestion[] = [
    {
        id: "m_subjects",
        text: "Q1. Who are the primary individuals whose personal data you handle?",
        options: [
            { label: "Clearly defined core groups (Customers/Employees)", value: "defined", score: 3 },
            { label: "Broad or overlapping segments (Partners/Learners)", value: "broad", score: 2 },
            { label: "Uncategorized or diverse stakeholders", value: "diverse", score: 1 }
        ]
    },
    {
        id: "m_triggers",
        text: "Q2. What actions trigger personal data collection?",
        options: [
            { label: "Explicit interactions (Registration/Forms)", value: "explicit", score: 3 },
            { label: "Automated/Behavioral triggers (Cookies/Logs)", value: "automated", score: 2 },
            { label: "Third-party or batch ingestions", value: "third_party", score: 1 }
        ]
    },
    {
        id: "m_processing",
        text: "Q3. What high-level processing activities occur after data is collected?",
        options: [
            { label: "Formal workflows (Verification/Review)", value: "formal", score: 3 },
            { label: "Dynamic modifications and updates", value: "dynamic", score: 2 },
            { label: "Legacy processing or unmapped archival", value: "legacy", score: 1 }
        ]
    },
    {
        id: "m_functions",
        text: "Q4. Which internal functions or systems interact with this data?",
        options: [
            { label: "Documented primary functions (HR/Ops)", value: "primary", score: 3 },
            { label: "Cross-functional sharing across depts", value: "cross", score: 2 },
            { label: "Undocumented systems or Shadow IT", value: "shadow", score: 1 }
        ]
    },
    {
        id: "m_outcomes",
        text: "Q5. What outcomes result from this processing?",
        options: [
            { label: "Specific service delivery (Provisioning)", value: "service", score: 3 },
            { label: "Secondary use (Analytics/Marketing)", value: "secondary", score: 2 },
            { label: "Profiling or automated decision making", value: "profiling", score: 1 }
        ]
    },
    {
        id: "m_external",
        text: "Q6. Does data move outside your organization at a high level?",
        options: [
            { label: "Strictly internal processing", value: "none", score: 3 },
            { label: "Managed Cloud/SaaS providers", value: "saas", score: 2 },
            { label: "External partners or data exchanges", value: "partners", score: 1 }
        ]
    },
    {
        id: "m_confidence",
        text: "Q7. Which best describes your confidence in this data flow?",
        options: [
            { label: "Clearly understood and documented", value: "high", score: 3 },
            { label: "Mostly understood but lacks detail", value: "medium", score: 2 },
            { label: "Partially mapped or unclear", value: "low", score: 1 }
        ]
    },
    {
        id: "m_storage",
        text: "Q8. How is data retention and storage duration managed for this flow?",
        options: [
            { label: "Defined periods with automated deletion", value: "automated", score: 3 },
            { label: "Fixed periods with manual cleanup", value: "manual", score: 2 },
            { label: "Stored indefinitely / No policy exists", value: "none", score: 1 }
        ]
    }
];

const POLICY_QUESTIONS: ToolQuestion[] = [
    {
        id: "p_exists",
        text: "Q1. Does your current privacy policy exist as a formally published document?",
        options: [
            { label: "Yes, publicly available", value: "public", score: 3 },
            { label: "Yes, but internal only", value: "internal", score: 2 },
            { label: "No formal policy document", value: "none", score: 1 }
        ]
    },
    {
        id: "p_review",
        text: "Q2. When was the privacy policy last reviewed or updated?",
        options: [
            { label: "Within last 6 months", value: "recent", score: 3 },
            { label: "6 months to 1 year ago", value: "mid", score: 2 },
            { label: "More than a year ago", value: "stale", score: 1 }
        ]
    },
    {
        id: "p_elements",
        text: "Q3. How comprehensive are the mandatory disclosures in your policy?",
        options: [
            { label: "All mandatory elements covered", value: "full", score: 3 },
            { label: "Most elements covered, minor gaps", value: "partial", score: 2 },
            { label: "Significant gaps in disclosures", value: "minimal", score: 1 }
        ]
    },
    {
        id: "p_regulatory",
        text: "Q4. Does the policy explicitly address regional/global regulatory expectations (e.g., DPDP, GDPR)?",
        options: [
            { label: "Strictly aligned with all major laws", value: "both", score: 3 },
            { label: "Aligned with primary region only", value: "single", score: 2 },
            { label: "Not clearly aligned with laws", value: "none", score: 1 }
        ]
    },
    {
        id: "p_vague",
        text: "Q5. How would you rate the clarity and specificity of your policy language?",
        options: [
            { label: "Precise and specific language", value: "precise", score: 3 },
            { label: "Moderate use of broad/vague terms", value: "moderate", score: 2 },
            { label: "Highly vague or generic wording", value: "vague", score: 1 }
        ]
    },
    {
        id: "p_practice",
        text: "Q6. Does your policy accurately reflect how personal data is handled in practice?",
        options: [
            { label: "Fully aligned with operations", value: "aligned", score: 3 },
            { label: "Partially aligned (some drift)", value: "partial", score: 2 },
            { label: "Significant practice-policy mismatch", value: "none", score: 1 }
        ]
    },
    {
        id: "p_gap",
        text: "Q7. Are there known operational activities not clearly reflected in the policy?",
        options: [
            { label: "No gaps, operations fully mapped", value: "no", score: 3 },
            { label: "Minor unmapped activities", value: "minor", score: 2 },
            { label: "Large operational 'Reality Gaps'", value: "yes", score: 1 }
        ]
    },
    {
        id: "p_owner",
        text: "Q8. Is there a defined owner responsible for maintaining the privacy policy?",
        options: [
            { label: "Formal owner with clear accountability", value: "yes", score: 3 },
            { label: "Informally assigned responsibilities", value: "informal", score: 2 },
            { label: "No defined owner or governance", value: "none", score: 1 }
        ]
    }
];

const INCIDENT_QUESTIONS: ToolQuestion[] = [
    {
        id: "i_frequency",
        text: "Q1. How often do privacy or data-related incidents occur?",
        options: [
            { label: "Frequently (monthly or more)", value: "frequent", score: 1 },
            { label: "Rarely (once or twice a year)", value: "rare", score: 2 },
            { label: "No known incidents", value: "none", score: 3 }
        ]
    },
    {
        id: "i_trend",
        text: "Q2. Have incidents increased or decreased recently?",
        options: [
            { label: "Increased significantly", value: "up", score: 1 },
            { label: "Remaining stable / Not tracked", value: "none", score: 2 },
            { label: "Decreased due to controls", value: "down", score: 3 }
        ]
    },
    {
        id: "i_timely",
        text: "Q3. Are incidents typically resolved within defined regulatory timelines?",
        options: [
            { label: "Frequently delayed / No timelines", value: "often", score: 1 },
            { label: "Some delays occur occasionally", value: "some", score: 2 },
            { label: "Yes, consistently on time", value: "yes", score: 3 }
        ]
    },
    {
        id: "i_open",
        text: "Q4. Do unresolved incidents remain open for extended periods?",
        options: [
            { label: "Often / Backlog growing", value: "often", score: 1 },
            { label: "No active backlog", value: "none", score: 2 },
            { label: "Rarely / Closed within 48h", value: "rare", score: 3 }
        ]
    },
    {
        id: "i_speed",
        text: "Q5. What best describes your average incident resolution time?",
        options: [
            { label: "More than a week", value: "more", score: 1 },
            { label: "3–7 days", value: "week", score: 2 },
            { label: "Same day (Under 24h)", value: "day", score: 3 }
        ]
    },
    {
        id: "i_types",
        text: "Q6. What is the typical severity and spread of incidents detected?",
        options: [
            { label: "High Severity (Data Theft / Ransom)", value: "critical", score: 1 },
            { label: "Medium (Unauthorized Access / Error)", value: "error", score: 2 },
            { label: "Low (Minor Outages / Misconfigs)", value: "minor", score: 3 }
        ]
    },
    {
        id: "i_detection",
        text: "Q7. How are incidents usually detected?",
        options: [
            { label: "Discovered late / accidentally", value: "accidental", score: 1 },
            { label: "Reported by employees / manually", value: "manual", score: 2 },
            { label: "Automated real-time monitoring", value: "auto", score: 3 }
        ]
    },
    {
        id: "i_escalation",
        text: "Q8. Is escalation responsibility clearly defined for data breaches?",
        options: [
            { label: "Unclear / No defined roles", value: "no", score: 1 },
            { label: "Depends on individuals' initiative", value: "some", score: 2 },
            { label: "Clearly defined accountability", value: "yes", score: 3 }
        ]
    },
    {
        id: "i_notification",
        text: "Q9. Are notification steps (internal / external) clearly established?",
        options: [
            { label: "Not defined / No playbook", value: "no", score: 1 },
            { label: "Partially defined / Internal only", value: "some", score: 2 },
            { label: "Fully documented and tested", value: "yes", score: 3 }
        ]
    },
    {
        id: "i_closure",
        text: "Q10. Is there a defined process to formally close and review incidents?",
        options: [
            { label: "No formal closure process", value: "no", score: 1 },
            { label: "Exists but inconsistently used", value: "some", score: 2 },
            { label: "Yes, consistent post-mortem review", value: "yes", score: 3 }
        ]
    }
];

const ACCOUNTABILITY_QUESTIONS: ToolQuestion[] = [
    {
        id: "a_tasks",
        text: "Q1. Which privacy, data, or compliance-related responsibilities exist in your organization?",
        options: [
            { label: "All key responsibilities (Policy, Breach, DSRs) are formally defined", value: "formal", score: 3 },
            { label: "Only major responsibilities (e.g. Breach) are defined", value: "partial", score: 2 },
            { label: "Responsibilities are ad-hoc or undefined", value: "adhoc", score: 1 }
        ]
    },
    {
        id: "a_roles",
        text: "Q2. Which roles are involved in these responsibilities?",
        options: [
            { label: "Dedicated Privacy/Compliance roles exist", value: "dedicated", score: 3 },
            { label: "Shared responsibilities across IT/Legal", value: "shared", score: 2 },
            { label: "No specific roles assigned", value: "none", score: 1 }
        ]
    },
    {
        id: "a_responsible",
        text: "Q3. Who is primarily responsible for executing the most critical activities?",
        options: [
            { label: "Specific execution owners for every task", value: "specific", score: 3 },
            { label: "General department heads", value: "dept", score: 2 },
            { label: "Unclear / Everyone is responsible", value: "unclear", score: 1 }
        ]
    },
    {
        id: "a_accountable",
        text: "Q4. Who is ultimately accountable for decisions in these activities?",
        options: [
            { label: "Single Accountable person per activity", value: "single", score: 3 },
            { label: "Shared accountability (Multiple managers)", value: "shared", score: 2 },
            { label: "No clear final decision maker", value: "none", score: 1 }
        ]
    },
    {
        id: "a_consulted",
        text: "Q5. Which roles are typically consulted before changes are made?",
        options: [
            { label: "Formal consultation with Legal/IT/Sec", value: "formal", score: 3 },
            { label: "Ad-hoc consultation when needed", value: "adhoc", score: 2 },
            { label: "Decisions made in silos without consultation", value: "silo", score: 1 }
        ]
    },
    {
        id: "a_informed",
        text: "Q6. Which roles are kept informed of status and outcomes?",
        options: [
            { label: "Structured reporting to Leadership/Stakeholders", value: "structured", score: 3 },
            { label: "Informal updates to immediate team", value: "informal", score: 2 },
            { label: "No regular status updates", value: "none", score: 1 }
        ]
    },
    {
        id: "a_confidence",
        text: "Q7. How confident are you that these assignments reflect reality?",
        options: [
            { label: "Highly confident (Documented & Audited)", value: "high", score: 3 },
            { label: "Moderately confident (Some gaps)", value: "med", score: 2 },
            { label: "Low confidence (Assignments ignored)", value: "low", score: 1 }
        ]
    }
];

const TRANSFER_QUESTIONS: ToolQuestion[] = [
    {
        id: "t_exists",
        text: "Q1. Does personal data processed by your organization leave your primary country of operation?",
        options: [
            { label: "No, all data stays locally", value: "local", score: 3 },
            { label: "Yes, but only to approved safe jurisdictions", value: "safe", score: 2 },
            { label: "Yes, to multiple global locations", value: "global", score: 1 }
        ]
    },
    {
        id: "t_frequency",
        text: "Q2. How frequently do cross-border data transfers occur?",
        options: [
            { label: "Ad-hoc / Rare occasions", value: "rare", score: 3 },
            { label: "Periodic / Scheduled batches", value: "periodic", score: 2 },
            { label: "Continuous / Real-time flows", value: "continuous", score: 1 }
        ]
    },
    {
        id: "t_regions",
        text: "Q3. Are you aware of the specific regions receiving your data?",
        options: [
            { label: "All destination countries are mapped", value: "mapped", score: 3 },
            { label: "Major destinations known, some unclear", value: "partial", score: 2 },
            { label: "Unsure of exact destinations", value: "unsure", score: 1 }
        ]
    },
    {
        id: "t_partners",
        text: "Q4. Do you have data transfer agreements (DTAs) with foreign partners?",
        options: [
            { label: "Formal DTAs signed with all partners", value: "signed", score: 3 },
            { label: "Agreements exist but need updating", value: "partial", score: 2 },
            { label: "No formal transfer agreements", value: "none", score: 1 }
        ]
    },
    {
        id: "t_entities",
        text: "Q5. Who are the primary recipients of this international data?",
        options: [
            { label: "Internal Group Companies only", value: "internal", score: 3 },
            { label: "Known strategic vendors", value: "vendors", score: 2 },
            { label: "Multiple third-parties / aggregators", value: "external", score: 1 }
        ]
    },
    {
        id: "t_automated",
        text: "Q6. Are transfers automated or manually triggered?",
        options: [
            { label: "Manual with checks", value: "manual", score: 3 },
            { label: "Semi-automated with logs", value: "semi", score: 2 },
            { label: "Fully automated via APIs/Scripts", value: "automated", score: 1 }
        ]
    },
    {
        id: "t_categories",
        text: "Q7. What sensitivity level of data is being transferred?",
        options: [
            { label: "Public / Non-sensitive data", value: "public", score: 3 },
            { label: "Internal business data", value: "internal", score: 2 },
            { label: "Sensitive / SPII / Financial data", value: "sensitive", score: 1 }
        ]
    },
    {
        id: "t_restrictions",
        text: "Q8. Are you compliant with data localization laws in source countries?",
        options: [
            { label: "Fully compliant & verified", value: "compliant", score: 3 },
            { label: "Aware but verification pending", value: "partial", score: 2 },
            { label: "Unaware of localization rules", value: "unaware", score: 1 }
        ]
    },
    {
        id: "t_consideration",
        text: "Q9. Have you conducted a Transfer Impact Assessment (TIA)?",
        options: [
            { label: "Yes, formally conducted", value: "yes", score: 3 },
            { label: "Informal risk review done", value: "informal", score: 2 },
            { label: "No assessment conducted", value: "no", score: 1 }
        ]
    },
    {
        id: "t_confidence",
        text: "Q10. Can you stop these transfers immediately if required?",
        options: [
            { label: "Yes, we have a 'Kill Switch'", value: "yes", score: 3 },
            { label: "Possible but would take time", value: "delayed", score: 2 },
            { label: "No, flows are hard-coded/dependent", value: "no", score: 1 }
        ]
    }
];

export const toolsData: ToolConfig[] = [
    {
        id: "data-exposure-mapper",
        name: "DPDP Readiness Self-Assessment",
        description: "Measure your organization's alignment with the Digital Personal Data Protection Act across four critical domains.",
        problemSolved: "“Are we actually ready for DPDP, or just guessing?”",
        whyPowerful: "Provides a granular breakdown of readiness across inventory, accountability, and vendor risks.",
        category: "must-have",
        icon: Shield,
        whatYouLearn: [
            "Overall Compliance Score",
            "Gap Analysis by Category",
            "Immediate Action Items"
        ],
        questions: DPDP_QUESTIONS,
        calculateResult: (answers) => {
            const getScore = (qId: string) => {
                const ans = answers[qId];
                if (!ans) return 1;
                const q = DPDP_QUESTIONS.find(q => q.id === qId);
                const opt = q?.options.find(o => o.value === ans);
                return opt?.score || 1;
            };

            const visibilityScore = (getScore("q1_visibility") + getScore("q2_systems")) / 2;
            const governanceScore = getScore("q3_governance");
            let vendorScore = 3;
            if (answers["q4_vendor_trigger"] === "yes" || answers["q4_vendor_trigger"] === "unsure") {
                vendorScore = getScore("q5_vendor_contracts");
            }
            const incidentScore = (getScore("q6_incident_process") + getScore("q7_breach_lead")) / 2;

            const finalWeightedScore =
                (visibilityScore * 0.30) +
                (governanceScore * 0.20) +
                (vendorScore * 0.25) +
                (incidentScore * 0.25);

            const percentageScore = Math.round(((finalWeightedScore - 1) / 2) * 100);

            // Risk Gap Engine
            const criticalGaps: { gap: string; area: string; priority: number }[] = [];
            const improvementAreas: string[] = [];
            const strongControls: string[] = [];

            const processDomain = (score: number, domain: string, questions: { id: string; gapMsg: string; strongMsg: string }[]) => {
                if (score === 3) strongControls.push(domain);
                else if (score >= 2) improvementAreas.push(domain);

                questions.forEach(q => {
                    if (getScore(q.id) === 1) {
                        criticalGaps.push({ gap: q.gapMsg, area: domain, priority: score });
                    }
                });
            };

            processDomain(visibilityScore, "Data Visibility", [
                { id: "q1_visibility", gapMsg: "No formal documentation of personal data", strongMsg: "Complete data mapping" },
                { id: "q2_systems", gapMsg: "Cannot identify all data-storing systems", strongMsg: "System visibility" }
            ]);
            processDomain(governanceScore, "Governance", [
                { id: "q3_governance", gapMsg: "No assigned data protection ownership", strongMsg: "Accountability structure" }
            ]);
            processDomain(vendorScore, "Vendor Risk", [
                { id: "q5_vendor_contracts", gapMsg: "Not documented vendor obligations", strongMsg: "Vendor oversight" }
            ]);
            processDomain(incidentScore, "Incident Preparedness", [
                { id: "q6_incident_process", gapMsg: "No data-incident response process", strongMsg: "Incident detection" },
                { id: "q7_breach_lead", gapMsg: "Breach leadership not defined", strongMsg: "Crisis management" }
            ]);

            // Specialized triggers
            if (answers["q4_vendor_trigger"] === "yes" && getScore("q5_vendor_contracts") === 1) {
                criticalGaps.unshift({ gap: "Critical Vendor Risk: Relying on processors without documented safeguards", area: "Vendor Risk", priority: 0 });
            }
            if (getScore("q6_incident_process") === 1 && getScore("q7_breach_lead") === 1) {
                criticalGaps.unshift({ gap: "Critical Incident Risk: Total absence of breach framework", area: "Incident Preparedness", priority: 0 });
            }

            // Insights Engine
            const insights: string[] = [];
            if (vendorScore < 2) insights.push("You rely on third-party processors but lack fully documented contractual safeguards. This may expose you to regulatory and downstream liability.");
            else if (vendorScore < 3) insights.push("Vendor compliance is partially managed but gaps in documentation create potential 'blind spots' in your supply chain.");

            if (incidentScore < 2) insights.push("Absence of a tested incident response framework may impair your ability to meet statutory breach reporting timelines.");
            else if (incidentScore < 3) insights.push("Your incident process exists but remains untested; real-world efficacy in a crisis is currently unverified.");

            if (governanceScore < 2) insights.push("Unclear accountability structures could create regulatory exposure in supervisory inquiries.");

            // Summary
            let riskLevel = "Strong Readiness";
            let interpretation = "Your compliance posture is highly advanced.";
            if (percentageScore <= 40) {
                riskLevel = "High Risk";
                interpretation = "Urgent attention required to fundamental compliance gaps.";
            } else if (percentageScore <= 70) {
                riskLevel = "Moderate Risk";
                interpretation = "Foundational controls are in place, but operational maturity is lacking.";
            }

            return {
                score: riskLevel,
                numericScore: percentageScore,
                gaps: criticalGaps.slice(0, 3).map(g => g.gap),
                interpretation,
                whatItMeans: "This score represents your operational alignment with DPDP Act requirements across four critical domains.",
                bridge: "Proteccio closes these gaps by automating RoPA, Vendor Risk, and Incident workflows.",
                visualData: {
                    type: 'dpdp_enterprise',
                    domains: [
                        { label: "Data Visibility", value: Math.round(((visibilityScore - 1) / 2) * 100), weight: 30 },
                        { label: "Governance", value: Math.round(((governanceScore - 1) / 2) * 100), weight: 20 },
                        { label: "Vendor Risk", value: Math.round(((vendorScore - 1) / 2) * 100), weight: 25 },
                        { label: "Incident", value: Math.round(((incidentScore - 1) / 2) * 100), weight: 25 }
                    ],
                    pieData: [
                        { label: "Strong", value: strongControls.length, color: "#1cd35c" },
                        { label: "Moderate", value: improvementAreas.length, color: "#f59e0b" },
                        { label: "Critical", value: criticalGaps.length, color: "#ef4444" }
                    ],
                    insights,
                    criticalGaps: criticalGaps.slice(0, 3),
                    improvementAreas,
                    strongControls,
                    actionPlan: {
                        days30: "Document all systems and high-priority data flows.",
                        days60: "Formalize vendor clauses and appoint clear breach leadership.",
                        days90: "Test incident response and finalize DPO accountability."
                    }
                }
            };
        }
    },
    {
        id: "regulatory-calculator",
        name: "Sensitive Content & Data Compliance Self-Assessment",
        description: "Analyze your structural maturity in identifying, governing, and protecting sensitive data assets across four critical domains.",
        problemSolved: "“Do we have sensitive data hidden in our files?”",
        whyPowerful: "Instantly visualizes data distribution, sensitivity, and external exposure risks.",
        category: "must-have",
        icon: Search,
        whatYouLearn: [
            "Sensitive Data Volume",
            "External Exposure Risk",
            "Retention Violations"
        ],
        questions: SCANNER_QUESTIONS,
        calculateResult: (answers) => {
            const getScore = (qId: string) => {
                const ans = answers[qId];
                if (!ans) return 1;
                const q = SCANNER_QUESTIONS.find(q => q.id === qId);
                const opt = q?.options.find(o => o.value === ans);
                return (opt?.score as number) || 1;
            };

            const scopeScore = (getScore("q1_scope_inventory") + getScore("q2_scope_nested")) / 2;
            const sensitivityScore = (getScore("q3_sensitivity_classification") + getScore("q4_sensitivity_data_level")) / 2;
            const retentionScore = (getScore("q5_retention_rules") + getScore("q6_retention_automation")) / 2;
            const sharingScore = (getScore("q7_sharing_control") + getScore("q8_sharing_review")) / 2;

            const finalWeightedScore =
                (scopeScore * 0.20) +
                (sensitivityScore * 0.30) +
                (retentionScore * 0.25) +
                (sharingScore * 0.25);

            const percentageScore = Math.round(((finalWeightedScore - 1) / 2) * 100);

            // Classification
            let classification = "Non-Compliant";
            let exposureLevel = "High";
            if (percentageScore >= 80) { classification = "Compliant"; exposureLevel = "Low"; }
            else if (percentageScore >= 60) { classification = "Partial Compliance"; exposureLevel = "Moderate"; }
            else if (percentageScore >= 40) { classification = "Weak Controls"; exposureLevel = "High"; }

            // Critical Risk Flag Engine
            const criticalGaps: { gap: string; area: string; priority: number }[] = [];

            const checkFlag = (id: string, domain: string, gapMsg: string) => {
                if (getScore(id) === 1) {
                    criticalGaps.push({ gap: gapMsg, area: domain, priority: 1 });
                }
            };

            checkFlag("q1_scope_inventory", "Data Scope", "No formal inventory of data repositories.");
            checkFlag("q3_sensitivity_classification", "Sensitivity", "Sensitive data not identified or classified.");
            checkFlag("q4_sensitivity_data_level", "Sensitivity", "Highly sensitive data stored with low maturity controls.");
            checkFlag("q5_retention_rules", "Retention", "Data retention rules are not defined.");
            checkFlag("q6_retention_automation", "Retention", "No defined deletion process exists.");
            checkFlag("q7_sharing_control", "Sharing", "Frequent external sharing without visibility.");
            checkFlag("q8_sharing_review", "Sharing", "No review mechanism for external sharing.");

            // Sort by domain severity (lowest domain score first)
            const domainScores = [
                { label: "Data Scope", score: scopeScore },
                { label: "Sensitivity", score: sensitivityScore },
                { label: "Retention", score: retentionScore },
                { label: "Sharing", score: sharingScore }
            ];

            criticalGaps.sort((a, b) => {
                const scoreA = domainScores.find(d => d.label === a.area)?.score || 3;
                const scoreB = domainScores.find(d => d.label === b.area)?.score || 3;
                return scoreA - scoreB;
            });

            // Blind-Spot Generation
            const insights: string[] = [];
            if (getScore("q4_sensitivity_data_level") === 1 && getScore("q5_retention_rules") === 1) {
                insights.push("Highly sensitive personal data is stored without structured retention enforcement. This creates regulatory exposure under data minimization and storage limitation principles.");
            }
            if (getScore("q7_sharing_control") === 1 && getScore("q8_sharing_review") === 1) {
                insights.push("External file sharing lacks governance controls, increasing risk of unauthorized disclosure and regulatory scrutiny.");
            }
            if (getScore("q6_retention_automation") === 2) {
                insights.push("Manual deletion processes increase risk of retention drift and inconsistent enforcement.");
            }

            if (insights.length === 0) {
                insights.push("Your current data governance framework provides a baseline, but lacks the necessary automation to prevent compliance debt over time.");
            }

            // Action Plan
            const actionPlan = {
                days30: "Establish a formal data inventory and identify all sensitive data clusters.",
                days60: "Define formal retention rules and implement an external sharing review workflow.",
                days90: "Automate deletion workflows and integrate real-time sharing monitoring."
            };

            // Regulatory Questions
            const regQuestions = [];
            if (retentionScore < 2.5) regQuestions.push("How do you enforce retention limits?");
            if (sharingScore < 2.5) regQuestions.push("What controls exist for external sharing?");
            if (sensitivityScore < 2.5) regQuestions.push("How do you classify sensitive data?");

            return {
                score: classification,
                numericScore: percentageScore,
                gaps: criticalGaps.slice(0, 3).map(g => g.gap),
                interpretation: `Exposure Level: ${exposureLevel}. Your organization has ${classification.toLowerCase()} regarding sensitive content governance.`,
                whatItMeans: "This assessment measures your structural maturity in identifying, governing, and protecting sensitive data assets.",
                bridge: "Proteccio automates classification, retention, and sharing governance to eliminate manual compliance debt.",
                visualData: {
                    type: 'sensitive_assessment',
                    domains: [
                        { label: "Data Scope", value: Math.round(((scopeScore - 1) / 2) * 100), weight: 20 },
                        { label: "Sensitivity", value: Math.round(((sensitivityScore - 1) / 2) * 100), weight: 30 },
                        { label: "Retention", value: Math.round(((retentionScore - 1) / 2) * 100), weight: 25 },
                        { label: "Sharing", value: Math.round(((sharingScore - 1) / 2) * 100), weight: 25 }
                    ],
                    pieData: [
                        { label: "Strong Controls", value: domainScores.filter(d => d.score === 3).length, color: "#1cd35c" },
                        { label: "Moderate Risk", value: domainScores.filter(d => d.score >= 2 && d.score < 3).length, color: "#f59e0b" },
                        { label: "Critical Risk", value: domainScores.filter(d => d.score < 2).length, color: "#ef4444" }
                    ],
                    heatmap: domainScores.map(d => ({
                        label: d.label,
                        value: d.score,
                        risk: d.score === 3 ? "Low" : d.score >= 2 ? "Med" : "High"
                    })),
                    insights,
                    criticalGaps: criticalGaps.slice(0, 3),
                    actionPlan,
                    regQuestions,
                    classification
                }
            };
        }
    },
    {
        id: "privacy-chaos",
        name: "Privacy & Data Operational Risk Register",
        description: "Identify, assess and track operational privacy risks to build a defensible compliance posture.",
        problemSolved: "“How do we track and communicate our operational privacy risks?”",
        whyPowerful: "Transforms abstract concerns into a structured, prioritized risk register.",
        category: "must-have",
        icon: Zap,
        whatYouLearn: [
            "Quantified Risk Exposure",
            "Risk Matrix Visualization",
            "Operational Priority Register"
        ],
        questions: RISK_QUESTIONS,
        calculateResult: (answers) => {
            const getScore = (qId: string) => {
                const ans = answers[qId];
                if (!ans) return 1;
                const q = RISK_QUESTIONS.find(q => q.id === qId);
                const opt = q?.options.find(o => o.value === ans);
                return (opt?.score as number) || 1;
            };

            const visibilityScore = (getScore("risk_inventory") + getScore("risk_mapping")) / 2;
            const impactScore = getScore("risk_impact");
            const controlScore = getScore("risk_mitigation");
            const governanceScore = (getScore("risk_ownership") + getScore("risk_closure")) / 2;

            const finalWeightedScore =
                (visibilityScore * 0.30) +
                (impactScore * 0.20) +
                (controlScore * 0.25) +
                (governanceScore * 0.25);

            const percentageScore = Math.round(((finalWeightedScore - 1) / 2) * 100);

            // Risk Engine
            const criticalGaps: { gap: string; area: string; priority: number }[] = [];
            const improvementAreas: string[] = [];
            const strongControls: string[] = [];

            const processDomain = (score: number, domain: string, questions: { id: string; gapMsg: string }[]) => {
                if (score === 3) strongControls.push(domain);
                else if (score >= 2) improvementAreas.push(domain);

                questions.forEach(q => {
                    if (getScore(q.id) === 1) {
                        criticalGaps.push({ gap: q.gapMsg, area: domain, priority: score });
                    }
                });
            };

            processDomain(visibilityScore, "Risk Visibility", [
                { id: "risk_inventory", gapMsg: "No formal risk register for operational data risks" },
                { id: "risk_mapping", gapMsg: "No clear linkage between risks and data systems" }
            ]);
            processDomain(impactScore, "Impact Analysis", [
                { id: "risk_impact", gapMsg: "Lack of regular business impact assessments" }
            ]);
            processDomain(controlScore, "Control Maturity", [
                { id: "risk_mitigation", gapMsg: "No active mitigation plans for high-impact risks" }
            ]);
            processDomain(governanceScore, "Governance & Closure", [
                { id: "risk_ownership", gapMsg: "Missing executive accountability for risk closure" },
                { id: "risk_closure", gapMsg: "Significant backlog and delays in remediation" }
            ]);

            // Insights Engine (Impact of negative answers)
            const insights: string[] = [];
            if (visibilityScore < 2) insights.push("Absolute lack of a risk register creates a 'flying blind' scenario for compliance audits.");
            if (controlScore < 2) insights.push("High-impact risks remain unmitigated, exposing the organization to significant financial and legal liability.");
            if (governanceScore < 2) insights.push("Unclear ownership lead to 'deadlock' in risk remediation, resulting in long-term compliance debt.");

            // Summary
            let riskStatus = "Robust Management";
            let interpretation = "Your operational risk management is highly mature.";
            if (percentageScore <= 40) {
                riskStatus = "High Residual Risk";
                interpretation = "Your organization is exposed to significant unmanaged operational risks.";
            } else if (percentageScore <= 70) {
                riskStatus = "Developing Controls";
                interpretation = "Basic risk tracking exists, but operational maturity and closure speed are low.";
            }

            return {
                score: riskStatus,
                numericScore: percentageScore,
                gaps: criticalGaps.slice(0, 3).map(g => g.gap),
                interpretation,
                whatItMeans: "This score reflects your organization's maturity in identifying, assessing, and closing operational data risks.",
                bridge: "Proteccio automates risk discovery and enforces closure workflows to lower your residual risk.",
                visualData: {
                    type: 'operational_risk_dashboard',
                    domains: [
                        { label: "Visibility", value: Math.round(((visibilityScore - 1) / 2) * 100), weight: 30 },
                        { label: "Analysis", value: Math.round(((impactScore - 1) / 2) * 100), weight: 20 },
                        { label: "Controls", value: Math.round(((controlScore - 1) / 2) * 100), weight: 25 },
                        { label: "Governance", value: Math.round(((governanceScore - 1) / 2) * 100), weight: 25 }
                    ],
                    pieData: [
                        { label: "Strong", value: strongControls.length, color: "#1cd35c" },
                        { label: "Improvement", value: improvementAreas.length, color: "#f59e0b" },
                        { label: "Critical", value: criticalGaps.length, color: "#ef4444" }
                    ],
                    insights,
                    criticalGaps: criticalGaps.slice(0, 3),
                    improvementAreas,
                    strongControls,
                    actionPlan: {
                        days30: "Establish a formal operational risk register and link to critical systems.",
                        days60: "Define executive accountability and assign owners to high-impact gaps.",
                        days90: "Implement a 30-day remediation cycle for all new high-priority risks."
                    }
                }
            };
        }
    },
    {
        id: "vendor-blindspot",
        name: "Vendor Risk Intelligence Dashboard",
        description: "Assess your third-party ecosystem to identify critical blind spots and compliance risks.",
        problemSolved: "“Which vendors could hurt us the most?”",
        whyPowerful: "Provides an automated, executive view of third-party risk exposure.",
        category: "must-have",
        icon: Eye,
        whatYouLearn: [
            "Vendor Risk Heatmap",
            "Contract Compliance Rate",
            "High-Risk Dependency Map"
        ],
        questions: VENDOR_QUESTIONS,
        calculateResult: (answers) => {
            const getScore = (qId: string) => {
                const ans = answers[qId];
                if (!ans) return 2;
                const q = VENDOR_QUESTIONS.find(q => q.id === qId);
                const opt = q?.options.find(o => o.value === ans);
                return (opt?.score as number) || 2;
            };

            const inventoryScore = getScore("v_count");
            const sensitivityScore = (getScore("v_criticality") + getScore("v_data")) / 2;
            const controlScore = (getScore("v_contracts") + getScore("v_reviews")) / 2;
            const postureScore = (getScore("v_posture") + getScore("v_events") + getScore("v_impact")) / 3;

            const finalWeightedScore =
                (inventoryScore * 0.15) +
                (sensitivityScore * 0.30) +
                (controlScore * 0.30) +
                (postureScore * 0.25);

            const percentageScore = Math.round(((finalWeightedScore - 1) / 2) * 100);

            // Risk Engine
            const criticalGaps: { gap: string; area: string; priority: number }[] = [];
            const improvementAreas: string[] = [];
            const strongControls: string[] = [];

            const processDomain = (score: number, domain: string, questions: { id: string; gapMsg: string }[]) => {
                if (score === 3) strongControls.push(domain);
                else if (score >= 2) improvementAreas.push(domain);

                questions.forEach(q => {
                    if (getScore(q.id) === 1) {
                        criticalGaps.push({ gap: q.gapMsg, area: domain, priority: score });
                    }
                });
            };

            processDomain(sensitivityScore, "Data Sensitivity", [
                { id: "v_criticality", gapMsg: "High operational dependency on unverified critical vendors" },
                { id: "v_data", gapMsg: "Vendors handling sensitive/regulated data without extra safeguards" }
            ]);
            processDomain(controlScore, "Compliance Control", [
                { id: "v_contracts", gapMsg: "Missing or inconsistent data protection clauses in vendor contracts" },
                { id: "v_reviews", gapMsg: "Lack of periodic compliance reviews or formal audits" }
            ]);
            processDomain(postureScore, "Ecosystem Hygiene", [
                { id: "v_posture", gapMsg: "Overall vendor risk posture is rated as weak/high-risk" },
                { id: "v_events", gapMsg: "Recent vendor-related risk events indicate systemic weakness" },
                { id: "v_impact", gapMsg: "Potential for high business impact from single-point vendor failure" }
            ]);

            // Insights Engine (Impact of negative answers)
            const insights: string[] = [];
            if (controlScore < 2) insights.push("Lack of contractual enforcement leaves the organization legally exposed during third-party breaches.");
            if (sensitivityScore < 2) insights.push("Processing sensitive data through critical vendors without active monitoring is a high-risk regulator red flag.");
            if (postureScore < 2) insights.push("Recent incidents and weak posture suggest your ecosystem is currently vulnerable to active threats.");

            // Summary
            let vendorStatus = "Managed Ecosystem";
            let interpretation = "Your third-party risk management shows high strategic maturity.";
            if (percentageScore <= 40) {
                vendorStatus = "Critical Exposure";
                interpretation = "Your vendor ecosystem is a major source of unmitigated privacy risk.";
            } else if (percentageScore <= 70) {
                vendorStatus = "Reactive Monitoring";
                interpretation = "Baseline controls exist, but you lack proactive intelligence and contract enforcement.";
            }

            return {
                score: vendorStatus,
                numericScore: percentageScore,
                gaps: criticalGaps.slice(0, 3).map(g => g.gap),
                interpretation,
                whatItMeans: "This score identifies the maturity of your third-party risk management and the health of your vendor ecosystem.",
                bridge: "Proteccio centralizes vendor intelligence and automates contract compliance to de-risk your supply chain.",
                visualData: {
                    type: 'vendor_intelligence_dashboard',
                    domains: [
                        { label: "Inventory", value: Math.round(((inventoryScore - 1) / 2) * 100), weight: 15 },
                        { label: "Sensitivity", value: Math.round(((sensitivityScore - 1) / 2) * 100), weight: 30 },
                        { label: "Compliance", value: Math.round(((controlScore - 1) / 2) * 100), weight: 30 },
                        { label: "Resilience", value: Math.round(((postureScore - 1) / 2) * 100), weight: 25 }
                    ],
                    pieData: [
                        { label: "Secure", value: strongControls.length, color: "#1cd35c" },
                        { label: "At Risk", value: improvementAreas.length, color: "#f59e0b" },
                        { label: "Critical", value: criticalGaps.length, color: "#ef4444" }
                    ],
                    insights,
                    criticalGaps: criticalGaps.slice(0, 3),
                    improvementAreas,
                    strongControls,
                    actionPlan: {
                        days30: "Audit all critical vendor contracts for missing data protection clauses.",
                        days60: "Implement a formal vendor risk tiering system based on data sensitivity.",
                        days90: "Automate the quarterly review cycle for all 'High-Risk' third parties."
                    }
                }
            };
        }
    },
    {
        id: "data-mapping-lite",
        name: "Data Mapping Lite",
        description: "Visualize and document your data flows to identify collection risks and regulatory gaps.",
        problemSolved: "“Where does our data actually go?”",
        whyPowerful: "Provides a high-level visual representation of your data lifecycle and compliance health.",
        category: "must-have",
        icon: Database,
        whatYouLearn: [
            "Process Coverage Map",
            "Data Category Heatmap",
            "Storage Location Risks"
        ],
        questions: MAP_QUESTIONS,
        calculateResult: (answers) => {
            const getScore = (qId: string) => {
                const ans = answers[qId];
                if (!ans) return 2;
                const q = MAP_QUESTIONS.find(q => q.id === qId);
                const opt = q?.options.find(o => o.value === ans);
                return (opt?.score as number) || 2;
            };

            const visibilityScore = (getScore("m_subjects") + getScore("m_confidence")) / 2;
            const lineageScore = (getScore("m_triggers") + getScore("m_processing")) / 2;
            const flowScore = (getScore("m_functions") + getScore("m_external")) / 2;
            const governanceScore = (getScore("m_outcomes") + getScore("m_storage")) / 2;

            const finalWeightedScore =
                (visibilityScore * 0.30) +
                (lineageScore * 0.25) +
                (flowScore * 0.25) +
                (governanceScore * 0.20);

            const percentageScore = Math.round(((finalWeightedScore - 1) / 2) * 100);

            // Analysis
            const criticalGaps: { gap: string; area: string; priority: number }[] = [];
            const improvementAreas: string[] = [];
            const strongControls: string[] = [];

            const processDomain = (score: number, domain: string, questions: { id: string; gapMsg: string }[]) => {
                if (score === 3) strongControls.push(domain);
                else if (score >= 2) improvementAreas.push(domain);

                questions.forEach(q => {
                    if (getScore(q.id) === 1) {
                        criticalGaps.push({ gap: q.gapMsg, area: domain, priority: score });
                    }
                });
            };

            processDomain(visibilityScore, "Visibility", [
                { id: "m_subjects", gapMsg: "Uncategorized data subjects increase regulatory risk" },
                { id: "m_confidence", gapMsg: "Low operational confidence in current data flow documentation" }
            ]);
            processDomain(lineageScore, "Lineage", [
                { id: "m_triggers", gapMsg: "Hidden or automated triggers escape collection oversight" },
                { id: "m_processing", gapMsg: "Legacy or unmapped archival processes detected" }
            ]);
            processDomain(flowScore, "Flow Integrity", [
                { id: "m_functions", gapMsg: "Shadow IT or undocumented departmental sharing" },
                { id: "m_external", gapMsg: "Unmapped third-party data transfers to verify partners" }
            ]);
            processDomain(governanceScore, "Life Cycle", [
                { id: "m_outcomes", gapMsg: "Processing for profiling or undefined secondary purposes" },
                { id: "m_storage", gapMsg: "Indefinite storage without automated deletion controls" }
            ]);

            // Insights Engine
            const insights: string[] = [];
            if (flowScore < 2) insights.push("Unmapped external flows are a significant risk for cross-border compliance enforcement.");
            if (visibilityScore < 2) insights.push("Lack of subject clarity makes handling Data Subject Requests (DSRs) operationally impossible.");
            if (governanceScore < 2) insights.push("Undefined secondary processing and indefinite retention are major red flags for regulatory audits.");

            let status = "Documented Flow";
            let interpretation = "Your data mapping maturity is high, with clear lineage and governance.";
            if (percentageScore <= 40) {
                status = "Untraced Lifecycle";
                interpretation = "Your organization lacks critical visibility into how data enters, moves, and leaves your systems.";
            } else if (percentageScore <= 70) {
                status = "Partial Visibility";
                interpretation = "Core flows are understood, but edge cases and external transfers remain unmapped.";
            }

            // Get labels for visual fallback
            const getLabel = (qId: string) => {
                const ans = answers[qId];
                if (!ans) return "Not specified";
                const q = MAP_QUESTIONS.find(q => q.id === qId);
                const opt = q?.options.find(o => o.value === ans);
                return opt?.label || "Not specified";
            };

            return {
                score: status,
                numericScore: percentageScore,
                gaps: criticalGaps.slice(0, 3).map(g => g.gap),
                interpretation,
                whatItMeans: "This score represents the operational maturity of your data flow mapping and the auditability of your data lifecycle.",
                bridge: "Proteccio automates the discovery of these flows, ensuring your RoPA is always accurate and real-time.",
                visualData: {
                    type: 'data_mapping_dashboard',
                    domains: [
                        { label: "Visibility", value: Math.round(((visibilityScore - 1) / 2) * 100), weight: 30 },
                        { label: "Lineage", value: Math.round(((lineageScore - 1) / 2) * 100), weight: 25 },
                        { label: "Integrity", value: Math.round(((flowScore - 1) / 2) * 100), weight: 25 },
                        { label: "Life Cycle", value: Math.round(((governanceScore - 1) / 2) * 100), weight: 20 }
                    ],
                    pieData: [
                        { label: "Mapped", value: strongControls.length, color: "#1cd35c" },
                        { label: "Partial", value: improvementAreas.length, color: "#f59e0b" },
                        { label: "Critical", value: criticalGaps.length, color: "#ef4444" }
                    ],
                    insights,
                    criticalGaps: criticalGaps.slice(0, 3),
                    improvementAreas,
                    strongControls,
                    actionPlan: {
                        days30: "Document all high-risk automated collection triggers and scripts.",
                        days60: "Map cross-departmental data sharing and assign system owners.",
                        days90: "Implement automated retention triggers for all unmapped legacy storage."
                    },
                    flow: {
                        subjects: [getLabel("m_subjects")],
                        triggers: [getLabel("m_triggers")],
                        processing: [getLabel("m_processing")],
                        functions: [getLabel("m_functions")],
                        outcomes: [getLabel("m_outcomes")],
                        external: [getLabel("m_external")]
                    }
                }
            };
        }
    },
    {
        id: "policy-reality-check",
        name: "Privacy Policy Health Check",
        description: "Diagnose your privacy policy for missing disclosures, practice mismatches, and regulatory gaps.",
        problemSolved: "“Is our privacy policy actually defensible and aligned with practice?”",
        whyPowerful: "It identifies the 'Reality Gap' between what you say and what you actually do.",
        category: "nice-to-have",
        icon: FileText,
        whatYouLearn: [
            "Mandatory disclosure gaps",
            "Policy-to-practice mismatch risk",
            "Regulatory alignment score"
        ],
        questions: POLICY_QUESTIONS,
        calculateResult: (answers) => {
            const getScore = (qId: string) => {
                const ans = answers[qId];
                if (!ans) return 2;
                const q = POLICY_QUESTIONS.find(q => q.id === qId);
                if (!q) return 2;
                const opt = q.options.find(o => o.value === ans);
                return (opt?.score as number) || 2;
            };

            const disclosureScore = (getScore("p_exists") + getScore("p_elements")) / 2;
            const reviewScore = (getScore("p_review") + getScore("p_vague")) / 2;
            const alignmentScore = (getScore("p_practice") + getScore("p_gap")) / 2;
            const governanceScore = (getScore("p_regulatory") + getScore("p_owner")) / 2;

            const finalWeightedScore =
                (disclosureScore * 0.30) +
                (reviewScore * 0.20) +
                (alignmentScore * 0.30) +
                (governanceScore * 0.20);

            const percentageScore = Math.round(((finalWeightedScore - 1) / 2) * 100);

            // Analysis Engines
            const criticalGaps: { gap: string; area: string; priority: number }[] = [];
            const improvementAreas: string[] = [];
            const strongControls: string[] = [];

            const processDomain = (score: number, domain: string, questions: { id: string; gapMsg: string }[]) => {
                if (score === 3) strongControls.push(domain);
                else if (score >= 2) improvementAreas.push(domain);

                questions.forEach(q => {
                    if (getScore(q.id) === 1) {
                        criticalGaps.push({ gap: q.gapMsg, area: domain, priority: Math.round(score) });
                    }
                });
            };

            processDomain(disclosureScore, "Public Disclosure", [
                { id: "p_exists", gapMsg: "No formally published privacy policy document detected" },
                { id: "p_elements", gapMsg: "Significant missing mandatory disclosures for regulatory compliance" }
            ]);
            processDomain(reviewScore, "Review & Clarity", [
                { id: "p_review", gapMsg: "Policy is stale (last updated >1 year ago)" },
                { id: "p_vague", gapMsg: "Language is generic and fails to specify actual operational practices" }
            ]);
            processDomain(alignmentScore, "Operational Alignment", [
                { id: "p_practice", gapMsg: "Major mismatch between policy statements and operational reality" },
                { id: "p_gap", gapMsg: "Operationally active data flows are unmapped in the public policy" }
            ]);
            processDomain(governanceScore, "Governance Strength", [
                { id: "p_regulatory", gapMsg: "Policy fails to address foundational regulatory expectations" },
                { id: "p_owner", gapMsg: "No formal accountability for policy maintenance and updates" }
            ]);

            // Insights Engine (Impact analysis)
            const insights: string[] = [];
            if (alignmentScore < 2) insights.push("A 'Reality Gap' between policy and practice is the #1 cause of regulatory fines during an audit.");
            if (disclosureScore < 2) insights.push("Missing core elements like retention or vendor details make the policy legally indefensible.");
            if (governanceScore < 2) insights.push("Lack of ownership leads to compliance drift as business systems evolve without policy updates.");

            let status = "Aligned Documentation";
            let interpretation = "Your privacy policy is robust, transparent, and accurately reflects your operations.";
            if (percentageScore <= 40) {
                status = "Critically Deficient";
                interpretation = "Your policy documentation has significant gaps and creates high legal/regulatory exposure.";
            } else if (percentageScore <= 70) {
                status = "Baseline Policy";
                interpretation = "Fundamental documentation exists but lacks specificity and suffers from operational drift.";
            }

            return {
                score: status,
                numericScore: percentageScore,
                gaps: criticalGaps.slice(0, 3).map(g => g.gap),
                interpretation,
                whatItMeans: "This score identifies how well your public-facing documentation aligns with both regulatory requirements and your internal operational reality.",
                bridge: "Proteccio continuously generates policy-ready insights by monitoring your actual data movements and vendor activity.",
                visualData: {
                    type: 'policy_health_dashboard',
                    domains: [
                        { label: "Disclosures", value: Math.round(((disclosureScore - 1) / 2) * 100) },
                        { label: "Precision", value: Math.round(((reviewScore - 1) / 2) * 100) },
                        { label: "Alignment", value: Math.round(((alignmentScore - 1) / 2) * 100) },
                        { label: "Governance", value: Math.round(((governanceScore - 1) / 2) * 100) }
                    ],
                    pieData: [
                        { label: "Healthy", value: strongControls.length, color: "#1cd35c" },
                        { label: "At Risk", value: improvementAreas.length, color: "#f59e0b" },
                        { label: "Deficient", value: 4 - (strongControls.length + improvementAreas.length), color: "#ef4444" }
                    ],
                    insights,
                    criticalGaps: criticalGaps.slice(0, 3),
                    improvementAreas,
                    strongControls,
                    actionPlan: {
                        days30: "Conduct a full disclosure gap analysis against DPDP/GDPR requirements.",
                        days60: "Map operational data lifecycle to policy statements and resolve mismatches.",
                        days90: "Implement a quarterly policy review cycle with a dedicated governance owner."
                    }
                }
            };
        }
    },
    {
        id: "incident-readiness",
        name: "Incident Readiness Checker",
        description: "Assess your capability to detect, escalate, and resolve data privacy incidents formally.",
        problemSolved: "“Would we survive a real incident and meet regulatory timelines?”",
        whyPowerful: "It measures the operational gap between 'knowing a breach' and 'closing a breach'.",
        category: "nice-to-have",
        icon: AlertTriangle,
        whatYouLearn: [
            "Resolution speed estimates",
            "Detection effectiveness",
            "Escalation ownership clarity"
        ],
        questions: INCIDENT_QUESTIONS,
        calculateResult: (answers) => {
            const getScore = (qId: string) => {
                const ans = answers[qId];
                if (!ans) return 2;
                const q = INCIDENT_QUESTIONS.find(q => q.id === qId);
                if (!q) return 2;
                const opt = q.options.find(o => o.value === ans);
                return (opt?.score as number) || 2;
            };

            const detectionScore = (getScore("i_frequency") + getScore("i_detection")) / 2;
            const responseScore = (getScore("i_timely") + getScore("i_speed")) / 2;
            const governanceScore = (getScore("i_escalation") + getScore("i_notification")) / 2;
            const resilienceScore = (getScore("i_closure") + getScore("i_trend")) / 2;

            const finalWeightedScore =
                (detectionScore * 0.30) +
                (responseScore * 0.30) +
                (governanceScore * 0.20) +
                (resilienceScore * 0.20);

            const percentageScore = Math.round(((finalWeightedScore - 1) / 2) * 100);

            // Analysis Engines
            const criticalGaps: { gap: string; area: string; priority: number }[] = [];
            const improvementAreas: string[] = [];
            const strongControls: string[] = [];

            const processDomain = (score: number, domain: string, questions: { id: string; gapMsg: string }[]) => {
                if (score === 3) strongControls.push(domain);
                else if (score >= 2) improvementAreas.push(domain);

                questions.forEach(q => {
                    if (getScore(q.id) === 1) {
                        criticalGaps.push({ gap: q.gapMsg, area: domain, priority: Math.round(score) });
                    }
                });
            };

            processDomain(detectionScore, "Threat Detection", [
                { id: "i_frequency", gapMsg: "High incident volume suggests systemic data safety issues" },
                { id: "i_detection", gapMsg: "Reactive detection depends on accidental discovery" }
            ]);
            processDomain(responseScore, "Response Speed", [
                { id: "i_timely", gapMsg: "Frequent failure to meet regulatory response timelines" },
                { id: "i_speed", gapMsg: "Incident resolution exceeds safe threshold (>7 days)" }
            ]);
            processDomain(governanceScore, "Governance", [
                { id: "i_escalation", gapMsg: "No formal accountability for incident escalation" },
                { id: "i_notification", gapMsg: "Missing established external notification playbooks" }
            ]);
            processDomain(resilienceScore, "Operational Closure", [
                { id: "i_closure", gapMsg: "Incomplete closure process fails to capture 'lessons learned'" },
                { id: "i_trend", gapMsg: "Upward trend in incidents indicates ineffective shielding" }
            ]);

            // Insights Engine
            const insights: string[] = [];
            if (detectionScore < 2) insights.push("Reactive detection increases the window of exposure, leading to higher regulatory fines.");
            if (responseScore < 2) insights.push("Slow response cycles prevent timely breach notification, which is a critical statutory violation.");
            if (governanceScore < 2) insights.push("Lack of ownership during a crisis leads to chaotic response and legal mismanagement.");

            let status = "Resilient Framework";
            let interpretation = "Your incident response framework is proactive, logged, and meets regulatory expectations.";
            if (percentageScore <= 40) {
                status = "Critically Reactive";
                interpretation = "Your organization is highly vulnerable to catastrophic data events with no formal defense.";
            } else if (percentageScore <= 70) {
                status = "Developing Readiness";
                interpretation = "Fundamental response steps exist but lack the speed and automation for enterprise safety.";
            }

            return {
                score: status,
                numericScore: percentageScore,
                gaps: criticalGaps.slice(0, 3).map(g => g.gap),
                interpretation,
                whatItMeans: "This score identifies how likely you are to meet the 72-hour regulatory window during a real data breach.",
                bridge: "Proteccio turns manual incident tracking into a repeatable, audit-ready digital workflow.",
                visualData: {
                    type: 'incident_readiness_dashboard',
                    domains: [
                        { label: "Detection", value: Math.round(((detectionScore - 1) / 2) * 100) },
                        { label: "Response", value: Math.round(((responseScore - 1) / 2) * 100) },
                        { label: "Governance", value: Math.round(((governanceScore - 1) / 2) * 100) },
                        { label: "Closure", value: Math.round(((resilienceScore - 1) / 2) * 100) }
                    ],
                    pieData: [
                        { label: "Optimal", value: strongControls.length, color: "#1cd35c" },
                        { label: "Developing", value: improvementAreas.length, color: "#f59e0b" },
                        { label: "Weak", value: Math.max(0, 4 - (strongControls.length + improvementAreas.length)), color: "#ef4444" }
                    ],
                    insights,
                    criticalGaps: criticalGaps.slice(0, 3),
                    improvementAreas,
                    strongControls,
                    actionPlan: {
                        days30: "Formalize the incident response team and breach leadership roles.",
                        days60: "Implement automated threshold monitoring and internal notification alerts.",
                        days90: "Conduct an end-to-end incident simulation to test playbook effectiveness."
                    }
                }
            };
        }
    },
    {
        id: "accountability-clarity",
        name: "Accountability Clarity Tool",
        description: "Map privacy responsibilities across your team to identify ownership gaps and decision delays.",
        problemSolved: "“Who actually owns this, and who just helps?”",
        whyPowerful: "It builds a visual RACI matrix that exposes 'nobody owns it' risks instantly.",
        category: "nice-to-have",
        icon: Users,
        whatYouLearn: [
            "Your custom RACI Matrix",
            "Accountability spread analysis",
            "Missing owner risk flags"
        ],
        questions: ACCOUNTABILITY_QUESTIONS,
        calculateResult: (answers) => {
            const getScore = (qId: string) => {
                const ans = answers[qId];
                if (!ans) return 2;
                const q = ACCOUNTABILITY_QUESTIONS.find(q => q.id === qId);
                if (!q) return 2;
                const opt = q.options.find(o => o.value === ans);
                return (opt?.score as number) || 2;
            };

            const roleClarityScore = (getScore("a_tasks") + getScore("a_roles")) / 2;
            const authorityScore = (getScore("a_responsible") + getScore("a_accountable")) / 2;
            const communicationScore = (getScore("a_consulted") + getScore("a_informed")) / 2;
            const governanceScore = getScore("a_confidence");

            const finalWeightedScore =
                (roleClarityScore * 0.25) +
                (authorityScore * 0.35) +
                (communicationScore * 0.20) +
                (governanceScore * 0.20);

            const percentageScore = Math.round(((finalWeightedScore - 1) / 2) * 100);

            // Analysis Engines
            const criticalGaps: { gap: string; area: string; priority: number }[] = [];
            const improvementAreas: string[] = [];
            const strongControls: string[] = [];

            const processDomain = (score: number, domain: string, questions: { id: string; gapMsg: string }[]) => {
                if (score === 3) strongControls.push(domain);
                else if (score >= 2) improvementAreas.push(domain);

                questions.forEach(q => {
                    if (getScore(q.id) === 1) {
                        criticalGaps.push({ gap: q.gapMsg, area: domain, priority: Math.round(score) });
                    }
                });
            };

            processDomain(roleClarityScore, "Role Clarity", [
                { id: "a_tasks", gapMsg: "Critical operational tasks are undefined." },
                { id: "a_roles", gapMsg: "No dedicated roles for compliance." }
            ]);
            processDomain(authorityScore, "Decision Authority", [
                { id: "a_responsible", gapMsg: "Unclear who executes critical tasks." },
                { id: "a_accountable", gapMsg: "No single point of accountability (The 'A' is missing)." }
            ]);
            processDomain(communicationScore, "Communication", [
                { id: "a_consulted", gapMsg: "Decisions made in silos without expert consultation." },
                { id: "a_informed", gapMsg: "Stakeholders are not kept in the loop." }
            ]);
            processDomain(governanceScore, "Governance Confidence", [
                { id: "a_confidence", gapMsg: "Low confidence suggests documented roles don't match reality." }
            ]);

            // Insights
            const insights: string[] = [];
            if (authorityScore < 2) insights.push("Lack of clear accountability is the #1 cause of regulatory failure during audits.");
            if (communicationScore < 2) insights.push("Siloed decision-making increases the risk of 'Shadow IT' and unapproved data flows.");
            if (governanceScore < 2) insights.push("The gap between documented roles and operational reality creates legal liability.");

            let status = "Optimized Governance";
            let interpretation = "Your accountability structure is clear, documented, and operational.";
            if (percentageScore <= 40) {
                status = "Governance Void";
                interpretation = "Critical lack of ownership creates severe operational and legal risks.";
            } else if (percentageScore <= 70) {
                status = "Developing Framework";
                interpretation = "Roles exist but lack the formal authority and clarity needed for robust compliance.";
            }

            return {
                score: status,
                numericScore: percentageScore,
                gaps: criticalGaps.slice(0, 3).map(g => g.gap),
                interpretation,
                whatItMeans: "This score measures the clarity of 'Who does What' and 'Who decides' in your privacy operations.",
                bridge: "Proteccio automates RACI workflows to ensure every task has a clear owner.",
                visualData: {
                    type: 'accountability_dashboard',
                    domains: [
                        { label: "Role Clarity", value: Math.round(((roleClarityScore - 1) / 2) * 100) },
                        { label: "Authority", value: Math.round(((authorityScore - 1) / 2) * 100) },
                        { label: "Comms", value: Math.round(((communicationScore - 1) / 2) * 100) },
                        { label: "Governance", value: Math.round(((governanceScore - 1) / 2) * 100) }
                    ],
                    pieData: [
                        { label: "Optimal", value: strongControls.length, color: "#1cd35c" },
                        { label: "Developing", value: improvementAreas.length, color: "#f59e0b" },
                        { label: "Weak", value: Math.max(0, 4 - (strongControls.length + improvementAreas.length)), color: "#ef4444" }
                    ],
                    insights,
                    criticalGaps: criticalGaps.slice(0, 3),
                    improvementAreas,
                    strongControls,
                    actionPlan: {
                        days30: "Formally designate a 'Single Threaded Owner' for privacy decisions.",
                        days60: "Map critical data workflows to specific role responsibilities.",
                        days90: "Implement an automated RACI notification system for task handoffs."
                    }
                }
            };
        }
    },
    {
        id: "transfer-awareness",
        name: "Cross-Border Transfer Awareness Tool",
        description: "Visualize and assessment your organization's international data flow and jurisdictional compliance risks.",
        problemSolved: "“Where does our data actually go, and are we violating residency laws?”",
        whyPowerful: "It maps Jurisdictional Intensity against Governance Confidence in a single view.",
        category: "nice-to-have",
        icon: Globe,
        whatYouLearn: [
            "Jurisdiction risk footprint",
            "Transfer intensity metrics",
            "Governance documentation gaps"
        ],
        questions: TRANSFER_QUESTIONS,
        calculateResult: (answers) => {
            const getScore = (qId: string) => {
                const ans = answers[qId];
                if (!ans) return 2;
                const q = TRANSFER_QUESTIONS.find(q => q.id === qId);
                if (!q) return 2;
                const opt = q.options.find(o => o.value === ans);
                return (opt?.score as number) || 2;
            };

            const visibilityScore = (getScore("t_exists") + getScore("t_regions") + getScore("t_categories")) / 3;
            const controlScore = (getScore("t_partners") + getScore("t_entities") + getScore("t_automated")) / 3;
            const complianceScore = (getScore("t_restrictions") + getScore("t_consideration")) / 2;
            const resilienceScore = (getScore("t_frequency") + getScore("t_confidence")) / 2;

            const finalWeightedScore =
                (visibilityScore * 0.30) +
                (controlScore * 0.25) +
                (complianceScore * 0.25) +
                (resilienceScore * 0.20);

            const percentageScore = Math.round(((finalWeightedScore - 1) / 2) * 100);

            // Analysis Engines
            const criticalGaps: { gap: string; area: string; priority: number }[] = [];
            const improvementAreas: string[] = [];
            const strongControls: string[] = [];

            const processDomain = (score: number, domain: string, questions: { id: string; gapMsg: string }[]) => {
                if (score > 2.5) strongControls.push(domain);
                else if (score >= 1.8) improvementAreas.push(domain);

                questions.forEach(q => {
                    if (getScore(q.id) === 1) {
                        criticalGaps.push({ gap: q.gapMsg, area: domain, priority: Math.round(score) });
                    }
                });
            };

            processDomain(visibilityScore, "Data Visibility", [
                { id: "t_regions", gapMsg: "Unknown data destinations create sovereignty risks." },
                { id: "t_categories", gapMsg: "Transferring sensitive data without safeguards is a major violation." }
            ]);
            processDomain(controlScore, "Transfer Control", [
                { id: "t_partners", gapMsg: "Missing DTAs expose you to third-party liability." },
                { id: "t_automated", gapMsg: "Unchecked automated flows can lead to massive data leaks." }
            ]);
            processDomain(complianceScore, "Legal Compliance", [
                { id: "t_restrictions", gapMsg: "Ignorance of localization laws can lead to immediate bans." },
                { id: "t_consideration", gapMsg: "Failure to prompt TIAs violates GDPR/DPDP requirements." }
            ]);
            processDomain(resilienceScore, "Operational Resilience", [
                { id: "t_confidence", gapMsg: "Inability to stop transfers is a critical dependency risk." }
            ]);

            // Insights
            const insights: string[] = [];
            if (visibilityScore < 2) insights.push("You cannot protect what you cannot see. Mapping flows is your urgent priority.");
            if (complianceScore < 2) insights.push("Cross-border violations attract the highest tier of regulatory fines.");
            if (controlScore < 2) insights.push("Reliance on 'Standard Clauses' without verifying vendor capability is no longer sufficient.");

            let status = "Global Guardian";
            let interpretation = "Your cross-border strategy is robust, legally sound, and resilient.";
            if (percentageScore <= 40) {
                status = "Border Blind";
                interpretation = "Urgent: Unmapped data flows are leaving your jurisdiction without legal cover.";
            } else if (percentageScore <= 70) {
                status = "Transit Aware";
                interpretation = "You have some visibility, but lack the controls to ensure safe harbour for your data.";
            }

            return {
                score: status,
                numericScore: percentageScore,
                gaps: criticalGaps.slice(0, 3).map(g => g.gap),
                interpretation,
                whatItMeans: "This score measures your ability to legally drive data across borders without hitting regulatory walls.",
                bridge: "Proteccio actively monitors transfer legitimacy and automates TIA documentation.",
                visualData: {
                    type: 'transfer_dashboard',
                    domains: [
                        { label: "Visibility", value: Math.round(((visibilityScore - 1) / 2) * 100) },
                        { label: "Control", value: Math.round(((controlScore - 1) / 2) * 100) },
                        { label: "Compliance", value: Math.round(((complianceScore - 1) / 2) * 100) },
                        { label: "Resilience", value: Math.round(((resilienceScore - 1) / 2) * 100) }
                    ],
                    pieData: [
                        { label: "Secured", value: strongControls.length, color: "#1cd35c" },
                        { label: "At Risk", value: improvementAreas.length, color: "#f59e0b" },
                        { label: "Critical", value: Math.max(0, 4 - (strongControls.length + improvementAreas.length)), color: "#ef4444" }
                    ],
                    insights,
                    criticalGaps: criticalGaps.slice(0, 3),
                    improvementAreas,
                    strongControls,
                    actionPlan: {
                        days30: "Map all 'Level 1' data flows leaving the country.",
                        days60: "Review and update all Standard Contractual Clauses (SCCs).",
                        days90: "Implement a 'Transfer Impact Assessment' workflow for new vendors."
                    }
                }
            };
        }
    },
];