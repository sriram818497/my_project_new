import { prisma } from "../../config/prisma";
import type { AttendanceStatus, EventRegistration } from "./eventAttendance.types";

const mapRegistration = (row: {
  id: string;
  eventId: string;
  eventTitle: string;
  fullName: string;
  email: string;
  currentRole: string;
  organization: string;
  originCity: string;
  contact: string | null;
  consent: boolean;
  registeredAt: Date;
  attendanceStatus: AttendanceStatus;
  attendanceUpdatedAt: Date | null;
}): EventRegistration => ({
  id: row.id,
  eventId: row.eventId,
  eventTitle: row.eventTitle,
  fullName: row.fullName,
  email: row.email,
  currentRole: row.currentRole,
  organization: row.organization,
  originCity: row.originCity,
  contact: row.contact ?? undefined,
  consent: row.consent,
  registeredAt: row.registeredAt.toISOString(),
  attendanceStatus: row.attendanceStatus,
  attendanceUpdatedAt: row.attendanceUpdatedAt?.toISOString(),
});

const buildId = () => `evtreg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const eventAttendanceService = {
  async getAll() {
    const rows = await prisma.eventRegistration.findMany({
      orderBy: { registeredAt: "desc" },
    });
    return rows.map((row) => mapRegistration({ ...row, attendanceStatus: row.attendanceStatus as AttendanceStatus }));
  },

  async register(input: Omit<EventRegistration, "id" | "registeredAt" | "attendanceStatus" | "attendanceUpdatedAt">) {
    const normalizedEmail = input.email.trim().toLowerCase();
    const existing = await prisma.eventRegistration.findFirst({
      where: {
        eventId: input.eventId,
        email: normalizedEmail,
      },
    });

    if (existing) {
      const updated = await prisma.eventRegistration.update({
        where: { id: existing.id },
        data: {
          eventTitle: input.eventTitle,
          fullName: input.fullName.trim(),
          email: normalizedEmail,
          currentRole: input.currentRole.trim(),
          organization: input.organization.trim(),
          originCity: input.originCity.trim(),
          contact: input.contact?.trim() || null,
          consent: input.consent,
        },
      });
      return updated.id;
    }

    const created = await prisma.eventRegistration.create({
      data: {
        id: buildId(),
        eventId: input.eventId,
        eventTitle: input.eventTitle,
        fullName: input.fullName.trim(),
        email: normalizedEmail,
        currentRole: input.currentRole.trim(),
        organization: input.organization.trim(),
        originCity: input.originCity.trim(),
        contact: input.contact?.trim() || null,
        consent: input.consent,
        attendanceStatus: "registered",
        registeredAt: new Date(),
      },
    });

    return created.id;
  },

  async updateAttendanceStatus(id: string, status: AttendanceStatus) {
    const existing = await prisma.eventRegistration.findUnique({ where: { id } });
    if (!existing) return null;
    const updated = await prisma.eventRegistration.update({
      where: { id },
      data: {
        attendanceStatus: status,
        attendanceUpdatedAt: new Date(),
      },
    });
    return mapRegistration({ ...updated, attendanceStatus: updated.attendanceStatus as AttendanceStatus });
  },
};

