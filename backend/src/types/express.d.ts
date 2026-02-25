import type { JwtRole } from "../modules/auth/auth.types";

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        userId: string;
        email: string;
        role: JwtRole;
      };
    }
  }
}

export {};

