import { motion } from "framer-motion";

const Legal = () => {
  return (
    <div className="bg-transparent mt-16 py-14 md:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-bold text-xs uppercase tracking-widest mb-6 border border-[#1cd35c]/20">
          Governance
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-8">
          Legal <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Framework</span>
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1cd35c]/5 blur-[100px] rounded-full group-hover:bg-[#1cd35c]/10 transition-colors"></div>

        <div className="relative z-10 text-white/70 space-y-8 text-lg font-medium leading-relaxed">
          <p className="border-l-4 border-white/20 pl-6 text-white bg-white/5 py-6 rounded-r-2xl">
            All content on this website, including text, architectural diagrams,
            graphics, and visual assets, is the proprietary property of Proteccio Data
            and is protected under global copyright and intellectual property statutes.
          </p>

          <p>
            Unauthorized use, reproduction, or modification of any material from this
            website without the explicit written consent of the management is strictly
            prohibited. Any violation of these terms will result in rigorous legal
            consequences, including but not limited to litigation for proprietary
            infringement.
          </p>

          <p>
            Proteccio Data reserves the right to evolve these terms as the global
            regulatory landscape shifts. Continued engagement with our digital assets
            following updates constitutes acceptance of the refined framework.
          </p>

          <p className="p-8 bg-black/40 rounded-2xl border border-white/5">
            <span className="text-white font-bold block mb-2 uppercase tracking-widest text-sm">Disclaimer</span>
            Proteccio Data makes no representations or warranties of any kind regarding
            the absolute operation of this site or the information, content, or materials
            included. Your engagement with this site is at your own strategic risk.
            To the full extent permissible by law, we disclaim all warranties,
            implied or express, focusing our commitment on the technical precision of our
            governance services.
          </p>

          <p>
            If you require specific clarification on our jurisdictional standing or
            operational terms, please contact our legal architects at
            <a href="mailto:contact@proteccio.com" className="text-[#1cd35c] hover:underline ml-2 font-bold">contact@proteccio.com</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Legal;
