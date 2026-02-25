import {
    FaGlobe,
    FaCloud,
    FaLock,
    FaDatabase,
    FaClipboardCheck,
    FaKey,
    FaBell,
    FaUserShield,
    FaCertificate,
    FaCar,
    FaServer,
    FaExclamationTriangle,
    FaEye,
    FaHeartbeat,
    FaMoneyBillWave,
    FaShieldAlt
} from "react-icons/fa";

export const solutionsData: Record<string, {
    id: string;
    icon: React.ElementType;
    label: string;
    problem: string;
    angle: string;
    outcome: string;
    description: string;
    workflowLabel: string;
    riskIcon: React.ElementType;
    riskLabel?: string;
    category: string;
}> = {
    "gdpr": {
        id: "gdpr",
        icon: FaGlobe,
        label: "GDPR",
        problem: "Navigating complex GDPR requirements across the EU.",
        angle: "Automated ROPA & DSAR workflows.",
        outcome: "Audit ready compliance.",
        description: "Master the complexities of General Data Protection Regulation.",
        workflowLabel: "GDPR",
        riskIcon: FaExclamationTriangle,
        category: "global-regulations"
    },
    "dpdp-act": {
        id: "dpdp-act",
        icon: FaCloud,
        label: "DPDP ACT",
        problem: "Adapting to India's digital data act.",
        angle: "Consent management & Assessment tools.",
        outcome: "Seamless DPDP Act alignment.",
        description: "Next-gen compliance for India's digital ecosystem.",
        workflowLabel: "DPDPA",
        riskIcon: FaEye,
        riskLabel: "Assessment",
        category: "global-regulations"
    },
    "pdpl": {
        id: "pdpl",
        icon: FaLock,
        label: "PDPL",
        problem: "Strict Saudi data transfer rules.",
        angle: "Cross border assessment handling.",
        outcome: "Secure regional operations without slowing down growth.",
        description: "Navigate Personal Data Protection Laws with precision.",
        workflowLabel: "PDPL",
        riskIcon: FaShieldAlt,
        riskLabel: "Transfer",
        category: "global-regulations"
    },
    "pipl": {
        id: "pipl",
        icon: FaDatabase,
        label: "PIPL",
        problem: "Managing China's data security laws.",
        angle: "Localized security models.",
        outcome: "Risk-free global commerce.",
        description: "Resilient compliance for the Chinese data landscape.",
        workflowLabel: "PIPL",
        riskIcon: FaServer,
        riskLabel: "Localization",
        category: "global-regulations"
    },
    "lgpd": {
        id: "lgpd",
        icon: FaClipboardCheck,
        label: "LGPD",
        problem: "Brazil data rights compliance.",
        angle: "Automated legal basis mapping.",
        outcome: "Full LGPD adherence.",
        description: "Adaptive governance for the Brazilian digital market.",
        workflowLabel: "LGPD",
        riskIcon: FaUserShield,
        riskLabel: "Rights",
        category: "global-regulations"
    },
    "cpra": {
        id: "cpra",
        icon: FaKey,
        label: "CPRA",
        problem: "Evolving California privacy standards.",
        angle: "Automated rights management.",
        outcome: "US market compliance.",
        description: "Master California's privacy standards.",
        workflowLabel: "CPRA",
        riskIcon: FaKey,
        riskLabel: "Privacy Rights",
        category: "global-regulations"
    },
    "hipaa": {
        id: "hipaa",
        icon: FaBell,
        label: "HIPAA",
        problem: "Protecting patient health data.",
        angle: "Encryption & breach detection.",
        outcome: "Trustworthy healthcare data.",
        description: "Fortress-level security for high-sensitivity healthcare data.",
        workflowLabel: "HIPAA",
        riskIcon: FaHeartbeat,
        riskLabel: "Breach Management",
        category: "industry-compliance"
    },
    "glba": {
        id: "glba",
        icon: FaUserShield,
        label: "GLBA",
        problem: "Safeguarding financial info.",
        angle: "Automated privacy notices.",
        outcome: "Financial integrity & trust.",
        description: "Integrity-driven compliance for financial services.",
        workflowLabel: "GLBA",
        riskIcon: FaMoneyBillWave,
        riskLabel: "Notice",
        category: "industry-compliance"
    },
    "iso-27001": {
        id: "iso-27001",
        icon: FaCertificate,
        label: "ISO 27001",
        problem: "Establishing robust ISMS.",
        angle: "ISMS orchestration tool.",
        outcome: "Accelerated certification.",
        description: "Information security mastery through structural alignment.",
        workflowLabel: "ISMS",
        riskIcon: FaLock,
        riskLabel: "Controls",
        category: "management-systems"
    },
    "iso-27701": {
        id: "iso-27701",
        icon: FaServer,
        label: "ISO 27701",
        problem: "Extending security to privacy.",
        angle: "Integrated PIMS framework.",
        outcome: "Holistic privacy governance.",
        description: "Privacy Information Management System extension.",
        workflowLabel: "PIMS",
        riskIcon: FaDatabase,
        riskLabel: "Policy",
        category: "management-systems"
    },
    "tisax": {
        id: "tisax",
        icon: FaCar,
        label: "TISAX",
        problem: "Automotive security standards.",
        angle: "Supply chain risk assessment.",
        outcome: "Certified automotive partner.",
        description: "Secure information exchange for the automotive industry.",
        workflowLabel: "TISAX",
        riskIcon: FaCar,
        riskLabel: "TPRM",
        category: "management-systems"
    }
};
