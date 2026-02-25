import axios from "axios";
import type {
  CaseStudyContent,
  EventContent,
  EventDetailContent,
  InsightArticle,
  InsightCapability,
  InsightExpertise,
  PartnersPageContent,
} from "../types/content";

const EVENTS_KEY = "proteccio-content-events";
const EVENT_DETAILS_KEY = "proteccio-content-event-details";
const EVENT_IMAGE_HISTORY_KEY = "proteccio-content-event-image-history";
const CASE_STUDY_IMAGE_HISTORY_KEY = "proteccio-content-case-study-image-history";
const CASE_STUDIES_KEY = "proteccio-content-case-studies";
const INSIGHT_ARTICLES_KEY = "proteccio-content-insight-articles";
const INSIGHT_IMAGE_HISTORY_KEY = "proteccio-content-insight-image-history";
const INSIGHT_CAPABILITIES_KEY = "proteccio-content-insight-capabilities";
const INSIGHT_EXPERTISE_KEY = "proteccio-content-insight-expertise";
const PARTNERS_PAGE_CONTENT_KEY = "proteccio-content-partners-page";

type Listener = () => void;
type EventImageHistory = Record<string, string[]>;
type EventDetailStore = Record<string, EventDetailContent>;
type CaseStudyImageHistory = Record<string, string[]>;
type InsightImageHistory = Record<string, string[]>;
const listeners = new Set<Listener>();
const inMemoryStore = new Map<string, unknown>();
let hydrationStarted = false;

const notify = () => {
  listeners.forEach((listener) => listener());
};

const deepClone = <T,>(value: T): T => {
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value)) as T;
  }
};

const readStore = <T>(key: string, seed: T): T => {
  startHydration();
  if (!inMemoryStore.has(key)) {
    inMemoryStore.set(key, deepClone(seed));
  }
  return deepClone(inMemoryStore.get(key) as T);
};

const writeStore = <T>(key: string, value: T) => {
  inMemoryStore.set(key, deepClone(value));
  notify();
  void axios
    .put(`/api/site-content/${encodeURIComponent(key)}`, { payload: value })
    .catch((error) => {
      console.error(`Failed to persist content key "${key}" to backend.`, error);
    });
};

const eventsSeed: EventContent[] = [
  {
    id: "1",
    title: "Global Privacy Summit 2026",
    category: "Global Summit | Hybrid",
    date: "March 15-17, 2026",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
    description: "Join industry leaders to discuss the future of AI governance and cross-border data flows.",
    featured: true,
    status: "Upcoming",
  },
  {
    id: "2",
    title: "AI Governance Framework Workshop",
    category: "Workshop | Virtual",
    date: "April 05, 2026",
    location: "Virtual",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070",
    description: "A deep dive into operationalizing AI safety and ethics within your enterprise.",
    status: "Upcoming",
  },
  {
    id: "3",
    title: "GDPR Enforcement Trends",
    category: "Webinar | Virtual",
    date: "April 12, 2026",
    location: "Virtual",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2070",
    description: "Analyzing the latest regulatory fines and what they mean for compliance teams.",
    status: "Upcoming",
  },
  {
    id: "4",
    title: "Proteccio Customer Connect NYC",
    category: "In-person Event | New York City",
    date: "May 20, 2026",
    location: "New York City",
    image: "https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?auto=format&fit=crop&q=80&w=2070",
    description: "An exclusive in-person event for Proteccio customers to connect, learn, and engage with the team.",
    status: "Upcoming",
  },
  {
    id: "5",
    title: "Data Sovereignty in the Cloud Era",
    category: "Thought Leadership Session",
    date: "June 10, 2026",
    location: "Virtual",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2070",
    description: "Navigate sovereignty requirements in an increasingly cloud-driven operating model.",
    status: "Upcoming",
  },
  {
    id: "6",
    title: "Cybersecurity and Privacy Convergence",
    category: "Panel Discussion",
    date: "July 08, 2026",
    location: "San Francisco, USA",
    image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=2070",
    description: "Align security and privacy functions with a practical operating framework.",
    status: "Upcoming",
  },
];

const insightCapabilitiesSeed: InsightCapability[] = [
  {
    id: "cap-1",
    title: "Automation-First",
    desc: "Automated privacy impact assessments and real-time risk scoring.",
  },
  {
    id: "cap-2",
    title: "Risk-Centric",
    desc: "Prioritize vulnerabilities based on actual business impact and sensitivity.",
  },
  {
    id: "cap-3",
    title: "Human-First",
    desc: "Workflows designed for cross-functional collaboration between business and tech.",
  },
  {
    id: "cap-4",
    title: "Continuous",
    desc: "Always-on monitoring maps your data posture to global regulations instantly.",
  },
];

const insightExpertiseSeed: InsightExpertise[] = [
  {
    id: "01",
    title: "Global Governance",
    content: "Unified frameworks that satisfy GDPR, CCPA, and emerging markets without duplication.",
  },
  {
    id: "02",
    title: "Records of Processing Activity",
    content: "Maintain dynamic and automated ROPAs that reflect your real-time data environment.",
  },
  {
    id: "03",
    title: "Consent Management",
    content: "Comprehensive consent orchestration that respects user choices with auditability.",
  },
  {
    id: "04",
    title: "Data Mapping and Discovery",
    content: "Automated inventory of personal data across your digital estate.",
  },
];

const insightArticlesSeed: InsightArticle[] = [
  {
    id: "ins-1",
    category: "Regulation",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    title: "The EU AI Act: What Privacy Teams Need to Know",
    date: "Research | Oct 12, 2025",
  },
  {
    id: "ins-2",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    title: "Privacy Enhancing Technologies in 2026",
    date: "Tech Paper | Sep 28, 2025",
  },
  {
    id: "ins-3",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
    title: "Building Trust as a Competitive Advantage",
    date: "Whitepaper | Sep 15, 2025",
  },
  {
    id: "ins-4",
    category: "Use Case",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    title: "Real-time ROPA: Moving Beyond Spreadsheets",
    date: "Case Study | Aug 10, 2025",
  },
];

const caseStudiesSeed: CaseStudyContent[] = [
  {
    id: "1",
    industry: "Luxury Retail",
    regulation: "GDPR",
    solutionType: "Privacy Governance",
    assetType: "Case Study",
    title: "High-Fashion & High-Trust: Luxury Retail Data Ethics",
    description: "How a global luxury fashion house scaled personalization while preserving discretion and compliance.",
    date: "Dec 2025",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    overview:
      "For an ultra-luxury fashion house, privacy is not just a legal requirement - it is central to the brand promise. The challenge was to deliver deeply personalized shopping experiences while preserving discretion, transparency, and regulatory compliance across digital and flagship environments worldwide.",
    challenges: [
      "Balancing the need for detailed clienteling data with GDPR's data minimization principles.",
      "Designing cookie consent flows that preserved the brand's premium, minimalist aesthetic.",
      "Addressing heightened privacy expectations of high-profile clients using aliases or third-party purchasers.",
      "Ensuring precise data localization to meet regional requirements for VIP data storage.",
    ],
    solution_detail: [
      "Designed a premium Preference Center enabling clients to control data usage and manage wishlists seamlessly.",
      "Implemented contextual consent that requests permissions precisely when personalized services are offered.",
      "Deployed VIP data-masking protocols to ensure staff access only transaction-relevant information.",
      "Automated inactive-profile deletion in line with brand-defined retention policies.",
    ],
    outcomes: [
      "25% uplift in VIP repeat purchases driven by trust-based personalization.",
      "Zero data-usage complaints since implementation.",
      "Privacy Leader recognition in annual luxury benchmarking surveys.",
      "Stronger brand loyalty through visible, proactive data ethics commitments.",
    ],
    testimonial: {
      quote: "Proteccio helped us modernize personalization without compromising the discretion our clients expect from a luxury brand.",
      author: "Chief Digital Officer",
      role: "Global Luxury Fashion Group",
    },
    timeline: [
      { phase: "Phase 1", title: "Privacy baseline and data-flow mapping completed across digital and flagship channels", duration: "Weeks 1-3" },
      { phase: "Phase 2", title: "Preference Center and contextual consent rollout delivered for high-value customer journeys", duration: "Weeks 4-8" },
      { phase: "Phase 3", title: "VIP data masking and retention automation activated for global operations", duration: "Weeks 9-12" },
    ],
    certifications: ["ISO 27001", "ISO 27701", "GDPR", "SOC 2"],
  },
  {
    id: "2",
    industry: "Healthcare",
    regulation: "ISO 27701",
    solutionType: "DPIA",
    assetType: "Success Story",
    title: "Automating Privacy by Design in Healthcare Networks",
    description: "Streamlined DPIA workflows for clinical systems and ISO 27701 readiness.",
    date: "Nov 2025",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
    overview: "A healthcare provider with 15 hospitals needed faster privacy approvals for new clinical technologies.",
    challenges: [
      "Long manual DPIA cycles delayed innovation.",
      "Inconsistent risk scoring across departments.",
      "Limited evidence for implementation of privacy controls.",
    ],
    solution_detail: [
      "Integrated automated DPIA into project lifecycle.",
      "Added healthcare-specific risk scoring.",
      "Mapped DPIA findings to ISO 27701 control library.",
    ],
    outcomes: [
      "65% faster time-to-market for clinical software.",
      "ISO 27701 certification achieved in 9 months.",
      "100% high-risk projects assessed before go-live.",
    ],
    timeline: [
      { phase: "Phase 1", title: "Risk Profile Analysis", duration: "Weeks 1-2" },
      { phase: "Phase 2", title: "DPIA Integration", duration: "Weeks 3-6" },
      { phase: "Phase 3", title: "Audit Readiness", duration: "Weeks 7-10" },
    ],
    certifications: ["ISO 27701", "HIPAA", "GDPR", "HITRUST"],
  },
  {
    id: "3",
    industry: "Finance",
    regulation: "DPDP Act",
    solutionType: "Consent Management",
    assetType: "Case Study",
    title: "Navigating India's DPDP Act: A Fintech Transformation",
    description: "Granular, verifiable consent across millions of mobile users.",
    date: "Oct 2025",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    overview: "A digital bank needed to modernize consent management under the DPDP Act while maintaining onboarding speed.",
    challenges: [
      "Legacy all-or-nothing consent model.",
      "No seamless withdrawal mechanism.",
      "Lack of regulator-grade consent audit trail.",
    ],
    solution_detail: [
      "Centralized consent lifecycle across five apps.",
      "Implemented just-in-time consent prompts.",
      "Exposed user preference center and immutable audit logs.",
    ],
    outcomes: [
      "100% DPDP compliance achieved ahead of deadline.",
      "45% increase in marketing opt-in rates.",
      "Onboarding retained under 3 minutes.",
    ],
    certifications: ["DPDP Compliance", "ISO 27001", "SOC 2 Type II"],
  },
];

const LUXURY_RETAIL_CASE_SEED = caseStudiesSeed.find((item) => item.id === "1");

const normalizeCaseStudies = (items: CaseStudyContent[]): CaseStudyContent[] => {
  if (!LUXURY_RETAIL_CASE_SEED) return items;

  return items.map((item) => {
    if (item.id !== "1") return item;

    const looksLegacyLuxuryCase =
      item.title === "Orchestrating Global GDPR Compliance for a Retail Powerhouse" ||
      item.industry === "Retail";

    if (!looksLegacyLuxuryCase) return item;

    return {
      ...LUXURY_RETAIL_CASE_SEED,
      id: item.id,
      date: item.date || LUXURY_RETAIL_CASE_SEED.date,
      imageUrl: item.imageUrl || LUXURY_RETAIL_CASE_SEED.imageUrl,
    };
  });
};

const partnersPageSeed: PartnersPageContent = {
  heroBadge: "Partner Network",
  heroTitle: "Let's build together.",
  heroPrimaryButton: "Become a Partner",
  heroSecondaryButton: "Find a Partner",
  whyPartnerTitle: "Why partner with Proteccio?",
  whyPartnerItems: [
    {
      id: "why-partner-1",
      title: "Win",
      desc: "Expand your portfolio with industry-leading privacy solutions that solve real business challenges.",
      icon: "target",
    },
    {
      id: "why-partner-2",
      title: "Deliver",
      desc: "Provide your clients with seamless, automated data governance to ensure long-term compliance.",
      icon: "shield",
    },
    {
      id: "why-partner-3",
      title: "Grow",
      desc: "Accelerate your recurring revenue through our industry-best co-selling and referral rewards.",
      icon: "rocket",
    },
  ],
  whyProteccioTitle: "Why Proteccio?",
  whyProteccioItems: [
    {
      id: "why-proteccio-1",
      title: "Enterprise Experience",
      desc: "Built for global scale, supporting complex multi-jurisdictional compliance requirements.",
      icon: "globe",
    },
    {
      id: "why-proteccio-2",
      title: "Rapid Velocity",
      desc: "Deploy automated privacy controls in weeks, not months, with our pre-built integrations.",
      icon: "zap",
    },
    {
      id: "why-proteccio-3",
      title: "Dedicated Support",
      desc: "Direct access to our privacy architects and technical support teams to ensure your success.",
      icon: "heart",
    },
  ],
  waysToPartnerTitle: "Ways to partner",
  partnerTiers: [
    {
      id: "consulting",
      title: "Consulting Partners",
      desc: "For agencies, law firms, and boutique consultancies assisting clients with privacy strategy and implementation.",
      logos: [
        { id: "consulting-logo-1", name: "Indian Oil Corporation Limited", url: "/logos/ioil.png" },
        { id: "consulting-logo-2", name: "Bleep", url: "/logos/bleep-new.png" },
        { id: "consulting-logo-3", name: "OneHash", url: "/logos/onehash-new.png" },
        { id: "consulting-logo-4", name: "AdvoTalks", url: "/logos/advotalks-new.png" },
      ],
    },
    {
      id: "technology",
      title: "Technology Partners",
      desc: "For ISVs and SaaS providers looking to embed automated privacy directly into their product ecosystem.",
      logos: [
        { id: "technology-logo-1", name: "OneHash", url: "/logos/onehash-new.png" },
        { id: "technology-logo-2", name: "AdvoTalks", url: "/logos/advotalks-new.png" },
        { id: "technology-logo-3", name: "Indian Oil Corporation Limited", url: "/logos/ioil.png" },
        { id: "technology-logo-4", name: "Bleep", url: "/logos/bleep-new.png" },
      ],
    },
  ],
  becomePartnerTitle: "Become a partner",
  becomePartnerSteps: [
    {
      id: "become-step-1",
      num: "1.",
      title: "Apply",
      desc: "Share your business background and partnership goals with us.",
    },
    {
      id: "become-step-2",
      num: "2.",
      title: "Review",
      desc: "Our team will evaluate the fit and discuss strategic alignment.",
    },
    {
      id: "become-step-3",
      num: "3.",
      title: "Onboard",
      desc: "Get access to our portal, training, and co-selling collateral.",
    },
  ],
  formCompanySizeOptions: [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "500+ employees",
  ],
  formDefaultCountry: "United States",
  formSubmitButton: "Submit Application",
  formSuccessMessage: "Thank you for your interest! Our partnership team will contact you soon.",
  supportTitle: "Still have questions?",
  supportEmail: "hello@protecciodata.com",
};

const CONTENT_KEYS = [
  EVENTS_KEY,
  EVENT_DETAILS_KEY,
  EVENT_IMAGE_HISTORY_KEY,
  CASE_STUDY_IMAGE_HISTORY_KEY,
  CASE_STUDIES_KEY,
  INSIGHT_ARTICLES_KEY,
  INSIGHT_IMAGE_HISTORY_KEY,
  INSIGHT_CAPABILITIES_KEY,
  INSIGHT_EXPERTISE_KEY,
  PARTNERS_PAGE_CONTENT_KEY,
];

const seedByKey: Record<string, unknown> = {
  [EVENTS_KEY]: eventsSeed,
  [EVENT_DETAILS_KEY]: {},
  [EVENT_IMAGE_HISTORY_KEY]: {},
  [CASE_STUDY_IMAGE_HISTORY_KEY]: {},
  [CASE_STUDIES_KEY]: caseStudiesSeed,
  [INSIGHT_ARTICLES_KEY]: insightArticlesSeed,
  [INSIGHT_IMAGE_HISTORY_KEY]: {},
  [INSIGHT_CAPABILITIES_KEY]: insightCapabilitiesSeed,
  [INSIGHT_EXPERTISE_KEY]: insightExpertiseSeed,
  [PARTNERS_PAGE_CONTENT_KEY]: partnersPageSeed,
};

const hydrateFromApi = async () => {
  try {
    const response = await axios.get("/api/site-content", {
      params: { keys: CONTENT_KEYS.join(",") },
    });
    const rows = (response.data as { data?: Array<{ key: string; payload: unknown }> } | undefined)?.data ?? [];
    const map = new Map(rows.map((row) => [row.key, row.payload] as const));
    CONTENT_KEYS.forEach((key) => {
      const payload = map.get(key);
      if (payload !== undefined) {
        inMemoryStore.set(key, deepClone(payload));
      } else if (!inMemoryStore.has(key)) {
        inMemoryStore.set(key, deepClone(seedByKey[key]));
      }
    });
    notify();
  } catch (error) {
    CONTENT_KEYS.forEach((key) => {
      if (!inMemoryStore.has(key)) {
        inMemoryStore.set(key, deepClone(seedByKey[key]));
      }
    });
    console.error("Failed to hydrate content manager data from backend.", error);
  }
};

const startHydration = () => {
  if (hydrationStarted) return;
  hydrationStarted = true;
  void hydrateFromApi();
};

export const contentManagerService = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    startHydration();
    return () => listeners.delete(listener);
  },

  getEvents() {
    return readStore<EventContent[]>(EVENTS_KEY, eventsSeed);
  },
  getEventDetails() {
    return readStore<EventDetailStore>(EVENT_DETAILS_KEY, {});
  },
  getEventDetail(eventId: string) {
    return this.getEventDetails()[eventId];
  },
  saveEventDetail(eventId: string, detail: EventDetailContent) {
    const details = this.getEventDetails();
    writeStore(EVENT_DETAILS_KEY, { ...details, [eventId]: detail });
  },
  deleteEventDetail(eventId: string) {
    const details = this.getEventDetails();
    if (!details[eventId]) return;
    const rest = { ...details };
    delete rest[eventId];
    writeStore(EVENT_DETAILS_KEY, rest);
  },
  saveEvents(events: EventContent[]) {
    writeStore(EVENTS_KEY, events);
  },
  createEvent(input: Omit<EventContent, "id">) {
    const events = this.getEvents();
    const next: EventContent = { ...input, id: crypto.randomUUID(), featured: true };
    const demotedEvents = events.map((event) => ({ ...event, featured: false }));
    this.saveEvents([next, ...demotedEvents]);
    return next;
  },
  updateEvent(id: string, patch: Partial<EventContent>) {
    const current = this.getEvents().find((event) => event.id === id);
    if (current && typeof patch.image === "string" && patch.image && patch.image !== current.image) {
      this.pushEventImageHistory(id, current.image);
    }
    const requestedFeatured = patch.featured === true;
    const events = this.getEvents().map((event) => {
      if (event.id === id) {
        return { ...event, ...patch };
      }
      if (requestedFeatured) {
        return { ...event, featured: false };
      }
      return event;
    });
    this.saveEvents(events);
  },
  deleteEvent(id: string) {
    this.clearEventImageHistory(id);
    this.deleteEventDetail(id);
    this.saveEvents(this.getEvents().filter((event) => event.id !== id));
  },
  getEventImageHistory(eventId: string) {
    const history = readStore<EventImageHistory>(EVENT_IMAGE_HISTORY_KEY, {});
    return history[eventId] ?? [];
  },
  pushEventImageHistory(eventId: string, previousImage: string) {
    if (!previousImage) return;
    const history = readStore<EventImageHistory>(EVENT_IMAGE_HISTORY_KEY, {});
    const next = [previousImage, ...(history[eventId] ?? []).filter((item) => item !== previousImage)].slice(0, 3);
    writeStore(EVENT_IMAGE_HISTORY_KEY, { ...history, [eventId]: next });
  },
  clearEventImageHistory(eventId: string) {
    const history = readStore<EventImageHistory>(EVENT_IMAGE_HISTORY_KEY, {});
    if (!history[eventId]) return;
    const rest = { ...history };
    delete rest[eventId];
    writeStore(EVENT_IMAGE_HISTORY_KEY, rest);
  },

  getCaseStudies() {
    const stored = readStore<CaseStudyContent[]>(CASE_STUDIES_KEY, caseStudiesSeed);
    return normalizeCaseStudies(stored);
  },
  saveCaseStudies(items: CaseStudyContent[]) {
    writeStore(CASE_STUDIES_KEY, items);
  },
  createCaseStudy(input: Omit<CaseStudyContent, "id">) {
    const items = this.getCaseStudies();
    const next: CaseStudyContent = { ...input, id: crypto.randomUUID() };
    this.saveCaseStudies([next, ...items]);
    return next;
  },
  updateCaseStudy(id: string, patch: Partial<CaseStudyContent>) {
    const current = this.getCaseStudies().find((item) => item.id === id);
    if (current && typeof patch.imageUrl === "string" && patch.imageUrl && patch.imageUrl !== current.imageUrl) {
      this.pushCaseStudyImageHistory(id, current.imageUrl);
    }
    const items = this.getCaseStudies().map((item) => (item.id === id ? { ...item, ...patch } : item));
    this.saveCaseStudies(items);
  },
  deleteCaseStudy(id: string) {
    this.clearCaseStudyImageHistory(id);
    this.saveCaseStudies(this.getCaseStudies().filter((item) => item.id !== id));
  },
  getCaseStudyImageHistory(caseStudyId: string) {
    const history = readStore<CaseStudyImageHistory>(CASE_STUDY_IMAGE_HISTORY_KEY, {});
    return history[caseStudyId] ?? [];
  },
  pushCaseStudyImageHistory(caseStudyId: string, previousImage: string) {
    if (!previousImage) return;
    const history = readStore<CaseStudyImageHistory>(CASE_STUDY_IMAGE_HISTORY_KEY, {});
    const next = [previousImage, ...(history[caseStudyId] ?? []).filter((item) => item !== previousImage)].slice(0, 3);
    writeStore(CASE_STUDY_IMAGE_HISTORY_KEY, { ...history, [caseStudyId]: next });
  },
  clearCaseStudyImageHistory(caseStudyId: string) {
    const history = readStore<CaseStudyImageHistory>(CASE_STUDY_IMAGE_HISTORY_KEY, {});
    if (!history[caseStudyId]) return;
    const rest = { ...history };
    delete rest[caseStudyId];
    writeStore(CASE_STUDY_IMAGE_HISTORY_KEY, rest);
  },

  getInsightArticles() {
    return readStore<InsightArticle[]>(INSIGHT_ARTICLES_KEY, insightArticlesSeed);
  },
  saveInsightArticles(items: InsightArticle[]) {
    writeStore(INSIGHT_ARTICLES_KEY, items);
  },
  createInsightArticle(input: Omit<InsightArticle, "id">) {
    const items = this.getInsightArticles();
    const next: InsightArticle = { ...input, id: crypto.randomUUID() };
    this.saveInsightArticles([next, ...items]);
    return next;
  },
  updateInsightArticle(id: string, patch: Partial<InsightArticle>) {
    const current = this.getInsightArticles().find((item) => item.id === id);
    if (current && typeof patch.image === "string" && patch.image && patch.image !== current.image) {
      this.pushInsightImageHistory(id, current.image);
    }
    const items = this.getInsightArticles().map((item) => (item.id === id ? { ...item, ...patch } : item));
    this.saveInsightArticles(items);
  },
  deleteInsightArticle(id: string) {
    this.clearInsightImageHistory(id);
    this.saveInsightArticles(this.getInsightArticles().filter((item) => item.id !== id));
  },
  getInsightImageHistory(insightId: string) {
    const history = readStore<InsightImageHistory>(INSIGHT_IMAGE_HISTORY_KEY, {});
    return history[insightId] ?? [];
  },
  pushInsightImageHistory(insightId: string, previousImage: string) {
    if (!previousImage) return;
    const history = readStore<InsightImageHistory>(INSIGHT_IMAGE_HISTORY_KEY, {});
    const next = [previousImage, ...(history[insightId] ?? []).filter((item) => item !== previousImage)].slice(0, 3);
    writeStore(INSIGHT_IMAGE_HISTORY_KEY, { ...history, [insightId]: next });
  },
  clearInsightImageHistory(insightId: string) {
    const history = readStore<InsightImageHistory>(INSIGHT_IMAGE_HISTORY_KEY, {});
    if (!history[insightId]) return;
    const rest = { ...history };
    delete rest[insightId];
    writeStore(INSIGHT_IMAGE_HISTORY_KEY, rest);
  },

  getInsightCapabilities() {
    return readStore<InsightCapability[]>(INSIGHT_CAPABILITIES_KEY, insightCapabilitiesSeed);
  },
  saveInsightCapabilities(items: InsightCapability[]) {
    writeStore(INSIGHT_CAPABILITIES_KEY, items);
  },

  getInsightExpertise() {
    return readStore<InsightExpertise[]>(INSIGHT_EXPERTISE_KEY, insightExpertiseSeed);
  },
  saveInsightExpertise(items: InsightExpertise[]) {
    writeStore(INSIGHT_EXPERTISE_KEY, items);
  },

  getPartnersPageContent() {
    return readStore<PartnersPageContent>(PARTNERS_PAGE_CONTENT_KEY, partnersPageSeed);
  },
  savePartnersPageContent(content: PartnersPageContent) {
    writeStore(PARTNERS_PAGE_CONTENT_KEY, content);
  },
};
