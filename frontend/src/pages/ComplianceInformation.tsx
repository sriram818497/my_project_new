import { useEffect } from "react";
import { motion } from "framer-motion";
import {
    Scale,
    ShieldCheck,
    FileText,
    Mail,
    Award,
    AlertCircle,
    Info,
    Search,
} from "lucide-react";

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
    >
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
            <div className="p-3 bg-[#1cd35c]/10 rounded-xl">
                <Icon className="w-6 h-6 text-[#1cd35c]" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">{title}</h2>
        </div>
        <div className="text-white/60 leading-relaxed space-y-6 font-medium text-base">
            {children}
        </div>
    </motion.section>
);

const ComplianceInformation = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="font-jakarta text-white relative bg-transparent min-h-screen pb-16">
            {/* Background Ambient Effects */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[5%] right-0 w-[600px] h-[600px] bg-[#1cd35c]/10 blur-[130px] rounded-full" />
                <div className="absolute bottom-[10%] left-0 w-[500px] h-[500px] bg-[#1cd35c]/5 blur-[100px] rounded-full" />
            </div>

            {/* 1️⃣ Hero Section */}
            <section className="relative pt-28 pb-12 md:pt-28 md:pb-16 overflow-hidden z-10">
                <div className="container px-4 mx-auto max-w-4xl relative z-10 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-block p-4 bg-[#1cd35c]/10 rounded-[2rem] mb-8 border border-[#1cd35c]/20 backdrop-blur-md"
                    >
                        <Scale className="w-10 h-10 text-[#1cd35c]" />
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white"
                    >
                        Compliance <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Information</span>
                    </motion.h1>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-center gap-4 text-white/40 text-xs font-bold uppercase tracking-widest"
                    >
                        <span>Effective: July 21, 2025</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Jurisdiction: Republic of India</span>
                    </motion.div>
                </div>
            </section>

            {/* 2️⃣ Content Container */}
            <main className="container px-4 mx-auto max-w-4xl relative z-10">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-2xl">

                    {/* Our Commitment to Legal Compliance */}
                    <Section icon={ShieldCheck} title="Our Commitment to Legal Compliance">
                        <p>
                            At Proteccio Data, we take our commitment to legal and regulatory compliance seriously, making it a core part of how we operate and what we stand for. This Compliance Information Statement highlights our dedication to key Indian laws and regulations, particularly those concerning <span className="text-[#1cd35c] font-bold">Intellectual Property Rights (IPR)</span> and <span className="text-[#1cd35c] font-bold">Labour and Employment Regulations</span>.
                        </p>
                        <p>
                            Our goal is to create a work environment that is transparent, ethical, and accountable, ensuring we meet all necessary legal requirements while promoting responsible business practices.
                        </p>
                    </Section>

                    {/* Copyright Compliance */}
                    <Section icon={FileText} title="Copyright Compliance">
                        <p>
                            Proteccio Data is committed to respecting the intellectual property rights
                            of all creators, developers, and content owners. We comply with the
                            Indian Copyright Act, 1957 and its amendments.
                        </p>

                        <div className="mt-12 space-y-8">
                            <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                <Award className="w-4 h-4 text-[#1cd35c]" />
                                Original Content Framework
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-colors text-center md:text-left">
                                    <h4 className="text-white font-black mb-2 text-xs uppercase tracking-wide">Exclusively Owned</h4>
                                    <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors leading-relaxed">
                                        Created by our internal teams or commissioned and protected under applicable copyright laws.
                                    </p>
                                </div>
                                <div className="p-6 bg-[#1cd35c]/5 border border-[#1cd35c]/20 rounded-2xl group hover:bg-[#1cd35c]/10 transition-colors text-center md:text-left">
                                    <h4 className="text-[#1cd35c] font-black mb-2 text-xs uppercase tracking-wide">Licensed Content</h4>
                                    <p className="text-xs text-[#1cd35c]/40 group-hover:text-[#1cd35c]/60 transition-colors leading-relaxed">
                                        Obtained from third-party providers with clear terms of use and rights.
                                    </p>
                                </div>
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-colors text-center md:text-left">
                                    <h4 className="text-white font-black mb-2 text-xs uppercase tracking-wide">Fair Dealing</h4>
                                    <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors leading-relaxed">
                                        Used under legal exceptions for commentary, criticism, research, or educational purposes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* Enforcement Policy */}
                    <Section icon={AlertCircle} title="Enforcement Policy">
                        <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl space-y-4">
                            <h4 className="text-red-400 font-black uppercase text-sm flex items-center gap-2 tracking-widest">
                                <AlertCircle className="w-4 h-4" />
                                Critical Restrictions
                            </h4>
                            <p className="text-sm text-white/60 font-medium">
                                Unauthorized use, duplication, distribution, or alteration of copyrighted
                                material is strictly prohibited and may result in legal action.
                            </p>
                            <ul className="space-y-3 pt-2">
                                {[
                                    "Monitoring and enforcement through internal and external tools",
                                    "Ensuring proper attribution and licensing",
                                    "Responding promptly to infringement notices"
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-3 items-center text-xs text-white/40 font-bold uppercase tracking-wide">
                                        <div className="w-1 h-1 rounded-full bg-red-400" />
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Section>

                    {/* Inquiries */}
                    <Section icon={Info} title="Copyright Inquiries">
                        <div className="bg-[#1cd35c]/5 border border-[#1cd35c]/10 p-8 rounded-3xl space-y-4">
                            <h4 className="text-[#1cd35c] font-black uppercase text-sm flex items-center gap-2 tracking-widest">
                                <Search className="w-4 h-4" />
                                Reports & Requests
                            </h4>
                            <p className="text-sm text-white/50">
                                If you believe any content infringes your copyright, or if you wish to
                                request permission for reuse, please contact our architectural governance team.
                            </p>
                            <div className="flex items-center gap-3 text-[#1cd35c] text-sm font-black">
                                <Mail className="w-4 h-4" />
                                compliance@protecciodata.com
                            </div>
                        </div>
                    </Section>

                    {/* Compliance Contact Information */}
                    <Section icon={Mail} title="Compliance Contact Information">
                        <p className="mb-8">
                            We encourage our employees, partners, vendors, and stakeholders to report any suspected violations or concerns regarding IPR or labor practices without hesitation. You can make reports confidentially and without fear of retaliation.
                        </p>

                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 mb-8">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8">
                                Compliance Office – Proteccio Data
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-2">
                                    <h4 className="text-[#1cd35c] font-black uppercase tracking-widest text-[10px]">Email</h4>
                                    <a href="mailto:contact@protecciodata.com" className="text-xl font-bold text-white hover:text-[#1cd35c] transition-colors">
                                        contact@protecciodata.com
                                    </a>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[#1cd35c] font-black uppercase tracking-widest text-[10px]">Location</h4>
                                    <p className="text-xl font-bold text-white">Hyderabad, India</p>
                                </div>
                            </div>

                            <p className="text-sm text-white/60 leading-relaxed font-medium pt-8 border-t border-white/10">
                                <span className="text-white font-black">Our Commitment:</span> We handle all compliance-related communications with the highest level of confidentiality and professionalism. Depending on the specifics of your concern, our team will investigate, respond, and take the necessary actions in accordance with our internal policies and legal requirements.
                            </p>
                        </div>
                    </Section>
                </div>

                {/* Footer Trace */}
                <div className="mt-20 text-center text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">
                    Proteccio Data • Next GEN Privacy Solutions
                </div>
            </main>
        </div>
    );
};

export default ComplianceInformation;
