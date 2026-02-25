const ALLOWED_EXTERNAL_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const jsonForInlineScript = (value: unknown): string =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

export const safeOpenExternal = (rawUrl: string): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const url = new URL(rawUrl, window.location.origin);
    if (!ALLOWED_EXTERNAL_PROTOCOLS.has(url.protocol)) return false;
    window.open(url.toString(), "_blank", "noopener,noreferrer");
    return true;
  } catch {
    return false;
  }
};

export const getSecureCookieOptions = (expiresDays = 365) => ({
  expires: expiresDays,
  sameSite: "Lax" as const,
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
});
