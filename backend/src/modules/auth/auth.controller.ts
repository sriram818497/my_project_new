import type { Request, Response } from "express";
import { z } from "zod";
import { authService } from "./auth.service";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema } from "./auth.validation";

const handleValidationError = (res: Response, error: z.ZodError) =>
  res.status(400).json({
    success: false,
    error: error.issues[0]?.message ?? "Invalid request payload",
  });

export const authController = {
  async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return handleValidationError(res, parsed.error);

    const result = await authService.login(parsed.data.email, parsed.data.password);
    if (!result) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    return res.status(200).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  },

  async profile(req: Request, res: Response) {
    if (!req.authUser?.userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const user = await authService.getProfile(req.authUser.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  },

  async forgotPassword(req: Request, res: Response) {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) return handleValidationError(res, parsed.error);

    await authService.forgotPassword(parsed.data.email);

    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, reset instructions have been sent.",
    });
  },

  async resetPassword(req: Request, res: Response) {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) return handleValidationError(res, parsed.error);

    const ok = await authService.resetPassword(parsed.data.token, parsed.data.password);
    if (!ok) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  },
};

