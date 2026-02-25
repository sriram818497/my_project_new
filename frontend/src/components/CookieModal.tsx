import { useState, useEffect } from "react";
import { CookieManager, CookieTypes } from "../utils/cookieManager";
import { cookieConsentsService } from "../services/cookieConsents";
import Cookies from "js-cookie";
import { getSecureCookieOptions } from "../utils/security";

interface CookieModalProps {
  onClose: () => void;
  onSave: () => void;
}

const CookieModal = ({ onClose, onSave }: CookieModalProps) => {
  const [cookies, setCookies] = useState({
    [CookieTypes.NECESSARY]: true, // Always true and disabled
    [CookieTypes.ANALYTICS]: false,
    [CookieTypes.MARKETING]: false,
  });

  useEffect(() => {
    // Load existing preferences
    [CookieTypes.ANALYTICS, CookieTypes.MARKETING].forEach((type) => {
      const consent = CookieManager.getConsent(type);
      setCookies((prev) => ({
        ...prev,
        [type]: consent,
      }));
    });
  }, []);

  const handleSave = () => {
    CookieManager.setConsent(CookieTypes.ANALYTICS, cookies[CookieTypes.ANALYTICS]);
    CookieManager.setConsent(CookieTypes.MARKETING, cookies[CookieTypes.MARKETING]);
    CookieManager.setConsent(CookieTypes.NECESSARY, true);
    Cookies.set("cookie-consent", "customized", getSecureCookieOptions(365));
    cookieConsentsService.logConsentDecision({
      status: "custom",
      essential: true,
      analytics: cookies[CookieTypes.ANALYTICS],
      personalization: cookies[CookieTypes.MARKETING],
      marketing: cookies[CookieTypes.MARKETING],
      source: "preference_center",
    });
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="w-full max-w-md bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#1cd35c]/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1cd35c]/5 blur-3xl rounded-full -ml-16 -mb-16"></div>

        <h2 className="mb-6 text-2xl font-bold text-white relative z-10">
          Cookie Preferences
        </h2>

        <div className="space-y-6 mb-8 relative z-10">
          <label className="flex items-start p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#1cd35c]/30 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={cookies[CookieTypes.NECESSARY]}
              disabled
              className="form-checkbox h-5 w-5 text-[#1cd35c] mt-1 rounded bg-gray-800 border-gray-700 focus:ring-[#1cd35c]"
            />
            <span className="ml-3">
              <span className="block text-white font-bold">Necessary Cookies</span>
              <p className="text-sm text-white/50 font-medium">
                Required for the website to function properly and securely.
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-[#1cd35c]/20 text-[#1cd35c] text-[10px] font-bold uppercase rounded border border-[#1cd35c]/30">
                Always Active
              </span>
            </span>
          </label>

          <label className="flex items-start p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#1cd35c]/30 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={cookies[CookieTypes.ANALYTICS]}
              onChange={(e) =>
                setCookies((prev) => ({
                  ...prev,
                  [CookieTypes.ANALYTICS]: e.target.checked,
                }))
              }
              className="form-checkbox h-5 w-5 text-[#1cd35c] mt-1 rounded bg-gray-800 border-gray-700 focus:ring-[#1cd35c]"
            />
            <span className="ml-3">
              <span className="block text-white font-bold">Analytics Cookies</span>
              <p className="text-sm text-white/50 font-medium">
                Help us improve our website by collecting anonymous usage information.
              </p>
            </span>
          </label>

          <label className="flex items-start p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#1cd35c]/30 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={cookies[CookieTypes.MARKETING]}
              onChange={(e) =>
                setCookies((prev) => ({
                  ...prev,
                  [CookieTypes.MARKETING]: e.target.checked,
                }))
              }
              className="form-checkbox h-5 w-5 text-[#1cd35c] mt-1 rounded bg-gray-800 border-gray-700 focus:ring-[#1cd35c]"
            />
            <span className="ml-3">
              <span className="block text-white font-bold">Marketing Cookies</span>
              <p className="text-sm text-white/50 font-medium">
                Used to deliver more relevant content and personalized ads.
              </p>
            </span>
          </label>
        </div>

        <div className="flex justify-end space-x-4 relative z-10">
          <button
            className="px-6 py-2.5 text-white bg-white/10 rounded-full hover:bg-white/20 transition-all font-medium border border-white/10"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2.5 bg-[#1cd35c] text-white rounded-full hover:bg-[#19b850] transition-all font-bold shadow-[0_0_15px_rgba(28,211,92,0.3)] hover:scale-105"
            onClick={handleSave}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieModal;
