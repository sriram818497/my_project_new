import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Shield, SearchCheck, BarChart3, ShieldAlert, FileCheck2 } from "lucide-react";
import { toolsData, ToolConfig } from "../data/toolsData";
import ToolExperience from "../components/tools/ToolExperience";
import { Link } from "react-router-dom";

type JourneyStage = "discover" | "map" | "monitor" | "prove";

type ToolMeta = {
  stage: JourneyStage;
  timeToComplete: string;
  bestFor: string;
  mostUsed?: boolean;
};

const stageOrder: { key: JourneyStage; label: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "discover", label: "Discover Risk", subtitle: "Identify exposure and risk posture quickly.", icon: SearchCheck },
  { key: "map", label: "Map & Govern", subtitle: "Build data visibility and accountability clarity.", icon: BarChart3 },
  { key: "monitor", label: "Monitor & Protect", subtitle: "Continuously monitor incidents and vendor exposure.", icon: ShieldAlert },
  { key: "prove", label: "Prove Compliance", subtitle: "Generate evidence and policy-aligned audit outputs.", icon: FileCheck2 },
];

const toolMetaById: Record<string, ToolMeta> = {
  "privacy-chaos": { stage: "discover", timeToComplete: "5-7 mins", bestFor: "DPOs | Compliance Leads", mostUsed: true },
  "transfer-awareness": { stage: "discover", timeToComplete: "10 mins", bestFor: "Legal Counsel | Risk Teams" },
  "data-exposure-mapper": { stage: "map", timeToComplete: "12-15 mins", bestFor: "Privacy Ops | Data Governance" },
  "accountability-clarity": { stage: "map", timeToComplete: "7-10 mins", bestFor: "DPOs | Legal Counsel" },
  "vendor-risk-radar": { stage: "monitor", timeToComplete: "10-12 mins", bestFor: "TPRM Leads | Procurement" },
  "incident-readiness": { stage: "monitor", timeToComplete: "8-10 mins", bestFor: "Security | Incident Teams" },
  "policy-reality-check": { stage: "prove", timeToComplete: "10-12 mins", bestFor: "Privacy Counsel | Compliance" },
};

const defaultMeta: ToolMeta = {
  stage: "prove",
  timeToComplete: "8-10 mins",
  bestFor: "Compliance Leads | Privacy Teams",
};

const Tools = () => {
  const [selectedTool, setSelectedTool] = useState<ToolConfig | null>(null);

  const scrollToTools = () => {
    const element = document.getElementById("tools-grid");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getToolMeta = (tool: ToolConfig): ToolMeta => {
    if (toolMetaById[tool.id]) return toolMetaById[tool.id];
    if (tool.id.includes("policy")) return { ...defaultMeta, stage: "prove" };
    if (tool.id.includes("vendor") || tool.id.includes("incident")) return { ...defaultMeta, stage: "monitor" };
    if (tool.id.includes("mapping") || tool.id.includes("accountability")) return { ...defaultMeta, stage: "map" };
    if (tool.id.includes("dpdp") || tool.id.includes("transfer") || tool.id.includes("privacy")) return { ...defaultMeta, stage: "discover" };
    return defaultMeta;
  };

  const groupedTools = stageOrder.map((stage) => ({
    ...stage,
    tools: toolsData.filter((tool) => getToolMeta(tool).stage === stage.key),
  }));

  const selectedScore = selectedTool ? (selectedTool.id === "privacy-chaos" ? 68 : selectedTool.id.includes("vendor") ? 62 : 71) : null;
  const selectedBenchmark = selectedTool ? (selectedTool.id.includes("vendor") ? "59%" : "62%") : null;

  return (
    <div className="min-h-screen bg-transparent text-white pt-20 md:pt-24 pb-10 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1cd35c]/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1cd35c]/5 rounded-full blur-[100px] -z-10" />

      {/* Hero Section */}
      <section className="container px-4 mx-auto max-w-7xl mb-12 md:mb-16">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-fit mx-auto mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-[#1cd35c]/10 backdrop-blur-sm flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-[#1cd35c] uppercase">Free Privacy Tools</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Practical Privacy Intelligence <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Instant, Actionable, Regulator-Aligned</span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              Assess, monitor, and strengthen your privacy posture with focused tools built for rapid decision support.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToTools}
                className="px-8 py-4 bg-[#1cd35c] hover:bg-[#19b850] text-white rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(28,211,92,0.3)] hover:shadow-[0_0_30px_rgba(28,211,92,0.5)]"
              >
                Explore Tools
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/about"
                className="px-8 py-4 bg-transparent border-2 border-[#1cd35c] text-[#1cd35c] rounded-full font-bold transition-all duration-300 hover:bg-[#1cd35c] hover:text-white"
              >
                Learn About Proteccio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section id="tools-grid" className="container px-4 mx-auto max-w-7xl mb-20">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-medium mb-4">
            Free Tools
          </span>
          <h2 className="text-3xl font-bold text-white mb-4">Choose Your Tool by Journey Stage</h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Each tool solves a specific privacy pain point and shows why operational visibility matters.
          </p>
        </div>

        <div className="space-y-14">
          {groupedTools.map((stageGroup) => (
            <div key={stageGroup.key}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1cd35c]/10 flex items-center justify-center">
                  <stageGroup.icon className="w-5 h-5 text-[#1cd35c]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{stageGroup.label}</h3>
                  <p className="text-sm text-white/50">{stageGroup.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-6">
                {stageGroup.tools.map((tool, idx) => {
                  const meta = getToolMeta(tool);
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05, duration: 0.5 }}
                      whileHover={{ y: -10 }}
                      className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#1cd35c]/30 rounded-2xl p-9 hover:bg-white/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(28,211,92,0.1)] group cursor-pointer flex flex-col h-full relative overflow-hidden"
                      onClick={() => setSelectedTool(tool)}
                    >
                      <div className="absolute -inset-px bg-gradient-to-br from-[#1cd35c]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                      <div className="relative z-10 flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#1cd35c]/20 transition-colors duration-300">
                          <tool.icon className="w-6 h-6 text-[#1cd35c]" />
                        </div>
                        <div className="flex gap-2">
                          {meta.mostUsed && (
                            <span className="px-3 py-1 bg-[#1cd35c]/10 text-[#1cd35c] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#1cd35c]/20">
                              Most Used Tool
                            </span>
                          )}
                          {tool.id === "privacy-chaos" && (
                            <span className="px-3 py-1 bg-[#1cd35c]/10 text-[#1cd35c] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#1cd35c]/20">
                              Scorable
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="relative z-10 text-xl font-bold text-white mb-3 group-hover:text-[#1cd35c] transition-colors duration-300">
                        {tool.name}
                      </h3>

                      <p className="relative z-10 text-white/70 text-sm leading-relaxed mb-4 flex-grow group-hover:text-white/80 transition-colors duration-300">
                        {tool.description}
                      </p>

                      <div className="relative z-10 space-y-2 mb-5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Time to complete: <span className="text-white/70">{meta.timeToComplete}</span></p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Best for: <span className="text-white/70">{meta.bestFor}</span></p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Artifact: <span className="text-[#1cd35c]">Get downloadable PDF summary</span></p>
                        {tool.questions.length > 0 && (
                          <div className="pt-1">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
                              <span>Assessment progress</span>
                              <span>25% complete</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-[#1cd35c] rounded-full" style={{ width: "25%" }}></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="relative z-10 flex items-center text-sm font-bold text-[#1cd35c] mt-auto group/link">
                        <span className="relative">
                          Try Tool
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1cd35c] group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(28,211,92,0.8)]" />
                        </span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {selectedTool && (
          <div className="mt-12 p-6 bg-gradient-to-br from-[#1cd35c]/20 to-transparent border border-[#1cd35c]/30 rounded-2xl">
            <h3 className="text-2xl font-black text-white mb-2">Assessment Snapshot</h3>
            <p className="text-white/70 mb-4">You scored {selectedScore}% readiness. You scored above {selectedBenchmark} of similar organizations in Healthcare.</p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-[#1cd35c] text-white rounded-xl text-xs font-black uppercase tracking-widest">Download Report</button>
              <button className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest">Book Expert Review</button>
              <button className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest">See Recommended Modules</button>
              <button className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest">Email Me the Report</button>
            </div>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container px-4 mx-auto max-w-5xl mb-4">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#1a232e] backdrop-blur-2xl text-center p-12 md:p-20">
          {/* CTA Background Effects */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#1cd35c]/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#1cd35c]/5 to-transparent opacity-50 -z-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#1cd35c]/10 rounded-full blur-[100px] pointer-events-none"></div>

          <Shield className="w-12 h-12 text-[#1cd35c] mx-auto mb-6" />

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready for <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Real Compliance</span>?
          </h2>

          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            These tools show the problems. Proteccio solves them with connected RoPA,
            vendor management, and audit-ready documentation.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/book-demo"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#1cd35c] hover:bg-[#19b850] text-white font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(28,211,92,0.3)] hover:shadow-[0_0_30px_rgba(28,211,92,0.5)]"
            >
              Get Started with Proteccio
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 border border-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all duration-300"
            >
              Upgrade to Full Platform
            </Link>
          </div>
          <p className="text-xs text-white/50 mt-4">Move from assessment to continuous governance.</p>
        </div>
      </section>

      {/* Tool Experience Modal */}
      <AnimatePresence>
        {selectedTool && (
          <ToolExperience
            tool={selectedTool}
            onClose={() => setSelectedTool(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tools;
