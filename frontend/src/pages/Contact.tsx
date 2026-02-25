import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle
} from "lucide-react";
import emailjs from "emailjs-com";



const clientLogos = [
  { id: 1, src: "/logos/ioil.png", alt: "Indian Oil Corporation Limited", h: "h-12 md:h-16" },
  { id: 2, src: "/logos/bleep-new.png", alt: "Bleep", h: "h-12 md:h-16" },
  { id: 3, src: "/logos/onehash-new.png", alt: "OneHash", h: "h-10 md:h-14" },
  { id: 4, src: "/logos/advotalks-new.png", alt: "AdvoTalks", h: "h-10 md:h-14" },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    company: "",
    reason: "",
    message: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_EMAIL_SERVICE,
        import.meta.env.VITE_EMAIL_TEMPLATE,
        { ...formData },
        import.meta.env.VITE_EMAIL_PUBLIC
      )
      .then(() => {
        setIsSubmitted(true);
        setIsLoading(false);
        setFormData({
          name: "",
          lastname: "",
          email: "",
          company: "",
          reason: "",
          message: ""
        });
      })
      .catch(() => {
        setIsLoading(false);
        alert("Unable to process your request. Please try again later.");
      });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white pt-28 pb-20 relative overflow-hidden">

      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/10 to-transparent pointer-events-none opacity-50 transition-all duration-1000"></div>
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#1cd35c]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-[#1cd35c]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Contact <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Proteccio Data</span>
          </h1>
          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Engage with our privacy and compliance specialists for structured advisory,
            regulatory readiness assessments, and enterprise data governance solutions.
          </p>
          <div className="mt-8 inline-flex items-center px-4 py-2 bg-[#1cd35c]/10 rounded-full border border-[#1cd35c]/20">
            <span className="w-2 h-2 rounded-full bg-[#1cd35c] mr-2 animate-pulse"></span>
            <p className="text-sm text-[#1cd35c] font-black uppercase tracking-widest">
              Average Response Time: &lt; 24 Business Hours
            </p>
          </div>
        </div>

        {/* Client Logos */}
        <section className="py-12 mb-20">
          <h3 className="text-center text-[10px] font-black uppercase tracking-widest text-white/40 mb-10">
            Trusted by Enterprises & Growing Organizations
          </h3>

          <div className="relative overflow-hidden py-4 border-y border-white/5 bg-white/[0.02]">
            <motion.div
              className="flex whitespace-nowrap gap-16 items-center"
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
              {[...clientLogos, ...clientLogos, ...clientLogos].map((logo, i) => (
                <div key={`${logo.id}-${i}`} className="flex-shrink-0 flex justify-center items-center px-4">
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
        </section>

        {/* Main Contact Section */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* Trust Column */}
          <div className="lg:col-span-5 flex flex-col gap-6 h-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:border-[#1cd35c]/30 transition-colors duration-300 flex-1 flex flex-col justify-center"
            >
              <div className="w-12 h-12 bg-[#1cd35c]/10 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-[#1cd35c]" />
              </div>
              <h3 className="text-xl font-black mb-3 text-white">
                Confidential & Secure
              </h3>
              <p className="text-gray-400 leading-relaxed">
                All inquiries are handled under strict confidentiality and aligned
                with Indian and global data protection regulations (GDPR, DPDPA, HIPAA).
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:border-[#1cd35c]/30 transition-colors duration-300 flex-1 flex flex-col justify-center"
            >
              <h3 className="text-xl font-black mb-4 text-white">
                Engagement Areas
              </h3>
              <ul className="space-y-4">
                {[
                  "Regulatory Readiness (DPDPA, GDPR)",
                  "Enterprise Privacy Transformation",
                  "Risk & Impact Assessments",
                  "Incident Response Strategy"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-gray-400">
                    <CheckCircle className="w-4 h-4 text-[#1cd35c] mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
              {/* Decorative top accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1cd35c] to-transparent opacity-50" />

              <h2 className="text-2xl font-black mb-6 text-white">
                Send an Inquiry
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">First Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Enter first name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#1cd35c] transition-all text-sm placeholder-gray-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastname"
                      required
                      placeholder="Enter last name"
                      value={formData.lastname}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#1cd35c] transition-all text-sm placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Work Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#1cd35c] transition-all text-sm placeholder-gray-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Company</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Organization name"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#1cd35c] transition-all text-sm placeholder-gray-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Inquiry Type</label>
                  <div className="relative">
                    <select
                      name="reason"
                      required
                      value={formData.reason}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#1cd35c] transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-gray-900 text-gray-500">Select reason...</option>
                      <option className="bg-gray-900">Regulatory Consultation</option>
                      <option className="bg-gray-900">Request Enterprise Demo</option>
                      <option className="bg-gray-900">Technical Advisory</option>
                      <option className="bg-gray-900">Partnership Discussion</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Message</label>
                  <textarea
                    name="message"
                    rows={3}
                    required
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#1cd35c] transition-all text-sm resize-none placeholder-gray-500"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-[#1cd35c] text-black font-black rounded-xl text-sm uppercase tracking-widest hover:shadow-[0_0_20px_rgba(28,211,92,0.4)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Submit Inquiry"
                  )}
                </motion.button>

                <p className="text-[10px] text-center text-white/30 mt-4 leading-relaxed">
                  By submitting this form, you agree to our <a href="/privacy-notice" className="underline hover:text-[#1cd35c] transition-colors">Privacy Policy</a>.
                </p>

              </form>

              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gray-900/95 backdrop-blur-xl flex items-center justify-center p-8 z-20 rounded-[2.5rem]"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#1cd35c]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-[#1cd35c]" />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2">Message Sent!</h3>
                      <p className="text-gray-400 mb-6 max-w-xs mx-auto">
                        Thank you for contacting Proteccio Data. A member of our team
                        will respond within one business day.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-xs font-black uppercase tracking-widest"
                      >
                        Send another message
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </div>

      </div>
    </div>

  );
};

export default Contact;
