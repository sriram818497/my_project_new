import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { contentManagerService } from "../../services/contentManager";
import PartnersWithUsManager from "./PartnersWithUsManager";
import AdminSectionIntro from "./AdminSectionIntro";
import type {
  CaseStudyContent,
  EventContent,
  EventDetailContent,
  InsightArticle,
  InsightCapability,
  InsightExpertise,
} from "../../types/content";
import { trackAdminActivity } from "../../utils/adminActivityTracker";
import { buildFallbackEventDetail, eventDetails, mergeEventDetailData } from "../../features/events/eventDetailData";

type Module = "events" | "case-studies" | "insights" | "partners";

const textToLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const linesToText = (value: string[] | undefined) => (value ?? []).join("\n");
const isDataImage = (value: string) => value.startsWith("data:image/");
const detailSeparator = "|";

interface EventDetailFormState {
  status: string;
  time: string;
  hostedBy: string;
  hostImage: string;
  countdownDate: string;
  capacity: string;
  level: string;
  access: string;
  aboutText: string;
  aboutPurpose: string;
  aboutUseCasesText: string;
  aboutImportance: string;
  whyTrendsText: string;
  whyRegulatory: string;
  whoShouldAttendText: string;
  benefitsText: string;
  agendaText: string;
  speakersText: string;
  faqsText: string;
}

interface CaseStudyDetailFormState {
  overview: string;
  challengesText: string;
  solutionText: string;
  outcomesText: string;
  certificationsText: string;
  timelineRows: Array<{ phase: string; title: string; duration: string }>;
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialRole: string;
}

const createEmptyEventDetailForm = (): EventDetailFormState => ({
  status: "",
  time: "",
  hostedBy: "",
  hostImage: "",
  countdownDate: "",
  capacity: "",
  level: "",
  access: "",
  aboutText: "",
  aboutPurpose: "",
  aboutUseCasesText: "",
  aboutImportance: "",
  whyTrendsText: "",
  whyRegulatory: "",
  whoShouldAttendText: "",
  benefitsText: "",
  agendaText: "",
  speakersText: "",
  faqsText: "",
});

const createEmptyCaseStudyDetailForm = (): CaseStudyDetailFormState => ({
  overview: "",
  challengesText: "",
  solutionText: "",
  outcomesText: "",
  certificationsText: "",
  timelineRows: [{ phase: "", title: "", duration: "" }],
  testimonialQuote: "",
  testimonialAuthor: "",
  testimonialRole: "",
});

const splitDetailLine = (line: string) => line.split(detailSeparator).map((part) => part.trim());

const parseSimpleDetailItems = (value: string) =>
  textToLines(value)
    .map((line) => {
      const [title = "", description = ""] = splitDetailLine(line);
      if (!title || !description) return null;
      return { title, description };
    })
    .filter((item): item is { title: string; description: string } => Boolean(item));

const parseAgendaItems = (value: string): EventDetailContent["agenda"] =>
  textToLines(value)
    .map((line) => {
      const [time = "", title = "", description = ""] = splitDetailLine(line);
      if (!time || !title || !description) return null;
      return { time, title, description };
    })
    .filter((item): item is NonNullable<EventDetailContent["agenda"]>[number] => Boolean(item));

const parseSpeakerItems = (value: string): EventDetailContent["speakers"] =>
  textToLines(value)
    .map((line) => {
      const [name = "", designation = "", company = "", bio = "", image = "", linkedin = "", twitter = ""] = splitDetailLine(line);
      if (!name || !designation || !company || !bio || !image) return null;
      return {
        name,
        designation,
        company,
        bio,
        image,
        linkedin: linkedin || undefined,
        twitter: twitter || undefined,
      };
    })
    .filter((item): item is NonNullable<EventDetailContent["speakers"]>[number] => Boolean(item));

const parseFaqItems = (value: string): EventDetailContent["faqs"] =>
  textToLines(value)
    .map((line) => {
      const [question = "", answer = ""] = splitDetailLine(line);
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((item): item is NonNullable<EventDetailContent["faqs"]>[number] => Boolean(item));

const formatAgendaItems = (value: EventDetailContent["agenda"]) =>
  (value ?? []).map((item) => `${item.time} ${detailSeparator} ${item.title} ${detailSeparator} ${item.description}`).join("\n");

const formatSpeakerItems = (value: EventDetailContent["speakers"]) =>
  (value ?? [])
    .map((item) =>
      [item.name, item.designation, item.company, item.bio, item.image, item.linkedin ?? "", item.twitter ?? ""].join(
        ` ${detailSeparator} `
      )
    )
    .join("\n");

const formatFaqItems = (value: EventDetailContent["faqs"]) =>
  (value ?? []).map((item) => `${item.question} ${detailSeparator} ${item.answer}`).join("\n");

const reorderByIndex = <T,>(items: T[], fromIndex: number, toIndex: number) => {
  if (fromIndex === toIndex) return items;
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

const ContentOperationsManager = () => {
  const [module, setModule] = useState<Module>("events");
  const [events, setEvents] = useState<EventContent[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudyContent[]>([]);
  const [insightArticles, setInsightArticles] = useState<InsightArticle[]>([]);
  const [insightCapabilities, setInsightCapabilities] = useState<InsightCapability[]>([]);
  const [insightExpertise, setInsightExpertise] = useState<InsightExpertise[]>([]);
  const [query, setQuery] = useState("");

  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventImageMode, setEventImageMode] = useState<"url" | "upload">("url");
  const [eventImageFileName, setEventImageFileName] = useState("");
  const [eventPreviousImage, setEventPreviousImage] = useState<string | null>(null);
  const [eventImageHistory, setEventImageHistory] = useState<string[]>([]);
  const [eventForm, setEventForm] = useState<Omit<EventContent, "id">>({
    title: "",
    category: "",
    date: "",
    location: "",
    image: "",
    description: "",
    featured: false,
    status: "Upcoming",
  });
  const [selectedEventDetailId, setSelectedEventDetailId] = useState("");
  const [eventDetailForm, setEventDetailForm] = useState<EventDetailFormState>(createEmptyEventDetailForm);

  const [editingCaseStudyId, setEditingCaseStudyId] = useState<string | null>(null);
  const [caseStudyImageMode, setCaseStudyImageMode] = useState<"url" | "upload">("url");
  const [caseStudyImageFileName, setCaseStudyImageFileName] = useState("");
  const [caseStudyPreviousImage, setCaseStudyPreviousImage] = useState<string | null>(null);
  const [caseStudyImageHistory, setCaseStudyImageHistory] = useState<string[]>([]);
  const [selectedCaseStudyDetailId, setSelectedCaseStudyDetailId] = useState("");
  const [caseStudyDetailForm, setCaseStudyDetailForm] = useState<CaseStudyDetailFormState>(createEmptyCaseStudyDetailForm);
  const [caseStudyForm, setCaseStudyForm] = useState({
    industry: "",
    regulation: "",
    solutionType: "",
    assetType: "Case Study" as CaseStudyContent["assetType"],
    title: "",
    description: "",
    date: "",
    imageUrl: "",
    overview: "",
    challengesText: "",
    solutionText: "",
    outcomesText: "",
    certificationsText: "",
  });

  const [editingInsightId, setEditingInsightId] = useState<string | null>(null);
  const [insightImageMode, setInsightImageMode] = useState<"url" | "upload">("url");
  const [insightImageFileName, setInsightImageFileName] = useState("");
  const [insightPreviousImage, setInsightPreviousImage] = useState<string | null>(null);
  const [insightImageHistory, setInsightImageHistory] = useState<string[]>([]);
  const [draggedCapabilityIndex, setDraggedCapabilityIndex] = useState<number | null>(null);
  const [draggedExpertiseIndex, setDraggedExpertiseIndex] = useState<number | null>(null);
  const [insightForm, setInsightForm] = useState<Omit<InsightArticle, "id">>({
    category: "",
    image: "",
    title: "",
    date: "",
  });

  const refresh = () => {
    setEvents(contentManagerService.getEvents());
    setCaseStudies(contentManagerService.getCaseStudies());
    setInsightArticles(contentManagerService.getInsightArticles());
    setInsightCapabilities(contentManagerService.getInsightCapabilities());
    setInsightExpertise(contentManagerService.getInsightExpertise());
  };

  useEffect(() => {
    refresh();
    return contentManagerService.subscribe(refresh);
  }, []);

  useEffect(() => {
    if (selectedEventDetailId && events.some((event) => event.id === selectedEventDetailId)) return;
    if (!events.length) return;
    setSelectedEventDetailId(events[0].id);
  }, [events, selectedEventDetailId]);

  useEffect(() => {
    if (selectedCaseStudyDetailId && caseStudies.some((item) => item.id === selectedCaseStudyDetailId)) return;
    if (!caseStudies.length) return;
    setSelectedCaseStudyDetailId(caseStudies[0].id);
  }, [caseStudies, selectedCaseStudyDetailId]);

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((item) => [item.title, item.category, item.location, item.description].some((v) => v.toLowerCase().includes(q)));
  }, [events, query]);

  const filteredCaseStudies = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return caseStudies;
    return caseStudies.filter((item) => [item.title, item.industry, item.regulation, item.solutionType].some((v) => v.toLowerCase().includes(q)));
  }, [caseStudies, query]);

  const filteredInsights = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return insightArticles;
    return insightArticles.filter((item) => [item.title, item.category, item.date].some((v) => v.toLowerCase().includes(q)));
  }, [insightArticles, query]);

  const loadEventDetailForm = useCallback((eventId: string) => {
    const selectedEvent = events.find((item) => item.id === eventId);
    const baseDetail = eventDetails[eventId] ?? (selectedEvent ? buildFallbackEventDetail(selectedEvent) : undefined);
    const overrideDetail = contentManagerService.getEventDetail(eventId);
    const detail = baseDetail ? mergeEventDetailData(baseDetail, overrideDetail) : undefined;

    if (!detail) {
      setEventDetailForm(createEmptyEventDetailForm());
      return;
    }

    const whoShouldAttendText = (detail.whoShouldAttend ?? [])
      .map((item) => `${item.title} ${detailSeparator} ${item.description}`)
      .join("\n");
    const benefitsText = (detail.benefits ?? [])
      .map((item) => `${item.title} ${detailSeparator} ${item.description}`)
      .join("\n");

    setEventDetailForm({
      status: detail.status ?? "",
      time: detail.time ?? "",
      hostedBy: detail.hostedBy ?? "",
      hostImage: detail.hostImage ?? "",
      countdownDate: detail.countdownDate ?? "",
      capacity: detail.capacity ?? "",
      level: detail.level ?? "",
      access: detail.access ?? "",
      aboutText: detail.about.text ?? "",
      aboutPurpose: detail.about.purpose ?? "",
      aboutUseCasesText: linesToText(detail.about.useCases),
      aboutImportance: detail.about.importance ?? "",
      whyTrendsText: linesToText(detail.whyMatters.trends),
      whyRegulatory: detail.whyMatters.regulatory ?? "",
      whoShouldAttendText,
      benefitsText,
      agendaText: formatAgendaItems(detail.agenda),
      speakersText: formatSpeakerItems(detail.speakers),
      faqsText: formatFaqItems(detail.faqs),
    });
  }, [events]);

  const loadCaseStudyDetailForm = useCallback((caseStudyId: string) => {
    const item = caseStudies.find((entry) => entry.id === caseStudyId);
    if (!item) {
      setCaseStudyDetailForm(createEmptyCaseStudyDetailForm());
      return;
    }
    setCaseStudyDetailForm({
      overview: item.overview ?? "",
      challengesText: linesToText(item.challenges),
      solutionText: linesToText(item.solution_detail),
      outcomesText: linesToText(item.outcomes),
      certificationsText: linesToText(item.certifications),
      timelineRows:
        item.timeline && item.timeline.length > 0
          ? item.timeline.map((timelineItem) => ({
              phase: timelineItem.phase,
              title: timelineItem.title,
              duration: timelineItem.duration,
            }))
          : [{ phase: "", title: "", duration: "" }],
      testimonialQuote: item.testimonial?.quote ?? "",
      testimonialAuthor: item.testimonial?.author ?? "",
      testimonialRole: item.testimonial?.role ?? "",
    });
  }, [caseStudies]);

  useEffect(() => {
    if (!selectedEventDetailId) return;
    loadEventDetailForm(selectedEventDetailId);
  }, [selectedEventDetailId, loadEventDetailForm]);

  useEffect(() => {
    if (!selectedCaseStudyDetailId) return;
    loadCaseStudyDetailForm(selectedCaseStudyDetailId);
  }, [selectedCaseStudyDetailId, loadCaseStudyDetailForm]);

  const resetEventForm = () => {
    setEditingEventId(null);
    setEventImageMode("url");
    setEventImageFileName("");
    setEventPreviousImage(null);
    setEventImageHistory([]);
    setEventForm({
      title: "",
      category: "",
      date: "",
      location: "",
      image: "",
      description: "",
      featured: false,
      status: "Upcoming",
    });
  };

  const resetCaseStudyForm = () => {
    setEditingCaseStudyId(null);
    setCaseStudyImageMode("url");
    setCaseStudyImageFileName("");
    setCaseStudyPreviousImage(null);
    setCaseStudyImageHistory([]);
    setCaseStudyForm({
      industry: "",
      regulation: "",
      solutionType: "",
      assetType: "Case Study",
      title: "",
      description: "",
      date: "",
      imageUrl: "",
      overview: "",
      challengesText: "",
      solutionText: "",
      outcomesText: "",
      certificationsText: "",
    });
  };

  const resetInsightForm = () => {
    setEditingInsightId(null);
    setInsightImageMode("url");
    setInsightImageFileName("");
    setInsightPreviousImage(null);
    setInsightImageHistory([]);
    setInsightForm({
      category: "",
      image: "",
      title: "",
      date: "",
    });
  };

  const saveEvent = () => {
    if (!eventForm.title || !eventForm.category || !eventForm.date || !eventForm.location || !eventForm.image) return;
    const isUpdate = Boolean(editingEventId);
    if (editingEventId) {
      contentManagerService.updateEvent(editingEventId, eventForm);
    } else {
      contentManagerService.createEvent(eventForm);
    }
    trackAdminActivity({
      title: isUpdate ? "Event updated" : "Event created",
      detail: `${eventForm.title} was ${isUpdate ? "updated" : "created"} in Content Operations.`,
      tone: "success",
      processId: "content-operations",
      completedStepDelta: 1,
      started: true,
    });
    resetEventForm();
  };

  const resetEventDetailForm = () => {
    if (selectedEventDetailId) {
      loadEventDetailForm(selectedEventDetailId);
      return;
    }
    setEventDetailForm(createEmptyEventDetailForm());
  };

  const saveEventDetail = () => {
    if (!selectedEventDetailId) return;
    const payload: EventDetailContent = {};
    const statusValue = eventDetailForm.status.trim();
    const time = eventDetailForm.time.trim();
    const hostedBy = eventDetailForm.hostedBy.trim();
    const hostImage = eventDetailForm.hostImage.trim();
    const countdownDate = eventDetailForm.countdownDate.trim();
    const capacity = eventDetailForm.capacity.trim();
    const level = eventDetailForm.level.trim();
    const access = eventDetailForm.access.trim();
    const aboutText = eventDetailForm.aboutText.trim();
    const aboutPurpose = eventDetailForm.aboutPurpose.trim();
    const aboutUseCases = textToLines(eventDetailForm.aboutUseCasesText);
    const aboutImportance = eventDetailForm.aboutImportance.trim();
    const whyTrends = textToLines(eventDetailForm.whyTrendsText);
    const whyRegulatory = eventDetailForm.whyRegulatory.trim();
    const whoShouldAttend = parseSimpleDetailItems(eventDetailForm.whoShouldAttendText);
    const benefits = parseSimpleDetailItems(eventDetailForm.benefitsText);
    const agenda = parseAgendaItems(eventDetailForm.agendaText);
    const speakers = parseSpeakerItems(eventDetailForm.speakersText);
    const faqs = parseFaqItems(eventDetailForm.faqsText);

    if (statusValue) payload.status = statusValue as EventDetailContent["status"];
    if (time) payload.time = time;
    if (hostedBy) payload.hostedBy = hostedBy;
    if (hostImage) payload.hostImage = hostImage;
    if (countdownDate) payload.countdownDate = countdownDate;
    if (capacity) payload.capacity = capacity;
    if (level) payload.level = level;
    if (access) payload.access = access;
    if (aboutText) payload.aboutText = aboutText;
    if (aboutPurpose) payload.aboutPurpose = aboutPurpose;
    if (aboutUseCases.length) payload.aboutUseCases = aboutUseCases;
    if (aboutImportance) payload.aboutImportance = aboutImportance;
    if (whyTrends.length) payload.whyTrends = whyTrends;
    if (whyRegulatory) payload.whyRegulatory = whyRegulatory;
    if (whoShouldAttend.length) payload.whoShouldAttend = whoShouldAttend;
    if (benefits.length) payload.benefits = benefits;
    if (agenda.length) payload.agenda = agenda;
    if (speakers.length) payload.speakers = speakers;
    if (faqs.length) payload.faqs = faqs;

    contentManagerService.saveEventDetail(selectedEventDetailId, payload);
    trackAdminActivity({
      title: "Event detail page updated",
      detail: `Detail page content for event ${selectedEventDetailId} was updated.`,
      tone: "success",
      processId: "content-operations",
      completedStepDelta: 1,
      started: true,
    });
  };

  const clearEventDetail = () => {
    if (!selectedEventDetailId) return;
    contentManagerService.deleteEventDetail(selectedEventDetailId);
    setEventDetailForm(createEmptyEventDetailForm());
    trackAdminActivity({
      title: "Event detail page reset",
      detail: `Detail page override for event ${selectedEventDetailId} was removed.`,
      tone: "review",
      processId: "content-operations",
      completedStepDelta: 1,
      started: true,
    });
  };

  const handleEventImageUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) return;
      setEventImageMode("upload");
      setEventImageFileName(file.name);
      setEventForm((prev) => ({ ...prev, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const saveCaseStudy = () => {
    if (!caseStudyForm.title || !caseStudyForm.industry || !caseStudyForm.regulation || !caseStudyForm.solutionType) return;
    const isUpdate = Boolean(editingCaseStudyId);
    const payload: Omit<CaseStudyContent, "id"> = {
      industry: caseStudyForm.industry,
      regulation: caseStudyForm.regulation,
      solutionType: caseStudyForm.solutionType,
      assetType: caseStudyForm.assetType,
      title: caseStudyForm.title,
      description: caseStudyForm.description,
      date: caseStudyForm.date || "TBD",
      imageUrl: caseStudyForm.imageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      overview: caseStudyForm.overview || caseStudyForm.description,
      challenges: textToLines(caseStudyForm.challengesText),
      solution_detail: textToLines(caseStudyForm.solutionText),
      outcomes: textToLines(caseStudyForm.outcomesText),
      certifications: textToLines(caseStudyForm.certificationsText),
    };
    if (editingCaseStudyId) {
      contentManagerService.updateCaseStudy(editingCaseStudyId, payload);
    } else {
      contentManagerService.createCaseStudy(payload);
    }
    trackAdminActivity({
      title: isUpdate ? "Case study updated" : "Case study created",
      detail: `${caseStudyForm.title} was ${isUpdate ? "updated" : "created"} in Content Operations.`,
      tone: "success",
      processId: "content-operations",
      completedStepDelta: 1,
      started: true,
    });
    resetCaseStudyForm();
  };

  const handleCaseStudyImageUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) return;
      setCaseStudyImageMode("upload");
      setCaseStudyImageFileName(file.name);
      setCaseStudyForm((prev) => ({ ...prev, imageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const saveCaseStudyDetail = () => {
    if (!selectedCaseStudyDetailId) return;
    const overview = caseStudyDetailForm.overview.trim();
    const challenges = textToLines(caseStudyDetailForm.challengesText);
    const solution_detail = textToLines(caseStudyDetailForm.solutionText);
    const outcomes = textToLines(caseStudyDetailForm.outcomesText);
    const certifications = textToLines(caseStudyDetailForm.certificationsText);
    const timeline = caseStudyDetailForm.timelineRows
      .map((row) => ({
        phase: row.phase.trim(),
        title: row.title.trim(),
        duration: row.duration.trim(),
      }))
      .filter((row) => row.phase && row.title && row.duration);
    const quote = caseStudyDetailForm.testimonialQuote.trim();
    const author = caseStudyDetailForm.testimonialAuthor.trim();
    const role = caseStudyDetailForm.testimonialRole.trim();

    contentManagerService.updateCaseStudy(selectedCaseStudyDetailId, {
      overview,
      challenges,
      solution_detail,
      outcomes,
      certifications,
      timeline,
      testimonial: quote && author && role ? { quote, author, role } : undefined,
    });
    trackAdminActivity({
      title: "Case study detail page updated",
      detail: `Inner detail page content for case study ${selectedCaseStudyDetailId} was updated.`,
      tone: "success",
      processId: "content-operations",
      completedStepDelta: 1,
      started: true,
    });
  };

  const resetCaseStudyDetailForm = () => {
    if (!selectedCaseStudyDetailId) {
      setCaseStudyDetailForm(createEmptyCaseStudyDetailForm());
      return;
    }
    loadCaseStudyDetailForm(selectedCaseStudyDetailId);
  };

  const addCaseStudyTimelineRow = () => {
    setCaseStudyDetailForm((prev) => ({
      ...prev,
      timelineRows: [...prev.timelineRows, { phase: "", title: "", duration: "" }],
    }));
  };

  const removeCaseStudyTimelineRow = (index: number) => {
    setCaseStudyDetailForm((prev) => {
      const nextRows = prev.timelineRows.filter((_, rowIndex) => rowIndex !== index);
      return {
        ...prev,
        timelineRows: nextRows.length ? nextRows : [{ phase: "", title: "", duration: "" }],
      };
    });
  };

  const saveInsight = () => {
    if (!insightForm.title || !insightForm.category || !insightForm.image || !insightForm.date) return;
    const isUpdate = Boolean(editingInsightId);
    if (editingInsightId) {
      contentManagerService.updateInsightArticle(editingInsightId, insightForm);
    } else {
      contentManagerService.createInsightArticle(insightForm);
    }
    trackAdminActivity({
      title: isUpdate ? "Insight updated" : "Insight created",
      detail: `${insightForm.title} was ${isUpdate ? "updated" : "created"} in Content Operations.`,
      tone: "success",
      processId: "content-operations",
      completedStepDelta: 1,
      started: true,
    });
    resetInsightForm();
  };

  const handleInsightImageUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) return;
      setInsightImageMode("upload");
      setInsightImageFileName(file.name);
      setInsightForm((prev) => ({ ...prev, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const saveInsightStructure = () => {
    contentManagerService.saveInsightCapabilities(insightCapabilities);
    contentManagerService.saveInsightExpertise(insightExpertise);
    trackAdminActivity({
      title: "Insight structure saved",
      detail: "Capabilities and expertise blocks were updated.",
      tone: "review",
      processId: "content-operations",
      completedStepDelta: 1,
      started: true,
    });
  };

  const startCapabilityDrag = (index: number) => setDraggedCapabilityIndex(index);
  const dropCapabilityAt = (index: number) => {
    setInsightCapabilities((prev) => {
      if (draggedCapabilityIndex === null) return prev;
      return reorderByIndex(prev, draggedCapabilityIndex, index);
    });
    setDraggedCapabilityIndex(null);
  };

  const startExpertiseDrag = (index: number) => setDraggedExpertiseIndex(index);
  const dropExpertiseAt = (index: number) => {
    setInsightExpertise((prev) => {
      if (draggedExpertiseIndex === null) return prev;
      return reorderByIndex(prev, draggedExpertiseIndex, index);
    });
    setDraggedExpertiseIndex(null);
  };

  const deleteEvent = (id: string, title: string) => {
    contentManagerService.deleteEvent(id);
    trackAdminActivity({
      title: "Event deleted",
      detail: `${title} was removed from Content Operations.`,
      tone: "risk",
      processId: "content-operations",
      completedStepDelta: 1,
      started: true,
    });
  };

  const deleteCaseStudy = (id: string, title: string) => {
    contentManagerService.deleteCaseStudy(id);
    trackAdminActivity({
      title: "Case study deleted",
      detail: `${title} was removed from Content Operations.`,
      tone: "risk",
      processId: "content-operations",
      completedStepDelta: 1,
      started: true,
    });
  };

  const deleteInsight = (id: string, title: string) => {
    contentManagerService.deleteInsightArticle(id);
    trackAdminActivity({
      title: "Insight deleted",
      detail: `${title} was removed from Content Operations.`,
      tone: "risk",
      processId: "content-operations",
      completedStepDelta: 1,
      started: true,
    });
  };

  const selectModule = (nextModule: Module) => {
    setModule(nextModule);
    const moduleLabel =
      nextModule === "events"
        ? "Events"
        : nextModule === "case-studies"
        ? "Case Studies"
        : nextModule === "insights"
        ? "Insights"
        : "Partners With Us";
    trackAdminActivity({
      title: `Opened ${moduleLabel} module`,
      detail: `Admin switched Content Operations to ${moduleLabel}.`,
      tone: "review",
      processId: "content-operations",
      started: true,
    });
  };

  return (
    <div className="space-y-6 content-operations-console">
      <AdminSectionIntro
        title="Content Operations"
        subtitle="Control events, case studies, insights, and partner-facing narratives from one governance workspace."
        icon={FileText}
        badge="Content Governance"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => selectModule("events")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border ${module === "events" ? "bg-[#1cd35c] text-white border-[#1cd35c]" : "border-gray-200 text-gray-600"}`}
          >
            Events
          </button>
          <button
            onClick={() => selectModule("case-studies")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border ${module === "case-studies" ? "bg-[#1cd35c] text-white border-[#1cd35c]" : "border-gray-200 text-gray-600"}`}
          >
            Case Studies
          </button>
          <button
            onClick={() => selectModule("insights")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border ${module === "insights" ? "bg-[#1cd35c] text-white border-[#1cd35c]" : "border-gray-200 text-gray-600"}`}
          >
            Insights
          </button>
          <button
            onClick={() => selectModule("partners")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border ${module === "partners" ? "bg-[#1cd35c] text-white border-[#1cd35c]" : "border-gray-200 text-gray-600"}`}
          >
            Partners With Us
          </button>
        </div>
        {module !== "partners" && (
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search content..."
            className="w-full md:w-72 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1cd35c]/40"
          />
        )}
      </div>

      {module === "events" && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xl font-black text-[#0f172a]">{editingEventId ? "Edit Event" : "Create Event"}</h4>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Category" value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} />
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Date (e.g. June 10, 2026)" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Location" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} />
            <div className="rounded-xl border border-gray-200 p-3 space-y-3">
              <p className="text-sm font-semibold text-[#0f172a]">Event Image</p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEventImageMode("url")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    eventImageMode === "url"
                      ? "bg-[#1cd35c] text-white border-[#1cd35c]"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  Use URL
                </button>
                <button
                  type="button"
                  onClick={() => setEventImageMode("upload")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    eventImageMode === "upload"
                      ? "bg-[#1cd35c] text-white border-[#1cd35c]"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  Upload from PC
                </button>
              </div>

              {eventImageMode === "url" ? (
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
                  placeholder="Image URL"
                  value={eventImageMode === "url" ? eventForm.image : ""}
                  onChange={(e) => {
                    setEventForm({ ...eventForm, image: e.target.value });
                    setEventImageFileName("");
                  }}
                />
              ) : (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                    onChange={(e) => handleEventImageUpload(e.target.files?.[0] ?? null)}
                  />
                  {eventImageFileName && (
                    <p className="text-xs text-gray-500">
                      Selected file: <span className="font-semibold text-gray-700">{eventImageFileName}</span>
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {editingEventId && eventPreviousImage && (
                  <div className="rounded-xl border border-gray-200 p-2">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Current saved image</p>
                    <img
                      src={eventPreviousImage}
                      alt="Current event"
                      className="w-full h-28 object-cover rounded-lg border border-gray-100"
                    />
                  </div>
                )}
                {eventForm.image && (
                  <div className="rounded-xl border border-gray-200 p-2">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Selected image preview</p>
                    <img
                      src={eventForm.image}
                      alt="Selected event"
                      className="w-full h-28 object-cover rounded-lg border border-gray-100"
                    />
                  </div>
                )}
              </div>

              {editingEventId && eventPreviousImage && eventForm.image && eventForm.image !== eventPreviousImage && (
                <button
                  type="button"
                  onClick={() => {
                    setEventForm((prev) => ({ ...prev, image: eventPreviousImage }));
                    setEventImageMode(isDataImage(eventPreviousImage) ? "upload" : "url");
                    setEventImageFileName("");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700"
                >
                  Use Previous Image
                </button>
              )}

              {editingEventId && eventImageHistory.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600">Previous saved images (last 3 changes)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {eventImageHistory.map((historyImage, index) => (
                      <button
                        key={`${editingEventId}-history-${index}`}
                        type="button"
                        onClick={() => {
                          setEventForm((prev) => ({ ...prev, image: historyImage }));
                          setEventImageMode(isDataImage(historyImage) ? "upload" : "url");
                          setEventImageFileName("");
                        }}
                        className="rounded-lg border border-gray-200 p-1.5 text-left hover:border-[#1cd35c]/50 transition-colors"
                        title={`Use version ${index + 1}`}
                      >
                        <img
                          src={historyImage}
                          alt={`Previous event version ${index + 1}`}
                          className="w-full h-16 object-cover rounded-md border border-gray-100"
                        />
                        <span className="block text-[11px] font-semibold text-gray-600 mt-1">
                          Version {index + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <textarea className="w-full min-h-[100px] border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Description" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
            <div className="flex items-center gap-4">
              <select className="border border-gray-200 rounded-xl px-3 py-2.5" value={eventForm.status} onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as EventContent["status"] })}>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
              </select>
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                <input type="checkbox" checked={Boolean(eventForm.featured)} onChange={(e) => setEventForm({ ...eventForm, featured: e.target.checked })} />
                Featured Event
              </label>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={saveEvent} className="px-4 py-2.5 rounded-xl bg-[#1cd35c] text-white font-semibold">{editingEventId ? "Update Event" : "Create Event"}</button>
              <button onClick={resetEventForm} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold">Reset</button>
            </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h4 className="text-xl font-black text-[#0f172a] mb-4">Events List</h4>
              <div className="space-y-3 max-h-[560px] overflow-y-auto">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-xl p-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0f172a]">{event.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.category} | {event.date} | {event.location}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingEventId(event.id);
                          setSelectedEventDetailId(event.id);
                          const rest = { ...event };
                          delete (rest as { id?: string }).id;
                          setEventForm(rest);
                          setEventPreviousImage(event.image);
                          setEventImageHistory(contentManagerService.getEventImageHistory(event.id));
                          setEventImageFileName("");
                          setEventImageMode(isDataImage(event.image) ? "upload" : "url");
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-700"
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteEvent(event.id, event.title)} className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-600">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-xl font-black text-[#0f172a]">Event Detail Page Content (Inside Card View)</h4>
                <p className="text-sm text-gray-500">
                  This section controls content shown after clicking an event card. Leave fields blank to keep existing page content.
                </p>
              </div>
              <select
                className="min-w-64 border border-gray-200 rounded-xl px-3 py-2.5"
                value={selectedEventDetailId}
                onChange={(e) => setSelectedEventDetailId(e.target.value)}
              >
                <option value="">Select Event Card</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                className="border border-gray-200 rounded-xl px-3 py-2.5"
                value={eventDetailForm.status}
                onChange={(e) => setEventDetailForm((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="">Status (keep existing)</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Live Now">Live Now</option>
                <option value="Early Bird">Early Bird</option>
                <option value="Closing Soon">Closing Soon</option>
              </select>
              <input
                className="border border-gray-200 rounded-xl px-3 py-2.5"
                placeholder="Time (e.g. All Day Event)"
                value={eventDetailForm.time}
                onChange={(e) => setEventDetailForm((prev) => ({ ...prev, time: e.target.value }))}
              />
              <input
                className="border border-gray-200 rounded-xl px-3 py-2.5"
                placeholder="Hosted By"
                value={eventDetailForm.hostedBy}
                onChange={(e) => setEventDetailForm((prev) => ({ ...prev, hostedBy: e.target.value }))}
              />
              <input
                className="border border-gray-200 rounded-xl px-3 py-2.5"
                placeholder="Host Image URL"
                value={eventDetailForm.hostImage}
                onChange={(e) => setEventDetailForm((prev) => ({ ...prev, hostImage: e.target.value }))}
              />
              <input
                className="border border-gray-200 rounded-xl px-3 py-2.5"
                placeholder="Countdown Date (e.g. March 15, 2026 09:00:00)"
                value={eventDetailForm.countdownDate}
                onChange={(e) => setEventDetailForm((prev) => ({ ...prev, countdownDate: e.target.value }))}
              />
              <input
                className="border border-gray-200 rounded-xl px-3 py-2.5"
                placeholder="Capacity"
                value={eventDetailForm.capacity}
                onChange={(e) => setEventDetailForm((prev) => ({ ...prev, capacity: e.target.value }))}
              />
              <input
                className="border border-gray-200 rounded-xl px-3 py-2.5"
                placeholder="Level"
                value={eventDetailForm.level}
                onChange={(e) => setEventDetailForm((prev) => ({ ...prev, level: e.target.value }))}
              />
              <input
                className="border border-gray-200 rounded-xl px-3 py-2.5"
                placeholder="Access"
                value={eventDetailForm.access}
                onChange={(e) => setEventDetailForm((prev) => ({ ...prev, access: e.target.value }))}
              />
            </div>

            <textarea
              className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="About Text"
              value={eventDetailForm.aboutText}
              onChange={(e) => setEventDetailForm((prev) => ({ ...prev, aboutText: e.target.value }))}
            />
            <textarea
              className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="About Purpose"
              value={eventDetailForm.aboutPurpose}
              onChange={(e) => setEventDetailForm((prev) => ({ ...prev, aboutPurpose: e.target.value }))}
            />
            <textarea
              className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="About Use Cases (one per line)"
              value={eventDetailForm.aboutUseCasesText}
              onChange={(e) => setEventDetailForm((prev) => ({ ...prev, aboutUseCasesText: e.target.value }))}
            />
            <textarea
              className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="About Importance"
              value={eventDetailForm.aboutImportance}
              onChange={(e) => setEventDetailForm((prev) => ({ ...prev, aboutImportance: e.target.value }))}
            />
            <textarea
              className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Why Trends (one per line)"
              value={eventDetailForm.whyTrendsText}
              onChange={(e) => setEventDetailForm((prev) => ({ ...prev, whyTrendsText: e.target.value }))}
            />
            <textarea
              className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Why Regulatory Text"
              value={eventDetailForm.whyRegulatory}
              onChange={(e) => setEventDetailForm((prev) => ({ ...prev, whyRegulatory: e.target.value }))}
            />

            <div className="rounded-xl border border-gray-200 p-3 text-xs text-gray-500">
              <p>
                For next fields, use "{detailSeparator}" as separator.
              </p>
              <p>Who Should Attend / Benefits: Title {detailSeparator} Description</p>
              <p>Agenda: Time {detailSeparator} Title {detailSeparator} Description</p>
              <p>Speakers: Name {detailSeparator} Designation {detailSeparator} Company {detailSeparator} Bio {detailSeparator} ImageURL {detailSeparator} LinkedIn(optional) {detailSeparator} Twitter(optional)</p>
              <p>FAQs: Question {detailSeparator} Answer</p>
            </div>

            <textarea
              className="w-full min-h-[96px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Who Should Attend (one per line)"
              value={eventDetailForm.whoShouldAttendText}
              onChange={(e) => setEventDetailForm((prev) => ({ ...prev, whoShouldAttendText: e.target.value }))}
            />
            <textarea
              className="w-full min-h-[96px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Benefits (one per line)"
              value={eventDetailForm.benefitsText}
              onChange={(e) => setEventDetailForm((prev) => ({ ...prev, benefitsText: e.target.value }))}
            />
            <textarea
              className="w-full min-h-[96px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Agenda (one per line)"
              value={eventDetailForm.agendaText}
              onChange={(e) => setEventDetailForm((prev) => ({ ...prev, agendaText: e.target.value }))}
            />
            <textarea
              className="w-full min-h-[120px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Speakers (one per line)"
              value={eventDetailForm.speakersText}
              onChange={(e) => setEventDetailForm((prev) => ({ ...prev, speakersText: e.target.value }))}
            />
            <textarea
              className="w-full min-h-[96px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="FAQs (one per line)"
              value={eventDetailForm.faqsText}
              onChange={(e) => setEventDetailForm((prev) => ({ ...prev, faqsText: e.target.value }))}
            />

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={saveEventDetail} className="px-4 py-2.5 rounded-xl bg-[#1cd35c] text-white font-semibold">
                Save Detail Page
              </button>
              <button
                onClick={() => selectedEventDetailId && window.open(`/events/${selectedEventDetailId}`, "_blank", "noopener,noreferrer")}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!selectedEventDetailId}
              >
                Preview Detail Page
              </button>
              <button onClick={resetEventDetailForm} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold">
                Reset Detail Form
              </button>
              <button onClick={clearEventDetail} className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold">
                Remove Saved Detail Override
              </button>
            </div>
          </div>
        </>
      )}

      {module === "case-studies" && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xl font-black text-[#0f172a]">{editingCaseStudyId ? "Edit Case Study" : "Create Case Study"}</h4>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Title" value={caseStudyForm.title} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, title: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input className="border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Industry" value={caseStudyForm.industry} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, industry: e.target.value })} />
              <input className="border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Regulation" value={caseStudyForm.regulation} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, regulation: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input className="border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Solution Type" value={caseStudyForm.solutionType} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, solutionType: e.target.value })} />
              <select className="border border-gray-200 rounded-xl px-3 py-2.5" value={caseStudyForm.assetType} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, assetType: e.target.value as CaseStudyContent["assetType"] })}>
                <option value="Case Study">Case Study</option>
                <option value="Whitepaper">Whitepaper</option>
                <option value="Success Story">Success Story</option>
              </select>
            </div>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Date" value={caseStudyForm.date} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, date: e.target.value })} />
            <div className="rounded-xl border border-gray-200 p-3 space-y-3">
              <p className="text-sm font-semibold text-[#0f172a]">Case Study Image</p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCaseStudyImageMode("url")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    caseStudyImageMode === "url"
                      ? "bg-[#1cd35c] text-white border-[#1cd35c]"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  Use URL
                </button>
                <button
                  type="button"
                  onClick={() => setCaseStudyImageMode("upload")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    caseStudyImageMode === "upload"
                      ? "bg-[#1cd35c] text-white border-[#1cd35c]"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  Upload from PC
                </button>
              </div>

              {caseStudyImageMode === "url" ? (
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
                  placeholder="Image URL"
                  value={caseStudyImageMode === "url" ? caseStudyForm.imageUrl : ""}
                  onChange={(e) => {
                    setCaseStudyForm({ ...caseStudyForm, imageUrl: e.target.value });
                    setCaseStudyImageFileName("");
                  }}
                />
              ) : (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                    onChange={(e) => handleCaseStudyImageUpload(e.target.files?.[0] ?? null)}
                  />
                  {caseStudyImageFileName && (
                    <p className="text-xs text-gray-500">
                      Selected file: <span className="font-semibold text-gray-700">{caseStudyImageFileName}</span>
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {editingCaseStudyId && caseStudyPreviousImage && (
                  <div className="rounded-xl border border-gray-200 p-2">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Current saved image</p>
                    <img
                      src={caseStudyPreviousImage}
                      alt="Current case study"
                      className="w-full h-28 object-cover rounded-lg border border-gray-100"
                    />
                  </div>
                )}
                {caseStudyForm.imageUrl && (
                  <div className="rounded-xl border border-gray-200 p-2">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Selected image preview</p>
                    <img
                      src={caseStudyForm.imageUrl}
                      alt="Selected case study"
                      className="w-full h-28 object-cover rounded-lg border border-gray-100"
                    />
                  </div>
                )}
              </div>

              {editingCaseStudyId && caseStudyPreviousImage && caseStudyForm.imageUrl && caseStudyForm.imageUrl !== caseStudyPreviousImage && (
                <button
                  type="button"
                  onClick={() => {
                    setCaseStudyForm((prev) => ({ ...prev, imageUrl: caseStudyPreviousImage }));
                    setCaseStudyImageMode(isDataImage(caseStudyPreviousImage) ? "upload" : "url");
                    setCaseStudyImageFileName("");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700"
                >
                  Use Previous Image
                </button>
              )}

              {editingCaseStudyId && caseStudyImageHistory.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600">Previous saved images (last 3 changes)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {caseStudyImageHistory.map((historyImage, index) => (
                      <button
                        key={`${editingCaseStudyId}-history-${index}`}
                        type="button"
                        onClick={() => {
                          setCaseStudyForm((prev) => ({ ...prev, imageUrl: historyImage }));
                          setCaseStudyImageMode(isDataImage(historyImage) ? "upload" : "url");
                          setCaseStudyImageFileName("");
                        }}
                        className="rounded-lg border border-gray-200 p-1.5 text-left hover:border-[#1cd35c]/50 transition-colors"
                        title={`Use version ${index + 1}`}
                      >
                        <img
                          src={historyImage}
                          alt={`Previous case study version ${index + 1}`}
                          className="w-full h-16 object-cover rounded-md border border-gray-100"
                        />
                        <span className="block text-[11px] font-semibold text-gray-600 mt-1">
                          Version {index + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <textarea className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Description" value={caseStudyForm.description} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, description: e.target.value })} />
            <textarea className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Overview" value={caseStudyForm.overview} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, overview: e.target.value })} />
            <textarea className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Challenges (one per line)" value={caseStudyForm.challengesText} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, challengesText: e.target.value })} />
            <textarea className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Solution Details (one per line)" value={caseStudyForm.solutionText} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, solutionText: e.target.value })} />
            <textarea className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Outcomes (one per line)" value={caseStudyForm.outcomesText} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, outcomesText: e.target.value })} />
            <textarea className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Certifications (one per line)" value={caseStudyForm.certificationsText} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, certificationsText: e.target.value })} />
            <div className="flex items-center gap-3">
              <button onClick={saveCaseStudy} className="px-4 py-2.5 rounded-xl bg-[#1cd35c] text-white font-semibold">{editingCaseStudyId ? "Update Case Study" : "Create Case Study"}</button>
              <button onClick={resetCaseStudyForm} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold">Reset</button>
            </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h4 className="text-xl font-black text-[#0f172a] mb-4">Case Studies List</h4>
              <div className="space-y-3 max-h-[700px] overflow-y-auto">
                {filteredCaseStudies.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0f172a]">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.industry} | {item.regulation} | {item.solutionType}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCaseStudyId(item.id);
                          setSelectedCaseStudyDetailId(item.id);
                          setCaseStudyPreviousImage(item.imageUrl);
                          setCaseStudyImageHistory(contentManagerService.getCaseStudyImageHistory(item.id));
                          setCaseStudyImageFileName("");
                          setCaseStudyImageMode(isDataImage(item.imageUrl) ? "upload" : "url");
                          setCaseStudyForm({
                            industry: item.industry,
                            regulation: item.regulation,
                            solutionType: item.solutionType,
                            assetType: item.assetType,
                            title: item.title,
                            description: item.description,
                            date: item.date,
                            imageUrl: item.imageUrl,
                            overview: item.overview,
                            challengesText: linesToText(item.challenges),
                            solutionText: linesToText(item.solution_detail),
                            outcomesText: linesToText(item.outcomes),
                            certificationsText: linesToText(item.certifications),
                          });
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-700"
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteCaseStudy(item.id, item.title)} className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-600">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-xl font-black text-[#0f172a]">Case Study Detail Page Content (Inside Card View)</h4>
                <p className="text-sm text-gray-500">
                  This section controls what appears after clicking a case-study card.
                </p>
              </div>
              <select
                className="min-w-64 border border-gray-200 rounded-xl px-3 py-2.5"
                value={selectedCaseStudyDetailId}
                onChange={(e) => setSelectedCaseStudyDetailId(e.target.value)}
              >
                <option value="">Select Case Study Card</option>
                {caseStudies.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Overview"
              value={caseStudyDetailForm.overview}
              onChange={(e) => setCaseStudyDetailForm((prev) => ({ ...prev, overview: e.target.value }))}
            />
            <textarea
              className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Challenges (one per line)"
              value={caseStudyDetailForm.challengesText}
              onChange={(e) => setCaseStudyDetailForm((prev) => ({ ...prev, challengesText: e.target.value }))}
            />
            <textarea
              className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Solution Details (one per line)"
              value={caseStudyDetailForm.solutionText}
              onChange={(e) => setCaseStudyDetailForm((prev) => ({ ...prev, solutionText: e.target.value }))}
            />
            <textarea
              className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Outcomes (one per line)"
              value={caseStudyDetailForm.outcomesText}
              onChange={(e) => setCaseStudyDetailForm((prev) => ({ ...prev, outcomesText: e.target.value }))}
            />
            <textarea
              className="w-full min-h-[80px] border border-gray-200 rounded-xl px-3 py-2.5"
              placeholder="Certifications (one per line)"
              value={caseStudyDetailForm.certificationsText}
              onChange={(e) => setCaseStudyDetailForm((prev) => ({ ...prev, certificationsText: e.target.value }))}
            />

            <div className="rounded-xl border border-gray-200 p-3 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#0f172a]">Project Timeline Rows</p>
                <button
                  type="button"
                  onClick={addCaseStudyTimelineRow}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700"
                >
                  Add Timeline Row
                </button>
              </div>
              <div className="space-y-2">
                {caseStudyDetailForm.timelineRows.map((row, index) => (
                  <div key={`timeline-row-${index}`} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2">
                    <input
                      className="border border-gray-200 rounded-xl px-3 py-2.5"
                      placeholder="Phase"
                      value={row.phase}
                      onChange={(e) =>
                        setCaseStudyDetailForm((prev) => ({
                          ...prev,
                          timelineRows: prev.timelineRows.map((timelineRow, rowIndex) =>
                            rowIndex === index ? { ...timelineRow, phase: e.target.value } : timelineRow
                          ),
                        }))
                      }
                    />
                    <input
                      className="border border-gray-200 rounded-xl px-3 py-2.5"
                      placeholder="Title"
                      value={row.title}
                      onChange={(e) =>
                        setCaseStudyDetailForm((prev) => ({
                          ...prev,
                          timelineRows: prev.timelineRows.map((timelineRow, rowIndex) =>
                            rowIndex === index ? { ...timelineRow, title: e.target.value } : timelineRow
                          ),
                        }))
                      }
                    />
                    <input
                      className="border border-gray-200 rounded-xl px-3 py-2.5"
                      placeholder="Duration"
                      value={row.duration}
                      onChange={(e) =>
                        setCaseStudyDetailForm((prev) => ({
                          ...prev,
                          timelineRows: prev.timelineRows.map((timelineRow, rowIndex) =>
                            rowIndex === index ? { ...timelineRow, duration: e.target.value } : timelineRow
                          ),
                        }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeCaseStudyTimelineRow(index)}
                      className="px-3 py-2.5 rounded-xl text-xs font-semibold border border-red-200 text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 p-3 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#0f172a]">Testimonial</p>
                {caseStudyDetailForm.testimonialQuote || caseStudyDetailForm.testimonialAuthor || caseStudyDetailForm.testimonialRole ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCaseStudyDetailForm((prev) => ({
                        ...prev,
                        testimonialQuote: "",
                        testimonialAuthor: "",
                        testimonialRole: "",
                      }))
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600"
                  >
                    Remove Testimonial
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setCaseStudyDetailForm((prev) => ({
                        ...prev,
                        testimonialQuote: "Client quote",
                      }))
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700"
                  >
                    Add Testimonial
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="border border-gray-200 rounded-xl px-3 py-2.5"
                  placeholder="Testimonial Quote"
                  value={caseStudyDetailForm.testimonialQuote}
                  onChange={(e) => setCaseStudyDetailForm((prev) => ({ ...prev, testimonialQuote: e.target.value }))}
                />
                <input
                  className="border border-gray-200 rounded-xl px-3 py-2.5"
                  placeholder="Testimonial Author"
                  value={caseStudyDetailForm.testimonialAuthor}
                  onChange={(e) => setCaseStudyDetailForm((prev) => ({ ...prev, testimonialAuthor: e.target.value }))}
                />
                <input
                  className="border border-gray-200 rounded-xl px-3 py-2.5"
                  placeholder="Testimonial Role"
                  value={caseStudyDetailForm.testimonialRole}
                  onChange={(e) => setCaseStudyDetailForm((prev) => ({ ...prev, testimonialRole: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={saveCaseStudyDetail} className="px-4 py-2.5 rounded-xl bg-[#1cd35c] text-white font-semibold">
                Save Detail Page
              </button>
              <button
                onClick={() => selectedCaseStudyDetailId && window.open(`/case-studies/${selectedCaseStudyDetailId}`, "_blank", "noopener,noreferrer")}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!selectedCaseStudyDetailId}
              >
                Preview Detail Page
              </button>
              <button onClick={resetCaseStudyDetailForm} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold">
                Reset Detail Form
              </button>
            </div>
          </div>
        </>
      )}

      {module === "insights" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xl font-black text-[#0f172a]">{editingInsightId ? "Edit Insight Article" : "Create Insight Article"}</h4>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Title" value={insightForm.title} onChange={(e) => setInsightForm({ ...insightForm, title: e.target.value })} />
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Category" value={insightForm.category} onChange={(e) => setInsightForm({ ...insightForm, category: e.target.value })} />
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Date (e.g. Research | Jan 20, 2026)" value={insightForm.date} onChange={(e) => setInsightForm({ ...insightForm, date: e.target.value })} />
            <div className="rounded-xl border border-gray-200 p-3 space-y-3">
              <p className="text-sm font-semibold text-[#0f172a]">Insight Image</p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInsightImageMode("url")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    insightImageMode === "url"
                      ? "bg-[#1cd35c] text-white border-[#1cd35c]"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  Use URL
                </button>
                <button
                  type="button"
                  onClick={() => setInsightImageMode("upload")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    insightImageMode === "upload"
                      ? "bg-[#1cd35c] text-white border-[#1cd35c]"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  Upload from PC
                </button>
              </div>

              {insightImageMode === "url" ? (
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5"
                  placeholder="Image URL"
                  value={insightImageMode === "url" ? insightForm.image : ""}
                  onChange={(e) => {
                    setInsightForm({ ...insightForm, image: e.target.value });
                    setInsightImageFileName("");
                  }}
                />
              ) : (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                    onChange={(e) => handleInsightImageUpload(e.target.files?.[0] ?? null)}
                  />
                  {insightImageFileName && (
                    <p className="text-xs text-gray-500">
                      Selected file: <span className="font-semibold text-gray-700">{insightImageFileName}</span>
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {editingInsightId && insightPreviousImage && (
                  <div className="rounded-xl border border-gray-200 p-2">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Current saved image</p>
                    <img
                      src={insightPreviousImage}
                      alt="Current insight"
                      className="w-full h-28 object-cover rounded-lg border border-gray-100"
                    />
                  </div>
                )}
                {insightForm.image && (
                  <div className="rounded-xl border border-gray-200 p-2">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Selected image preview</p>
                    <img
                      src={insightForm.image}
                      alt="Selected insight"
                      className="w-full h-28 object-cover rounded-lg border border-gray-100"
                    />
                  </div>
                )}
              </div>

              {editingInsightId && insightPreviousImage && insightForm.image && insightForm.image !== insightPreviousImage && (
                <button
                  type="button"
                  onClick={() => {
                    setInsightForm((prev) => ({ ...prev, image: insightPreviousImage }));
                    setInsightImageMode(isDataImage(insightPreviousImage) ? "upload" : "url");
                    setInsightImageFileName("");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700"
                >
                  Use Previous Image
                </button>
              )}

              {editingInsightId && insightImageHistory.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600">Previous saved images (last 3 changes)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {insightImageHistory.map((historyImage, index) => (
                      <button
                        key={`${editingInsightId}-history-${index}`}
                        type="button"
                        onClick={() => {
                          setInsightForm((prev) => ({ ...prev, image: historyImage }));
                          setInsightImageMode(isDataImage(historyImage) ? "upload" : "url");
                          setInsightImageFileName("");
                        }}
                        className="rounded-lg border border-gray-200 p-1.5 text-left hover:border-[#1cd35c]/50 transition-colors"
                        title={`Use version ${index + 1}`}
                      >
                        <img
                          src={historyImage}
                          alt={`Previous insight version ${index + 1}`}
                          className="w-full h-16 object-cover rounded-md border border-gray-100"
                        />
                        <span className="block text-[11px] font-semibold text-gray-600 mt-1">
                          Version {index + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={saveInsight} className="px-4 py-2.5 rounded-xl bg-[#1cd35c] text-white font-semibold">{editingInsightId ? "Update Insight" : "Create Insight"}</button>
              <button
                onClick={() => window.open("/insights", "_blank", "noopener,noreferrer")}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold"
              >
                Preview Insights Page
              </button>
              <button onClick={resetInsightForm} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold">Reset</button>
            </div>

            <div className="pt-3 border-t border-gray-200 space-y-2">
              <h5 className="font-bold text-[#0f172a]">Insights Structure (Capabilities / Expertise)</h5>
              <p className="text-xs text-gray-500">Drag and drop cards to reorder capabilities and expertise blocks.</p>
              {insightCapabilities.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => startCapabilityDrag(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => dropCapabilityAt(index)}
                  onDragEnd={() => setDraggedCapabilityIndex(null)}
                  className={`grid grid-cols-1 gap-2 border rounded-xl p-3 cursor-move ${draggedCapabilityIndex === index ? "border-[#1cd35c]/60 bg-[#1cd35c]/5" : "border-gray-200"}`}
                >
                  <input className="border border-gray-200 rounded-lg px-3 py-2" value={item.title} onChange={(e) => setInsightCapabilities((prev) => prev.map((cap, i) => (i === index ? { ...cap, title: e.target.value } : cap)))} />
                  <textarea className="border border-gray-200 rounded-lg px-3 py-2 min-h-[64px]" value={item.desc} onChange={(e) => setInsightCapabilities((prev) => prev.map((cap, i) => (i === index ? { ...cap, desc: e.target.value } : cap)))} />
                </div>
              ))}
              {insightExpertise.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => startExpertiseDrag(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => dropExpertiseAt(index)}
                  onDragEnd={() => setDraggedExpertiseIndex(null)}
                  className={`grid grid-cols-1 gap-2 border rounded-xl p-3 cursor-move ${draggedExpertiseIndex === index ? "border-[#1cd35c]/60 bg-[#1cd35c]/5" : "border-gray-200"}`}
                >
                  <input className="border border-gray-200 rounded-lg px-3 py-2" value={item.title} onChange={(e) => setInsightExpertise((prev) => prev.map((exp, i) => (i === index ? { ...exp, title: e.target.value } : exp)))} />
                  <textarea className="border border-gray-200 rounded-lg px-3 py-2 min-h-[64px]" value={item.content} onChange={(e) => setInsightExpertise((prev) => prev.map((exp, i) => (i === index ? { ...exp, content: e.target.value } : exp)))} />
                </div>
              ))}
              <button onClick={saveInsightStructure} className="px-4 py-2.5 rounded-xl bg-[#0f172a] text-white font-semibold">Save Structure</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h4 className="text-xl font-black text-[#0f172a] mb-4">Insights Articles List</h4>
            <div className="space-y-3 max-h-[700px] overflow-y-auto">
              {filteredInsights.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-[#0f172a]">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.category} | {item.date}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingInsightId(item.id);
                        const rest = { ...item };
                        delete (rest as { id?: string }).id;
                        setInsightForm(rest);
                        setInsightPreviousImage(item.image);
                        setInsightImageHistory(contentManagerService.getInsightImageHistory(item.id));
                        setInsightImageFileName("");
                        setInsightImageMode(isDataImage(item.image) ? "upload" : "url");
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-700"
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteInsight(item.id, item.title)} className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {module === "partners" && <PartnersWithUsManager />}
    </div>
  );
};

export default ContentOperationsManager;
