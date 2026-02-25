import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { applicantsService } from "../../services/applicants";
import { jobsService } from "../../services/jobs";
import type { ApplicantProfile, ApplicantStage, ApplicantGender } from "../../types/applicant";
import type { RecruitmentJob } from "../../types/recruitment";

const colors = ["#2563eb", "#f97316", "#22c55e", "#a855f7", "#eab308", "#06b6d4", "#ef4444"];
const genderPalette: Record<string, string> = {
  Male: "#1cd35c",
  Female: "#0ea5e9",
  "Non-Binary": "#a855f7",
  "Prefer not to say": "#64748b",
  "Not Specified": "#94a3b8",
};

const stageOrder: ApplicantStage[] = [
  "Applied",
  "Screening",
  "Task Assigned",
  "Task Submitted",
  "Interview",
  "Selected",
  "Rejected",
];

const parseMonthKey = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
};

const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString("en-US", { month: "short", year: "2-digit" });
};

const getTimeToHireDays = (applicant: ApplicantProfile) => {
  if (applicant.stage !== "Selected") return null;
  const appliedAt = new Date(applicant.appliedAt).getTime();
  const selectedAt = applicant.stageHistory.find((entry) => entry.stage === "Selected")?.movedAt;
  if (!selectedAt) return null;
  const selectedTime = new Date(selectedAt).getTime();
  if (!Number.isFinite(appliedAt) || !Number.isFinite(selectedTime) || selectedTime < appliedAt) return null;
  return Math.max(1, Math.round((selectedTime - appliedAt) / (1000 * 60 * 60 * 24)));
};

const RecruitmentAnalytics = () => {
  const [jobs, setJobs] = useState<RecruitmentJob[]>([]);
  const [applicants, setApplicants] = useState<ApplicantProfile[]>([]);

  const load = async () => {
    const [j, a] = await Promise.all([jobsService.getAllJobs(), applicantsService.getAll()]);
    setJobs(j);
    setApplicants(a);
  };

  useEffect(() => {
    load();
    const offJobs = jobsService.subscribe(load);
    const offApplicants = applicantsService.subscribe(load);
    return () => {
      offJobs();
      offApplicants();
    };
  }, []);

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === "published").length;
  const totalApplicants = applicants.length;
  const hiredCount = applicants.filter((a) => a.stage === "Selected").length;
  const rejectedCount = applicants.filter((a) => a.stage === "Rejected").length;
  const openApplicants = applicants.filter((a) => !["Selected", "Rejected"].includes(a.stage)).length;
  const conversionRate = totalApplicants ? Math.round((hiredCount / totalApplicants) * 100) : 0;
  const rejectionRatio = totalApplicants ? Math.round((rejectedCount / totalApplicants) * 100) : 0;

  const avgTimeToHire = useMemo(() => {
    const durations = applicants.map(getTimeToHireDays).filter((value): value is number => value !== null);
    if (!durations.length) return 0;
    return Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length);
  }, [applicants]);

  const mostAppliedJob = useMemo(() => {
    const byJob = new Map<string, number>();
    applicants.forEach((a) => byJob.set(a.jobId, (byJob.get(a.jobId) || 0) + 1));
    const top = Array.from(byJob.entries()).sort((a, b) => b[1] - a[1])[0];
    if (!top) return { title: "-", count: 0 };
    const job = jobs.find((j) => j.id === top[0]);
    return { title: job?.title || top[0], count: top[1] };
  }, [applicants, jobs]);

  const applicantsByEducation = useMemo(() => {
    const map = new Map<string, number>();
    applicants.forEach((a) => map.set(a.education, (map.get(a.education) || 0) + 1));
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [applicants]);

  const applicantsByLocation = useMemo(() => {
    const map = new Map<string, number>();
    applicants.forEach((a) => map.set(a.location, (map.get(a.location) || 0) + 1));
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [applicants]);

  const applicantsByGender = useMemo(() => {
    let male = 0;
    let female = 0;
    let others = 0;

    applicants.forEach((a) => {
      const key = (a.gender || "Not Specified") as ApplicantGender | "Not Specified";
      if (key === "Male") {
        male += 1;
        return;
      }
      if (key === "Female") {
        female += 1;
        return;
      }
      others += 1;
    });

    return {
      male,
      female,
      others,
      pieData: [
        { name: "Male", value: male },
        { name: "Female", value: female },
      ],
    };
  }, [applicants]);

  const monthlyTrend = useMemo(() => {
    const map = new Map<string, number>();
    applicants.forEach((a) => {
      const key = parseMonthKey(a.appliedAt);
      if (!key) return;
      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([monthKey, count]) => ({ month: formatMonth(monthKey), applicants: count }));
  }, [applicants]);

  const stageFunnel = useMemo(() => {
    const map = new Map<ApplicantStage, number>();
    stageOrder.forEach((stage) => map.set(stage, 0));
    applicants.forEach((a) => map.set(a.stage, (map.get(a.stage) || 0) + 1));
    return stageOrder.map((stage) => ({ stage, count: map.get(stage) || 0 }));
  }, [applicants]);

  const jobsByApplicantCount = useMemo(() => {
    const map = new Map<string, number>();
    applicants.forEach((a) => map.set(a.jobId, (map.get(a.jobId) || 0) + 1));
    return jobs
      .map((job) => ({ name: job.title, applicants: map.get(job.id) || 0 }))
      .sort((a, b) => b.applicants - a.applicants)
      .slice(0, 6);
  }, [jobs, applicants]);

  const educationTotal = useMemo(
    () => applicantsByEducation.reduce((sum, item) => sum + item.value, 0),
    [applicantsByEducation]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4"><p className="text-xs text-gray-500 uppercase">Total Jobs</p><p className="text-3xl font-black text-[#0f172a]">{totalJobs}</p></div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4"><p className="text-xs text-gray-500 uppercase">Active Jobs</p><p className="text-3xl font-black text-[#0f172a]">{activeJobs}</p></div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4"><p className="text-xs text-gray-500 uppercase">Total Applicants</p><p className="text-3xl font-black text-[#0f172a]">{totalApplicants}</p></div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4"><p className="text-xs text-gray-500 uppercase">Open Pipeline</p><p className="text-3xl font-black text-[#0f172a]">{openApplicants}</p></div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4"><p className="text-xs text-gray-500 uppercase">Conversion</p><p className="text-3xl font-black text-[#16a34a]">{conversionRate}%</p></div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4"><p className="text-xs text-gray-500 uppercase">Rejection Ratio</p><p className="text-3xl font-black text-red-500">{rejectionRatio}%</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-widest text-gray-500">Average Time To Hire</p>
          <p className="text-3xl font-black text-[#0f172a] mt-1">{avgTimeToHire} days</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-widest text-gray-500">Most Applied Job</p>
          <p className="text-xl font-black text-[#0f172a] mt-1 line-clamp-1">{mostAppliedJob.title}</p>
          <p className="text-sm text-gray-600 mt-1">{mostAppliedJob.count} applicants</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <h4 className="font-bold text-[#0f172a] mb-3">Gender Ratio</h4>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-3 items-center">
          <div className="h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applicantsByGender.pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={85}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {applicantsByGender.pieData.map((entry) => (
                    <Cell key={`gender-pie-${entry.name}`} fill={genderPalette[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {applicantsByGender.pieData.map((item) => {
              const pct = totalApplicants ? Math.round((item.value / totalApplicants) * 100) : 0;
              return (
                <div key={`gender-summary-${item.name}`} className="grid grid-cols-[120px_1fr_auto] items-center gap-3">
                  <p className="text-sm font-semibold text-gray-700">{item.name}</p>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: genderPalette[item.name] || "#94a3b8",
                      }}
                    />
                  </div>
                  <p className="text-sm font-semibold text-[#0f172a]">{item.value} ({pct}%)</p>
                </div>
              );
            })}
            {applicantsByGender.others > 0 && (
              <p className="text-xs text-gray-500">
                Other / not specified: <span className="font-semibold">{applicantsByGender.others}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 h-[320px]">
          <h4 className="font-bold text-[#0f172a] mb-3">Monthly Hiring Trend</h4>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applicants" stroke="#2563eb" strokeWidth={3}>
                <LabelList dataKey="applicants" position="top" fill="#0f172a" fontSize={11} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 h-[320px]">
          <h4 className="font-bold text-[#0f172a] mb-3">Applicants by Education</h4>
          <ResponsiveContainer width="100%" height="74%">
            <PieChart>
              <Pie data={applicantsByEducation} dataKey="value" nameKey="name" outerRadius={95} label>
                {applicantsByEducation.map((entry, idx) => (
                  <Cell key={entry.name} fill={colors[idx % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            {applicantsByEducation.map((item, idx) => {
              const pct = educationTotal ? Math.round((item.value / educationTotal) * 100) : 0;
              return (
                <div key={`education-summary-${item.name}`} className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-gray-600 min-w-0">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: colors[idx % colors.length] }}
                    />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="font-semibold text-[#0f172a] shrink-0">{item.value} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 h-[320px]">
          <h4 className="font-bold text-[#0f172a] mb-3">Stage Funnel</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={stageFunnel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="stage" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={55} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                <LabelList dataKey="count" position="top" fill="#0f172a" fontSize={11} />
                {stageFunnel.map((entry, idx) => (
                  <Cell key={`stage-color-${entry.stage}`} fill={colors[idx % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 h-[320px]">
          <h4 className="font-bold text-[#0f172a] mb-3">Applicants by Location</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={applicantsByLocation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                <LabelList dataKey="value" position="top" fill="#0f172a" fontSize={11} />
                {applicantsByLocation.map((entry, idx) => (
                  <Cell key={entry.name} fill={colors[idx % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 h-[340px]">
        <h4 className="font-bold text-[#0f172a] mb-3">Top Jobs by Applicants</h4>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={jobsByApplicantCount} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="applicants" radius={[0, 6, 6, 0]}>
              <LabelList dataKey="applicants" position="right" fill="#0f172a" fontSize={11} />
              {jobsByApplicantCount.map((entry, idx) => (
                <Cell key={`top-jobs-color-${entry.name}`} fill={colors[idx % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RecruitmentAnalytics;
