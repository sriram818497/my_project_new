import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    Shield,
    CheckCircle,
    Info,
    Database,
    Target,
    Scale,
    Share2,
    Clock,
    Lock,
    RefreshCw,
    Mail,
    Globe,
    MapPin
} from "lucide-react";

const Section = ({ icon: Icon, title, summary, children }: { icon: React.ElementType, title: string, summary?: React.ReactNode, children: React.ReactNode }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isInteractive = !!summary;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseEnter={() => isInteractive && setIsHovered(true)}
            onMouseLeave={() => isInteractive && setIsHovered(false)}
            onFocus={() => isInteractive && setIsHovered(true)}
            onBlur={() => isInteractive && setIsHovered(false)}
            tabIndex={isInteractive ? 0 : undefined}
            className={`mb-16 transition-all duration-500 rounded-[2rem] ${isInteractive && isHovered ? 'bg-white/5 p-8 border border-white/20 shadow-2xl shadow-[#1cd35c]/5 -translate-y-1' : 'bg-transparent border border-transparent'
                }`}
        >
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                <div className={`p-3 rounded-xl transition-all duration-500 ${isInteractive && isHovered ? 'bg-[#1cd35c] text-black' : 'bg-[#1cd35c]/10 text-[#1cd35c]'
                    }`}>
                    <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">{title}</h2>
                {isInteractive && !isHovered && (
                    <div className="ml-auto flex gap-1.5 opacity-40">
                        {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#1cd35c]" />)}
                    </div>
                )}
            </div>
            <div className="text-white/60 leading-relaxed font-medium">
                {summary && <div className="mb-4">{summary}</div>}
                {isInteractive ? (
                    <motion.div
                        initial={false}
                        animate={{
                            height: isHovered ? "auto" : 0,
                            opacity: isHovered ? 1 : 0,
                            marginTop: isHovered ? 24 : 0
                        }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-4">
                            {children}
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {children}
                    </div>
                )}
            </div>
        </motion.section>
    );
};

const PrivacyNotice = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="font-jakarta text-white relative bg-transparent min-h-screen">
            {/* Background Ambient Effects - Kept for compatibility but transparent bg allows Layout.tsx to dominate */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1cd35c]/10 blur-[130px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1cd35c]/5 blur-[100px] rounded-full" />
            </div>

            {/* 1️⃣ Hero Section */}
            <section className="relative pt-28 pb-8 md:pt-28 overflow-hidden z-10">
                <div className="container px-4 mx-auto max-w-5xl relative z-10 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-block p-4 bg-[#1cd35c]/10 rounded-[2rem] mb-8 border border-[#1cd35c]/20 backdrop-blur-md"
                    >
                        <ShieldCheck className="w-10 h-10 text-[#1cd35c]" />
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white"
                    >
                        Privacy <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Notice</span>
                    </motion.h1>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <p className="text-lg font-medium text-white/60 max-w-2xl mx-auto leading-relaxed">
                            How we collect, use, and protect your personal data in accordance with data protection laws.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/40 text-[10px] font-black uppercase tracking-widest">
                                Version 1.0.1
                            </span>
                            <span className="px-4 py-1.5 bg-[#1cd35c]/10 border border-[#1cd35c]/20 rounded-full text-[#1cd35c] text-[10px] font-black uppercase tracking-widest">
                                Last Updated: January 23, 2026
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2️⃣ Content Container */}
            <div className="container px-4 mx-auto max-w-5xl pt-4 pb-12 relative z-10">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-2xl">
                    <Section
                        icon={Info}
                        title="1. About Us"
                        summary={
                            <p className="text-white/70 font-medium">
                                Proteccio Data is a privacy-first tech company based in Hyderabad, India, on a mission to empower individuals and organizations to take charge of their data. We focus on delivering innovative data protection solutions, compliance automation, and privacy governance tools.
                            </p>
                        }
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🏢</span>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Our Mission</h3>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed font-medium">
                                    Help businesses stay in line with changing data protection regulations, including the Digital Personal Data Protection Act, 2023 (DPDPA).
                                </p>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">⚖️</span>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Legal Status</h3>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed font-medium">
                                    Registered Data Fiduciary under the DPDPA, legally and ethically bound to handle personal data lawfully, fairly, transparently, and securely.
                                </p>
                            </div>
                        </div>
                        <p className="mb-6 text-white/60 leading-relaxed font-medium">
                            Our range of services is crafted to assist organizations in meeting their responsibilities as Data Fiduciaries and ensuring that the rights of Data Principals are honored throughout the data lifecycle.
                        </p>
                        <div className="p-6 bg-[#1cd35c]/5 border border-[#1cd35c]/10 rounded-2xl">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">🎯</span>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Our Commitment</h3>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed font-medium italic">
                                With a solid background in privacy engineering, legal compliance, and user-focused design, Proteccio Data is dedicated to closing the gap between what regulations expect and how businesses can implement them. This way, companies can innovate responsibly while also fostering trust with their stakeholders.
                            </p>
                        </div>
                    </Section>

                    <Section icon={Database} title="2. What Data We Collect">
                        <p className="mb-8">
                            At Proteccio Data, we gather personal information to enhance and tailor your experience with our website and services. We're committed to collecting only the data that's necessary for legitimate business needs, all in line with the Digital Personal Data Protection Act, 2023 (DPDPA).
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* PII Card */}
                            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Personally Identifiable Information (PII)</h3>
                                    <p className="text-sm text-white/40 font-medium">Information you provide directly through forms and interactions</p>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[#1cd35c] text-xs font-black uppercase tracking-widest">Data we collect:</p>
                                    <ul className="space-y-2">
                                        {[
                                            "First Name & Last Name",
                                            "Business Email Address",
                                            "Company Name",
                                            "Phone Number",
                                            "Contact Form Details"
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex gap-3 items-center text-sm text-white/60">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#1cd35c]" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Technical Card */}
                            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Technical and Usage Information</h3>
                                    <p className="text-sm text-white/40 font-medium">Automatically collected data to improve your experience</p>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[#1cd35c] text-xs font-black uppercase tracking-widest">Data we collect:</p>
                                    <ul className="space-y-2">
                                        {[
                                            "Country and City (from IP address)",
                                            "Browser Type and Version",
                                            "Device and Operating System",
                                            "Time spent on site",
                                            "Page interactions and navigation"
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex gap-3 items-center text-sm text-white/60">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#1cd35c]" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-[#1cd35c]/5 border border-[#1cd35c]/10 rounded-2xl">
                            <p className="text-sm text-white/60 italic leading-relaxed">
                                <span className="text-[#1cd35c] font-black uppercase tracking-widest mr-2">Data Minimization:</span>
                                We make sure to aggregate and anonymize technical data whenever possible, using it solely to enhance your experience, monitor website performance, and customize our content based on your interests and location.
                            </p>
                        </div>
                    </Section>

                    <Section
                        icon={Target}
                        title="3. Purpose of Data Collection"
                        summary={
                            <p>
                                At Proteccio Data, we're committed to collecting and processing your personal data in a way that's fair, transparent, and focused on specific purposes. We follow the guidelines set out in the Digital Personal Data Protection Act, 2023 (DPDPA).
                            </p>
                        }
                    >
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                {
                                    emoji: "💬",
                                    title: "Communication & Support",
                                    text: "Connect with you, set up product demonstrations, and address questions about our services. Customize communication to better suit your needs and organization type."
                                },
                                {
                                    emoji: "📊",
                                    title: "Website Performance & Analytics",
                                    text: "Monitor user interactions, spot usage trends, and enhance overall user experience including page load times, navigation, and cross-device compatibility."
                                },
                                {
                                    emoji: "⚖️",
                                    title: "Legal & Regulatory Compliance",
                                    text: "Meet our responsibilities as a Data Fiduciary, protect personal data, keep records of data processing, and uphold the rights of data subjects under DPDPA."
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{item.emoji}</span>
                                        <h3 className="text-lg font-black text-white uppercase tracking-tight">{item.title}</h3>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed font-medium">
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section icon={Scale} title="4. Legal Basis for Processing">
                        <p className="mb-8">
                            At Proteccio Data, we take your privacy seriously and handle personal data in strict accordance with the Digital Personal Data Protection Act, 2023 (DPDPA). We clearly define the legal grounds for processing your personal data:
                        </p>

                        <div className="space-y-6">
                            {/* Consent Block */}
                            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#1cd35c]/10 flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-[#1cd35c]" />
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Consent</h3>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed font-medium">
                                    When you share personal data through forms like "Book a Demo" or "Contact Us," we obtain your explicit and informed consent. This consent is voluntary and specific to outlined purposes.
                                </p>
                                <div className="pt-2 border-t border-white/5">
                                    <p className="text-sm text-white/40 italic">
                                        <span className="text-[#1cd35c] font-bold mr-2">Your Control:</span>
                                        You're in complete control of your consent preferences and can withdraw consent at any time.
                                    </p>
                                </div>
                            </div>

                            {/* Legitimate Interests Block */}
                            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#1cd35c]/10 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-[#1cd35c]" />
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Legitimate Interests</h3>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed font-medium">
                                    We process technical and usage data (browser type, location, device info) to serve legitimate interests like improving website performance, enhancing user experience, preventing fraud, and maintaining security.
                                </p>
                                <div className="pt-2 border-t border-white/5">
                                    <p className="text-sm text-white/40 italic">
                                        <span className="text-[#1cd35c] font-bold mr-2">Balanced Approach:</span>
                                        We always weigh these interests against your privacy rights with appropriate safeguards.
                                    </p>
                                </div>
                            </div>

                            {/* Legal Compliance Block */}
                            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#1cd35c]/10 flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-[#1cd35c]" />
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Legal Compliance</h3>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed font-medium">
                                    Sometimes we process or retain data to meet legal or regulatory requirements, including DPDPA obligations. This may involve maintaining logs, responding to government inquiries, or keeping records for auditing purposes.
                                </p>
                            </div>
                        </div>
                    </Section>

                    <Section
                        icon={Share2}
                        title="5. Data Sharing and Disclosure"
                        summary={
                            <div className="space-y-4">
                                <div className="mb-4 p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-4">
                                    <span className="text-3xl">🚫</span>
                                    <p className="text-white font-bold leading-relaxed">
                                        We do <span className="text-red-400 underline decoration-2 underline-offset-4">NOT</span> sell or rent your personal data to anyone outside our organization.
                                    </p>
                                </div>

                                <p>
                                    At Proteccio Data, we take your privacy seriously. We make sure that any sharing of your personal information is handled in a careful, clear, and lawful way. Here are the specific situations where we might share your data:
                                </p>
                            </div>
                        }
                    >
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                {
                                    emoji: "🏢",
                                    title: "Internal Teams",
                                    text: "Customer support, sales, legal, and IT teams may access your data on a need-to-know basis with strict internal controls and role-based permissions."
                                },
                                {
                                    emoji: "🤝",
                                    title: "Trusted Service Providers",
                                    text: "Third-party vendors (like Google Analytics, hosting providers) help deliver our services. They're bound by confidentiality agreements and data protection contracts."
                                },
                                {
                                    emoji: "⚖️",
                                    title: "Legal Requirements",
                                    text: "When legally required, we may share data with public authorities, law enforcement, or regulatory bodies. Such disclosures are well-documented and accountable."
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{item.emoji}</span>
                                        <h3 className="text-lg font-black text-white uppercase tracking-tight">{item.title}</h3>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed font-medium">
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section
                        icon={Clock}
                        title="6. Data Retention"
                        summary={
                            <p>
                                We only keep your personal data for as long as we need it to achieve the specific goals for which it was collected, or to meet any legal, regulatory, or operational obligations. Our approach aligns with data minimization and storage limitation principles under DPDPA.
                            </p>
                        }
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📝</span>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Form Submissions</h3>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed font-medium">
                                    Personal data from "Book a Demo" or "Contact Us" forms is kept for up to 24 months. This allows us to respond to questions, track communication, and follow up on service-related issues.
                                </p>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📊</span>
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Analytics Data</h3>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed font-medium">
                                    Usage data through analytics tools is kept for 14 to 26 months per Google's policies. This aggregated data helps assess website performance and understand user engagement trends.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-[#1cd35c]/5 border border-[#1cd35c]/10 rounded-2xl">
                            <p className="text-sm text-white/60 italic leading-relaxed">
                                <span className="text-[#1cd35c] font-black uppercase tracking-widest mr-2">Automatic Deletion:</span>
                                If we don't hear from you during the retention period, we'll securely delete or anonymize your data automatically.
                            </p>
                        </div>
                    </Section>

                    <Section icon={ShieldCheck} title="7. Your Rights Under DPDPA">
                        <p className="mb-8">
                            Under the Digital Personal Data Protection Act, 2023 (DPDPA), you're recognized as a Data Principal, which means you have important rights regarding your personal data. At Proteccio Data, we're dedicated to respecting these rights and making it easy for you to exercise them.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {[
                                { title: "Access Your Personal Data", text: "Request details about the personal data we have on you, including what types of data we hold and why we're processing it." },
                                { title: "Correct or Update Data", text: "Request corrections or updates if any personal data we have about you is wrong, outdated, or incomplete." },
                                { title: "Withdraw Consent", text: "Take back your consent at any time for data processing based on consent, such as form submissions." },
                                { title: "Request Data Deletion", text: "Ask us to delete your personal data when it's no longer needed or if you withdraw your consent." },
                                { title: "File a Grievance", text: "Submit a complaint to our Data Protection Officer if you're concerned about how your data is being managed." }
                            ].map((right, idx) => (
                                <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                                    <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#1cd35c]" />
                                        {right.title}
                                    </h3>
                                    <p className="text-xs text-white/50 leading-relaxed font-medium">
                                        {right.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-[#1cd35c]/10 border border-[#1cd35c]/20 rounded-3xl space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📧</span>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">How to Exercise Your Rights</h3>
                            </div>
                            <p className="text-sm text-white/70 leading-relaxed font-medium">
                                To exercise any of these rights, please reach out to our Data Protection Officer (DPO). We might need to confirm your identity before processing your request to ensure your data stays safe from unauthorized access.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <a
                                    href="mailto:Grievance@protecciodata.com"
                                    className="flex items-center justify-center gap-3 px-6 py-3 bg-[#1cd35c] text-black font-black rounded-xl hover:bg-[#19b850] transition-colors text-xs uppercase tracking-widest"
                                >
                                    <Mail className="w-4 h-4" />
                                    Grievance@protecciodata.com
                                </a>
                                <Link
                                    to="/rights-management"
                                    className="flex items-center justify-center gap-3 px-6 py-3 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 transition-colors text-xs uppercase tracking-widest"
                                >
                                    Exercise Your Rights Online
                                </Link>
                            </div>
                        </div>
                    </Section>

                    <Section icon={Lock} title="8. Data Security">
                        <p className="mb-6">
                            At Proteccio Data, we take the protection of your personal data very seriously. Our top priority is to create a strong and multi-layered security system that keeps your information safe from unauthorized access, changes, sharing, or destruction.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {[
                                { emoji: "🔒", title: "SSL Encryption", text: "All data transmitted between your browser and our website is protected with Secure Socket Layer encryption." },
                                { emoji: "🔑", title: "Access Controls", text: "Role-based access controls ensure only authorized personnel can access your data, following the principle of least privilege." },
                                { emoji: "🛡️", title: "Regular Audits", text: "Our systems undergo regular security audits, vulnerability assessments, and continuous monitoring." },
                                { emoji: "🏢", title: "Secure Storage", text: "Data is stored in secure environments with controlled access, and sensitive information is encrypted at rest." }
                            ].map((item, idx) => (
                                <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{item.emoji}</span>
                                        <h3 className="text-lg font-black text-white uppercase tracking-tight">{item.title}</h3>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed font-medium">
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6 mb-8">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🛡️</span>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Our Security Commitment</h3>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    { label: "Privacy-by-Design", text: "Our team follows secure development practices from the ground up" },
                                    { label: "Continuous Monitoring", text: "Regular assessment and updating of security protocols" },
                                    { label: "Incident Response", text: "Solid response plan to quickly tackle potential data breaches" },
                                    { label: "Compliance", text: "Adherence to DPDPA requirements and international security standards" }
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1cd35c] shrink-0" />
                                        <p className="text-sm text-white/60 leading-relaxed font-medium">
                                            <span className="text-white font-bold mr-2">{item.label}</span>
                                            {item.text}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                            <p className="text-sm text-white/60 italic leading-relaxed">
                                <span className="text-red-400 font-black uppercase tracking-widest mr-2">Important:</span>
                                While we maintain top-notch security, no system is completely risk-free. We recommend taking your own precautions, like avoiding sharing sensitive information through unsecured channels.
                            </p>
                        </div>
                    </Section>

                    <Section
                        icon={Globe}
                        title="9. International Data Transfers"
                        summary={
                            <p>
                                While most of our operations and data processing happen in India, there are times when your data might be transferred to, stored in, or accessed from other countries—especially when working with global service providers or cloud systems.
                            </p>
                        }
                    >
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                {
                                    emoji: "🛡️",
                                    title: "Adequate Safeguards",
                                    text: "We evaluate data protection levels in destination countries and ensure necessary safeguards through contractual clauses, binding corporate rules, or officially recognized countries."
                                },
                                {
                                    emoji: "📋",
                                    title: "Contractual Obligations",
                                    text: "We establish Data Processing Agreements (DPAs) and Standard Contractual Clauses (SCCs) with third-party processors to guarantee data protection outside India."
                                },
                                {
                                    emoji: "⚖️",
                                    title: "Legal Compliance",
                                    text: "All transfers comply with DPDPA and international standards like GDPR, ensuring your rights as a Data Principal are upheld globally."
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{item.emoji}</span>
                                        <h3 className="text-lg font-black text-white uppercase tracking-tight">{item.title}</h3>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed font-medium">
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section
                        icon={RefreshCw}
                        title="10. Updates to This Notice"
                        summary={
                            <p>
                                At Proteccio Data, we're all about being open and honest about how we manage your personal information. As laws, regulations, technology, and our business practices change, we might need to update this Privacy Notice.
                            </p>
                        }
                    >
                        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6 mb-8">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                <span className="text-2xl">🔄</span>
                                When we make updates:
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "Update the effective date at the top of this notice",
                                    "Post the updated Privacy Notice on this webpage for transparency",
                                    "Send additional notifications for significant changes requiring consent"
                                ].map((step, idx) => (
                                    <li key={idx} className="flex gap-4 items-start">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1cd35c] shrink-0" />
                                        <p className="text-sm text-white/60 leading-relaxed font-medium">{step}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-6 bg-[#1cd35c]/5 border border-[#1cd35c]/10 rounded-2xl">
                            <p className="text-sm text-white/60 italic leading-relaxed">
                                <span className="text-[#1cd35c] font-black uppercase tracking-widest mr-2">Stay Informed:</span>
                                We encourage you to check this Privacy Notice regularly. By continuing to use our website or services after updates, you're accepting the revised terms.
                            </p>
                        </div>
                    </Section>

                    <Section icon={Mail} title="11. Contact Us">
                        <p className="mb-8">
                            We truly appreciate your trust and are here to help with any questions, concerns, or requests you might have about your personal data and privacy. If you'd like to exercise your rights under the Digital Personal Data Protection Act, 2023 (DPDPA), our dedicated Data Protection Officer (DPO) is ready to assist you.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#1cd35c]/10 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-[#1cd35c]" />
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Email</h3>
                                </div>
                                <a href="mailto:privacy@protecciodata.com" className="text-lg font-medium text-white hover:text-[#1cd35c] transition-colors">
                                    privacy@protecciodata.com
                                </a>
                            </div>

                            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#1cd35c]/10 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-[#1cd35c]" />
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Location</h3>
                                </div>
                                <p className="text-sm font-medium text-white leading-relaxed">
                                    1-1-17/C, Jawahar Nagar,<br />
                                    Near RTC X road,<br />
                                    Hyderabad, Telangana,<br />
                                    India
                                </p>
                            </div>
                        </div>

                        <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-3xl space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl text-red-500">⚠️</span>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">For urgent matters</h3>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed font-medium">
                                Please include <span className="text-red-400 font-bold">"Privacy Concern – Urgent"</span> in your email subject line so we can prioritize your request. We strive to respond to all privacy-related inquiries quickly and will guide you through exercising your rights.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <a
                                href="mailto:privacy@protecciodata.com"
                                className="flex items-center justify-center gap-3 px-8 py-4 bg-[#1cd35c] text-black font-black rounded-xl hover:bg-[#19b850] transition-all transform hover:-translate-y-1 shadow-xl shadow-[#1cd35c]/10 uppercase text-xs tracking-widest"
                            >
                                <Mail className="w-4 h-4" />
                                Contact Our DPO
                            </a>
                            <Link
                                to="/rights-management"
                                className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 transition-all transform hover:-translate-y-1 uppercase text-xs tracking-widest"
                            >
                                Exercise Your Rights
                            </Link>
                        </div>
                    </Section>


                </div>

                {/* Footer Note */}
                <div className="mt-20 text-center text-white/20 text-xs font-bold uppercase tracking-[0.3em]">
                    <p>Proteccio Data • Next GEN Privacy Solutions</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyNotice;
