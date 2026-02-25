import { motion } from "framer-motion";
import { useEffect, useState, type ElementType } from "react";
import { ArrowRight, Globe, Heart, Mail, Rocket, Shield, Target, Zap } from "lucide-react";
import { contentManagerService } from "../services/contentManager";
import type { PartnerIconKey, PartnersPageContent } from "../types/content";
import { devLog } from "../utils/logger";

const iconMap: Record<PartnerIconKey, ElementType> = {
  target: Target,
  shield: Shield,
  rocket: Rocket,
  globe: Globe,
  zap: Zap,
  heart: Heart,
};

const Partners = () => {
  const [content, setContent] = useState<PartnersPageContent>(() => contentManagerService.getPartnersPageContent());
  const [formState, setFormState] = useState(() => ({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    website: "",
    partnerLimit: content.formCompanySizeOptions[0] ?? "1-10 employees",
    country: content.formDefaultCountry,
    message: "",
  }));

  useEffect(() => {
    const refresh = () => setContent(contentManagerService.getPartnersPageContent());
    refresh();
    return contentManagerService.subscribe(refresh);
  }, []);

  const scrollToApplication = () => {
    document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Keep existing behavior until form backend integration is introduced.
    devLog("Partner application submitted:", formState);
    alert(content.formSuccessMessage);
  };

  return (
    <div className="min-h-screen bg-transparent text-white pt-20">
      <section className="relative py-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/10 to-transparent pointer-events-none opacity-50 transition-all duration-1000"></div>
        <div className="container px-4 mx-auto max-w-7xl text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 border border-[#1cd35c]/20 rounded-full text-[#1cd35c] text-xs font-black uppercase tracking-widest mb-6">
              {content.heroBadge}
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">{content.heroTitle}</h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToApplication}
                className="px-8 py-4 bg-[#1cd35c] text-white font-black rounded-lg hover:bg-[#19b850] transition-all text-sm uppercase tracking-widest"
              >
                {content.heroPrimaryButton}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToApplication}
                className="px-8 py-4 border-2 border-[#1cd35c] text-[#1cd35c] font-black rounded-lg hover:bg-[#1cd35c] hover:text-white transition-all text-sm uppercase tracking-widest"
              >
                {content.heroSecondaryButton}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white/5 relative">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">{content.whyPartnerTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.whyPartnerItems.map((val, idx) => {
              const Icon = iconMap[val.icon] ?? Shield;
              return (
                <motion.div
                  key={val.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-all duration-500 hover:bg-white/10 hover:border-[#1cd35c]/30 hover:shadow-[0_0_30px_rgba(28,211,92,0.1)] group"
                >
                  <div className="w-12 h-12 bg-[#1cd35c]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#1cd35c]" />
                  </div>
                  <h3 className="text-2xl font-black mb-4">{val.title}</h3>
                  <p className="text-white/60 leading-relaxed text-sm">{val.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 relative overflow-hidden">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">{content.whyProteccioTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {content.whyProteccioItems.map((adv, idx) => {
              const Icon = iconMap[adv.icon] ?? Shield;
              return (
                <motion.div
                  key={adv.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:bg-[#1cd35c]/10 group-hover:border-[#1cd35c]/30 transition-all">
                    <Icon className="w-8 h-8 text-[#1cd35c]" />
                  </div>
                  <h3 className="text-xl font-black mb-4">{adv.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">{adv.desc}</p>
                  <motion.button
                    whileHover={{ scale: 1.05, gap: "12px" }}
                    className="mt-6 text-[#1cd35c] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 mx-auto hover:gap-3 transition-all"
                  >
                    Learn more <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white/5">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">{content.waysToPartnerTitle}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {content.partnerTiers.map((tier, idx) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] flex flex-col h-full hover:border-[#1cd35c]/30 hover:shadow-[0_0_30px_rgba(28,211,92,0.1)] transition-all"
              >
                <h3 className="text-2xl font-black mb-4">{tier.title}</h3>
                <p className="text-white/60 text-sm mb-12 leading-relaxed">{tier.desc}</p>
                <div className="grid grid-cols-4 gap-4 mb-12">
                  {tier.logos.map((logo) => (
                    <div key={logo.id} className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center p-4">
                      <img src={logo.url} alt={logo.name} className="max-w-full transition-all" />
                    </div>
                  ))}
                </div>
                <div className="mt-auto flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-all"
                  >
                    View Partners
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToApplication}
                    className="px-6 py-3 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all"
                  >
                    Apply to Partner
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white/5">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">{content.becomePartnerTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 md:mb-20 text-center md:text-left">
            {content.becomePartnerSteps.map((step) => (
              <div key={step.id}>
                <div className="text-4xl font-black text-white mb-4">{step.num}</div>
                <h3 className="text-xl font-black mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div id="application-form" className="max-w-3xl mx-auto p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1cd35c] to-transparent opacity-50"></div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1cd35c] transition-all text-sm"
                    placeholder="Enter first name"
                    value={formState.firstName}
                    onChange={(e) => setFormState((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1cd35c] transition-all text-sm"
                    placeholder="Enter last name"
                    value={formState.lastName}
                    onChange={(e) => setFormState((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1cd35c] transition-all text-sm"
                  placeholder="Enter work email"
                  value={formState.email}
                  onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Company Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1cd35c] transition-all text-sm"
                    placeholder="Company name"
                    value={formState.company}
                    onChange={(e) => setFormState((prev) => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Company Website</label>
                  <input
                    type="url"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1cd35c] transition-all text-sm"
                    placeholder="https://"
                    value={formState.website}
                    onChange={(e) => setFormState((prev) => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Company Size</label>
                  <select
                    className="w-full bg-[#1b1b1b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1cd35c] transition-all text-sm appearance-none cursor-pointer"
                    value={formState.partnerLimit}
                    onChange={(e) => setFormState((prev) => ({ ...prev, partnerLimit: e.target.value }))}
                  >
                    {content.formCompanySizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Country</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1cd35c] transition-all text-sm"
                    placeholder="Location"
                    value={formState.country}
                    onChange={(e) => setFormState((prev) => ({ ...prev, country: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Why do you want to partner with Proteccio?</label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1cd35c] transition-all text-sm h-32 resize-none"
                  placeholder="Tell us about your business, clients, or use cases."
                  value={formState.message}
                  onChange={(e) => setFormState((prev) => ({ ...prev, message: e.target.value }))}
                ></textarea>
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-5 bg-[#1cd35c] text-black font-black rounded-xl text-sm uppercase tracking-widest hover:shadow-[0_0_20px_rgba(28,211,92,0.4)] transition-all active:scale-[0.98]"
                >
                  {content.formSubmitButton}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-white/5">
        <div className="container px-4 mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold mb-8">{content.supportTitle}</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href={`mailto:${content.supportEmail}`} className="flex items-center gap-3 text-sm text-[#1cd35c] hover:underline">
              <Mail className="w-5 h-5" />
              {content.supportEmail}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
