import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect, useRef, type ElementType } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/admin/Sidebar";
import Overview from "../components/admin/Overview";
import JobManagement from "../components/admin/JobManagement";
import ContentOperationsManager from "../components/admin/ContentOperationsManager";
import RightsRequestsDashboard from "../components/admin/RightsRequestsDashboard";
import CommunicationPreferencesDashboard from "../components/admin/CommunicationPreferencesDashboard";
import CookieConsentsDashboard from "../components/admin/CookieConsentsDashboard";
import EventAttendanceHub from "../components/admin/EventAttendanceHub";
import AnimatedLogoutButton from "../components/admin/AnimatedLogoutButton";
import AdminModuleBoundary from "../components/admin/AdminModuleBoundary";
import { initializeAdminSession, trackAdminActivity, type AdminProcessId } from "../utils/adminActivityTracker";
import "./DashboardTheme.css";
import {
  ArrowUpRight,
  Briefcase,
  CalendarCheck2,
  Cookie,
  FileText,
  Menu,
  MessageSquare,
  Moon,
  Sun,
  UserCheck,
} from "lucide-react";

type SectionConfig = {
  title: string;
  subtitle: string;
  icon: ElementType;
};

const sectionConfig: Record<string, SectionConfig> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview and quick access to all systems",
    icon: ArrowUpRight,
  },
  blogs: {
    title: "Content Operations",
    subtitle: "Manage published content and drafts from one place",
    icon: FileText,
  },
  jobs: {
    title: "Talent Acquisition",
    subtitle: "Create, update, and archive openings",
    icon: Briefcase,
  },
  rights: {
    title: "Data Subject Requests",
    subtitle: "Track and process data-subject rights requests",
    icon: UserCheck,
  },
  communication: {
    title: "Consent & Communication Preferences",
    subtitle: "Control engagement and notification choices",
    icon: MessageSquare,
  },
  cookies: {
    title: "Cookie Consent Management",
    subtitle: "Review and govern consent preferences",
    icon: Cookie,
  },
  "event-attendance": {
    title: "Event Attendance Hub",
    subtitle: "Monitor registrations, attendance, and no-shows by event",
    icon: CalendarCheck2,
  },
};

const SectionPlaceholder = ({ section }: { section: string }) => {
  const config = sectionConfig[section] || sectionConfig.dashboard;
  const Icon = config.icon;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="max-w-2xl">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#1cd35c]/10 text-[#16a34a] mb-4">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-black text-[#0f172a]">{config.title}</h3>
        <p className="text-gray-600 font-medium mt-2">{config.subtitle}</p>
        <p className="text-sm text-gray-500 mt-4">
          This module is set up and ready for content integration.
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, loading, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const loginActivityLogged = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-dashboard-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!user || !isAdmin()) return;
    if (loginActivityLogged.current) return;
    loginActivityLogged.current = true;
    initializeAdminSession();
    trackAdminActivity({
      title: "Admin login session started",
      detail: `Signed in as ${user.email ?? "Administrator"} and opened the dashboard.`,
      tone: "success",
      processId: "dashboard",
      started: true,
      completedStepDelta: 1,
    });
  }, [user, isAdmin]);

  const handleToggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("admin-dashboard-theme", nextTheme);
  };

  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };

  const sectionToProcess: Record<string, { title: string; processId: AdminProcessId }> = {
    dashboard: { title: "Dashboard", processId: "dashboard" },
    blogs: { title: "Content Operations", processId: "content-operations" },
    jobs: { title: "Talent Acquisition", processId: "talent-acquisition" },
    rights: { title: "Rights Management", processId: "rights-management" },
    communication: { title: "Communication Preferences", processId: "communication-preferences" },
    cookies: { title: "Cookie Consents", processId: "cookie-consents" },
    "event-attendance": { title: "Event Attendance Hub", processId: "event-attendance" },
  };
  const processToSection: Record<AdminProcessId, string> = {
    dashboard: "dashboard",
    "content-operations": "blogs",
    "talent-acquisition": "jobs",
    "rights-management": "rights",
    "communication-preferences": "communication",
    "cookie-consents": "cookies",
    "event-attendance": "event-attendance",
  };

  const handleSectionChange = (section: string) => {
    if (section === activeSection) return;
    setActiveSection(section);
    const target = sectionToProcess[section];
    if (!target) return;
    trackAdminActivity({
      title: `Opened ${target.title}`,
      detail: `Admin navigated to ${target.title}.`,
      tone: "review",
      processId: target.processId,
      started: true,
      completedStepDelta: 1,
    });
  };

  const handleActivityNavigate = (processId: AdminProcessId) => {
    const section = processToSection[processId];
    if (!section) return;
    handleSectionChange(section);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 rounded-full border-4 border-[#1cd35c] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin()) {
    return <Navigate to="/sign-in" />;
  }

  const renderContent = () => {
    if (activeSection === "dashboard") {
      return <Overview onActivityNavigate={handleActivityNavigate} />;
    }
    if (activeSection === "blogs") {
      return <ContentOperationsManager />;
    }
    if (activeSection === "jobs") {
      return <JobManagement />;
    }
    if (activeSection === "rights") {
      return <RightsRequestsDashboard />;
    }
    if (activeSection === "communication") {
      return <CommunicationPreferencesDashboard />;
    }
    if (activeSection === "cookies") {
      return <CookieConsentsDashboard />;
    }
    if (activeSection === "event-attendance") {
      return <EventAttendanceHub />;
    }
    return <SectionPlaceholder section={activeSection} />;
  };

  return (
    <div className="admin-shell min-h-screen bg-[#f2f4f7]" data-theme={theme} data-section={activeSection}>
      <Sidebar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      <div className={`transition-all duration-300 pl-0 ${isCollapsed ? "md:pl-20" : "md:pl-72"}`}>
        <header className="admin-topbar bg-white/95 backdrop-blur border-b border-gray-200 px-6 md:px-10 h-[72px] sticky top-0 z-40 flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="inline-flex md:hidden items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-5">
              <button
                onClick={handleToggleTheme}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-700 bg-white hover:border-[#1cd35c]/40 transition-colors text-sm font-semibold"
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
                title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              >
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {theme === "light" ? "Dark Theme" : "Light Theme"}
              </button>
              <span className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-600 bg-gray-100 rounded-xl border border-gray-200">
                Administrator
              </span>
              <AnimatedLogoutButton onLogout={handleLogout} />
            </div>
          </div>
        </header>

        <div className="px-6 md:px-10 py-8 min-h-[calc(100vh-72px)]">
          <div className="max-w-[1500px] mx-auto space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              >
                <div className="admin-module-frame p-4 md:p-6">
                  <AdminModuleBoundary>
                    <div className="admin-module-content">{renderContent()}</div>
                  </AdminModuleBoundary>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

