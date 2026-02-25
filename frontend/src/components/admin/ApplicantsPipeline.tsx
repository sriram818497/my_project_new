import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Download,
  FileCheck2,
  Search,
  Upload,
  UserCheck,
  XCircle,
} from "lucide-react";
import { applicantsService } from "../../services/applicants";
import { jobsService } from "../../services/jobs";
import type { ApplicantProfile, ApplicantStage } from "../../types/applicant";
import type { RecruitmentJob } from "../../types/recruitment";

type Stage = ApplicantStage;

type ToastType = "success" | "error";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type PendingAction = {
  title: string;
  message: string;
  confirmLabel: string;
  tone: "primary" | "danger";
  successMessage: string;
  execute: () => Promise<void>;
};

type RoundDraft = {
  interviewerName: string;
  internalNote: string;
};

const PAGE_SIZE = 5;

const stages: Stage[] = [
  "Applied",
  "Screening",
  "Task Assigned",
  "Task Submitted",
  "Interview",
  "Selected",
  "Rejected",
];

const defaultPages: Record<Stage, number> = {
  Applied: 1,
  Screening: 1,
  "Task Assigned": 1,
  "Task Submitted": 1,
  Interview: 1,
  Selected: 1,
  Rejected: 1,
};

const stageIcons = {
  Applied: ClipboardList,
  Screening: Search,
  "Task Assigned": FileCheck2,
  "Task Submitted": FileCheck2,
  Interview: UserCheck,
  Selected: CheckCircle2,
  Rejected: XCircle,
} as const;

const stageWeight: Record<Stage, number> = {
  Applied: 0,
  Screening: 4,
  "Task Assigned": 6,
  "Task Submitted": 8,
  Interview: 10,
  Selected: 12,
  Rejected: -10,
};

const stageLabels: Record<Stage, string> = {
  Applied: "Applied",
  Screening: "Screening",
  "Task Assigned": "Technical Round",
  "Task Submitted": "Managerial Round",
  Interview: "Interview",
  Selected: "Selected",
  Rejected: "Rejected",
};

const ratingEligibleStages: Stage[] = ["Applied", "Screening", "Task Assigned", "Task Submitted", "Interview", "Selected"];

const getCompletedRatingStages = (applicant: ApplicantProfile): Stage[] => {
  const reached = new Set<Stage>();
  applicant.stageHistory.forEach((entry) => {
    if (ratingEligibleStages.includes(entry.stage)) reached.add(entry.stage);
  });
  if (ratingEligibleStages.includes(applicant.stage)) reached.add(applicant.stage);
  return ratingEligibleStages.filter((stage) => reached.has(stage));
};

const getAverageCompletedStageRating = (applicant: ApplicantProfile) => {
  const completed = getCompletedRatingStages(applicant);
  const values = completed
    .map((stage) => applicant.stageRatings?.[stage])
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (!values.length) return applicant.rating;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const primaryStageFlow: Stage[] = ["Applied", "Screening", "Task Assigned", "Task Submitted", "Interview", "Selected"];

const getStageNavigationTargets = (current: Stage) => {
  if (current === "Interview") {
    return {
      previousStage: "Task Submitted" as Stage,
      nextStages: ["Selected", "Rejected"] as Stage[],
    };
  }
  if (current === "Rejected") {
    return { previousStage: "Interview" as Stage, nextStages: [] as Stage[] };
  }
  const idx = primaryStageFlow.indexOf(current);
  if (idx < 0) return { previousStage: undefined as Stage | undefined, nextStages: [] as Stage[] };
  return {
    previousStage: idx > 0 ? primaryStageFlow[idx - 1] : undefined,
    nextStages: idx < primaryStageFlow.length - 1 ? [primaryStageFlow[idx + 1]] : [],
  };
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

const parseYears = (value: string) => {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const getSuitabilityScore = (applicant: ApplicantProfile) => {
  const ratingPart = getAverageCompletedStageRating(applicant) * 12;
  const experiencePart = Math.min(20, parseYears(applicant.experience) * 3);
  const skillsPart = Math.min(15, applicant.skills.length * 3);
  const stagePart = stageWeight[applicant.stage];
  const raw = ratingPart + experiencePart + skillsPart + stagePart;
  return Math.max(0, Math.min(100, Math.round(raw)));
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

const formatStageProgressDateTime = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const formatCsvDateTime = (iso?: string) => {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const toCsvCell = (value: string | number) => {
  const raw = String(value ?? "");
  const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
};

const ApplicantsPipeline = () => {
  const [applicants, setApplicants] = useState<ApplicantProfile[]>([]);
  const [jobs, setJobs] = useState<RecruitmentJob[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [educationFilter, setEducationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("0");
  const [stagePages, setStagePages] = useState<Record<Stage, number>>(defaultPages);
  const [selected, setSelected] = useState<ApplicantProfile | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskFile, setTaskFile] = useState<File | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [roundDrafts, setRoundDrafts] = useState<Partial<Record<Stage, RoundDraft>>>({});
  const [savingRoundStage, setSavingRoundStage] = useState<Stage | null>(null);
  const selectedId = selected?.id ?? null;

  const pushToast = (message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 2600);
  };

  const requestActionConfirmation = (action: PendingAction) => {
    setPendingAction(action);
  };

  const runPendingAction = async () => {
    if (!pendingAction) return;
    setIsConfirmLoading(true);
    try {
      await pendingAction.execute();
      pushToast(pendingAction.successMessage, "success");
      setPendingAction(null);
    } catch {
      pushToast("Action failed. Please try again.", "error");
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const loadApplicants = async () => {
    const list = await applicantsService.getAll();
    setApplicants(list);
  };

  const loadJobs = async () => {
    const list = await jobsService.getPublishedJobs();
    setJobs(list);
  };

  useEffect(() => {
    loadApplicants();
    return applicantsService.subscribe(loadApplicants);
  }, []);

  useEffect(() => {
    loadJobs();
    return jobsService.subscribe(loadJobs);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const latest = applicants.find((a) => a.id === selectedId) ?? null;
    setSelected(latest);
  }, [applicants, selectedId]);

  useEffect(() => {
    if (!selected) {
      setRoundDrafts({});
      return;
    }
    const next: Partial<Record<Stage, RoundDraft>> = {};
    getCompletedRatingStages(selected).forEach((stage) => {
      next[stage] = {
        interviewerName: selected.roundEvaluations?.[stage]?.interviewerName || "",
        internalNote: selected.roundEvaluations?.[stage]?.internalNote || "",
      };
    });
    setRoundDrafts(next);
  }, [selected]);

  const filtered = useMemo(() => {
    const minScore = Number(scoreFilter);
    const query = searchQuery.trim().toLowerCase();
    const terms = query ? query.split(/\s+/).filter(Boolean) : [];

    return applicants.filter((a) => {
      const byJob = !jobFilter || a.jobId === jobFilter;
      const byLocation = !locationFilter || a.location === locationFilter;
      const byEducation = !educationFilter || a.education === educationFilter;
      const byExperience = !experienceFilter || a.experience === experienceFilter;
      const byStage = !stageFilter || a.stage === stageFilter;
      const byScore = getSuitabilityScore(a) >= minScore;

      const searchable = `${a.name} ${a.email} ${a.phone} ${a.jobId} ${a.education} ${a.location} ${a.experience} ${a.skills.join(" ")}`.toLowerCase();
      const bySearch = !terms.length || terms.every((term) => searchable.includes(term));

      return byJob && byLocation && byEducation && byExperience && byStage && byScore && bySearch;
    });
  }, [
    applicants,
    searchQuery,
    jobFilter,
    locationFilter,
    educationFilter,
    experienceFilter,
    stageFilter,
    scoreFilter,
  ]);

  useEffect(() => {
    setStagePages((prev) => {
      const next = { ...prev };
      let changed = false;

      stages.forEach((stage) => {
        const count = filtered.filter((a) => a.stage === stage).length;
        const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
        if (next[stage] > totalPages) {
          next[stage] = totalPages;
          changed = true;
        }
        if (next[stage] < 1) {
          next[stage] = 1;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [filtered]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const active = filtered.filter((a) => !["Selected", "Rejected"].includes(a.stage)).length;
    const hired = filtered.filter((a) => a.stage === "Selected").length;
    const rejected = filtered.filter((a) => a.stage === "Rejected").length;
    const avgScore = total ? Math.round(filtered.reduce((sum, item) => sum + getSuitabilityScore(item), 0) / total) : 0;
    return { total, active, hired, rejected, avgScore };
  }, [filtered]);

  const locations = Array.from(new Set(applicants.map((a) => a.location)));
  const educations = Array.from(new Set(applicants.map((a) => a.education)));
  const experiences = Array.from(new Set(applicants.map((a) => a.experience)));

  const refreshSelected = async (id: string) => {
    const next = (await applicantsService.getAll()).find((a) => a.id === id) ?? null;
    setSelected(next);
  };

  const moveApplicant = async (id: string, stage: Stage) => {
    await applicantsService.updateStage(id, stage);
    if (selected?.id === id) {
      await refreshSelected(id);
    }
    pushToast(`Applicant moved to ${stageLabels[stage]}.`);
  };

  const changeStageWithGuard = (id: string, stage: Stage) => {
    if (stage === "Selected") {
      requestActionConfirmation({
        title: "Mark As Selected",
        message: "This applicant will be marked as selected in the pipeline.",
        confirmLabel: "Confirm Selection",
        tone: "primary",
        successMessage: "Applicant marked as selected.",
        execute: async () => {
          await applicantsService.updateStage(id, "Selected");
          if (selected?.id === id) await refreshSelected(id);
        },
      });
      return;
    }

    if (stage === "Rejected") {
      requestActionConfirmation({
        title: "Reject Applicant",
        message: "This applicant will be moved to rejected with an internal default reason.",
        confirmLabel: "Confirm Rejection",
        tone: "danger",
        successMessage: "Applicant rejected.",
        execute: async () => {
          await applicantsService.reject(id, "Moved to rejected from pipeline board.");
          if (selected?.id === id) await refreshSelected(id);
        },
      });
      return;
    }

    void moveApplicant(id, stage);
  };

  const updateStageRating = async (id: string, stage: Stage, rating: number) => {
    await applicantsService.updateStageRating(id, stage, rating);
    if (selected?.id === id) {
      await refreshSelected(id);
    }
    pushToast(`${stageLabels[stage]} rating updated.`);
  };

  const saveRoundEvaluation = async (stage: Stage) => {
    if (!selected) return;
    const draft = roundDrafts[stage];
    if (!draft) return;
    setSavingRoundStage(stage);
    try {
      await applicantsService.updateRoundEvaluation(selected.id, stage, {
        interviewerName: draft.interviewerName,
        internalNote: draft.internalNote,
      });
      await refreshSelected(selected.id);
      pushToast(`${stageLabels[stage]} notes saved.`);
    } catch {
      pushToast("Unable to save round notes right now.", "error");
    } finally {
      setSavingRoundStage(null);
    }
  };

  const addInternalNote = async () => {
    if (!selected || !noteInput.trim()) return;
    await applicantsService.addNote(selected.id, noteInput.trim(), true);
    setNoteInput("");
    await refreshSelected(selected.id);
    pushToast("Internal note added.");
  };

  const assignTask = async () => {
    if (!selected || !taskDescription.trim()) return;
    let fileUrl: string | undefined;
    let fileName: string | undefined;

    if (taskFile) {
      fileUrl = await readFileAsDataUrl(taskFile);
      fileName = taskFile.name;
    }

    await applicantsService.assignTask(selected.id, taskDescription.trim(), fileUrl, fileName);
    setTaskDescription("");
    setTaskFile(null);
    await refreshSelected(selected.id);
    pushToast("Task assigned successfully.");
  };

  const markTaskSubmitted = async () => {
    if (!selected) return;
    let url = submissionUrl.trim();
    let fileName: string | undefined;

    if (!url && submissionFile) {
      url = await readFileAsDataUrl(submissionFile);
      fileName = submissionFile.name;
    }

    if (!url) {
      pushToast("Provide a task submission link or upload a file.", "error");
      return;
    }

    await applicantsService.submitTask(selected.id, url, fileName);
    setSubmissionUrl("");
    setSubmissionFile(null);
    await refreshSelected(selected.id);
    pushToast("Task marked as submitted.");
  };

  const rejectApplicant = () => {
    if (!selected) return;
    const reason = rejectionReason.trim() || "Not aligned with role requirements after evaluation.";

    requestActionConfirmation({
      title: "Reject Applicant",
      message: "This action moves the candidate to rejected stage and stores the internal reason.",
      confirmLabel: "Reject Candidate",
      tone: "danger",
      successMessage: "Applicant rejected.",
      execute: async () => {
        await applicantsService.reject(selected.id, reason);
        setRejectionReason("");
        await refreshSelected(selected.id);
      },
    });
  };

  const exportCsv = () => {
    const headers = [
      "Applicant ID",
      "Name",
      "Email",
      "Phone",
      "Job ID",
      "Stage",
      "Overall Rating",
      "Suitability Score",
      "Education",
      "Experience",
      "Location",
      "Applied At",
    ];

    const rows = filtered.map((a) => [
      a.id,
      a.name,
      a.email,
      a.phone,
      a.jobId,
      stageLabels[a.stage],
      a.rating,
      getSuitabilityScore(a),
      a.education,
      a.experience,
      a.location,
      formatCsvDateTime(a.appliedAt),
    ]);

    const csv = [
      headers.map((h) => toCsvCell(h)).join(","),
      ...rows.map((row) => row.map((cell) => toCsvCell(cell)).join(",")),
    ].join("\n");

    const csvWithBom = `\uFEFF${csv}`;
    const blob = new Blob([csvWithBom], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applicants-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    pushToast("Applicants exported to CSV.");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-widest text-gray-500">Total Applicants</p>
          <p className="text-3xl font-black text-[#0f172a] mt-1">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-widest text-gray-500">In Progress</p>
          <p className="text-3xl font-black text-[#0f172a] mt-1">{stats.active}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-widest text-gray-500">Selected</p>
          <p className="text-3xl font-black text-[#16a34a] mt-1">{stats.hired}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-widest text-gray-500">Rejected</p>
          <p className="text-3xl font-black text-red-500 mt-1">{stats.rejected}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-widest text-gray-500">Avg Suitability</p>
          <p className="text-3xl font-black text-[#0f172a] mt-1">{stats.avgScore}%</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-wrap items-stretch gap-3">
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 min-w-[180px] flex-[1_1_220px]"
        >
          <option value="">All Jobs</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {`${job.jobCode || job.id} - ${job.title}`}
            </option>
          ))}
        </select>
        <div className="relative min-w-[260px] flex-[2_1_340px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, job id, skills"
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm h-full"
          />
        </div>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 min-w-[170px] flex-[1_1_190px]"
        >
          <option value="">All Locations</option>
          {locations.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select
          value={educationFilter}
          onChange={(e) => setEducationFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 min-w-[170px] flex-[1_1_190px]"
        >
          <option value="">All Education</option>
          {educations.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select
          value={experienceFilter}
          onChange={(e) => setExperienceFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 min-w-[170px] flex-[1_1_190px]"
        >
          <option value="">All Experience</option>
          {experiences.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 min-w-[170px] flex-[1_1_190px]"
        >
          <option value="">All Stages</option>
          {stages.map((v) => <option key={v} value={v}>{stageLabels[v]}</option>)}
        </select>
        <select
          value={scoreFilter}
          onChange={(e) => setScoreFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 min-w-[170px] flex-[1_1_190px]"
        >
          <option value="0">All Scores</option>
          <option value="40">40% and above</option>
          <option value="60">60% and above</option>
          <option value="80">80% and above</option>
        </select>
        <button
          onClick={exportCsv}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[#1cd35c]/40 hover:text-[#0f172a] min-w-[140px] flex-[0_0_auto]"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[1280px] grid grid-cols-7 gap-4">
          {stages.map((stage) => {
            const Icon = stageIcons[stage];
            const stageItems = filtered.filter((a) => a.stage === stage);
            const totalPages = Math.max(1, Math.ceil(stageItems.length / PAGE_SIZE));
            const currentPage = Math.min(stagePages[stage], totalPages);
            const start = (currentPage - 1) * PAGE_SIZE;
            const items = stageItems.slice(start, start + PAGE_SIZE);

            return (
              <div
                key={stage}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragId) changeStageWithGuard(dragId, stage);
                  setDragId(null);
                }}
                className="bg-white border border-gray-200 rounded-2xl p-3 min-h-[450px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#1cd35c]" />
                    <h4 className="font-bold text-[#0f172a] text-sm">{stageLabels[stage]}</h4>
                  </div>
                  <span className="text-xs font-bold text-gray-500">{stageItems.length}</span>
                </div>

                <div className="space-y-2">
                  {items.map((a) => (
                    <div
                      key={a.id}
                      draggable
                      onClick={() => setSelected(a)}
                      onDragStart={() => setDragId(a.id)}
                      className="rounded-xl border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:border-[#1cd35c]/40"
                    >
                      <p className="font-semibold text-[#0f172a] text-sm">{a.name}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{a.education} - {a.location}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] font-black text-gray-500">{a.id}</span>
                        <span className="text-[10px] font-black text-[#1cd35c]">Score {getSuitabilityScore(a)}%</span>
                      </div>

                      <div className="mt-2">
                        <select
                          value={a.stage}
                          onChange={(e) => changeStageWithGuard(a.id, e.target.value as Stage)}
                          className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5"
                        >
                          {stages.map((s) => (
                            <option key={s} value={s}>{stageLabels[s]}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400">
                      Drop applicants here
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setStagePages((prev) => ({ ...prev, [stage]: Math.max(1, prev[stage] - 1) }))}
                    disabled={currentPage <= 1}
                    className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40"
                  >
                    Prev
                  </button>
                  <span className="text-gray-500">Page {currentPage} / {totalPages}</span>
                  <button
                    onClick={() => setStagePages((prev) => ({ ...prev, [stage]: Math.min(totalPages, prev[stage] + 1) }))}
                    disabled={currentPage >= totalPages}
                    className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h4 className="text-xl font-black text-[#0f172a]">{selected.name}</h4>
              <p className="text-gray-600 text-sm">{selected.email} - {selected.phone}</p>
            </div>
            <div className="flex items-center gap-2">
              <a href={selected.resumeUrl} className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700">Preview Resume</a>
              <a href={selected.resumeUrl} download={selected.resumeName} className="px-3 py-2 rounded-lg bg-[#1cd35c] text-white text-sm font-semibold">Download Resume</a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-gray-200 p-3"><p className="text-xs text-gray-500">Education</p><p className="font-semibold text-[#0f172a]">{selected.education}</p></div>
            <div className="rounded-xl border border-gray-200 p-3"><p className="text-xs text-gray-500">Experience</p><p className="font-semibold text-[#0f172a]">{selected.experience}</p></div>
            <div className="rounded-xl border border-gray-200 p-3"><p className="text-xs text-gray-500">Location</p><p className="font-semibold text-[#0f172a]">{selected.location}</p></div>
            <div className="rounded-xl border border-gray-200 p-3"><p className="text-xs text-gray-500">Suitability</p><p className="font-semibold text-[#0f172a]">{getSuitabilityScore(selected)}%</p></div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <h5 className="font-bold text-[#0f172a]">Stage Navigation</h5>
            <p className="text-xs text-gray-500">
              Move candidate backward or forward based on current round.
            </p>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const { previousStage, nextStages } = getStageNavigationTargets(selected.stage);
                return (
                  <>
                    {previousStage && (
                      <button
                        onClick={() => changeStageWithGuard(selected.id, previousStage)}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700"
                      >
                        Move to {stageLabels[previousStage]}
                      </button>
                    )}
                    {nextStages.map((nextStage) => (
                      <button
                        key={`move-${selected.id}-${nextStage}`}
                        onClick={() => changeStageWithGuard(selected.id, nextStage)}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700"
                      >
                        Move to {stageLabels[nextStage]}
                      </button>
                    ))}
                  </>
                );
              })()}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <h5 className="font-bold text-[#0f172a]">Stage Performance Ratings</h5>
            <p className="text-xs text-gray-500">
              Rate each completed stage. Overall suitability score updates automatically from these stage ratings.
            </p>
            <div className="space-y-2">
              {getCompletedRatingStages(selected).map((stage) => {
                const stageRating = selected.stageRatings?.[stage] || 0;
                const roundDraft = roundDrafts[stage] || { interviewerName: "", internalNote: "" };
                return (
                  <div key={`rating-${stage}`} className="rounded-lg border border-gray-200 p-3 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-gray-700">{stageLabels[stage]}</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={`${stage}-${n}`}
                            onClick={() => updateStageRating(selected.id, stage, n)}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold ${stageRating >= n ? "bg-[#1cd35c] text-white" : "bg-gray-100 text-gray-600"}`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      value={roundDraft.interviewerName}
                      onChange={(e) =>
                        setRoundDrafts((prev) => ({
                          ...prev,
                          [stage]: {
                            interviewerName: e.target.value,
                            internalNote: prev[stage]?.internalNote || "",
                          },
                        }))
                      }
                      placeholder="Interviewer name"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                    <textarea
                      value={roundDraft.internalNote}
                      onChange={(e) =>
                        setRoundDrafts((prev) => ({
                          ...prev,
                          [stage]: {
                            interviewerName: prev[stage]?.interviewerName || "",
                            internalNote: e.target.value,
                          },
                        }))
                      }
                      placeholder="Internal performance notes for this round"
                      className="w-full min-h-[72px] border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => saveRoundEvaluation(stage)}
                        disabled={savingRoundStage === stage}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-60"
                      >
                        {savingRoundStage === stage ? "Saving..." : `Save ${stageLabels[stage]} Notes`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs font-semibold text-gray-600">
              Overall rating: {selected.rating}/5
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <h5 className="font-bold text-[#0f172a]">Task Assignment</h5>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Add assignment instructions"
              className="w-full min-h-[80px] border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload task file
              <input type="file" className="hidden" onChange={(e) => setTaskFile(e.target.files?.[0] || null)} />
            </label>
            {taskFile && <p className="text-xs text-gray-500">Selected: {taskFile.name}</p>}
            <button onClick={assignTask} className="px-3 py-2 rounded-lg bg-[#1cd35c] text-white text-sm font-semibold">Assign Task</button>
            {selected.taskAssignment && (
              <div className="text-sm text-gray-700 border border-gray-200 rounded-lg p-3">
                <p className="font-semibold text-[#0f172a]">Current Assignment</p>
                <p className="mt-1">{selected.taskAssignment.description}</p>
                <p className="text-xs text-gray-500 mt-1">Assigned: {formatDate(selected.taskAssignment.assignedAt)}</p>
                {selected.taskAssignment.fileUrl && (
                  <a href={selected.taskAssignment.fileUrl} download={selected.taskAssignment.fileName || "task-file"} className="inline-block mt-2 text-sm text-[#16a34a] font-semibold">
                    Download Assigned File
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <h5 className="font-bold text-[#0f172a]">Task Submission Review</h5>
            <input
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              placeholder="Submission link (optional if uploading file)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload submitted file
              <input type="file" className="hidden" onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)} />
            </label>
            {submissionFile && <p className="text-xs text-gray-500">Selected: {submissionFile.name}</p>}
            <div className="flex flex-wrap gap-2">
              <button onClick={markTaskSubmitted} className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700">Mark Task Submitted</button>
              <button onClick={() => changeStageWithGuard(selected.id, "Interview")} className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700">Move to Interview</button>
              <button onClick={() => changeStageWithGuard(selected.id, "Selected")} className="px-3 py-2 rounded-lg bg-[#1cd35c] text-white text-sm font-semibold">Mark Selected</button>
            </div>
            {selected.taskSubmissionUrl && (
              <a href={selected.taskSubmissionUrl} download={selected.taskSubmissionName || "task-submission"} className="inline-block text-sm text-[#16a34a] font-semibold">
                View Submitted Task
              </a>
            )}
          </div>

          <div className="rounded-xl border border-red-200 p-4 space-y-3">
            <h5 className="font-bold text-red-600">Reject Applicant</h5>
            <input
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm"
              placeholder="Internal rejection reason"
            />
            <button onClick={rejectApplicant} className="px-3 py-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600">Reject</button>
            {selected.rejectionReason && <p className="text-sm text-red-600">Current reason: {selected.rejectionReason}</p>}
          </div>

          <div>
            <h5 className="font-bold text-[#0f172a] mb-2">Internal Notes</h5>
            <div className="flex gap-2 mb-2">
              <input value={noteInput} onChange={(e) => setNoteInput(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Add internal feedback" />
              <button onClick={addInternalNote} className="px-3 py-2 rounded-lg bg-[#1cd35c] text-white text-sm font-semibold">Add</button>
            </div>
            <div className="space-y-2">
              {selected.notes.map((note) => (
                <div key={note.id} className="rounded-lg border border-gray-200 p-2 text-sm text-gray-700">
                  <p>{note.text}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{formatDate(note.createdAt)}</p>
                </div>
              ))}
              {selected.notes.length === 0 && <p className="text-sm text-gray-400">No notes yet.</p>}
            </div>
          </div>

          <div>
            <h5 className="font-bold text-[#0f172a] mb-2">Stage Progress</h5>
            <div className="flex flex-wrap gap-2">
              {selected.stageHistory.map((entry, idx) => (
                <span key={`${entry.stage}-${idx}`} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {stageLabels[entry.stage]} - {formatStageProgressDateTime(entry.movedAt)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-4 text-sm text-gray-600 flex items-center gap-2">
        <ChevronRight className="w-4 h-4 text-[#1cd35c]" />
        Workflow: Applied {"->"} Screening {"->"} Technical Round {"->"} Managerial Round {"->"} Interview {"->"} Selected or Rejected.
      </div>

      {pendingAction && (
        <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-2xl p-6">
            <h4 className="text-xl font-black text-[#0f172a]">{pendingAction.title}</h4>
            <p className="text-sm text-gray-600 mt-2">{pendingAction.message}</p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setPendingAction(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button
                disabled={isConfirmLoading}
                onClick={runPendingAction}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${pendingAction.tone === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-[#1cd35c] hover:bg-[#19b850]"} disabled:opacity-60`}
              >
                {isConfirmLoading ? "Processing..." : pendingAction.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed right-4 bottom-4 z-[95] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-white ${toast.type === "error" ? "bg-red-600" : "bg-[#0f172a]"}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicantsPipeline;
