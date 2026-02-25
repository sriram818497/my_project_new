import { prisma } from "../../config/prisma";

export const siteContentService = {
  async getByKey(key: string) {
    const row = await prisma.siteContentState.findUnique({ where: { key } });
    if (!row) return null;
    return {
      key: row.key,
      payload: row.payload,
      updatedAt: row.updatedAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
    };
  },

  async getByKeys(keys: string[]) {
    if (!keys.length) return [];
    const rows = await prisma.siteContentState.findMany({
      where: { key: { in: keys } },
    });
    return rows.map((row) => ({
      key: row.key,
      payload: row.payload,
      updatedAt: row.updatedAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
    }));
  },

  async upsert(key: string, payload: unknown) {
    const row = await prisma.siteContentState.upsert({
      where: { key },
      update: { payload: payload as object },
      create: { key, payload: payload as object },
    });
    return {
      key: row.key,
      payload: row.payload,
      updatedAt: row.updatedAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
    };
  },
};

