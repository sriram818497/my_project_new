export type GlossaryType = {
  [key: string]: { term: string; definition: string; category?: string }[];
};

export type GlossaryEntry = { term: string; definition: string; category?: string };

export const GLOSSARY: GlossaryType = {
    A: [
      {
        term: "Accountability",
        definition: "The obligation of organizations to demonstrate compliance with data protection principles.",
        category: "Compliance",
      },
      {
        term: "Access Control",
        definition: "Measures to ensure that only authorized individuals can access specific data or systems.",
        category: "Security",
      },
      {
        term: "Access Request",
        definition: "A formal request by a data subject to obtain a copy of their personal data held by an organization.",
        category: "Rights",
      },
      {
        term: "Anonymization",
        definition: "The irreversible process of removing personally identifiable information so that data cannot be linked back to an individual.",
        category: "Technical",
      },
      {
        term: "Appropriate Safeguards",
        definition: "Technical and organizational measures to protect personal data during processing or transfer.",
        category: "Security",
      },
      {
        term: "Audit Trail",
        definition: "A chronological record that provides evidence of activities related to data processing.",
        category: "Compliance",
      },
    ],
    B: [
      {
        term: "Binding Corporate Rules (BCRs)",
        definition: "Internal policies adopted by multinational organizations to ensure adequate protection of personal data transferred between entities.",
        category: "Compliance",
      },
      {
        term: "Biometric Data",
        definition: "Personal data resulting from specific technical processing relating to physical or behavioral characteristics.",
        category: "Technical",
      },
      {
        term: "Blacklist",
        definition: "A list of entities, IP addresses, or data elements that are explicitly denied access.",
        category: "Security",
      },
      {
        term: "Breached Entity",
        definition: "An organization that has suffered a data breach involving unauthorized access to personal data.",
        category: "Security",
      },
    ],
    C: [
      {
        term: "CCPA (California Consumer Privacy Act)",
        definition: "A U.S. state law granting California residents rights over their personal information.",
        category: "Regulations",
      },
      {
        term: "Child's Data",
        definition: "Personal data relating to children, often subject to stricter protections.",
        category: "Technical",
      },
      {
        term: "Cloud Storage",
        definition: "Remote servers used to store and manage data.",
        category: "Technical",
      },
      {
        term: "Compliance",
        definition: "Adherence to applicable laws, regulations, and standards governing data protection.",
        category: "Compliance",
      },
      {
        term: "Consent",
        definition: "Freely given, specific, informed, and unambiguous agreement by a data subject.",
        category: "Rights",
      },
      {
        term: "Controller",
        definition: "An entity that determines the purposes and means of processing personal data.",
        category: "Compliance",
      },
      {
        term: "Cookie",
        definition: "Small text files stored on a user's device to track activity or preferences.",
        category: "Technical",
      },
      {
        term: "CPRA",
        definition: "An amendment to CCPA introducing additional protections.",
        category: "Regulations",
      },
      {
        term: "Cross-Border Data Transfer",
        definition: "Movement of personal data from one jurisdiction to another.",
        category: "Compliance",
      },
      {
        term: "Cybersecurity Incident",
        definition: "Any event that compromises confidentiality, integrity, or availability of data.",
        category: "Security",
      },
    ],
    D: [
      {
        term: "Data Breach",
        definition: "A security incident where personal data is accidentally or unlawfully accessed or disclosed.",
        category: "Security",
      },
      {
        term: "Data Erasure",
        definition: "The right of individuals to request deletion of their personal data.",
        category: "Rights",
      },
      {
        term: "Data Inventory",
        definition: "A comprehensive catalog of data assets within an organization.",
        category: "Technical",
      },
      {
        term: "Data Mapping",
        definition: "Documenting how personal data flows through systems.",
        category: "Technical",
      },
      {
        term: "Data Minimization",
        definition: "Collecting only data necessary for specific purposes.",
        category: "Compliance",
      },
      {
        term: "Data Portability",
        definition: "The right to receive personal data in structured format.",
        category: "Rights",
      },
      {
        term: "Data Processor",
        definition: "An entity processing data on behalf of a controller.",
        category: "Compliance",
      },
      {
        term: "Data Protection Authority (DPA)",
        definition: "Regulatory body responsible for enforcing data protection laws.",
        category: "Regulations",
      },
      {
        term: "Data Protection Impact Assessment (DPIA)",
        definition: "Risk assessment to identify and mitigate data processing risks.",
        category: "Compliance",
      },
      {
        term: "Data Subject",
        definition: "An individual whose personal data is processed.",
        category: "Rights",
      },
      {
        term: "Derived Data",
        definition: "Data generated by analyzing raw data.",
        category: "Technical",
      },
      {
        term: "Direct Marketing",
        definition: "Promotional communication directed at individuals.",
        category: "Compliance",
      },
      {
        term: "Dynamic Consent",
        definition: "Flexible approach to obtaining ongoing consent.",
        category: "Rights",
      },
    ],
    E: [
      {
        term: "Encryption",
        definition: "The process of converting data into coded format to prevent unauthorized access.",
        category: "Technical",
      },
      {
        term: "Explicit Consent",
        definition: "Clear affirmative agreement by a data subject.",
        category: "Rights",
      },
      {
        term: "Erasure Request",
        definition: "A request by a data subject to have their personal data deleted.",
        category: "Rights",
      },
    ],
    F: [
      {
        term: "FERPA",
        definition: "U.S. federal law protecting privacy of student education records.",
        category: "Regulations",
      },
      {
        term: "Fine",
        definition: "Monetary penalties imposed for violations of data protection laws.",
        category: "Compliance",
      },
      {
        term: "First-Party Data",
        definition: "Data collected directly from individuals by an organization.",
        category: "Technical",
      },
      {
        term: "Fraud Prevention",
        definition: "Measures to detect and prevent fraudulent activities involving personal data.",
        category: "Security",
      },
    ],
    G: [
      {
        term: "GDPR",
        definition: "European Union regulation governing protection of personal data.",
        category: "Regulations",
      },
      {
        term: "Genetic Data",
        definition: "Personal data relating to inherited or acquired genetic characteristics.",
        category: "Technical",
      },
      {
        term: "Geolocation Data",
        definition: "Information about the physical location of an individual or device.",
        category: "Technical",
      },
    ],
    H: [
      {
        term: "HIPAA",
        definition: "U.S. law protecting sensitive patient health information.",
        category: "Regulations",
      },
      {
        term: "Hashing",
        definition: "Technique used to transform data into fixed-length string.",
        category: "Technical",
      },
    ],
    I: [
      {
        term: "ICO",
        definition: "The UK's independent authority responsible for enforcing data protection laws.",
        category: "Regulations",
      },
      {
        term: "Identifiers",
        definition: "Data elements that directly or indirectly identify an individual.",
        category: "Technical",
      },
      {
        term: "International Data Transfer",
        definition: "Transfer of personal data outside the jurisdiction collected.",
        category: "Compliance",
      },
      {
        term: "IP Address",
        definition: "Unique numerical label assigned to devices connected to a network.",
        category: "Technical",
      },
    ],
    J: [
      {
        term: "Joint Controllers",
        definition: "Two or more entities jointly determining processing purposes.",
        category: "Compliance",
      },
    ],
    K: [
      {
        term: "K-Anonymity",
        definition: "A property of a dataset where each individual's information cannot be distinguished from at least k-1 other individuals.",
        category: "Technical",
      },
      {
        term: "Key Management",
        definition: "The strategic management of cryptographic keys throughout their entire lifecycle including generation, storage, and retirement.",
        category: "Security",
      },
    ],
    L: [
      {
        term: "LGPD",
        definition: "Brazilâ€™s general data protection law.",
        category: "Regulations",
      },
      {
        term: "Lawful Basis",
        definition: "Legal justification for processing personal data.",
        category: "Compliance",
      },
      {
        term: "Legitimate Interest",
        definition: "Processing necessary for legitimate interests pursued by controller.",
        category: "Compliance",
      },
    ],
    M: [
      {
        term: "Metadata",
        definition: "Data providing information about other data.",
        category: "Technical",
      },
      {
        term: "Masking",
        definition: "Obfuscation technique hiding parts of sensitive data.",
        category: "Technical",
      },
      {
        term: "Monitoring",
        definition: "Observing or tracking individuals' behavior.",
        category: "Security",
      },
    ],
    N: [
      {
        term: "Notification",
        definition: "Informing individuals or regulators about data breach.",
        category: "Compliance",
      },
      {
        term: "Non-Compliance",
        definition: "Failure to adhere to data protection laws.",
        category: "Compliance",
      },
    ],
    O: [
      {
        term: "Obfuscation",
        definition: "Techniques used to obscure sensitive data.",
        category: "Technical",
      },
      {
        term: "Opt-In/Opt-Out",
        definition: "Mechanisms allowing individuals to choose data collection preferences.",
        category: "Rights",
      },
    ],
    P: [
      {
        term: "Personal Data",
        definition: "Any information relating to identified or identifiable person.",
        category: "Technical",
      },
      {
        term: "PII",
        definition: "Information used to distinguish or trace identity.",
        category: "Technical",
      },
      {
        term: "PIPL",
        definition: "Chinaâ€™s data protection law.",
        category: "Regulations",
      },
      {
        term: "Portability Request",
        definition: "Request to receive personal data in portable format.",
        category: "Rights",
      },
      {
        term: "Privacy by Design",
        definition: "Embedding privacy considerations into systems design.",
        category: "Compliance",
      },
      {
        term: "Privacy Notice",
        definition: "Document informing individuals about data collection.",
        category: "Compliance",
      },
      {
        term: "Profiling",
        definition: "Automated processing to evaluate personal aspects.",
        category: "Technical",
      },
      {
        term: "Pseudonymization",
        definition: "Replacing identifiable data with pseudonyms.",
        category: "Technical",
      },
    ],
    Q: [
      {
        term: "Quasi-Identifier",
        definition: "Data elements that are not unique identifiers by themselves but can identify an individual when combined with other data.",
        category: "Technical",
      },
      {
        term: "Questionnaire (Assessment)",
        definition: "Sets of standardized questions used to evaluate vendor risk or internal data protection compliance.",
        category: "Compliance",
      },
    ],
    R: [
      {
        term: "Record of Processing Activities (RoPA)",
        definition: "Document detailing organizationâ€™s data processing activities.",
        category: "Compliance",
      },
      {
        term: "Redaction",
        definition: "Removing sensitive information from documents.",
        category: "Technical",
      },
      {
        term: "Retention Period",
        definition: "Duration personal data may be stored.",
        category: "Compliance",
      },
      {
        term: "Right to Rectification",
        definition: "Right to correct inaccurate data.",
        category: "Rights",
      },
      {
        term: "Right to Restriction of Processing",
        definition: "Right to limit processing of personal data.",
        category: "Rights",
      },
      {
        term: "Risk Assessment",
        definition: "Process to identify and evaluate data security risks.",
        category: "Compliance",
      },
    ],
    S: [
      {
        term: "SCCs",
        definition: "Pre-approved contractual terms for lawful international transfers.",
        category: "Compliance",
      },
      {
        term: "Sensitive Personal Data",
        definition: "Special categories requiring higher protection.",
        category: "Technical",
      },
      {
        term: "Subject Access Request (SAR)",
        definition: "Formal request to access personal data.",
        category: "Rights",
      },
      {
        term: "Supervisory Authority",
        definition: "Regulatory body enforcing data protection laws.",
        category: "Regulations",
      },
    ],
    T: [
      {
        term: "Third-Party Processor",
        definition: "Entity processing data on behalf of controller.",
        category: "Compliance",
      },
      {
        term: "Tokenization",
        definition: "Replacing sensitive data with non-sensitive placeholders.",
        category: "Technical",
      },
      {
        term: "Transparency",
        definition: "Clear communication on how data is collected and used.",
        category: "Compliance",
      },
    ],
    U: [
      {
        term: "User Rights",
        definition: "Rights granted under data protection laws.",
        category: "Rights",
      },
      {
        term: "Unstructured Data",
        definition: "Data not following predefined model or schema.",
        category: "Technical",
      },
    ],
    V: [
      {
        term: "Violation",
        definition: "Breach of data protection principles.",
        category: "Compliance",
      },
      {
        term: "Vendor Management",
        definition: "Overseeing third-party vendors for compliance.",
        category: "Compliance",
      },
    ],
    W: [
      {
        term: "Whitelist",
        definition: "List of entities explicitly allowed access.",
        category: "Security",
      },
    ],
    X: [
      {
        term: "XSS (Cross-Site Scripting)",
        definition: "A security vulnerability where malicious scripts are injected into web pages, potentially used to steal personal data.",
        category: "Security",
      },
    ],
    Y: [
      {
        term: "Yearly Privacy Audit",
        definition: "An annual comprehensive review of an organization's data protection practices and regulatory compliance status.",
        category: "Compliance",
      },
    ],
    Z: [
      {
        term: "Zero Trust Architecture",
        definition: "Security model assuming no user or device is inherently trustworthy.",
        category: "Security",
      },
    ],
  };
