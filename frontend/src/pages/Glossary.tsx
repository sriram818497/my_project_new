import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { Search, BookOpen, Sparkles, TrendingUp, Shield, Database } from "lucide-react";
import { GLOSSARY, type GlossaryEntry } from "../features/glossary/glossaryData";
import { jsonForInlineScript } from "../utils/security";
const Glossary = () => {
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedTerms, setExpandedTerms] = useState<Record<string, boolean>>({});
  const [showConfusedTerms, setShowConfusedTerms] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

    const glossary = GLOSSARY;

  const categories = [
    { name: "all", label: "All Terms", icon: BookOpen, color: "#1cd35c" },
    { name: "Regulations", label: "Regulations", icon: Shield, color: "#3b82f6" },
    { name: "Security", label: "Security", icon: Shield, color: "#ef4444" },
    { name: "Rights", label: "Rights", icon: Sparkles, color: "#8b5cf6" },
    { name: "Technical", label: "Technical", icon: Database, color: "#f59e0b" },
    { name: "Compliance", label: "Compliance", icon: TrendingUp, color: "#10b981" },
  ];

  const allTerms = useMemo(
    () =>
      Object.entries(glossary).flatMap(([letter, terms]) =>
        terms.map((item) => ({ ...item, letter }))
      ),
    [glossary]
  );
  const allTermNames = useMemo(
    () => new Set(allTerms.map((item) => item.term.toLowerCase())),
    [allTerms]
  );

  const getTermTags = (item: GlossaryEntry) => {
    const text = `${item.term} ${item.definition}`.toLowerCase();
    const tags: string[] = [];
    if (item.category) tags.push(item.category);
    if (text.includes("gdpr")) tags.push("GDPR");
    if (text.includes("dpdp") || text.includes("dpdpa")) tags.push("DPDP Act");
    if (text.includes("hipaa")) tags.push("HIPAA");
    if (text.includes("iso 27701")) tags.push("ISO 27701");
    if (text.includes("cross-border") || text.includes("international transfer") || text.includes("scc")) {
      tags.push("Cross-border");
    }
    return [...new Set(tags)].slice(0, 4);
  };

  const getRelatedTools = (item: GlossaryEntry) => {
    const text = `${item.term} ${item.definition}`.toLowerCase();
    if (text.includes("data mapping") || text.includes("inventory") || text.includes("unstructured")) {
      return ["Data Mapping Lite", "RoPA Management Application"];
    }
    if (text.includes("consent") || text.includes("opt-in") || text.includes("opt-out")) {
      return ["Consent Management Application", "Privacy Policy Health Check"];
    }
    if (text.includes("dpia") || text.includes("risk")) {
      return ["DPIA Management", "Privacy & Data Operational Risk Register"];
    }
    if (text.includes("vendor") || text.includes("third-party") || text.includes("scc") || text.includes("transfer")) {
      return ["Vendor Risk Intelligence Dashboard", "Cross-Border Transfer Awareness Tool"];
    }
    return ["RoPA Management Application", "Privacy Policy Health Check"];
  };

  const getRelatedConcepts = (item: GlossaryEntry) => {
    const term = item.term.toLowerCase();
    const suggestions: string[] = [];
    if (term.includes("controller")) suggestions.push("Data Processor");
    if (term.includes("data processor")) suggestions.push("Controller");
    if (term.includes("pseudonymization")) suggestions.push("Anonymization");
    if (term.includes("anonymization")) suggestions.push("Pseudonymization");
    if (term.includes("impact assessment") || term.includes("dpia")) suggestions.push("Risk Assessment");
    if (term.includes("risk assessment")) suggestions.push("Data Protection Impact Assessment (DPIA)");
    if (term.includes("international data transfer") || term.includes("cross-border")) suggestions.push("SCCs");

    return suggestions.filter((itemName) => allTermNames.has(itemName.toLowerCase())).slice(0, 3);
  };

  const getShortDefinition = (definition: string) =>
    definition.length > 140 ? `${definition.slice(0, 140).trim()}...` : definition;

  const toggleTerm = (termKey: string) => {
    setExpandedTerms((prev) => ({ ...prev, [termKey]: !prev[termKey] }));
  };

  const filteredGlossary = Object.entries(glossary).reduce(
    (acc, [letter, terms]) => {
      const filteredTerms = terms.filter(
        (item) => {
          const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.definition.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
          return matchesSearch && matchesCategory;
        }
      );
      if (filteredTerms.length > 0) {
        acc[letter] = filteredTerms;
      }
      return acc;
    },
    {} as GlossaryType
  );

  const totalTerms = Object.values(glossary).reduce((sum, terms) => sum + terms.length, 0);
  const isFiltering = searchTerm.length > 0 || selectedCategory !== "all";
  const definedTermSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      name: "Privacy & Data Protection Glossary",
      hasDefinedTerm: allTerms.map((item) => ({
        "@type": "DefinedTerm",
        name: item.term,
        description: item.definition,
        inDefinedTermSet: "Privacy & Data Protection Glossary",
      })),
    }),
    [allTerms]
  );
  const confusedTerms = [
    {
      left: "Controller",
      right: "Processor",
      summary: "Controller decides why and how data is processed. Processor handles data on the controller's instructions.",
    },
    {
      left: "Pseudonymization",
      right: "Anonymization",
      summary: "Pseudonymized data can be re-linked with additional information. Anonymized data cannot be traced back to an individual.",
    },
    {
      left: "DPIA",
      right: "Risk Assessment",
      summary: "DPIA is a privacy-specific regulatory assessment. Risk assessments can cover broader operational and security risks.",
    },
    {
      left: "Data Localization",
      right: "Data Residency",
      summary: "Localization is a legal requirement to keep data in-country. Residency describes where data is stored by design.",
    },
  ];
  const quizQuestions = [
    {
      question: "Who determines the purposes and means of processing personal data?",
      options: ["Data Processor", "Controller", "Sub-processor"],
      correct: "Controller",
    },
    {
      question: "Which mechanism is commonly used for lawful international data transfers?",
      options: ["SCCs", "CAPTCHA", "MFA"],
      correct: "SCCs",
    },
    {
      question: "What does DPIA stand for?",
      options: ["Data Privacy Internal Audit", "Data Protection Impact Assessment", "Data Processing Integrity Assessment"],
      correct: "Data Protection Impact Assessment",
    },
  ];
  const quizScore = quizQuestions.reduce((score, q, index) => {
    if (quizAnswers[index] === q.correct) return score + 1;
    return score;
  }, 0);

  const getCategoryColor = (category?: string) => {
    const cat = categories.find(c => c.name === category);
    return cat?.color || "#1cd35c";
  };

  return (
    <div className="min-h-screen bg-transparent mt-16 pb-14 md:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonForInlineScript(definedTermSchema) }} />
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-[#1cd35c]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-[#1cd35c]/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto flex gap-6 lg:gap-12 relative z-10">
        {/* Left Side Navigation (A-M) */}
        <div className="hidden lg:flex flex-col justify-center sticky top-24 h-[calc(100vh-120px)] w-12 z-50">
          <motion.div
            className="flex flex-col gap-1 p-2 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl relative"
            onMouseLeave={() => setHoveredLetter(null)}
          >
            {"ABCDEFGHIJKLM".split("").map((letter) => {
              const hasTerms = glossary[letter] && glossary[letter].length > 0;
              const isActive = activeLetter === letter || hoveredLetter === letter;
              return (
                <motion.button
                  key={letter}
                  onMouseEnter={() => {
                    if (!hasTerms) return;
                    setHoveredLetter(letter);
                    setActiveLetter(letter);
                  }}
                  whileHover={hasTerms ? { scale: 1.3, zIndex: 60 } : {}}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 relative
                    ${isActive
                      ? "bg-[#1cd35c] text-black shadow-xl shadow-[#1cd35c]/40"
                      : "text-white"
                    }
                    ${!hasTerms ? "opacity-[0.1] cursor-not-allowed" : "cursor-pointer hover:bg-[#1cd35c]/20"}
                  `}
                >
                  {letter}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* Main Stage */}
        <div className="flex-1">
          <div className="lg:hidden sticky top-24 z-40 mb-6 py-3 bg-gray-900/80 backdrop-blur-xl border-y border-white/10 rounded-2xl overflow-x-auto">
            <div className="flex items-center gap-2 px-3 min-w-max">
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
                const hasTerms = glossary[letter] && glossary[letter].length > 0;
                const isActive = activeLetter === letter || hoveredLetter === letter;
                return (
                  <button
                    key={`mobile-${letter}`}
                    onClick={() => {
                      if (!hasTerms) return;
                      setHoveredLetter(letter);
                      setActiveLetter(letter);
                    }}
                    className={`w-8 h-8 rounded-full text-[10px] font-black transition-all
                      ${isActive ? "bg-[#1cd35c] text-black" : "bg-white/5 text-white/70"}
                      ${!hasTerms ? "opacity-30 cursor-not-allowed" : "hover:bg-[#1cd35c]/20"}
                    `}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {hoveredLetter ? (
              <motion.div
                key="hover"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12"
              >
                <div className="flex gap-8 items-center mb-16 px-4">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1cd35c] to-[#19b850] flex items-center justify-center shadow-2xl shadow-[#1cd35c]/30 transform -rotate-2">
                    <h2 className="text-5xl font-black text-black leading-none">{hoveredLetter}</h2>
                  </div>
                  <div className="flex-1">
                    <div className="h-px bg-gradient-to-r from-[#1cd35c]/40 to-transparent mb-4" />
                    <p className="text-[#1cd35c] text-[10px] font-black uppercase tracking-[0.5em]">
                      Accessing Glossary: Entry {hoveredLetter}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {(glossary[hoveredLetter] || []).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group p-8 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 hover:border-[#1cd35c]/30 transition-all hover:-translate-y-2 relative overflow-hidden"
                    >
                      {item.category && (
                        <span className="absolute top-6 right-8 text-[8px] font-black uppercase tracking-widest opacity-40" style={{ color: getCategoryColor(item.category) }}>
                          {item.category}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#1cd35c] transition-colors pr-8">
                        {item.term}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {getTermTags(item).map((tag) => (
                          <span key={`${item.term}-${tag}`} className="px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-md bg-white/5 border border-white/10 text-white/70">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed font-medium">
                        {expandedTerms[`${hoveredLetter}-${item.term}`] ? item.definition : getShortDefinition(item.definition)}
                      </p>
                      <button
                        onClick={() => toggleTerm(`${hoveredLetter}-${item.term}`)}
                        className="mt-3 text-[10px] font-black uppercase tracking-widest text-[#1cd35c] hover:underline"
                      >
                        {expandedTerms[`${hoveredLetter}-${item.term}`] ? "Show less" : "Expand for detailed explanation"}
                      </button>
                      {expandedTerms[`${hoveredLetter}-${item.term}`] && (
                        <>
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Used in these Proteccio tools</p>
                            <div className="flex flex-wrap gap-2">
                              {getRelatedTools(item).map((tool) => (
                                <span key={`${item.term}-${tool}`} className="px-2 py-1 text-[10px] font-bold rounded-md bg-[#1cd35c]/10 border border-[#1cd35c]/20 text-[#1cd35c]">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                          {getRelatedConcepts(item).length > 0 && (
                            <div className="mt-4">
                              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Related concepts</p>
                              <div className="flex flex-wrap gap-2">
                                {getRelatedConcepts(item).map((concept) => (
                                  <span key={`${item.term}-${concept}`} className="px-2 py-1 text-[10px] font-bold rounded-md bg-white/5 border border-white/10 text-white/70">
                                    {concept}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : isFiltering ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                className="py-12"
              >
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-black text-white mb-4">
                    Glossary <span className="text-[#1cd35c]">Results</span>
                  </h2>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                    {searchTerm ? `Active Search: "${searchTerm}"` : `Category: ${selectedCategory}`}
                  </p>
                </div>

                <div className="space-y-12">
                  {Object.entries(filteredGlossary).map(([letter, terms]) => (
                    <div key={letter} onMouseEnter={() => setActiveLetter(letter)}>
                      <div className="flex items-center gap-4 mb-6 opacity-40">
                        <span className="text-2xl font-black text-[#1cd35c]">{letter}</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {terms.map((item, idx) => (
                          <div key={idx} className="group p-6 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 hover:border-[#1cd35c]/20 transition-all hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#1cd35c] transition-colors">{item.term}</h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {getTermTags(item).map((tag) => (
                                <span key={`${item.term}-${tag}`} className="px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-md bg-white/5 border border-white/10 text-white/70">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <p className="text-white/40 text-xs leading-relaxed font-medium">
                              {expandedTerms[`${letter}-${item.term}`] ? item.definition : getShortDefinition(item.definition)}
                            </p>
                            <button
                              onClick={() => toggleTerm(`${letter}-${item.term}`)}
                              className="mt-3 text-[10px] font-black uppercase tracking-widest text-[#1cd35c] hover:underline"
                            >
                              {expandedTerms[`${letter}-${item.term}`] ? "Show less" : "Expand for detailed explanation"}
                            </button>
                            {expandedTerms[`${letter}-${item.term}`] && (
                              <>
                                <div className="mt-4 pt-4 border-t border-white/10">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Used in these Proteccio tools</p>
                                  <div className="flex flex-wrap gap-2">
                                    {getRelatedTools(item).map((tool) => (
                                      <span key={`${item.term}-${tool}`} className="px-2 py-1 text-[10px] font-bold rounded-md bg-[#1cd35c]/10 border border-[#1cd35c]/20 text-[#1cd35c]">
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                {getRelatedConcepts(item).length > 0 && (
                                  <div className="mt-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Related concepts</p>
                                    <div className="flex flex-wrap gap-2">
                                      {getRelatedConcepts(item).map((concept) => (
                                        <span key={`${item.term}-${concept}`} className="px-2 py-1 text-[10px] font-bold rounded-md bg-white/5 border border-white/10 text-white/70">
                                          {concept}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {Object.keys(filteredGlossary).length === 0 && (
                  <div className="text-center py-16 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-md">
                    <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/30 font-black uppercase tracking-widest">Zero Matches Found</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="mt-12 mx-auto block px-8 py-3 bg-[#1cd35c]/10 text-[#1cd35c] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-[#1cd35c]/20 hover:bg-[#1cd35c] hover:text-black transition-all shadow-lg hover:shadow-[#1cd35c]/20"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center text-center min-h-[70vh] py-12"
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <BookOpen className="w-8 h-8 text-[#1cd35c]" />
                  <span className="px-4 py-1.5 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-black text-[10px] uppercase tracking-[0.2em] border border-[#1cd35c]/20">
                    Privacy Lexicon
                  </span>
                </div>

                <h1 className="mb-6 text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                  Privacy & Data Protection{" "}
                  <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">
                    Glossary
                  </span>
                </h1>

                <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl text-white/50 font-medium leading-relaxed">
                  Clear, regulator-aligned definitions of privacy, security, and data governance concepts - built for legal, compliance, and technology teams.
                </p>

                <div className="flex items-center justify-center gap-6 mb-12">
                  <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-[#1cd35c] shadow-[0_0_15px_rgba(28,211,92,0.5)]" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">{totalTerms} Total Terms</span>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                    <Sparkles className="w-4 h-4 text-[#1cd35c]" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">6 Categories</span>
                  </div>
                </div>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-10">
                  Updated regularly to reflect evolving global regulations.
                </p>

                <div className="w-full max-w-4xl mb-10 p-6 bg-white/5 border border-white/10 rounded-3xl text-left">
                  <h3 className="text-lg font-black text-white mb-4">Why this glossary matters</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-white/70">
                    <p><span className="text-[#1cd35c] font-black">Why:</span> Align legal, compliance, and engineering teams on consistent privacy language.</p>
                    <p><span className="text-[#1cd35c] font-black">Who:</span> Privacy leaders, DPOs, security teams, and product stakeholders.</p>
                    <p><span className="text-[#1cd35c] font-black">How:</span> Search by regulation or term, then expand definitions for implementation context.</p>
                  </div>
                </div>

                <div className="relative w-full max-w-2xl group">
                  <Search className="absolute left-6 top-1/2 w-5 h-5 text-[#1cd35c] -translate-y-1/2 group-focus-within:scale-110 transition-transform" />
                  <input
                    type="text"
                    placeholder="Search by term, regulation, or keyword (e.g., DPIA, Data Processor, SCCs)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 text-white placeholder:text-white/20 focus:border-[#1cd35c]/50 focus:outline-none focus:ring-4 focus:ring-[#1cd35c]/5 shadow-2xl transition-all font-medium"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${selectedCategory === cat.name
                        ? "bg-[#1cd35c] text-black shadow-lg shadow-[#1cd35c]/40"
                        : "bg-white/5 text-white/40 hover:bg-white/10 border border-white/10"
                        }`}
                    >
                      <cat.icon className="w-4 h-4" />
                      {cat.name === "all" ? `${cat.label} (${totalTerms})` : cat.label}
                    </button>
                  ))}
                </div>

                <div className="w-full max-w-4xl mt-8">
                  <button
                    onClick={() => setShowConfusedTerms((prev) => !prev)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:border-[#1cd35c]/30 transition-all"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c] mb-1">Compare Concepts</p>
                    <p className="text-white font-bold">{showConfusedTerms ? "Hide commonly confused terms" : "Show commonly confused terms"}</p>
                  </button>

                  {showConfusedTerms && (
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {confusedTerms.map((pair) => (
                        <div key={`${pair.left}-${pair.right}`} className="p-5 bg-white/5 border border-white/10 rounded-2xl text-left">
                          <p className="text-xs font-black uppercase tracking-widest text-[#1cd35c] mb-2">
                            {pair.left} vs {pair.right}
                          </p>
                          <p className="text-sm text-white/70">{pair.summary}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-full max-w-4xl mt-10 p-6 bg-gradient-to-br from-[#1cd35c]/20 to-transparent border border-[#1cd35c]/30 rounded-3xl text-left">
                  <h3 className="text-xl font-black text-white mb-4">Test Your Privacy Knowledge</h3>
                  <div className="space-y-5">
                    {quizQuestions.map((q, idx) => (
                      <div key={q.question} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-sm font-bold text-white mb-3">{idx + 1}. {q.question}</p>
                        <div className="flex flex-col gap-2">
                          {q.options.map((option) => (
                            <label key={option} className="text-sm text-white/70 flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`quiz-${idx}`}
                                value={option}
                                checked={quizAnswers[idx] === option}
                                onChange={() => setQuizAnswers((prev) => ({ ...prev, [idx]: option }))}
                                className="accent-[#1cd35c]"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        className="px-6 py-3 bg-[#1cd35c] text-black rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all"
                      >
                        Check Score
                      </button>
                      {quizSubmitted && (
                        <span className="text-sm text-white/80 font-bold">
                          Score: {quizScore}/{quizQuestions.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vertical A-Z Rail - Fixed on Right */}
        <div className="hidden lg:flex flex-col justify-center sticky top-24 h-[calc(100vh-120px)] w-12 z-50">
          <motion.div
            className="flex flex-col gap-1 p-2 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl relative"
            onMouseLeave={() => setHoveredLetter(null)}
          >
            {"NOPQRSTUVWXYZ".split("").map((letter) => {
              const hasTerms = glossary[letter] && glossary[letter].length > 0;
              const isActive = activeLetter === letter || hoveredLetter === letter;
              return (
                <motion.button
                  key={letter}
                  onMouseEnter={() => {
                    if (!hasTerms) return;
                    setHoveredLetter(letter);
                    setActiveLetter(letter);
                  }}
                  whileHover={hasTerms ? { scale: 1.3, zIndex: 60 } : {}}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 relative
                    ${isActive
                      ? "bg-[#1cd35c] text-black shadow-xl shadow-[#1cd35c]/40"
                      : "text-white"
                    }
                    ${!hasTerms ? "opacity-[0.1] cursor-not-allowed" : "cursor-pointer hover:bg-[#1cd35c]/20"}
                  `}
                >
                  {letter}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Glossary;




