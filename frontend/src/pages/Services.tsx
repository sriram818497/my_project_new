import { motion } from "framer-motion";
import {
  FaUsers,
  FaTasks,
  FaGlobe,
  FaClock,
  FaCheckCircle,
  FaHandsHelping,
} from "react-icons/fa";

const Services = () => {
  const services: { icon: React.ElementType; title: string; description: string | JSX.Element }[] = [
    {
      icon: FaUsers,
      title: "Strategic Partnerships",
      description: `We serve as an extension of your team—from agile startups to global conglomerates—architecting data protection models that scale with your ambition.`,
    },
    {
      icon: FaTasks,
      title: "Core Capabilities",
      description: (
        <ul className="space-y-3">
          <li><strong className="text-white">Regulatory Orchestration:</strong> Expert navigation of GDPR, CPRA, DPDPA, and HIPAA frameworks.</li>
          <li><strong className="text-white">Structural Audits:</strong> Identifying systemic vulnerabilities with surgical precision.</li>
          <li><strong className="text-white">Bespoke Governance:</strong> Custom strategies that align privacy with your business KPIs.</li>
          <li><strong className="text-white">Continuous Training:</strong> Equipping your workforce with adaptive security intelligence.</li>
        </ul>
      ),
    },
    {
      icon: FaGlobe,
      title: "Global Reach",
      description: `Our expertise spans borders, ensuring your information remains secure and compliant across every jurisdiction where you operate.`,
    },
    {
      icon: FaClock,
      title: "End-to-End Support",
      description: `From Day 1 audit to ongoing resilience monitoring, we provide the continuous oversight needed to stay ahead of the threat landscape.`,
    },
    {
      icon: FaCheckCircle,
      title: "Why Proteccio",
      description: `We believe privacy is a competitive edge. We help you transition from passive compliance to active data sovereignty, building lasting customer trust.`,
    },
    {
      icon: FaHandsHelping,
      title: "Our Methodology",
      description: `We combine technical rigor with deep legal insight to deliver a blueprint for success that is both resilient and future-ready.`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-bold text-xs uppercase tracking-widest mb-6">
          What We Offer
        </span>
        <h1 className="text-[40px] md:text-6xl font-extrabold text-white mb-6 tracking-tight">
          Strategic <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Privacy Advisory</span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto font-medium leading-relaxed">
          Bespoke security frameworks engineered to protect your most
          critical assets in an increasingly complex digital landscape.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-md hover:bg-white/10 transition-all duration-300"
          >
            <service.icon className="h-12 w-12 text-[#1cd35c] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
            <p className="text-gray-400">{service.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 bg-[#1cd35c]/10 border border-[#1cd35c]/20 rounded-lg p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-4">
          Need a Customized Solution?
        </h2>
        <p className="text-gray-300 mb-6">
          Our team of experts can help create a security solution tailored to
          your specific needs.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#1cd35c] hover:bg-[#19b850] transition-colors"
        >
          Get in Touch
        </a>
      </motion.div>
    </div>
  );
};

export default Services;
