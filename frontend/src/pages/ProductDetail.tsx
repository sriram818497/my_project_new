import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaRocket } from "react-icons/fa";

const ProductDetail = () => {
  const location = useLocation();
  const { state } = location;

  return (
    <div className="bg-transparent mt-16 py-14 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-bold text-xs uppercase tracking-widest mb-6 border border-[#1cd35c]/20">
          Product Intelligence
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-8">
          {state?.label} <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Power</span>
        </h1>
        <p className="mx-auto max-w-3xl text-lg md:text-xl text-white/60 font-medium leading-relaxed">
          {state?.description}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 space-y-12"
        >
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1cd35c]/5 blur-[100px] rounded-full group-hover:bg-[#1cd35c]/10 transition-colors"></div>

            <div className="relative z-10 text-white/70 space-y-8 text-lg font-medium leading-relaxed">
              <p className="border-l-4 border-[#1cd35c] pl-6 text-white text-xl bg-white/5 py-6 rounded-r-2xl font-bold leading-tight">
                Beyond data management, {state?.label} is about operational confidence.
                Our engineering team has optimized every workflow for maximum
                security with minimum friction.
              </p>

              <div className="space-y-6">
                <h2 className="text-3xl font-black text-white tracking-tight">The Proteccio Edge</h2>
                <p>
                  In the modern era, a data breach is a structural failure. {state?.label}
                  acts as an intelligent shield, ensuring that your organization's
                  data lifecycles are mapped, monitored, and mastered in real-time.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-black text-white tracking-tight">Core Capabilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "Zero-Trust Discovery", desc: "Automated identification of sensitive assets across the enterprise." },
                    { title: "Collaborative Logic", desc: "Unified dashboards allowing multiple teams to sync on compliance." },
                    { title: "Real-Time Updates", desc: "Automatic alignment with global and regional regulatory shifts." },
                    { title: "Military Encryption", desc: "Redundant safeguards securing data in transit and at rest." }
                  ].map((pillar, i) => (
                    <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-[#1cd35c]/30 transition-colors group">
                      <h3 className="text-[#1cd35c] font-black uppercase tracking-widest text-xs mb-3">{pillar.title}</h3>
                      <p className="text-sm text-white/60 leading-relaxed font-bold">{pillar.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-black text-white tracking-tight">Operational ROI</h2>
                <p>
                  Investing in {state?.label} is an investment in your brand's future.
                  We reduce the administrative burden of compliance, allowing your
                  architecture to scale securely.
                </p>
                <div className="space-y-4 pt-4">
                  {[
                    "Drastically reduce the risk surface for data breaches.",
                    "Automate high-velocity compliance reporting for audits.",
                    "Foster a culture of accountability across all departments.",
                    "Scale effortlessly into new global markets with confidence."
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <FaCheckCircle className="w-5 h-5 text-[#1cd35c] shrink-0 mt-1" />
                      <span className="text-white/80 font-medium">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar / CTA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-1 space-y-8 lg:sticky lg:top-32 h-fit"
        >
          <div className="bg-gradient-to-br from-[#1cd35c] to-[#128a3c] p-10 rounded-[3rem] shadow-2xl shadow-[#1cd35c]/30 text-white relative overflow-hidden group">
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/10 blur-3xl group-hover:bg-white/20 transition-all rounded-full"></div>
            <FaRocket className="w-12 h-12 mb-6 text-white/50" />
            <h3 className="text-2xl font-black mb-4 tracking-tight leading-tight">Fast-Track Your Implementation</h3>
            <p className="text-white/80 mb-8 font-medium leading-relaxed">
              Deploy our {state?.label} module within days and transform your privacy posture instantly.
            </p>
            <a
              href="/book-demo"
              className="block w-full text-center py-4 bg-white text-[#128a3c] font-black rounded-2xl hover:bg-gray-100 transition-all shadow-xl"
            >
              Start Deployment
            </a>
          </div>

          <div className="p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 opacity-40">Privacy Lexicon</h4>
            <p className="text-white/50 text-sm font-medium mb-6">Unsure about a term or regulatory concept? Explore our definitive guide.</p>
            <a href="/glossary" className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-[#1cd35c]/10 transition-colors group">
              <span className="text-white/60 group-hover:text-[#1cd35c] font-bold">Privacy Glossary</span>
              <svg className="w-4 h-4 text-[#1cd35c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
