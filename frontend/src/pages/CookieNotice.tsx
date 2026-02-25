import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Cookie,
    ShieldCheck,
    Info,
    Database,
    Target,
    Activity,
    Search,
    Globe,
    RefreshCw,
    Mail,
    ArrowRight
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
                <h2 className="text-2xl font-black text-white tracking-tight uppercase title-font">{title}</h2>
                {isInteractive && !isHovered && (
                    <div className="ml-auto flex gap-1.5 opacity-40">
                        {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#1cd35c]" />)}
                    </div>
                )}
            </div>
            <div className="text-white/60 leading-relaxed font-medium text-base">
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

const CookieNotice = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="font-jakarta text-white relative bg-transparent min-h-screen pb-16">
            {/* Background Ambient Effects */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-5%] w-[600px] h-[600px] bg-[#1cd35c]/10 blur-[130px] rounded-full" />
                <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] bg-[#1cd35c]/5 blur-[100px] rounded-full" />
            </div>

            {/* 1️⃣ Hero Section */}
            <section className="relative pt-28 pb-12 md:pt-28 md:pb-16 overflow-hidden z-10">
                <div className="container px-4 mx-auto max-w-5xl relative z-10 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-block p-4 bg-[#1cd35c]/10 rounded-[2rem] mb-8 border border-[#1cd35c]/20 backdrop-blur-md"
                    >
                        <Cookie className="w-10 h-10 text-[#1cd35c]" />
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white"
                    >
                        Cookie <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Notice</span>
                    </motion.h1>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-center gap-4 text-white/40 text-xs font-bold uppercase tracking-widest"
                    >
                        <span>Effective Date: March 21, 2025</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Last Updated: July 21, 2025</span>
                    </motion.div>
                </div>
            </section>

            {/* 2️⃣ Content Container */}
            <main className="container px-4 mx-auto max-w-5xl relative z-10">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 shadow-2xl">

                    {/* Commitment */}
                    <Section icon={ShieldCheck} title="Our Commitment to Your Privacy">
                        <div className="space-y-4">
                            <p>
                                At Proteccio Data, we truly care about your privacy and are dedicated to making sure your personal information is treated with the utmost responsibility and transparency. This Cookie Notice is here to explain how and why we use cookies and similar tracking technologies on our website (www.protecciodata.com).
                            </p>
                            <p>
                                We'll cover the different types of cookies we use, what information they gather, and how you can take control of your cookie preferences. Cookies are vital for us to deliver a secure, personalized, and optimized experience for you.
                            </p>
                            <p>
                                This Notice aligns with the key principles of the Digital Personal Data Protection Act, 2023 (DPDPA), especially those concerning purpose limitation, data minimization, user consent, and transparency. By continuing to browse our website, you're acknowledging and agreeing to our use of cookies as outlined in this notice.
                            </p>
                        </div>
                    </Section>

                    {/* 1. What Are Cookies? */}
                    <Section
                        icon={Info}
                        title="1. What Are Cookies?"
                        summary={
                            <p>
                                Cookies are small text files placed on your device to help websites function properly, personalized your experience, and provide us with analytics on how the site is being used.
                            </p>
                        }
                    >
                        <div className="space-y-4 mb-8">
                            <p>
                                Cookies are those tiny text files that websites save on your device—whether it's your computer, smartphone, or tablet—when you visit them. They hold little bits of information, like a unique identifier, which helps the website recognize your browser.
                            </p>
                            <p>
                                This way, it can remember your actions and preferences, such as your language settings, login details, or region, ultimately making your browsing experience smoother and more enjoyable.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: "Website Functionality", desc: "Allowing the site to remember your preferences and settings." },
                                { title: "Performance & Analytics", desc: "Helping us analyze site traffic to improve user experience." },
                                { title: "Personalization", desc: "Providing tailored content based on your interactions." }
                            ].map((item, idx) => (
                                <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                    <h4 className="text-white font-bold text-sm mb-2">{item.title}</h4>
                                    <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="p-6 bg-[#1cd35c]/5 border border-[#1cd35c]/10 rounded-2xl">
                                <h4 className="text-[#1cd35c] font-black uppercase tracking-widest text-[10px] mb-3">First-party Cookies</h4>
                                <p className="text-white/50 text-xs leading-relaxed">Set directly by Proteccio Data during your visit.</p>
                            </div>
                            <div className="p-6 bg-[#1cd35c]/5 border border-[#1cd35c]/10 rounded-2xl">
                                <h4 className="text-[#1cd35c] font-black uppercase tracking-widest text-[10px] mb-3">Third-party Cookies</h4>
                                <p className="text-white/50 text-xs leading-relaxed">Placed by external services we use for analytics or security.</p>
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl mt-6">
                            <p className="text-xs text-white/50 leading-relaxed italic">
                                <span className="text-white font-black uppercase tracking-widest mr-2 text-[10px]">Important:</span>
                                Cookies do not give us access to your computer or any information about you, other than the data you choose to share with us. We are committed to using cookies in a way that respects your privacy and transparency.
                            </p>
                        </div>
                    </Section>

                    {/* 2. Why We Use Cookies */}
                    <Section
                        icon={Target}
                        title="2. Why We Use Cookies"
                        summary={
                            <p>
                                At Proteccio Data, we utilize cookies and similar tracking technologies to enhance your experience on our website. These tools help us ensure that everything runs smoothly and securely while providing you with a personalized, seamless, and responsive user experience.
                            </p>
                        }
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    icon: "🔒",
                                    title: "Keeping the Website Secure and Efficient",
                                    desc: "Essential cookies are crucial for loading pages quickly, preventing fraud, managing session states, and ensuring that important website functions work reliably.",
                                    color: "red"
                                },
                                {
                                    icon: "📊",
                                    title: "Understanding Visitor Behavior",
                                    desc: "Analytical cookies help us see how visitors engage with our site—like which pages are most popular, bounce rates, and time spent in different sections so we can keep improving.",
                                    color: "blue"
                                },
                                {
                                    icon: "💬",
                                    title: "Supporting Communication",
                                    desc: "Functional cookies enable real-time engagement tools like live chat and contact forms, ensuring that your interactions are smooth and responsive.",
                                    color: "green"
                                },
                                {
                                    icon: "⚖️",
                                    title: "Meeting Legal and Regulatory Requirements",
                                    desc: "Some cookies assist us in adhering to regulatory obligations by recording your cookie consent preferences and protecting the website from unauthorized access.",
                                    color: "purple"
                                }
                            ].map((item, idx) => {
                                const colorMap: Record<string, string> = {
                                    red: "from-red-500/20 to-transparent border-red-500/20 text-red-400",
                                    blue: "from-[#1cd35c]/20 to-transparent border-[#1cd35c]/20 text-[#1cd35c]",
                                    green: "from-[#1cd35c]/20 to-transparent border-[#1cd35c]/20 text-[#1cd35c]",
                                    purple: "from-[#1cd35c]/20 to-transparent border-[#1cd35c]/20 text-[#1cd35c]"
                                };
                                return (
                                    <div key={idx} className={`p-6 bg-gradient-to-br ${colorMap[item.color]} border rounded-3xl space-y-3`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{item.icon}</span>
                                            <h4 className="text-white font-black uppercase tracking-tight text-sm leading-tight">{item.title}</h4>
                                        </div>
                                        <p className="text-white/50 text-xs leading-relaxed font-medium">
                                            {item.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </Section>

                    {/* 3. Categories of Cookies Used */}
                    <Section icon={Activity} title="3. Categories of Cookies Used">
                        <p className="mb-8">
                            Our website uses cookies to enhance your browsing experience, ensure optimal functionality, and provide us with valuable insights into how users interact with our content. Below are the categories of cookies we use, along with their specific purposes:
                        </p>

                        <div className="space-y-6">
                            {[
                                {
                                    title: "Necessary Cookies",
                                    summary: "Essential for basic website functionality, security, and navigation.",
                                    details: "These cookies enable functions such as page navigation, access to secure areas, load balancing, session authentication, and protection against malicious activity (e.g., CSRF protection). They cannot be disabled as they are required for the website to function.",
                                    color: "red"
                                },
                                {
                                    title: "Analytics Cookies",
                                    summary: "Help us understand how users interact with our website through aggregated data.",
                                    details: "These cookies allow us to monitor website traffic and usage patterns, identify popular pages and features, improve site content and navigation based on user behavior, and evaluate performance and user engagement. We use tools like Google Analytics, and the data collected is not used to personally identify users.",
                                    color: "blue"
                                },
                                {
                                    title: "Functional Cookies",
                                    summary: "Enable enhanced features and personalization for a better user experience.",
                                    details: "These cookies remember your language or regional preferences, login details for easy access, layout or feature choices (like dark mode or chat support), and interactions with embedded services like live chat, forms, or surveys.",
                                    color: "green"
                                },
                                {
                                    title: "Other Cookies",
                                    summary: "Specialized cookies for third-party integrations and performance monitoring.",
                                    details: "This includes cookies that keep user sessions anonymous across different page views, support API integrations or third-party tools, help with performance monitoring tools or bug trackers, and cookies from embedded content like video players or social media widgets.",
                                    color: "purple"
                                }
                            ].map((cat, idx) => (
                                <CategorySubSection key={idx} {...cat} />
                            ))}
                        </div>
                    </Section>

                    {/* 4. Detailed Cookie Inventory */}
                    <Section
                        icon={Database}
                        title="4. Detailed Cookie Inventory"
                        summary={
                            <p>
                                Below, you'll find a detailed list of the 22 cookies we currently have in use, categorized by their purpose and type.
                            </p>
                        }
                    >
                        <div className="rounded-3xl border border-white/10 bg-black/20 overflow-hidden">
                            <table className="w-full text-left text-[11px] md:text-xs">
                                <thead className="bg-white/5 text-[#1cd35c] font-black uppercase tracking-widest text-[9px]">
                                    <tr>
                                        <th className="px-4 py-4">Cookie</th>
                                        <th className="px-4 py-4">Domain</th>
                                        <th className="px-4 py-4">Description</th>
                                        <th className="px-4 py-4">Duration</th>
                                        <th className="px-4 py-4">Category</th>
                                        <th className="px-4 py-4">Type</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 font-medium text-white/60">
                                    {[
                                        { cookie: "_cfbm", domain: "Cloudflare domains", desc: "Used by Cloudflare for bot management and web security", duration: "1 hour", cat: "Necessary", type: "Third-party" },
                                        { cookie: "_cfuvid", domain: "hubspot.com, hsforms.com", desc: "Supports session identification and protects against abuse", duration: "Session", cat: "Necessary", type: "Third-party" },
                                        { cookie: "_ga", domain: "protecciodata.com", desc: "Google Analytics cookie to distinguish unique users", duration: "1 year 1 month 4 days", cat: "Analytics", type: "First-party" },
                                        { cookie: "_ga_KWKSGLHXEY", domain: "protecciodata.com", desc: "Google Analytics cookie to persist session state", duration: "1 year 1 month 4 days", cat: "Analytics", type: "First-party" },
                                        { cookie: "tcclvisitor", domain: "protecciodata.com", desc: "GoDaddy analytics cookie to log first-time visitors", duration: "1 year", cat: "Analytics", type: "First-party" },
                                        { cookie: "tcclvisit", domain: "protecciodata.com", desc: "GoDaddy analytics cookie to track current session", duration: "Session", cat: "Analytics", type: "First-party" },
                                        { cookie: "__hstc", domain: "protecciodata.com", desc: "HubSpot's primary tracking cookie for visitors", duration: "6 months", cat: "Analytics", type: "First-party" },
                                        { cookie: "hubspotutk", domain: "protecciodata.com", desc: "Used by HubSpot to keep track of a visitor's identity", duration: "6 months", cat: "Analytics", type: "First-party" },
                                        { cookie: "__hssrc", domain: "protecciodata.com", desc: "Determines if the visitor has restarted the browser", duration: "Session", cat: "Necessary", type: "First-party" },
                                        { cookie: "__hssc", domain: "protecciodata.com", desc: "Keeps track of sessions and timestamps for HubSpot analytics", duration: "1 hour", cat: "Necessary", type: "First-party" },
                                        { cookie: "messagesUtk", domain: "protecciodata.com", desc: "Identifies visitors using the HubSpot live chat tool", duration: "6 months", cat: "Functional", type: "First-party" },
                                        { cookie: "sccsession", domain: "protecciodata.com", desc: "Maintains temporary, anonymized user session data", duration: "20 minutes", cat: "Other", type: "First-party" },
                                        { cookie: "__cf_bm", domain: "hubspot.com", desc: "Cloudflare cookie to distinguish between humans and bots", duration: "30 minutes", cat: "Necessary", type: "Third-party" },
                                        { cookie: "_hjSessionUser_*", domain: "protecciodata.com", desc: "Hotjar cookie for identifying users across sessions", duration: "1 year", cat: "Analytics", type: "First-party" },
                                        { cookie: "_hjSession_*", domain: "protecciodata.com", desc: "Hotjar session cookie to ensure requests are linked to a single session", duration: "30 minutes", cat: "Analytics", type: "First-party" },
                                        { cookie: "_hjIncludedInPageviewSample", domain: "protecciodata.com", desc: "Determines if a user is included in data sampling by Hotjar", duration: "2 minutes", cat: "Analytics", type: "First-party" },
                                        { cookie: "_hjIncludedInSessionSample", domain: "protecciodata.com", desc: "Determines if a visitor is included in the current session sample", duration: "2 minutes", cat: "Analytics", type: "First-party" },
                                        { cookie: "_hjAbsoluteSessionInProgress", domain: "protecciodata.com", desc: "Detects the first pageview session of a user", duration: "30 minutes", cat: "Analytics", type: "First-party" },
                                        { cookie: "_hjFirstSeen", domain: "protecciodata.com", desc: "Identifies a new user's first session", duration: "Session", cat: "Analytics", type: "First-party" },
                                        { cookie: "_hjTLDTest", domain: "protecciodata.com", desc: "Determines the most generic cookie path so cookies can be shared across subdomains", duration: "Session", cat: "Analytics", type: "First-party" },
                                        { cookie: "_hjRecordingEnabled", domain: "protecciodata.com", desc: "Hotjar session recording flag set in user browser", duration: "Session", cat: "Other", type: "First-party" },
                                        { cookie: "_hjRecordingLastActivity", domain: "protecciodata.com", desc: "Records last activity during session recording", duration: "Session", cat: "Other", type: "First-party" },
                                    ].map((c, i) => {
                                        const catColor: Record<string, string> = {
                                            Necessary: "bg-red-500/20 text-red-400",
                                            Analytics: "bg-[#1cd35c]/20 text-[#1cd35c]",
                                            Functional: "bg-[#1cd35c]/20 text-[#1cd35c]",
                                            Other: "bg-[#1cd35c]/20 text-[#1cd35c]"
                                        };
                                        return (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-4 text-white font-bold whitespace-nowrap">{c.cookie}</td>
                                                <td className="px-4 py-4 italic">{c.domain}</td>
                                                <td className="px-4 py-4 leading-normal">{c.desc}</td>
                                                <td className="px-4 py-4">{c.duration}</td>
                                                <td className="px-4 py-4"><span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${catColor[c.cat]}`}>{c.cat}</span></td>
                                                <td className="px-4 py-4">{c.type}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Section>

                    {/* 5. Managing Your Preferences */}
                    <Section icon={Search} title="5. Managing Your Cookie Preferences">
                        <p className="mb-8">
                            At Proteccio Data, we're all about giving you clear choices and control over how your personal data is handled, including the use of cookies and similar tracking technologies. You have several options to manage and control your cookie preferences:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="p-8 bg-[#1cd35c]/5 border border-[#1cd35c]/10 rounded-[2rem] space-y-6">
                                <h4 className="text-[#1cd35c] font-black uppercase tracking-widest text-xs flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Browser Settings
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                        "See the cookies stored on your device",
                                        "Delete individual cookies or wipe them all out",
                                        "Block cookies from specific websites",
                                        "Turn off all cookies completely"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-3 items-start">
                                            <div className="mt-1.5 w-1 h-1 rounded-full bg-[#1cd35c] shrink-0" />
                                            <p className="text-sm text-white/60 leading-relaxed font-medium">{item}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-8 bg-[#1cd35c]/5 border border-[#1cd35c]/10 rounded-[2rem] space-y-6">
                                <h4 className="text-[#1cd35c] font-black uppercase tracking-widest text-xs flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    Website Cookie Settings
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                        "Accept or reject non-essential cookies",
                                        "Tailor preferences by cookie category",
                                        "Change or withdraw consent anytime",
                                        "Access through our cookie settings page"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-3 items-start">
                                            <div className="mt-1.5 w-1 h-1 rounded-full bg-[#1cd35c] shrink-0" />
                                            <p className="text-sm text-white/60 leading-relaxed font-medium">{item}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <p className="text-sm text-white/40 italic leading-relaxed">
                                <span className="text-white font-black uppercase tracking-widest mr-2 text-[10px]">Note:</span>
                                Strictly necessary cookies, which are crucial for the core functionality of the website (like security, session management, and accessibility features), may still be active even if you decide to disable optional cookies.
                            </p>
                        </div>
                    </Section>

                    {/* 6. Legal Basis and Consent */}
                    <Section icon={Globe} title="6. Legal Basis and Consent">
                        <p className="mb-8">
                            In line with the Digital Personal Data Protection Act, 2023 (DPDPA), Proteccio Data is committed to ensuring that all cookie-related data processing is done in a lawful and transparent manner.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-[#1cd35c]/5 border border-[#1cd35c]/10 rounded-[2rem] space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">✅</span>
                                    <h4 className="text-white font-black uppercase tracking-tight text-sm">Consent</h4>
                                </div>
                                <p className="text-[#1cd35c] text-[10px] font-black uppercase tracking-widest leading-none">Analytics and Functional Cookies</p>
                                <p className="text-white/50 text-xs leading-relaxed font-medium">
                                    We need your explicit consent before placing any non-essential cookies. You have complete control over these cookies and can choose to accept or reject them when prompted.
                                </p>
                            </div>
                            <div className="p-8 bg-[#1cd35c]/5 border border-[#1cd35c]/10 rounded-[2rem] space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">⚖️</span>
                                    <h4 className="text-white font-black uppercase tracking-tight text-sm">Legitimate Interest</h4>
                                </div>
                                <p className="text-[#1cd35c] text-[10px] font-black uppercase tracking-widest leading-none">Strictly Necessary Cookies</p>
                                <p className="text-white/50 text-xs leading-relaxed font-medium">
                                    Some cookies are crucial for basic functioning, security, and performance. These are processed based on legitimate interest and don't require consent.
                                </p>
                            </div>
                        </div>
                    </Section>

                    {/* 7. Updates to This Notice */}
                    <Section icon={RefreshCw} title="7. Updates to This Notice">
                        <p className="mb-8">
                            We might update this Cookie Notice from time to time to keep up with changes in how we use cookies, adapt to new legal and regulatory requirements, embrace new technologies, or reflect shifts in our business operations and website features.
                        </p>
                        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
                            <h4 className="text-white font-black uppercase tracking-tight text-sm">When we make significant changes, we will:</h4>
                            <ul className="space-y-4">
                                {[
                                    "Update the \"Effective Date\" at the top of the page",
                                    "Publish the revised notice on this webpage to ensure full transparency",
                                    "If necessary, ask for your renewed consent (like through updated cookie banners)"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-4 items-start">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1cd35c] shrink-0" />
                                        <p className="text-sm text-white/60 leading-relaxed font-medium">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Section>

                    {/* 8. Contact Us */}
                    <Section icon={Mail} title="8. Contact Us">
                        <p className="mb-8">
                            At Proteccio Data, we're all about keeping the lines of communication open and clear when it comes to how we gather and use your personal data, including through tools like cookies. If you have any questions, concerns, or feedback about our cookie usage, we'd love to hear from you.
                        </p>

                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 mb-8">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-[#1cd35c]" />
                                Data Protection Officer (DPO)
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-2">
                                    <h4 className="text-[#1cd35c] font-black uppercase tracking-widest text-[10px]">Email</h4>
                                    <a href="mailto:contact@protecciodata.com" className="text-xl font-bold text-white hover:text-[#1cd35c] transition-colors decoration-2 underline-offset-8 decoration-white/10 hover:decoration-[#1cd35c]/30">
                                        contact@protecciodata.com
                                    </a>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[#1cd35c] font-black uppercase tracking-widest text-[10px]">Location</h4>
                                    <p className="text-xl font-bold text-white">Hyderabad, India</p>
                                </div>
                            </div>

                            <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-4 items-start">
                                <span className="text-2xl mt-1">⚠️</span>
                                <p className="text-sm text-white/50 leading-relaxed font-medium">
                                    <span className="text-red-400 font-bold uppercase tracking-widest mr-2 text-[10px]">Urgent matters:</span>
                                    Please include "Urgent Privacy Concern" in your subject line so we can prioritize your request. We strive to respond to all privacy-related inquiries in a timely manner, in line with our legal obligations under the DPDPA.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Link
                                to="/rights-management"
                                className="group relative px-8 py-4 bg-[#1cd35c] text-black font-black uppercase tracking-widest text-sm rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(28,211,92,0.3)] active:scale-95"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Exercise Your Rights
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>
                        </div>
                    </Section>

                </div>

                {/* Footer Center */}
                <div className="mt-20 text-center text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">
                    Proteccio Data • Next GEN Privacy Solutions
                </div>
            </main>
        </div>
    );
};

const CategorySubSection = ({ title, summary, details, color }: { title: string, summary: string, details: string, color: string }) => {
    const [isHovered, setIsHovered] = useState(false);

    const colorMap: Record<string, string> = {
        red: "bg-red-500/5 border-red-500/10 hover:bg-red-500/10 border-red-500/20 text-red-400",
        blue: "bg-[#1cd35c]/5 border-[#1cd35c]/10 hover:bg-[#1cd35c]/10 border-[#1cd35c]/20 text-[#1cd35c]",
        green: "bg-[#1cd35c]/5 border-[#1cd35c]/10 hover:bg-[#1cd35c]/10 border-[#1cd35c]/20 text-[#1cd35c]",
        purple: "bg-[#1cd35c]/5 border-[#1cd35c]/10 hover:bg-[#1cd35c]/10 border-[#1cd35c]/20 text-[#1cd35c]"
    };

    const labelMap: Record<string, string> = {
        red: "bg-red-500/20 text-red-400 border-red-500/30",
        blue: "bg-[#1cd35c]/20 text-[#1cd35c] border-[#1cd35c]/30",
        green: "bg-[#1cd35c]/20 text-[#1cd35c] border-[#1cd35c]/30",
        purple: "bg-[#1cd35c]/20 text-[#1cd35c] border-[#1cd35c]/30"
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            tabIndex={0}
            className={`p-6 border rounded-[2rem] transition-all duration-300 relative overflow-hidden group ${colorMap[color]}`}
        >
            <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${labelMap[color]}`}>
                        {title}
                    </span>
                    <p className="text-white font-bold text-sm tracking-tight">{summary}</p>
                </div>
                <div className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity flex items-center gap-2`}>
                    {isHovered ? "Show Less" : "Show More"}
                    <div className={`w-1.5 h-1.5 rounded-full ${color === 'green' ? 'bg-[#1cd35c]' : `bg-${color}-400`}`} style={{ backgroundColor: color === 'green' ? '#1cd35c' : undefined }} />
                </div>
            </div>

            <motion.div
                initial={false}
                animate={{
                    height: isHovered ? "auto" : 0,
                    opacity: isHovered ? 1 : 0,
                    marginTop: isHovered ? 16 : 0
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="overflow-hidden"
            >
                <div className="pt-4 border-t border-white/5">
                    <p className="text-white/50 text-xs leading-relaxed font-medium">
                        {details}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default CookieNotice;
