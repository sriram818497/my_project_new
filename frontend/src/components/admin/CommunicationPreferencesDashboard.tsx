import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Inbox, MessageSquare, Search } from "lucide-react";
import {
  communicationPreferencesService,
} from "../../services/communicationPreferences";
import { trackAdminActivity } from "../../utils/adminActivityTracker";
import AdminSectionIntro from "./AdminSectionIntro";
import AdminEmptyState from "./AdminEmptyState";
import type {
  CommunicationChannel,
  CommunicationPreferenceRecord,
  CommunicationPreferenceStatus,
  CommunicationPreferences,
} from "../../types/communication";

const statusChipClass: Record<CommunicationPreferenceStatus, string> = {
  subscribed: "bg-green-100 text-green-700 border-green-200",
  unsubscribed: "bg-gray-100 text-gray-600 border-gray-200",
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

const formatChannelLabel = (channel: CommunicationChannel) => {
  if (channel === "productUpdates") return "Product Updates";
  if (channel === "promotionalOffers") return "Promotional Offers";
  return "Newsletters";
};

const toCsvCell = (value: string | number | boolean) => `"${String(value).replace(/"/g, '""')}"`;

const channelOrder: CommunicationChannel[] = ["newsletters", "productUpdates", "promotionalOffers"];

const CommunicationPreferencesDashboard = () => {
  const [records, setRecords] = useState<CommunicationPreferenceRecord[]>(() => communicationPreferencesService.getAll());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CommunicationPreferenceStatus | "all">("all");
  const [channelFilter, setChannelFilter] = useState<CommunicationChannel | "all">("all");
  const [selectedRecord, setSelectedRecord] = useState<CommunicationPreferenceRecord | null>(null);
  const [draftPreferences, setDraftPreferences] = useState<CommunicationPreferences | null>(null);

  useEffect(() => {
    const refresh = () => setRecords(communicationPreferencesService.getAll());
    refresh();
    return communicationPreferencesService.subscribe(refresh);
  }, []);

  useEffect(() => {
    if (!selectedRecord) {
      setDraftPreferences(null);
      return;
    }
    setDraftPreferences(selectedRecord.preferences);
  }, [selectedRecord]);

  useEffect(() => {
    if (!selectedRecord) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedRecord]);

  const stats = useMemo(() => {
    const total = records.length;
    const subscribed = records.filter((item) => item.status === "subscribed").length;
    const unsubscribed = records.filter((item) => item.status === "unsubscribed").length;
    const newsletters = records.filter((item) => item.preferences.newsletters).length;
    const productUpdates = records.filter((item) => item.preferences.productUpdates).length;
    const promotionalOffers = records.filter((item) => item.preferences.promotionalOffers).length;
    return { total, subscribed, unsubscribed, newsletters, productUpdates, promotionalOffers };
  }, [records]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return records.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (channelFilter !== "all" && !item.preferences[channelFilter]) return false;
      if (!normalized) return true;
      return [item.fullName, item.email, item.id, item.lastUpdatedBy].some((value) => value.toLowerCase().includes(normalized));
    });
  }, [records, query, statusFilter, channelFilter]);

  const exportCsv = () => {
    const headers = [
      "id",
      "fullName",
      "email",
      "status",
      "newsletters",
      "productUpdates",
      "promotionalOffers",
      "source",
      "consentCapturedAt",
      "lastUpdated",
      "lastUpdatedBy",
    ];
    const rows = filtered.map((item) => [
      item.id,
      item.fullName,
      item.email,
      item.status,
      item.preferences.newsletters,
      item.preferences.productUpdates,
      item.preferences.promotionalOffers,
      item.source,
      item.consentCapturedAt,
      item.lastUpdated,
      item.lastUpdatedBy,
    ]);
    const csv = [headers.map(toCsvCell).join(","), ...rows.map((row) => row.map(toCsvCell).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `communication-preferences-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleStatusChange = (record: CommunicationPreferenceRecord, status: CommunicationPreferenceStatus) => {
    communicationPreferencesService.updateStatus(record.id, status);
    trackAdminActivity({
      title: "Communication status updated",
      detail: `${record.email} marked as ${status}.`,
      tone: "review",
      processId: "communication-preferences",
      completedStepDelta: 1,
      started: true,
    });
  };

  const handleDraftToggle = (channel: CommunicationChannel) => {
    if (!draftPreferences) return;
    setDraftPreferences({
      ...draftPreferences,
      [channel]: !draftPreferences[channel],
    });
  };

  const saveDraft = () => {
    if (!selectedRecord || !draftPreferences) return;
    communicationPreferencesService.updatePreferences(selectedRecord.id, draftPreferences);
    setSelectedRecord((prev) => (prev ? { ...prev, preferences: draftPreferences } : prev));
    trackAdminActivity({
      title: "Communication channels updated",
      detail: `Channel preferences updated for ${selectedRecord.email}.`,
      tone: "success",
      processId: "communication-preferences",
      completedStepDelta: 1,
      started: true,
    });
    setSelectedRecord(null);
  };

  const communicationDetailsModal =
    selectedRecord &&
    draftPreferences &&
    createPortal(
      <div className="fixed inset-0 z-[9999] isolate">
        <button
          className="absolute inset-0 bg-black/55 backdrop-blur-[3px]"
          onClick={() => setSelectedRecord(null)}
          aria-label="Close communication preference details"
        />
        <div className="absolute inset-0 flex items-start justify-center p-4 md:p-8 pt-20 md:pt-24">
          <div className="w-[min(1320px,calc(100vw-1.5rem))] h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] rounded-3xl bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-white/95 backdrop-blur border-b border-gray-200 px-6 md:px-7 py-4 md:py-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-[#0f172a] leading-tight">Communication Profile</h3>
                <p className="text-sm md:text-base text-gray-500 mt-1">
                  {selectedRecord.id} | {selectedRecord.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm"
              >
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 p-5 md:p-7 space-y-6 overflow-y-auto overscroll-contain">
              <div className="rounded-2xl border border-gray-200 p-5 md:p-6">
                <p className="text-xl md:text-2xl font-black text-[#0f172a] mb-3">Profile Summary</p>
                <p className="text-sm text-gray-700">Name: {selectedRecord.fullName}</p>
                <p className="text-sm text-gray-700 mt-1">Status: {selectedRecord.status}</p>
                <p className="text-sm text-gray-700 mt-1">Source: {selectedRecord.source.replace("_", " ")}</p>
                <p className="text-sm text-gray-700 mt-1">Consent Captured: {formatDateTime(selectedRecord.consentCapturedAt)}</p>
                <p className="text-sm text-gray-700 mt-1">Last Updated: {formatDateTime(selectedRecord.lastUpdated)}</p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 md:p-6">
                <p className="text-xl md:text-2xl font-black text-[#0f172a] mb-3">Channel Controls</p>
                <div className="space-y-3">
                  {channelOrder.map((channel) => (
                    <label key={channel} className="flex items-center justify-between p-3 rounded-xl border border-gray-200">
                      <span className="text-sm font-semibold text-[#0f172a]">{formatChannelLabel(channel)}</span>
                      <input
                        type="checkbox"
                        checked={draftPreferences[channel]}
                        onChange={() => handleDraftToggle(channel)}
                        className="w-4 h-4 accent-[#16a34a]"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-5 md:px-7 py-4 flex items-center justify-end gap-3 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveDraft}
                className="px-4 py-2 rounded-xl border border-[#bbf7d0] bg-[#dcfce7] text-[#166534] text-sm font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <div className="space-y-8">
      <AdminSectionIntro
        title="Communication Preferences"
        subtitle="Run subscriber governance with channel-level control and exportable operational records."
        icon={MessageSquare}
        badge="Communication Governance"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-3xl font-black text-[#0f172a] leading-none">{stats.total}</p>
          <p className="text-gray-600 text-sm mt-2 font-medium">Total Profiles</p>
        </div>
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-3xl font-black text-green-600 leading-none">{stats.subscribed}</p>
          <p className="text-gray-600 text-sm mt-2 font-medium">Subscribed</p>
        </div>
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-3xl font-black text-gray-700 leading-none">{stats.unsubscribed}</p>
          <p className="text-gray-600 text-sm mt-2 font-medium">Unsubscribed</p>
        </div>
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-3xl font-black text-blue-600 leading-none">{stats.newsletters}</p>
          <p className="text-gray-600 text-sm mt-2 font-medium">Newsletters</p>
        </div>
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-3xl font-black text-emerald-600 leading-none">{stats.productUpdates}</p>
          <p className="text-gray-600 text-sm mt-2 font-medium">Product Updates</p>
        </div>
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-3xl font-black text-purple-600 leading-none">{stats.promotionalOffers}</p>
          <p className="text-gray-600 text-sm mt-2 font-medium">Promotional Offers</p>
        </div>
      </div>

      <div className="admin-table-shell bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px_auto] gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, email, id, actor"
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as CommunicationPreferenceStatus | "all")}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
          >
            <option value="all">All Status</option>
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
          <select
            value={channelFilter}
            onChange={(event) => setChannelFilter(event.target.value as CommunicationChannel | "all")}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
          >
            <option value="all">All Channels</option>
            <option value="newsletters">Newsletters</option>
            <option value="productUpdates">Product Updates</option>
            <option value="promotionalOffers">Promotional Offers</option>
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
      </div>

      <div className="admin-table-shell bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-600">
          <div>PROFILE</div>
          <div>STATUS</div>
          <div>CHANNELS</div>
          <div>SOURCE</div>
          <div>LAST UPDATED</div>
          <div>ACTIONS</div>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.length === 0 && (
            <div className="px-6 py-6">
              <AdminEmptyState
                icon={Inbox}
                title="No Communication Profiles"
                subtitle="No records match the current filter. Adjust filters or wait for new preference submissions."
              />
            </div>
          )}
          {filtered.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 px-6 py-5 items-start">
              <div>
                <p className="font-semibold text-[#0f172a]">{item.fullName}</p>
                <p className="text-gray-500 text-sm">{item.email}</p>
                <p className="text-gray-400 text-xs mt-1">{item.id}</p>
              </div>
              <div>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${statusChipClass[item.status]}`}>
                  {item.status}
                </span>
              </div>
              <div className="space-y-1">
                {channelOrder.map((channel) => (
                  <p key={channel} className="text-xs text-gray-700 font-medium">
                    {formatChannelLabel(channel)}: {item.preferences[channel] ? "Enabled" : "Disabled"}
                  </p>
                ))}
              </div>
              <div className="text-sm font-medium text-gray-700">{item.source.replace("_", " ")}</div>
              <div>
                <p className="text-sm font-medium text-gray-700">{formatDateTime(item.lastUpdated)}</p>
                <p className="text-xs text-gray-500 mt-1">By: {item.lastUpdatedBy}</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(item)}
                  className="text-[#16a34a] font-semibold hover:text-[#15803d]"
                >
                  View Details
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item, "subscribed")}
                    className="px-2.5 py-1.5 rounded-lg border border-green-200 text-green-700 text-xs font-semibold bg-green-50"
                  >
                    Subscribe
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item, "unsubscribed")}
                    className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-xs font-semibold bg-gray-50"
                  >
                    Unsubscribe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {communicationDetailsModal}
    </div>
  );
};

export default CommunicationPreferencesDashboard;
