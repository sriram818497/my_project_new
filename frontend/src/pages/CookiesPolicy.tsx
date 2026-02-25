import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cookie, Shield, BarChart, Settings, Layout, ArrowRight, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CookiesPolicy = () => {
    const navigate = useNavigate();
    const [consents, setConsents] = useState({
        necessary: true, // Always true
        analytics: false,
        functional: false,
        advertising: false,
    });
    const [isNecessaryExpanded, setIsNecessaryExpanded] = useState(false);
    const [selectedNecessaryCookie, setSelectedNecessaryCookie] = useState("_cf_bm");

    const necessaryCookies = [
        { name: "_cf_bm", retention: "1 year", purpose: "Used by Cloudflare to manage bot protection and security." },
        { name: "_hssc", retention: "Session", purpose: "Used by HubSpot to track sessions and maintain site security." },
        { name: "_hssrc", retention: "Session", purpose: "Used by HubSpot to determine if the visitor has restarted their browser." },
        { name: "_hstc", retention: "6 months", purpose: "Main HubSpot tracking cookie for visitors and sessions." },
        { name: "_cfuvid", retention: "Session", purpose: "Used by Cloudflare for rate-limiting and security policies." },
        { name: "_ga", retention: "2 years", purpose: "Used by Google Analytics to distinguish users and analyze website usage." },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const cookieCategories = [
        {
            id: "necessary",
            title: "Strictly Necessary Cookies",
            description: "Essential for website functionality and cannot be disabled.",
            icon: Shield,
            status: "Always Active",
            disabled: true
        },
        {
            id: "analytics",
            title: "Analytics Cookies",
            description: "Help us understand how visitors interact with the website.",
            icon: BarChart,
            status: "Optional"
        },
        {
            id: "functional",
            title: "Functional Cookies",
            description: "Enable enhanced functionality and personalization.",
            icon: Settings,
            status: "Optional"
        },
        {
            id: "advertising",
            title: "Advertising Cookies",
            description: "Used to deliver relevant ads and marketing campaigns.",
            icon: Layout,
            status: "Optional"
        }
    ];

    const handleToggle = (id: string) => {
        if (id === 'necessary') return;
        setConsents(prev => ({
            ...prev,
            [id]: !prev[id as keyof typeof prev]
        }));
    };

    const handleSave = () => {
        alert("Cookie preferences saved successfully.");
        navigate("/");
    };

    return (
        <div className="font-jakarta text-white relative min-h-screen bg-transparent">
            {/* Background Ambient Effects */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1cd35c]/10 blur-[130px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-[#1cd35c]/5 blur-[120px] rounded-full" />
            </div>

            {/* Content Container */}
            <div className="container px-4 mx-auto max-w-4xl pt-28 pb-14 md:pt-28 md:pb-16 relative z-10">

                {/* 1️⃣ Header Section */}
                <div className="text-center mb-16">
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
                        Cookie <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Preferences</span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg font-medium text-white/60 max-w-2xl mx-auto leading-relaxed"
                    >
                        We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. Manage your preferences below.
                    </motion.p>
                </div>

                {/* 2️⃣ Cookie Items Grid */}
                <div className="grid grid-cols-1 gap-6 mb-12">
                    {cookieCategories.map((category, index) => (
                        <div key={category.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                viewport={{ once: true }}
                                onClick={() => !category.disabled && handleToggle(category.id)}
                                className={`p-8 rounded-[2.5rem] border transition-all duration-300 cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${consents[category.id as keyof typeof consents]
                                    ? "bg-[#1cd35c]/5 border-[#1cd35c]/30"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                    }`}
                            >
                                <div className="flex gap-6 items-center">
                                    <div className={`p-4 rounded-2xl transition-colors ${consents[category.id as keyof typeof consents]
                                        ? "bg-[#1cd35c]/20 text-[#1cd35c]"
                                        : "bg-white/5 text-white/40"
                                        }`}>
                                        <category.icon className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black text-white tracking-tight uppercase">{category.title}</h3>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${category.status === "Always Active" ? "bg-[#1cd35c]/20 text-[#1cd35c]" : (category.disabled ? "bg-white/10 text-white/40" : "bg-[#1cd35c]/20 text-[#1cd35c]")
                                                }`}>
                                                {category.status}
                                            </span>
                                        </div>
                                        <p className="text-white/40 font-medium text-sm leading-relaxed">{category.description}</p>
                                    </div>
                                </div>

                                {/* Custom Toggle Switch & Arrow */}
                                <div className="shrink-0 flex items-center gap-4">
                                    <div
                                        className={`w-14 h-8 rounded-full p-1 transition-all duration-500 relative ${consents[category.id as keyof typeof consents] ? "bg-[#1cd35c]" : "bg-white/10"
                                            } ${category.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                    >
                                        <motion.div
                                            animate={{ x: consents[category.id as keyof typeof consents] ? 24 : 0 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            className="w-6 h-6 bg-white rounded-full shadow-lg"
                                        />
                                    </div>
                                    {category.id === 'necessary' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsNecessaryExpanded(!isNecessaryExpanded);
                                            }}
                                            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isNecessaryExpanded ? 'rotate-180' : ''}`}
                                        >
                                            <ChevronDown className="w-6 h-6 text-white/60" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>

                            {/* Expandable Panel for Necessary Cookies */}
                            {category.id === 'necessary' && isNecessaryExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-4 p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2rem] overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-[#1cd35c]">
                                                    <th className="pb-4 px-4 w-12">Select</th>
                                                    <th className="pb-4 px-4">Cookie Name</th>
                                                    <th className="pb-4 px-4">Data Retention</th>
                                                    <th className="pb-4 px-4">Purpose</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {necessaryCookies.map((cookie) => (
                                                    <tr key={cookie.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <td className="py-4 px-4">
                                                            <input
                                                                type="radio"
                                                                name="necessary-cookie"
                                                                checked={selectedNecessaryCookie === cookie.name}
                                                                onChange={() => setSelectedNecessaryCookie(cookie.name)}
                                                                className="w-4 h-4 accent-[#1cd35c] cursor-pointer"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </td>
                                                        <td className="py-4 px-4 font-bold text-white">{cookie.name}</td>
                                                        <td className="py-4 px-4 text-white/60 italic">{cookie.retention}</td>
                                                        <td className="py-4 px-4 text-white/40 leading-relaxed">{cookie.purpose}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 3️⃣ Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4">
                    <motion.button
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => navigate("/")}
                        className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 py-6 rounded-2xl text-lg font-black text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
                    >
                        <X className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
                        Cancel
                    </motion.button>
                    <motion.button
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleSave}
                        className="flex-[2] bg-[#1cd35c] text-black py-6 rounded-2xl text-xl font-black shadow-2xl shadow-[#1cd35c]/20 hover:bg-[#19b850] transition-all flex items-center justify-center gap-3 group"
                    >
                        Save Preferences
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </div>

                {/* Footer Minimalist Note */}
                <div className="mt-20 text-center text-white/20 text-xs font-bold uppercase tracking-[0.3em]">
                    <p>Proteccio Data • Next GEN Privacy Solutions</p>
                </div>
            </div>
        </div>
    );
};

export default CookiesPolicy;
