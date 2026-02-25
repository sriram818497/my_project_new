import https from "node:https";
import { env } from "../../config/env";
import { prisma } from "../../config/prisma";
import type { ConsentStatus, CookieConsentRecord } from "./cookieConsents.types";

const getNextId = async () => {
  const year = new Date().getFullYear();
  const prefix = `CONS-${year}-`;
  const latest = await prisma.cookieConsent.findFirst({
    where: { id: { startsWith: prefix } },
    orderBy: { id: "desc" },
  });
  const seq = latest ? Number(latest.id.split("-")[2] || "0") + 1 : 1;
  return `${prefix}${String(seq).padStart(3, "0")}`;
};

const mapRecord = (row: {
  id: string;
  ipAddress: string;
  stateName: string | null;
  countryName: string | null;
  status: ConsentStatus;
  essential: boolean;
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
  consentDate: Date;
  lastUpdated: Date;
  source: CookieConsentRecord["source"];
  cookieSnapshot: unknown;
}): CookieConsentRecord => ({
  id: row.id,
  ipAddress: row.ipAddress,
  state: row.stateName || "Unknown",
  country: row.countryName || "Unknown",
  status: row.status,
  essential: row.essential,
  analytics: row.analytics,
  personalization: row.personalization,
  marketing: row.marketing,
  consentDate: row.consentDate.toISOString(),
  lastUpdated: row.lastUpdated.toISOString(),
  source: row.source,
  cookieSnapshot: (row.cookieSnapshot as Record<string, string | undefined>) || {},
});

const normalizeIp = (value: string | undefined) => {
  if (!value) return "";
  const candidate = value.split(",")[0]?.trim() || "";
  if (!candidate) return "";
  return candidate.replace(/^::ffff:/, "");
};

const isPrivateOrLocalIp = (ipAddress: string) => {
  if (!ipAddress) return true;
  if (ipAddress === "127.0.0.1" || ipAddress === "::1" || ipAddress === "localhost") return true;
  if (ipAddress.startsWith("10.")) return true;
  if (ipAddress.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ipAddress)) return true;
  if (ipAddress.startsWith("fc") || ipAddress.startsWith("fd")) return true;
  return false;
};

const resolveLocationFromIp = async (ipAddress: string) => {
  const isPrivateIp = !ipAddress || isPrivateOrLocalIp(ipAddress);
  if (isPrivateIp && env.NODE_ENV === "production") {
    return { state: "Unknown", country: "Unknown" };
  }

  const lookupUrl = isPrivateIp
    ? "https://ipapi.co/json/"
    : `https://ipapi.co/${encodeURIComponent(ipAddress)}/json/`;

  try {
    const payload = await new Promise<{ region?: string; country_name?: string }>((resolve, reject) => {
      const req = https.get(lookupUrl, { timeout: 2000 }, (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += String(chunk);
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(raw) as { region?: string; country_name?: string });
          } catch {
            reject(new Error("Invalid geolocation response"));
          }
        });
      });
      req.on("timeout", () => req.destroy(new Error("Geolocation timeout")));
      req.on("error", reject);
    });

    return {
      state: payload?.region?.trim() || "Unknown",
      country: payload?.country_name?.trim() || "Unknown",
    };
  } catch {
    return { state: "Unknown", country: "Unknown" };
  }
};

export const cookieConsentsService = {
  async getAll() {
    const rows = await prisma.cookieConsent.findMany({ orderBy: { lastUpdated: "desc" } });
    return rows.map((row) =>
      mapRecord({
        ...row,
        status: row.status as ConsentStatus,
        source: row.source as CookieConsentRecord["source"],
      })
    );
  },

  async logDecision(input: {
    ipAddress?: string;
    state?: string;
    country?: string;
    status: ConsentStatus;
    essential: boolean;
    analytics: boolean;
    personalization: boolean;
    marketing: boolean;
    source: CookieConsentRecord["source"];
    cookieSnapshot: Record<string, string | undefined>;
  },
  requestMeta?: {
    headerIp?: string;
    socketIp?: string;
  }) {
    const now = new Date();
    const requestIp = normalizeIp(requestMeta?.headerIp) || normalizeIp(requestMeta?.socketIp) || normalizeIp(input.ipAddress);
    const location = await resolveLocationFromIp(requestIp);
    const state = location.state !== "Unknown" ? location.state : input.state?.trim() || "Unknown";
    const country = location.country !== "Unknown" ? location.country : input.country?.trim() || "Unknown";
    const ipAddress = requestIp || input.ipAddress?.trim() || "Unknown";

    const existing = await prisma.cookieConsent.findFirst({
      where: { ipAddress },
      orderBy: { lastUpdated: "desc" },
    });

    if (existing) {
      const updated = await prisma.cookieConsent.update({
        where: { id: existing.id },
        data: {
          stateName: state,
          countryName: country,
          status: input.status,
          essential: input.essential,
          analytics: input.analytics,
          personalization: input.personalization,
          marketing: input.marketing,
          source: input.source,
          cookieSnapshot: input.cookieSnapshot as object,
          lastUpdated: now,
        },
      });
      return mapRecord({
        ...updated,
        status: updated.status as ConsentStatus,
        source: updated.source as CookieConsentRecord["source"],
      });
    }

    const id = await getNextId();
    const created = await prisma.cookieConsent.create({
      data: {
        id,
        ipAddress,
        stateName: state,
        countryName: country,
        status: input.status,
        essential: input.essential,
        analytics: input.analytics,
        personalization: input.personalization,
        marketing: input.marketing,
        source: input.source,
        cookieSnapshot: input.cookieSnapshot as object,
        consentDate: now,
        lastUpdated: now,
      },
    });
    return mapRecord({
      ...created,
      status: created.status as ConsentStatus,
      source: created.source as CookieConsentRecord["source"],
    });
  },
};
