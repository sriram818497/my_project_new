import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { JwtPayload } from "../modules/auth/auth.types";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: "Authorization token is required" });
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, error: "Invalid authorization format" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    if (!decoded?.sub || !decoded?.email || !decoded?.role) {
      return res.status(401).json({ success: false, error: "Invalid authentication token" });
    }

    req.authUser = {
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    return next();
  } catch {
    return res.status(401).json({ success: false, error: "Authentication token expired or invalid" });
  }
};

