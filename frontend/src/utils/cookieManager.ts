// src/utils/cookieManager.ts
import Cookies from "js-cookie";
import { getSecureCookieOptions } from "./security";

export const CookieTypes = {
  NECESSARY: "necessary",
  ANALYTICS: "analytics",
  MARKETING: "marketing",
} as const;

export type CookieType = (typeof CookieTypes)[keyof typeof CookieTypes];

export const CookieManager = {
  setConsent: (type: CookieType, accepted: boolean) => {
    Cookies.set(`cookie-consent-${type}`, accepted ? "accepted" : "declined", {
      ...getSecureCookieOptions(365),
    });

    // Initialize relevant services based on consent
    if (accepted) {
      switch (type) {
        case CookieTypes.ANALYTICS:
          if (window.initializeGA) {
            window.initializeGA();
          }
          break;
        // Add other initializations as needed
      }
    }
  },

  getConsent: (type: CookieType) => {
    return Cookies.get(`cookie-consent-${type}`) === "accepted";
  },

  hasAnyConsent: () => {
    return Cookies.get("cookie-consent") !== undefined;
  },

  // Analytics specific cookies
  setAnalyticsCookies: () => {
    if (CookieManager.getConsent("analytics")) {
      Cookies.set(
        "page_views",
        String(parseInt(Cookies.get("page_views") || "0") + 1),
        getSecureCookieOptions(365)
      );
      Cookies.set("first_visit", new Date().toISOString(), getSecureCookieOptions(365));
    }
  },

  clearAllCookies: () => {
    Object.values(CookieTypes).forEach((type) => {
      Cookies.remove(`cookie-consent-${type}`);
    });
    Cookies.remove("cookie-consent");
  },
};
