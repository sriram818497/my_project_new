import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { CookieManager, CookieTypes, type CookieType } from "../utils/cookieManager";
import { cookieConsentsService } from "../services/cookieConsents";
import { getSecureCookieOptions } from "../utils/security";
import CookieModal from "./CookieModal";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!CookieManager.hasAnyConsent()) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    (Object.values(CookieTypes) as CookieType[]).forEach((type) => {
      CookieManager.setConsent(type, true);
    });
    Cookies.set("cookie-consent", "accepted", getSecureCookieOptions(365));
    cookieConsentsService.logConsentDecision({
      status: "accepted_all",
      essential: true,
      analytics: true,
      personalization: true,
      marketing: true,
      source: "banner_accept",
    });
    setIsVisible(false);
  };

  const handleDeclineAll = () => {
    (Object.values(CookieTypes) as CookieType[]).forEach((type) => {
      CookieManager.setConsent(type, false);
    });
    Cookies.set("cookie-consent", "declined", getSecureCookieOptions(365));
    cookieConsentsService.logConsentDecision({
      status: "rejected_all",
      essential: true,
      analytics: false,
      personalization: false,
      marketing: false,
      source: "banner_decline",
    });
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setShowModal(true);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed right-0 bottom-[30px] left-0 z-50 p-4 text-white bg-gray-800">
        <div className="flex justify-between items-center mx-auto max-w-7xl">
          <p className="text-sm">
            We use cookies to enhance your experience. Choose how you want
            cookies to be used.
          </p>
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
              onClick={handleCustomize}
            >
              Customize
            </button>
            <button
              className="px-4 py-2 bg-[#1cd35c] text-white rounded-md hover:bg-[#1cd35c]"
              onClick={handleAcceptAll}
            >
              Accept All
            </button>
            <button
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
              onClick={handleDeclineAll}
            >
              Decline All
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <CookieModal
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            setIsVisible(false);
          }}
        />
      )}
    </>
  );
};

export default CookieConsent;
