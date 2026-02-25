import {
  FaBook,
  FaVideo,
  FaShieldAlt,
  FaQuestionCircle,
  FaFileAlt,
  FaBookOpen,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { safeOpenExternal } from "../utils/security";

const resources = [
  {
    icon: FaShieldAlt,
    label: "Free Tools",
    description: "Battle-tested assessment modules to evaluate your current privacy posture instantly.",
    status: "available",
    path: "/tools",
  },
  {
    icon: FaQuestionCircle,
    label: "Knowledge Base",
    description: "Detailed documentation and answers to the most granular compliance questions.",
    status: "available",
    path: "/faq",
  },
  {
    icon: FaFileAlt,
    label: "Proof of Concept",
    description: "Deep dives into how global leaders transition from vulnerability to sovereignty.",
    status: "available",
    path: "/case-studies",
  },
  {
    icon: FaBookOpen,
    label: "Privacy Lexicon",
    description: "Demystifying the complex terminology of global data protection laws.",
    status: "available",
    path: "/glossary",
  },
  {
    icon: FaBook,
    label: "Strategic Ebooks",
    description: "Architectural blueprints for building a future-proof privacy organization.",
    status: "coming_soon",
  },
  {
    icon: FaVideo,
    label: "Expert Sessions",
    description: "On-demand masterclasses featuring architects of modern data governance.",
    status: "coming_soon",
  },
];

const Resources = () => {
  return (
    <div className="py-14 md:py-16 bg-transparent mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-20 text-center"
      >
        <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-bold text-xs uppercase tracking-widest mb-6 border border-[#1cd35c]/20">
          The Vault
        </span>
        <h1 className="mb-6 text-[40px] md:text-6xl font-black text-white tracking-tight leading-tight">
          Privacy <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Intelligence</span>
        </h1>
        <p className="mx-auto max-w-3xl text-lg md:text-xl text-white/60 font-medium leading-relaxed">
          Arm your team with the strategic insights and technical assets
          needed to command your data landscape with absolute certainty.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`group relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] transition-all duration-500 hover:bg-white/10 hover:border-[#1cd35c]/30 hover:shadow-2xl hover:shadow-[#1cd35c]/10 ${resource.status === "available" ? "cursor-pointer" : ""
              }`}
            onClick={() => {
              if (resource.status === "available") {
                const res = resource as { path?: string; link?: string };
                if (res.link) {
                  safeOpenExternal(res.link);
                } else if (res.path) {
                  window.location.href = res.path;
                }
              }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1cd35c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="bg-[#1cd35c]/10 rounded-2xl w-16 h-16 flex items-center justify-center group-hover:bg-[#1cd35c]/20 transition-all duration-500">
                  <resource.icon className="w-8 h-8 text-[#1cd35c] transform group-hover:scale-110 transition-transform duration-500" />
                </div>
                {resource.status === "coming_soon" ? (
                  <span className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#1cd35c] bg-[#1cd35c]/10 border border-[#1cd35c]/20 rounded-full">
                    SOON
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full">
                    LIVE
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-black text-white mb-4 group-hover:text-[#1cd35c] transition-colors duration-300 tracking-tight">
                {resource.label}
              </h3>

              <p className="text-white/60 font-medium leading-relaxed mb-8">
                {resource.description}
              </p>

              {resource.status === "available" && (
                <div className="flex items-center text-[#1cd35c] text-sm font-bold uppercase tracking-widest pt-4 border-t border-white/10 group-hover:border-[#1cd35c]/30 transition-colors">
                  Explore Now
                  <svg
                    className="ml-2 w-4 h-4 transition-transform duration-300 transform group-hover:translate-x-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Callout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-16 md:mt-20 p-8 sm:p-12 bg-gradient-to-r from-[#1cd35c] to-[#128a3c] rounded-[3rem] shadow-2xl shadow-[#1cd35c]/20 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full"></div>
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Need Targeted Guidance?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto font-medium text-lg">
            Our expert consultants provide tailored briefings to help your board and
            technical teams navigate specific regulatory shifts.
          </p>
          <button
            onClick={() => window.location.href = '/contact'}
            className="px-8 py-4 bg-white text-[#128a3c] font-black rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-xl"
          >
            Request Private Consultation
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Resources;
