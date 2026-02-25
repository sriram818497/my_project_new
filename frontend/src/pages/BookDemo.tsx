import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaRocket,
  FaShieldAlt,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import Cal, { getCalApi } from "@calcom/embed-react";

const BookDemo = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (showCalendar) {
      (async function () {
        const cal = await getCalApi({
          namespace: "default",
          embedJsUrl: "https://cal.id/embed-link/embed.js"
        });
        cal("ui", {
          cssVarsPerTheme: {
            light: { "cal-brand": "#17da5e" },
            dark: { "cal-brand": "#000000" }
          },
          hideEventTypeDetails: false,
          layout: "month_view"
        });
      })();
    }
  }, [showCalendar]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Background Elements removed to use global layout */}

      {/* Local localized glow for depth */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#1cd35c]/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 pt-28 md:pt-28 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2 mb-4 bg-[#1cd35c]/20 backdrop-blur-lg border border-[#1cd35c]/30 rounded-full shadow-lg"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(28, 211, 92, 0.3)" }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <FaCalendarAlt className="text-[#1cd35c] text-sm drop-shadow-lg" />
              <span className="text-sm font-semibold text-white drop-shadow-md">
                Schedule Your Free Demo
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-2xl tracking-tight">
              Experience the <span className="text-[#1cd35c]">Future of Privacy</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium">
              Work with privacy specialists to design a customized approach that
              <br />
              <span className="text-[#1cd35c] font-bold">simplifies compliance and builds lasting trust.</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Column - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 flex flex-col h-full gap-6"
            >
              {/* What You'll Learn */}
              <motion.div
                className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 flex-1 flex flex-col justify-center"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
                  What We'll Cover
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: FaShieldAlt,
                      title: "Automate Compliance",
                      description:
                        "Master GDPR, CCPA, and more with zero manual effort",
                    },
                    {
                      icon: FaRocket,
                      title: "Launch in Days",
                      description:
                        "Go live faster than you thought possible.",
                    },
                    {
                      icon: FaClock,
                      title: "Real-Time Insights",
                      description:
                        "Monitor compliance across your organization in real time.",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex gap-4 group"
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#1cd35c] to-[#17a84b] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[#1cd35c]/50 transition-all"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <item.icon className="w-5 h-5 text-white drop-shadow-md" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-white mb-1 text-base drop-shadow-md">
                          {item.title}
                        </h3>
                        <p className="text-xs text-white/60 leading-relaxed font-medium">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="bg-gradient-to-br from-[#1cd35c]/20 to-[#17a84b]/20 backdrop-blur-xl rounded-2xl border border-[#1cd35c]/30 p-8 shadow-2xl flex-1 flex flex-col justify-center"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <h3 className="font-bold text-white mb-4 text-xl drop-shadow-md">
                  Why Teams Choose Us
                </h3>
                <div className="space-y-4">
                  {[
                    "Trusted by 50+ companies to manage privacy and compliance.",
                    "98%+ platform uptime, backed by SLAs.",
                    "ISO 27001 & ISO 27701 certified.",
                    "24/7 expert support",
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 group"
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <FaCheckCircle className="text-[#1cd35c] flex-shrink-0 w-5 h-5 drop-shadow-lg" />
                      </motion.div>
                      <span className="text-white/90 text-sm font-medium drop-shadow-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Cal.com Component */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3 min-h-[700px] flex items-center"
            >
              <div className="w-full bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-2xl overflow-hidden relative" style={{ height: '700px' }}>
                <AnimatePresence mode="wait">
                  {!showCalendar ? (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                    >
                      <div className="w-20 h-20 bg-[#1cd35c]/10 rounded-full flex items-center justify-center mb-6">
                        <FaCalendarAlt className="w-10 h-10 text-[#1cd35c]" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to find a time?</h3>
                      <p className="text-gray-600 mb-8 max-w-md">
                        Click below to load our interactive calendar and schedule your personalized demo with a privacy specialist.
                      </p>
                      <button
                        onClick={() => setShowCalendar(true)}
                        className="px-8 py-4 bg-[#1cd35c] text-white rounded-full font-bold hover:bg-[#19b850] transition-all duration-300 shadow-lg hover:shadow-[#1cd35c]/30 flex items-center gap-2"
                      >
                        <FaCalendarAlt />
                        View Available Slots
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="calendar"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full h-full"
                    >
                      <Cal
                        namespace="default"
                        calLink="protecciodata/book-a-demo"
                        style={{ width: "100%", height: "100%", overflow: "scroll" }}
                        config={{ layout: "month_view" }}
                        calOrigin="https://cal.id"
                        embedJsUrl="https://cal.id/embed-link/embed.js"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDemo;
