import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, Clock, ChevronRight, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { jobsService } from "../services/jobs";
import type { RecruitmentJob } from "../types/recruitment";

const JobOpenings = () => {
    const [jobs, setJobs] = useState<RecruitmentJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTitle, setSelectedTitle] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedExperience, setSelectedExperience] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;

    const loadJobs = async () => {
        setIsLoading(true);
        const publishedJobs = await jobsService.getPublishedJobs();
        setJobs(publishedJobs);
        setIsLoading(false);
    };

    useEffect(() => {
        loadJobs();
        return jobsService.subscribe(loadJobs);
    }, []);

    const isNewJob = (publishedAt?: string) => {
        if (!publishedAt) return false;
        const published = new Date(publishedAt).getTime();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        return Date.now() - published <= sevenDays;
    };

    const uniqueTitles = useMemo(() => Array.from(new Set(jobs.map((job) => job.title))), [jobs]);
    const uniqueLocations = useMemo(() => Array.from(new Set(jobs.map((job) => job.location))), [jobs]);
    const uniqueDepartments = useMemo(() => Array.from(new Set(jobs.map((job) => job.department))), [jobs]);
    const experienceLevels = ["0-1 years", "2-5 years", "3-6 years", "5-12 years", "8+ years"];

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const matchesSearch =
                searchQuery === "" ||
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTitle = selectedTitle === "" || job.title === selectedTitle;
            const matchesLocation = selectedLocation === "" || job.location === selectedLocation;
            const matchesDepartment = selectedDepartment === "" || job.department === selectedDepartment;
            const matchesExperience = selectedExperience === "" || job.experience === selectedExperience;

            return matchesSearch && matchesTitle && matchesLocation && matchesDepartment && matchesExperience;
        });
    }, [jobs, searchQuery, selectedTitle, selectedLocation, selectedDepartment, selectedExperience]);

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const startIndex = (currentPage - 1) * jobsPerPage;
    const paginatedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedTitle("");
        setSelectedLocation("");
        setSelectedDepartment("");
        setSelectedExperience("");
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-transparent text-white font-jakarta relative overflow-hidden">
            <section className="relative bg-transparent pt-28 pb-8 md:pt-28 md:pb-10 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                        <h1 className="text-5xl md:text-6xl font-black mb-4">
                            Jobs at <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Proteccio</span>
                        </h1>
                        <p className="text-xl text-white/60 font-medium">{filteredJobs.length} Jobs Found.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-3xl mx-auto mb-8"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="text"
                                placeholder="Enter comma-separated keywords to find suitable jobs"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent transition-all"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="bg-transparent py-4">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                Job Title
                            </label>
                            <select
                                value={selectedTitle}
                                onChange={(e) => setSelectedTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent transition-all"
                            >
                                <option value="">All Titles</option>
                                {uniqueTitles.map((title) => (
                                    <option key={title} value={title} className="bg-[#1a232e]">{title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                City
                            </label>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent transition-all"
                            >
                                <option value="">Job Location</option>
                                {uniqueLocations.map((location) => (
                                    <option key={location} value={location} className="bg-[#1a232e]">{location}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2 flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Function
                            </label>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent transition-all"
                            >
                                <option value="">Select</option>
                                {uniqueDepartments.map((dept) => (
                                    <option key={dept} value={dept} className="bg-[#1a232e]">{dept}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Experience
                            </label>
                            <select
                                value={selectedExperience}
                                onChange={(e) => setSelectedExperience(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1cd35c] focus:border-transparent transition-all"
                            >
                                <option value="">Select</option>
                                {experienceLevels.map((exp) => (
                                    <option key={exp} value={exp} className="bg-[#1a232e]">{exp}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(1)}
                                className="flex-1 px-6 py-3 bg-[#1cd35c] text-white rounded-lg font-bold hover:bg-[#19b850] transition-all"
                            >
                                Filter Jobs
                            </button>
                            <button
                                onClick={resetFilters}
                                className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all"
                                title="Reset"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-10">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="text-center py-16">
                            <p className="text-2xl text-white/50">Loading jobs...</p>
                        </div>
                    ) : paginatedJobs.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-2xl text-white/40">No jobs found matching your criteria.</p>
                            <button
                                onClick={resetFilters}
                                className="mt-6 px-6 py-3 bg-[#1cd35c] text-white rounded-lg font-bold hover:bg-[#19b850] transition-all"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="hidden md:grid md:grid-cols-6 gap-4 px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/50">
                                <div>Job ID</div>
                                <div className="md:col-span-2">Role & Type</div>
                                <div>Location</div>
                                <div>Function</div>
                                <div className="flex justify-between">Experience <span></span></div>
                            </div>

                            {paginatedJobs.map((job, index) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-[#1a232e] border border-white/5 rounded-xl overflow-hidden hover:border-[#1cd35c]/30 transition-all group"
                                >
                                    <Link to={`/job-openings/${job.id}`} className="p-6 block hover:bg-white/5 transition-all text-left">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                                            <div className="text-white text-xs font-mono uppercase">{job.id.toUpperCase()}</div>
                                            <div className="md:col-span-2">
                                                <h3 className="text-lg font-bold text-[#1cd35c] mb-1 flex items-center gap-2">
                                                    {job.title}
                                                    {isNewJob(job.publishedAt) && (
                                                        <span className="px-2 py-0.5 bg-yellow-300/20 border border-yellow-300/40 rounded text-[10px] text-yellow-200 font-black tracking-wider">
                                                            NEW
                                                        </span>
                                                    )}
                                                    {job.walkIn && (
                                                        <span className="px-2 py-0.5 bg-[#1cd35c]/10 border border-[#1cd35c]/30 rounded text-xs text-[#1cd35c] font-black">
                                                            WALK-IN
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-white/40">{job.type}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-white/60">
                                                <MapPin className="w-4 h-4" />
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="text-white/60">{job.department}</div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-white/60">{job.experience}</span>
                                                <ChevronRight className="w-5 h-5 text-[#1cd35c] transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === page
                                        ? "bg-[#1cd35c] text-white"
                                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-12 bg-transparent">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Submit your resume</h2>
                    <p className="text-white/60 mb-6">Didn't find the job you were looking for?</p>
                    <a
                        href="mailto:careers@protecciodata.com"
                        className="inline-flex items-center px-8 py-4 bg-[#1cd35c] text-white rounded-lg font-bold hover:bg-[#19b850] transition-all"
                    >
                        Submit your resume
                    </a>
                    <p className="mt-4 text-sm text-white/40">and we'll have it forward from there.</p>
                </div>
            </section>
        </div>
    );
};

export default JobOpenings;
