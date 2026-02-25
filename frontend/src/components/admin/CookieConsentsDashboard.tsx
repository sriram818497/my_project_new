import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Cookie, Download, Inbox, Search } from "lucide-react";
import { cookieConsentsService, type ConsentStatus, type CookieConsentRecord } from "../../services/cookieConsents";
import AdminSectionIntro from "./AdminSectionIntro";
import AdminEmptyState from "./AdminEmptyState";

const statusLabel: Record<ConsentStatus, string> = {
  accepted_all: "Accepted All",
  rejected_all: "Rejected All",
  custom: "Custom Preferences",
};

const statusChipClass: Record<ConsentStatus, string> = {
  accepted_all: "bg-green-100 text-green-700 border-green-200",
  rejected_all: "bg-amber-100 text-amber-700 border-amber-200",
  custom: "bg-blue-100 text-blue-700 border-blue-200",
};

const categoryChip = (enabled: boolean) =>
  enabled ? "bg-[#dcfce7] text-[#166534] border-[#bbf7d0]" : "bg-gray-100 text-gray-500 border-gray-200";

const formatConsentDateTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const normalizeCookieValue = (value: string | undefined) => {
  if (!value) return "Not set";
  if (value === "accepted") return "Accepted";
  if (value === "declined") return "Declined";
  if (value === "customized") return "Customized";
  return value;
};

const toCsvCell = (value: string | number | boolean) => `"${String(value).replace(/"/g, '""')}"`;

type ToggleFilter = "all" | "enabled" | "disabled";

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 py-2">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    <p className="text-sm text-[#0f172a] font-medium break-words">{value}</p>
  </div>
);

const CookieConsentsDashboard = () => {
  const [consentRecords, setConsentRecords] = useState<CookieConsentRecord[]>(() => cookieConsentsService.getAll());
  const [selectedConsent, setSelectedConsent] = useState<CookieConsentRecord | null>(null);
  const [ipQuery, setIpQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [analyticsFilter, setAnalyticsFilter] = useState<ToggleFilter>("all");
  const [personalizationFilter, setPersonalizationFilter] = useState<ToggleFilter>("all");
  const [marketingFilter, setMarketingFilter] = useState<ToggleFilter>("all");
  const [updatedFrom, setUpdatedFrom] = useState("");
  const [updatedTo, setUpdatedTo] = useState("");

  useEffect(() => {
    const refresh = () => setConsentRecords(cookieConsentsService.getAll());
    refresh();
    return cookieConsentsService.subscribe(refresh);
  }, []);

  const stats = useMemo(() => {
    const total = consentRecords.length;
    const accepted = consentRecords.filter((item) => item.status === "accepted_all").length;
    const rejected = consentRecords.filter((item) => item.status === "rejected_all").length;
    const custom = consentRecords.filter((item) => item.status === "custom").length;
    return { total, accepted, rejected, custom };
  }, [consentRecords]);

  const stateOptions = useMemo(
    () =>
      Array.from(new Set(consentRecords.map((item) => item.state).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [consentRecords]
  );

  const countryOptions = useMemo(
    () =>
      Array.from(new Set(consentRecords.map((item) => item.country).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [consentRecords]
  );

  const filtered = useMemo(() => {
    const normalizedIp = ipQuery.trim().toLowerCase();
    const fromTs = updatedFrom ? new Date(`${updatedFrom}T00:00:00`).getTime() : null;
    const toTs = updatedTo ? new Date(`${updatedTo}T23:59:59.999`).getTime() : null;

    return consentRecords.filter((item) => {
      if (normalizedIp && !item.ipAddress.toLowerCase().includes(normalizedIp)) return false;
      if (stateFilter !== "all" && item.state !== stateFilter) return false;
      if (countryFilter !== "all" && item.country !== countryFilter) return false;

      if (analyticsFilter !== "all" && (analyticsFilter === "enabled") !== item.analytics) return false;
      if (personalizationFilter !== "all" && (personalizationFilter === "enabled") !== item.personalization) return false;
      if (marketingFilter !== "all" && (marketingFilter === "enabled") !== item.marketing) return false;

      const updatedTs = new Date(item.lastUpdated).getTime();
      if (!Number.isFinite(updatedTs)) return false;
      if (fromTs !== null && updatedTs < fromTs) return false;
      if (toTs !== null && updatedTs > toTs) return false;

      return true;
    });
  }, [
    consentRecords,
    ipQuery,
    stateFilter,
    countryFilter,
    analyticsFilter,
    personalizationFilter,
    marketingFilter,
    updatedFrom,
    updatedTo,
  ]);

  const exportCsv = () => {
    const headers = [
      "id",
      "ipAddress",
      "state",
      "country",
      "status",
      "essential",
      "analytics",
      "personalization",
      "marketing",
      "source",
      "consentDate",
      "lastUpdated",
    ];
    const rows = filtered.map((item) => [
      item.id,
      item.ipAddress,
      item.state,
      item.country,
      item.status,
      item.essential,
      item.analytics,
      item.personalization,
      item.marketing,
      item.source,
      item.consentDate,
      item.lastUpdated,
    ]);
    const csv = [headers.map(toCsvCell).join(","), ...rows.map((row) => row.map(toCsvCell).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `cookie-consents-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!selectedConsent) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedConsent]);

  const consentDetailsModal =
    selectedConsent &&
    createPortal(
      <div className="fixed inset-0 z-[9999] isolate">
        <button
          className="absolute inset-0 bg-black/55 backdrop-blur-[3px]"
          onClick={() => setSelectedConsent(null)}
          aria-label="Close consent details"
        />
        <div className="absolute inset-0 flex items-start justify-center p-4 md:p-8 pt-20 md:pt-24">
          <div className="w-[min(1320px,calc(100vw-1.5rem))] h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] rounded-3xl bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-white/95 backdrop-blur border-b border-gray-200 px-6 md:px-7 py-4 md:py-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-[#0f172a] leading-tight">Consent Details</h3>
                <p className="text-gray-500 text-sm md:text-base mt-1">
                  {selectedConsent.id} | {selectedConsent.ipAddress}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedConsent(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm"
              >
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 p-5 md:p-7 space-y-6 overflow-y-auto overscroll-contain">
              <div className="rounded-2xl border border-gray-200 p-5 md:p-6">
                <p className="text-xl md:text-2xl font-black text-[#0f172a] mb-3">Consent Summary</p>
                <DetailRow label="Status" value={statusLabel[selectedConsent.status]} />
                <DetailRow label="IP Address" value={selectedConsent.ipAddress} />
                <DetailRow label="Region" value={`${selectedConsent.state}, ${selectedConsent.country}`} />
                <DetailRow label="Captured From" value={selectedConsent.source.replace(/_/g, " ")} />
                <DetailRow label="Consent Date" value={formatConsentDateTime(selectedConsent.consentDate)} />
                <DetailRow label="Last Updated" value={formatConsentDateTime(selectedConsent.lastUpdated)} />
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 md:p-6">
                <p className="text-xl md:text-2xl font-black text-[#0f172a] mb-3">Category Preferences</p>
                <DetailRow label="Necessary" value={selectedConsent.essential ? "Enabled" : "Disabled"} />
                <DetailRow label="Analytics" value={selectedConsent.analytics ? "Enabled" : "Disabled"} />
                <DetailRow label="Personalization" value={selectedConsent.personalization ? "Enabled" : "Disabled"} />
                <DetailRow label="Marketing" value={selectedConsent.marketing ? "Enabled" : "Disabled"} />
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 md:p-6">
                <p className="text-xl md:text-2xl font-black text-[#0f172a] mb-3">Website Cookie Snapshot</p>
                <DetailRow label="Cookie Consent" value={normalizeCookieValue(selectedConsent.cookieSnapshot["cookie-consent"])} />
                <DetailRow
                  label="Necessary Cookie"
                  value={normalizeCookieValue(selectedConsent.cookieSnapshot["cookie-consent-necessary"])}
                />
                <DetailRow
                  label="Analytics Cookie"
                  value={normalizeCookieValue(selectedConsent.cookieSnapshot["cookie-consent-analytics"])}
                />
                <DetailRow
                  label="Marketing Cookie"
                  value={normalizeCookieValue(selectedConsent.cookieSnapshot["cookie-consent-marketing"])}
                />
                <DetailRow label="Page Views Cookie" value={normalizeCookieValue(selectedConsent.cookieSnapshot.page_views)} />
                <DetailRow label="First Visit Cookie" value={normalizeCookieValue(selectedConsent.cookieSnapshot.first_visit)} />
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <div className="space-y-8">
      <AdminSectionIntro
        title="Cookie Consents"
        subtitle="Audit and govern consent decisions with category-level transparency."
        icon={Cookie}
        badge="Consent Governance"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-3xl font-black text-[#0f172a] leading-none">{stats.total}</p>
          <p className="text-gray-600 text-sm mt-2 font-medium">Total Consents</p>
        </div>
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-3xl font-black text-green-600 leading-none">{stats.accepted}</p>
          <p className="text-gray-600 text-sm mt-2 font-medium">Accepted</p>
        </div>
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-3xl font-black text-amber-600 leading-none">{stats.rejected}</p>
          <p className="text-gray-600 text-sm mt-2 font-medium">Rejected</p>
        </div>
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-3xl font-black text-blue-600 leading-none">{stats.custom}</p>
          <p className="text-gray-600 text-sm mt-2 font-medium">Custom Preferences</p>
        </div>
      </div>

      <div className="admin-table-shell bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-8 gap-3">
          <div className="relative md:col-span-2 xl:col-span-2">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={ipQuery}
              onChange={(event) => setIpQuery(event.target.value)}
              placeholder="Filter by IP address"
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm"
            />
          </div>

          <select
            value={stateFilter}
            onChange={(event) => setStateFilter(event.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
          >
            <option value="all">All States</option>
            {stateOptions.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <select
            value={countryFilter}
            onChange={(event) => setCountryFilter(event.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
          >
            <option value="all">All Countries</option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <select
            value={analyticsFilter}
            onChange={(event) => setAnalyticsFilter(event.target.value as ToggleFilter)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
          >
            <option value="all">Analytics: All</option>
            <option value="enabled">Analytics: Enabled</option>
            <option value="disabled">Analytics: Disabled</option>
          </select>

          <select
            value={personalizationFilter}
            onChange={(event) => setPersonalizationFilter(event.target.value as ToggleFilter)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
          >
            <option value="all">Personalization: All</option>
            <option value="enabled">Personalization: Enabled</option>
            <option value="disabled">Personalization: Disabled</option>
          </select>

          <select
            value={marketingFilter}
            onChange={(event) => setMarketingFilter(event.target.value as ToggleFilter)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
          >
            <option value="all">Marketing: All</option>
            <option value="enabled">Marketing: Enabled</option>
            <option value="disabled">Marketing: Disabled</option>
          </select>

          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="text-xs font-semibold text-gray-600 flex items-center">Last Updated From</div>
          <input
            type="date"
            value={updatedFrom}
            onChange={(event) => setUpdatedFrom(event.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
          />
          <div className="text-xs font-semibold text-gray-600 flex items-center">To</div>
          <input
            type="date"
            value={updatedTo}
            onChange={(event) => setUpdatedTo(event.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="admin-table-shell bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-600">
          <div>IP ADDRESS</div>
          <div>STATE, COUNTRY</div>
          <div>STATUS</div>
          <div>ANALYTICS</div>
          <div>PERSONALIZATION</div>
          <div>MARKETING</div>
          <div>LAST UPDATED</div>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedConsent(item)}
              className="w-full text-left grid grid-cols-1 md:grid-cols-7 gap-4 px-6 py-5 items-start hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-semibold text-[#0f172a]">{item.ipAddress}</p>
                <p className="text-gray-400 text-xs mt-1">{item.id}</p>
              </div>
              <div className="text-[#0f172a] font-medium">{item.state}, {item.country}</div>
              <div>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${statusChipClass[item.status]}`}>
                  {statusLabel[item.status]}
                </span>
              </div>
              <div>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${categoryChip(item.analytics)}`}>
                  {item.analytics ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${categoryChip(item.personalization)}`}
                >
                  {item.personalization ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${categoryChip(item.marketing)}`}>
                  {item.marketing ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div>
                <p className="text-gray-700 font-medium">{formatConsentDateTime(item.lastUpdated)}</p>
                <p className="text-gray-400 text-xs mt-1">Accepted: {formatConsentDateTime(item.consentDate)}</p>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-6">
              <AdminEmptyState
                icon={Inbox}
                title="No Consent Records"
                subtitle="No records match the current filters. Adjust filters or wait for new consent activity."
              />
            </div>
          )}
        </div>
      </div>

      {consentDetailsModal}
    </div>
  );
};

export default CookieConsentsDashboard;
