import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

const points = [
  "Automated data mapping & inventory",
  "Centralized dashboard for processing activities",
  "Regulatory templates & audit trails",
  "Integration with IT systems",
];

const ProductRopa = () => {
  return (
    <div className="min-h-screen bg-transparent pt-28 pb-20 px-4 relative overflow-hidden">
      <div className="absolute top-10 right-0 w-80 h-80 bg-[#1cd35c]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1cd35c]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-4xl mx-auto">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(2,6,23,0.35)] border border-white/10 p-6 md:p-7 relative z-10"
        >
          <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="w-28 h-28 rounded-2xl bg-[#1cd35c]/10 border border-[#1cd35c]/20 flex items-center justify-center"
            >
              <div className="w-14 h-14 rounded-xl bg-[#1cd35c] text-white flex items-center justify-center shadow-[0_0_24px_rgba(28,211,92,0.35)]">
                <ClipboardList className="w-8 h-8" />
              </div>
            </motion.div>

            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="text-4xl md:text-5xl font-extrabold tracking-tight text-white"
              >
                RoPA
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.35 }}
                className="mt-3 text-lg md:text-xl leading-relaxed text-white/70 max-w-2xl"
              >
                Automate and centralize your Records of Processing Activities (RoPA) to ensure compliance with GDPR,
                LGPD, and other privacy laws.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.35 }}
                className="mt-4 flex flex-wrap items-center gap-3"
              >
                <span className="inline-flex items-center rounded-full bg-[#1cd35c]/20 border border-[#1cd35c]/30 px-3 py-0.5 text-xs font-semibold text-[#7bf0a6]">
                  Available
                </span>
                <Link
                  to="/sign-in"
                  className="px-4 py-1.5 rounded-full bg-[#1cd35c] text-white text-sm font-bold hover:bg-[#19b850] transition-colors"
                >
                  Go to Live Product
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="rounded-xl p-6 bg-gradient-to-br from-[#4ade80] via-[#3b82f6] to-[#7c3aed] border border-white/10 shadow-[0_16px_35px_rgba(2,6,23,0.45)] relative overflow-hidden min-h-[250px]"
            >
              <div className="absolute inset-0 opacity-15">
                <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:42px_42px]" />
              </div>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white"
              >
                <ClipboardList className="w-9 h-9 mb-3 text-white" />
                <h2 className="text-3xl font-extrabold tracking-tight">RoPA</h2>
                <p className="text-lg mt-1.5 text-white/95">Product Preview</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.43, duration: 0.4 }}
              className="py-1"
            >
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">About RoPA</h3>
              <p className="text-lg md:text-xl leading-relaxed text-white/70 mb-4">
                The RoPA module automates the creation and maintenance of processing records, offering dashboards,
                audit trails, and integration with your existing systems.
              </p>
              <ul className="space-y-1.5 text-lg md:text-xl text-white/80 list-disc pl-5 marker:text-[#1cd35c]">
                {points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ProductRopa;
