import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, FileText, BarChart2, Shield, CheckCircle, Search, GitBranch, Database, Cpu, ClipboardCheck, Globe, Zap, UserCheck, Mail, AlertTriangle, Award } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const stages = [
  {
    id: "know",
    number: "1",
    title: "Know",
    icon: Eye,
    desc: "Understand where personal data exists and how it flows.",
    products: [
      {
        name: "Data Discovery & Classification (DD&DC)",
        tool: "Identify and classify personal and sensitive data automatically.",
        icon: Search,
        solutionLink: "/solutions/gdpr"
      },
      {
        name: "Data Mapping",
        tool: "Visualize how data flows within and outside the organization.",
        icon: GitBranch,
        solutionLink: "/solutions/iso-27701"
      }
    ]
  },
  {
    id: "document",
    number: "2",
    title: "Document",
    icon: FileText,
    desc: "Create a single source of truth for processing activities.",
    products: [
      {
        name: "Records of Processing Activities (RoPA)",
        tool: "Maintain GDPR Article 30 compliant records.",
        icon: Database,
        solutionLink: "/solutions/gdpr"
      },
      {
        name: "Privacy by Design for Applications (PbD)",
        tool: "Capture privacy requirements during product design.",
        icon: Cpu,
        solutionLink: "/solutions/iso-27701"
      }
    ]
  },
  {
    id: "assess",
    number: "3",
    title: "Assess",
    icon: BarChart2,
    desc: "Identify and manage privacy and compliance risk early.",
    products: [
      {
        name: "New Project DPIA",
        tool: "Assess high-risk processing activities across new initiatives.",
        icon: ClipboardCheck,
        solutionLink: "/solutions/dpdp-act"
      },
      {
        name: "Third-Party Risk Management (TPRM)",
        tool: "Evaluate vendor and processor risk across your supply chain.",
        icon: Globe,
        solutionLink: "/solutions/tisax"
      },
      {
        name: "Free Assessment Tools",
        tool: "Quick checks for exposure and gaps in your privacy posture.",
        icon: Zap,
        solutionLink: "/solutions/dpdp-act"
      }
    ]
  },
  {
    id: "control",
    number: "4",
    title: "Control",
    icon: Shield,
    desc: "Operationalize privacy across workflows and teams.",
    products: [
      {
        name: "Consent Management",
        tool: "Capture and manage user consents transparently.",
        icon: UserCheck,
        solutionLink: "/solutions/dpdp-act"
      },
      {
        name: "DSR Request Management",
        tool: "Fulfill data subject rights efficiently.",
        icon: Mail,
        solutionLink: "/solutions/cpra"
      },
      {
        name: "Data Breach Management",
        tool: "Log and manage incidents with accountability.",
        icon: AlertTriangle,
        solutionLink: "/solutions/hipaa"
      }
    ]
  },
  {
    id: "prove",
    number: "5",
    title: "Prove",
    icon: CheckCircle,
    desc: "Demonstrate compliance with confidence.",
    products: [
      {
        name: "Audit & Evidence Readiness",
        tool: "Generate defensible records for regulators, auditors, and enterprise clients.",
        icon: Award,
        solutionLink: "/solutions/iso-27001"
      }
    ]
  }
];

const bottomSolutions = [
  {
    title: "Privacy Compliance & Governance",
    link: "/solutions#global-regulations"
  },
  {
    title: "Audit & Certification Readiness",
    link: "/solutions#management-systems"
  },
  {
    title: "Third-Party & Vendor Risk",
    link: "/solutions/tisax"
  },
  {
    title: "Data Subject Rights & Incident Response",
    link: "/solutions/cpra"
  },
  {
    title: "India-First DPDP & Data Localisation",
    link: "/solutions/dpdp-act"
  }
];

const toProductSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const productFilter = searchParams.get("product");

  const filteredStages = categoryFilter
    ? stages.filter(s => s.id === categoryFilter)
    : stages;

  useEffect(() => {
    if (!productFilter) return;
    const element = document.getElementById(`product-${productFilter}`);
    if (!element) return;

    const timer = window.setTimeout(() => {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [productFilter, filteredStages.length]);

  const handleFilter = (id: string | null) => {
    if (id) {
      setSearchParams({ category: id });
    } else {
      setSearchParams({});
    }
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent pt-28 pb-16 md:pt-28 md:pb-16">
      {/* Hero Section */}
      <section className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 mb-16 md:mb-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full"
            >
              <span className="text-white font-bold tracking-wide uppercase text-sm">
                Our Solutions
              </span>
            </motion.div>

            <h1 className="mb-6 text-[40px] md:text-6xl font-extrabold leading-tight tracking-tight text-white">
              Privacy Management
              <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">
                {" "}
                Products
              </span>
            </h1>
            <p className="mb-8 text-xl text-white/60 font-medium leading-relaxed">
              Built for modern enterprises. Designed for real-world operations.
            </p>
            <p className="mb-12 text-lg text-white/40 leading-relaxed max-w-3xl mx-auto">
              Proteccio Data is a unified privacy and data protection platform that helps organizations understand,
              manage, and prove how personal data is handled across systems, teams, vendors, and regulations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/book-demo"
                className="px-8 py-4 text-white bg-[#1cd35c] rounded-full hover:bg-[#19b850] transition-all duration-300 font-bold shadow-[0_0_20px_rgba(28,211,92,0.3)]"
              >
                Book a Free Demo
              </Link>
              <Link
                to="/tools"
                className="px-8 py-4 text-[#1cd35c] border-2 border-[#1cd35c] rounded-full hover:bg-[#1cd35c] hover:text-white transition-all duration-300 font-bold"
              >
                Explore Free Tools
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Privacy Journey Overview */}
      <section className="container px-4 mx-auto max-w-7xl mb-20 md:mb-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-8 text-white">The Privacy Journey</h2>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {stages.map((stage, idx) => (
              <div key={stage.id} className="flex items-center gap-4">
                <button
                  onClick={() => handleFilter(categoryFilter === stage.id ? null : stage.id)}
                  className={`text-lg font-semibold transition-all duration-300 ${categoryFilter === stage.id
                    ? "text-[#1cd35c] scale-110"
                    : "text-white/40 hover:text-[#1cd35c]"
                    }`}
                >
                  {stage.title}
                </button>
                {idx < stages.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-white/20" />
                )}
              </div>
            ))}
            {categoryFilter && (
              <button
                onClick={() => handleFilter(null)}
                className="ml-4 text-sm font-bold text-[#1cd35c] hover:underline"
              >
                Show All
              </button>
            )}
          </div>
        </div>

        {/* Stages */}
        <div className="space-y-32">
          {filteredStages.map((stage) => (
            <motion.section
              key={stage.id}
              id={stage.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="scroll-mt-28"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#1cd35c]/10 flex items-center justify-center text-[#1cd35c] font-bold text-xl border border-[#1cd35c]/20">
                  {stage.number}
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white">{stage.title}</h2>
                  <p className="text-white/60 text-xl mt-1 font-medium">{stage.desc}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stage.products.map((product: { name: string, tool: string, icon: React.ElementType, solutionLink: string }, pIdx: number) => (
                  <Link
                    key={pIdx}
                    to={product.solutionLink}
                    className="block h-full"
                  >
                    {(() => {
                      const productSlug = toProductSlug(product.name);
                      return (
                    <motion.div
                      id={`product-${productSlug}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: pIdx * 0.1 }}
                      className="group bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl hover:bg-[#1cd35c]/5 hover:border-[#1cd35c]/30 hover:shadow-[0_0_30px_rgba(28,211,92,0.1)] transition-all duration-300 cursor-pointer flex flex-col h-full"
                    >
                      <div className="mb-6 p-3 bg-white/5 rounded-xl w-fit group-hover:bg-[#1cd35c]/10 transition-colors">
                        <product.icon className="w-6 h-6 text-[#1cd35c]" />
                      </div>
                      <h4 className="text-xl font-bold mb-3 text-white group-hover:text-[#1cd35c] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-white/50 text-sm leading-relaxed mb-6 font-medium">
                        {product.tool}
                      </p>
                      <div className="mt-auto flex items-center text-[#1cd35c] text-sm font-bold group-hover:gap-2 transition-all">
                        <span>Learn more</span>
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </div>
                    </motion.div>
                      );
                    })()}
                  </Link>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </section>

      {/* Solutions Section */}
      <section className="bg-white/5 backdrop-blur-md py-14 md:py-16 border-y border-white/10 mb-16 md:mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1cd35c]/5 rounded-full blur-[100px]-z-10"></div>
        <div className="container px-4 mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Solutions</h2>
            <p className="text-white/60 text-lg font-medium">Products become solutions when they work together.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bottomSolutions.map((sol, idx) => (
              <Link key={idx} to={sol.link} className="block group">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex flex-col justify-between hover:border-[#1cd35c]/50 hover:bg-[#1cd35c]/5 transition-all cursor-pointer h-full"
                >
                  <h4 className="text-xl font-bold text-white group-hover:text-[#1cd35c] transition-colors">{sol.title}</h4>
                  <div className="mt-8 flex items-center text-[#1cd35c] text-sm font-bold">
                    <span>View Solution</span>
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container px-4 mx-auto max-w-5xl text-center mb-12 relative z-10">
        <div className="bg-gradient-to-br from-[#1cd35c]/20 via-[#1cd35c]/5 to-transparent border border-[#1cd35c]/30 rounded-[40px] p-12 md:p-20 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1cd35c]/15 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1cd35c]/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">See how it works end-to-end</h3>
            <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto font-medium">
              Start with clarity. Operate with confidence. Prove compliance—anytime.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link
                to="/book-demo"
                className="px-10 py-5 bg-[#1cd35c] text-white rounded-full font-bold hover:bg-[#19b850] transition-all hover:scale-105 shadow-[0_0_30px_rgba(28,211,92,0.4)]"
              >
                Book a Free Demo
              </Link>
              <Link
                to="/tools"
                className="px-10 py-5 border-2 border-[#1cd35c]/30 text-white rounded-full font-bold hover:bg-white hover:text-black transition-all hover:scale-105"
              >
                Explore Free Tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
