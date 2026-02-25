import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Database,
  CheckCircle2,
  Shield,
  Globe,
  Lock,
  ArrowRight,
  Award,
} from "lucide-react";
import { contentManagerService } from "../services/contentManager";
import type { CaseStudyContent } from "../types/content";

const CaseStudyDetail = () => {
  const { id } = useParams();
  const [items, setItems] = useState<CaseStudyContent[]>(() => contentManagerService.getCaseStudies());
  const [showExecutiveSummary, setShowExecutiveSummary] = useState(false);

  useEffect(() => {
    const refresh = () => setItems(contentManagerService.getCaseStudies());
    const unsubscribe = contentManagerService.subscribe(refresh);
    refresh();
    return unsubscribe;
  }, []);

  const study = useMemo(() => items.find((item) => item.id === id), [items, id]);

  if (!study) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-3xl font-black mb-4">Case Study Not Found</h2>
          <Link to="/case-studies" className="text-[#1cd35c] hover:underline inline-flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Case Studies
          </Link>
        </div>
      </div>
    );
  }

  const relatedStudies = items.filter((item) => item.id !== id).slice(0, 3);
  const isLuxuryRetailStudy =
    study.industry.toLowerCase().includes("luxury") ||
    study.title.toLowerCase().includes("high-fashion");

  const parseOutcome = (outcome: string) => {
    const percentageMatch = outcome.match(/\b\d+(\.\d+)?%/);
    if (percentageMatch) {
      return {
        metric: percentageMatch[0],
        detail: outcome.replace(percentageMatch[0], "").trim(),
      };
    }

    const normalized = outcome.toLowerCase();
    if (normalized.startsWith("privacy leader")) {
      return {
        metric: "Privacy Leader",
        detail: outcome.replace(/^privacy leader\s*/i, "").trim(),
      };
    }
    if (normalized.startsWith("stronger brand loyalty")) {
      return {
        metric: "Stronger Loyalty",
        detail: outcome.replace(/^stronger brand loyalty\s*/i, "").trim(),
      };
    }
    if (normalized.startsWith("zero")) {
      return {
        metric: "Zero",
        detail: outcome.replace(/^zero\s*/i, "").trim(),
      };
    }

    const words = outcome.split(" ");
    return {
      metric: words[0],
      detail: words.slice(1).join(" "),
    };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={study.imageUrl} alt={study.title} className="w-full h-full object-cover opacity-40 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>

        <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl h-full flex flex-col justify-end pb-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Link to="/case-studies" className="inline-flex items-center gap-2 text-[#1cd35c] font-black text-xs uppercase tracking-widest mb-6 hover:translate-x-[-4px] transition-transform">
              <ArrowLeft className="w-4 h-4" /> Back to Case Studies
            </Link>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-1.5 bg-[#1cd35c]/10 text-[#1cd35c] rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#1cd35c]/20">
                {study.industry}
              </span>
              <span className="px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-white/60 border border-white/10">
                {study.regulation}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-[1.1]">{study.title}</h1>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-20 z-40 py-6">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 lg:p-10 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Solution Area</span>
                <span className="text-base font-bold text-[#1cd35c] flex items-center gap-3">
                  <Database className="w-4 h-4" /> {study.solutionType}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Asset Category</span>
                <span className="text-base font-bold text-white uppercase tracking-wider">{study.assetType}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Published Date</span>
                <span className="text-base font-bold text-white flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-white/40" /> {study.date}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Compliance</span>
                <span className="text-base font-bold text-white flex items-center gap-3">
                  <Shield className="w-4 h-4 text-[#1cd35c]" /> {study.regulation}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16 relative z-10">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-[1fr_400px] gap-20">
            <div className="space-y-16">
              {isLuxuryRetailStudy && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <button
                    type="button"
                    onClick={() => setShowExecutiveSummary((prev) => !prev)}
                    className="w-full flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#1cd35c]/30 transition-all"
                  >
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c] mb-2">Executive View</p>
                      <h2 className="text-xl md:text-2xl font-black">2-Minute Executive Summary</h2>
                    </div>
                    <span className="text-[#1cd35c] text-xs font-black uppercase tracking-widest">
                      {showExecutiveSummary ? "Hide" : "Show"}
                    </span>
                  </button>

                  {showExecutiveSummary && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c] mb-2">Problem</p>
                        <p className="text-sm text-white/80">Deliver premium personalization while maintaining discretion, transparency, and regional compliance at global scale.</p>
                      </div>
                      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c] mb-2">Solution</p>
                        <p className="text-sm text-white/80">Preference Center, contextual consent, VIP masking, and automated retention controls embedded in customer journeys.</p>
                      </div>
                      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c] mb-2">Results</p>
                        <p className="text-sm text-white/80">Improved VIP repeat purchases, sustained zero data-usage complaints, and stronger loyalty indicators.</p>
                      </div>
                      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c] mb-2">Compliance Impact</p>
                        <p className="text-sm text-white/80">Operationalized GDPR-aligned consent, data minimization, and localization controls across flagship and digital channels.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-3xl font-black mb-6 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1cd35c]/10 flex items-center justify-center text-[#1cd35c] text-sm">01</span>
                  Overview
                </h2>
                <p className="text-lg text-white/60 leading-relaxed font-medium">{study.overview}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-3xl font-black mb-6 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1cd35c]/10 flex items-center justify-center text-[#1cd35c] text-sm">02</span>
                  The Challenges
                </h2>
                <div className="grid gap-4">
                  {study.challenges.map((challenge, index) => (
                    <div key={`${study.id}-challenge-${index}`} className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 group hover:border-[#1cd35c]/30 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">!</div>
                      <p className="text-white/80 font-medium">{challenge}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-3xl font-black mb-6 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1cd35c]/10 flex items-center justify-center text-[#1cd35c] text-sm">03</span>
                  Our Solution
                </h2>
                <div className="grid gap-4">
                  {study.solution_detail.map((solution, index) => (
                    <div key={`${study.id}-solution-${index}`} className="flex gap-4 p-5 bg-[#1cd35c]/5 rounded-2xl border border-[#1cd35c]/20 group hover:border-[#1cd35c]/40 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-[#1cd35c]/20 flex items-center justify-center text-[#1cd35c] shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <p className="text-white/80 font-medium">{solution}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-3xl font-black mb-6 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1cd35c]/10 flex items-center justify-center text-[#1cd35c] text-sm">04</span>
                  Key Outcomes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {study.outcomes.map((outcome, index) => {
                    const parsed = parseOutcome(outcome);
                    return (
                      <div key={`${study.id}-outcome-${index}`} className="p-6 bg-gradient-to-br from-[#1cd35c]/10 to-transparent border border-[#1cd35c]/20 rounded-3xl">
                        <div className="text-4xl md:text-5xl font-black text-[#1cd35c] mb-3 leading-none">{parsed.metric}</div>
                        <p className="text-sm text-white/60 font-medium">{parsed.detail}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            <div className="space-y-8">
              {study.testimonial && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="p-8 bg-gradient-to-br from-[#1cd35c] to-[#19b850] rounded-[2.5rem] shadow-2xl relative">
                  <span className="text-5xl absolute top-6 right-8 text-black/10 font-serif">\"</span>
                  <p className="text-black font-extrabold text-xl leading-relaxed mb-8 relative z-10">\"{study.testimonial.quote}\"</p>
                  <div className="flex items-center gap-4 border-t border-black/10 pt-6">
                    <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-black font-black">{study.testimonial.author[0]}</div>
                    <div>
                      <div className="font-black text-black">{study.testimonial.author}</div>
                      <div className="text-xs font-bold text-black/60 uppercase tracking-widest">{study.testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {study.timeline && study.timeline.length > 0 && (
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <h4 className="text-lg font-black uppercase tracking-widest text-[#1cd35c]">Project Timeline</h4>
                    {isLuxuryRetailStudy && (
                      <span className="px-3 py-1 rounded-lg bg-[#1cd35c]/10 border border-[#1cd35c]/20 text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">
                        12-Week Transformation
                      </span>
                    )}
                  </div>
                  {isLuxuryRetailStudy && (
                    <p className="text-xs text-white/50 font-medium mb-8">
                      Each phase delivered measurable outputs tied to personalization, trust, and compliance outcomes.
                    </p>
                  )}
                  <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                    {study.timeline.map((item, index) => (
                      <div key={`${study.id}-timeline-${index}`} className="relative pl-10 group">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gray-900 border-2 border-[#1cd35c] flex items-center justify-center z-10 group-hover:bg-[#1cd35c] transition-colors duration-500">
                          <div className="w-2 h-2 rounded-full bg-[#1cd35c] group-hover:bg-gray-900" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1cd35c] mb-1">{item.phase}</span>
                          <h5 className="text-sm font-bold text-white mb-1">{item.title}</h5>
                          <span className="text-xs text-white/40 font-medium">{item.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {study.certifications && study.certifications.length > 0 && (
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                  <h4 className="text-lg font-black mb-8 uppercase tracking-widest text-[#1cd35c]">Certifications</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {study.certifications.map((certification, index) => (
                      <div key={`${study.id}-cert-${index}`} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-[#1cd35c]/5 hover:border-[#1cd35c]/20 transition-all group">
                        <Award className="w-4 h-4 text-[#1cd35c] group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black text-white/80 uppercase tracking-tighter">{certification}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-[#1cd35c]">Resources</h4>
                <div className="space-y-4">
                  <a href="#" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 group">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-[#1cd35c]" />
                      <span className="text-sm font-bold">Privacy Framework</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#1cd35c] transition-colors" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 group">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-[#1cd35c]" />
                      <span className="text-sm font-bold">Global Regulations</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#1cd35c] transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isLuxuryRetailStudy && (
        <section className="py-8 border-t border-white/5 border-b border-white/5 bg-white/[0.01]">
          <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
            <div className="p-6 md:p-8 bg-gradient-to-r from-[#1cd35c]/12 to-transparent border border-[#1cd35c]/20 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c] mb-2">Social Proof</p>
                <p className="text-white font-bold">Trusted by global luxury brands across 14 countries.</p>
              </div>
              <div className="text-xs text-white/60 font-medium">Anonymized deployment references available under NDA.</div>
            </div>
          </div>
        </section>
      )}

      <section className="py-14 md:py-16 border-t border-white/5 bg-white/[0.01]">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <h2 className="text-2xl font-black mb-12 uppercase tracking-[0.2em] text-[#1cd35c]">Related Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedStudies.map((item) => (
              <Link key={item.id} to={`/case-studies/${item.id}`} className="group p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-[#1cd35c]/30 hover:-translate-y-2 transition-all flex flex-col">
                <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gray-900/90 text-[9px] font-black uppercase tracking-widest text-[#1cd35c] rounded-md border border-white/10">{item.industry}</span>
                  </div>
                </div>
                <h4 className="text-lg font-black leading-snug group-hover:text-[#1cd35c] transition-colors mb-4 line-clamp-2">{item.title}</h4>
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{item.regulation}</span>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#1cd35c] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-[#1cd35c] to-[#19b850] rounded-3xl p-6 md:p-10 text-center relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-black text-black mb-3">Ready to replicate these results?</h2>
              <p className="text-black/70 text-[10px] font-black mb-6 max-w-lg mx-auto uppercase tracking-widest">Join 1,000+ organizations building trust with Proteccio.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/book-demo" className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-black hover:scale-105 transition-transform shadow-lg">
                  Book a Free Demo
                </Link>
                <Link to="/contact" className="px-6 py-2.5 bg-white/20 backdrop-blur-md text-black rounded-xl text-xs font-black hover:bg-white/30 transition-all">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudyDetail;
