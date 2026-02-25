import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
    Calendar, MapPin, Clock, Shield,
    CheckCircle2, User,
    ChevronRight, ArrowLeft,
    Star, HelpCircle, GraduationCap,
    Linkedin, Twitter,
    PlayCircle, ChevronDown
} from "lucide-react";
import { useState, useEffect } from "react";
import { contentManagerService } from "../services/contentManager";
import { eventAttendanceService } from "../services/eventAttendance";
import type { EventContent, EventDetailContent } from "../types/content";

import { buildFallbackEventDetail, eventDetails, mergeEventDetailData } from "../features/events/eventDetailData";

const EventDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [scrolled, setScrolled] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [registrationForm, setRegistrationForm] = useState({
        fullName: "",
        email: "",
        currentRole: "",
        organization: "",
        originCity: "",
        contact: "",
        consent: false,
    });
    const [dynamicEvents, setDynamicEvents] = useState<EventContent[]>(() => contentManagerService.getEvents());
    const [eventDetailOverrides, setEventDetailOverrides] = useState<Record<string, EventDetailContent>>(
        () => contentManagerService.getEventDetails()
    );

    useEffect(() => {
        const refresh = () => {
            setDynamicEvents(contentManagerService.getEvents());
            setEventDetailOverrides(contentManagerService.getEventDetails());
        };
        const unsubscribe = contentManagerService.subscribe(refresh);
        refresh();
        return unsubscribe;
    }, []);

    const dynamicEvent = dynamicEvents.find((item) => item.id === id);
    const baseEvent = eventDetails[id || ""] || (dynamicEvent ? buildFallbackEventDetail(dynamicEvent) : eventDetails["6"]);
    const event = mergeEventDetailData(baseEvent, id ? eventDetailOverrides[id] : undefined);

    useEffect(() => {
        window.scrollTo(0, 0);

        const handleScroll = () => {
            setScrolled(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll);

        const targetDate = new Date(event.countdownDate).getTime();
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference < 0) {
                clearInterval(timer);
            } else {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearInterval(timer);
        };
    }, [event.countdownDate]);

    const scrollToForm = () => {
        document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToAbout = () => {
        document.getElementById('about-event')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleRegistrationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!registrationForm.consent) return;
        eventAttendanceService.register({
            eventId: event.id,
            eventTitle: event.title,
            fullName: registrationForm.fullName,
            email: registrationForm.email,
            currentRole: registrationForm.currentRole,
            organization: registrationForm.organization,
            originCity: registrationForm.originCity,
            contact: registrationForm.contact,
            consent: registrationForm.consent,
        });
        setFormSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-transparent text-white font-jakarta pb-16 selection:bg-[#1cd35c]/30">

            {/* --- Sticky CTA Bar (Mobile) --- */}
            <AnimatePresence>
                {scrolled && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 z-[60] p-4 lg:hidden"
                    >
                        <button
                            onClick={scrollToForm}
                            className="w-full py-4 bg-[#1cd35c] text-white font-black rounded-xl shadow-[0_0_30px_rgba(28,211,92,0.4)] text-xs uppercase tracking-widest"
                        >
                            Secure My Spot
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Hero Section --- */}
            <section className="relative min-h-[85vh] flex items-center pt-24 md:pt-28 pb-10 overflow-hidden">
                {/* Background Banner */}
                <div className="absolute inset-0 z-0">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover brightness-[0.2] transition-transform duration-[20s] hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#172333] via-[#172333]/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#172333] via-transparent to-transparent"></div>
                </div>

                {/* Homepage Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#1cd35c]/10 rounded-full blur-[150px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#1cd35c]/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Content */}
                <div className="container px-4 mx-auto max-w-7xl relative z-10 pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link to="/events" className="inline-flex items-center gap-2 text-white/40 hover:text-[#1cd35c] transition-colors mb-12 text-xs uppercase tracking-widest font-black group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Return to Portfolio
                        </Link>

                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className="px-4 py-1.5 bg-[#1cd35c]/10 border border-[#1cd35c]/20 text-[#1cd35c] text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur-md">
                                {event.category}
                            </span>
                            <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur-md">
                                {event.status}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black mb-10 leading-[0.9] tracking-tighter max-w-4xl drop-shadow-2xl">
                            <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">{event.title}</span>
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mb-16">
                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-3 text-white/60">
                                        <Calendar className="w-5 h-5 text-[#1cd35c]" />
                                        <span className="text-lg font-bold">{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/60 border-l border-white/10 pl-6">
                                        <MapPin className="w-5 h-5 text-[#1cd35c]" />
                                        <span className="text-lg font-bold">{event.location}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl w-fit backdrop-blur-md">
                                    <img src={event.hostImage} className="w-12 h-12 rounded-xl object-cover border border-white/20" alt={event.hostedBy} />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Keynote Speaker</p>
                                        <p className="text-sm font-bold">{event.hostedBy}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Countdown */}
                            <div className="flex gap-4">
                                {[
                                    { label: "DD", value: timeLeft.days },
                                    { label: "HH", value: timeLeft.hours },
                                    { label: "MM", value: timeLeft.minutes },
                                    { label: "SS", value: timeLeft.seconds }
                                ].map((t, idx) => (
                                    <div key={idx} className="flex flex-col items-center">
                                        <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-2 backdrop-blur-xl group hover:border-[#1cd35c]/40 transition-all">
                                            <span className="text-2xl md:text-4xl font-black text-[#1cd35c] tabular-nums">
                                                {String(t.value).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6">
                            <button
                                onClick={scrollToForm}
                                className="px-12 py-5 bg-[#1cd35c] text-white font-black rounded-xl text-sm uppercase tracking-widest hover:shadow-[0_0_40px_rgba(28,211,92,0.4)] transition-all flex items-center gap-3"
                            >
                                Register Now <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={scrollToAbout}
                                className="px-12 py-5 bg-white/5 border border-white/10 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md"
                            >
                                View Agenda
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Visual Accent */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-[#1cd35c]/5 rounded-full blur-[150px] pointer-events-none"></div>
            </section>

            {/* --- Quick Info Strip --- */}
            <section className="bg-white/[0.02] border-y border-white/5 py-8 relative overflow-hidden">
                <div className="container px-4 mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Clock, label: "Time", val: event.time },
                            { icon: MapPin, label: "Access", val: event.access },
                            { icon: User, label: "Capacity", val: event.capacity },
                            { icon: GraduationCap, label: "Level", val: event.level }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-[#1cd35c]">
                                    <item.icon className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{item.label}</span>
                                </div>
                                <p className="text-sm font-bold text-white/80">{item.val}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Content: About & Matters --- */}
            <section id="about-event" className="py-10 relative overflow-hidden">
                <div className="container px-4 mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-24">
                        {/* Section 1: About */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div>
                                <span className="text-[#1cd35c] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Manifesto</span>
                                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tighter text-white">
                                    About The <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#1cd35c] bg-clip-text text-transparent">Event</span>
                                </h2>
                                <p className="text-xl text-white/50 leading-relaxed font-light mb-8">
                                    {event.about.text}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-lg font-black flex items-center gap-3">
                                    <PlayCircle className="w-5 h-5 text-[#1cd35c]" /> Core Focus Areas
                                </h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {event.about.useCases.map((use, i) => (
                                        <li key={i} className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl group hover:border-[#1cd35c]/30 transition-all">
                                            <CheckCircle2 className="w-5 h-5 text-[#1cd35c] flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-white/70 font-medium leading-relaxed">{use}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>

                        {/* Section 2: Why it Matters */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="p-10 bg-gradient-to-br from-[#1cd35c] to-[#19b850] text-white rounded-[3rem] relative overflow-hidden group shadow-[0_0_50px_rgba(28,211,92,0.2)]">
                                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                                    <Star className="w-32 h-32" />
                                </div>
                                <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter">Why This Matters <br />Now</h3>
                                <p className="text-white/80 font-medium leading-relaxed mb-8">
                                    {event.whyMatters.regulatory}
                                </p>
                                <div className="space-y-4">
                                    {event.whyMatters.trends.map((trend, i) => (
                                        <div key={i} className="flex items-center gap-3 border-b border-white/20 pb-4">
                                            <span className="w-2 h-2 rounded-full bg-white"></span>
                                            <span className="text-sm font-black uppercase tracking-tight">{trend}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-8 border-l-2 border-[#1cd35c] bg-white/5 rounded-r-3xl">
                                <p className="text-white/40 italic font-light text-lg">
                                    "{event.about.importance}"
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- Who Should Attend --- */}
            <section className="py-12 bg-transparent">
                <div className="container px-4 mx-auto max-w-7xl">
                    <div className="text-center mb-12">
                        <span className="text-[#1cd35c] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Ecosystem</span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Who Should Attend</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {event.whoShouldAttend.map((role, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] hover:border-[#1cd35c]/30 hover:bg-[#1cd35c]/5 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute -inset-px bg-gradient-to-br from-[#1cd35c]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                                <div className="relative z-10 w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-[#1cd35c]/20 group-hover:border-[#1cd35c]/40 transition-all">
                                    <role.icon className="w-6 h-6 text-[#1cd35c]" />
                                </div>
                                <h4 className="text-2xl font-black mb-4">{role.title}</h4>
                                <p className="text-white/40 leading-relaxed text-sm font-light">
                                    {role.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Key Benefits --- */}
            <section className="py-10 relative overflow-hidden">
                <div className="container px-4 mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <span className="text-[#1cd35c] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Vantage Point</span>
                            <h2 className="text-4xl md:text-5xl font-black mb-10 tracking-tighter leading-tight">Elite Benefits for <br />Forward-Thinking Leaders</h2>
                            <div className="space-y-8">
                                {event.benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex gap-6 items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#1cd35c]/10 rounded-xl flex items-center justify-center border border-[#1cd35c]/20">
                                            <benefit.icon className="w-5 h-5 text-[#1cd35c]" />
                                        </div>
                                        <div>
                                            <h5 className="text-lg font-black mb-1 leading-tight">{benefit.title}</h5>
                                            <p className="text-white/40 text-sm font-light leading-relaxed">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative rounded-[4rem] overflow-hidden border border-white/10 aspect-[4/5] group shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070"
                                className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100"
                                alt="Elite Networking"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#172333] via-transparent to-transparent opacity-80"></div>
                            <div className="absolute inset-0 bg-[#1cd35c]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            <div className="absolute bottom-12 left-12 right-12 z-10 transition-transform duration-500 group-hover:translate-y-[-10px]">
                                <p className="text-3xl font-black mb-2 leading-none uppercase tracking-tighter text-white">The Private <br /> <span className="text-[#1cd35c]">Inner Circle</span></p>
                                <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">Connect with 500+ Verified VPs</p>
                            </div>
                        </div>
                        {/* Accent Circle */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 border border-[#1cd35c]/20 rounded-full animate-spin-slow"></div>
                    </div>
                </div>
            </section>

            {/* --- Agenda Timeline --- */}
            <section className="py-8 bg-transparent border-y border-white/5">
                <div className="container px-4 mx-auto max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Evolution of the <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#1cd35c] bg-clip-text text-transparent">Day</span></h2>
                        <p className="text-white/30 text-sm font-black uppercase tracking-[0.4em] mt-4">{event.location} â€¢ {event.date}</p>
                    </div>

                    <div className="space-y-6">
                        {event.agenda.map((item, idx) => (
                            <div key={idx} className="relative pl-12 md:pl-0">
                                {/* Vertical line on and mobile */}
                                <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 md:hidden"></div>

                                <div className="md:grid md:grid-cols-4 gap-12 items-start group">
                                    <div className="mb-4 md:mb-0 md:text-right md:pt-2">
                                        <span className="text-[#1cd35c] text-2xl font-black tabular-nums">{item.time}</span>
                                        <div className="md:hidden absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-[#1cd35c] border-4 border-black"></div>
                                    </div>
                                    <div className="md:col-span-3 min-h-[140px] pb-6 border-b border-white/10 last:border-0">
                                        <h4 className="text-2xl font-black mb-4 group-hover:text-[#1cd35c] transition-colors leading-tight">{item.title}</h4>
                                        <p className="text-white/40 text-sm leading-relaxed font-light max-w-2xl">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Speakers --- */}
            <section className="py-12">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <span className="text-[#1cd35c] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Faculty</span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">The <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#1cd35c] bg-clip-text text-transparent">Visionaries</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
                        {event.speakers.map((speaker, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row gap-8 items-center md:items-start group">
                                <div className="flex-shrink-0 w-48 h-64 rounded-[2.5rem] overflow-hidden border-2 border-white/10 group-hover:border-[#1cd35c]/50 transition-all duration-500 relative">
                                    <img src={speaker.image} className="w-full h-full object-cover transition-all duration-700" alt={speaker.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="text-center md:text-left pt-4 flex-1">
                                    <h4 className="text-3xl font-black mb-2">{speaker.name}</h4>
                                    <p className="text-[#1cd35c] font-black uppercase text-[10px] tracking-[0.2em] mb-4">{speaker.designation} <span className="text-white/30 mx-2">@</span> {speaker.company}</p>
                                    <p className="text-white/40 text-sm leading-relaxed font-light mb-6 line-clamp-4">{speaker.bio}</p>
                                    <div className="flex justify-center md:justify-start gap-4">
                                        <Link to={speaker.linkedin || "#"} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1cd35c] hover:text-white transition-all">
                                            <Linkedin className="w-4 h-4" />
                                        </Link>
                                        <Link to={speaker.twitter || "#"} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1cd35c] hover:text-white transition-all">
                                            <Twitter className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Registration Form --- */}
            <section id="registration-form" className="pt-8 pb-4 relative">
                {/* Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1cd35c]/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="container px-4 mx-auto max-w-4xl relative z-10">
                    <AnimatePresence mode="wait">
                        {!formSubmitted ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white/5 backdrop-blur-3xl border border-white/10 p-12 md:p-20 rounded-[4rem] shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                                    <Shield className="w-32 h-32 text-[#1cd35c]" />
                                </div>

                                <div className="text-center mb-10 px-4">
                                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase">
                                        Secure Your <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Spot</span>
                                    </h2>
                                    <p className="text-white/40 max-w-md mx-auto font-light">Join the global elite of professionals. Registration is open to all applicants for the {event.title}.</p>
                                </div>

                                <form
                                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                                    onSubmit={handleRegistrationSubmit}
                                >
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Full Identity</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            required
                                            value={registrationForm.fullName}
                                            onChange={(e) => setRegistrationForm((prev) => ({ ...prev, fullName: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-[#1cd35c]/50 transition-all placeholder:text-white/10"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Work Email</label>
                                        <input
                                            type="email"
                                            placeholder="john@company.io"
                                            required
                                            value={registrationForm.email}
                                            onChange={(e) => setRegistrationForm((prev) => ({ ...prev, email: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-[#1cd35c]/50 transition-all placeholder:text-white/10"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Current Role</label>
                                        <select
                                            required
                                            value={registrationForm.currentRole}
                                            onChange={(e) => setRegistrationForm((prev) => ({ ...prev, currentRole: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-[#1cd35c]/50 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Select Persona</option>
                                            <option value="exec">Founders / CxO</option>
                                            <option value="pro">Pro Tech Lead</option>
                                            <option value="legal">Legal Counsel</option>
                                            <option value="student">Student / Aspirant</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Organization</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Company/Univ"
                                            required
                                            value={registrationForm.organization}
                                            onChange={(e) => setRegistrationForm((prev) => ({ ...prev, organization: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-[#1cd35c]/50 transition-all placeholder:text-white/10"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Origin City</label>
                                        <input
                                            type="text"
                                            placeholder="London, UK"
                                            required
                                            value={registrationForm.originCity}
                                            onChange={(e) => setRegistrationForm((prev) => ({ ...prev, originCity: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-[#1cd35c]/50 transition-all placeholder:text-white/10"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Contact (Encrypted)</label>
                                        <input
                                            type="tel"
                                            placeholder="+1 (000) 000-0000"
                                            value={registrationForm.contact}
                                            onChange={(e) => setRegistrationForm((prev) => ({ ...prev, contact: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-[#1cd35c]/50 transition-all placeholder:text-white/10"
                                        />
                                    </div>

                                    <div className="md:col-span-2 py-6">
                                        <label className="flex items-start gap-4 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                required
                                                checked={registrationForm.consent}
                                                onChange={(e) => setRegistrationForm((prev) => ({ ...prev, consent: e.target.checked }))}
                                                className="mt-1 w-5 h-5 accent-[#1cd35c] bg-white/5 border-white/10 rounded"
                                            />
                                            <span className="text-[10px] text-white/30 uppercase tracking-widest font-black leading-relaxed group-hover:text-white/50 transition-colors">
                                                I consent to the processing of personal data for event access under the <Link to="/privacy-notice" className="text-[#1cd35c] hover:underline">Proteccio Data Pact</Link>.
                                            </span>
                                        </label>
                                    </div>

                                    <div className="md:col-span-2">
                                        <button
                                            type="submit"
                                            className="w-full py-8 bg-gradient-to-r from-[#1cd35c] to-[#19b850] text-white font-black rounded-3xl text-sm uppercase tracking-[0.4em] hover:shadow-[0_0_60px_rgba(28,211,92,0.4)] transition-all flex items-center justify-center gap-4 group"
                                        >
                                            Secure My Spot <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><PlayCircle className="w-6 h-6" /></motion.div>
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white/5 backdrop-blur-3xl border border-white/10 p-20 rounded-[4rem] text-center shadow-2xl"
                            >
                                <div className="w-24 h-24 bg-[#1cd35c]/20 rounded-full flex items-center justify-center mx-auto mb-10 border border-[#1cd35c]/40 animate-pulse">
                                    <CheckCircle2 className="w-12 h-12 text-[#1cd35c]" />
                                </div>
                                <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter">Registration Logged</h2>
                                <p className="text-white/40 text-lg font-light leading-relaxed max-w-sm mx-auto mb-10">
                                    Your candidacy for the event has been received. Initial verification will be completed within 24 hours.
                                </p>
                                <button
                                    onClick={() => {
                                        setFormSubmitted(false);
                                        setRegistrationForm({
                                            fullName: "",
                                            email: "",
                                            currentRole: "",
                                            organization: "",
                                            originCity: "",
                                            contact: "",
                                            consent: false,
                                        });
                                    }}
                                    className="px-8 py-3 bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                                >
                                    Dismiss Record
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* --- FAQ Section --- */}
            <section className="pt-4 pb-6">
                <div className="container px-4 mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Common <span className="bg-gradient-to-r from-[#1cd35c] via-[#20e066] to-[#25f075] bg-clip-text text-transparent">Inquiries</span></h2>
                        <p className="text-white/30 text-xs font-black uppercase tracking-[0.4em] mt-4">System Support</p>
                    </div>

                    <div className="grid gap-6">
                        {event.faqs.map((faq, idx) => (
                            <details key={idx} className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all hover:border-[#1cd35c]/20">
                                <summary className="p-6 md:p-8 flex items-center justify-between cursor-pointer list-none">
                                    <h4 className="text-lg font-black flex items-center gap-4">
                                        <HelpCircle className="w-5 h-5 text-[#1cd35c]" /> {faq.question}
                                    </h4>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-open:rotate-180 transition-transform">
                                        <ChevronDown className="w-4 h-4 text-white/40" />
                                    </div>
                                </summary>
                                <div className="px-6 md:px-8 pb-6 md:pb-8">
                                    <p className="text-white/40 text-sm leading-relaxed font-light border-t border-white/5 pt-6">
                                        {faq.answer}
                                    </p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>



        </div>
    );
};

export default EventDetail;
