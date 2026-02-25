import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Tag,
  Database,
  ArrowRight,
  LayoutGrid,
  Shield,
  Globe,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { contentManagerService } from "../services/contentManager";
import type { CaseStudyContent } from "../types/content";

const CaseStudies = () => {
  const [items, setItems] = useState<CaseStudyContent[]>(() => contentManagerService.getCaseStudies());
  const [filters, setFilters] = useState({
    industry: "All",
    regulation: "All",
    solution: "All",
    asset: "All",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const refresh = () => setItems(contentManagerService.getCaseStudies());
    const unsubscribe = contentManagerService.subscribe(refresh);
    refresh();
    return unsubscribe;
  }, []);

  const industries = useMemo(() => ["All", ...Array.from(new Set(items.map((item) => item.industry)))], [items]);
  const regulations = useMemo(() => ["All", ...Array.from(new Set(items.map((item) => item.regulation)))], [items]);
  const solutions = useMemo(() => ["All", ...Array.from(new Set(items.map((item) => item.solutionType)))], [items]);
  const assets = useMemo(() => ["All", ...Array.from(new Set(items.map((item) => item.assetType)))], [items]);

  const filteredData = useMemo(() => {
    return items.filter((item) => {
      const matchesIndustry = filters.industry === "All" || item.industry === filters.industry;
      const matchesRegulation = filters.regulation === "All" || item.regulation === filters.regulation;
      const matchesSolution = filters.solution === "All" || item.solutionType === filters.solution;
      const matchesAsset = filters.asset === "All" || item.assetType === filters.asset;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.overview.toLowerCase().includes(q);
      return matchesIndustry && matchesRegulation && matchesSolution && matchesAsset && matchesSearch;
    });
  }, [items, filters, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-transparent text-white pt-20">
      <section className="py-14 md:py-16 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-dark" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-dark)" />
          </svg>
        </div>

        <div className="container px-4 mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 items-center gap-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-[#1cd35c]/10 rounded-lg text-[#1cd35c] font-black text-xs uppercase tracking-widest mb-6 border border-[#1cd35c]/20">
                Impact & Outcomes
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">
                Real World Privacy <br />
                <span className="bg-gradient-to-r from-[#1cd35c] to-[#25f075] bg-clip-text text-transparent">Success Stories</span>
              </h1>
              <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed max-w-2xl">
                Explore how organizations achieve compliance and measurable business outcomes with Proteccio.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="hidden lg:flex justify-center items-center relative">
              <div className="relative w-64 h-64">
                <motion.div
                  animate={{ boxShadow: ["0 0 15px rgba(28, 211, 92, 0.2)", "0 0 45px rgba(28, 211, 92, 0.4)", "0 0 15px rgba(28, 211, 92, 0.2)"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-br from-[#1cd35c]/20 to-transparent rounded-full border border-[#1cd35c]/30 flex items-center justify-center backdrop-blur-3xl z-10"
                >
                  <Shield className="w-16 h-16 text-[#1cd35c] opacity-80" />
                </motion.div>

                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-6 -right-6 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl z-20">
                  <Lock className="w-6 h-6 text-[#1cd35c]" />
                </motion.div>

                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -bottom-6 -left-6 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl z-20">
                  <Globe className="w-6 h-6 text-[#1cd35c]" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="sticky top-20 z-40 bg-gray-900/50 backdrop-blur-xl border-y border-white/5 shadow-2xl">
        <div className="container px-4 mx-auto max-w-7xl py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-end justify-between">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full lg:w-auto">
              <div className="flex flex-col gap-2 min-w-[160px]">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]/60 px-1">Industry</label>
                <div className="relative group">
                  <select value={filters.industry} onChange={(e) => setFilters((f) => ({ ...f, industry: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#1cd35c] appearance-none cursor-pointer pr-12">
                    {industries.map((value) => <option key={value} value={value} className="bg-gray-900">{value}</option>)}
                  </select>
                  <Filter className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1cd35c] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[160px]">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]/60 px-1">Regulation</label>
                <div className="relative group">
                  <select value={filters.regulation} onChange={(e) => setFilters((f) => ({ ...f, regulation: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#1cd35c] appearance-none cursor-pointer pr-12">
                    {regulations.map((value) => <option key={value} value={value} className="bg-gray-900">{value}</option>)}
                  </select>
                  <Filter className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1cd35c] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[160px]">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]/60 px-1">Solution Area</label>
                <div className="relative group">
                  <select value={filters.solution} onChange={(e) => setFilters((f) => ({ ...f, solution: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#1cd35c] appearance-none cursor-pointer pr-12">
                    {solutions.map((value) => <option key={value} value={value} className="bg-gray-900">{value}</option>)}
                  </select>
                  <Filter className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1cd35c] pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[160px]">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]/60 px-1">Asset Category</label>
                <div className="relative group">
                  <select value={filters.asset} onChange={(e) => setFilters((f) => ({ ...f, asset: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#1cd35c] appearance-none cursor-pointer pr-12">
                    {assets.map((value) => <option key={value} value={value} className="bg-gray-900">{value}</option>)}
                  </select>
                  <Filter className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1cd35c] pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full lg:w-96 group">
              <label className="text-[10px] font-black uppercase tracking-widest text-transparent px-1 hidden lg:block select-none">Search</label>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1cd35c]" />
                <input
                  type="text"
                  placeholder="Search case studies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#1cd35c] placeholder:text-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-4 pb-14 md:pb-16 relative">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#1cd35c] flex items-center gap-3">
              <LayoutGrid className="w-4 h-4" />
              Showing {paginatedData.length} of {filteredData.length} Results
            </h2>
            <div className="h-[1px] flex-1 bg-white/5 ml-8 hidden md:block"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            <AnimatePresence mode="popLayout">
              {paginatedData.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <Link
                    to={`/case-studies/${item.id}`}
                    className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:border-[#1cd35c]/30 hover:-translate-y-2 flex flex-col h-full"
                  >
                    <div className="aspect-video overflow-hidden relative">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                        <span className="px-4 py-1.5 bg-gray-900/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#1cd35c] border border-white/10">{item.industry}</span>
                        <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">{item.assetType}</span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-[9px] font-black text-[#1cd35c] uppercase tracking-[0.2em] mb-3">
                        <span className="flex items-center gap-1.5"><Tag className="w-3 h-3" /> {item.regulation}</span>
                        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                        <span className="flex items-center gap-1.5"><Database className="w-3 h-3" /> {item.solutionType}</span>
                      </div>

                      <h3 className="text-lg font-black text-white mb-3 leading-tight group-hover:text-[#1cd35c] transition-colors line-clamp-2">{item.title}</h3>

                      <p className="text-sm text-white/50 font-medium leading-relaxed mb-6 line-clamp-3">{item.description}</p>

                      <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white/30 font-bold text-[10px]">
                          <Calendar className="w-4 h-4 text-[#1cd35c]/40" />
                          {item.date}
                        </div>
                        <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[#1cd35c] group-hover:-rotate-45 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredData.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-40 text-center">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                <Search className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">No Success Stories Found</h3>
              <p className="text-white/40 max-w-sm mx-auto font-medium text-lg">No results match your current filters. Try clearing a few criteria.</p>
            </motion.div>
          )}

          {totalPages > 1 && (
            <div className="mt-20 md:mt-24 flex items-center justify-center gap-6">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((value) => value - 1);
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-white/40 hover:border-[#1cd35c]/50 hover:text-[#1cd35c] disabled:opacity-10 disabled:cursor-not-allowed transition-all hover:bg-white/5"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentPage(index + 1);
                      window.scrollTo({ top: 400, behavior: "smooth" });
                    }}
                    className={`w-14 h-14 rounded-2xl text-sm font-black transition-all border ${
                      currentPage === index + 1
                        ? "bg-[#1cd35c] text-black border-[#1cd35c] shadow-2xl shadow-[#1cd35c]/30"
                        : "bg-white/5 text-white/40 border-white/10 hover:border-[#1cd35c]/30 hover:text-white"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((value) => value + 1);
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-white/40 hover:border-[#1cd35c]/50 hover:text-[#1cd35c] disabled:opacity-10 disabled:cursor-not-allowed transition-all hover:bg-white/5"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;
