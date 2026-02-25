import { motion } from "framer-motion";
import { Calendar, MapPin, ChevronDown, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { events, filters } from "../features/events/eventsData";

const Events = () => {

    return (
        <div className="min-h-screen bg-transparent text-white pt-28 font-jakarta">

            {/* --- Hero Section --- */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden py-20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1cd35c]/10 to-transparent pointer-events-none opacity-50 transition-all duration-1000"></div>

                {/* Background Blobs - Increased Vibrancy */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#1cd35c]/15 rounded-full blur-[150px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#1cd35c]/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#20e066]/5 rounded-full blur-[180px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <span className="inline-block px-4 py-1 bg-[#1cd35c]/10 border border-[#1cd35c]/20 rounded-full text-[#1cd35c] text-[11px] font-black uppercase tracking-widest backdrop-blur-md">
                            Connect & Learn
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight drop-shadow-2xl"
                    >
                        Proteccio Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#1cd35c] bg-300% animate-gradient">Events</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md"
                    >
                        Join our community of privacy professionals, technical architects, and legal experts at our upcoming global summits and webinars.
                    </motion.p>
                </div>
            </section>

            {/* --- Filters Bar --- */}
            <div className="bg-white/[0.03] backdrop-blur-xl sticky top-20 z-40 border-b border-white/10 shadow-2xl">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                            <span className="font-black text-white/50 text-[11px] uppercase tracking-widest border-r border-white/10 pr-6 mr-2 hidden md:block">Filter by</span>
                            {filters.map((filter, idx) => (
                                <button key={idx} className="flex items-center gap-2 text-xs font-black text-white/80 hover:text-[#1cd35c] transition-all whitespace-nowrap uppercase tracking-widest group">
                                    {filter} <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 border-l border-white/10 pl-6 ml-auto group">
                            <Search className="w-4 h-4 text-white/40 group-focus-within:text-[#1cd35c] transition-colors" />
                            <input type="text" placeholder="Search events..." className="bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none w-32 md:w-48 font-jakarta transition-all" />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Featured Event --- */}
            <section className="py-16">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {events.filter(e => e.featured).map(event => (
                        <Link to={`/events/${event.id}`} key={event.id} className="block group">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 cursor-pointer hover:border-[#1cd35c]/30 hover:shadow-[0_0_50px_rgba(28,211,92,0.1)] transition-all duration-500"
                            >
                                <div className="grid md:grid-cols-2 gap-0">
                                    <div className={`h-80 md:h-auto relative overflow-hidden`}>
                                        <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.8 }}
                                            src={event.image}
                                            alt={event.title}
                                            className="absolute inset-0 w-full h-full object-cover brightness-[0.7] group-hover:brightness-[0.9] transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>

                                        <div className="absolute top-8 right-8 z-10">
                                            <span className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur-md border ${event.status === "Ongoing"
                                                ? "bg-green-500/20 border-green-500/30 text-green-400"
                                                : "bg-[#1cd35c]/20 border-[#1cd35c]/30 text-[#1cd35c]"
                                                }`}>
                                                {event.status}
                                            </span>
                                        </div>

                                        {/* Icon overlay for visual depth */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                            <Calendar className="w-48 h-48 text-white/10" />
                                        </div>
                                    </div>
                                    <div className="p-10 md:p-16 flex flex-col justify-center bg-[#172333]/80 backdrop-blur-sm z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="px-3 py-1 rounded-full bg-[#1cd35c]/10 text-[#1cd35c] text-[10px] font-black uppercase tracking-widest border border-[#1cd35c]/20">
                                                {event.category}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-black mb-6 group-hover:text-[#1cd35c] transition-colors leading-tight">
                                            <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">{event.title}</span>
                                        </h2>
                                        <p className="text-white/50 mb-10 text-lg font-light leading-relaxed">
                                            {event.description}
                                        </p>
                                        <div className="flex flex-col md:flex-row gap-8 text-sm text-white/60 mt-auto border-t border-white/5 pt-8">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-[#1cd35c]" />
                                                {event.date}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-5 h-5 text-[#1cd35c]" />
                                                {event.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* --- Event Grid --- */}
            <section className="pb-24">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                        {events.filter(e => !e.featured).map((event, index) => (
                            <Link to={`/events/${event.id}`} key={event.id} className="block group h-full">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-[#1cd35c]/30 hover:shadow-[0_0_30px_rgba(28,211,92,0.1)] transition-all duration-500 flex flex-col relative group h-full"
                                >
                                    {/* Dynamic Glow Effect */}
                                    <div className="absolute -inset-px bg-gradient-to-br from-[#1cd35c]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                                    {/* Card Image Area */}
                                    <div className={`h-48 relative overflow-hidden`}>
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full object-cover brightness-[0.7] group-hover:scale-110 group-hover:brightness-[0.9] transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                                        <div className="absolute top-6 left-6">
                                            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[#1cd35c] text-[10px] font-black uppercase tracking-widest border border-[#1cd35c]/20 rounded-full">
                                                {event.category}
                                            </span>
                                        </div>
                                        <div className="absolute top-6 right-6">
                                            <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded backdrop-blur-md border ${event.status === "Ongoing"
                                                ? "bg-green-500/20 border-green-500/30 text-green-400"
                                                : "bg-[#1cd35c]/20 border-[#1cd35c]/30 text-[#1cd35c]"
                                                }`}>
                                                {event.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-8 flex flex-col flex-1">
                                        <h3 className="text-xl font-black mb-4 group-hover:text-[#1cd35c] transition-colors line-clamp-2">
                                            {event.title}
                                        </h3>

                                        <div className="flex items-center text-[10px] font-black text-white/30 mb-6 uppercase tracking-[0.2em] min-h-[20px]">
                                            <span>EVENTS</span>
                                            <span className="mx-2">|</span>
                                            <span className="truncate">{event.category}</span>
                                        </div>

                                        <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-3">
                                            <div className="flex items-center gap-3 text-sm text-white/60">
                                                <Calendar className="w-4 h-4 text-[#1cd35c]" />
                                                {event.date}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-white/40">
                                                <MapPin className="w-4 h-4" />
                                                {event.location}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <button className="px-10 py-4 rounded-xl border-2 border-[#1cd35c] text-[#1cd35c] hover:bg-[#1cd35c] hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                            Load More Events
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Events;

