import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Briefcase, Clock, Building2, ChevronRight, X, Upload } from "lucide-react";

import type { RecruitmentJob } from "../types/recruitment";
import { jobsService } from "../services/jobs";

const HIRING_PROCESS = [
    { title: "Application", description: "Submit your resume", icon: <Upload className="w-4 h-4" /> },
    { title: "Screening", description: "Profile & initial review", icon: <Building2 className="w-4 h-4" /> },
    { title: "Assignment", description: "Technical task/assessment", icon: <Briefcase className="w-4 h-4" /> },
    { title: "Interview", description: "Panel & technical rounds", icon: <Clock className="w-4 h-4" /> },
    { title: "Selection", description: "Final decision review", icon: <ChevronRight className="w-4 h-4" /> },
    { title: "Offer Letter", description: "Onboarding & welcome", icon: <MapPin className="w-4 h-4" /> }
];

interface ApplicationModalProps {
    job: RecruitmentJob;
    onClose: () => void;
}

const ApplicationModal = ({ job, onClose }: ApplicationModalProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        role: job.title,
        experience: job.experience,
        techStack: "",
        employmentStatus: "",
        noticePeriod: "",
        expectedSalary: "",
        projectLink: "",
        projectExplanation: "",
        startupVsCorporate: "",
        fastPaced: "",
        smallTeam: "",
        authorized: "",
        accurate: false,
        privacy: false
    });
    const [submitted, setSubmitted] = useState(false);
    const [resume, setResume] = useState<File | null>(null);

    const validateStep = (step: number) => {
        if (step === 1) {
            return formData.fullName && formData.email && formData.phone && formData.location && formData.linkedin;
        }
        if (step === 2) {
            return formData.role && formData.experience && formData.techStack && formData.noticePeriod;
        }
        return true;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulation of submission
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#1a232e] border border-white/10 p-12 rounded-3xl text-center max-w-md w-full shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="w-20 h-20 bg-[#1cd35c]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 10 }}
                        >
                            <ChevronRight className="w-10 h-10 text-[#1cd35c]" />
                        </motion.div>
                    </div>
                    <h2 className="text-3xl font-black mb-4">Application Sent!</h2>
                    <p className="text-white/60 leading-relaxed mb-8">
                        Thanks for applying, {formData.fullName.split(' ')[0]}! Our team will review your proof of work and get back to you
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-[#1cd35c] text-white font-black rounded-xl hover:bg-[#19b850] transition-all uppercase tracking-widest text-sm"
                    >
                        Great, Thanks
                    </button>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div className="flex min-h-full items-start justify-center pt-16 md:pt-24 p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    className="bg-[#1a232e] text-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with Progress */}
                    <div className="p-8 border-b border-white/5 relative">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black mb-1">Join Proteccio</h2>
                                <p className="text-xs text-[#1cd35c] font-black uppercase tracking-widest">{job.title}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors border border-white/5">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-4">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex-1 flex flex-col gap-2">
                                    <div className={`h-1 rounded-full transition-all duration-500 ${currentStep >= step ? "bg-[#1cd35c]" : "bg-white/5"}`}></div>
                                    <span className={`text-[10px] font-black uppercase tracking-tighter ${currentStep === step ? "text-white" : "text-white/20"}`}>
                                        Step 0{step}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {currentStep === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">Full Name *</label>
                                                <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" placeholder="" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">Email Address *</label>
                                                <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">Phone Number *</label>
                                                <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">Current Location *</label>
                                                <input required name="location" value={formData.location} onChange={handleInputChange} type="text" placeholder="" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">LinkedIn URL *</label>
                                                <input required name="linkedin" value={formData.linkedin} onChange={handleInputChange} type="url" placeholder="" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">GitHub / Portfolio URL</label>
                                                <input name="github" value={formData.github} onChange={handleInputChange} type="url" placeholder="" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent outline-none transition-all" />
                                            </div>
                                        </div>

                                        {/* Resume Upload moved to Step 1 */}
                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">Resume * (PDF only)</label>
                                            <div
                                                className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-[#1cd35c] hover:bg-[#1cd35c]/5 transition-all cursor-pointer group bg-white/5"
                                                onClick={() => document.getElementById('resume-upload')?.click()}
                                            >
                                                <input id="resume-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => setResume(e.target.files?.[0] || null)} />
                                                <Upload className={`w-10 h-10 mb-3 transition-colors ${resume ? "text-[#1cd35c]" : "text-white/20 group-hover:text-[#1cd35c]"}`} />
                                                {resume ? (
                                                    <p className="text-sm font-bold text-[#1cd35c]">{resume.name}</p>
                                                ) : (
                                                    <>
                                                        <p className="text-sm font-bold text-white/60">Upload your Resume <span className="text-white/20 font-normal">or drag & drop</span></p>
                                                        <p className="text-[10px] text-white/20 mt-1 uppercase tracking-widest">Max 2MB</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2 text-left">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">Primary Role *</label>
                                                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-5 py-3 rounded-xl bg-[#1a232e] border border-white/10 text-white focus:ring-2 focus:ring-[#1cd35c] outline-none transition-all appearance-none cursor-pointer">
                                                    <option>{job.title}</option>
                                                    <option>Full-stack Developer</option>
                                                    <option>Back-end Developer</option>
                                                    <option>Product Manager</option>
                                                    <option>Designer</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">Years of Experience *</label>
                                                <input required name="experience" value={formData.experience} onChange={handleInputChange} type="text" placeholder="" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">Primary Tech Stack *</label>
                                            <input required name="techStack" value={formData.techStack} onChange={handleInputChange} type="text" placeholder="" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent outline-none transition-all" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">Notice Period *</label>
                                                <input required name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange} type="text" placeholder="" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">Expected Salary</label>
                                                <input name="expectedSalary" value={formData.expectedSalary} onChange={handleInputChange} type="text" placeholder="" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent outline-none transition-all" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">Best Project Link *</label>
                                            <input required name="projectLink" value={formData.projectLink} onChange={handleInputChange} type="url" placeholder="" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">What did you build? * (Max 200 words)</label>
                                            <textarea required name="projectExplanation" value={formData.projectExplanation} onChange={handleInputChange} rows={3} placeholder="" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent outline-none transition-all text-sm"></textarea>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1cd35c]">Why Proteccio? (Startup vs Large Corp) *</label>
                                            <textarea required name="startupVsCorporate" value={formData.startupVsCorporate} onChange={handleInputChange} rows={2} placeholder="" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent outline-none transition-all text-sm"></textarea>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                                            <h4 className="md:col-span-2 text-[10px] font-black uppercase text-white/30 mb-2 tracking-widest">Culture Fit Check</h4>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-white/60">Fast-paced comfort?</span>
                                                <div className="flex gap-2">
                                                    {["Yes", "No"].map(v => (
                                                        <button key={v} type="button" onClick={() => setFormData({ ...formData, fastPaced: v })} className={`px-4 py-1.5 rounded-md border ${formData.fastPaced === v ? "bg-[#1cd35c] border-[#1cd35c] text-white" : "border-white/10 text-white/40 hover:border-white/30"} transition-all font-black text-[9px] uppercase tracking-widest`}>{v}</button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-white/60">Small team experience?</span>
                                                <div className="flex gap-2">
                                                    {["Yes", "No"].map(v => (
                                                        <button key={v} type="button" onClick={() => setFormData({ ...formData, smallTeam: v })} className={`px-4 py-1.5 rounded-md border ${formData.smallTeam === v ? "bg-[#1cd35c] border-[#1cd35c] text-white" : "border-white/10 text-white/40 hover:border-white/30"} transition-all font-black text-[9px] uppercase tracking-widest`}>{v}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 pt-4 border-t border-white/5 bg-[#1cd35c]/2 p-6 rounded-2xl">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" required checked={formData.accurate} onChange={(e) => setFormData({ ...formData, accurate: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-[#1cd35c] transition-all cursor-pointer" />
                                                <span className="text-[11px] text-white/40 group-hover:text-white/60 transition-colors">I confirm that the above information is accurate. *</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" required checked={formData.privacy} onChange={(e) => setFormData({ ...formData, privacy: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-[#1cd35c] transition-all cursor-pointer" />
                                                <span className="text-[11px] text-white/40 group-hover:text-white/60 transition-colors">I agree to the privacy policy. *</span>
                                            </label>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Footer Buttons */}
                            <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                {currentStep > 1 ? (
                                    <button type="button" onClick={prevStep} className="px-8 py-3 font-black text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest border border-white/5 rounded-xl">
                                        Back
                                    </button>
                                ) : (
                                    <button type="button" onClick={onClose} className="px-8 py-3 font-black text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest">
                                        Cancel
                                    </button>
                                )}

                                {currentStep < 3 ? (
                                    <button type="button" onClick={nextStep} className="px-10 py-3 bg-[#1cd35c] text-white font-black rounded-xl hover:bg-[#19b850] transition-colors shadow-lg shadow-[#1cd35c]/20 text-xs uppercase tracking-widest">
                                        Next Step
                                    </button>
                                ) : (
                                    <button type="submit" className="px-10 py-3 bg-[#1cd35c] text-white font-black rounded-xl hover:bg-[#19b850] transition-colors shadow-xl shadow-[#1cd35c]/30 text-xs uppercase tracking-widest">
                                        Submit Application
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div >
        </motion.div >
    );
};

const JobDetail = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [job, setJob] = useState<RecruitmentJob | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadJob = async () => {
            if (!jobId) {
                setJob(null);
                setLoading(false);
                return;
            }
            setLoading(true);
            const found = await jobsService.getJobById(jobId);
            setJob(found && found.status === "published" ? found : null);
            setLoading(false);
        };

        loadJob();
        return jobsService.subscribe(loadJob);
    }, [jobId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent text-white font-jakarta flex items-center justify-center">
                <p className="text-white/60 text-lg">Loading job details...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-transparent text-white font-jakarta flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Job Not Found</h1>
                    <p className="text-white/60 mb-8">The job you're looking for doesn't exist.</p>
                    <Link to="/job-openings" className="px-6 py-3 bg-[#1cd35c] text-white rounded-lg font-bold hover:bg-[#19b850] transition-all inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Job Listings
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-white font-jakarta">
            {/* Application Modal */}
            {showApplicationModal && (
                <ApplicationModal job={job} onClose={() => setShowApplicationModal(false)} />
            )}

            {/* Header */}
            <section className="relative bg-transparent pt-28 pb-10 md:pt-28 md:pb-12">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Link
                        to="/job-openings"
                        className="inline-flex items-center gap-2 text-[#1cd35c] hover:text-[#19b850] transition-colors mb-8 text-sm font-bold"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Search Results
                    </Link>

                    {/* Job Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div>
                                <div className="text-[#1cd35c] text-xs font-mono uppercase tracking-widest mb-4 px-3 py-1 bg-[#1cd35c]/10 border border-[#1cd35c]/20 rounded-md inline-block">
                                    Job ID: {job.id.toUpperCase()}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{job.title}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-white/60">
                                    <span className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#1cd35c]" />
                                        {job.location}
                                    </span>
                                    <span className="text-white/20">|</span>
                                    <span className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-[#1cd35c]" />
                                        {job.experience}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowApplicationModal(true)}
                                className="px-8 py-4 bg-[#1cd35c] text-white font-black rounded-lg hover:bg-[#19b850] hover:shadow-[0_0_20px_rgba(28,211,92,0.4)] transition-all text-sm uppercase tracking-widest flex items-center gap-2 whitespace-nowrap"
                            >
                                Apply
                            </button>
                        </div>

                        {/* Job Meta */}
                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                                <Building2 className="w-4 h-4 text-[#1cd35c]" />
                                <span className="text-white/60">Department:</span>
                                <span className="font-bold">{job.department}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                                <Briefcase className="w-4 h-4 text-[#1cd35c]" />
                                <span className="text-white/60">Type:</span>
                                <span className="font-bold">{job.type}</span>
                            </div>
                            {job.applicationDeadline && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                                    <Clock className="w-4 h-4 text-[#1cd35c]" />
                                    <span className="text-white/60">Apply By:</span>
                                    <span className="font-bold">{job.applicationDeadline}</span>
                                </div>
                            )}
                            {job.walkIn && (
                                <div className="px-4 py-2 bg-[#1cd35c]/10 border border-[#1cd35c]/30 rounded-lg">
                                    <span className="font-black text-[#1cd35c] text-xs uppercase tracking-widest">Walk-In Available</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Job Details */}
            <section className="py-12">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Job Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                                    <div className="w-1 h-8 bg-[#1cd35c] rounded-full" />
                                    Job Description
                                </h2>
                                <div className="space-y-4 text-white/70 leading-relaxed">
                                    <p>{job.roleOverview}</p>
                                    <p>{job.aboutRole}</p>
                                </div>
                            </motion.div>

                            {/* Key Responsibilities */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                                    <div className="w-1 h-8 bg-[#1cd35c] rounded-full" />
                                    Key Responsibilities
                                </h2>
                                {(job.responsibilities ?? []).length === 0 ? (
                                    <p className="text-white/50 text-sm">Responsibilities will be updated soon.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {(job.responsibilities ?? []).map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 text-white/70">
                                                <ChevronRight className="w-5 h-5 text-[#1cd35c] flex-shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>

                            {/* Qualifications */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                                    <div className="w-1 h-8 bg-[#1cd35c] rounded-full" />
                                    Required Qualifications
                                </h2>
                                {(job.qualifications ?? []).length === 0 ? (
                                    <p className="text-white/50 text-sm">Qualifications will be updated soon.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {(job.qualifications ?? []).map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 text-white/70">
                                                <ChevronRight className="w-5 h-5 text-[#1cd35c] flex-shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>

                            {/* Desired Skills */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
                                    <div className="w-1 h-8 bg-[#1cd35c] rounded-full" />
                                    Desired Skills
                                </h2>
                                {(job.desiredSkills ?? []).length === 0 ? (
                                    <p className="text-white/50 text-sm">Desired skills will be updated soon.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {(job.desiredSkills ?? []).map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 text-white/70">
                                                <ChevronRight className="w-5 h-5 text-[#1cd35c] flex-shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="sticky top-24 space-y-6"
                            >
                                {/* Apply Card */}
                                <div className="p-6 bg-[#1a232e] border border-white/10 rounded-2xl">
                                    <h3 className="text-xl font-black mb-4">Ready to Apply?</h3>
                                    <p className="text-white/60 text-sm mb-6 leading-relaxed">
                                        Join our team and help shape the future of data privacy and governance.
                                    </p>
                                    <button
                                        onClick={() => setShowApplicationModal(true)}
                                        className="w-full px-6 py-4 bg-[#1cd35c] text-white font-black rounded-lg hover:bg-[#19b850] transition-all text-sm uppercase tracking-widest"
                                    >
                                        Apply Now
                                    </button>
                                </div>

                                {/* Share Job */}
                                <div className="p-6 bg-[#1a232e] border border-white/10 rounded-2xl">
                                    <h3 className="text-lg font-black mb-4">Share this Job</h3>
                                    <div className="flex gap-3">
                                        <button className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm font-bold">
                                            Save
                                        </button>
                                        <button className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm font-bold">
                                            Share
                                        </button>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="p-6 bg-[#1a232e] border border-white/10 rounded-2xl">
                                    <h3 className="text-lg font-black mb-2">Questions?</h3>
                                    <p className="text-white/60 text-sm mb-4">
                                        Contact our HR team for more information.
                                    </p>
                                    <a
                                        href="mailto:careers@protecciodata.com"
                                        className="text-[#1cd35c] hover:text-[#19b850] transition-colors text-sm font-bold"
                                    >
                                        careers@protecciodata.com
                                    </a>
                                </div>

                                {/* Hiring Process */}
                                <div className="p-8 bg-[#1a232e] border border-white/10 rounded-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#1cd35c]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                    <h3 className="text-xl font-black mb-8 relative">Selection Process</h3>

                                    <div className="space-y-8 relative">
                                        {HIRING_PROCESS.map((step, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="relative pl-10 group"
                                            >
                                                {/* Connecting Line */}
                                                {idx !== HIRING_PROCESS.length - 1 && (
                                                    <div className="absolute left-[15px] top-8 w-[2px] h-full bg-white/5 group-hover:bg-[#1cd35c]/20 transition-colors"></div>
                                                )}

                                                {/* Node */}
                                                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#1cd35c] group-hover:scale-110 group-hover:bg-[#1cd35c]/10 group-hover:border-[#1cd35c]/30 transition-all z-10 bg-[#1a232e]">
                                                    {step.icon}
                                                </div>

                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-black text-white group-hover:text-[#1cd35c] transition-colors">{step.title}</h4>
                                                    <p className="text-[11px] text-white/40 leading-tight">{step.description}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Average duration: 2-3 weeks</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default JobDetail;

