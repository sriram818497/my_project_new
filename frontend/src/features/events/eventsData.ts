export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  image: string;
  description: string;
  featured?: boolean;
  status: "Upcoming" | "Ongoing";
}

export const events: Event[] = [
  {
    id: "1",
    title: "Global Privacy Summit 2026",
    category: "Global Summit | Hybrid",
    date: "March 15â€“17, 2026",
    location: "London, UK",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
    description:
      "Join industry leaders to discuss the future of AI governance and cross-border data flows.",
    featured: true,
    status: "Upcoming",
  },
  {
    id: "2",
    title: "AI Governance Framework Workshop",
    category: "Workshop | Virtual",
    date: "April 05, 2026",
    location: "Virtual",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070",
    description:
      "A deep dive into operationalizing AI safety and ethics within your enterprise.",
    status: "Upcoming",
  },
  {
    id: "3",
    title: "GDPR Enforcement Trends",
    category: "Webinar | Virtual",
    date: "April 12, 2026",
    location: "Virtual",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2070",
    description:
      "Analyzing the latest regulatory fines and what they mean for compliance teams.",
    status: "Upcoming",
  },
  {
    id: "4",
    title: "Proteccio Customer Connect NYC",
    category: "In-person Event | New York City",
    date: "May 20, 2026",
    location: "New York City",
    image:
      "https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?auto=format&fit=crop&q=80&w=2070",
    description:
      "An exclusive in-person event for Proteccio customers to connect, learn, and engage directly with the Proteccio team.",
    status: "Upcoming",
  },
  {
    id: "5",
    title: "Data Sovereignty in the Cloud Era",
    category: "Thought Leadership Session",
    date: "June 10, 2026",
    location: "Virtual",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2070",
    description:
      "A session exploring how organizations can navigate data sovereignty requirements in an increasingly cloud-driven environment.",
    status: "Upcoming",
  },
  {
    id: "6",
    title: "Cybersecurity & Privacy Convergence",
    category: "Panel Discussion",
    date: "July 08, 2026",
    location: "San Francisco, USA",
    image:
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=2070",
    description:
      "A discussion on the growing convergence of cybersecurity and privacy functions and how organizations can align both effectively.",
    status: "Upcoming",
  },
];

export const filters = [
  "All Industries",
  "All Regions",
  "All Topics",
  "Year 2026",
];

