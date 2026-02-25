import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  BarChart,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { contentManagerService } from "../services/contentManager";
import type { InsightArticle, InsightCapability, InsightExpertise } from "../types/content";
import { escapeHtml } from "../utils/security";
import {
  deriveInsightMeta,
  getDynamicCta,
  INDUSTRY_FILTER_OPTIONS,
  REGULATION_FILTER_OPTIONS,
  TOPIC_FILTER_OPTIONS,
  TYPE_FILTER_OPTIONS,
  type InsightMeta,
} from "../features/insights/insightsMeta";

const capabilityIcons = [BarChart, ShieldCheck, Users, Activity];

const Insights = () => {
  const navigate = useNavigate();
  const [capabilities, setCapabilities] = useState<InsightCapability[]>(() => contentManagerService.getInsightCapabilities());
  const [expertise, setExpertise] = useState<InsightExpertise[]>(() => contentManagerService.getInsightExpertise());
  const [articles, setArticles] = useState<InsightArticle[]>(() => contentManagerService.getInsightArticles());
  const [activeAccordion, setActiveAccordion] = useState<string | null>(() => contentManagerService.getInsightExpertise()[0]?.id ?? null);
  const [activeIndustryFilter, setActiveIndustryFilter] = useState("All");
  const [activeRegulationFilter, setActiveRegulationFilter] = useState("All");
  const [activeTopicFilter, setActiveTopicFilter] = useState("All");
  const [activeTypeFilter, setActiveTypeFilter] = useState("All");
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => {
      const nextCapabilities = contentManagerService.getInsightCapabilities();
      const nextExpertise = contentManagerService.getInsightExpertise();
      setCapabilities(nextCapabilities);
      setExpertise(nextExpertise);
      setArticles(contentManagerService.getInsightArticles());
      if (!nextExpertise.some((item) => item.id === activeAccordion)) {
        setActiveAccordion(nextExpertise[0]?.id ?? null);
      }
    };
    const unsubscribe = contentManagerService.subscribe(refresh);
    refresh();
    return unsubscribe;
  }, [activeAccordion]);

  const articleMeta = useMemo<InsightMeta[]>(() => deriveInsightMeta(articles), [articles]);

  const filteredArticles = useMemo(
    () =>
      articleMeta.filter((article) => {
        const industryMatch = activeIndustryFilter === "All" || article.industry === activeIndustryFilter;
        const regulationMatch = activeRegulationFilter === "All" || article.regulation === activeRegulationFilter;
        const topicMatch = activeTopicFilter === "All" || article.topic === activeTopicFilter;
        const typeMatch = activeTypeFilter === "All" || article.contentType === activeTypeFilter;
        return industryMatch && regulationMatch && topicMatch && typeMatch;
      }),
    [articleMeta, activeIndustryFilter, activeRegulationFilter, activeTopicFilter, activeTypeFilter]
  );

  const trendingArticles = useMemo(() => articleMeta.slice(0, 3), [articleMeta]);

  const activeArticle =
    articleMeta.find((article) => article.id === activeArticleId) ??
    filteredArticles[0] ??
    articleMeta[0] ??
    null;

  const dynamicCTA = useMemo(() => getDynamicCta(activeArticle), [activeArticle]);

  const downloadAsPdf = (article: InsightMeta) => {
    const printWindow = window.open("", "_blank", "noopener,noreferrer,width=900,height=700");
    if (!printWindow) return;
    const safeTitle = escapeHtml(article.title);
    const safeAuthor = escapeHtml(article.author);
    const safePublishDate = escapeHtml(article.publishDate);
    const safeUpdateDate = escapeHtml(article.updateDate);
    const safeType = escapeHtml(article.contentType);
    const safeRegulation = escapeHtml(article.regulation);
    const safeTopic = escapeHtml(article.topic);
    printWindow.document.write(`
      <html>
        <head><title>${safeTitle}</title></head>
        <body style="font-family:Arial,sans-serif;padding:32px;line-height:1.6;">
          <h1>${safeTitle}</h1>
          <p><strong>${safeAuthor}</strong></p>
          <p><strong>Published:</strong> ${safePublishDate} | <strong>Updated:</strong> ${safeUpdateDate}</p>
          <p><strong>Type:</strong> ${safeType} | <strong>Regulation:</strong> ${safeRegulation} | <strong>Topic:</strong> ${safeTopic}</p>
          <hr />
          <p>This export includes article metadata and related navigation links.</p>
          <ul>
            <li>Relevant Tool: /tools</li>
            <li>Relevant Case Study: /case-studies</li>
            <li>Relevant Industry Page: /industries</li>
          </ul>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-transparent text-white font-jakarta pt-20">
      <section className="relative h-[82vh] flex items-center justify-start overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/6 to-transparent pointer-events-none opacity-40 transition-all duration-1000"></div>

        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
            alt="Global Data Network"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 border border-[#1cd35c]/20 rounded-full text-[#1cd35c] text-xs font-black uppercase tracking-widest mb-6">
              Insights Intelligence
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              Strengthen <span className="text-[#1cd35c]">Data Trust</span> with Privacy-First Intelligence
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-light mb-12">Industry-specific. Secure. Compliant. Clear.</p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/book-demo")}
              className="px-8 py-4 bg-[#1cd35c] text-white font-black rounded-lg hover:bg-[#19b850] transition-all text-sm uppercase tracking-widest flex items-center gap-3"
            >
              Request a Demo
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white/5 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h6 className="text-xs font-black tracking-widest uppercase mb-4 text-[#1cd35c]">Our Philosophy of Trust</h6>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Attract customers and build loyalty.</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg text-white/70 leading-relaxed font-light">
                <p>
                  In a privacy first digital economy, trust is built through clear data visibility. Proteccio data delivers real time intelligence
                  to personalize experiences with full compliance.
                </p>
                <p>
                  Our governance engine is built for scale, continuous risk monitoring, and secure operations. Proteccio helps you identify and
                  manage data risks so innovation remains aligned with integrity.
                </p>
              </div>
              <p className="mt-10 text-sm text-white/60 max-w-3xl leading-relaxed">
                Our insights are developed by privacy practitioners, legal experts, and governance specialists monitoring global regulatory developments.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-transparent border-y border-white/5">
        <div className="container mx-auto px-4 max-w-7xl">
          <h4 className="text-white/60 text-sm font-black uppercase tracking-[0.3em] mb-12">Core Capabilities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((capability, index) => {
              const Icon = capabilityIcons[index % capabilityIcons.length];
              return (
                <motion.div
                  key={capability.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-all duration-500 hover:bg-white/10 hover:border-[#1cd35c]/30 hover:shadow-[0_0_30px_rgba(28,211,92,0.1)] group"
                >
                  <div className="mb-6 w-12 h-12 bg-[#1cd35c]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#1cd35c]" />
                  </div>
                  <h3 className="text-2xl font-black mb-4">{capability.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-6">{capability.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white/5 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h6 className="text-sm font-black tracking-[0.3em] uppercase mb-12 text-white/60">Our Expertise</h6>

          <div className="grid grid-cols-1 gap-0 border-t border-white/10">
            {expertise.map((item) => (
              <div key={item.id} className="border-b border-white/10">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === item.id ? null : item.id)}
                  className="w-full py-8 flex items-center justify-between group text-left hover:bg-white/5 transition-colors px-4"
                >
                  <div className="flex items-center gap-8 md:gap-16">
                    <span className={`text-2xl font-black ${activeAccordion === item.id ? "text-[#1cd35c]" : "text-white/30"}`}>{item.id}.</span>
                    <span className="text-2xl md:text-3xl font-black group-hover:text-[#1cd35c] transition-colors">{item.title}</span>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-200 ${
                      activeAccordion === item.id
                        ? "bg-[#1cd35c] border-[#1cd35c] text-black"
                        : "text-white/60 group-hover:border-[#1cd35c] group-hover:text-[#1cd35c]"
                    }`}
                  >
                    {activeAccordion === item.id ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </div>
                </button>
                <div className="pl-16 md:pl-32 pr-8 pb-4 text-sm text-white/40 max-w-3xl">
                  {item.content.split(".")[0]}. 6 insights covering DPIAs, residual risk, and regulator expectations.
                </div>
                <AnimatePresence>
                  {activeAccordion === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-16 md:pl-32 pr-8 pb-8 text-xl text-white/70 font-light max-w-3xl leading-relaxed">{item.content}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-transparent relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-wrap gap-3 mb-8">
            <select value={activeIndustryFilter} onChange={(e) => setActiveIndustryFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest">
              {INDUSTRY_FILTER_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-gray-900">{option}</option>
              ))}
            </select>
            <select value={activeRegulationFilter} onChange={(e) => setActiveRegulationFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest">
              {REGULATION_FILTER_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-gray-900">{option}</option>
              ))}
            </select>
            <select value={activeTopicFilter} onChange={(e) => setActiveTopicFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest">
              {TOPIC_FILTER_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-gray-900">{option}</option>
              ))}
            </select>
            <select value={activeTypeFilter} onChange={(e) => setActiveTypeFilter(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest">
              {TYPE_FILTER_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-gray-900">{option}</option>
              ))}
            </select>
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tight">
            In <span className="text-[#1cd35c]">focus</span>
          </h2>

          <div className="mb-12 p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-xl font-black mb-4">Trending This Month</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trendingArticles.map((article) => (
                <button
                  key={`trending-${article.id}`}
                  onClick={() => setActiveArticleId(article.id)}
                  className="text-left p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#1cd35c]/40 transition-all"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c] mb-2">{article.contentType}</p>
                  <p className="text-sm font-bold text-white">{article.title}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer hover:-translate-y-1 transition-all duration-300"
                onClick={() => setActiveArticleId(article.id)}
              >
                <div className="overflow-hidden rounded-2xl mb-6 relative aspect-[4/3] border border-white/10 group-hover:border-[#1cd35c]/30 transition-all">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  <span className="absolute top-3 left-3 px-2 py-1 bg-black/70 border border-white/10 rounded-md text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">
                    {article.contentType}
                  </span>
                </div>
                <h3 className="text-xl font-black mb-3 leading-tight group-hover:text-[#1cd35c] transition-colors">{article.title}</h3>
                <p className="text-[11px] text-white/70 mb-2">{article.author}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]/60">Published: {article.publishDate}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Updated: {article.updateDate}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href="/tools" onClick={(e) => e.stopPropagation()} className="text-[10px] text-[#1cd35c] hover:underline">Relevant tool</a>
                  <a href="/case-studies" onClick={(e) => e.stopPropagation()} className="text-[10px] text-[#1cd35c] hover:underline">Case study</a>
                  <a href="/industries" onClick={(e) => e.stopPropagation()} className="text-[10px] text-[#1cd35c] hover:underline">Industry page</a>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadAsPdf(article);
                  }}
                  className="mt-4 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Download as PDF
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 p-8 bg-gradient-to-br from-[#1cd35c]/20 to-transparent border border-[#1cd35c]/30 rounded-3xl">
            <h3 className="text-2xl font-black mb-3">{dynamicCTA.title}</h3>
            <p className="text-white/70 mb-6">{dynamicCTA.description}</p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate(dynamicCTA.href)}
                className="px-6 py-3 bg-[#1cd35c] text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-[#19b850] transition-all"
              >
                {dynamicCTA.buttonText}
              </button>
              <button
                onClick={() => navigate("/book-demo")}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Brief Me Monthly
              </button>
            </div>
            <p className="text-xs text-white/50 mt-4">Receive monthly regulatory intelligence curated for compliance leaders.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Insights;
