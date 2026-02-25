import { motion } from "framer-motion";

const PrivacyMatters = () => {
  return (
    <div className="bg-transparent mt-16 py-14 md:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-bold text-xs uppercase tracking-widest mb-6 border border-[#1cd35c]/20">
          Core Commitment
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-8">
          Privacy <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Matters</span>
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1cd35c]/5 blur-[100px] rounded-full group-hover:bg-[#1cd35c]/10 transition-colors"></div>

        <div className="relative z-10 text-white/70 space-y-8 text-lg font-medium leading-relaxed">
          <p className="border-l-4 border-[#1cd35c] pl-6 italic text-white text-xl bg-white/5 py-4 rounded-r-2xl">
            "All personal data and information provided on this website is the
            exclusive property of Proteccio Data. We represent the digital
            sovereignty of the information entrusted to us."
          </p>

          <p>
            Any unauthorized use, reproduction, or modification of personal information,
            data, or content collected from this website without the explicit written
            consent of management is strictly prohibited. Any breach of privacy or
            unauthorized actions related to personal data will result in serious legal
            consequences, including but not limited to rigorous legal action and
            regulatory penalties.
          </p>

          <p>
            Proteccio Data is fundamentally committed to safeguarding your identity and
            ensuring your personal information is managed within a zero-trust architecture.
            We only collect data that you voluntarily provide to us—primarily through
            strategic inquiries or demo registrations.
          </p>

          <p>
            We process your information to architect better services, communicate
            strategic insights, and maintain absolute compliance with international
            legal obligations. <span className="text-white font-bold underline decoration-[#1cd35c]">We do not sell, trade, or transfer</span> your personal
            information to outside entities without your verified consent, strictly
            adhering to the principles of data minimization.
          </p>

          <p>
            By engaging with our digital presence, you consent to our architectural
            privacy standards. For any specific inquiries regarding our governance
            framework, our architects are available at <a href="mailto:contact@proteccio.com" className="text-[#1cd35c] hover:underline">contact@proteccio.com</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyMatters;
