import { prisma } from "../../config/prisma";
import type { RightsRequestRecord, RightsRequestStatus } from "./rights.types";

const toRecord = (row: {
  id: string;
  payload: unknown;
  status: RightsRequestStatus;
  createdAt: Date;
}): RightsRequestRecord => ({
  ...(row.payload as Omit<RightsRequestRecord, "id" | "status" | "createdAt">),
  id: row.id,
  status: row.status,
  createdAt: row.createdAt.toISOString(),
});

const getNextId = async () => {
  const year = new Date().getFullYear();
  const prefix = `DSR-${year}-`;
  const latest = await prisma.rightsRequest.findFirst({
    where: { id: { startsWith: prefix } },
    orderBy: { id: "desc" },
  });
  const seq = latest ? Number(latest.id.split("-")[2] || "0") + 1 : 1;
  return `${prefix}${String(seq).padStart(3, "0")}`;
};

export const rightsService = {
  async getAll() {
    const rows = await prisma.rightsRequest.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map((row) => toRecord({ ...row, status: row.status as RightsRequestStatus }));
  },

  async getById(id: string) {
    const row = await prisma.rightsRequest.findUnique({ where: { id } });
    if (!row) return null;
    return toRecord({ ...row, status: row.status as RightsRequestStatus });
  },

  async create(payload: RightsRequestRecord["consents"] extends never ? never : Omit<RightsRequestRecord, "id" | "status" | "createdAt">) {
    const id = await getNextId();
    const created = await prisma.rightsRequest.create({
      data: {
        id,
        payload: payload as object,
        status: "pending",
        createdAt: new Date(),
      },
    });
    return toRecord({ ...created, status: created.status as RightsRequestStatus });
  },

  async updateStatus(id: string, status: RightsRequestStatus) {
    const existing = await prisma.rightsRequest.findUnique({ where: { id } });
    if (!existing) return null;
    const updated = await prisma.rightsRequest.update({
      where: { id },
      data: { status },
    });
    return toRecord({ ...updated, status: updated.status as RightsRequestStatus });
  },
};
