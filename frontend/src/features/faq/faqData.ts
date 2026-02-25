import { Shield, Globe, BookOpen, Map, Layout, TrendingUp } from "lucide-react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPopular?: boolean;
}

export const FAQ_DATA: FAQItem[] = [
  // Data Security
  {
    id: "sec-1",
    category: "Data Security",
    question: "How does Proteccio ensure the physical security of my data?",
    answer: "We utilize top-tier cloud providers with Tier 4 data centers. All data is protected with **AES-256 encryption** at rest and **TLS 1.3** in transit. Our infrastructure is continuously monitored for physical and digital intrusions.",
    isPopular: true
  },
  {
    id: "sec-2",
    category: "Data Security",
    question: "How does Proteccio conduct penetration testing?",
    answer: "We enforce a zero-critical-vulnerability policy across all production environments, supported by continuous automated scans and quarterly third-party penetration testing.",
  },
  {
    id: "sec-3",
    category: "Data Security",
    question: "How does Proteccio manage encryption key management?",
    answer: "We use **Hardware Security Modules (HSM)** and industry-standard key management services. Keys are rotated automatically every 90 days and are never stored in plain text or alongside encrypted data.",
  },
  {
    id: "sec-4",
    category: "Data Security",
    question: "How does Proteccio support multi-factor authentication (MFA)?",
    answer: "Yes, Proteccio supports **MFA** via Authenticator apps, SMS, and hardware keys (WebAuthn). We also integrate with **SSO** providers like Okta, Azure AD, and Google Workspace.",
  },
  {
    id: "sec-5",
    category: "Data Security",
    question: "What is your data backup and recovery policy?",
    answer: "Data is backed up hourly with geographically redundant storage. Our **RPO (Recovery Point Objective)** is less than 1 hour, and our **RTO (Recovery Time Objective)** is less than 4 hours for critical services.",
  },
  {
    id: "sec-6",
    category: "Data Security",
    question: "Is Proteccio SOC 2 Type II certified?",
    answer: "Yes, we undergo annual **SOC 2 Type II** audits covering the Security, Availability, and Confidentiality trust principles. Reports are available to customers under NDA.",
  },

  // Compliance & Regulations
  {
    id: "comp-1",
    category: "Compliance & Regulations",
    question: "Does Proteccio support GDPR compliance?",
    answer: "Absolutely. Proteccio was built with **GDPR**-first architecture. We provide all necessary tools for DPO oversight, consent management, and automated Data Subject Access Requests (DSARs).",
    isPopular: true
  },
  {
    id: "comp-2",
    category: "Compliance & Regulations",
    question: "How does the platform handle the new India DPDP Act?",
    answer: "Our platform is updated to support the **Digital Personal Data Protection (DPDP) Act**. We include specific modules for 'Consent Managers' and 'Data Fiduciaries' as required by Indian law.",
  },
  {
    id: "comp-3",
    category: "Compliance & Regulations",
    question: "Does the platform support ISO 27701 certification readiness?",
    answer: "Yes. Proteccio provides a direct mapping to **ISO 27701** controls, helping you document and prove your Privacy Information Management System (PIMS) readiness to auditors.",
  },
  {
    id: "comp-4",
    category: "Compliance & Regulations",
    question: "Does the platform support CCPA and CPRA compliance?",
    answer: "Yes, we provide specialized workflows for **CCPA/CPRA**, including automated 'Do Not Sell or Share My Info' request handling and notice at collection management.",
  },
  {
    id: "comp-5",
    category: "Compliance & Regulations",
    question: "How do you keep up with changing global privacy laws?",
    answer: "Our legal team and automated regulatory tracking system monitor over **120 jurisdictions**. When laws change, we update relevant control mappings and assessment templates automatically.",
  },
  {
    id: "comp-6",
    category: "Compliance & Regulations",
    question: "How does Proteccio support HIPAA compliance for healthcare organizations?",
    answer: "Yes, our data discovery tools specifically identify **Protected Health Information (PHI)** and map it to **HIPAA** Security and Privacy Rule requirements for healthcare providers and business associates.",
  },
  {
    id: "comp-7",
    category: "Compliance & Regulations",
    question: "Is there support for the Brazilian LGPD?",
    answer: "Yes, we include full support for **LGPD**, matching GDPR-like requirements to the specific terminology and reporting formats required by the Brazilian ANPD.",
  },

  // Data Mapping & Risk
  {
    id: "map-1",
    category: "Data Mapping & Risk",
    question: "How automated is the data discovery process?",
    answer: "We offer 'Smart Scanners' that connect to your databases and SaaS apps to automatically identify and classify PII. This eliminates the need for manual spreadsheets in **Data Mapping**.",
    isPopular: true
  },
  {
    id: "map-2",
    category: "Data Mapping & Risk",
    question: "What kind of risk scoring do you provide?",
    answer: "We calculate a dynamic 'Privacy Risk Score' based on data sensitivity, volume, and jurisdiction. It helps legal teams prioritize their **DPIA** (Data Protection Impact Assessment) efforts.",
  },
  {
    id: "map-3",
    category: "Data Mapping & Risk",
    question: "Can we manually override automated classifications?",
    answer: "Absolutely. While our AI is highly accurate, **DPOs** always have the final say. You can manually reclassify any data point and the system will learn from your corrections.",
  },
  {
    id: "map-4",
    category: "Data Mapping & Risk",
    question: "Does Proteccio support discovery and classification of unstructured data (e.g., PDFs, emails)?",
    answer: "Yes, our advanced scanners can search through **Unstructured Data** in cloud storage (S3, GCS) and communication platforms (Slack, Teams) to find forgotten PII.",
  },
  {
    id: "map-5",
    category: "Data Mapping & Risk",
    question: "How often are the data maps updated?",
    answer: "You can schedule scans to run **Daily, Weekly, or Monthly**. Most customers run weekly scans to catch new database columns or SaaS integrations as they occur.",
  },
  {
    id: "map-6",
    category: "Data Mapping & Risk",
    question: "Can we visualize data flows between countries?",
    answer: "Yes, our **Data Flow Visualizer** creates a real-time world map showing where data is collected, where it is stored, and where it is being transferred internationally.",
  },

  // Cross-Border Transfers
  {
    id: "trans-1",
    category: "Cross-Border Transfers",
    question: "How do you help with SCCs and international data transfers?",
    answer: "The platform generates and manages **Standard Contractual Clauses (SCCs)** automatically. It also includes built-in 'Transfer Impact Assessments' to evaluate the safety of exporting data to non-adequate countries.",
  },
  {
    id: "trans-2",
    category: "Cross-Border Transfers",
    question: "Does Proteccio support data localization requirements?",
    answer: "Yes, our regional routing features help you comply with **Data Residency** laws by ensuring certain data types never leave their country of origin (e.g., KSA, UAE, China).",
  },
  {
    id: "trans-3",
    category: "Cross-Border Transfers",
    question: "What happens if a country's adequacy status changes?",
    answer: "Proteccio sends an **Immediate Alert** to your compliance team if a jurisdiction's legal status changes (e.g., Schrems II style rulings). It then points you to the specific transfers that need new legal safeguards.",
  },
  {
    id: "trans-4",
    category: "Cross-Border Transfers",
    question: "Do you support the Trans-Atlantic Data Privacy Framework?",
    answer: "Yes, we fully support the **EU-U.S. Data Privacy Framework**. We help organizations verify if their U.S. partners are certified and document the transfer accordingly.",
  },
  {
    id: "trans-5",
    category: "Cross-Border Transfers",
    question: "Can we track 4th-party (sub-processor) data transfers?",
    answer: "Yes, Proteccio maps your entire **Supply Chain**. You can see where your vendors are sending your data, helping you manage the cascade of privacy risks across your ecosystem.",
  },

  // Platform & Implementation
  {
    id: "plat-1",
    category: "Platform & Implementation",
    question: "How long does a typical implementation take?",
    answer: "Most mid-market organizations are up and running within **2-4 weeks**. Enterprise deployments with complex legacy integrations typically take 2-3 months.",
  },
  {
    id: "plat-2",
    category: "Platform & Implementation",
    question: "Do you offer API access for custom integrations?",
    answer: "Yes, Proteccio offers a robust **REST API** and webhooks, allowing your engineering team to bake privacy controls directly into your own products and workflows.",
  },
  {
    id: "plat-3",
    category: "Platform & Implementation",
    question: "Is Proteccio a single-tenant or multi-tenant platform?",
    answer: "We offer both. Most customers use our highly secure **Multi-tenant cloud**, but we also offer **Private Instances** for high-security enterprise requirements.",
  },
  {
    id: "plat-4",
    category: "Platform & Implementation",
    question: "What kind of training is provided for our staff?",
    answer: "We provide on-demand video training, a comprehensive knowledge base, and **Live Onboarding Sessions** for your legal and tech teams to ensure maximum platform adoption.",
  },
  {
    id: "plat-5",
    category: "Platform & Implementation",
    question: "Can we host Proteccio on our own servers (On-Prem)?",
    answer: "While we are primarily a SaaS provider, we offer **Hybrid Cloud** options where data collection agents reside in your network, ensuring sensitive logs never leave your perimeter.",
  },

  // Business Value
  {
    id: "val-1",
    category: "Business Value",
    question: "How does Proteccio shorten our sales cycles?",
    answer: "By creating a 'Trust Center' where you can share your compliance posture with prospects, you reduce the time spent on lengthy security questionnaires by up to **60%**.",
    isPopular: true
  },
  {
    id: "val-2",
    category: "Business Value",
    question: "What is the ROI of automated privacy?",
    answer: "Automated privacy reduces the man-hours required for compliance by **70%** and significantly lowers the risk of regulatory finesâ€”which can reach 4% of global turnover under GDPR.",
  },
  {
    id: "val-3",
    category: "Business Value",
    question: "Can Proteccio help reduce cyber insurance premiums?",
    answer: "Many insurers view automated data governance as a major **Risk Mitigant**. By demonstrating active data discovery and disposal, organizations often negotiate lower premiums for cyber liability coverage.",
  },
  {
    id: "val-4",
    category: "Business Value",
    question: "How does this help during investor due diligence?",
    answer: "During M&A or funding rounds, Proteccio provides an instant **Privacy Trust Score** and clean documentation, proving to investors that the company has no hidden 'toxic data' liabilities.",
  },
  {
    id: "val-5",
    category: "Business Value",
    question: "Does Proteccio help improve customer trust?",
    answer: "Yes, by providing a transparent **Privacy Portal** for your customers to manage their own data, you transform compliance from a legal checklist into a core brand differentiator that builds loyalty.",
  }
];

export const CATEGORIES = [
  { id: "Data Security", icon: Shield },
  { id: "Compliance & Regulations", icon: BookOpen },
  { id: "Data Mapping & Risk", icon: Map },
  { id: "Cross-Border Transfers", icon: Globe },
  { id: "Platform & Implementation", icon: Layout },
  { id: "Business Value", icon: TrendingUp },
];


