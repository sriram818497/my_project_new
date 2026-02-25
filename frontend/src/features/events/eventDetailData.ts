import {
  Shield,
  CheckCircle2,
  User,
  Globe,
  Brain,
  Briefcase,
  Lock,
  Server,
  Star,
  GraduationCap,
  Rocket,
  Users,
  Zap,
  PlayCircle,
} from "lucide-react";
import type { EventContent, EventDetailContent } from "../../types/content";

interface Speaker {
    name: string;
    designation: string;
    company: string;
    bio: string;
    image: string;
    linkedin?: string;
    twitter?: string;
}

interface AgendaItem {
    time: string;
    title: string;
    description: string;
}

interface FAQ {
    question: string;
    answer: string;
}

interface Benefit {
    title: string;
    description: string;
    icon: React.ElementType;
}

interface AttendeeRole {
    title: string;
    description: string;
    icon: React.ElementType;
}

interface EventDetailData {
    id: string;
    title: string;
    category: string;
    status: "Upcoming" | "Early Bird" | "Closing Soon" | "Live Now";
    date: string;
    time: string;
    location: string;
    hostedBy: string;
    hostImage: string;
    image: string;
    about: {
        text: string;
        purpose: string;
        useCases: string[];
        importance: string;
    };
    countdownDate: string;
    capacity: string;
    level: string;
    access: string;
    whyMatters: {
        trends: string[];
        regulatory: string;
    };
    whoShouldAttend: AttendeeRole[];
    benefits: Benefit[];
    agenda: AgendaItem[];
    speakers: Speaker[];
    faqs: FAQ[];
}

export const buildFallbackEventDetail = (event: EventContent): EventDetailData => ({
    id: event.id,
    title: event.title,
    category: event.category,
    status: event.status === "Ongoing" ? "Live Now" : "Upcoming",
    date: event.date,
    time: "Details to be announced",
    location: event.location,
    hostedBy: "Proteccio",
    hostImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    image: event.image,
    about: {
        text: event.description,
        purpose: "Learn practical privacy and compliance strategies from experts.",
        useCases: [
            "Operational privacy best practices",
            "Regulatory updates and implementation guidance",
            "Cross-functional alignment between legal and security teams",
        ],
        importance: "Organizations need faster decision-making and stronger governance in a dynamic regulatory environment.",
    },
    countdownDate: "December 31, 2026 09:00:00",
    capacity: "Registration open",
    level: "Professional",
    access: event.location,
    whyMatters: {
        trends: ["Governance modernization", "AI and privacy readiness", "Operational resilience"],
        regulatory: "Privacy obligations are increasing and organizations need practical action plans.",
    },
    whoShouldAttend: [
        { title: "Privacy Leaders", description: "Leads responsible for strategic data protection outcomes.", icon: Shield },
        { title: "Legal and Compliance Teams", description: "Teams mapping obligations to implementation.", icon: Briefcase },
        { title: "Security Teams", description: "Leaders aligning security controls with privacy requirements.", icon: Lock },
    ],
    benefits: [
        { title: "Actionable Guidance", description: "Clear next steps you can apply immediately.", icon: CheckCircle2 },
        { title: "Expert Perspectives", description: "Regulatory and technical perspectives in one session.", icon: Brain },
        { title: "Peer Learning", description: "Practical insights from similar organizations.", icon: Users },
    ],
    agenda: [
        { time: "Session 1", title: "Regulatory and industry landscape", description: "Current expectations and enterprise implications." },
        { time: "Session 2", title: "Operational implementation", description: "Workflows, controls, and ownership models." },
        { time: "Session 3", title: "Q&A and next steps", description: "Open discussion and practical recommendations." },
    ],
    speakers: [
        {
            name: "Proteccio Panel",
            designation: "Subject Matter Experts",
            company: "Proteccio",
            bio: "Privacy, compliance, and security experts sharing practical implementation guidance.",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
            linkedin: "#",
        },
    ],
    faqs: [
        { question: "Is this event virtual or in-person?", answer: `This event is currently listed as: ${event.location}.` },
        { question: "How do I register?", answer: "Use the registration section on this page to submit your details." },
        { question: "Will recordings be available?", answer: "Recordings and resources are shared with registered attendees when available." },
    ],
});

const attendeeIcons: React.ElementType[] = [Shield, Briefcase, Lock, Users, User];
const benefitIcons: React.ElementType[] = [Star, Users, GraduationCap, Brain, Rocket, CheckCircle2];

const mapAttendees = (items: EventDetailContent["whoShouldAttend"]): AttendeeRole[] =>
    (items ?? []).map((item, index) => ({
        title: item.title,
        description: item.description,
        icon: attendeeIcons[index % attendeeIcons.length],
    }));

const mapBenefits = (items: EventDetailContent["benefits"]): Benefit[] =>
    (items ?? []).map((item, index) => ({
        title: item.title,
        description: item.description,
        icon: benefitIcons[index % benefitIcons.length],
    }));

export const mergeEventDetailData = (base: EventDetailData, override?: EventDetailContent): EventDetailData => {
    if (!override) return base;
    const nextStatus = override.status === "Ongoing" ? "Live Now" : override.status;
    return {
        ...base,
        status: (nextStatus as EventDetailData["status"]) ?? base.status,
        time: override.time ?? base.time,
        hostedBy: override.hostedBy ?? base.hostedBy,
        hostImage: override.hostImage ?? base.hostImage,
        countdownDate: override.countdownDate ?? base.countdownDate,
        capacity: override.capacity ?? base.capacity,
        level: override.level ?? base.level,
        access: override.access ?? base.access,
        about: {
            text: override.aboutText ?? base.about.text,
            purpose: override.aboutPurpose ?? base.about.purpose,
            useCases: override.aboutUseCases?.length ? override.aboutUseCases : base.about.useCases,
            importance: override.aboutImportance ?? base.about.importance,
        },
        whyMatters: {
            trends: override.whyTrends?.length ? override.whyTrends : base.whyMatters.trends,
            regulatory: override.whyRegulatory ?? base.whyMatters.regulatory,
        },
        whoShouldAttend: override.whoShouldAttend?.length ? mapAttendees(override.whoShouldAttend) : base.whoShouldAttend,
        benefits: override.benefits?.length ? mapBenefits(override.benefits) : base.benefits,
        agenda: override.agenda?.length ? override.agenda : base.agenda,
        speakers: override.speakers?.length
            ? override.speakers.map((speaker) => ({
                name: speaker.name,
                designation: speaker.designation,
                company: speaker.company,
                bio: speaker.bio,
                image: speaker.image,
                linkedin: speaker.linkedin,
                twitter: speaker.twitter,
            }))
            : base.speakers,
        faqs: override.faqs?.length ? override.faqs : base.faqs,
    };
};

// --- Mock Data ---

export const eventDetails: Record<string, EventDetailData> = {
    "1": {
        id: "1",
        title: "Global Privacy Summit 2026",
        category: "Global Summit | Hybrid",
        status: "Upcoming",
        date: "March 15â€“17, 2026",
        time: "All Day Event",
        location: "London, UK & Global Hybrid",
        hostedBy: "Proteccio Global",
        hostImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
        countdownDate: "March 15, 2026 09:00:00",
        capacity: "1,500 Physical / Unlimited Virtual",
        level: "Strategic & Technical",
        access: "London + Global Stream",
        about: {
            text: "A global gathering of privacy leaders, regulators, and practitioners focused on the future of data protection, compliance, and emerging privacy risks.",
            purpose: "Gain strategic insights, practical guidance, and global perspectives to future-proof your privacy program.",
            useCases: [
                "Global privacy law updates and regulatory outlook",
                "Cross-border data transfers and compliance challenges",
                "Privacy engineering, AI, and emerging technologies",
                "Enterprise privacy governance best practices"
            ],
            importance: "Privacy regulation, AI adoption, and cross-border data flows are accelerating simultaneously. Organizations must adapt quickly to avoid regulatory, reputational, and trust risks."
        },
        whyMatters: {
            trends: [
                "Global privacy law evolution",
                "Cross-border data transfers & sovereignty",
                "AI, automation, and privacy engineering",
                "Enterprise accountability & governance"
            ],
            regulatory: "Privacy regulation, AI adoption, and cross-border data flows are accelerating simultaneously. Organizations must adapt quickly to avoid regulatory, reputational, and trust risks."
        },
        whoShouldAttend: [
            { title: "Privacy & Data Protection Officers", description: "Privacy & Data Protection Officers focused on strategic compliance.", icon: Shield },
            { title: "Legal & Compliance teams", description: "Legal & Compliance teams navigating complex regulations.", icon: Briefcase },
            { title: "CISOs & Security leaders", description: "CISOs & Security leaders integrating security with privacy.", icon: Lock },
            { title: "Product, Risk, and Trust teams", description: "Product, Risk, and Trust teams building digital integrity.", icon: CheckCircle2 }
        ],
        benefits: [
            { title: "Regulatory Insights", description: "Early access to regulatory insights and future outlooks.", icon: Star },
            { title: "Global Networking", description: "Peer networking with global decision-makers and leaders.", icon: Users },
            { title: "Practical Frameworks", description: "Practical frameworks for enterprise adoption and scaling.", icon: GraduationCap },
            { title: "Strategic Foresight", description: "Strategic foresight into emerging risks and AI trends.", icon: Brain }
        ],
        agenda: [
            { time: "Day 1", title: "Regulatory landscape & global outlook", description: "Exploring the global privacy law evolution and regulatory expectations." },
            { time: "Day 2", title: "Technology, AI, and operational privacy", description: "Focusing on AI, automation, and privacy engineering in practice." },
            { time: "Day 3", title: "Strategy, governance, and future readiness", description: "Enterprise accountability & governance for the next decade." }
        ],
        speakers: [
            {
                name: "Keynote Speakers",
                designation: "Industry Thought Leaders",
                company: "To Be Announced",
                bio: "Global privacy regulators, industry thought leaders, and senior enterprise privacy heads.",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
                linkedin: "#"
            },
            {
                name: "The Visionaries",
                designation: "Policy Leaders",
                company: "Global Entities",
                bio: "Senior regulators, global DPOs, CISOs, policy leaders, and privacy technologists driving change across jurisdictions.",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
                linkedin: "#"
            }
        ],
        faqs: [
            { question: "Is the event hybrid?", answer: "Yes, the Global Privacy Summit 2026 is a hybrid event with both in-person sessions in London and a comprehensive global digital stream." },
            { question: "Who are the speakers?", answer: "Our faculty includes global privacy regulators, senior enterprise privacy heads, and world-renowned technologists." },
            { question: "Will certificates be provided?", answer: "All attendees will receive an official Proteccio Certificate of Participation, valid for CPE credits." },
            { question: "How do I access the online portal?", answer: "Registered virtual attendees will receive access credentials for our elite networking portal 7 days prior to the summit." }
        ]
    },
    "2": {
        id: "2",
        title: "AI Governance Framework Workshop",
        category: "Workshop | Virtual",
        status: "Upcoming",
        date: "April 05, 2026",
        time: "09:00 AM - 05:00 PM EST",
        location: "Virtual",
        hostedBy: "AI Governance Hub",
        hostImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070",
        countdownDate: "April 05, 2026 09:00:00",
        capacity: "Unlimited Virtual",
        level: "Hands-on Workshop",
        access: "Global Virtual",
        about: {
            text: "A practical, hands-on workshop designed to help organizations build and operationalize effective AI governance frameworks.",
            purpose: "Leave with actionable guidance to design, assess, and strengthen your AI governance approach.",
            useCases: [
                "Core principles of AI governance",
                "Managing AI risk, bias, and accountability",
                "Privacy and regulatory alignment for AI systems",
                "Implementing governance across teams"
            ],
            importance: "AI regulations and enforcement expectations are rapidly evolving, making governance readiness critical for innovation and risk management."
        },
        whyMatters: {
            trends: [
                "AI governance models and controls",
                "Risk, bias, and accountability management",
                "Privacy-by-design for AI systems",
                "Regulatory alignment and documentation"
            ],
            regulatory: "AI regulations and enforcement expectations are rapidly evolving, making governance readiness critical for innovation and risk management."
        },
        whoShouldAttend: [
            { title: "AI & Data Science leaders", description: "Leaders responsible for AI development and data strategy.", icon: Brain },
            { title: "Compliance & Risk teams", description: "Professionals managing organizational and algorithmic risk.", icon: Shield },
            { title: "Legal & Policy professionals", description: "Legal experts navigating AI regulation and ethical policy.", icon: Briefcase },
            { title: "Product & Engineering managers", description: "Managers building AI products with compliance in mind.", icon: Zap }
        ],
        benefits: [
            { title: "Practical Templates", description: "Leave with actionable governance templates for immediate use.", icon: CheckCircle2 },
            { title: "Regulatory Alignment", description: "Clear guidance on aligning with global AI regulations.", icon: Shield },
            { title: "Expert Instruction", description: "Hands-on learning with world-class AI governance experts.", icon: Users },
            { title: "Strategic Roadmap", description: "Develop a personalized roadmap for your AI journey.", icon: Rocket }
        ],
        agenda: [
            { time: "09:00 AM", title: "Governance fundamentals", description: "Establishing the core principles and models for AI governance." },
            { time: "11:00 AM", title: "Risk assessment & controls", description: "Identifying bias, risk, and implementing technical controls." },
            { time: "02:00 PM", title: "Practical implementation scenarios", description: "Applying governance frameworks to real-world AI products." },
            { time: "04:00 PM", title: "Q&A and expert guidance", description: "Direct interaction with policy and governance leaders." }
        ],
        speakers: [
            {
                name: "Keynote Speaker",
                designation: "Senior AI Policy Expert",
                company: "To Be Announced",
                bio: "Leading voices in global AI policy and governance research.",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
                linkedin: "#"
            },
            {
                name: "The Visionaries",
                designation: "Governance Professionals",
                company: "Leading Agencies",
                bio: "AI governance experts, privacy leaders, and compliance professionals shaping responsible AI adoption.",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
                linkedin: "#"
            }
        ],
        faqs: [
            { question: "Is this workshop interactive?", answer: "Yes, this is a hands-on workshop with multiple breakout sessions and live implementation scenarios." },
            { question: "What templates will be provided?", answer: "You will receive AI Risk Assessment templates, Bias Monitoring checklists, and Governance Charter drafts." },
            { question: "Do I need technical expertise?", answer: "The workshop is designed for both technical and non-technical leaders involved in AI decision-making." },
            { question: "Will recordings be available?", answer: "Full sessions and resource packs will be available to all registered participants." }
        ]
    },
    "3": {
        id: "3",
        title: "GDPR Enforcement Trends",
        category: "Webinar | Virtual",
        status: "Upcoming",
        date: "April 12, 2026",
        time: "11:00 AM - 01:00 PM GMT",
        location: "Virtual",
        hostedBy: "Regulatory Insight Lab",
        hostImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2070",
        countdownDate: "April 12, 2026 11:00:00",
        capacity: "Unlimited Virtual",
        level: "Intermediate to Advance",
        access: "Global Virtual",
        about: {
            text: "An expert-led session examining recent GDPR enforcement actions and what they mean for organizations. We decode recent regulatory signals to help you stay ahead.",
            purpose: "Understand where regulators are focusing and how to reduce enforcement and penalty risks.",
            useCases: [
                "Key GDPR enforcement cases and penalties",
                "Common compliance gaps flagged by regulators",
                "Regulator priorities and enforcement trends",
                "Steps to strengthen GDPR compliance"
            ],
            importance: "Enforcement actions are increasing in scale and complexity, with regulators focusing on accountability and operational gaps. Organizations must adapt to avoid reputational and financial risks."
        },
        whyMatters: {
            trends: [
                "Recent enforcement cases & penalties",
                "Regulator expectations and priorities",
                "Common compliance failures",
                "Risk mitigation strategies"
            ],
            regulatory: "Enforcement actions are increasing in scale and complexity, with regulators focusing on accountability and operational gaps. Staying informed is the first line of defense."
        },
        whoShouldAttend: [
            { title: "Data Protection Officers", description: "DPOs responsible for ensuring organizational compliance.", icon: Shield },
            { title: "Legal & Compliance teams", description: "Professionals managing legal risk and regulatory responses.", icon: Briefcase },
            { title: "Risk & Audit professionals", description: "Auditors assessing compliance gaps and enforcement risks.", icon: CheckCircle2 }
        ],
        benefits: [
            { title: "Enforcement Intelligence", description: "Real-world intelligence on recent regulatory cases.", icon: Brain },
            { title: "Risk Reduction Insights", description: "Practical strategies to minimize enforcement and penalty risks.", icon: Lock },
            { title: "Regulator Perspectives", description: "Insights into what DPAs are prioritizing this year.", icon: Globe }
        ],
        agenda: [
            { time: "11:00 AM", title: "Enforcement landscape overview", description: "A high-level view of current GDPR enforcement trends across the EU." },
            { time: "11:45 AM", title: "Case study deep dives", description: "Analyzing the technical and legal failures in recent major fines." },
            { time: "12:30 PM", title: "Practical compliance takeaways", description: "Actionable steps to harden your privacy program against regulator scrutiny." }
        ],
        speakers: [
            {
                name: "Keynote Speaker",
                designation: "GDPR Enforcement Expert",
                company: "To Be Announced",
                bio: "Leading regulatory experts and former DPA officials sharing exclusive insights.",
                image: "https://images.unsplash.com/photo-1573162915955-f29ab414470c?auto=format&fit=crop&q=80&w=800",
                linkedin: "#"
            },
            {
                name: "The Visionaries",
                designation: "Strategic Advisors",
                company: "Compliance Partners",
                bio: "Regulatory experts, DPOs, and compliance strategists shaping the future of global privacy enforcement.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
                linkedin: "#"
            }
        ],
        faqs: [
            { question: "Will actual case studies be discussed?", answer: "Yes, we analyze specific recent fines to understand the exact root causes of enforcement." },
            { question: "Is this relevant outside the EU?", answer: "Absolutely. GDPR enforcement sets the benchmark for global privacy standards and enforcement models." },
            { question: "Can I submit questions in advance?", answer: "Yes, registered attendees will receive a link to our Q&A portal prior to the session." },
            { question: "Are certificates provided?", answer: "Yes, a certificate of completion will be issued for professional development tracking." }
        ]
    },
    "4": {
        id: "4",
        title: "Proteccio Customer Connect â€“ NYC",
        category: "In-person Event | New York City",
        status: "Upcoming",
        date: "May 20, 2026",
        time: "10:00 AM - 06:00 PM EST",
        location: "New York City, NY",
        hostedBy: "Proteccio Success Team",
        hostImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
        image: "https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?auto=format&fit=crop&q=80&w=2070",
        countdownDate: "May 20, 2026 10:00:00",
        capacity: "Limited to 100 Customers",
        level: "Customer Exclusive",
        access: "In-person (NYC)",
        about: {
            text: "An exclusive in-person event for Proteccio customers to connect, learn, and engage directly with the Proteccio team in the heart of NYC.",
            purpose: "Get deeper product insights, share experiences, and maximize value from your Proteccio platform.",
            useCases: [
                "Product roadmap and upcoming features",
                "Customer success stories and real-world use cases",
                "Best practices for privacy operations",
                "Peer networking and expert discussions"
            ],
            importance: "Privacy operations are maturing rapidly, and customers need deeper alignment with product capabilities and roadmap direction."
        },
        whyMatters: {
            trends: [
                "Product roadmap & innovation",
                "Customer success stories",
                "Advanced use cases",
                "Operational best practices"
            ],
            regulatory: "As privacy programs scale, the ability to operationalize regulatory requirements through unified platforms becomes a critical competitive advantage."
        },
        whoShouldAttend: [
            { title: "Proteccio customers", description: "Current users looking to optimize their platform utilization.", icon: Users },
            { title: "Privacy & Compliance leaders", description: "Strategic leaders driving privacy transformation.", icon: Shield },
            { title: "Program and Operations teams", description: "Teams responsible for day-to-day privacy workflows.", icon: Zap }
        ],
        benefits: [
            { title: "Product Access", description: "Direct access to Proteccio product managers and decision-makers.", icon: PlayCircle },
            { title: "Early Insights", description: "Be the first to see and beta-test upcoming feature releases.", icon: Rocket },
            { title: "Peer Benchmarking", description: "Network with other Fortune 500 customers to benchmark your program.", icon: Users }
        ],
        agenda: [
            { time: "10:00 AM", title: "Product deep dives", description: "Technical walkthroughs of current and upcoming features." },
            { time: "01:00 PM", title: "Customer-led sessions", description: "Sharing success stories and operational frameworks." },
            { time: "03:00 PM", title: "Expert roundtables", description: "Small group discussions on specific privacy challenges." },
            { time: "05:00 PM", title: "Networking experience", description: "Evening reception with NYC-inspired catering and drinks." }
        ],
        speakers: [
            {
                name: "Proteccio Leadership",
                designation: "Executive Team",
                company: "Proteccio",
                bio: "Proteccio's senior leadership and product visionaries.",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
                linkedin: "#"
            },
            {
                name: "The Visionaries",
                designation: "Product Leaders",
                company: "Proteccio",
                bio: "The minds behind Proteccio's core algorithms and user-centric privacy design.",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800",
                linkedin: "#"
            }
        ],
        faqs: [
            { question: "Is this event only for customers?", answer: "Yes, this is an exclusive event reserved for current Proteccio platform customers." },
            { question: "Where in NYC is the venue?", answer: "The venue details will be shared with confirmed attendees 2 weeks before the event." },
            { question: "Is there a cost to attend?", answer: "The event is complimentary for our enterprise customers, but registration is required." },
            { question: "Will beta features be showcased?", answer: "Yes, we will be demonstrating several unreleased features and seeking customer feedback." }
        ]
    },
    "5": {
        id: "5",
        title: "Data Sovereignty in the Cloud Era",
        category: "Thought Leadership Session",
        status: "Upcoming",
        date: "June 10, 2026",
        time: "02:00 PM - 04:00 PM GMT",
        location: "Virtual",
        hostedBy: "Global Cloud Compliance",
        hostImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2070",
        countdownDate: "June 10, 2026 14:00:00",
        capacity: "Unlimited Virtual",
        level: "Strategic Leadership",
        access: "Global Virtual",
        about: {
            text: "A session exploring how organizations can navigate data sovereignty requirements in an increasingly cloud-driven environment. We dive into the complexities of localization and cross-border governance.",
            purpose: "Learn how to balance cloud innovation with evolving data sovereignty obligations.",
            useCases: [
                "Data localization and sovereignty requirements",
                "Cross-border data transfer challenges",
                "Cloud compliance considerations",
                "Practical strategies for global operations"
            ],
            importance: "Jurisdictional controls and localization laws are tightening, impacting cloud strategy and global operations. Leading with a sovereignty-first mindset is no longer optional."
        },
        whyMatters: {
            trends: [
                "Data localization requirements",
                "Cross-border cloud architectures",
                "Regulatory risk management",
                "Practical compliance strategies"
            ],
            regulatory: "Jurisdictional controls and localization laws are tightening, impacting cloud strategy and global operations. Organizations must adapt to a multi-sovereignty world."
        },
        whoShouldAttend: [
            { title: "Cloud & IT leaders", description: "Leaders defining cloud architecture and digital transformation.", icon: Server },
            { title: "Privacy & Legal teams", description: "Professionals managing the legal aspects of data residency.", icon: Shield },
            { title: "Compliance & Risk professionals", description: "Risk officers assessing the impact of localization laws.", icon: Briefcase }
        ],
        benefits: [
            { title: "Strategic Clarity", description: "Gain a clear perspective on global sovereignty risks and trends.", icon: Brain },
            { title: "Compliance Insights", description: "Actionable takeaways for implementing cloud compliance frameworks.", icon: Lock },
            { title: "Future-Proofing", description: "Strategies to ensure your cloud operations remain resilient to regulatory shifts.", icon: Globe }
        ],
        agenda: [
            { time: "02:00 PM", title: "Sovereignty landscape analysis", description: "Reviewing the current global map of data residency laws." },
            { time: "02:45 PM", title: "Cloud architecture strategies", description: "Technical models for localized storage and cross-border processing." },
            { time: "03:30 PM", title: "Panel: The Future of Sovereign Cloud", description: "Expert discussion on industry shifts and technical sovereignty." }
        ],
        speakers: [
            {
                name: "Keynote Speaker",
                designation: "Industry Thought Leader",
                company: "To Be Announced",
                bio: "Recognized experts in cloud governance and digital sovereignty regulations.",
                image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=800",
                linkedin: "#"
            },
            {
                name: "The Visionaries",
                designation: "Cloud Strategists",
                company: "Leading Tech Firms",
                bio: "Cloud strategists, legal experts, and privacy leaders shaping the next generation of global data flows.",
                image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=800",
                linkedin: "#"
            }
        ],
        faqs: [
            { question: "Is this session relevant for multi-cloud users?", answer: "Yes, the strategies discussed cover AWS, Azure, GCP, and private cloud residency models." },
            { question: "Will technical architectures be shown?", answer: "We will share high-level architectural patterns for managing data localization." },
            { question: "Is there a focus on specific regions?", answer: "The session covers EU, Asia-Pacific, and Middle Eastern sovereignty trends." },
            { question: "How do I register for updates?", answer: "Registering for the session will automatically add you to our sovereignty insight newsletter." }
        ]
    },
    "6": {
        id: "6",
        title: "Cybersecurity & Privacy Convergence",
        category: "Panel Discussion",
        status: "Upcoming",
        date: "July 08, 2026",
        time: "10:00 AM - 04:00 PM PST",
        location: "San Francisco, USA & Global Stream",
        hostedBy: "Dr. Sarah Chen",
        hostImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
        image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=2070",
        countdownDate: "July 08, 2026 10:00:00",
        capacity: "500 Physical / Unlimited Virtual",
        level: "Intermediate to Advance",
        access: "SF + Global Stream",
        about: {
            text: "A discussion on the growing convergence of cybersecurity and privacy functions and how organizations can align both effectively. This session brings together experts to bridge the gap between technical safeguarding and data protection.",
            purpose: "Discover how aligning privacy and security can strengthen resilience, compliance, and trust.",
            useCases: [
                "Shared responsibilities between privacy and security teams",
                "Incident response and breach readiness alignment",
                "Governance models for integrated risk management",
                "Building a unified trust strategy"
            ],
            importance: "Incidents, enforcement, and customer expectations demand closer collaboration between privacy and security functions. A siloed approach is no longer sustainable."
        },
        whyMatters: {
            trends: [
                "Privacyâ€“security overlap",
                "Incident response alignment",
                "Integrated governance models",
                "Trust and resilience building"
            ],
            regulatory: "Regulatory bodies are increasingly evaluating how well organizations integrate their technical controls with their privacy governance frameworks during breach investigations."
        },
        whoShouldAttend: [
            { title: "CISOs & Security leaders", description: "Security executives looking to integrate privacy into the SOC.", icon: Lock },
            { title: "Privacy & Compliance professionals", description: "Experts ensuring that technical controls meet legal standards.", icon: Shield },
            { title: "Risk & Governance teams", description: "Strategic teams managing the intersection of operational and legal risk.", icon: Briefcase }
        ],
        benefits: [
            { title: "Cross-functional Alignment", description: "Actionable insights for breaking down silos between security and privacy.", icon: Users },
            { title: "Stronger Breach Readiness", description: "Improve your incident response posture through unified drills and protocols.", icon: Zap },
            { title: "Integrated Governance", description: "Develop models that satisfy both NIST and GDPR requirements.", icon: CheckCircle2 }
        ],
        agenda: [
            { time: "10:00 AM", title: "Expert perspectives", description: "Individual presentations from leading CISOs and DPOs on their convergence journeys." },
            { time: "01:00 PM", title: "Panel discussion", description: "A moderate debate on common friction points and successful integration strategies." },
            { time: "03:00 PM", title: "Audience Q&A", description: "Direct engagement with the panel to solve complex organizational challenges." }
        ],
        speakers: [
            {
                name: "Keynote Speaker",
                designation: "Senior Security Leader",
                company: "To Be Announced",
                bio: "Executive leadership with experience managing global cybersecurity and privacy transformation.",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
                linkedin: "#"
            },
            {
                name: "The Visionaries",
                designation: "Convergence Pioneers",
                company: "Tech Enterprises",
                bio: "CISOs, DPOs, and risk leaders driving convergence at the world's most innovative organizations.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
                linkedin: "#"
            }
        ],
        faqs: [
            { question: "Is this for technical or legal staff?", answer: "The session is designed to be accessible to both, focusing on the strategic alignment of both functions." },
            { question: "Is it a local or global event?", answer: "This is a hybrid event taking place in San Francisco with a global digital stream available." },
            { question: "Will recordings be available?", answer: "Yes, registered attendees will have access to all session recordings and the trust maturity toolkit." },
            { question: "Can I bring my team?", answer: "We highly encourage cross-functional teams (e.g., CISO + DPO) to attend together for maximum alignment." }
        ]
    }
};


