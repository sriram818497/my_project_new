import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import { applyLanguageToPage, getPreferredLanguage, languageEvents, setPreferredLanguage } from "../utils/i18nRuntime";

interface Language {
  code: string;
  name: string;
  marker: string;
}

const languages: Language[] = [
  { code: "en", name: "English", marker: "EN" },
  { code: "as", name: "Assamese", marker: "AS" },
  { code: "awa", name: "Awadhi", marker: "AWA" },
  { code: "bn", name: "Bengali", marker: "BN" },
  { code: "bho", name: "Bhojpuri", marker: "BHO" },
  { code: "brx", name: "Bodo", marker: "BRX" },
  { code: "bra", name: "Braj", marker: "BRA" },
  { code: "doi", name: "Dogri", marker: "DOI" },
  { code: "gom", name: "Goan Konkani", marker: "GOM" },
  { code: "gon", name: "Gondi", marker: "GON" },
  { code: "gu", name: "Gujarati", marker: "GU" },
  { code: "hi", name: "Hindi", marker: "HI" },
  { code: "hoc", name: "Ho", marker: "HOC" },
  { code: "kn", name: "Kannada", marker: "KN" },
  { code: "ks", name: "Kashmiri", marker: "KS" },
  { code: "kha", name: "Khasi", marker: "KHA" },
  { code: "mag", name: "Magahi", marker: "MAG" },
  { code: "mai", name: "Maithili", marker: "MAI" },
  { code: "ml", name: "Malayalam", marker: "ML" },
  { code: "mni", name: "Manipuri", marker: "MNI" },
  { code: "mr", name: "Marathi", marker: "MR" },
  { code: "lus", name: "Mizo", marker: "LUS" },
  { code: "ne", name: "Nepali", marker: "NE" },
  { code: "or", name: "Odia", marker: "OR" },
  { code: "pa", name: "Punjabi", marker: "PA" },
  { code: "sa", name: "Sanskrit", marker: "SA" },
  { code: "sat", name: "Santali", marker: "SAT" },
  { code: "sd", name: "Sindhi", marker: "SD" },
  { code: "si", name: "Sinhala", marker: "SI" },
  { code: "ta", name: "Tamil", marker: "TA" },
  { code: "te", name: "Telugu", marker: "TE" },
  { code: "tcy", name: "Tulu", marker: "TCY" },
  { code: "ur", name: "Urdu", marker: "UR" },
];

const fallbackLanguage = languages[0];
const findLanguage = (code: string) =>
  languages.find((lang) => lang.code.toLowerCase() === code.toLowerCase()) || fallbackLanguage;

const LanguageSelector = ({ mobile = false }: { mobile?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLangState] = useState<Language>(() => findLanguage(getPreferredLanguage()));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const onLanguageChanged = (event: Event) => {
      const customEvent = event as CustomEvent<{ lang?: string }>;
      setSelectedLangState(findLanguage(customEvent.detail?.lang || getPreferredLanguage()));
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener(languageEvents.eventName, onLanguageChanged as EventListener);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener(languageEvents.eventName, onLanguageChanged as EventListener);
    };
  }, []);

  const handleLanguageSelect = async (lang: Language) => {
    setPreferredLanguage(lang.code);
    setSelectedLangState(lang);
    setIsOpen(false);
    await applyLanguageToPage(lang.code);
  };

  if (mobile) {
    return (
      <div className="w-full mt-4 border-t border-white/10 pt-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="nav-clean flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-300 rounded-md hover:bg-white/5 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#1cd35c]" />
            <span>Language: {selectedLang.name}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 p-2 max-h-60 overflow-y-auto custom-scrollbar">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => void handleLanguageSelect(lang)}
                    className={`nav-clean flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedLang.code === lang.code
                        ? "bg-[#1cd35c]/10 text-[#1cd35c]"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-semibold">{lang.marker}</span>
                    <span className="truncate">{lang.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="nav-clean flex items-center space-x-2 text-sm font-medium text-white/90 hover:text-[#1cd35c] transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/5"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4" />
        <span>{selectedLang.code}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="max-h-80 overflow-y-auto custom-scrollbar py-2">
              <div className="px-3 pb-2 mb-2 border-b border-white/10">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Language</span>
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => void handleLanguageSelect(lang)}
                  className={`nav-clean flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors duration-150 ${
                    selectedLang.code === lang.code
                      ? "bg-[#1cd35c]/10 text-[#1cd35c]"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold min-w-8">{lang.marker}</span>
                    <span>{lang.name}</span>
                  </div>
                  {selectedLang.code === lang.code && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
