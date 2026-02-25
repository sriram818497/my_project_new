import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import type { JwtPayload } from "./auth.types";

type PublicUser = {
  id: number;
  email: string;
  name: string;
  role: "admin" | "editor" | "viewer";
  is_admin: boolean;
};

const mapPublicUser = (user: {
  id: bigint;
  email: string;
  name: string;
  role: "admin" | "editor" | "viewer";
}): PublicUser => ({
  id: Number(user.id),
  email: user.email,
  name: user.name,
  role: user.role,
  is_admin: user.role === "admin",
});

const signAccessToken = (payload: JwtPayload) => {
  const expiresIn = env.JWT_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>;
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

export const authService = {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return null;
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) {
      return null;
    }

    const token = signAccessToken({
      sub: user.id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: mapPublicUser(user),
    };
  },

  async getProfile(userId: string) {
    const parsedId = Number(userId);
    if (!Number.isFinite(parsedId) || parsedId <= 0) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: BigInt(parsedId) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) return null;
    return mapPublicUser(user);
  },

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    if (env.NODE_ENV !== "production") {
      console.log(`[DEV] Password reset token for ${email}: ${rawToken}`);
    }
  },

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const now = new Date();

    const record = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: now },
      },
      include: {
        user: true,
      },
    });

    if (!record) return false;

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: now },
      }),
    ]);

    return true;
  },
};
