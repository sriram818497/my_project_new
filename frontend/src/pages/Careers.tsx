import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, ChevronRight } from "lucide-react";
import { careersService } from "../services/careers";
import type { CareersContent, CareersValueTab } from "../types/careers";

const Careers = () => {
    const [content, setContent] = useState<CareersContent | null>(null);
    const [openRegion, setOpenRegion] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<CareersValueTab | null>(null);

    const loadContent = async () => {
        const isDraftPreview =
            typeof window !== "undefined" &&
            new URLSearchParams(window.location.search).get("preview") === "draft";
        const data = isDraftPreview
            ? await careersService.getDraftContent()
            : await careersService.getPublishedContent();
        setContent(data);
        setOpenRegion((prev) => prev ?? data.regions[0]?.id ?? null);
        setActiveTab((prev) => prev ?? data.valueTabs[0] ?? null);
    };

    useEffect(() => {
        loadContent();
        return careersService.subscribe(loadContent);
    }, []);

    if (!content || !activeTab) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white/60">
                Loading careers content...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-white font-jakarta relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/8 via-transparent to-transparent pointer-events-none opacity-40 transition-all duration-1000" />
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-8%] right-[-6%] w-[520px] h-[520px] bg-[#1cd35c]/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-12%] left-[-8%] w-[560px] h-[560px] bg-[#1cd35c]/6 blur-[120px] rounded-full" />
            </div>

            <section className="relative h-screen overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={content.hero.backgroundImage}
                        alt="Join the future"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                </div>

                <div className="relative z-10 h-full flex items-center">
                    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 w-full">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-3xl text-left"
                        >
                            <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 border border-[#1cd35c]/20 rounded-full text-[#1cd35c] text-xs font-black uppercase tracking-widest mb-6">
                                {content.hero.badge}
                            </span>

                            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
                                {content.hero.titlePrefix} <br />
                                <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">
                                    {content.hero.titleHighlight}
                                </span>
                            </h1>

                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                <Link
                                    to={content.hero.ctaPath}
                                    className="px-10 py-4 bg-[#1cd35c] text-white font-black rounded-lg hover:bg-[#19b850] hover:shadow-[0_0_20px_rgba(28,211,92,0.4)] transition-all text-sm uppercase tracking-widest flex items-center gap-3"
                                >
                                    {content.hero.ctaLabel}
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="pt-20 pb-8 relative overflow-hidden">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        <div>
                            <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-black text-[10px] uppercase tracking-widest mb-6">
                                Global Impact
                            </span>
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                                Shape the future of <br /> <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">privacy globally</span>
                            </h2>
                            <p className="text-white/40 text-lg leading-relaxed max-w-lg">
                                At Proteccio, we are not just building software; we are protecting the digital footprint of millions.
                                Join our global team of privacy architects.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {content.regions.map((region, idx) => (
                                <div key={region.id} className="border-b border-white/5 last:border-0 group">
                                    <button
                                        onClick={() => setOpenRegion(openRegion === region.id ? null : region.id)}
                                        className="w-full py-6 flex items-center justify-between text-left transition-all cursor-pointer"
                                    >
                                        <span className="flex items-center gap-6">
                                            <span className="text-[#1cd35c] font-black text-lg">0{idx + 1}</span>
                                            <span className={`text-xl font-bold transition-all ${openRegion === region.id ? "text-white" : "text-white/40 group-hover:text-white/70"}`}>
                                                {region.name}
                                            </span>
                                        </span>
                                    </button>
                                    <AnimatePresence>
                                        {openRegion === region.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="pb-8 pl-16 text-white/40 max-w-md leading-relaxed">
                                                    {region.content}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-8 pb-8 relative">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-black text-[10px] uppercase tracking-widest mb-6">
                            Life at Proteccio
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black mb-6">
                            The <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Proteccio data difference</span>
                        </h2>
                        <p className="text-white/40 max-w-2xl mx-auto italic">Cultivating a workplace where builders, dreamers, and protectors thrive.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {content.cultureCards.map((card, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="group cursor-pointer p-6 bg-[#1a232e] border border-white/5 rounded-[2.5rem] hover:border-[#1cd35c]/30 hover:shadow-[0_0_40px_rgba(28,211,92,0.05)] transition-all"
                            >
                                <div className="aspect-[10/7] overflow-hidden rounded-3xl mb-8 relative">
                                    <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                </div>
                                <h3 className="text-2xl font-black mb-4 group-hover:text-[#1cd35c] transition-colors">{card.title}</h3>
                                <p className="text-white/40 text-sm mb-8 leading-relaxed line-clamp-2">{card.desc}</p>
                                <a href={card.link} className="inline-flex items-center gap-2 text-[#1cd35c] text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                                    Read Stories <ChevronRight className="w-4 h-4" />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="pt-6 pb-8 relative">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-10">
                        <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-black text-[10px] uppercase tracking-widest mb-5">
                            Benefits
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black">
                            What you get as part of the <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">team</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {content.benefits.map((benefit, idx) => (
                            <motion.div
                                key={`${benefit}-${idx}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="rounded-2xl border border-white/10 bg-[#1a232e] p-5"
                            >
                                <p className="text-white/80 leading-relaxed">{benefit}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="pt-8 pb-4 relative overflow-hidden">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 relative z-10">
                            <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-black text-[10px] uppercase tracking-widest mb-6">Values in Action</span>
                            <h2 className="text-5xl md:text-7xl font-black mb-12">Why <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Proteccio</span></h2>

                            <div className="flex flex-wrap gap-8 mb-16 border-b border-white/5">
                                {content.valueTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab.id === tab.id ? "text-[#1cd35c]" : "text-white/30 hover:text-white"}`}
                                    >
                                        {tab.name}
                                        {activeTab.id === tab.id && (
                                            <motion.div layoutId="activeTabUnderline" className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#1cd35c]" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="min-h-[250px]"
                                >
                                    <h3 className="text-3xl font-black mb-6 flex items-center gap-4">
                                        <div className="w-1 h-12 bg-[#1cd35c] rounded-full" />
                                        {activeTab.title}
                                    </h3>
                                    <p className="text-white/40 text-lg leading-relaxed mb-10">
                                        {activeTab.content}
                                    </p>
                                    <Link
                                        to="/case-studies"
                                        className="inline-block px-10 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-lg hover:bg-white hover:text-black transition-all"
                                    >
                                        Deep Dive
                                    </Link>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="order-1 lg:order-2 aspect-[4/5] overflow-hidden rounded-[3rem] relative shadow-2xl border border-white/10 group">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeTab.id}
                                    src={activeTab.img}
                                    initial={{ scale: 1.2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 1.1, opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                                />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-6 relative overflow-hidden">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-black text-[10px] uppercase tracking-widest mb-6">
                            Team Voices
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black">
                            What our <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">people</span> say
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.testimonials.map((item, idx) => (
                            <motion.div
                                key={`${item.name}-${idx}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 }}
                                className="rounded-3xl border border-white/10 bg-[#1a232e] p-6"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-full object-cover border border-white/10" />
                                    <div>
                                        <p className="font-black text-white">{item.name}</p>
                                        <p className="text-white/50 text-sm">{item.role}</p>
                                    </div>
                                </div>
                                <p className="text-white/70 leading-relaxed">"{item.quote}"</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent opacity-40" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent opacity-40" />

                <div className="px-4 mx-auto max-w-5xl sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-[#1cd35c] text-9xl font-serif mb-8 select-none opacity-20 italic h-20 leading-none">"</div>
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-16 text-white/90 italic">
                            We are on an exciting journey to be the world leading <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">privacy-driven</span> technology organization, led by a bold vision to unlock endless possibilities and empower talent.
                        </h2>
                    </motion.div>
                </div>
            </section>

            <section className="relative h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={content.cultureSpotlight.image}
                        alt="Join our team"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-black" />
                </div>
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10 flex justify-center md:justify-end">
                    <div className="max-w-2xl bg-black/40 backdrop-blur-xl p-12 rounded-[3.5rem] border border-white/10 shadow-3xl text-center md:text-left relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-[#1cd35c] opacity-50 group-hover:w-4 transition-all" />
                        <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 rounded-full text-[#1cd35c] font-black text-[10px] uppercase tracking-widest mb-8">
                            Belonging @ Proteccio
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                            {content.cultureSpotlight.title}
                        </h2>
                        <p className="text-white/70 mb-8 leading-relaxed">{content.cultureSpotlight.description}</p>
                        <a href="/about" className="group inline-flex items-center gap-4 text-xs font-black uppercase tracking-widest hover:text-[#1cd35c] transition-colors relative">
                            Our Culture Story
                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#1cd35c] group-hover:border-[#1cd35c] group-hover:text-black transition-all">
                                <Plus className="w-5 h-5" />
                            </div>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Careers;
