import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CATEGORIES, FAQ_DATA } from "../features/faq/faqData";
import {
  Search, BookOpen,
  Layout, ChevronDown,
  ThumbsUp, ThumbsDown, MessageSquare,
  ArrowRight, X, Mail, TrendingUp
} from "lucide-react";

const renderHighlightedAnswer = (answer: string) =>
  answer.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    const isHighlighted = part.startsWith("**") && part.endsWith("**");
    if (!isHighlighted) {
      return <span key={`${index}-${part}`}>{part}</span>;
    }

    return (
      <span key={`${index}-${part}`} className="text-[#1cd35c] font-black">
        {part.slice(2, -2)}
      </span>
    );
  });

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'yes' | 'no'>>({});
  const [feedbackNotes, setFeedbackNotes] = useState<Record<string, string>>({});
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<Record<string, boolean>>({});
  const [isExpanded, setIsExpanded] = useState(false);


  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? faq.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const displayedFAQs = isExpanded ? filteredFAQs : filteredFAQs.slice(0, 10);
  const firstFilteredId = filteredFAQs[0]?.id ?? null;

  const popularFAQs = FAQ_DATA.filter(faq => faq.isPopular);
  const categoryCounts = CATEGORIES.reduce<Record<string, number>>((acc, category) => {
    acc[category.id] = FAQ_DATA.filter((faq) => faq.category === category.id).length;
    return acc;
  }, {});

  useEffect(() => {
    setIsExpanded(false);
    setOpenId(firstFilteredId);
  }, [searchQuery, activeCategory, firstFilteredId]);

  const handleFeedback = (faqId: string, value: 'yes' | 'no') => {
    setFeedbackState(prev => ({ ...prev, [faqId]: value }));
    if (value === "yes") {
      setFeedbackSubmitted((prev) => ({ ...prev, [faqId]: false }));
      setFeedbackNotes((prev) => ({ ...prev, [faqId]: "" }));
    }
  };

  const handleFeedbackNoteSubmit = (faqId: string) => {
    setFeedbackSubmitted((prev) => ({ ...prev, [faqId]: true }));
  };

  const getSmartCTA = () => {
    const query = searchQuery.toLowerCase();

    if (query.includes("vendor") || query.includes("third-party")) {
      return {
        title: "See Vendor Risk Dashboard in Action",
        description: "Explore how Proteccio maps vendor flows, subprocessors, and cross-border exposure in one view.",
        buttonLabel: "View Vendor Risk Demo",
        href: "/book-demo",
      };
    }

    if (query.includes("iso 27701") || (activeCategory === "Compliance & Regulations" && query.includes("iso"))) {
      return {
        title: "Get ISO Readiness Assessment",
        description: "Review your current posture against ISO 27701 controls with a guided expert walkthrough.",
        buttonLabel: "Start ISO Readiness",
        href: "/book-demo",
      };
    }

    return {
      title: "Talk to a Privacy Architect",
      description: "Get a focused 30-minute expert session tailored to your privacy and compliance priorities.",
      buttonLabel: "Book a 30-Minute Session",
      href: "/book-demo",
    };
  };

  const smartCTA = getSmartCTA();

  return (
    <div className="min-h-screen bg-transparent text-white pt-20 selection:bg-[#1cd35c]/30">

      {/* Hero Section */}
      <section className="relative pt-10 pb-8 overflow-hidden">
        <div className="container px-4 mx-auto max-w-7xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 border border-[#1cd35c]/20 rounded-full text-[#1cd35c] text-xs font-black uppercase tracking-widest mb-6">
              Support Center
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Trusted Answers to Your Data Privacy <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075]">& Compliance Questions</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed mb-8">
              Find clear, regulator-aligned guidance, technical insights, and implementation best practices to confidently manage modern data privacy obligations.
            </p>

            {/* Centered Large Search */}
            <div className="relative max-w-2xl mx-auto group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#1cd35c] transition-colors" />
              <input
                type="text"
                placeholder="Search by regulation, topic, or capability (e.g., GDPR, DPDP Act, Data Mapping, SOC 2)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 py-3.5 pl-14 pr-7 rounded-2xl focus:outline-none focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 transition-all text-sm md:text-base font-medium shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Topic Hub */}
      <section className={`sticky top-20 z-30 pt-4 pb-6 transition-all duration-500 bg-gray-900/80 backdrop-blur-xl border-y border-white/5 ${searchQuery ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-2">Browse by Topic</h2>
            <div className="w-12 h-1 bg-[#1cd35c]/30 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex flex-col items-center justify-center p-4 rounded-[1.5rem] border transition-all duration-300 group ${!activeCategory ? 'bg-[#1cd35c] text-[#052c14] border-[#1cd35c] shadow-xl shadow-[#1cd35c]/20' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:bg-white/[0.08]'}`}
            >
              <div className={`p-3 rounded-xl mb-3 transition-all ${!activeCategory ? 'bg-[#052c14]/10 text-[#052c14]' : 'bg-white/5 text-white group-hover:bg-[#1cd35c]/10 group-hover:text-[#1cd35c]'}`}>
                <Layout className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-center">All Topics ({FAQ_DATA.length})</span>
            </button>

            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-[1.5rem] border transition-all duration-300 group ${activeCategory === cat.id ? 'bg-[#1cd35c] text-[#052c14] border-[#1cd35c] shadow-xl shadow-[#1cd35c]/20' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:bg-white/[0.08]'}`}
              >
                <div className={`p-3 rounded-xl mb-3 transition-all ${activeCategory === cat.id ? 'bg-[#052c14]/10 text-[#052c14]' : 'bg-white/5 text-white group-hover:bg-[#1cd35c]/10 group-hover:text-[#1cd35c]'}`}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight">{cat.id} ({categoryCounts[cat.id] ?? 0})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Header (Sticky only on scroll) */}
      <div className="py-5 bg-white/[0.02] backdrop-blur-3xl border-b border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1cd35c]/10 rounded-lg border border-[#1cd35c]/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1cd35c] animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">Live Filter</span>
              </div>
              <span className="text-sm font-bold text-white/90">
                {searchQuery ? `Searching: "${searchQuery}"` : activeCategory || "Exploring All Topics"}
              </span>
            </div>
            {(searchQuery || activeCategory) && (
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
                className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40 hover:text-red-400 transition-all hover:tracking-widest"
              >
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container px-4 mx-auto max-w-7xl py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Main Content */}
          <div className="flex-1 space-y-12">

            {/* Popular Questions (Only show when not searching/filtering specific categories) */}
            {!searchQuery && !activeCategory && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp className="w-5 h-5 text-[#1cd35c]" />
                  <h2 className="text-2xl font-black">Popular Questions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularFAQs.map(faq => (
                    <button
                      key={faq.id}
                      onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                      className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left hover:border-[#1cd35c]/30 hover:bg-white/[0.08] transition-all group"
                    >
                      <h3 className="font-bold text-white/90 group-hover:text-white transition-colors">{faq.question}</h3>
                      <ArrowRight className="w-4 h-4 text-[#1cd35c] mt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Search Results / FAQ List */}
            <section className="space-y-5">
              <h2 className="text-2xl font-black">
                {searchQuery ? `Search Results for "${searchQuery}"` : activeCategory || "All Questions"}
              </h2>

              <div className="space-y-5">
                <AnimatePresence>
                  {displayedFAQs.map((faq) => (
                    <motion.div
                      layout
                      key={faq.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`overflow-hidden rounded-2xl border-l-2 transition-all duration-300 ${openId === faq.id ? 'bg-white/[0.08] border-[#1cd35c]/50 border-l-[#1cd35c] ring-1 ring-[#1cd35c]/20' : 'bg-white/5 border-white/10 border-l-white/20 hover:border-white/30 hover:border-l-[#1cd35c]/60'}`}
                    >
                      <button
                        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between p-7 text-left"
                      >
                        <div className="flex flex-col gap-2">
                          <span className="text-[#1cd35c] text-[10px] font-black uppercase tracking-widest opacity-80">{faq.category}</span>
                          <h3 className="text-lg font-bold">{faq.question}</h3>
                        </div>
                        <div className={`p-2 rounded-full bg-white/5 transition-transform duration-300 ${openId === faq.id ? 'rotate-180 bg-[#1cd35c]/10 text-[#1cd35c]' : 'text-gray-500'}`}>
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </button>

                      <AnimatePresence>
                        {openId === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-6"
                          >
                            <div className="pt-4 border-t border-white/5">
                              <p className="text-gray-400 leading-relaxed mb-6">
                                {renderHighlightedAnswer(faq.answer)}
                              </p>

                              {/* Helpful Micro-feedback */}
                              <div className="flex flex-col gap-4 py-4 px-6 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <span className="text-xs font-bold text-gray-500">Was this helpful?</span>
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() => handleFeedback(faq.id, 'yes')}
                                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${feedbackState[faq.id] === 'yes' ? 'bg-[#1cd35c] text-black' : 'hover:bg-white/10 text-gray-400'}`}
                                    >
                                      <ThumbsUp className="w-3 h-3" /> Yes
                                    </button>
                                    <button
                                      onClick={() => handleFeedback(faq.id, 'no')}
                                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${feedbackState[faq.id] === 'no' ? 'bg-red-500 text-white' : 'hover:bg-white/10 text-gray-400'}`}
                                    >
                                      <ThumbsDown className="w-3 h-3" /> No
                                    </button>
                                  </div>
                                </div>
                                {feedbackState[faq.id] === "no" && (
                                  <div className="space-y-2">
                                    <textarea
                                      value={feedbackNotes[faq.id] ?? ""}
                                      onChange={(e) => setFeedbackNotes((prev) => ({ ...prev, [faq.id]: e.target.value }))}
                                      placeholder="Tell us what was missing or unclear..."
                                      rows={3}
                                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#1cd35c]/50 transition-all resize-none"
                                    />
                                    <div className="flex items-center justify-between">
                                      <button
                                        onClick={() => handleFeedbackNoteSubmit(faq.id)}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                                      >
                                        Submit Feedback
                                      </button>
                                      {feedbackSubmitted[faq.id] && (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">Thanks, feedback recorded</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredFAQs.length > 10 && (
                  <div className="pt-8 flex justify-center">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#1cd35c] hover:text-black hover:border-[#1cd35c] transition-all duration-300 font-bold"
                    >
                      <span>{isExpanded ? "See Less Questions" : `See More Questions (${filteredFAQs.length - 10} more)`}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                )}

                {filteredFAQs.length === 0 && (
                  <div className="text-center py-16 px-6 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No answers found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Try adjusting your search terms or choosing a different category.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar CTA */}
          <aside className="lg:w-80 space-y-6">
            <div className="p-8 bg-gradient-to-br from-[#1cd35c]/20 to-transparent border border-[#1cd35c]/30 rounded-[2.5rem] sticky top-80">
              <div className="w-12 h-12 bg-[#1cd35c] text-black rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(28,211,92,0.4)]">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black mb-4 leading-tight">{smartCTA.title}</h3>
              <p className="text-sm text-white/70 mb-8 leading-relaxed">
                {smartCTA.description}
              </p>
              <button
                onClick={() => window.location.href = smartCTA.href}
                className="w-full py-4 bg-[#1cd35c] text-black font-black rounded-xl text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-[#1cd35c]/20 transition-all flex items-center justify-center gap-2"
              >
                {smartCTA.buttonLabel} <ArrowRight className="w-4 h-4" />
              </button>
              <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Trust Signals</p>
                <p className="text-xs text-white/70">ISO 27001 Certified</p>
                <p className="text-xs text-white/70">ISO 27701 Certified</p>
                <p className="text-xs text-white/70">Trusted by 1,000+ organizations</p>
              </div>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
              <h4 className="font-black text-white mb-3">Still have questions?</h4>
              <p className="text-sm text-white/70 mb-6">Talk to a Privacy Architect for a focused 30-minute expert session.</p>
              <button
                onClick={() => window.location.href = '/book-demo'}
                className="w-full py-3 mb-6 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Talk to a Privacy Architect
              </button>
              <h4 className="font-bold text-white mb-4">Direct Support</h4>
              <p className="text-sm text-gray-500 mb-6">Can't find what you're looking for?</p>
              <div className="space-y-4">
                <a href="mailto:hello@protecciodata.com" className="flex items-center gap-3 text-sm text-[#1cd35c] hover:underline">
                  <span className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </span>
                  hello@protecciodata.com
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div >
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default FAQ;


