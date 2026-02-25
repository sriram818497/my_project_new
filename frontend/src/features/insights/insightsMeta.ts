import type { InsightArticle } from "../../types/content";

export type InsightMeta = InsightArticle & {
  contentType: "Article" | "Whitepaper" | "Regulatory Update" | "Report" | "Case Analysis";
  regulation: "GDPR" | "DPDP" | "HIPAA" | "Cross-border";
  topic: "AI Governance" | "Cross-Border" | "RoPA" | "General";
  industry: "Healthcare" | "Financial Services" | "SaaS" | "All Industries";
  publishDate: string;
  updateDate: string;
  author: string;
};

export const INDUSTRY_FILTER_OPTIONS = ["All", "Healthcare", "Financial Services", "SaaS", "All Industries"] as const;
export const REGULATION_FILTER_OPTIONS = ["All", "GDPR", "DPDP", "HIPAA", "Cross-border"] as const;
export const TOPIC_FILTER_OPTIONS = ["All", "AI Governance", "Cross-Border", "RoPA", "General"] as const;
export const TYPE_FILTER_OPTIONS = ["All", "Article", "Whitepaper", "Regulatory Update", "Report", "Case Analysis"] as const;

const parseDateFromLabel = (label: string) => {
  const parts = label.split("|").map((p) => p.trim());
  return parts[1] || "Oct 1, 2025";
};

const contentTypeFromDateLabel = (label: string): InsightMeta["contentType"] => {
  const normalized = label.toLowerCase();
  if (normalized.includes("whitepaper")) return "Whitepaper";
  if (normalized.includes("research")) return "Report";
  if (normalized.includes("case study")) return "Case Analysis";
  if (normalized.includes("tech paper")) return "Article";
  return "Regulatory Update";
};

export const deriveInsightMeta = (articles: InsightArticle[]): InsightMeta[] => {
  return articles.map((article) => {
    const title = article.title.toLowerCase();
    const meta: InsightMeta = {
      ...article,
      contentType: contentTypeFromDateLabel(article.date),
      regulation: title.includes("gdpr") ? "GDPR" : title.includes("cross-border") ? "Cross-border" : title.includes("ai") ? "DPDP" : "HIPAA",
      topic: title.includes("ai") ? "AI Governance" : title.includes("cross-border") ? "Cross-Border" : title.includes("ropa") ? "RoPA" : "General",
      industry: title.includes("health") ? "Healthcare" : title.includes("retail") ? "Financial Services" : "All Industries",
      publishDate: parseDateFromLabel(article.date),
      updateDate: "Feb 20, 2026",
      author: title.includes("gdpr")
        ? "By: Senior Privacy Counsel / CIPP/E, ISO 27701 Lead Auditor"
        : "By: Privacy Governance Practice Lead / CIPP/A, ISO 27001 Implementer",
    };

    if (article.title === "The EU AI Act: What Privacy Teams Need to Know") {
      return {
        ...meta,
        title: "AI Governance in 2026: Regulatory Convergence and Enterprise Implications",
        topic: "AI Governance",
        regulation: "DPDP",
      };
    }
    if (article.title === "Privacy Enhancing Technologies in 2026") {
      return {
        ...meta,
        title: "Cross-Border Data Transfers: Evolving SCCs, Localization Trends, and Risk Mitigation",
        topic: "Cross-Border",
        regulation: "Cross-border",
      };
    }
    return meta;
  });
};

export const getDynamicCta = (activeArticle: InsightMeta | null) => {
  if (!activeArticle) {
    return {
      title: "Brief Me Monthly",
      description: "Receive monthly regulatory intelligence curated for compliance leaders.",
      buttonText: "Get Monthly Brief",
      href: "/book-demo",
    };
  }

  if (activeArticle.topic === "AI Governance") {
    return {
      title: "Assess Your AI Governance Readiness",
      description: "Benchmark policies, controls, and risk management workflows against evolving AI governance expectations.",
      buttonText: "Start AI Readiness Assessment",
      href: "/tools",
    };
  }
  if (activeArticle.topic === "Cross-Border") {
    return {
      title: "Run Vendor Risk Health Check",
      description: "Identify transfer-related vendor risks, SCC dependency, and data localization exposure.",
      buttonText: "Run Vendor Risk Health Check",
      href: "/tools",
    };
  }
  return {
    title: "Brief Me Monthly",
    description: "Receive monthly regulatory intelligence curated for compliance leaders.",
    buttonText: "Get Monthly Brief",
    href: "/book-demo",
  };
};
