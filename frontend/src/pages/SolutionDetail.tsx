import { Link, useLocation, useParams } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CheckCircle,
  FileText,
  Globe,
  Lock,
  Shield,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { solutionsData } from "../data/solutionsData";

const GdprDetailPage = () => (
  <div className="min-h-screen bg-transparent text-white font-jakarta relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/8 via-transparent to-transparent pointer-events-none opacity-40 transition-all duration-1000" />
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-8%] right-[-6%] w-[520px] h-[520px] bg-[#1cd35c]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-12%] left-[-8%] w-[560px] h-[560px] bg-[#1cd35c]/6 blur-[120px] rounded-full" />
    </div>

    <section className="relative pt-28 pb-12 md:pt-28 md:pb-16 overflow-hidden z-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 border border-[#1cd35c]/20 rounded-full text-[#1cd35c] text-[11px] font-black uppercase tracking-widest mb-6">
            Global Regulation
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-white mb-6">
            GDPR Compliance <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">That Scales with You</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed max-w-3xl mx-auto">
            Build, operate, and prove GDPR readiness with structured workflows for records, rights, risk, and cross-border accountability.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {[
            { label: "Regulation", value: "EU GDPR" },
            { label: "Coverage", value: "Articles 5-32" },
            { label: "Workflow", value: "ROPA + DSAR + DPIA" },
            { label: "Outcome", value: "Audit Ready" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{item.label}</p>
              <p className="mt-2 text-sm md:text-base font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="relative py-8 z-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">About This Framework</h2>
          <p className="text-white/70 leading-relaxed">
            GDPR is not a one-time checklist. Proteccio operationalizes privacy principles into repeatable controls across data mapping, lawful basis tracking,
            rights handling, retention, and processor governance so teams stay compliant as systems evolve.
          </p>
          <div className="mt-6 space-y-3">
            {[
              "Article-aligned compliance playbooks",
              "Evidence-first documentation model",
              "Role-based accountability across business and engineering",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-[#1cd35c] mt-1 shrink-0" />
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[#1cd35c]/30 bg-gradient-to-br from-[#1cd35c]/20 to-[#1cd35c]/5 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">What This Enables</h2>
          <div className="space-y-4">
            {[
              "Faster DSAR response with complete response traceability",
              "Clear records of processing and lawful basis decisions",
              "Consistent DPIA execution for high-risk processing",
              "Proactive transfer and processor risk management",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1cd35c] mt-2.5 shrink-0" />
                <span className="text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="relative py-10 z-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl md:text-5xl font-black text-white mb-10">
          Core <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Capabilities</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { title: "Records of Processing", icon: FileText, text: "Maintain current ROPA with ownership, purpose, systems, and retention mapping." },
            { title: "Data Subject Rights", icon: Users, text: "Track, route, and fulfill rights requests with SLA and evidence management." },
            { title: "DPIA Workflows", icon: Shield, text: "Run impact assessments consistently for high-risk processing operations." },
            { title: "Consent & Notices", icon: CheckCircle, text: "Align consent, transparency, and policy disclosures to legal requirements." },
            { title: "Transfer Governance", icon: Globe, text: "Manage cross-border transfer controls and legal mechanism tracking." },
            { title: "Control Monitoring", icon: Activity, text: "Monitor ongoing control effectiveness and demonstrate audit readiness." },
          ].map((card) => (
            <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="w-10 h-10 rounded-lg bg-[#1cd35c]/10 border border-[#1cd35c]/20 flex items-center justify-center mb-4">
                <card.icon className="w-5 h-5 text-[#1cd35c]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
              <p className="text-white/70 leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="relative pb-14 md:pb-16 pt-2 z-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-[#1cd35c]/30 bg-gradient-to-r from-[#1cd35c]/20 to-[#1cd35c]/5 p-8 md:p-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#1cd35c]/15 border border-[#1cd35c]/25 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-[#1cd35c]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Operationalize GDPR?</h2>
          <p className="max-w-3xl mx-auto text-white/80 leading-relaxed mb-8">
            Work with Proteccio to turn GDPR obligations into a practical operating model for legal, privacy, and engineering teams.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-3 bg-[#1cd35c] text-white rounded-full font-bold hover:bg-[#19b850] transition-all"
            >
              Talk to an Expert <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              to="/book-demo"
              className="px-8 py-3 border-2 border-[#1cd35c] text-[#1cd35c] rounded-full font-bold hover:bg-[#1cd35c] hover:text-white transition-all"
            >
              Book a Free Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const DpdpaDetailPage = () => {
  const steps = [
    {
      title: "1. We Start with a DPDPA Readiness Assessment",
      text: "We begin by assessing your current data practices against DPDPA requirements. You'll get a clear, actionable roadmap that highlights compliance gaps and prioritizes remediation.",
    },
    {
      title: "2. We Help You Identify Your Role",
      text: "We help you determine whether you're a Data Fiduciary, Significant Data Fiduciary, or Data Processor under the Act. This clarity ensures you apply the right obligations, from consent management to DPIAs and reporting.",
    },
    {
      title: "3. We Build Your Privacy Governance Framework",
      text: "We help you establish policies, procedures, and governance structures aligned with DPDPA. From consent mechanisms to grievance redressal, we ensure your privacy operations are audit-ready.",
    },
    {
      title: "4. We Operationalize Consent & Notice Management",
      text: "We design and implement consent workflows and privacy notices that are DPDPA-compliant and user-friendly. This ensures transparency and builds trust with your customers and data principals.",
    },
    {
      title: "5. We Enable Data Principal Rights Management",
      text: "We help you set up systems to manage access, correction, erasure, and grievance requests. Our automation tools streamline DSARs and ensure timely, compliant responses.",
    },
    {
      title: "6. We Conduct DPIAs & Risk Assessments",
      text: "We guide you through Data Protection Impact Assessments (DPIAs) for high-risk processing activities. This helps you identify and mitigate privacy risks before they become liabilities.",
    },
    {
      title: "7. We Train Your Teams",
      text: "We deliver role-based training to ensure your employees understand their responsibilities under DPDPA. This builds a privacy-aware culture and reduces the risk of non-compliance.",
    },
    {
      title: "8. We Help You Prepare for Breach Response",
      text: "We help you build incident response playbooks and breach notification protocols. This ensures you're ready to act quickly and compliantly in the event of a data breach.",
    },
    {
      title: "9. We Support You Through Compliance Audits",
      text: "We assist with documentation, internal reviews, and regulator-facing readiness. Whether it's a voluntary audit or a regulatory inquiry, we've got your back.",
    },
    {
      title: "10. We Help You Stay Compliant",
      text: "DPDPA compliance is ongoing. We offer continuous support to adapt to regulatory updates and business changes. From policy refreshes to tech upgrades, we help you stay ahead of the curve.",
    },
  ];

  const whyProteccio = [
    "Deep expertise in DPDPA, GDPR, ISO 27701, and global privacy laws",
    "Founder-led, hands-on engagement",
    "Automation tools for DSARs, RoPA, and consent management",
    "Industry-specific frameworks for finance, healthcare, edtech, and more",
    "Scalable for startups and large enterprises alike",
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-jakarta relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/8 via-transparent to-transparent pointer-events-none opacity-40 transition-all duration-1000" />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-8%] right-[-6%] w-[520px] h-[520px] bg-[#1cd35c]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-12%] left-[-8%] w-[560px] h-[560px] bg-[#1cd35c]/6 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-28 pb-12 md:pt-28 md:pb-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
                How Proteccio Helps You Become <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">DPDPA Compliant</span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed">
                India's Digital Personal Data Protection Act (DPDPA), 2023 is a landmark regulation that redefines how personal data must be collected, processed, and protected. At Proteccio Data, we don't just help you meet the law we help you build a privacy-first culture that earns trust and drives responsible innovation. Whether you're a startup, a digital-first enterprise, or a global company operating in India, we bring the right mix of legal insight, operational expertise, and automation tools to help you comply with DPDPA efficiently and sustainably.
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white mt-10 mb-8">Here's how we help:</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <h3 className="text-lg md:text-xl font-black text-white leading-snug">{item.title}</h3>
                  <p className="text-white/70 mt-3 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#1cd35c]/20 bg-[#1cd35c]/10 p-6">
              <h3 className="text-center text-2xl md:text-3xl font-black text-white mb-5">Why Proteccio?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {whyProteccio.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#1cd35c] mt-1 shrink-0" />
                    <span className="text-white/85">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#1cd35c] px-6 py-5 text-center text-white font-bold text-sm md:text-xl leading-snug">
              Let's build a privacy-first future that's compliant, transparent, and trusted. With Proteccio, DPDPA compliance isn't just achievable it's empowering.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const PdplDetailPage = () => {
  const steps = [
    {
      title: "1. We Start with a PDPL Readiness Assessment",
      text: "We assess your current data practices against PDPL's legal, technical, and operational requirements. You'll get a clear roadmap that highlights compliance gaps and outlines prioritized actions.",
    },
    {
      title: "2. We Help You Identify Your Role & Risk Profile",
      text: "We clarify whether you're a data controller, data processor, or both and what that means under PDPL. This ensures you apply the right obligations, including registration, consent, and cross-border data transfer rules.",
    },
    {
      title: "3. We Build Your Privacy Governance Framework",
      text: "We help you establish PDPL-aligned policies, procedures, and internal controls. From data minimization to retention schedules, we ensure your privacy program is regulator-ready.",
    },
    {
      title: "4. We Operationalize Consent & Purpose Limitation",
      text: "We design workflows for obtaining explicit, freely given, and revocable consent a cornerstone of PDPL. This ensures lawful processing and builds transparency with Saudi data subjects.",
    },
    {
      title: "5. We Enable Data Subject Rights Management",
      text: "We help you implement systems to manage access, correction, deletion, and objection requests. Our automation tools streamline these processes and ensure timely, compliant responses.",
    },
    {
      title: "6. We Conduct Risk Assessments & DPIAs",
      text: "We guide you through Data Protection Impact Assessments (DPIAs) for high-risk processing activities. This helps you identify and mitigate privacy risks before they become regulatory issues.",
    },
    {
      title: "7. We Localize Your Data Infrastructure",
      text: "We help you meet data localization and cross-border transfer requirements under PDPL. This ensures compliance with one of the law's most critical and complex mandates.",
    },
    {
      title: "8. We Train Your Teams on PDPL Responsibilities",
      text: "We deliver role-based training to ensure your staff understands their obligations under PDPL. This builds a privacy-aware culture and reduces the risk of non-compliance.",
    },
    {
      title: "9. We Prepare You for Regulatory Reviews",
      text: "We assist with documentation, internal audits, and readiness for inquiries from Saudi regulators. Whether it's a proactive review or a response to a complaint, we've got your back.",
    },
    {
      title: "10. We Help You Stay Compliant",
      text: "PDPL compliance is ongoing. We offer continuous support to adapt to regulatory updates and operational changes. From policy refreshes to vendor reviews, we help you maintain a strong privacy posture in the Kingdom.",
    },
  ];

  const whyProteccio = [
    "Deep expertise in PDPL, GDPR, DPDPA, ISO 27701, and global privacy laws",
    "Founder-led, hands-on engagement",
    "Automation tools for DSARs, consent, and risk assessments",
    "Localization support for data residency and cross-border compliance",
    "Scalable for startups, enterprises, and multinational organizations",
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-jakarta relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/8 via-transparent to-transparent pointer-events-none opacity-40 transition-all duration-1000" />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-8%] right-[-6%] w-[520px] h-[520px] bg-[#1cd35c]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-12%] left-[-8%] w-[560px] h-[560px] bg-[#1cd35c]/6 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-28 pb-12 md:pt-28 md:pb-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
                How Proteccio Helps You Become <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">PDPL Compliant</span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed">
                Saudi Arabia's Personal Data Protection Law (PDPL) is a comprehensive privacy regulation that governs how personal data of individuals in the Kingdom is collected, processed, stored, and transferred. Whether you're a local business or a global company handling Saudi residents' data, PDPL compliance is essential for building trust and avoiding penalties. At Proteccio Data, we help you go beyond legal checklists. We bring together regulatory insight, privacy engineering, and operational expertise to help you meet PDPL requirements efficiently, ethically, and at scale.
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white mt-10 mb-8">Here's how we help:</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <h3 className="text-lg md:text-xl font-black text-white leading-snug">{item.title}</h3>
                  <p className="text-white/70 mt-3 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#1cd35c]/20 bg-[#1cd35c]/10 p-6">
              <h3 className="text-center text-2xl md:text-3xl font-black text-white mb-5">Why Proteccio?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {whyProteccio.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#1cd35c] mt-1 shrink-0" />
                    <span className="text-white/85">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#1cd35c] px-6 py-5 text-center text-white font-bold text-sm md:text-xl leading-snug">
              Let's build a privacy-first organization that earns trust in one of the Middle East's fastest-growing digital economies. With Proteccio, PDPL compliance isn't just achievable it's strategic.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const PiplDetailPage = () => {
  const steps = [
    {
      title: "1. We Start with a PIPL Readiness Assessment",
      text: "We assess your current data practices against PIPL's legal, operational, and technical requirements. You'll get a clear roadmap that highlights compliance gaps and outlines prioritized actions.",
    },
    {
      title: "2. We Help You Identify Your Role & Risk Level",
      text: "We clarify whether you're a personal information handler, entrusted party, or critical information infrastructure operator (CIIO). This ensures you apply the right obligations, including localization, consent, and cross-border transfer rules.",
    },
    {
      title: "3. We Build Your Privacy Governance Framework",
      text: "We help you establish PIPL-aligned policies, procedures, and internal controls. From consent management to data classification, we ensure your privacy program is regulator-ready.",
    },
    {
      title: "4. We Operationalize Consent & Sensitive Data Handling",
      text: "We design workflows for obtaining informed, specific, and voluntary consent, especially for sensitive personal information. This ensures lawful processing and builds trust with Chinese users.",
    },
    {
      title: "5. We Enable Data Subject Rights Management",
      text: "We help you implement systems to manage access, correction, deletion, and objection requests. Our automation tools streamline these processes and ensure timely, compliant responses.",
    },
    {
      title: "6. We Conduct PIPIA & Risk Assessments",
      text: "We guide you through Personal Information Protection Impact Assessments (PIPIA) for high-risk processing and cross-border transfers. This helps you identify and mitigate privacy risks before they become regulatory issues.",
    },
    {
      title: "7. We Localize Your Data Infrastructure",
      text: "We help you meet data localization requirements, including storing data in China and managing cross-border transfers with government approvals. This ensures compliance with one of PIPL's most critical and complex mandates.",
    },
    {
      title: "8. We Train Your Teams on PIPL Responsibilities",
      text: "We deliver role-based training to ensure your staff understands their obligations under PIPL. This builds a privacy-aware culture and reduces the risk of non-compliance.",
    },
    {
      title: "9. We Prepare You for Regulatory Reviews",
      text: "We assist with documentation, internal audits, and readiness for inquiries from Chinese authorities. Whether it's a proactive review or a response to a complaint, we've got your back.",
    },
    {
      title: "10. We Help You Stay Compliant",
      text: "PIPL compliance is ongoing. We offer continuous support to adapt to regulatory updates and operational changes. From policy refreshes to vendor reviews, we help you maintain a strong privacy posture in China.",
    },
  ];

  const whyProteccio = [
    "Deep expertise in PIPL, GDPR, DPDPA, ISO 27701, and global privacy laws",
    "Founder-led, hands-on engagement",
    "Automation tools for DSARs, consent, and risk assessments",
    "Localization support for data residency and cross-border compliance",
    "Scalable for startups, global platforms, and multinational enterprises",
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-jakarta relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/8 via-transparent to-transparent pointer-events-none opacity-40 transition-all duration-1000" />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-8%] right-[-6%] w-[520px] h-[520px] bg-[#1cd35c]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-12%] left-[-8%] w-[560px] h-[560px] bg-[#1cd35c]/6 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-28 pb-12 md:pt-28 md:pb-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
                How Proteccio Helps You Become <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">PIPL Compliant</span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed">
                China's Personal Information Protection Law (PIPL) is one of the world's most stringent data privacy laws. It governs how personal data of individuals in China is collected, processed, stored, and transferred whether your business is based in China or not. At Proteccio Data, we help you navigate the complexities of PIPL with confidence. Whether you're a global enterprise entering the Chinese market or a digital platform serving Chinese users, we bring the right mix of regulatory insight, localization expertise, and privacy engineering to help you comply with PIPL efficiently and ethically.
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white mt-10 mb-8">Here's how we help:</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <h3 className="text-lg md:text-xl font-black text-white leading-snug">{item.title}</h3>
                  <p className="text-white/70 mt-3 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#1cd35c]/20 bg-[#1cd35c]/10 p-6">
              <h3 className="text-center text-2xl md:text-3xl font-black text-white mb-5">Why Proteccio?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {whyProteccio.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#1cd35c] mt-1 shrink-0" />
                    <span className="text-white/85">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#1cd35c] px-6 py-5 text-center text-white font-bold text-sm md:text-xl leading-snug">
              Let's build a privacy-first organization that earns trust in one of the world's most regulated markets. With Proteccio, PIPL compliance isn't just achievable it's strategic.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const LgpdDetailPage = () => {
  const steps = [
    {
      title: "1. We Start with an LGPD Readiness Assessment",
      text: "We assess your current data practices against LGPD's legal, technical, and operational requirements. You'll get a clear roadmap that highlights compliance gaps and prioritizes remediation.",
    },
    {
      title: "2. We Help You Identify Your Role",
      text: "We clarify whether you're a data controller (controlador) or data processor (operador) under LGPD. This ensures you apply the right obligations, from consent to contracts and data subject rights.",
    },
    {
      title: "3. We Build Your Privacy Governance Framework",
      text: "We help you establish LGPD-aligned policies, procedures, and governance structures. From privacy notices to data retention policies, we make sure your operations are regulator-ready.",
    },
    {
      title: "4. We Operationalize Consent & Legal Bases",
      text: "We design workflows for managing valid consent and other legal bases for data processing. This ensures transparency and protects you from penalties related to unlawful data use.",
    },
    {
      title: "5. We Enable Data Subject Rights Management",
      text: "We help you set up systems to manage access, correction, deletion, portability, and objection requests. Our automation tools streamline these processes and ensure timely, compliant responses.",
    },
    {
      title: "6. We Conduct DPIAs & Risk Assessments",
      text: "We guide you through Data Protection Impact Assessments (DPIAs) for high-risk processing activities. This helps you identify and mitigate privacy risks before they become liabilities.",
    },
    {
      title: "7. We Train Your Teams on LGPD Responsibilities",
      text: "We deliver role-based training to ensure your staff understands their obligations under LGPD. This builds a privacy-aware culture and reduces the risk of non-compliance.",
    },
    {
      title: "8. We Help You Prepare for Breach Response",
      text: "We help you build incident response playbooks and breach notification protocols. This ensures you're ready to act quickly and compliantly in the event of a data breach.",
    },
    {
      title: "9. We Support You Through Regulatory Reviews",
      text: "We assist with documentation, internal reviews, and readiness for inquiries from Brazil's ANPD (National Data Protection Authority). Whether it's a voluntary audit or a regulatory request, we've got your back.",
    },
    {
      title: "10. We Help You Stay Compliant",
      text: "LGPD compliance is ongoing. We offer continuous support to adapt to regulatory updates and business changes. From policy refreshes to vendor reviews, we help you maintain a strong privacy posture.",
    },
  ];

  const whyProteccio = [
    "Deep expertise in LGPD, GDPR, DPDPA, ISO 27701, and global privacy laws",
    "Founder-led, hands-on engagement",
    "Automation tools for DSARs, RoPA, and consent management",
    "Industry-specific frameworks for finance, healthcare, retail, and more",
    "Scalable for startups and global enterprises alike",
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-jakarta relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/8 via-transparent to-transparent pointer-events-none opacity-40 transition-all duration-1000" />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-8%] right-[-6%] w-[520px] h-[520px] bg-[#1cd35c]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-12%] left-[-8%] w-[560px] h-[560px] bg-[#1cd35c]/6 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-28 pb-12 md:pt-28 md:pb-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
                How Proteccio Helps You Become <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">LGPD Compliant</span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed">
                Brazil's LGPD (Lei Geral de Proteção de Dados) is a comprehensive data protection law that governs how personal data is collected, processed, and shared. Inspired by GDPR, it applies to any organization handling data of individuals in Brazil regardless of where the company is based. At Proteccio Data, we help you go beyond legal checkboxes. We bring together privacy expertise, automation tools, and global best practices to help you meet LGPD requirements while building trust and operational resilience.
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white mt-10 mb-8">Here's how we help:</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <h3 className="text-lg md:text-xl font-black text-white leading-snug">{item.title}</h3>
                  <p className="text-white/70 mt-3 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#1cd35c]/20 bg-[#1cd35c]/10 p-6">
              <h3 className="text-center text-2xl md:text-3xl font-black text-white mb-5">Why Proteccio?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {whyProteccio.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#1cd35c] mt-1 shrink-0" />
                    <span className="text-white/85">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#1cd35c] px-6 py-5 text-center text-white font-bold text-sm md:text-xl leading-snug">
              Let's build a privacy-first organization that earns trust and meets Brazil's data protection standards. With Proteccio, LGPD compliance isn't just achievable it's transformative.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const HipaaDetailPage = () => {
  const steps = [
    {
      title: "1. We Start with a HIPAA Readiness Assessment",
      text: "We evaluate your current privacy and security practices against HIPAA's core rules. You'll get a clear roadmap that identifies compliance gaps and outlines actionable next steps.",
    },
    {
      title: "2. We Help You Identify Your Role & Responsibilities",
      text: "We clarify whether you're a covered entity, business associate, or hybrid and what that means for your obligations. This ensures you apply the right safeguards, agreements, and reporting protocols.",
    },
    {
      title: "3. We Build Your HIPAA Compliance Framework",
      text: "We help you develop and document policies and procedures aligned with the HIPAA Privacy and Security Rules. From patient rights to access controls, we ensure your operations are audit-ready.",
    },
    {
      title: "4. We Implement Technical & Administrative Safeguards",
      text: "We guide you through implementing encryption, access controls, audit logs, and secure data transmission. These safeguards protect PHI across systems, devices, and workflows.",
    },
    {
      title: "5. We Conduct Risk Assessments & Gap Analysis",
      text: "We perform regular risk assessments to identify vulnerabilities and recommend mitigation strategies. This supports continuous improvement and helps you stay ahead of threats.",
    },
    {
      title: "6. We Train Your Workforce",
      text: "We deliver HIPAA-specific training for leadership, staff, and IT teams. This builds a privacy-aware culture and reduces the risk of accidental violations.",
    },
    {
      title: "7. We Help You Manage Business Associate Agreements (BAAs)",
      text: "We help you draft, review, and manage BAAs with vendors and partners. This ensures third-party compliance and limits your liability.",
    },
    {
      title: "8. We Prepare You for Breach Response & Reporting",
      text: "We help you build incident response plans and breach notification workflows. This ensures you can respond quickly and compliantly in the event of a data breach.",
    },
    {
      title: "9. We Support You Through Audits & Investigations",
      text: "We assist with documentation, internal reviews, and readiness for OCR audits or investigations. Whether proactive or reactive, we ensure you're prepared and protected.",
    },
    {
      title: "10. We Help You Stay Compliant",
      text: "HIPAA compliance is ongoing. We offer continuous support to adapt to regulatory updates and operational changes. From policy refreshes to system reviews, we help you maintain a strong compliance posture.",
    },
  ];

  const whyProteccio = [
    "Deep expertise in HIPAA, ISO 27001, GDPR, DPDPA, and global privacy laws",
    "Founder-led, hands-on engagement",
    "Automation tools for risk assessments, training, and breach response",
    "Industry-specific frameworks for hospitals, clinics, insurers, and healthtech",
    "Scalable for small practices and large healthcare networks alike",
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-jakarta relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/8 via-transparent to-transparent pointer-events-none opacity-40 transition-all duration-1000" />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-8%] right-[-6%] w-[520px] h-[520px] bg-[#1cd35c]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-12%] left-[-8%] w-[560px] h-[560px] bg-[#1cd35c]/6 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-28 pb-12 md:pt-28 md:pb-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
                How Proteccio Helps You Become <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">HIPAA Compliant</span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed">
                The Health Insurance Portability and Accountability Act (HIPAA) is a U.S. federal law that mandates how healthcare organizations and their partners must protect Protected Health Information (PHI). It's not just about avoiding penalties it's about safeguarding patient trust and ensuring secure, ethical data practices. At Proteccio Data, we help you go beyond the basics. Whether you're a covered entity or a business associate, we bring the right mix of regulatory insight, technical safeguards, and operational support to help you meet HIPAA's Privacy, Security, and Breach Notification Rules.
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white mt-10 mb-8">Here's how we help:</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <h3 className="text-lg md:text-xl font-black text-white leading-snug">{item.title}</h3>
                  <p className="text-white/70 mt-3 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#1cd35c]/20 bg-[#1cd35c]/10 p-6">
              <h3 className="text-center text-2xl md:text-3xl font-black text-white mb-5">Why Proteccio?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {whyProteccio.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#1cd35c] mt-1 shrink-0" />
                    <span className="text-white/85">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#1cd35c] px-6 py-5 text-center text-white font-bold text-sm md:text-xl leading-snug">
              Let's build a privacy-first healthcare organization that protects patients and meets regulatory expectations. With Proteccio, HIPAA compliance isn't just achievable it's empowering.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const GlbaDetailPage = () => {
  const steps = [
    {
      title: "1. We Start with a GLBA Readiness Assessment",
      text: "We assess your current data handling, privacy, and security practices against GLBA requirements. You'll get a clear roadmap that identifies compliance gaps and outlines actionable next steps.",
    },
    {
      title: "2. We Help You Understand Your Obligations",
      text: "We clarify how GLBA applies to your business whether you're a bank, insurer, fintech, or service provider. This ensures you implement the right controls based on your role and risk exposure.",
    },
    {
      title: "3. We Build Your Privacy & Security Governance Framework",
      text: "We help you establish policies and procedures aligned with the Financial Privacy Rule and Safeguards Rule. From privacy notices to access controls, we ensure your program is regulator-ready.",
    },
    {
      title: "4. We Implement Technical & Administrative Safeguards",
      text: "We guide you through implementing encryption, access management, vendor oversight, and incident response protocols. These safeguards protect sensitive customer data and reduce the risk of breaches.",
    },
    {
      title: "5. We Operationalize Privacy Notices & Opt-Out Mechanisms",
      text: "We help you design and deliver clear, compliant privacy notices and opt-out options for data sharing. This ensures transparency and gives customers control over their personal financial information.",
    },
    {
      title: "6. We Conduct Risk Assessments & Monitor Controls",
      text: "We help you perform regular risk assessments and monitor the effectiveness of your security program. This supports continuous improvement and helps you stay ahead of evolving threats.",
    },
    {
      title: "7. We Train Your Teams on GLBA Responsibilities",
      text: "We deliver role-based training to ensure your staff understands their obligations under GLBA. This reduces human error and builds a culture of privacy and accountability.",
    },
    {
      title: "8. We Help You Prepare for Audits & Regulatory Reviews",
      text: "We assist with documentation, internal reviews, and audit readiness. Whether it's a regulator or a partner audit, we ensure you're prepared and confident.",
    },
    {
      title: "9. We Support You with Incident Response & Breach Notification",
      text: "We help you build and test incident response plans that align with GLBA's breach response expectations. This ensures you can respond quickly and compliantly in the event of a data incident.",
    },
    {
      title: "10. We Help You Stay Compliant",
      text: "GLBA compliance is ongoing. We offer continuous support to adapt to regulatory updates and business changes. From policy refreshes to vendor reviews, we help you maintain a strong compliance posture.",
    },
  ];

  const whyProteccio = [
    "Deep expertise in GLBA, ISO 27001, DPDPA, GDPR, and HIPAA",
    "Founder-led, hands-on engagement",
    "Automation tools for privacy notices, DSARs, and risk assessments",
    "Industry-specific frameworks for banks, fintechs, insurers, and advisors",
    "Scalable for small firms and large financial institutions alike",
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-jakarta relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/8 via-transparent to-transparent pointer-events-none opacity-40 transition-all duration-1000" />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-8%] right-[-6%] w-[520px] h-[520px] bg-[#1cd35c]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-12%] left-[-8%] w-[560px] h-[560px] bg-[#1cd35c]/6 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-28 pb-12 md:pt-28 md:pb-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
                How Proteccio Helps You Become <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">GLBA Compliant</span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed">
                The Gramm-Leach-Bliley Act (GLBA) is a U.S. federal law that requires financial institutions to protect the privacy and security of consumer financial information. It's not just about compliance it's about building trust in a data-driven financial ecosystem. At Proteccio Data, we help you go beyond checklists. We bring together privacy expertise, security frameworks, and automation tools to help you meet GLBA's requirements under the Financial Privacy Rule, Safeguards Rule, and Pretexting Provisions efficiently and sustainably.
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white mt-10 mb-8">Here's how we help:</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <h3 className="text-lg md:text-xl font-black text-white leading-snug">{item.title}</h3>
                  <p className="text-white/70 mt-3 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#1cd35c]/20 bg-[#1cd35c]/10 p-6">
              <h3 className="text-center text-2xl md:text-3xl font-black text-white mb-5">Why Proteccio?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {whyProteccio.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#1cd35c] mt-1 shrink-0" />
                    <span className="text-white/85">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#1cd35c] px-6 py-5 text-center text-white font-bold text-sm md:text-xl leading-snug">
              Let's build a privacy-first financial institution that earns trust and meets regulatory expectations. With Proteccio, GLBA compliance isn't just achievable it's strategic.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Iso27001DetailPage = () => {
  const steps = [
    {
      title: "1. We Start with a Clear Gap Assessment",
      text: "We begin by understanding where you are today. Our team conducts a detailed ISO 27001 readiness check to identify what's missing and what's working. You'll get a clear roadmap with prioritized actions no guesswork, no jargon.",
    },
    {
      title: "2. We Build Your ISMS, Together",
      text: "We help you design and document your Information Security Management System (ISMS) from the ground up. From policies and risk registers to asset inventories and control plans, we tailor everything to your business model and industry.",
    },
    {
      title: "3. We Help You Implement the Right Controls",
      text: "ISO 27001 isn't just about paperwork it's about real security. We guide you through implementing the Annex A controls, covering everything from access management and encryption to incident response and supplier security.",
    },
    {
      title: "4. We Train Your People",
      text: "Security is a team effort. We deliver custom training and awareness programs, so your employees understand their role in protecting information and are ready for audits.",
    },
    {
      title: "5. We Run Internal Audits & Mock Reviews",
      text: "Before the real audit, we simulate it. Our internal audit and management review sessions prepare you for certification by identifying gaps and fine-tuning your documentation and processes.",
    },
    {
      title: "6. We Support You Through Certification",
      text: "We coordinate with certification bodies, help you respond to auditor questions, and ensure your documentation is audit-ready. We're with you during Stage 1 and Stage 2 audits, every step of the way.",
    },
    {
      title: "7. We Help You Stay Certified",
      text: "ISO 27001 is a journey, not a destination. After certification, we offer ongoing support from periodic audits and risk reviews to control updates and training refreshers.",
    },
  ];

  const whyProteccio = [
    "Deep expertise in ISO 27001, DPDPA, GDPR, HIPAA, and more",
    "Founder-led, hands-on engagement",
    "Automation tools to reduce manual effort",
    "Industry-specific frameworks",
    "Scalable for startups and enterprises alike",
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-jakarta relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/8 via-transparent to-transparent pointer-events-none opacity-40 transition-all duration-1000" />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-8%] right-[-6%] w-[520px] h-[520px] bg-[#1cd35c]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-12%] left-[-8%] w-[560px] h-[560px] bg-[#1cd35c]/6 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-28 pb-12 md:pt-28 md:pb-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
                How Proteccio Helps You Achieve <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">ISO 27001</span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed">
                At Proteccio Data, we don't just guide you to ISO 27001 certification we walk the journey with you. Whether you're a startup aiming to build trust or an enterprise looking to formalize your security posture, we bring the right mix of expertise, tools, and strategy to make it happen.
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white mt-10 mb-8">Here's how we help:</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <h3 className="text-lg md:text-xl font-black text-white leading-snug">{item.title}</h3>
                  <p className="text-white/70 mt-3 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#1cd35c]/20 bg-[#1cd35c]/10 p-6">
              <h3 className="text-center text-2xl md:text-3xl font-black text-white mb-5">Why Proteccio?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {whyProteccio.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#1cd35c] mt-1 shrink-0" />
                    <span className="text-white/85">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#1cd35c] px-6 py-5 text-center text-white font-bold text-sm md:text-xl leading-snug">
              Let's build a security-first culture that earns trust and drives growth. With Proteccio, ISO 27001 isn't just achievable it's strategic.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Iso27701DetailPage = () => {
  const steps = [
    {
      title: "1. We Start with a Privacy Gap Assessment",
      text: "We begin by evaluating your current privacy practices against ISO 27701 requirements. Our team identifies gaps, overlaps with ISO 27001, and areas for improvement. You'll get a clear, actionable roadmap to build a Privacy Information Management System (PIMS) that's both compliant and practical.",
    },
    {
      title: "2. We Extend Your ISMS into a PIMS",
      text: "Already ISO 27001 certified? Great we help you extend your existing ISMS into a fully functional PIMS. Starting from scratch? We'll build both in sync. From privacy policies to data subject rights workflows, we tailor everything to your business model and regulatory landscape.",
    },
    {
      title: "3. We Implement Privacy-Specific Controls",
      text: "ISO 27701 introduces new controls for managing personal data like consent, retention, and third-party processing. We help you implement them effectively. These controls ensure your organization handles personal data ethically, securely, and in line with global laws like GDPR and DPDPA.",
    },
    {
      title: "4. We Conduct Privacy Risk Assessments & PIAs",
      text: "We guide you through Privacy Impact Assessments (PIAs) and risk evaluations for high-risk processing activities. This helps you identify and mitigate privacy risks before they become liabilities building trust with customers and regulators alike.",
    },
    {
      title: "5. We Train Your Teams on Privacy Roles",
      text: "We deliver targeted training for your teams whether they're handling data directly or managing vendors. Everyone understands their role in protecting personal data, making privacy a shared responsibility across your organization.",
    },
    {
      title: "6. We Support You Through Certification",
      text: "We assist with documentation, auditor coordination, and readiness for ISO 27701 certification audits. From Stage 1 to Stage 2, we're by your side ensuring your privacy program is audit-ready and aligned with best practices.",
    },
    {
      title: "7. We Help You Stay Certified",
      text: "Privacy is a moving target. We offer ongoing support to help you maintain and evolve your PIMS post-certification. From regulatory updates to internal audits, we help you stay ahead of change and continuously improve.",
    },
  ];

  const whyProteccio = [
    "Deep expertise in ISO 27701, ISO 27001, GDPR, DPDPA, HIPAA, and more",
    "Founder-led, hands-on engagement",
    "Automation tools for privacy operations and DSARs",
    "Industry-specific frameworks for finance, healthcare, edtech, and more",
    "Scalable for startups and global enterprises alike",
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-jakarta relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/8 via-transparent to-transparent pointer-events-none opacity-40 transition-all duration-1000" />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-8%] right-[-6%] w-[520px] h-[520px] bg-[#1cd35c]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-12%] left-[-8%] w-[560px] h-[560px] bg-[#1cd35c]/6 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-28 pb-12 md:pt-28 md:pb-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
                How Proteccio Helps You Achieve <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">ISO 27701</span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed">
                At Proteccio Data, we don't just help you tick the boxes for ISO 27701 certification we help you build a privacy-first culture that aligns with global expectations. Whether you're a data controller, processor, or both, we bring the right mix of privacy expertise, regulatory insight, and operational tools to help you manage personal data responsibly and transparently.
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white mt-10 mb-8">Here's how we help:</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <h3 className="text-lg md:text-xl font-black text-white leading-snug">{item.title}</h3>
                  <p className="text-white/70 mt-3 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#1cd35c]/20 bg-[#1cd35c]/10 p-6">
              <h3 className="text-center text-2xl md:text-3xl font-black text-white mb-5">Why Proteccio?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {whyProteccio.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#1cd35c] mt-1 shrink-0" />
                    <span className="text-white/85">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#1cd35c] px-6 py-5 text-center text-white font-bold text-sm md:text-xl leading-snug">
              Let's build a privacy-first organization that earns trust and drives responsible innovation. With Proteccio, ISO 27701 isn't just achievable it's transformative.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const TisaxDetailPage = () => {
  const approach = [
    "Comprehensive readiness assessment and gap analysis",
    "Privacy governance framework development",
    "Operational implementation and training",
    "Ongoing compliance monitoring and support",
  ];

  const benefits = [
    "Reduce compliance risks and avoid penalties",
    "Build customer trust and brand reputation",
    "Streamline operations with automation tools",
    "Scale compliance as your business grows",
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-jakarta relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/8 via-transparent to-transparent pointer-events-none opacity-40 transition-all duration-1000" />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-8%] right-[-6%] w-[520px] h-[520px] bg-[#1cd35c]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-12%] left-[-8%] w-[560px] h-[560px] bg-[#1cd35c]/6 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-28 pb-12 md:pt-28 md:pb-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-4">Solution Details</h1>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed">Comprehensive Solution support and guidance.</p>
            </div>

            <div className="mt-10 text-center">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Comprehensive Support</h2>
              <p className="text-white/75 max-w-4xl mx-auto leading-relaxed">
                At Proteccio Data, we provide end-to-end support for compliance, helping you build a privacy-first organization that earns trust and meets regulatory expectations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <h3 className="text-2xl font-black text-white mb-4">Our Approach</h3>
                <ul className="space-y-3">
                  {approach.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-[#1cd35c] mt-1 shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <h3 className="text-2xl font-black text-white mb-4">Key Benefits</h3>
                <ul className="space-y-3">
                  {benefits.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-[#1cd35c] mt-1 shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-[#1cd35c]/25 bg-[#1cd35c]/10 p-6 text-center">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3">Ready to Get Started?</h3>
              <p className="text-white/80 max-w-3xl mx-auto mb-6">
                Contact us to learn how we can help you achieve compliance and build a privacy-first organization.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-3 bg-[#1cd35c] text-white rounded-full font-bold hover:bg-[#19b850] transition-all"
                >
                  Contact Us
                </Link>
                <Link
                  to="/book-demo"
                  className="px-8 py-3 border-2 border-[#1cd35c] text-[#1cd35c] rounded-full font-bold hover:bg-[#1cd35c] hover:text-white transition-all"
                >
                  Book a Free Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const CpraDetailPage = () => {
  const steps = [
    {
      title: "1. We Start with a CPRA Readiness Assessment",
      text: "We evaluate your current privacy program against CPRA requirements and California Privacy Rights Act expectations. You get a clear roadmap highlighting high-risk gaps and prioritized remediation actions.",
    },
    {
      title: "2. We Help You Define Business and Service Provider Roles",
      text: "We map your role and your vendors' roles under CPRA, including business, service provider, and contractor obligations. This ensures correct contract terms, data sharing controls, and accountability.",
    },
    {
      title: "3. We Build Your CPRA Governance Framework",
      text: "We design and document policies, procedures, and governance controls aligned with CPRA. From notice requirements to retention and purpose limitation, your operations become audit-ready.",
    },
    {
      title: "4. We Operationalize Notice, Consent, and Preference Management",
      text: "We implement practical workflows for notice at collection, opt-out of sale/sharing, and sensitive personal information limitations. This improves transparency and reduces enforcement risk.",
    },
    {
      title: "5. We Enable Consumer Rights Fulfillment",
      text: "We set up systems for access, correction, deletion, portability, and rights to opt-out and limit use of sensitive personal information. Automation helps ensure timely, compliant responses.",
    },
    {
      title: "6. We Conduct Privacy Risk Assessments",
      text: "We assess high-risk data processing and sharing practices, including vendor and ad-tech flows. This identifies control gaps early and strengthens defensibility.",
    },
    {
      title: "7. We Train Your Teams on CPRA Responsibilities",
      text: "We deliver role-based enablement for legal, marketing, product, and operations teams. This builds a privacy-aware culture and reduces non-compliant handling of consumer data.",
    },
    {
      title: "8. We Prepare You for Incident and Breach Readiness",
      text: "We build incident response and breach coordination playbooks aligned with California obligations. This enables faster triage, clear ownership, and compliant action during incidents.",
    },
    {
      title: "9. We Support You Through Regulatory and Audit Reviews",
      text: "We prepare documentation, evidence packs, and internal review mechanisms for inquiries and audits. Whether proactive or reactive, we help you respond with confidence.",
    },
    {
      title: "10. We Help You Stay Compliant",
      text: "CPRA compliance is ongoing. We provide continuous support for policy updates, vendor oversight, and operational changes so your privacy posture stays strong as requirements evolve.",
    },
  ];

  const whyProteccio = [
    "Deep expertise in CPRA, GDPR, DPDPA, ISO 27701, and global privacy laws",
    "Founder-led, hands-on engagement",
    "Automation tools for DSARs, RoPA, and consent management",
    "Industry-specific frameworks for retail, finance, healthcare, and more",
    "Scalable for startups and global enterprises alike",
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-jakarta relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/8 via-transparent to-transparent pointer-events-none opacity-40 transition-all duration-1000" />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-8%] right-[-6%] w-[520px] h-[520px] bg-[#1cd35c]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-12%] left-[-8%] w-[560px] h-[560px] bg-[#1cd35c]/6 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-28 pb-12 md:pt-28 md:pb-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
                How Proteccio Helps You Become <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">CPRA Compliant</span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed">
                California's Consumer Privacy Rights Act (CPRA) strengthens consumer privacy rights and expands obligations for businesses that collect, use, and share personal information. At Proteccio Data, we help you move beyond checklists by combining privacy expertise, operational controls, and automation to achieve and maintain practical CPRA compliance at scale.
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white mt-10 mb-8">Here's how we help:</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-black/20 p-5">
                  <h3 className="text-lg md:text-xl font-black text-white leading-snug">{item.title}</h3>
                  <p className="text-white/70 mt-3 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#1cd35c]/20 bg-[#1cd35c]/10 p-6">
              <h3 className="text-center text-2xl md:text-3xl font-black text-white mb-5">Why Proteccio?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {whyProteccio.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#1cd35c] mt-1 shrink-0" />
                    <span className="text-white/85">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#1cd35c] px-6 py-5 text-center text-white font-bold text-sm md:text-xl leading-snug">
              Let's build a privacy-first organization that earns trust and meets California privacy expectations. With Proteccio, CPRA compliance is not just achievable it is strategic.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SolutionDetail = () => {
  const { solutionId } = useParams();
  const location = useLocation();
  const { state } = location;

  const currentSolution =
    (solutionId && solutionsData[solutionId as keyof typeof solutionsData]) || {
      label: state?.title,
      description: state?.description,
    };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (solutionId === "gdpr") {
    return <GdprDetailPage />;
  }

  if (solutionId === "dpdp-act") {
    return <DpdpaDetailPage />;
  }

  if (solutionId === "pdpl") {
    return <PdplDetailPage />;
  }

  if (solutionId === "pipl") {
    return <PiplDetailPage />;
  }

  if (solutionId === "lgpd") {
    return <LgpdDetailPage />;
  }

  if (solutionId === "hipaa") {
    return <HipaaDetailPage />;
  }

  if (solutionId === "glba") {
    return <GlbaDetailPage />;
  }

  if (solutionId === "iso-27001") {
    return <Iso27001DetailPage />;
  }

  if (solutionId === "iso-27701") {
    return <Iso27701DetailPage />;
  }

  if (solutionId === "tisax") {
    return <TisaxDetailPage />;
  }

  if (solutionId === "cpra") {
    return <CpraDetailPage />;
  }

  const content = {
    title: currentSolution?.label || "Regulatory Compliance & Guidance",
    description:
      currentSolution?.description ||
      "Navigate complex global privacy laws like GDPR, CPRA, and HIPAA with confidence. Stay compliant today and tomorrow.",
    heading: "Comprehensive Support",
    mainText:
      "At Proteccio Data, we don't just solve for compliance; we architect trust. Our end-to-end support system helps you build a privacy-first organization that meets global regulatory expectations.",
    approach: [
      "Tailored Readiness & Gap Analysis",
      "Bespoke Governance Frameworks",
      "Hands-on Operational Implementation",
      "Continuous Compliance Monitoring",
    ],
    benefits: [
      "Zero-Penalty Compliance Assurance",
      "Enhanced Brand Trust & Integrity",
      "Automation-Driven Efficiency",
      "Global Scalability & Resilience",
    ],
  };

  return (
    <div className="min-h-screen bg-transparent text-white font-jakarta relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/8 via-transparent to-transparent pointer-events-none opacity-40 transition-all duration-1000" />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-8%] right-[-6%] w-[520px] h-[520px] bg-[#1cd35c]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-12%] left-[-8%] w-[560px] h-[560px] bg-[#1cd35c]/6 blur-[120px] rounded-full" />
      </div>

      <section className="relative pt-28 pb-12 md:pt-28 md:pb-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 border border-[#1cd35c]/20 rounded-full text-[#1cd35c] text-[11px] font-black uppercase tracking-widest mb-6">
              Digital Sovereignty
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
              <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">
                {content.title}
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg md:text-xl text-white/70 font-medium leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>
      </section>

      <section className="relative pb-14 md:pb-16 z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{content.heading}</h2>
              <p className="text-white/70 max-w-4xl mx-auto leading-relaxed">{content.mainText}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Our Approach</h3>
                <ul className="space-y-4">
                  {content.approach.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#1cd35c] mt-0.5 shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Key Benefits</h3>
                <ul className="space-y-4">
                  {content.benefits.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#1cd35c] mt-0.5 shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-3 bg-[#1cd35c] text-white rounded-full font-bold hover:bg-[#19b850] transition-all"
              >
                Contact Us Today <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolutionDetail;

