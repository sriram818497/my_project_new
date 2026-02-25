import { motion } from "framer-motion";
import { FaLightbulb, FaHandshake, FaShieldAlt, FaLock, FaGlobe, FaRocket } from "react-icons/fa";
import { Link } from "react-router-dom";

interface ValueItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const values: ValueItem[] = [
  {
    icon: FaLightbulb,
    title: "Privacy as a Fundamental Right",
    description: "Data protection is foundational to digital trust and sustainable innovation.",
  },
  {
    icon: FaHandshake,
    title: "Transparency by Default",
    description: "Clear governance models, measurable controls, and auditable frameworks.",
  },
  {
    icon: FaShieldAlt,
    title: "Compliance by Design",
    description: "Privacy embedded across infrastructure, workflows, and business operations.",
  },
  {
    icon: FaLock,
    title: "Security-First Architecture",
    description: "Enterprise-grade controls aligned with global security standards.",
  },
  {
    icon: FaGlobe,
    title: "Global Regulatory Alignment",
    description: "Operational readiness across jurisdictions and regulatory environments.",
  },
  {
    icon: FaRocket,
    title: "Enablement Over Enforcement",
    description: "Privacy positioned as a strategic business accelerator.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const About = () => {
  return (
    <>
      {/* HERO */}
      <section className="pt-24 pb-12 md:pt-28 md:pb-14">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Proteccio Data
            </h1>

            <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A structured privacy and data governance platform designed to
              operationalize compliance, reduce regulatory risk, and enable
              scalable digital growth across global markets.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-3 bg-[#1cd35c] text-black font-semibold rounded-full hover:opacity-90 transition"
              >
                Request Consultation
              </Link>

              <Link
                to="/solutions"
                className="px-8 py-3 border border-white/20 text-white rounded-full hover:bg-white/10 transition"
              >
                Explore Platform
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PLATFORM CAPABILITIES */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto max-w-6xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white">
              Comprehensive Privacy Infrastructure
            </h2>

            <p className="mt-6 text-gray-400 max-w-3xl mx-auto">
              Proteccio integrates policy governance, automated assessments,
              data mapping intelligence, risk analytics, and regulatory
              readiness into a unified enterprise framework.
            </p>
          </motion.div>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Privacy Program Design & Implementation",
              "Data Protection Impact Assessments (DPIA)",
              "Automated Regulatory Workflow Management",
              "Data Inventory & Mapping Intelligence",
              "Incident Response & Breach Readiness",
              "Vendor Risk & Third-Party Governance"
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm"
              >
                ✓ {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white">
              Built for Regulated & Data-Driven Industries
            </h2>

            <div className="mt-10 grid md:grid-cols-3 gap-8 text-left">
              {[
                {
                  title: "Financial Services",
                  desc: "Structured governance for high-risk, compliance-intensive environments."
                },
                {
                  title: "Healthcare & Life Sciences",
                  desc: "Patient data protection aligned with HIPAA and global standards."
                },
                {
                  title: "Technology & SaaS",
                  desc: "Privacy-first architecture for scalable digital platforms."
                }
              ].map((sector, idx) => (
                <div key={idx}>
                  <h4 className="text-[#1cd35c] font-semibold mb-2">
                    {sector.title}
                  </h4>
                  <p className="text-gray-400 text-sm">{sector.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CORE PRINCIPLES */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white">
              Operating Principles
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-white/5 border border-white/10 rounded-2xl"
              >
                <div className="w-14 h-14 rounded-xl bg-[#1cd35c]/10 flex items-center justify-center mb-6">
                  <value.icon className="w-6 h-6 text-[#1cd35c]" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-3">
                  {value.title}
                </h3>

                <p className="text-gray-400 text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GOVERNANCE & TRUST */}
      <section className="py-16">
        <div className="container mx-auto max-w-5xl px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white">
              Governance. Accountability. Continuous Improvement.
            </h2>

            <p className="mt-6 text-gray-400 leading-relaxed">
              Proteccio is aligned with GDPR, DPDPA, HIPAA, ISO standards,
              CCPA, and evolving global frameworks. Our structured methodology
              ensures privacy is not treated as a periodic task but as an
              ongoing operational discipline.
            </p>

            <div className="mt-8">
              <Link
                to="/contact"
                className="px-10 py-4 bg-[#1cd35c] text-black font-semibold rounded-full hover:opacity-90 transition"
              >
                Partner With Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
