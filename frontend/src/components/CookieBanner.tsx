import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { X } from "lucide-react";
import CookieModal from "./CookieModal";
import { CookieManager, CookieTypes, type CookieType } from "../utils/cookieManager";
import { cookieConsentsService } from "../services/cookieConsents";
import { getSecureCookieOptions } from "../utils/security";

const CookieBanner = () => {
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const legacyConsent = localStorage.getItem("cookie_consent");
        if (!CookieManager.hasAnyConsent() && !legacyConsent) {
            setVisible(true);
        }
    }, []);

    const handleAcceptAll = () => {
        (Object.values(CookieTypes) as CookieType[]).forEach((type) => {
            CookieManager.setConsent(type, true);
        });
        Cookies.set("cookie-consent", "accepted", getSecureCookieOptions(365));
        localStorage.setItem("cookie_consent", "accept");
        cookieConsentsService.logConsentDecision({
            status: "accepted_all",
            essential: true,
            analytics: true,
            personalization: true,
            marketing: true,
            source: "banner_accept",
        });
        setVisible(false);
    };

    const handleRejectNonEssential = () => {
        (Object.values(CookieTypes) as CookieType[]).forEach((type) => {
            CookieManager.setConsent(type, false);
        });
        CookieManager.setConsent(CookieTypes.NECESSARY, true);
        Cookies.set("cookie-consent", "declined", getSecureCookieOptions(365));
        localStorage.setItem("cookie_consent", "reject");
        cookieConsentsService.logConsentDecision({
            status: "rejected_all",
            essential: true,
            analytics: false,
            personalization: false,
            marketing: false,
            source: "banner_decline",
        });
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-live="polite"
            className="fixed bottom-0 left-0 w-full z-[200] bg-gray-100 border-t border-gray-300 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                {/* Left Content */}
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                        We use cookies
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        We use cookies to help this site function, understand service usage,
                        and support marketing efforts. Visit{" "}
                        <a
                            href="/manage-cookies"
                            className="underline hover:text-black"
                        >
                            Manage Cookies
                        </a>{" "}
                        to change preferences anytime. View our{" "}
                        <a
                            href="/cookie-policy"
                            className="underline hover:text-black"
                        >
                            Cookie Policy
                        </a>{" "}
                        for more info.
                    </p>
                </div>

                {/* Right Buttons */}
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 rounded-full border border-gray-400 text-sm font-medium hover:bg-gray-200 transition"
                    >
                        Manage Cookies
                    </button>

                    <button
                        onClick={handleRejectNonEssential}
                        className="px-4 py-2 rounded-full border border-gray-400 text-sm font-medium hover:bg-gray-200 transition"
                    >
                        Reject non-essential
                    </button>

                    <button
                        onClick={handleAcceptAll}
                        className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:opacity-90 transition"
                    >
                        Accept all
                    </button>

                    <button
                        onClick={() => setVisible(false)}
                        className="ml-2 text-gray-500 hover:text-black"
                        aria-label="Close cookie banner"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

            </div>
            {showModal && (
                <CookieModal
                    onClose={() => setShowModal(false)}
                    onSave={() => {
                        localStorage.setItem("cookie_consent", "manage");
                        setShowModal(false);
                        setVisible(false);
                    }}
                />
            )}
        </div>
    );
};

export default CookieBanner;
