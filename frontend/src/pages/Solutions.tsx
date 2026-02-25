import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowRight,
  FaBuilding,
  FaCertificate,
  FaGlobe,
  FaFileContract,
  FaExchangeAlt,
  FaCheckDouble,
} from "react-icons/fa";

import { solutionsData } from "../data/solutionsData";

const globalRegulations = Object.values(solutionsData).filter(s => s.category === "global-regulations");
const industryCompliance = Object.values(solutionsData).filter(s => s.category === "industry-compliance");
const managementSystems = Object.values(solutionsData).filter(s => s.category === "management-systems");


const SolutionCard = ({ solution, navigate }: { solution: { id: string, icon: React.ElementType, label: string, problem: string, angle: string, outcome: string, workflowLabel: string, riskIcon?: React.ElementType, riskLabel?: string }, navigate: (path: string) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    onClick={() => navigate(`/solutions/${solution.id}`)}
    className="group relative flex flex-col justify-between p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:border-[#1cd35c]/50 hover:bg-white/10 hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
  >
    {/* Header */}
    <div className="flex items-center gap-4 mb-6">
      <div className="bg-[#1cd35c]/10 rounded-lg w-12 h-12 flex items-center justify-center shrink-0 group-hover:bg-[#1cd35c]/20 transition-colors">
        <solution.icon className="w-6 h-6 text-[#1cd35c]" />
      </div>
      <h3 className="text-xl font-bold text-white group-hover:text-[#1cd35c] transition-colors">
        {solution.label}
      </h3>
    </div>

    {/* Content Grid */}
    <div className="space-y-4 mb-8 flex-grow">
      <div>
        <span className="text-[#1cd35c] text-xs uppercase font-bold tracking-wider">Problem</span>
        <p className="text-white font-bold text-sm leading-relaxed mt-1">{solution.problem}</p>
      </div>
      <div>
        <span className="text-[#1cd35c] text-xs uppercase font-bold tracking-wider">Proteccio Angle</span>
        <p className="text-white font-bold text-sm leading-relaxed mt-1">{solution.angle}</p>
      </div>
      <div>
        <span className="text-[#1cd35c] text-xs uppercase font-bold tracking-wider">Outcome</span>
        <p className="text-white font-bold text-sm leading-relaxed mt-1">{solution.outcome}</p>
      </div>
    </div>

    {/* Mini Workflow */}
    <div className="border-t border-white/10 pt-4 mb-6">
      <div className="flex items-center justify-between text-white text-xs">
        <div className="flex flex-col items-center gap-1">
          <FaFileContract size={14} />
          <span>{solution.workflowLabel}</span>
        </div>
        <div className="h-px w-8 bg-white/10" />
        <div className="flex flex-col items-center gap-1">
          <FaExchangeAlt size={14} />
          <span>Flow</span>
        </div>
        <div className="h-px w-8 bg-white/10" />
        <div className="flex flex-col items-center gap-1">
          {solution.riskIcon && <solution.riskIcon size={14} />}
          <span>{solution.riskLabel || "Risk"}</span>
        </div>
        <div className="h-px w-8 bg-white/10" />
        <div className="flex flex-col items-center gap-1">
          <FaCheckDouble size={14} />
          <span>Audit</span>
        </div>
      </div>
    </div>

    {/* CTA */}
    <div className="flex items-center text-[#1cd35c] text-sm font-bold group-hover:translate-x-1 transition-transform">
      View Solution <FaArrowRight className="ml-2 w-3 h-3" />
    </div>
  </motion.div>
);

const SolutionsCTA = () => (
  <section className="py-12 bg-transparent border-t border-white/5">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="mb-6 text-3xl font-extrabold tracking-wide text-white">
          Ready to Achieve Compliance with Confidence?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-300">
          Let us help you navigate the complex world of privacy regulations.
          Our solutions provide the tools and guidance you need to maintain
          compliance and protect your data.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/contact"
            className="px-8 py-3 text-white bg-[#1cd35c] rounded-full hover:bg-[#19b850] transition-colors duration-300"
          >
            Contact Us
          </a>
          <a
            href="/book-demo"
            className="px-8 py-3 text-[#1cd35c] border-2 border-[#1cd35c] rounded-full hover:bg-[#1cd35c] hover:text-white transition-colors duration-300"
          >
            Book a Free Demo
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

const Solutions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("global-regulations");

  useEffect(() => {
    if (location.hash) {
      setActiveTab(location.hash.replace("#", ""));
    }
  }, [location.hash]);

  const getContent = () => {
    switch (activeTab) {
      case "industry-compliance":
        return {
          title: "Sector governance",
          subtitle: "Industry specific governance and risk expertise",
          icon: FaBuilding,
          data: industryCompliance
        };
      case "management-systems":
        return {
          title: "international standards",
          subtitle: "Can this support certifications and audits?",
          icon: FaCertificate,
          data: managementSystems
        };
      case "global-regulations":
      default:
        return {
          title: "Privacy Regulations",
          subtitle: "Privacy regulations we support",
          icon: FaGlobe,
          data: globalRegulations
        };
    }
  };

  const content = getContent();

  return (
    <>
      {/* Hero Section */}
      <section className="overflow-hidden relative pt-28 pb-12 md:pt-28 md:pb-16">
        <div className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="mb-6 text-[40px] md:text-6xl font-extrabold leading-tight tracking-tight text-white">
              Privacy Compliance <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Made Practical</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed max-w-3xl mx-auto">
              Our platform combines expert guidance, smart automation, and continuous monitoring to ensure compliance is not just achieved: it's continuously maintained as your business evolves.
            </p>
          </div>
        </div>
      </section>

      {/* Filtered Content Section */}
      <div className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 pb-14 md:pb-16 space-y-12 md:space-y-14 min-h-[560px]">
        <section key={activeTab}>
          <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-4">
            <div className="p-3 bg-[#1cd35c]/10 rounded-lg">
              <content.icon className="w-6 h-6 text-[#1cd35c]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{content.title}</h2>
              <p className="text-white/60 text-sm">{content.subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.data.map((solution, index) => (
              <SolutionCard key={index} solution={solution} navigate={navigate} />
            ))}
          </div>
        </section>
      </div>

      <SolutionsCTA />
    </>
  );
};

export default Solutions;
