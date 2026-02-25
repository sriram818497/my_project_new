import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Heart, Landmark, ShoppingCart, Cloud,
  Building2, Factory, ArrowRight, CheckCircle2,
  AlertTriangle, Search, ShieldCheck,
  ChevronRight, ExternalLink, Zap
} from "lucide-react";

// 6 Featured Industries
const featuredIndustries = [
  {
    id: "healthcare",
    icon: Heart,
    title: "Healthcare",
    challenge: "Managing PHI while ensuring HIPAA & GDPR compliance across health networks.",
    keyRisks: [
      "PHI exposure across clinical and operational systems.",
      "Cross-border research and trial data transfer risk.",
      "Complex vendor ecosystems with sensitive access paths.",
    ],
    businessImpact: "Delayed care workflows, audit pressure, and reputational exposure in patient-facing operations.",
    howProteccioHelps: ["Unified RoPA", "Consent tracking", "Vendor risk mapping"],
    regulations: ["HIPAA", "GDPR", "DPA"],
    benefit: "End-to-end PHI encryption with automated patient rights fulfillment.",
    category: "Regulated",
    targetCategory: "industry-compliance"
  },
  {
    id: "finance",
    icon: Landmark,
    title: "Financial Services",
    challenge: "Securing financial data against fraud while meeting stringent KYC and AML standards.",
    keyRisks: [
      "Fraud-driven abuse of financial identifiers.",
      "Third-party onboarding delays from manual controls.",
      "Multi-regulator evidence and reporting pressure.",
    ],
    businessImpact: "Slower product launches and increased operational overhead in regulated financial environments.",
    howProteccioHelps: ["Risk-based controls", "RoPA automation", "Continuous evidence mapping"],
    regulations: ["PCI-DSS", "SOX", "GLBA"],
    benefit: "Real time risk scoring and compliance mapping for banking operations.",
    category: "Regulated",
    targetCategory: "industry-compliance"
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "E-commerce",
    challenge: "Personalizing customer experiences without violating CCPA/GDPR consent rules.",
    keyRisks: [
      "Consent friction impacting conversion performance.",
      "Behavioral data misuse and profiling complaints.",
      "Fast-changing data sharing practices across tools.",
    ],
    businessImpact: "Checkout drop-off and trust erosion when privacy controls are unclear or inconsistent.",
    howProteccioHelps: ["Contextual consent", "Preference orchestration", "DSR workflow automation"],
    regulations: ["CCPA", "GDPR", "PCI-DSS"],
    benefit: "Visual consent management that boosts conversion while automating DSRs.",
    category: "Digital",
    targetCategory: "global-regulations"
  },
  {
    id: "saas",
    icon: Cloud,
    title: "SaaS & Tech",
    challenge: "Proving data security to enterprise buyers and scaling global privacy operations.",
    keyRisks: [
      "Enterprise deal friction due to trust and assurance gaps.",
      "Rapid product updates increasing privacy control drift.",
      "Cross-border customer data handling complexity.",
    ],
    businessImpact: "Longer sales cycles and higher legal review effort for enterprise expansion.",
    howProteccioHelps: ["Trust Center workflows", "Control evidence automation", "Global policy mapping"],
    regulations: ["SOC2", "ISO 27001", "GDPR"],
    benefit: "Accelerated security reviews with an auto-updating Trust Center.",
    category: "Digital",
    targetCategory: "management-systems"
  },
  {
    id: "government",
    icon: Building2,
    title: "Government",
    challenge: "Protecting citizen data across legacy systems while adhering to NIST frameworks.",
    keyRisks: [
      "Legacy system exposure in citizen data workflows.",
      "Fragmented policy enforcement across departments.",
      "High-impact incident response requirements.",
    ],
    businessImpact: "Operational disruption and public trust loss if controls are not consistently enforced.",
    howProteccioHelps: ["Centralized governance", "Policy control alignment", "Audit-ready reporting"],
    regulations: ["NIST", "FedRAMP", "GDPR"],
    benefit: "Centralized citizen data governance with unified policy enforcement.",
    category: "Public Sector",
    targetCategory: "global-regulations"
  },
  {
    id: "manufacturing",
    icon: Factory,
    title: "Manufacturing",
    challenge: "Safeguarding trade secrets and IoT sensor data in global supply chains.",
    keyRisks: [
      "IP leakage across supplier and plant ecosystems.",
      "Unmanaged IoT data flows across jurisdictions.",
      "Operational and physical risk from weak controls.",
    ],
    businessImpact: "Production risk, supplier disruption, and IP erosion in high-volume industrial operations.",
    howProteccioHelps: ["Industrial data mapping", "Granular access governance", "Supply-chain privacy controls"],
    regulations: ["ISO 27001", "EU Data Act", "IP Law"],
    benefit: "Granular access controls for IP protection and automated IoT mapping.",
    category: "Industrial",
    targetCategory: "management-systems"
  }
];

// Explorer Data
const explorerIndustries = [
  ...featuredIndustries,
  {
    id: "logistics",
    icon: Zap,
    title: "Logistics",
    challenge: "Anonymizing real-time tracking data for international shipments.",
    keyRisks: [
      "Location intelligence leakage across partner systems.",
      "Cross-border transfer controls for route data.",
      "Vendor handoffs with inconsistent governance.",
    ],
    businessImpact: "Shipment delays and compliance overhead in globally distributed operations.",
    howProteccioHelps: ["Transfer impact visibility", "Supply-chain mapping", "Control automation"],
    regulations: ["GDPR", "ISO 27001"],
    benefit: "Compliant movement tracking without behavioral exposure.",
    category: "Industrial",
    targetCategory: "management-systems"
  }
];

const caseStudies = [
  {
    industry: "Healthcare",
    problem: "Scattered PHI resulted in 20-day fulfillment for data subject requests.",
    solution: "Unified Data Discovery and data classification indexed all patient records for instant discovery.",
    outcome: "DSR fulfillment reduced to <24 hours; 100% audit pass rate."
  },
  {
    industry: "E-commerce",
    problem: "High cart abandonment due to intrusive cookie banners and privacy fears.",
    solution: "Implemented Proteccio’s Contextual Consent for ethical tracking.",
    outcome: "12% increase in checkout conversion; CCPA complaints dropped by 90%."
  },
  {
    industry: "FinTech",
    problem: "Manual vendor risk reviews were stalling new partner on-boarding.",
    solution: "Deployed the Vendor Risk Intelligence Dashboard for automated assessment.",
    outcome: "Vendor approval time cut by 60%; enabled 5x more partner integrations."
  }
];

const Industries = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [demoIndustry, setDemoIndustry] = useState("Healthcare");
  const categoryTabs = ["All", "Regulated", "Digital", "Public Sector", "Industrial"];

  const filteredIndustries = explorerIndustries.filter(ind => {
    const matchesFilter = filter === "All" || ind.category === filter;
    const matchesSearch = ind.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-transparent text-white pt-16 selection:bg-[#1cd35c]/30">

      {/* Hero Section */}
      <section className="relative pt-8 pb-4 lg:pt-12 lg:pb-8 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-[#1cd35c]/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>
        <div className="container px-4 mx-auto max-w-7xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 border border-[#1cd35c]/20 rounded-full text-[#1cd35c] text-xs font-black uppercase tracking-widest mb-8">
              NextGen Governance
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1]">
              Privacy Built for the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075]">Realities of Your Industry</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-8">
              Meet sector-specific regulatory obligations without slowing growth. Proteccio aligns privacy, governance, and operational velocity across complex industry environments.
            </p>

            {/* Simple Animated Visual Mockup */}
            <div className="flex justify-center gap-2 h-16 mb-2">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ["40%", "90%", "60%", "100%", "40%"] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1.5 bg-[#1cd35c]/30 rounded-t-full"
                ></motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Industries (6 Cards) */}
      <section className="pt-8 pb-8 bg-white/[0.01]">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {categoryTabs.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-[#1cd35c] text-black shadow-lg' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => setCompareMode((prev) => !prev)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${compareMode ? 'bg-[#1cd35c]/20 text-[#1cd35c] border-[#1cd35c]/40' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'}`}
            >
              {compareMode ? "Hide Compare" : "Compare Industries"}
            </button>
          </div>

          {compareMode && (
            <div className="mb-10 p-6 bg-white/5 border border-white/10 rounded-3xl">
              <h3 className="text-xl font-black mb-4">Industry Comparison Snapshot</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c] mb-2">Regulatory Burden</p>
                  <p className="text-sm text-white/70">Healthcare and Financial Services lead in control depth and audit cadence requirements.</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c] mb-2">Risk Complexity</p>
                  <p className="text-sm text-white/70">Digital sectors face trust and reputational exposure; industrial sectors carry operational and physical risk impact.</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c] mb-2">Typical Use Cases</p>
                  <p className="text-sm text-white/70">RoPA standardization, consent orchestration, and vendor risk mapping remain top cross-sector priorities.</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Featured Sector Solutions</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Frameworks optimized for the high impact industries defining modern commerce.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredIndustries.map((ind, i) => (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] hover:border-[#1cd35c]/50 transition-all flex flex-col h-full"
                onMouseEnter={() => setDemoIndustry(ind.title)}
              >
                <div className="w-16 h-16 bg-[#1cd35c]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1cd35c] group-hover:text-black transition-all">
                  <ind.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#1cd35c] transition-colors">{ind.title}</h3>
                <p className="text-white/60 group-hover:text-white/80 transition-colors mb-6 flex-grow">{ind.challenge}</p>
                <div className="mb-6 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-red-400 font-black block mb-2">Key Risks</span>
                    <ul className="space-y-1">
                      {ind.keyRisks.map((risk) => (
                        <li key={`${ind.id}-${risk}`} className="text-xs text-white/70">- {risk}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-white/50 font-black block mb-2">Business Impact</span>
                    <p className="text-xs text-white/70">{ind.businessImpact}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#1cd35c] font-black block mb-2">How Proteccio Helps</span>
                    <div className="flex flex-wrap gap-2">
                      {ind.howProteccioHelps.map((item) => (
                        <span key={`${ind.id}-${item}`} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-gray-300">{item}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#1cd35c] font-black block mb-2">Key Regulations</span>
                    <div className="flex flex-wrap gap-2">
                      {ind.regulations.map(reg => (
                        <span key={reg} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-gray-400">{reg}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/solutions#${ind.targetCategory}`)}
                  className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#1cd35c] hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  View Industry Solution <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Explorer */}
      <section className="pt-8 pb-14 md:pb-16 relative">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-2">Industry Explorer</h2>
              <p className="text-gray-500 max-w-xl">Deep dive into how Proteccio operationalizes privacy across your specific operative landscape.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Filter by industry..."
                  className="bg-white/5 border border-white/10 py-3 pl-12 pr-6 rounded-xl focus:outline-none focus:border-[#1cd35c] transition-all w-full sm:w-64 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl">
                {categoryTabs.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-[#1cd35c] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                  >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
            <AnimatePresence>
              {filteredIndustries.map((ind) => (
                <div key={ind.id} className={`relative h-[92px] ${expandedId === ind.id ? 'z-50' : 'z-10'}`}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onMouseEnter={() => setExpandedId(ind.id)}
                    onMouseLeave={() => setExpandedId(null)}
                    className={`absolute top-0 left-0 w-full cursor-pointer p-6 rounded-3xl border transition-colors duration-300 ${expandedId === ind.id
                      ? 'bg-[#0a0a0a] border-[#1cd35c] ring-1 ring-[#1cd35c]/50 shadow-2xl shadow-[#1cd35c]/10'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    onClick={() => setDemoIndustry(ind.title)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${expandedId === ind.id ? 'bg-[#1cd35c] text-black' : 'bg-[#1cd35c]/10 text-[#1cd35c]'}`}>
                          <ind.icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg">{ind.title}</h4>
                      </div>
                      <motion.div animate={{ rotate: expandedId === ind.id ? 180 : 0 }}>
                        <ArrowRight className="w-4 h-4 text-gray-600" />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {expandedId === ind.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 space-y-6">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-red-500/80 mb-1">Key Risks</p>
                                <ul className="text-sm text-gray-300 space-y-1">
                                  {ind.keyRisks.map((risk) => (
                                    <li key={`${ind.id}-risk-${risk}`}>- {risk}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <ShieldCheck className="w-4 h-4 text-[#1cd35c] mt-1 shrink-0" />
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c] mb-1">How Proteccio Helps</p>
                                <p className="text-sm text-gray-300">{ind.howProteccioHelps.join(" + ")}.</p>
                              </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                              <h5 className="text-[10px] font-black text-white/40 uppercase mb-2">Business Impact</h5>
                              <p className="text-xs text-gray-400 italic">{ind.businessImpact}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/solutions#${ind.targetCategory}`);
                              }}
                              className="w-full py-3 bg-[#1cd35c] text-white font-black rounded-xl text-xs uppercase flex items-center justify-center gap-2"
                            >
                              Solution Specs <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Why Industry Specific Matters */}
      <section className="py-12 bg-[#1cd35c]/5 border-y border-[#1cd35c]/10">
        <div className="container px-4 mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-12 leading-tight">Why Industry Specific <br /> Privacy Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { id: "01", title: "Data Types Differ", desc: "Healthcare handles PHI. Banks manage financial identifiers. Retail captures behavioral data. Each demands distinct governance controls." },
              { id: "02", title: "Global Laws Overlap", desc: "Multi-jurisdictional operations require unified compliance frameworks that prevent duplication and audit fatigue." },
              { id: "03", title: "Risk Surfaces Shift", desc: "Digital industries face reputational risks. Industrial sectors face operational and physical risk exposure." }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative p-10 bg-white/5 backdrop-blur-sm rounded-[3rem] border border-white/10 text-center"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#1cd35c] text-black rounded-2xl flex items-center justify-center font-black text-xl">
                  {step.id}
                </div>
                <h4 className="text-2xl font-bold mb-6 mt-4">{step.title}</h4>
                <p className="text-white/60 leading-relaxed font-medium">{step.desc}</p>
                <div className="w-16 h-1 bg-[#1cd35c]/20 mx-auto mt-8 rounded-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Case Study Section */}
      <section className="pt-8 pb-8">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[#1cd35c] text-sm font-black uppercase tracking-[0.2em] mb-2 block underline underline-offset-8">Proven Results</span>
              <h2 className="text-3xl md:text-5xl font-black">Success Stories</h2>
            </div>
            <p className="text-gray-500 max-w-sm">Quantifiable privacy outcomes for leaders who demand operational excellence.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {caseStudies.map((cs, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-10 bg-white/[0.02] border border-white/10 rounded-[3rem] flex flex-col h-full"
              >
                <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#1cd35c] inline-block mb-8 self-start">
                  {cs.industry}
                </div>
                <div className="space-y-8 flex-grow">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-500 mb-2">The Challenge</p>
                    <p className="text-gray-300 leading-relaxed">{cs.problem}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-500 mb-2">Proteccio Solution</p>
                    <p className="text-white font-bold leading-relaxed">{cs.solution}</p>
                  </div>
                </div>
                <div className="mt-10 pt-8 border-t border-white/5 flex items-center gap-4">
                  <CheckCircle2 className="w-10 h-10 text-[#1cd35c]" />
                  <div>
                    <p className="text-3xl md:text-4xl font-black text-[#1cd35c] leading-none">
                      {cs.industry === "FinTech" ? "60%" : cs.industry === "E-commerce" ? "12%" : "<24h"}
                    </p>
                    <p className="text-sm font-black text-[#1cd35c] mt-2">{cs.outcome}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="pt-4 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1cd35c]/10 via-transparent to-transparent"></div>
        <div className="container px-4 mx-auto max-w-2xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 md:p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1cd35c]/10 blur-[90px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

            <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">Find Your <br /> Compliance Path</h2>
            <p className="text-base md:text-lg text-white/60 mb-8 max-w-lg mx-auto leading-relaxed">
              Join the elite organizations that have turned data privacy into a sustainable competitive advantage.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={() => window.location.href = '/book-demo'}
                className="px-8 py-4 bg-[#1cd35c] text-white font-black rounded-xl hover:bg-[#19b850] transition-all transform hover:-translate-y-1 active:scale-95 shadow-2xl shadow-[#1cd35c]/30 text-sm"
              >
                {`Get ${demoIndustry} Demo`}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Industries;
