import { prisma } from "../../config/prisma";
import type {
  CommunicationPreferenceInput,
  CommunicationPreferenceRecord,
  CommunicationPreferenceStatus,
  CommunicationPreferences,
} from "./communication.types";

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const deriveStatus = (preferences: CommunicationPreferences): CommunicationPreferenceStatus =>
  Object.values(preferences).some(Boolean) ? "subscribed" : "unsubscribed";

const getNextId = async () => {
  const year = new Date().getFullYear();
  const prefix = `COMM-${year}-`;
  const latest = await prisma.communicationPreference.findFirst({
    where: { id: { startsWith: prefix } },
    orderBy: { id: "desc" },
  });
  const seq = latest ? Number(latest.id.split("-")[2] || "0") + 1 : 1;
  return `${prefix}${String(seq).padStart(3, "0")}`;
};

const mapRecord = (row: {
  id: string;
  fullName: string;
  email: string;
  preferences: unknown;
  status: CommunicationPreferenceStatus;
  source: CommunicationPreferenceRecord["source"];
  consentCapturedAt: Date;
  lastUpdated: Date;
  lastUpdatedBy: string;
}): CommunicationPreferenceRecord => ({
  id: row.id,
  fullName: row.fullName,
  email: row.email,
  preferences: row.preferences as CommunicationPreferences,
  status: row.status,
  source: row.source,
  consentCapturedAt: row.consentCapturedAt.toISOString(),
  lastUpdated: row.lastUpdated.toISOString(),
  lastUpdatedBy: row.lastUpdatedBy,
});

export const communicationService = {
  async getAll() {
    const rows = await prisma.communicationPreference.findMany({
      orderBy: { lastUpdated: "desc" },
    });
    return rows.map((row) =>
      mapRecord({
        ...row,
        status: row.status as CommunicationPreferenceStatus,
        source: row.source as CommunicationPreferenceRecord["source"],
      })
    );
  },

  async getByEmail(email: string) {
    const row = await prisma.communicationPreference.findUnique({
      where: { email: normalizeEmail(email) },
    });
    if (!row) return null;
    return mapRecord({
      ...row,
      status: row.status as CommunicationPreferenceStatus,
      source: row.source as CommunicationPreferenceRecord["source"],
    });
  },

  async upsertFromPreferenceCenter(input: CommunicationPreferenceInput) {
    const email = normalizeEmail(input.email);
    const now = new Date();
    const status = deriveStatus(input.preferences);

    const existing = await prisma.communicationPreference.findUnique({ where: { email } });

    if (existing) {
      const updated = await prisma.communicationPreference.update({
        where: { id: existing.id },
        data: {
          fullName: input.fullName.trim() || existing.fullName,
          email,
          preferences: input.preferences as object,
          status,
          source: "preference_center",
          lastUpdated: now,
          lastUpdatedBy: "Preference Center",
        },
      });
      return mapRecord({
        ...updated,
        status: updated.status as CommunicationPreferenceStatus,
        source: updated.source as CommunicationPreferenceRecord["source"],
      });
    }

    const id = await getNextId();
    const created = await prisma.communicationPreference.create({
      data: {
        id,
        fullName: input.fullName.trim() || "Website User",
        email,
        preferences: input.preferences as object,
        status,
        source: "preference_center",
        consentCapturedAt: now,
        lastUpdated: now,
        lastUpdatedBy: "Preference Center",
      },
    });
    return mapRecord({
      ...created,
      status: created.status as CommunicationPreferenceStatus,
      source: created.source as CommunicationPreferenceRecord["source"],
    });
  },

  async updateStatus(id: string, status: CommunicationPreferenceStatus, actor = "Admin Console") {
    const existing = await prisma.communicationPreference.findUnique({ where: { id } });
    if (!existing) return null;

    const current = existing.preferences as unknown as CommunicationPreferences;
    const nextPreferences =
      status === "unsubscribed"
        ? { newsletters: false, productUpdates: false, promotionalOffers: false }
        : current;
    const nextStatus = deriveStatus(nextPreferences);

    const updated = await prisma.communicationPreference.update({
      where: { id },
      data: {
        preferences: nextPreferences as object,
        status: nextStatus,
        source: "admin_console",
        lastUpdated: new Date(),
        lastUpdatedBy: actor,
      },
    });
    return mapRecord({
      ...updated,
      status: updated.status as CommunicationPreferenceStatus,
      source: updated.source as CommunicationPreferenceRecord["source"],
    });
  },

  async updatePreferences(id: string, preferences: CommunicationPreferences, actor = "Admin Console") {
    const existing = await prisma.communicationPreference.findUnique({ where: { id } });
    if (!existing) return null;
    const status = deriveStatus(preferences);
    const updated = await prisma.communicationPreference.update({
      where: { id },
      data: {
        preferences: preferences as object,
        status,
        source: "admin_console",
        lastUpdated: new Date(),
        lastUpdatedBy: actor,
      },
    });
    return mapRecord({
      ...updated,
      status: updated.status as CommunicationPreferenceStatus,
      source: updated.source as CommunicationPreferenceRecord["source"],
    });
  },
};
