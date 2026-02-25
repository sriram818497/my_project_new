export type JwtRole = "admin" | "editor" | "viewer";

export interface JwtPayload {
  sub: string;
  email: string;
  role: JwtRole;
  iat?: number;
  exp?: number;
}

