import React, { useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import {
  Shield,
  Lock,
  ArrowRight,
  Users,
  Globe,
  Clock,
  CheckCircle,
  ActivityIcon,
  Heart,
  Briefcase,
  Layout as LayoutIcon,
  FileText,
  Database,
  Activity,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaStar,
} from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { devLog } from "../utils/logger";

// Testimonials Section Component
const Testimonials = () => {
  const testimonials = [
    {
      name: "Sophia Martinez",
      role: "Head of Compliance",
      company: "NorthBridge Financial",
      content:
        "Proteccio turned our privacy operations from reactive to proactive. We now track processing activities in one place and respond to audits with confidence.",
      rating: 5,
      outcome: "43% faster compliance reporting",
    },
    {
      name: "Amit Sharma",
      role: "VP of IT Security",
      company: "VectorStack Technologies",
      content:
        "The platform gave our legal and engineering teams a shared operating model. We reduced review cycles and improved visibility across high-risk data flows.",
      rating: 4.5,
      outcome: "Reduced review cycles by 35%",
    },
    {
      name: "David Cohen",
      role: "Director of IT",
      company: "Oakridge Education Group",
      content:
        "We needed a practical way to protect student data at scale. Proteccio helped us standardize controls and demonstrate accountability to leadership.",
      rating: 4.5,
      outcome: "Audit readiness across 12 campuses",
    },
  ];

  return (
    <section className="py-14 md:py-16 bg-transparent relative overflow-hidden">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-12 text-center"
        >
          <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-semibold mb-4">
            Client Outcomes
          </span>
          <h2 className="mb-6 text-[32px] md:text-5xl font-bold text-white">
            Trusted by <span className="text-[#1cd35c]">privacy and security teams</span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg md:text-xl text-white/60">
            Real implementation feedback from organizations using Proteccio in production environments.
          </p>
        </motion.div>

        <Swiper
          modules={[Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{
            clickable: true,
            bulletActiveClass: "swiper-pagination-bullet-active !bg-[#1cd35c]",
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-16 testimonial-swiper !pb-12"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="!h-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="h-full p-7 md:p-8 bg-[#172333]/80 backdrop-blur-md border border-white/10 rounded-[1.5rem] flex flex-col justify-between group transition-all duration-300 hover:border-[#1cd35c]/35 hover:shadow-[0_10px_35px_rgba(0,0,0,0.25)]"
              >
                <div>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#1cd35c]/15 border border-[#1cd35c]/25 flex items-center justify-center shrink-0">
                      <span className="text-[#1cd35c] font-bold text-lg tracking-tight">
                        {testimonial.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xl md:text-2xl font-bold text-white leading-tight">
                        {testimonial.name}
                      </h4>
                      <p className="text-white/75 text-sm md:text-base font-medium leading-tight mt-1">
                        {testimonial.role}
                      </p>
                      <p className="text-white/45 text-xs md:text-sm leading-tight mt-1">{testimonial.company}</p>
                    </div>
                  </div>
                  <blockquote className="text-lg md:text-xl leading-relaxed text-white/85 mb-8 font-medium">
                    "{testimonial.content}"
                  </blockquote>
                </div>
                <div className="pt-5 border-t border-white/10 flex items-center justify-between gap-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="relative">
                        <FaStar
                          className={`w-5 h-5 ${i < Math.floor(testimonial.rating) ? "text-yellow-400" : "text-white/20"
                            }`}
                        />
                        {i === Math.floor(testimonial.rating) && testimonial.rating % 1 !== 0 && (
                          <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
                            <FaStar className="w-5 h-5 text-yellow-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-white/70 whitespace-nowrap">
                    {testimonial.outcome}
                  </div>
                </div>
                <div className="mt-4 text-xs text-[#1cd35c] font-semibold tracking-wide uppercase">
                  Verified Client Feedback
                </div>
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-[1.5rem] border border-[#1cd35c]/15" />
                  <div className="absolute -top-20 -right-20 w-52 h-52 bg-[#1cd35c]/10 blur-3xl rounded-full" />
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 text-center"
        >
          <Link
            to="/case-studies"
            className="inline-flex items-center text-[#1cd35c] hover:text-[#19b850] font-medium transition-colors duration-300"
          >
            View All Case Studies
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};


interface SectionTransitionProps {
  children: React.ReactNode;
  delay?: number;
}

const SectionTransition = ({ children, delay = 0 }: SectionTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 1,
        delay,
        ease: [0.22, 1, 0.36, 1] // Custom quintic ease-out for a more "premium" feel
      }}
    >
      {children}
    </motion.div>
  );
};

// Hero Feature Component
const FeaturePoint = ({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) => (
  <div className="flex items-center">
    <Icon className="w-5 h-5 text-[#1cd35c] mr-2" />
    <span className="text-sm text-white/70">{text}</span>
  </div>
);

// Stats Component
const StatItem = ({
  number,
  label,
  delay = 0,
}: {
  number: string;
  label: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true }}
    className="text-center"
  >
    <div className="text-4xl font-bold text-[#1cd35c] mb-2">{number}</div>
    <div className="text-white/70 font-medium">{label}</div>
  </motion.div>
);

// Service Card Component
const ServiceCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  delay?: number;
}) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -10 }}
      onClick={() => navigate("/solution-detail", { state: { title, description } })}
      className={`group relative flex flex-col justify-evenly p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-all duration-500 hover:bg-white/10 hover:border-[#1cd35c]/30 hover:shadow-[0_0_30px_rgba(28,211,92,0.1)] cursor-pointer overflow-hidden`}
    >
      {/* Dynamic Glow Effect */}
      <div className="absolute -inset-px bg-gradient-to-br from-[#1cd35c]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

      <div className="relative z-10 flex justify-center items-center p-4 mb-6 w-16 h-16 bg-white/10 rounded-xl group-hover:bg-[#1cd35c]/20 transition-colors duration-300">
        <Icon className="w-8 h-8 text-[#1cd35c]" />
      </div>
      <h3 className="relative z-10 mb-4 text-2xl font-bold text-white group-hover:text-[#1cd35c] transition-colors duration-300">{title}</h3>
      <p className="relative z-10 leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{description}</p>
      <div className="relative z-10 mt-6">
        <Link
          to="/solution-detail"
          state={{ title, description }}
          className="flex items-center text-[#1cd35c] font-bold group/link"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="relative">
            Learn more
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1cd35c] group-hover/link:w-full transition-all duration-300 shadow-[0_0_8px_rgba(28,211,92,0.8)]" />
          </span>
          <ArrowRight className="ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </motion.div>
  );
};



// Contact Form Component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    reason: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const contactReasons = [
    { value: "business_inquiry", label: "Business Inquiry" },
    { value: "career_opportunity", label: "Career Opportunity" },
    { value: "partnership_proposal", label: "Partnership Proposal" },
    { value: "technical_support", label: "Technical Support" },
    { value: "pricing_question", label: "Pricing Information" },
    { value: "feature_request", label: "Feature Request" },
    { value: "compliance_question", label: "Compliance Question" },
    { value: "other", label: "Other" },
  ];

  const submitToHubSpot = async (data: typeof formData) => {
    const portalId = "242436478"; // Replace with your HubSpot portal ID
    const formGuid = "a90a1936-b5d2-4092-bc4c-f9c48170ac3d"; // Replace with your HubSpot form GUID

    const hubspotData = {
      fields: [
        {
          name: "firstname",
          value: data.firstName,
        },
        {
          name: "lastname",
          value: data.lastName,
        },
        {
          name: "email",
          value: data.email,
        },
        {
          name: "contact_reason",
          value: data.reason,
        },
        {
          name: "message",
          value: data.message,
        },
      ],
      context: {
        pageUri: window.location.href,
        pageName: document.title,
        hutk: document.cookie
          .split(";")
          .find((c) => c.trim().startsWith("hubspotutk="))
          ?.split("=")[1],
      },
    };

    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hubspotData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit form");
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      devLog("Submitting to HubSpot:", formData);
      await submitToHubSpot(formData);

      setSubmitStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        reason: "",
        message: "",
      });
    } catch (err) {
      console.error("Form submission error:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (submitStatus !== "idle") setSubmitStatus("idle");
  };

  if (submitStatus === "success") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#1cd35c]/10 p-8 rounded-xl text-center"
      >
        <div className="mb-4 w-16 h-16 mx-auto bg-[#1cd35c] rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-[#1cd35c] mb-2">
          Message Sent!
        </h3>
        <p className="mb-6 text-gray-400">
          Thank you for reaching out. We'll get back to you soon.
        </p>
        <button
          onClick={() => setSubmitStatus("idle")}
          className="text-[#1cd35c] hover:text-[#19b850] font-medium transition-colors duration-300"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit}
    >
      {submitStatus === "error" && (
        <div className="p-4 mb-4 text-red-600 bg-red-50 rounded-xl">
          Failed to send message. Please try again.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-bold text-gray-700">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent transition-all duration-200 placeholder-gray-400 focus:bg-white"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent transition-all duration-200 placeholder-gray-400 focus:bg-white"
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-bold text-gray-700">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent transition-all duration-200 placeholder-gray-400 focus:bg-white"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-bold text-gray-700">
          What's this regarding? *
        </label>
        <select
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent transition-all duration-200 focus:bg-white"
        >
          <option value="">Select a reason</option>
          {contactReasons.map((reason) => (
            <option key={reason.value} value={reason.value}>
              {reason.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 text-sm font-bold text-gray-700">
          How can we help you? *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent transition-all duration-200 placeholder-gray-400 focus:bg-white"
          placeholder="Tell us a bit about your privacy or compliance needs."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-8 py-4 bg-[#1cd35c] text-white rounded-xl hover:bg-[#19b850] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <span>Sending...</span>
            <div className="w-5 h-5 rounded-full border-b-2 border-white animate-spin"></div>
          </>
        ) : (
          <>
            <span>Send Message</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </motion.form>
  );
};

// Main Home Component
const Home = () => {
  const prefersReducedMotion = useReducedMotion();



  // Service items
  const serviceItems = [
    {
      icon: Heart,
      title: "Privacy Management & ROPA Platform",
      description:
        "Proteccio Data provides a technology driven privacy management platform that helps organizations document, manage, and govern their Records of Processing Activities (ROPA) and related privacy operations. This includes automation, centralized visibility, risk tracking, and audit ready reporting all in one place",
      color: "from-[#1cd35c]/20 to-[#1cd35c]/5",
    },
    {
      icon: Briefcase,
      title: "Data Privacy Governance & Compliance Enablement",
      description:
        "We help organizations build and strengthen their data privacy governance framework, ensuring alignment with global regulations such as GDPR and other data protection laws. This service focuses on accountability, privacy by design, risk management, and operationalizing compliance across teams.",
      color: "from-[#1cd35c]/30 to-[#1cd35c]/5",
    },
    {
      icon: Shield,
      title: "Privacy Risk, Audit & Regulatory Readiness Support",
      description:
        "Proteccio Data supports organizations in identifying privacy risks, preparing for audits, and responding to regulatory requirements. Through structured assessments, reporting, and continuous monitoring, we help businesses stay confident, compliant, and regulator ready.",
      color: "from-[#1cd35c]/25 to-[#1cd35c]/5",
    },
  ];

  const partnerLogos = [
    { id: 1, src: "/logos/ioil.png", alt: "Indian Oil Corporation Limited", h: "h-12 md:h-16" },
    { id: 2, src: "/logos/bleep-new.png", alt: "Bleep", h: "h-12 md:h-16" },
    { id: 3, src: "/logos/onehash-new.png", alt: "OneHash", h: "h-10 md:h-14" },
    { id: 4, src: "/logos/advotalks-new.png", alt: "AdvoTalks", h: "h-10 md:h-14" },
  ];

  const orbitNodes: { icon: React.ElementType; label: string; x: number; y: number }[] = [
    { icon: Database, label: "Data Mapping", x: 21, y: 28 },
    { icon: Users, label: "Third Party", x: 18, y: 52 },
    { icon: Lock, label: "Security", x: 26, y: 76 },
    { icon: FileText, label: "ROPA", x: 79, y: 30 },
    { icon: Activity, label: "DPIA", x: 83, y: 52 },
    { icon: CheckCircle, label: "Assurance", x: 75, y: 76 },
  ];

  const orbitLinks = orbitNodes.map((node, i) => {
    const midX = (50 + node.x) / 2;
    const curvature = node.x < 50 ? -8 : 8;
    const midY = (50 + node.y) / 2 + curvature;
    return {
      path: `M 50 50 Q ${midX} ${midY} ${node.x} ${node.y}`,
      from: i % 2 === 0 ? { x: 50, y: 50 } : { x: node.x, y: node.y },
      to: i % 2 === 0 ? { x: node.x, y: node.y } : { x: 50, y: 50 },
    };
  });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 110, damping: 22, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 110, damping: 22, mass: 0.6 });
  const tiltY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const tiltX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const coreShiftX = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);
  const coreShiftY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);
  const auraX = useTransform(smoothX, [-0.5, 0.5], [35, 65]);
  const auraY = useTransform(smoothY, [-0.5, 0.5], [35, 65]);
  const auraLeft = useTransform(auraX, (v) => `${v}%`);
  const auraTop = useTransform(auraY, (v) => `${v}%`);



  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">


      {/* Hero Section */}
      <div className="overflow-hidden relative">

        <div className="px-4 pt-28 pb-14 md:pt-28 md:pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:gap-14 items-center lg:grid-cols-2">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6 inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full"
              >
                <span className="text-white font-bold tracking-wide uppercase text-sm">
                  Your Next GEN Privacy Solutions
                </span>
              </motion.div>

              <h1 className="mb-6 text-[40px] md:text-[54px] font-extrabold leading-[1.1] lg:text-[72px] text-white tracking-tight">
                <span className="whitespace-nowrap">Protect Your Data</span>
                <br />
                <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent"> Build Trust </span>
                <br />
                Stay in Control
              </h1>
              <p className="mb-8 max-w-lg text-lg font-medium text-white/60 md:text-xl leading-relaxed">
                At Proteccio Data, we help organizations understand, manage, and protect the personal data they hold. Our platform simplifies data privacy and governance, so you can stay compliant, reduce risk, and operate with confidence even as regulations and data landscapes evolve.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/book-demo"
                  className="group flex items-center px-8 py-4 bg-[#1cd35c] text-white rounded-full font-medium hover:bg-[#19b850] transition-all duration-300"
                >
                  Get Started
                  <motion.span
                    className="ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 border-2 border-[#1cd35c] text-[#1cd35c] rounded-full font-medium hover:bg-[#1cd35c] hover:text-white transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-12"
              >
                <div className="flex flex-wrap gap-4 items-center sm:gap-8">
                  <FeaturePoint icon={Shield} text="ISO 27001 Certified" />
                  <FeaturePoint icon={Shield} text="ISO 27701 Certified" />
                  <FeaturePoint icon={Lock} text="GDPR Compliant" />
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative z-10 lg:translate-x-64"
            >
              <div className="relative w-full h-full flex items-center justify-center min-h-[400px]">
                {/* Animated Grid Background */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-10"></div>

                <motion.div
                  className="relative"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  {/* Outer Glow Ring */}
                  <motion.div
                    className="absolute w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(28, 211, 92, 0.15) 0%, transparent 70%)",
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Outer Circle with Purple Tint */}
                  <motion.div
                    className="absolute w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full border-[3px] border-[#1cd35c]/20"
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  {/* Middle Circle with Teal */}
                  <motion.div
                    className="absolute w-[220px] h-[220px] md:w-[300px] md:h-[300px] rounded-full border-[3px] border-[#1cd35c]/25"
                    animate={{
                      scale: [1, 1.08, 1],
                      rotate: [360, 180, 0],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  {/* Inner Glowing Core */}
                  <motion.div
                    className="absolute w-[160px] h-[160px] md:w-[220px] md:h-[220px] rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(28, 211, 92, 0.4) 0%, rgba(23, 168, 75, 0.25) 40%, transparent 70%)",
                      boxShadow: "0 0 120px rgba(28, 211, 92, 0.6), 0 0 80px rgba(23, 168, 75, 0.4)",
                    }}
                    animate={{
                      scale: [1, 1.15, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 md:py-14 bg-transparent"
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <StatItem number="98%" label="uptime Guaranteed" delay={0} />
            <StatItem number="1000+" label="Active User's" delay={0.2} />
            <StatItem number="150+" label="Global Complaints" delay={0.3} />
            <StatItem number="24/7" label="Expert Support" delay={0.4} />
          </div>
        </div>
      </motion.div>

      {/* About Section */}
      <SectionTransition>
        <section className="pt-12 pb-6 md:pt-14 md:pb-8 bg-transparent">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 md:gap-12 items-center lg:grid-cols-2">
              <div>
                <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-medium mb-4">
                  About Us
                </span>
                <h2 className="mb-6 text-[32px] md:text-5xl font-bold text-white leading-tight">
                  Proteccio Data helps businesses{" "}
                  <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">
                    protect data and respect privacy
                  </span>
                </h2>
                <p className="mb-6 text-lg md:text-xl text-white/60 leading-relaxed font-medium">
                  We build easy to use data privacy and protection software that helps organizations stay compliant with global regulations without the stress.
                </p>
                <p className="mb-6 text-lg md:text-xl text-white/60 leading-relaxed">
                  In today’s data driven world, keeping sensitive information safe can feel complicated. That’s why we focus on simple, reliable, and future ready solutions that make privacy management clear and practical.
                </p>
                <p className="text-lg md:text-xl text-white/60 leading-relaxed">
                  At Proteccio, we don’t just help you meet requirements, we help you build trust, protect your business, and confidently uphold the highest standards of data privacy.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative w-full max-w-[580px] h-[360px] md:h-[430px] flex items-center justify-center mx-auto"
                style={{ perspective: 1200 }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const nx = (e.clientX - rect.left) / rect.width - 0.5;
                  const ny = (e.clientY - rect.top) / rect.height - 0.5;
                  pointerX.set(nx);
                  pointerY.set(ny);
                }}
                onMouseLeave={() => {
                  pointerX.set(0);
                  pointerY.set(0);
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    rotateX: prefersReducedMotion ? 0 : tiltX,
                    rotateY: prefersReducedMotion ? 0 : tiltY,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(28,211,92,0.22),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(28,211,92,0.14),transparent_45%)] pointer-events-none" />

                  <motion.div
                    className="absolute w-80 h-80 md:w-[420px] md:h-[420px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      x: prefersReducedMotion ? 0 : coreShiftX,
                      y: prefersReducedMotion ? 0 : coreShiftY,
                      background:
                        "radial-gradient(circle, rgba(28,211,92,0.28) 0%, rgba(28,211,92,0.08) 35%, transparent 70%)",
                      filter: "blur(14px)",
                    }}
                  />

                  <motion.div
                    className="absolute w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full border border-[#1cd35c]/20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={prefersReducedMotion ? undefined : { rotate: [0, 360] }}
                    transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute w-[320px] h-[320px] md:w-[390px] md:h-[390px] rounded-full border border-white/10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={prefersReducedMotion ? undefined : { rotate: [360, 0] }}
                    transition={{ duration: 52, ease: "linear", repeat: Infinity }}
                  />

                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {orbitLinks.map((link, i) => (
                      <motion.path
                        key={`connector-${i}`}
                        d={link.path}
                        fill="none"
                        stroke="rgba(28, 211, 92, 0.28)"
                        strokeWidth="0.6"
                        strokeDasharray="2.8 2.8"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.08, duration: 0.9, ease: "easeOut" }}
                      />
                    ))}
                  </svg>

                  {!prefersReducedMotion &&
                    orbitLinks.map((link, i) => (
                      <motion.div
                        key={`flow-${i}`}
                        className="absolute w-2 h-2 rounded-full bg-[#1cd35c] shadow-[0_0_12px_rgba(28,211,92,0.9)]"
                        style={{ left: `${link.from.x}%`, top: `${link.from.y}%` }}
                        animate={{ left: [`${link.from.x}%`, `${link.to.x}%`], top: [`${link.from.y}%`, `${link.to.y}%`] }}
                        transition={{
                          duration: 2.4,
                          delay: i * 0.28,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "linear",
                        }}
                      />
                    ))}

                  <motion.div
                    className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-gradient-to-br from-[#1cd35c] to-[#169644] border border-white/30 shadow-[0_16px_45px_rgba(28,211,92,0.42)] flex flex-col items-center justify-center"
                    style={{
                      x: prefersReducedMotion ? 0 : coreShiftX,
                      y: prefersReducedMotion ? 0 : coreShiftY,
                    }}
                    whileHover={{ scale: 1.04 }}
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : {
                          boxShadow: [
                            "0 16px 45px rgba(28,211,92,0.42)",
                            "0 20px 60px rgba(28,211,92,0.58)",
                            "0 16px 45px rgba(28,211,92,0.42)",
                          ],
                        }
                    }
                    transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Shield className="w-11 h-11 text-white mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/95">Proteccio Core</span>
                  </motion.div>

                  {orbitNodes.map((node, i) => (
                    <motion.div
                      key={node.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.16 + i * 0.08, duration: 0.45 }}
                      whileHover={{ scale: 1.08, y: -4 }}
                      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-2 bg-white/[0.06] border border-white/15 backdrop-blur-md flex items-center gap-2 cursor-default shadow-[0_6px_18px_rgba(0,0,0,0.3)]"
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                      <node.icon className="w-4 h-4 text-[#1cd35c]" />
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-white/80 whitespace-nowrap">
                        {node.label}
                      </span>
                    </motion.div>
                  ))}

                  <motion.div
                    className="absolute w-48 h-48 rounded-full pointer-events-none"
                    style={{
                      left: auraLeft,
                      top: auraTop,
                      transform: "translate(-50%, -50%)",
                      background: "radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(28,211,92,0.08) 35%, transparent 70%)",
                      filter: "blur(18px)",
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </SectionTransition>

      {/* Services Section */}
      <section className="relative pt-8 pb-14 md:pt-10 md:pb-16">
        {/* Background Elements */}
        {/* Removed white bg */}
        <motion.div
          className="absolute top-1/3 right-0 w-96 h-96 bg-[#1cd35c]/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <SectionTransition>
            <div className="mb-10 md:mb-12 text-center">
              <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-medium mb-4">
                Our Services
              </span>
              <h2 className="mb-6 text-[32px] md:text-5xl font-bold text-white leading-tight font-jakarta">
                Privacy That
                <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent"> Works for You</span>
              </h2>
              <p className="mx-auto max-w-3xl text-lg md:text-xl text-white/60 font-medium">
                Simple, powerful tools to manage and protect sensitive data.
                Designed to help you meet global privacy regulations confidently.
              </p>
            </div>
          </SectionTransition>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {serviceItems.map((service, index) => (
              <ServiceCard
                key={service.title}
                icon={service.icon}
                title={service.title}
                description={service.description}
                color={service.color}
                delay={index * 0.2}
              />
            ))}
          </div>
          {/* 
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              to="/services"
              className="inline-flex items-center px-6 py-3 text-[#1cd35c] hover:text-[#19b850] font-medium transition-colors duration-300"
            >
              View All Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div> */}
        </div>
      </section>


      {/* Tools Section */}
      <section className="py-14 md:py-16 bg-transparent relative overflow-hidden">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <SectionTransition>
            <div className="mb-10 md:mb-12 text-center">
              <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-medium mb-4">
                Our Products
              </span>
              <h2 className="mb-6 text-[32px] md:text-5xl font-bold text-white">
                Powerful Privacy <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Management Products</span>
              </h2>
              <p className="mx-auto max-w-3xl text-lg text-white/60">
                Streamline your compliance journey with our intuitive and automated privacy infrastructure.
              </p>
            </div>
          </SectionTransition>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative lg:pr-10"
            >
              <div
                className="relative bg-transparent rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              >
                <Swiper
                  modules={[Pagination]}
                  pagination={{ clickable: true }}
                  className="w-full"
                >
                  <SwiperSlide>
                    <img
                      src="/dashboard-ropa-new.png"
                      alt="Total RoPA Dashboard"
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img
                      src="/dashboard-action-new.png"
                      alt="Action Item Dashboard"
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#1cd35c] font-bold text-sm uppercase tracking-widest mb-4 block">Record of Processing Activities</span>
              <h3 className="text-3xl font-bold text-white mb-6">
                RoPA Management <span className="text-[#1cd35c]">Made Simple</span>
              </h3>
              <p className="text-white/70 mb-8 text-lg">
                Streamline your GDPR and DPDPA compliance with our comprehensive Records of Processing Activities platform. Easily document, manage, and maintain all your data processing activities in one centralized dashboard.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  "Automated processing activity mapping",
                  "Dynamic data inventory tracking",
                  "Real-time compliance status monitoring"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-white/80">
                    <CheckCircle className="w-5 h-5 text-[#1cd35c] mr-3 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 bg-[#1cd35c] text-white rounded-full font-medium hover:bg-[#19b850] transition-all duration-300"
              >
                Explore More
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="overflow-hidden relative py-14 md:py-16 bg-transparent">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <SectionTransition>
            <div className="mb-10 md:mb-12 text-center">
              <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-medium mb-4">
                Brands trust with us
              </span>
              <p className="mx-auto max-w-3xl text-base md:text-xl text-white/70">
                Organizations around the world choose Proteccio Data to protect data, reduce risk, and move faster with confidence.
              </p>
            </div>
          </SectionTransition>

          <div className="relative overflow-hidden py-10">
            <motion.div
              className="flex whitespace-nowrap gap-12 items-center"
              animate={{
                x: [0, -1000],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25,
                  ease: "linear",
                },
              }}
            >
              {/* Double the logos for seamless looping */}
              {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, index) => (
                <div
                  key={`${logo.id}-${index}`}
                  className="flex-shrink-0 flex justify-center items-center px-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="cursor-pointer"
                  >
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className={`${logo.h} w-auto object-contain transition-opacity duration-300 opacity-80 hover:opacity-100`}
                      loading="lazy"
                    />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* How We Work Section */}
      <SectionTransition>
        <section className="py-14 md:py-16 bg-transparent">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="mb-10 md:mb-12 text-center">
              <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-medium mb-4">
                Our Process
              </span>
              <h2 className="mb-6 text-[32px] md:text-4xl font-extrabold text-white">
                How We Make It <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Happen</span>
              </h2>
              <div className="w-24 h-1 bg-[#1cd35c] mx-auto rounded-full mb-8" />
              <p className="mx-auto max-w-3xl text-lg md:text-xl text-white/60 leading-relaxed font-medium">
                We follow a rigorous, proven methodology to transition your organization
                from vulnerability to resilient data sovereignty.
              </p>
            </div>

            {/* Two Column Layout: Content Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Process Steps as Bullet Points */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {[
                  {
                    icon: LayoutIcon,
                    title: "Compliance",
                    description:
                      "Establish a solid regulatory foundation tailored to your specific regional and industry requirements.",
                  },
                  {
                    icon: FileText,
                    title: "Assignment",
                    description:
                      "Systematic allocation of privacy controls and responsibilities across your organizational structure.",
                  },
                  {
                    icon: ActivityIcon,
                    title: "Implementation",
                    description:
                      "Execution of custom-built frameworks designed to fortify your operations with automated precision.",
                  },
                  {
                    icon: Users,
                    title: "Support",
                    description:
                      "Continuous expert guidance and technical assistance to ensure your privacy posture remains resilient.",
                  },
                ].map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="flex items-start space-x-4 group"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 bg-[#1cd35c]/10 rounded-full w-14 h-14 flex items-center justify-center group-hover:bg-[#1cd35c]/20 transition-all duration-300">
                      <step.icon className="w-7 h-7 text-[#1cd35c]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#1cd35c] transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Right Column - Process Diagram Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative flex justify-center items-center"
              >
                {/* Decorative background glow */}
                <div className="absolute w-[80%] h-[80%] bg-[#1cd35c]/20 blur-[120px] rounded-full -z-10 animate-pulse" />

                <motion.img
                  src="/our-process-v2.png"
                  alt="Our Privacy Process Workflow"
                  className="w-full max-w-[600px] rounded-2xl shadow-2xl z-10"
                  whileHover={{
                    scale: 1.03,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
            </div>
          </div>
        </section>
      </SectionTransition>


      {/* Contact Section */}
      <section className="relative py-14 md:py-16 bg-transparent">
        <motion.div
          className="absolute right-0 bottom-0 w-96 h-96 bg-[#1cd35c]/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <SectionTransition>
            <div className="p-8 md:p-12 rounded-[2rem] shadow-2xl backdrop-blur-2xl bg-white/95 border border-white/40">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                <div>
                  <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-bold text-xs uppercase tracking-widest mb-6">
                    Connect With Us
                  </span>
                  <h2 className="mb-6 text-[32px] md:text-5xl font-black text-gray-900 leading-[1.1]">
                    Let's Secure Your
                    <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent"> Digital Future</span>
                  </h2>
                  <p className="mb-10 text-lg md:text-xl text-gray-700 font-medium leading-relaxed">
                    Ready to elevate your privacy standards? Join a conversation
                    with our architects today.
                  </p>
                  <div className="flex flex-col space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[#1cd35c]/10 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-[#1cd35c]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Global Support</h4>
                        <p className="text-gray-600">
                          Available worldwide 24/7
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[#1cd35c]/10 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-[#1cd35c]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Fast Response</h4>
                        <p className="text-gray-600">
                          We respond within few hours
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[#1cd35c]/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-[#1cd35c]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Expert Team</h4>
                        <p className="text-gray-600">
                          Seasoned security professionals
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <ContactForm />
              </div>
            </div>
          </SectionTransition>
        </div>
      </section>

      {/* CTA Section */}
      <SectionTransition>
        <section className="py-20 bg-[#1cd35c] hidden">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between items-center md:flex-row">
              <div className="mb-8 md:mb-0">
                <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                  Ready to secure your business?
                </h2>
                <p className="max-w-2xl text-lg text-white/90">
                  Contact our team today to discover how Proteccio can help you
                  achieve full compliance with data protection and privacy laws.
                </p>
              </div>
              <Link
                to="/book-demo"
                className="px-8 py-4 bg-white text-[#1cd35c] rounded-full font-medium hover:bg-gray-100 transition-all duration-300 flex items-center"
              >
                Contact Us Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </SectionTransition>

    </div >
  );
};

export default Home;
