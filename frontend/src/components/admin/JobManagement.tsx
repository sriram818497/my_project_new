import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BarChart3, Briefcase, Download, Edit3, FileText, Inbox, Plus, Search, SlidersHorizontal, Trash2, Users } from "lucide-react";
import { jobsService } from "../../services/jobs";
import type { RecruitmentJob, JobStatus } from "../../types/recruitment";
import CareersContentManager from "./CareersContentManager";
import ApplicantsPipeline from "./ApplicantsPipeline";
import RecruitmentAnalytics from "./RecruitmentAnalytics";
import AdminSectionIntro from "./AdminSectionIntro";
import AdminEmptyState from "./AdminEmptyState";
import { applicantsService } from "../../services/applicants";
import { trackAdminActivity } from "../../utils/adminActivityTracker";

type JobFormState = {
  title: string;
  department: string;
  location: string;
  type: string;
  education: string;
  experience: string;
  applicationDeadline: string;
  skills: string;
  salaryMin: string;
  salaryMax: string;
  walkIn: boolean;
  roleOverview: string;
  aboutRole: string;
  responsibilitiesText: string;
  qualificationsText: string;
  desiredSkillsText: string;
  status: JobStatus;
};

const emptyForm: JobFormState = {
  title: "",
  department: "",
  location: "",
  type: "Full-time",
  education: "",
  experience: "",
  applicationDeadline: "",
  skills: "",
  salaryMin: "",
  salaryMax: "",
  walkIn: false,
  roleOverview: "",
  aboutRole: "",
  responsibilitiesText: "",
  qualificationsText: "",
  desiredSkillsText: "",
  status: "draft",
};

const parseLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const quoteCsv = (value: string | number | undefined) => `"${String(value ?? "").replace(/"/g, '""')}"`;
const formatPostedDateAndTime = (job: RecruitmentJob) => {
  const source = job.publishedAt || job.createdAt || job.postedDate;
  if (!source) return { date: "-", time: "-" };
  const parsed = new Date(source);
  if (Number.isNaN(parsed.getTime())) return { date: job.postedDate || "-", time: "-" };
  return {
    date: parsed.toLocaleDateString(),
    time: parsed.toLocaleTimeString(),
  };
};

const JobManagement = () => {
  const [activeModule, setActiveModule] = useState<"hub" | "jobs" | "careers" | "pipeline" | "analytics">("hub");
  const [jobs, setJobs] = useState<RecruitmentJob[]>([]);
  const [applicantCounts, setApplicantCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | JobStatus>("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"updated" | "deadline" | "applicants">("updated");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<JobFormState>(emptyForm);
  const [initialForm, setInitialForm] = useState<JobFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [savingJob, setSavingJob] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const [data, applicants] = await Promise.all([jobsService.getAllJobs(), applicantsService.getAll()]);
    const counts: Record<string, number> = {};
    applicants.forEach((a) => {
      counts[a.jobId] = (counts[a.jobId] || 0) + 1;
    });
    setJobs(data);
    setApplicantCounts(counts);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const offJobs = jobsService.subscribe(refresh);
    const offApplicants = applicantsService.subscribe(refresh);
    return () => {
      offJobs();
      offApplicants();
    };
  }, []);

  const departmentOptions = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.department).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = jobs.filter((job) => {
      const matchesQuery =
        !q ||
        [job.title, job.department, job.location, job.id, job.jobCode || ""].some((value) =>
          value.toLowerCase().includes(q)
        );
      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter;
      return matchesQuery && matchesStatus && matchesDepartment;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "applicants") {
        return (applicantCounts[b.id] || 0) - (applicantCounts[a.id] || 0);
      }
      if (sortBy === "deadline") {
        const da = a.applicationDeadline ? Date.parse(a.applicationDeadline) : Number.MAX_SAFE_INTEGER;
        const db = b.applicationDeadline ? Date.parse(b.applicationDeadline) : Number.MAX_SAFE_INTEGER;
        return da - db;
      }
      const ua = Date.parse(a.postedDate || "") || 0;
      const ub = Date.parse(b.postedDate || "") || 0;
      return ub - ua;
    });
  }, [jobs, query, statusFilter, departmentFilter, sortBy, applicantCounts]);

  const applySavedView = (view: "all" | "active_hiring" | "closing_soon" | "drafts") => {
    if (view === "all") {
      setStatusFilter("all");
      setDepartmentFilter("all");
      setSortBy("updated");
      return;
    }
    if (view === "active_hiring") {
      setStatusFilter("published");
      setDepartmentFilter("all");
      setSortBy("applicants");
      return;
    }
    if (view === "closing_soon") {
      setStatusFilter("published");
      setDepartmentFilter("all");
      setSortBy("deadline");
      return;
    }
    setStatusFilter("draft");
    setDepartmentFilter("all");
    setSortBy("updated");
  };

  const exportRequisitionsCsv = () => {
    const header = [
      "Requisition ID",
      "Requisition Code",
      "Title",
      "Department",
      "Location",
      "Status",
      "Application Deadline",
      "Applicants",
      "Posted Date",
    ];

    const rows = filteredJobs.map((job) =>
      [
        quoteCsv(job.id),
        quoteCsv(job.jobCode || "-"),
        quoteCsv(job.title),
        quoteCsv(job.department),
        quoteCsv(job.location),
        quoteCsv(job.status),
        quoteCsv(job.applicationDeadline || "-"),
        quoteCsv(applicantCounts[job.id] || 0),
        quoteCsv(job.postedDate || "-"),
      ].join(",")
    );

    const csv = [header.map(quoteCsv).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `requisitions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    trackAdminActivity({
      title: "Requisitions CSV exported",
      detail: `Exported ${filteredJobs.length} requisitions to CSV.`,
      tone: "review",
      processId: "talent-acquisition",
      completedStepDelta: 1,
      started: true,
    });
  };

  const exportSummaryReport = () => {
    const draft = jobs.filter((job) => job.status === "draft").length;
    const published = jobs.filter((job) => job.status === "published").length;
    const archived = jobs.filter((job) => job.status === "archived").length;
    const totalApplicants = Object.values(applicantCounts).reduce((sum, value) => sum + value, 0);
    const lines = [
      "Talent Acquisition Summary Report",
      `Generated At: ${new Date().toLocaleString()}`,
      "",
      `Total Requisitions: ${jobs.length}`,
      `Published Requisitions: ${published}`,
      `Draft Requisitions: ${draft}`,
      `Archived Requisitions: ${archived}`,
      `Total Applicants: ${totalApplicants}`,
      "",
      `Active Filters -> Status: ${statusFilter}, Department: ${departmentFilter}, Sort: ${sortBy}`,
      `Visible Requisitions: ${filteredJobs.length}`,
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `talent-acquisition-summary-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    trackAdminActivity({
      title: "Talent summary report exported",
      detail: "Generated and downloaded the talent acquisition summary report.",
      tone: "review",
      processId: "talent-acquisition",
      completedStepDelta: 1,
      started: true,
    });
  };

  const requisitionKpis = useMemo(() => {
    const published = jobs.filter((job) => job.status === "published").length;
    const draft = jobs.filter((job) => job.status === "draft").length;
    const archived = jobs.filter((job) => job.status === "archived").length;
    return {
      total: jobs.length,
      published,
      draft,
      archived,
      visible: filteredJobs.length,
    };
  }, [jobs, filteredJobs.length]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setInitialForm(emptyForm);
    setFormError("");
    setIsFormOpen(true);
    trackAdminActivity({
      title: "Started requisition creation",
      detail: "Opened the create requisition form.",
      tone: "review",
      processId: "talent-acquisition",
      started: true,
    });
  };

  const openEdit = (job: RecruitmentJob) => {
    setEditingId(job.id);
    setForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      education: job.education ?? "",
      experience: job.experience ?? "",
      applicationDeadline: job.applicationDeadline ?? "",
      skills: (job.skills ?? []).join(", "),
      salaryMin: job.salaryMin ? String(job.salaryMin) : "",
      salaryMax: job.salaryMax ? String(job.salaryMax) : "",
      walkIn: Boolean(job.walkIn),
      roleOverview: job.roleOverview,
      aboutRole: job.aboutRole,
      responsibilitiesText: (job.responsibilities ?? []).join("\n"),
      qualificationsText: (job.qualifications ?? []).join("\n"),
      desiredSkillsText: (job.desiredSkills ?? []).join("\n"),
      status: job.status,
    });
    setInitialForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      education: job.education ?? "",
      experience: job.experience ?? "",
      applicationDeadline: job.applicationDeadline ?? "",
      skills: (job.skills ?? []).join(", "),
      salaryMin: job.salaryMin ? String(job.salaryMin) : "",
      salaryMax: job.salaryMax ? String(job.salaryMax) : "",
      walkIn: Boolean(job.walkIn),
      roleOverview: job.roleOverview,
      aboutRole: job.aboutRole,
      responsibilitiesText: (job.responsibilities ?? []).join("\n"),
      qualificationsText: (job.qualifications ?? []).join("\n"),
      desiredSkillsText: (job.desiredSkills ?? []).join("\n"),
      status: job.status,
    });
    setFormError("");
    setIsFormOpen(true);
    trackAdminActivity({
      title: "Started requisition edit",
      detail: `Opened edit form for ${job.title}.`,
      tone: "review",
      processId: "talent-acquisition",
      started: true,
    });
  };

  const closeForm = (force = false) => {
    const hasUnsavedChanges = JSON.stringify(form) !== JSON.stringify(initialForm);
    if (!force && hasUnsavedChanges) {
      const ok = window.confirm("Discard unsaved job form changes?");
      if (!ok) return;
    }
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setInitialForm(emptyForm);
    setFormError("");
  };

  const handleSave = async () => {
    if (!form.title || !form.department || !form.location || !form.roleOverview || !form.aboutRole) {
      setFormError("Please fill all required fields: title, department, location, role overview, and about role.");
      return;
    }

    if (form.salaryMin && form.salaryMax && Number(form.salaryMin) > Number(form.salaryMax)) {
      setFormError("Salary min cannot be greater than salary max.");
      return;
    }

    setFormError("");
    const payload = {
      ...form,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      applicationDeadline: form.applicationDeadline || undefined,
      publishedAt: form.status === "published" ? new Date().toISOString() : undefined,
      responsibilities: parseLines(form.responsibilitiesText),
      qualifications: parseLines(form.qualificationsText),
      desiredSkills: parseLines(form.desiredSkillsText),
    };

    try {
      setSavingJob(true);
      if (editingId) {
        await jobsService.updateJob(editingId, payload);
      } else {
        await jobsService.createJob({
          ...payload,
          isFeatured: false,
        });
      }
      trackAdminActivity({
        title: editingId ? "Requisition updated" : "Requisition created",
        detail: `${form.title} was ${editingId ? "updated" : "created"} successfully.`,
        tone: "success",
        processId: "talent-acquisition",
        completedStepDelta: 1,
        started: true,
      });
      await refresh();
      closeForm(true);
    } catch {
      setFormError("Unable to save job right now. Please try again.");
    } finally {
      setSavingJob(false);
    }
  };

  const updateStatus = async (job: RecruitmentJob, status: JobStatus) => {
    if (status !== job.status) {
      const ok = window.confirm(`Change job status from ${job.status} to ${status}?`);
      if (!ok) return;
    }

    await jobsService.updateJob(job.id, {
      status,
      publishedAt: status === "published" ? new Date().toISOString() : job.publishedAt,
    });
    trackAdminActivity({
      title: "Requisition status changed",
      detail: `${job.title} moved from ${job.status} to ${status}.`,
      tone: "review",
      processId: "talent-acquisition",
      completedStepDelta: 1,
      started: true,
    });
  };

  const removeJob = async (id: string) => {
    const ok = window.confirm("Delete this requisition permanently?");
    if (!ok) return;
    const deletedJob = jobs.find((job) => job.id === id);
    await jobsService.deleteJob(id);
    trackAdminActivity({
      title: "Requisition deleted",
      detail: `${deletedJob?.title ?? id} was removed from Talent Acquisition.`,
      tone: "risk",
      processId: "talent-acquisition",
      completedStepDelta: 1,
      started: true,
    });
  };

  const selectModule = (nextModule: "hub" | "jobs" | "careers" | "pipeline" | "analytics") => {
    setActiveModule(nextModule);
    const moduleLabel =
      nextModule === "hub"
        ? "Talent Acquisition Hub"
        : nextModule === "jobs"
          ? "Requisition Management"
          : nextModule === "careers"
            ? "Careers Site Content"
            : nextModule === "pipeline"
              ? "Candidate Pipeline"
              : "Recruitment Analytics";

    trackAdminActivity({
      title: `Opened ${moduleLabel}`,
      detail: `Admin navigated to ${moduleLabel}.`,
      tone: "review",
      processId: "talent-acquisition",
      started: true,
    });
  };

  const renderModuleHub = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <button
        onClick={() => selectModule("careers")}
        className="text-left p-7 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#1cd35c]/40 transition-all"
      >
        <div className="w-11 h-11 rounded-xl bg-[#1cd35c]/10 text-[#1cd35c] flex items-center justify-center mb-4">
          <FileText className="w-5 h-5" />
        </div>
        <h4 className="text-2xl font-black text-[#0f172a] mb-2">Careers Site Content</h4>
        <p className="text-gray-600 font-medium">Manage careers page sections and content blocks.</p>
      </button>

      <button
        onClick={() => selectModule("jobs")}
        className="text-left p-7 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#1cd35c]/40 transition-all"
      >
        <div className="w-11 h-11 rounded-xl bg-[#1cd35c]/10 text-[#1cd35c] flex items-center justify-center mb-4">
          <Briefcase className="w-5 h-5" />
        </div>
        <h4 className="text-2xl font-black text-[#0f172a] mb-2">Requisition Management</h4>
        <p className="text-gray-600 font-medium">Create, edit, publish, archive, and auto-expire requisitions.</p>
      </button>

      <button
        onClick={() => selectModule("pipeline")}
        className="text-left p-7 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#1cd35c]/40 transition-all"
      >
        <div className="w-11 h-11 rounded-xl bg-[#1cd35c]/10 text-[#1cd35c] flex items-center justify-center mb-4">
          <Users className="w-5 h-5" />
        </div>
        <h4 className="text-2xl font-black text-[#0f172a] mb-2">Candidate Pipeline</h4>
        <p className="text-gray-600 font-medium">Track candidates from Applied to Selected/Rejected.</p>
      </button>

      <button
        onClick={() => selectModule("analytics")}
        className="text-left p-7 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#1cd35c]/40 transition-all"
      >
        <div className="w-11 h-11 rounded-xl bg-[#1cd35c]/10 text-[#1cd35c] flex items-center justify-center mb-4">
          <BarChart3 className="w-5 h-5" />
        </div>
        <h4 className="text-2xl font-black text-[#0f172a] mb-2">Recruitment Analytics</h4>
        <p className="text-gray-600 font-medium">Hiring conversion, monthly trend, education and location insights.</p>
      </button>
    </div>
  );

  const renderCareersManager = () => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <button
        onClick={() => selectModule("hub")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0f172a] mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Workspace
      </button>
      <h4 className="text-2xl font-black text-[#0f172a] mb-4">Careers Site Content</h4>
      <CareersContentManager />
    </div>
  );

  const renderJobsManager = () => (
    <>
      <div className="flex items-center justify-between">
        <button
          onClick={() => selectModule("hub")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0f172a]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workspace
        </button>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1cd35c] text-white font-bold hover:bg-[#19b850] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Requisition
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="mb-4 grid grid-cols-2 md:grid-cols-5 gap-2">
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-500">Total jobs</p>
            <p className="text-lg font-black text-[#0f172a]">{requisitionKpis.total}</p>
          </div>
          <div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-[#166534]">jobs Published</p>
            <p className="text-lg font-black text-[#166534]">{requisitionKpis.published}</p>
          </div>
          <div className="rounded-xl border border-[#fde68a] bg-[#fffbeb] px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-[#92400e]">jobs Draft</p>
            <p className="text-lg font-black text-[#92400e]">{requisitionKpis.draft}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-gray-500">jobs Archived</p>
            <p className="text-lg font-black text-[#475569]">{requisitionKpis.archived}</p>
          </div>
          <div className="rounded-xl border border-[#bfdbfe] bg-[#eff6ff] px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-[#1d4ed8]">jobs Visible</p>
            <p className="text-lg font-black text-[#1d4ed8]">{requisitionKpis.visible}</p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Saved Views</span>
            <button onClick={() => applySavedView("all")} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 hover:border-[#1cd35c]/40 hover:text-[#0f172a]">All Requisitions</button>
            <button onClick={() => applySavedView("active_hiring")} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 hover:border-[#1cd35c]/40 hover:text-[#0f172a]">Active Hiring</button>
            <button onClick={() => applySavedView("closing_soon")} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 hover:border-[#1cd35c]/40 hover:text-[#0f172a]">Closing Soon</button>
            <button onClick={() => applySavedView("drafts")} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 hover:border-[#1cd35c]/40 hover:text-[#0f172a]">Draft Queue</button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportSummaryReport}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:border-[#1cd35c]/40 hover:text-[#0f172a]"
            >
              <Download className="w-4 h-4" />
              Export Summary
            </button>
            <button
              onClick={exportRequisitionsCsv}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0f172a] text-white text-sm font-semibold hover:bg-[#111f37]"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 pr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | JobStatus)}
            className="text-sm rounded-lg border border-gray-200 px-3 py-2"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-sm rounded-lg border border-gray-200 px-3 py-2"
          >
            <option value="all">All Departments</option>
            {departmentOptions.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "updated" | "deadline" | "applicants")}
            className="text-sm rounded-lg border border-gray-200 px-3 py-2"
          >
            <option value="updated">Sort: Recently Updated</option>
            <option value="deadline">Sort: Nearest Deadline</option>
            <option value="applicants">Sort: Most Applicants</option>
          </select>
          <button
            onClick={() => {
              setStatusFilter("all");
              setDepartmentFilter("all");
              setSortBy("updated");
              setQuery("");
            }}
            className="text-sm font-semibold text-gray-600 hover:text-[#0f172a] px-2 py-1"
          >
            Reset
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search requisitions by title, code, ID, department, or location"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1cd35c]/40"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-gray-500 border-b border-gray-200">
                <th className="py-3">Job ID</th>
                <th className="py-3">Department</th>
                <th className="py-3">Location</th>
                <th className="py-3">Apply By</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">Loading requisitions...</td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6">
                    <AdminEmptyState
                      icon={Inbox}
                      title="No Requisitions Found"
                      subtitle="No records match your active query and filters."
                    />
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  (() => {
                    const posted = formatPostedDateAndTime(job);
                    return (
                  <tr key={job.id} className="border-b border-gray-100">
                    <td className="py-4 pr-3">
                      <p className="font-semibold text-[#0f172a]">{job.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        ({job.jobCode || job.id}) Posted {posted.date},
                      </p>
                      <p className="text-xs text-gray-500">
                        {posted.time} {applicantCounts[job.id] || 0} applicants
                      </p>
                    </td>
                    <td className="py-4 pr-3 text-gray-700">{job.department}</td>
                    <td className="py-4 pr-3 text-gray-700">{job.location}</td>
                    <td className="py-4 pr-3 text-gray-700">{job.applicationDeadline || "-"}</td>
                    <td className="py-4 pr-3">
                      <select
                        value={job.status}
                        onChange={(e) => updateStatus(job, e.target.value as JobStatus)}
                        className="text-sm rounded-lg border border-gray-200 px-2 py-1.5"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEdit(job)}
                          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-[#1cd35c] hover:border-[#1cd35c]/30"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeJob(job.id)}
                          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-300"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                    );
                  })()
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderApplicantsPipeline = () => (
    <div className="space-y-4">
      <button
        onClick={() => selectModule("hub")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0f172a]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Workspace
      </button>
      <ApplicantsPipeline />
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-4">
      <button
        onClick={() => setActiveModule("hub")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0f172a]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Workspace
      </button>
      <RecruitmentAnalytics />
    </div>
  );

  const activeModuleSubtitle =
    activeModule === "jobs"
      ? "Manage requisitions across draft, published, and archived states."
      : activeModule === "careers"
        ? "Manage careers site sections, messaging, and highlight blocks."
        : activeModule === "pipeline"
          ? "Track and progress candidates through each hiring stage."
          : activeModule === "analytics"
            ? "Monitor hiring funnel conversion and recruitment performance."
            : "Select a workspace to continue.";

  return (
    <div className="space-y-6 talent-acquisition-console">
      <AdminSectionIntro
        title="Talent Acquisition"
        subtitle={activeModuleSubtitle}
        icon={Briefcase}
        badge="Hiring Operations"
      />

      {activeModule === "hub" && renderModuleHub()}
      {activeModule === "careers" && renderCareersManager()}
      {activeModule === "jobs" && renderJobsManager()}
      {activeModule === "pipeline" && renderApplicantsPipeline()}
      {activeModule === "analytics" && renderAnalytics()}

      {isFormOpen && (
        <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h4 className="text-2xl font-black text-[#0f172a] mb-4">{editingId ? "Edit Job" : "Create Job"}</h4>
            {formError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm font-medium">
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Job title"
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input className="border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Department"
                value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              <input className="border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Location"
                value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <input className="border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Employment type"
                value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
              <input className="border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Education"
                value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} />
              <input className="border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Experience"
                value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
              <input type="date" className="border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Application deadline"
                value={form.applicationDeadline} onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })} />
              <input className="border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Skills (comma separated)"
                value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
              <input type="number" className="border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Salary min"
                value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
              <input type="number" className="border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Salary max"
                value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} />
              <select className="border border-gray-200 rounded-xl px-3 py-2.5"
                value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as JobStatus })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <label className="inline-flex items-center gap-2 text-gray-700 font-medium">
                <input type="checkbox" checked={form.walkIn} onChange={(e) => setForm({ ...form, walkIn: e.target.checked })} />
                Walk-in available
              </label>
            </div>

            <textarea className="mt-4 w-full min-h-[90px] border border-gray-200 rounded-xl px-3 py-2.5" placeholder="Role overview"
              value={form.roleOverview} onChange={(e) => setForm({ ...form, roleOverview: e.target.value })} />
            <textarea className="mt-4 w-full min-h-[90px] border border-gray-200 rounded-xl px-3 py-2.5" placeholder="About role"
              value={form.aboutRole} onChange={(e) => setForm({ ...form, aboutRole: e.target.value })} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <textarea
                className="w-full min-h-[140px] border border-gray-200 rounded-xl px-3 py-2.5"
                placeholder="Responsibilities (one per line)"
                value={form.responsibilitiesText}
                onChange={(e) => setForm({ ...form, responsibilitiesText: e.target.value })}
              />
              <textarea
                className="w-full min-h-[140px] border border-gray-200 rounded-xl px-3 py-2.5"
                placeholder="Qualifications (one per line)"
                value={form.qualificationsText}
                onChange={(e) => setForm({ ...form, qualificationsText: e.target.value })}
              />
              <textarea
                className="w-full min-h-[140px] border border-gray-200 rounded-xl px-3 py-2.5"
                placeholder="Desired skills (one per line)"
                value={form.desiredSkillsText}
                onChange={(e) => setForm({ ...form, desiredSkillsText: e.target.value })}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={() => closeForm()} disabled={savingJob} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 disabled:opacity-60">Cancel</button>
              <button onClick={handleSave} disabled={savingJob} className="px-5 py-2.5 rounded-xl bg-[#1cd35c] text-white font-semibold hover:bg-[#19b850] disabled:opacity-60">{savingJob ? "Saving..." : "Save Job"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
