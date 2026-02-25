import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, CheckCircle2, Download, Search, Users, UserX } from "lucide-react";
import { contentManagerService } from "../../services/contentManager";
import { eventAttendanceService, type AttendanceStatus, type EventRegistration } from "../../services/eventAttendance";
import { trackAdminActivity } from "../../utils/adminActivityTracker";
import AdminSectionIntro from "./AdminSectionIntro";
import AdminEmptyState from "./AdminEmptyState";

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

const statusChipClass: Record<AttendanceStatus, string> = {
  registered: "bg-blue-50 border-blue-200 text-blue-700",
  attended: "bg-green-50 border-green-200 text-green-700",
  missed: "bg-red-50 border-red-200 text-red-700",
};

const EventAttendanceHub = () => {
  const [events, setEvents] = useState(() => contentManagerService.getEvents());
  const [registrations, setRegistrations] = useState<EventRegistration[]>(() => eventAttendanceService.getRegistrations());
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "all">("all");

  useEffect(() => {
    const refreshEvents = () => setEvents(contentManagerService.getEvents());
    const refreshRegistrations = () => setRegistrations(eventAttendanceService.getRegistrations());
    refreshEvents();
    refreshRegistrations();
    const unsubContent = contentManagerService.subscribe(refreshEvents);
    const unsubAttendance = eventAttendanceService.subscribe(refreshRegistrations);
    return () => {
      unsubContent();
      unsubAttendance();
    };
  }, []);

  useEffect(() => {
    if (selectedEventId) return;
    if (!events.length) return;
    setSelectedEventId(events[0].id);
  }, [events, selectedEventId]);

  const selectedEvent = useMemo(() => events.find((item) => item.id === selectedEventId), [events, selectedEventId]);

  const grouped = useMemo(() => {
    const map = new Map<string, EventRegistration[]>();
    registrations.forEach((item) => {
      if (!map.has(item.eventId)) map.set(item.eventId, []);
      map.get(item.eventId)?.push(item);
    });
    return map;
  }, [registrations]);

  const eventSummaries = useMemo(
    () =>
      events.map((event) => {
        const rows = grouped.get(event.id) ?? [];
        const registered = rows.length;
        const attended = rows.filter((item) => item.attendanceStatus === "attended").length;
        const missed = rows.filter((item) => item.attendanceStatus === "missed").length;
        return { event, registered, attended, missed };
      }),
    [events, grouped]
  );

  const selectedRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (grouped.get(selectedEventId) ?? []).filter((item) => {
      const statusOk = statusFilter === "all" ? true : item.attendanceStatus === statusFilter;
      if (!statusOk) return false;
      if (!q) return true;
      return [item.fullName, item.email, item.organization, item.currentRole, item.originCity].some((value) =>
        value.toLowerCase().includes(q)
      );
    });
  }, [grouped, selectedEventId, query, statusFilter]);

  const totals = useMemo(() => {
    const all = grouped.get(selectedEventId) ?? [];
    return {
      registered: all.length,
      attended: all.filter((item) => item.attendanceStatus === "attended").length,
      missed: all.filter((item) => item.attendanceStatus === "missed").length,
    };
  }, [grouped, selectedEventId]);

  const handleStatusUpdate = (registrationId: string, status: AttendanceStatus) => {
    eventAttendanceService.updateAttendanceStatus(registrationId, status);
    trackAdminActivity({
      title: "Event attendance updated",
      detail: `Registration status changed to ${status}.`,
      tone: "review",
      processId: "event-attendance",
      completedStepDelta: 1,
      started: true,
    });
  };

  const exportSelectedEventCsv = () => {
    const rows = grouped.get(selectedEventId) ?? [];
    const header = [
      "eventId",
      "eventTitle",
      "fullName",
      "email",
      "currentRole",
      "organization",
      "originCity",
      "contact",
      "attendanceStatus",
      "registeredAt",
      "attendanceUpdatedAt",
    ];
    const csv = [header.join(",")]
      .concat(
        rows.map((item) =>
          [
            item.eventId,
            item.eventTitle,
            item.fullName,
            item.email,
            item.currentRole,
            item.organization,
            item.originCity,
            item.contact ?? "",
            item.attendanceStatus,
            formatDateTime(item.registeredAt),
            item.attendanceUpdatedAt ? formatDateTime(item.attendanceUpdatedAt) : "",
          ]
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(",")
        )
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `event-attendance-${selectedEventId || "all"}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <AdminSectionIntro
        title="Event Attendance Hub"
        subtitle="Track registration performance and attendance outcomes event by event."
        icon={CalendarCheck2}
        badge="Engagement Ops"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="inline-flex w-11 h-11 rounded-xl bg-blue-50 items-center justify-center">
            <Users className="w-5 h-5 text-blue-700" />
          </div>
          <p className="text-3xl font-black text-[#0f172a] mt-3">{totals.registered}</p>
          <p className="text-gray-600 text-sm mt-1 font-medium">Registered</p>
        </div>
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="inline-flex w-11 h-11 rounded-xl bg-green-50 items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-700" />
          </div>
          <p className="text-3xl font-black text-[#0f172a] mt-3">{totals.attended}</p>
          <p className="text-gray-600 text-sm mt-1 font-medium">Attended</p>
        </div>
        <div className="admin-kpi-card bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="inline-flex w-11 h-11 rounded-xl bg-red-50 items-center justify-center">
            <UserX className="w-5 h-5 text-red-700" />
          </div>
          <p className="text-3xl font-black text-[#0f172a] mt-3">{totals.missed}</p>
          <p className="text-gray-600 text-sm mt-1 font-medium">Missed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
        <div className="admin-table-shell bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm font-semibold text-[#0f172a] mb-3">Events</p>
          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {eventSummaries.map(({ event, registered, attended, missed }) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedEventId(event.id)}
                className={`w-full text-left rounded-xl border p-3 transition-colors ${
                  selectedEventId === event.id ? "border-[#1cd35c]/60 bg-[#1cd35c]/5" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <p className="font-semibold text-[#0f172a]">{event.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {event.date} | {event.location}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold">
                  <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Reg: {registered}</span>
                  <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">Att: {attended}</span>
                  <span className="px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">Miss: {missed}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="admin-table-shell bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-black text-[#0f172a]">{selectedEvent?.title ?? "Select an event"}</h3>
              {selectedEvent && <p className="text-xs text-gray-500 mt-1">{selectedEvent.date} | {selectedEvent.location}</p>}
            </div>
            <button
              type="button"
              onClick={exportSelectedEventCsv}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_150px] gap-3 mb-4">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm"
                placeholder="Search name, email, org, role, city"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AttendanceStatus | "all")}
            >
              <option value="all">All Status</option>
              <option value="registered">Registered</option>
              <option value="attended">Attended</option>
              <option value="missed">Missed</option>
            </select>
            <div className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-600 font-medium">
              Records: {selectedRows.length}
            </div>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {selectedRows.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-200 p-4">
                <AdminEmptyState
                  icon={UserX}
                  title="No Registration Records"
                  subtitle="No registrations match the selected event and filter combination."
                />
              </div>
            )}
            {selectedRows.map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-200 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[#0f172a]">{item.fullName}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.email}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.currentRole} | {item.organization} | {item.originCity}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1.5">
                      Registered: {formatDateTime(item.registeredAt)}
                      {item.attendanceUpdatedAt ? ` | Updated: ${formatDateTime(item.attendanceUpdatedAt)}` : ""}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusChipClass[item.attendanceStatus]}`}>
                    {item.attendanceStatus}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(item.id, "registered")}
                    className="px-2.5 py-1.5 rounded-lg border border-blue-200 text-blue-700 text-xs font-semibold bg-blue-50"
                  >
                    Mark Registered
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(item.id, "attended")}
                    className="px-2.5 py-1.5 rounded-lg border border-green-200 text-green-700 text-xs font-semibold bg-green-50"
                  >
                    Mark Attended
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(item.id, "missed")}
                    className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-700 text-xs font-semibold bg-red-50"
                  >
                    Mark Missed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
          <CalendarCheck2 className="w-4 h-4 text-[#1cd35c]" />
          Advanced Notes
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Registrations are auto-captured from the event detail page form submission. Attendance status can be updated manually here per attendee.
        </p>
      </div>
    </div>
  );
};

export default EventAttendanceHub;
