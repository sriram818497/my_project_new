import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import AdminEmptyState from "./AdminEmptyState";
import {
  getAdminActivitySnapshot,
  subscribeAdminActivity,
  type AdminActivitySnapshot,
  type AdminProcessId,
} from "../../utils/adminActivityTracker";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  iconSurfaceClassName: string;
  trend: string;
  trendTone: "positive" | "neutral";
}

interface LoginCardProps {
  title: string;
  description: string;
  link: string;
}

interface AttentionItem {
  title: string;
  owner: string;
  due: string;
  severity: "high" | "medium" | "low";
}

const attentionItems: AttentionItem[] = [
  {
    title: "DSR-2026-014 requires legal review",
    owner: "Privacy Office",
    due: "Due today",
    severity: "high",
  },
  {
    title: "Requisition REC-118 draft pending approval",
    owner: "Talent Acquisition",
    due: "Due in 1 day",
    severity: "medium",
  },
  {
    title: "Cookie policy banner content update",
    owner: "Compliance Ops",
    due: "Due in 3 days",
    severity: "low",
  },
  {
    title: "Monthly admin access review pending sign-off",
    owner: "Security Team",
    due: "Due in 2 days",
    severity: "medium",
  },
];

const formatRelativeTime = (timestamp: number) => {
  const diffMs = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const formatExactTime = (timestamp: number) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(timestamp);

const getActivityTypeLabel = (title: string) => {
  if (title.toLowerCase().startsWith("opened ")) return "Opened";
  return "Action";
};

const StatCard = ({ icon: Icon, label, value, iconSurfaceClassName, trend, trendTone }: StatCardProps) => (
  <div className="group bg-white border border-gray-200/90 p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`p-3.5 rounded-xl shadow-sm border ${iconSurfaceClassName}`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-3xl md:text-4xl font-black leading-none text-[#0f172a]">{value}</p>
          <p className="text-xs md:text-sm font-semibold text-gray-600 mt-2 uppercase tracking-wide">{label}</p>
        </div>
      </div>
      <span
        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
          trendTone === "positive"
            ? "text-[#166534] bg-[#dcfce7] border-[#bbf7d0]"
            : "text-[#475569] bg-[#f1f5f9] border-[#e2e8f0]"
        } whitespace-nowrap`}
      >
        {trend}
      </span>
    </div>
  </div>
);

const LoginCard = ({ title, description, link }: LoginCardProps) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="group bg-white border border-gray-200/90 p-5 md:p-6 rounded-2xl hover:shadow-lg hover:border-[#1cd35c]/40 transition-all duration-300"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h3 className="text-[1.2rem] md:text-[1.45rem] leading-tight font-black text-[#0f172a] mb-2">{title}</h3>
        <p className="text-sm text-gray-600 font-medium leading-relaxed">{description}</p>
      </div>
      <div className="shrink-0 p-2 rounded-lg text-gray-400 group-hover:text-[#1cd35c] group-hover:bg-[#1cd35c]/10 transition-all">
        <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
      </div>
    </div>
    <div className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#16a34a]">
      Open Console
      <ArrowUpRight className="w-3.5 h-3.5" />
    </div>
  </a>
);

interface OverviewProps {
  onActivityNavigate?: (processId: AdminProcessId) => void;
}

const Overview = ({ onActivityNavigate }: OverviewProps) => {
  const [snapshot, setSnapshot] = useState<AdminActivitySnapshot>(() => getAdminActivitySnapshot());

  useEffect(() => {
    setSnapshot(getAdminActivitySnapshot());
    return subscribeAdminActivity(() => setSnapshot(getAdminActivitySnapshot()));
  }, []);

  const recentActivities = useMemo(() => snapshot.activities.slice(0, 10), [snapshot.activities]);

  return (
    <div className="space-y-7 md:space-y-9">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <h2 className="text-[1.45rem] md:text-[2rem] font-black text-[#0f172a]">Operational Snapshot</h2>
          <span className="text-[11px] md:text-sm font-semibold text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">
            Last refreshed: 2 mins ago
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={Briefcase}
            label="Active Requisitions"
            value="6"
            trend="+2 vs last 30 days"
            trendTone="positive"
            iconSurfaceClassName="bg-gradient-to-br from-blue-600 to-blue-500 border-blue-500/40"
          />
          <StatCard
            icon={FileText}
            label="Published Knowledge Posts"
            value="11"
            trend="+1 vs last 30 days"
            trendTone="positive"
            iconSurfaceClassName="bg-gradient-to-br from-emerald-600 to-emerald-500 border-emerald-500/40"
          />
          <StatCard
            icon={ShieldCheck}
            label="Open DSR Cases"
            value="1"
            trend="SLA: 0 overdue"
            trendTone="neutral"
            iconSurfaceClassName="bg-gradient-to-br from-violet-600 to-violet-500 border-violet-500/40"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm h-full">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg md:text-xl font-black text-[#0f172a]">Needs Attention</h3>
            <span className="text-xs font-semibold text-[#b91c1c] bg-[#fef2f2] border border-[#fecaca] px-2.5 py-1 rounded-full">
              1 high priority
            </span>
          </div>
          <div className="space-y-3">
            {attentionItems.map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-200 p-4 hover:border-[#1cd35c]/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-[#0f172a] leading-5">{item.title}</p>
                  <span
                    className={`text-[11px] font-semibold px-2 py-1 rounded-full border whitespace-nowrap ${
                      item.severity === "high"
                        ? "text-[#991b1b] bg-[#fee2e2] border-[#fecaca]"
                        : item.severity === "medium"
                        ? "text-[#92400e] bg-[#fef3c7] border-[#fde68a]"
                        : "text-[#166534] bg-[#dcfce7] border-[#bbf7d0]"
                    }`}
                  >
                    {item.severity.toUpperCase()}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500 font-medium gap-3">
                  <span>{item.owner}</span>
                  <span>{item.due}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm h-full">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg md:text-xl font-black text-[#0f172a]">Admin Activity Log</h3>
            <span className="text-[11px] font-semibold text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full">
              Session Started: {formatExactTime(snapshot.loginAt)}
            </span>
          </div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {recentActivities.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-200 p-4">
                <AdminEmptyState
                  icon={Clock3}
                  title="No Session Activity Yet"
                  subtitle="Actions performed in this session will appear in this timeline."
                />
              </div>
            )}
            {recentActivities.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => item.processId && onActivityNavigate?.(item.processId)}
                className={`w-full text-left rounded-xl border border-gray-200 p-4 transition-colors ${
                  item.processId ? "hover:bg-gray-50 hover:border-[#1cd35c]/30 cursor-pointer" : "cursor-default"
                }`}
                disabled={!item.processId}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 inline-flex w-8 h-8 items-center justify-center rounded-lg ${
                      item.tone === "success"
                        ? "bg-[#dcfce7] text-[#166534]"
                        : item.tone === "review"
                        ? "bg-[#e0f2fe] text-[#0c4a6e]"
                        : "bg-[#fee2e2] text-[#991b1b]"
                    }`}
                  >
                    {item.tone === "success" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : item.tone === "review" ? (
                      <Clock3 className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#0f172a]">{item.title}</p>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-full">
                        {getActivityTypeLabel(item.title)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-5">{item.detail}</p>
                    <p className="text-[11px] text-gray-500 font-semibold mt-1.5">
                      {formatExactTime(item.timestamp)} | {formatRelativeTime(item.timestamp)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      <section>
        <div className="flex items-center gap-2.5 mb-4 flex-wrap">
          <Users className="w-5 h-5 text-[#1cd35c]" />
          <h2 className="text-[1.45rem] md:text-[2rem] font-black text-[#0f172a]">Platform Access</h2>
          <span className="admin-pill rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest">Operations</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LoginCard
            title="RoPA Workspace"
            description="Records of Processing Activities workspace for operational users"
            link="https://ropa.protecciodata.com"
          />
          <LoginCard
            title="Privacy Tools Workspace"
            description="Assessment and compliance tools for day-to-day operations"
            link="https://tools.protecciodata.com"
          />
          <LoginCard
            title="PIA Workspace"
            description="Privacy Impact Assessment portal for governance workflows"
            link="https://pia.protecciodata.com"
          />
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      <section>
        <div className="flex items-center gap-2.5 mb-4 flex-wrap">
          <UserCog className="w-5 h-5 text-[#1cd35c]" />
          <h2 className="text-[1.45rem] md:text-[2rem] font-black text-[#0f172a]">Administrative Access</h2>
          <span className="admin-pill rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest">Governance</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LoginCard
            title="RoPA Admin Console"
            description="Administrative controls for RoPA governance and configuration"
            link="https://ropa-admin.protecciodata.com"
          />
          <LoginCard
            title="Privacy Tools Admin Console"
            description="Administrative controls for assessments and tool configuration"
            link="https://tools-admin.protecciodata.com"
          />
          <LoginCard
            title="PIA Admin Console"
            description="Administrative controls for PIA templates and review workflow"
            link="https://pia-admin.protecciodata.com"
          />
        </div>
      </section>
    </div>
  );
};

export default Overview;
