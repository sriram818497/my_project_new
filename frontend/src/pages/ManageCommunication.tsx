import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, User, Bell, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { communicationPreferencesService } from "../services/communicationPreferences";

const ManageCommunication = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        preferences: {
            newsletters: true,
            productUpdates: true,
            promotionalOffers: false,
        },
    });
    const [isSaved, setIsSaved] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [existingProfileId, setExistingProfileId] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handlePreferenceToggle = (key: string) => {
        setFormData((prev) => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [key]: !prev.preferences[key as keyof typeof prev.preferences],
            },
        }));
    };

    const loadExistingPreferences = (email: string) => {
        const existing = communicationPreferencesService.getByEmail(email);
        if (!existing) {
            setExistingProfileId(null);
            return;
        }
        setExistingProfileId(existing.id);
        setFormData((prev) => ({
            ...prev,
            name: prev.name || existing.fullName,
            preferences: existing.preferences,
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        try {
            communicationPreferencesService.upsertFromPreferenceCenter({
                fullName: formData.name,
                email: formData.email,
                preferences: formData.preferences,
            });
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Unable to save communication preferences.");
        }
    };

    return (
        <div className="min-h-screen bg-transparent pt-28 pb-14 md:pt-28 md:pb-16 px-4 relative overflow-hidden">
            {/* Background Ambient Effects */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1cd35c]/10 blur-[130px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1cd35c]/5 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 bg-[#1cd35c]/10 rounded-[2rem] mb-8 border border-[#1cd35c]/20 backdrop-blur-md"
                    >
                        <Bell className="w-10 h-10 text-[#1cd35c]" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Manage <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Communication</span>
                    </h1>
                    <p className="text-white/60 text-lg font-medium leading-relaxed">
                        Control how you hear from Proteccio Data. Tailor your preferences to stay informed on your terms.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Internal Glows */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#1cd35c]/10 blur-[60px] rounded-full" />

                    <form onSubmit={handleSave} className="space-y-8 relative z-10">
                        {/* Identity Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                                    <User size={14} className="text-[#1cd35c]" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 transition-all outline-none font-medium placeholder:text-white/20"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                                    <Mail size={14} className="text-[#1cd35c]" /> Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="example@company.com"
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 transition-all outline-none font-medium placeholder:text-white/20"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onBlur={(e) => loadExistingPreferences(e.target.value)}
                                />
                                {existingProfileId && (
                                    <p className="text-[11px] text-[#1cd35c] font-semibold">
                                        Existing preference profile detected: {existingProfileId}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                                <Shield size={20} className="text-[#1cd35c]" />
                                Communication Preferences
                            </h3>

                            <div className="space-y-4">
                                {[
                                    {
                                        id: "newsletters",
                                        title: "Newsletters",
                                        desc: "Get our latest news, privacy insights, and industry updates.",
                                    },
                                    {
                                        id: "productUpdates",
                                        title: "Product Updates",
                                        desc: "Stay informed about new features, improvements, and critical system alerts.",
                                    },
                                    {
                                        id: "promotionalOffers",
                                        title: "Promotional Offers",
                                        desc: "Receive special discounts, event invitations, and partner offers.",
                                    },
                                ].map((pref) => (
                                    <label
                                        key={pref.id}
                                        className={`flex items-start gap-5 p-6 rounded-[1.5rem] border cursor-pointer transition-all duration-300 ${formData.preferences[pref.id as keyof typeof formData.preferences]
                                            ? "bg-[#1cd35c]/10 border-[#1cd35c]/40"
                                            : "bg-white/5 border-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        <div className="mt-1">
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.preferences[pref.id as keyof typeof formData.preferences]
                                                ? "bg-[#1cd35c] border-[#1cd35c]"
                                                : "border-white/20"
                                                }`}>
                                                {formData.preferences[pref.id as keyof typeof formData.preferences] && (
                                                    <CheckCircle className="w-4 h-4 text-black" />
                                                )}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.preferences[pref.id as keyof typeof formData.preferences]}
                                                onChange={() => handlePreferenceToggle(pref.id)}
                                            />
                                        </div>
                                        <div>
                                            <span className="block text-lg font-black text-white group-hover:text-[#1cd35c] transition-colors leading-tight">
                                                {pref.title}
                                            </span>
                                            <p className="text-white/60 text-sm font-medium mt-1 leading-relaxed">
                                                {pref.desc}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 flex flex-col sm:flex-row gap-4">
                            <button
                                type="submit"
                                className="flex-1 px-8 py-5 bg-[#1cd35c] text-black font-black text-lg rounded-2xl hover:bg-[#19b850] transition-all transform hover:-translate-y-1 shadow-xl shadow-[#1cd35c]/20 flex items-center justify-center gap-2 group"
                            >
                                Save Preferences
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-8 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                    {/* Success Overlay */}
                    {isSaved && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-[#1cd35c]/20 border border-[#1cd35c]/30 rounded-2xl flex items-center justify-center gap-3 text-[#1cd35c] font-black uppercase tracking-widest text-sm"
                        >
                            <CheckCircle size={18} />
                            Preferences Saved Successfully
                        </motion.div>
                    )}
                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-red-500/15 border border-red-400/30 rounded-2xl flex items-center justify-center gap-3 text-red-300 font-black text-sm"
                        >
                            {errorMessage}
                        </motion.div>
                    )}
                </motion.div>

                <p className="mt-8 text-center text-white/20 text-xs font-bold uppercase tracking-[0.3em]">
                    Proteccio Data • Next GEN Privacy Solutions
                </p>
            </div>
        </div>
    );
};

export default ManageCommunication;
