import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    User,
    CheckCircle,
    AlertCircle,
    ChevronDown,
    ArrowRight,
} from "lucide-react";
import { rightsRequestsService, type RightsRequestPayload } from "../services/rightsRequests";

const initialFormData: RightsRequestPayload = {
    requestType: "",
    fullName: "",
    email: "",
    phone: "",
    country: "",
    relationship: "",
    complaintReason: "",
    complaintReasonOther: "",
    complaintTarget: "",
    complaintTargetOther: "",
    accessExplanation: "",
    grievanceExplanation: "",
    correctionType: "",
    nomineeRelationship: "",
    nomineeName: "",
    nomineeEstablishment: "",
    consents: {
        accuracy: false,
        verification: false,
    },
};

const isComplaintType = (requestType: string) =>
    requestType === "Right to file a complaint (Sec 6(2)/DPDPA)";

const isAccessType = (requestType: string) =>
    requestType === "Right to Access (Sec 11/DPDPA)";

const isGrievanceType = (requestType: string) =>
    requestType === "Right to Grievance Redressal (Sec 13/DPDPA)";

const isCorrectionType = (requestType: string) =>
    requestType === "Right to Correction (Sec 12(1)/DPDPA)";

const isNominationType = (requestType: string) =>
    requestType === "RIght to Nominate (Sec 14/DPDPA)";

const RightsManagement = () => {
    const [formData, setFormData] = useState<RightsRequestPayload>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const countWords = (str: string) => {
        return str.trim().split(/\s+/).filter(Boolean).length;
    };

    const handleWordLimitChange = (field: string, value: string) => {
        if (countWords(value) <= 200) {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const requestTypeOptions = [
        { id: "access", label: "Right to file a complaint (Sec 6(2)/DPDPA)", icon: "👁️" },
        { id: "correct", label: "Right to withdraw Consent (Sec 6(4)/DPDPA)", icon: "✏️" },
        { id: "erase", label: "Right to Access (Sec 11/DPDPA)", icon: "🗑️" },
        { id: "withdraw", label: "Right to Correction (Sec 12(1)/DPDPA)", icon: "🚫" },
        { id: "restrict", label: "Right to Erasure (Section 12(2)/DPDPA)", icon: "🔒" },
        { id: "object", label: "Right to Grievance Redressal (Sec 13/DPDPA)", icon: "⚠️" },
        { id: "port", label: "RIght to Nominate (Sec 14/DPDPA)", icon: "📤" },
    ];

    const handleRequestTypeSelect = (label: string) => {
        setFormData((prev) => ({
            ...prev,
            requestType: label,
            complaintReason: "",
            complaintReasonOther: "",
            complaintTarget: "",
            complaintTargetOther: "",
            accessExplanation: "",
            grievanceExplanation: "",
            correctionType: "",
            nomineeRelationship: "",
            nomineeName: "",
            nomineeEstablishment: "",
        }));
    };

    const clean = (value: string) => value.trim();

    const buildPayload = (data: RightsRequestPayload): RightsRequestPayload => {
        const requestType = clean(data.requestType);
        const payload: RightsRequestPayload = {
            ...initialFormData,
            requestType,
            fullName: clean(data.fullName),
            email: clean(data.email),
            phone: clean(data.phone),
            country: clean(data.country),
            relationship: clean(data.relationship),
            consents: {
                accuracy: data.consents.accuracy,
                verification: data.consents.verification,
            },
        };

        if (isComplaintType(requestType)) {
            payload.complaintReason = clean(data.complaintReason);
            payload.complaintReasonOther =
                payload.complaintReason === "Other (please specify)"
                    ? clean(data.complaintReasonOther)
                    : "";
            payload.complaintTarget = clean(data.complaintTarget);
            payload.complaintTargetOther =
                payload.complaintTarget === "Other (please specify)"
                    ? clean(data.complaintTargetOther)
                    : "";
        }

        if (isAccessType(requestType)) {
            payload.accessExplanation = clean(data.accessExplanation);
        }

        if (isGrievanceType(requestType)) {
            payload.grievanceExplanation = clean(data.grievanceExplanation);
        }

        if (isCorrectionType(requestType)) {
            payload.correctionType = clean(data.correctionType);
        }

        if (isNominationType(requestType)) {
            payload.nomineeRelationship = clean(data.nomineeRelationship);
            payload.nomineeName = clean(data.nomineeName);
            payload.nomineeEstablishment = clean(data.nomineeEstablishment);
        }

        return payload;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await rightsRequestsService.create(buildPayload(formData));
            alert("Data Principal Request submitted successfully!");
            setFormData(initialFormData);
        } catch {
            alert("Unable to submit request right now. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="font-jakarta text-white relative bg-transparent min-h-screen">
            {/* Background Ambient Effects */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1cd35c]/10 blur-[130px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-[#1cd35c]/5 blur-[100px] rounded-full" />
            </div>

            {/* 1️⃣ Hero Section */}
            <section className="relative pt-28 pb-14 md:pt-28 md:pb-16 overflow-hidden z-10">
                <div className="container px-4 mx-auto max-w-4xl relative z-10 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-block p-4 bg-[#1cd35c]/10 rounded-[2rem] mb-8 border border-[#1cd35c]/20 backdrop-blur-md"
                    >
                        <User className="w-10 h-10 text-[#1cd35c]" />
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white"
                    >
                        Rights <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Management</span>
                    </motion.h1>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h2 className="text-xl md:text-2xl font-bold text-white/90">
                            Data Principal Request <span className="text-[#1cd35c]">(DPR)</span> Submission
                        </h2>
                        <p className="text-lg font-medium text-white/60 max-w-2xl mx-auto leading-relaxed">
                            Submit a formal request to exercise your data protection rights. We ensure your privacy is handled with rigorous security protocols.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container px-4 mx-auto max-w-4xl py-1 relative z-10">
                <form onSubmit={handleSubmit} className="space-y-12">

                    {/* 2️⃣ Section: Submit Your Data Principal Request */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 flex gap-6 items-center transition-all hover:bg-white/10"
                    >
                        <div className="p-4 bg-[#1cd35c]/10 rounded-2xl shrink-0">
                            <AlertCircle className="w-8 h-8 text-[#1cd35c]" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-white leading-tight uppercase tracking-wide">
                                Data Protection <span className="text-[#1cd35c]">Standard</span>
                            </h3>
                            <p className="text-white/60 leading-relaxed font-medium text-sm">
                                please complete this form to submit your request regarding your personal data. We will process your request in accordance with relevant data and our privacy policy.
                            </p>
                        </div>
                    </motion.section>

                    {/* 3️⃣ Section: Request Type (Multi-select) */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-8"
                    >
                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#1cd35c] uppercase tracking-widest flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 rounded-full bg-[#1cd35c]/10 flex items-center justify-center text-[10px]">01</span>
                                Selection Required
                            </label>
                            <h3 className="text-3xl font-black text-white tracking-tight">
                                Request Type <span className="text-[#1cd35c]">*</span>
                            </h3>
                            <p className="text-white/40 font-medium text-sm italic">Select the right you wish to exercise.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {requestTypeOptions.map((option) => (
                                <label
                                    key={option.id}
                                    className={`flex items-center gap-5 p-6 rounded-2xl border transition-all duration-500 cursor-pointer group relative overflow-hidden ${formData.requestType === option.label
                                        ? "border-[#1cd35c] bg-[#1cd35c]/5 shadow-[0_0_50px_-12px_rgba(28,211,92,0.2)]"
                                        : "border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10"
                                        }`}
                                >
                                    {/* Selection Glow Overlay */}
                                    {formData.requestType === option.label && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#1cd35c]/10 to-transparent pointer-events-none" />
                                    )}

                                    <div className="relative z-10">
                                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${formData.requestType === option.label ? "border-[#1cd35c] scale-110" : "border-white/20 group-hover:border-white/40"
                                            }`}>
                                            {formData.requestType === option.label && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-4 h-4 rounded-full bg-[#1cd35c] shadow-[0_0_15px_rgba(28,211,92,0.6)]"
                                                />
                                            )}
                                        </div>
                                        <input
                                            type="radio"
                                            name="requestTypeSelection"
                                            className="absolute opacity-0 cursor-pointer inset-0 w-full h-full"
                                            checked={formData.requestType === option.label}
                                            onChange={() => handleRequestTypeSelect(option.label)}
                                        />
                                    </div>
                                    <span className={`text-lg font-bold transition-all duration-300 relative z-10 ${formData.requestType === option.label ? "text-[#1cd35c] translate-x-1" : "text-white/60 group-hover:text-white/80"
                                        }`}>
                                        {option.label}
                                    </span>

                                    {formData.requestType === option.label && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="ml-auto relative z-10"
                                        >
                                            <CheckCircle className="w-6 h-6 text-[#1cd35c]" />
                                        </motion.div>
                                    )}
                                </label>
                            ))}
                        </div>
                    </motion.section>

                    {/* 4️⃣ Section: Your Details */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-10"
                    >
                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#1cd35c] uppercase tracking-widest flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 rounded-full bg-[#1cd35c]/10 flex items-center justify-center text-[10px]">02</span>
                                Personal Information
                            </label>
                            <h3 className="text-3xl font-black text-white tracking-tight">Your Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your full name"
                                    className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 outline-none transition-all placeholder:text-white/20 font-medium"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="example@gmail.com"
                                    className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 outline-none transition-all placeholder:text-white/20 font-medium"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Phone Number (optional)</label>
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 outline-none transition-all placeholder:text-white/20 font-medium"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Country of Residence *</label>
                                <div className="relative">
                                    <select
                                        required
                                        className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 outline-none transition-all font-medium appearance-none"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    >
                                        <option value="" disabled className="bg-gray-900">Select your country</option>
                                        <option value="India" className="bg-gray-900">India</option>
                                        <option value="USA" className="bg-gray-900">USA</option>
                                        <option value="UK" className="bg-gray-900">UK</option>
                                        <option value="Other" className="bg-gray-900">Other</option>
                                    </select>
                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Relationship with Proteccio Data? *</label>
                            <div className="flex flex-wrap gap-3">
                                {["Customer", "Website Visitor", "Employee", "Vendor / Partner", "Other"].map((rel) => (
                                    <label
                                        key={rel}
                                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl border cursor-pointer transition-all duration-300 font-bold text-sm ${formData.relationship === rel
                                            ? "border-[#1cd35c] bg-[#1cd35c]/20 text-[#1cd35c]"
                                            : "border-white/5 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/60"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            className="hidden"
                                            name="relationship"
                                            checked={formData.relationship === rel}
                                            onChange={() => setFormData({ ...formData, relationship: rel })}
                                        />
                                        <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${formData.relationship === rel ? "border-[#1cd35c]" : "border-white/20"}`}>
                                            {formData.relationship === rel && <div className="w-1.5 h-1.5 rounded-full bg-[#1cd35c]" />}
                                        </div>
                                        {rel}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Conditional Complaint Questions */}
                        {isComplaintType(formData.requestType) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-8 pt-8 border-t border-white/5 mt-8"
                            >
                                {/* Question 1: Why */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Why do you wish to complain? *</label>
                                    <div className="relative">
                                        <select
                                            required
                                            className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 outline-none transition-all font-medium appearance-none"
                                            value={formData.complaintReason}
                                            onChange={(e) => setFormData({ ...formData, complaintReason: e.target.value })}
                                        >
                                            <option value="" disabled className="bg-gray-900">Select a reason</option>
                                            <option value="My data was collected without my consent" className="bg-gray-900">My data was collected without my consent</option>
                                            <option value="My data is being misused" className="bg-gray-900">My data is being misused</option>
                                            <option value="My data was not deleted after request" className="bg-gray-900">My data was not deleted after request</option>
                                            <option value="My data is incorrect or outdated" className="bg-gray-900">My data is incorrect or outdated</option>
                                            <option value="I did not receive a response to my request" className="bg-gray-900">I did not receive a response to my request</option>
                                            <option value="My consent withdrawal was not processed" className="bg-gray-900">My consent withdrawal was not processed</option>
                                            <option value="Data breach or unauthorized access" className="bg-gray-900">Data breach or unauthorized access</option>
                                            <option value="Other (please specify)" className="bg-gray-900">Other (please specify)</option>
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none w-5 h-5" />
                                    </div>
                                    {formData.complaintReason === "Other (please specify)" && (
                                        <div className="mt-4 space-y-2">
                                            <textarea
                                                required
                                                placeholder="Describe in up to 200 words"
                                                className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 outline-none transition-all placeholder:text-white/20 font-medium resize-none"
                                                rows={4}
                                                value={formData.complaintReasonOther}
                                                onChange={(e) => handleWordLimitChange("complaintReasonOther", e.target.value)}
                                            />
                                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest text-right">
                                                {countWords(formData.complaintReasonOther)} / 200 words
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Question 2: Where */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Where do you want to complain? *</label>
                                    <div className="relative">
                                        <select
                                            required
                                            className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 outline-none transition-all font-medium appearance-none"
                                            value={formData.complaintTarget}
                                            onChange={(e) => setFormData({ ...formData, complaintTarget: e.target.value })}
                                        >
                                            <option value="" disabled className="bg-gray-900">Select a target</option>
                                            <option value="Data Protection Officer (DPO) of the organization" className="bg-gray-900">Data Protection Officer (DPO) of the organization</option>
                                            <option value="The concerned organization / company" className="bg-gray-900">The concerned organization / company</option>
                                            <option value="Data Protection Board / Authority" className="bg-gray-900">Data Protection Board / Authority</option>
                                            <option value="Regulatory authority" className="bg-gray-900">Regulatory authority</option>
                                            <option value="Other (please specify)" className="bg-gray-900">Other (please specify)</option>
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none w-5 h-5" />
                                    </div>
                                    {formData.complaintTarget === "Other (please specify)" && (
                                        <div className="mt-4 space-y-2">
                                            <textarea
                                                required
                                                placeholder="Describe in up to 200 words"
                                                className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 outline-none transition-all placeholder:text-white/20 font-medium resize-none"
                                                rows={4}
                                                value={formData.complaintTargetOther}
                                                onChange={(e) => handleWordLimitChange("complaintTargetOther", e.target.value)}
                                            />
                                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest text-right">
                                                {countWords(formData.complaintTargetOther)} / 200 words
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Conditional Access Question */}
                        {isAccessType(formData.requestType) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-8 pt-8 border-t border-white/5 mt-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">How do you wish to access your right, please explain? *</label>
                                    <textarea
                                        required
                                        placeholder="Describe in up to 200 words"
                                        className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 outline-none transition-all placeholder:text-white/20 font-medium resize-none"
                                        rows={4}
                                        value={formData.accessExplanation}
                                        onChange={(e) => handleWordLimitChange("accessExplanation", e.target.value)}
                                    />
                                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest text-right">
                                        {countWords(formData.accessExplanation)} / 200 words
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Conditional Grievance Redressal Question */}
                        {isGrievanceType(formData.requestType) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-8 pt-8 border-t border-white/5 mt-8"
                            >
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Please explain in detail why do you wish to exercise ‘Right to Grievance Redressal’? *</label>
                                    <textarea
                                        required
                                        placeholder="Describe in up to 200 words"
                                        className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 outline-none transition-all placeholder:text-white/20 font-medium resize-none"
                                        rows={4}
                                        value={formData.grievanceExplanation}
                                        onChange={(e) => handleWordLimitChange("grievanceExplanation", e.target.value)}
                                    />
                                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest text-right">
                                        {countWords(formData.grievanceExplanation)} / 200 words
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Conditional Correction Question */}
                        {isCorrectionType(formData.requestType) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-8 pt-8 border-t border-white/5 mt-8"
                            >
                                <div className="space-y-6">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Please select any one option from the below? *</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            "Correct the inaccurate data",
                                            "Correct the misleading data",
                                            "Incomplete personal data",
                                            "Update the personal data"
                                        ].map((option) => (
                                            <label
                                                key={option}
                                                className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300 font-bold text-sm ${formData.correctionType === option
                                                    ? "border-[#1cd35c] bg-[#1cd35c]/10 text-[#1cd35c]"
                                                    : "border-white/5 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/60"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    name="correctionType"
                                                    checked={formData.correctionType === option}
                                                    onChange={() => setFormData({ ...formData, correctionType: option })}
                                                />
                                                <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${formData.correctionType === option ? "border-[#1cd35c]" : "border-white/20"}`}>
                                                    {formData.correctionType === option && <div className="w-1.5 h-1.5 rounded-full bg-[#1cd35c]" />}
                                                </div>
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Conditional Nomination Question */}
                        {isNominationType(formData.requestType) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-8 pt-8 border-t border-white/5 mt-8"
                            >
                                {/* Relationship Dropdown */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">To whom do you want to nominate? *</label>
                                    <div className="relative">
                                        <select
                                            required
                                            className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 outline-none transition-all font-medium appearance-none"
                                            value={formData.nomineeRelationship}
                                            onChange={(e) => setFormData({ ...formData, nomineeRelationship: e.target.value })}
                                        >
                                            <option value="" disabled className="bg-gray-900">Select relationship</option>
                                            <option value="Father" className="bg-gray-900">Father</option>
                                            <option value="Mother" className="bg-gray-900">Mother</option>
                                            <option value="Brother" className="bg-gray-900">Brother</option>
                                            <option value="Uncle" className="bg-gray-900">Uncle</option>
                                            <option value="Sister" className="bg-gray-900">Sister</option>
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none w-5 h-5" />
                                    </div>
                                </div>

                                {/* Nominee Details (Conditional on relationship selection) */}
                                {formData.nomineeRelationship && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                                    >
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Name of the nominee? *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Enter nominee name"
                                                className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 outline-none transition-all placeholder:text-white/20 font-medium"
                                                value={formData.nomineeName}
                                                onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">How do you wish to establish a relationship with the nominee? *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Enter relationship proof/details"
                                                className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white focus:border-[#1cd35c] focus:ring-4 focus:ring-[#1cd35c]/10 outline-none transition-all placeholder:text-white/20 font-medium"
                                                value={formData.nomineeEstablishment}
                                                onChange={(e) => setFormData({ ...formData, nomineeEstablishment: e.target.value })}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </motion.section>





                    {/* 3️⃣ Section: Consent and Declaration */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-8"
                    >
                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#1cd35c] uppercase tracking-widest flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 rounded-full bg-[#1cd35c]/10 flex items-center justify-center text-[10px]">03</span>
                                Submit
                            </label>
                            <h3 className="text-3xl font-black text-white tracking-tight">Consent and Declaration <span className="text-[#1cd35c]">*</span></h3>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-start gap-5 p-6 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer hover:border-[#1cd35c]/30 hover:bg-white/5 transition-all group">
                                <div className="relative mt-1">
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.consents.accuracy ? "bg-[#1cd35c] border-[#1cd35c]" : "border-white/20 group-hover:border-white/40"}`}>
                                        {formData.consents.accuracy && <CheckCircle className="w-4 h-4 text-black" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        required
                                        className="hidden"
                                        checked={formData.consents.accuracy}
                                        onChange={(e) => setFormData({ ...formData, consents: { ...formData.consents, accuracy: e.target.checked } })}
                                    />
                                </div>
                                <span className="text-sm font-bold text-white leading-relaxed transition-colors">
                                    I confirm that the information provided above is accurate and that I am authorized to submit this request.
                                </span>
                            </label>
                            <label className="flex items-start gap-5 p-6 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer hover:border-[#1cd35c]/30 hover:bg-white/5 transition-all group">
                                <div className="relative mt-1">
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.consents.verification ? "bg-[#1cd35c] border-[#1cd35c]" : "border-white/20 group-hover:border-white/40"}`}>
                                        {formData.consents.verification && <CheckCircle className="w-4 h-4 text-black" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        required
                                        className="hidden"
                                        checked={formData.consents.verification}
                                        onChange={(e) => setFormData({ ...formData, consents: { ...formData.consents, verification: e.target.checked } })}
                                    />
                                </div>
                                <span className="text-sm font-bold text-white leading-relaxed transition-colors">
                                    I understand that verification may take place and that legal limitations may apply.
                                </span>
                            </label>
                        </div>
                    </motion.section>

                    {/* 9️⃣ Submit Button */}
                    <motion.button
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#1cd35c] text-black py-6 rounded-2xl text-xl font-black shadow-2xl shadow-[#1cd35c]/20 hover:bg-[#19b850] transition-all flex items-center justify-center gap-3 group"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Data Principal Request"}
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </form>
            </div>

            {/* SEO Humanized Footer Note */}
            <div className="pt-16 pb-16 text-center text-white/20 text-xs font-bold uppercase tracking-[0.3em] relative z-10 px-4">
                <p>Proteccio Data • Next GEN Privacy Solutions</p>
            </div>
        </div>
    );
};

export default RightsManagement;
