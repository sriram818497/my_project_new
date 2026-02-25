import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Inbox, ShieldCheck } from "lucide-react";
import { rightsRequestsService, type RightsRequestRecord, type RightsRequestStatus } from "../../services/rightsRequests";
import AdminSectionIntro from "./AdminSectionIntro";
import AdminEmptyState from "./AdminEmptyState";

const statusBadgeStyles: Record<RightsRequestStatus, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-green-100 text-green-700 border-green-200",
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

const DetailRow = ({ label, value }: { label: string; value: string | undefined }) => (
  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 py-2">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    <p className="text-sm text-[#0f172a] font-medium break-words">{value && value.trim() ? value : "-"}</p>
  </div>
);

const hasValue = (value: string | undefined) => Boolean(value && value.trim());

const DetailSection = ({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: string | undefined }>;
}) => {
  const visibleRows = rows.filter((row) => hasValue(row.value));
  if (!visibleRows.length) return null;

  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <p className="text-sm font-bold text-[#0f172a] mb-2">{title}</p>
      {visibleRows.map((row) => (
        <DetailRow key={row.label} label={row.label} value={row.value} />
      ))}
    </div>
  );
};

const RightsRequestsDashboard = () => {
  const [requests, setRequests] = useState<RightsRequestRecord[]>(() => rightsRequestsService.getAll());
  const [selectedRequest, setSelectedRequest] = useState<RightsRequestRecord | null>(null);

  useEffect(() => {
    const refresh = () => setRequests(rightsRequestsService.getAll());
    refresh();
    return rightsRequestsService.subscribe(refresh);
  }, []);

  useEffect(() => {
    if (!selectedRequest) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedRequest]);

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((item) => item.status === "pending").length;
    const inProgress = requests.filter((item) => item.status === "in_progress").length;
    const completed = requests.filter((item) => item.status === "completed").length;
    return { total, pending, inProgress, completed };
  }, [requests]);

  const updateStatus = (id: string, status: RightsRequestStatus) => {
    rightsRequestsService.updateStatus(id, status);
    if (selectedRequest?.id === id) {
      setSelectedRequest((prev) => (prev ? { ...prev, status } : prev));
    }
  };

  const requestDetailsModal =
    selectedRequest &&
    createPortal(
      <div className="fixed inset-0 z-[9999] isolate">
        <button
          aria-label="Close details"
          className="absolute inset-0 bg-black/55 backdrop-blur-[3px]"
          onClick={() => setSelectedRequest(null)}
        />
        <div className="absolute inset-0 flex items-start justify-center p-4 md:p-8 pt-20 md:pt-24">
          <div className="w-[min(1320px,calc(100vw-1.5rem))] h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] rounded-3xl bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-white/95 backdrop-blur border-b border-gray-200 px-6 md:px-7 py-4 md:py-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-[#0f172a] leading-tight">Request Details</h3>
                <p className="text-sm md:text-base text-gray-500 mt-1">
                  {selectedRequest.id} | {formatDateTime(selectedRequest.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm"
              >
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 p-5 md:p-7 space-y-6 overflow-y-auto overscroll-contain">
              <DetailSection
                title="Primary Information"
                rows={[
                  { label: "Request Type", value: selectedRequest.requestType },
                  { label: "Full Name", value: selectedRequest.fullName },
                  { label: "Email", value: selectedRequest.email },
                  { label: "Phone", value: selectedRequest.phone },
                  { label: "Country", value: selectedRequest.country },
                  { label: "Relationship", value: selectedRequest.relationship },
                  { label: "Status", value: selectedRequest.status.replace("_", " ") },
                ]}
              />

              <DetailSection
                title="Complaint Details"
                rows={[
                  { label: "Complaint Reason", value: selectedRequest.complaintReason },
                  { label: "Complaint Reason (Other)", value: selectedRequest.complaintReasonOther },
                  { label: "Complaint Target", value: selectedRequest.complaintTarget },
                  { label: "Complaint Target (Other)", value: selectedRequest.complaintTargetOther },
                ]}
              />

              <DetailSection
                title="Explanations"
                rows={[
                  { label: "Access Explanation", value: selectedRequest.accessExplanation },
                  { label: "Grievance Explanation", value: selectedRequest.grievanceExplanation },
                  { label: "Correction Type", value: selectedRequest.correctionType },
                ]}
              />

              <DetailSection
                title="Nominee Details"
                rows={[
                  { label: "Nominee Relationship", value: selectedRequest.nomineeRelationship },
                  { label: "Nominee Name", value: selectedRequest.nomineeName },
                  { label: "Nominee Establishment", value: selectedRequest.nomineeEstablishment },
                ]}
              />

              <div className="rounded-2xl border border-gray-200 p-5 md:p-6">
                <p className="text-xl md:text-2xl font-black text-[#0f172a] mb-3">Consent & Declaration</p>
                <DetailRow label="Accuracy Consent" value={selectedRequest.consents.accuracy ? "Yes" : "No"} />
                <DetailRow label="Verification Consent" value={selectedRequest.consents.verification ? "Yes" : "No"} />
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
        title="Rights Management Requests"
        subtitle="Manage data subject rights lifecycle with clear operational visibility."
        icon={ShieldCheck}
        badge="Privacy Rights"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-3xl font-black text-[#0f172a] leading-none">{stats.total}</p>
          <p className="text-gray-600 text-sm mt-2 font-medium">Total Requests</p>
        </div>
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-3xl font-black text-amber-600 leading-none">{stats.pending}</p>
          <p className="text-gray-600 text-sm mt-2 font-medium">Pending</p>
        </div>
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-3xl font-black text-blue-600 leading-none">{stats.inProgress}</p>
          <p className="text-gray-600 text-sm mt-2 font-medium">In Progress</p>
        </div>
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <p className="text-3xl font-black text-green-600 leading-none">{stats.completed}</p>
          <p className="text-gray-600 text-sm mt-2 font-medium">Completed</p>
        </div>
      </div>

      <div className="admin-table-shell bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1.2fr_1.2fr_1fr_1.1fr_0.9fr] gap-4 px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-600">
          <div>REQUESTER</div>
          <div>REQUEST TYPE</div>
          <div>RELATIONSHIP</div>
          <div>STATUS</div>
          <div>CREATED</div>
          <div>ACTIONS</div>
        </div>

        <div className="divide-y divide-gray-100">
          {requests.length === 0 && (
            <div className="px-6 py-6">
              <AdminEmptyState
                icon={Inbox}
                title="No Rights Requests"
                subtitle="Rights requests will appear here after users submit privacy-rights forms."
              />
            </div>
          )}
          {requests.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1.4fr_1.2fr_1.2fr_1fr_1.1fr_0.9fr] gap-4 px-6 py-5 items-start">
              <div className="min-w-0">
                <p className="font-semibold text-[#0f172a]">{item.fullName}</p>
                <p className="text-gray-500 text-sm">{item.email}</p>
                <p className="text-gray-500 text-sm">{item.country}</p>
              </div>
              <div className="min-w-0">
                <span
                  title={item.requestType || "-"}
                  className="inline-flex max-w-full px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 whitespace-normal break-words leading-snug"
                >
                  {item.requestType || "-"}
                </span>
              </div>
              <div className="min-w-0 text-[#0f172a] font-medium break-words">{item.relationship || "-"}</div>
              <div className="min-w-0">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${statusBadgeStyles[item.status]}`}>
                  {item.status.replace("_", " ")}
                </span>
              </div>
              <div className="min-w-0 text-gray-600 font-medium text-sm">{formatDateTime(item.createdAt)}</div>
              <div className="min-w-0 flex flex-col items-start gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(item)}
                  className="text-[#16a34a] font-semibold hover:text-[#15803d]"
                >
                  View Details
                </button>
                <select
                  value={item.status}
                  onChange={(e) => updateStatus(item.id, e.target.value as RightsRequestStatus)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {requestDetailsModal}
    </div>
  );
};

export default RightsRequestsDashboard;
