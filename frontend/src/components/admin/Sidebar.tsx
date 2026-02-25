import React from "react";
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    ShieldCheck,
    UserCheck,
    MessageSquare,
    Cookie,
    CalendarCheck2,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

interface SidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    onLogout?: () => void;
    userName?: string;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    isMobileOpen?: boolean;
    setIsMobileOpen?: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeSection,
    setActiveSection,
    isCollapsed,
    setIsCollapsed,
    isMobileOpen = false,
    setIsMobileOpen,
}) => {
    const compact = isCollapsed && !isMobileOpen;
    const expandedLogoSrc = "/logo.png";
    const collapsedLogoSrc = "/logo3.jpg";

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "blogs", label: "Content Operations", icon: FileText },
        { id: "jobs", label: "Talent Acquisition", icon: Briefcase },
        { id: "privacy", label: "PRIVACY MANAGEMENT", icon: ShieldCheck, isHeader: true },
        { id: "rights", label: "Rights Management", icon: UserCheck },
        { id: "communication", label: "Communication Preferences", icon: MessageSquare },
        { id: "cookies", label: "Cookie Consents", icon: Cookie },
        { id: "event-attendance", label: "Event Attendance Hub", icon: CalendarCheck2 },
    ];

    const handleItemClick = (id: string) => {
        setActiveSection(id);
        if (setIsMobileOpen) {
            setIsMobileOpen(false);
        }
    };

    return (
        <>
            {isMobileOpen && (
                <button
                    aria-label="Close sidebar overlay"
                    onClick={() => setIsMobileOpen?.(false)}
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                />
            )}
            <div className={`${compact ? 'md:w-20' : 'md:w-72'} w-[88vw] max-w-[320px] md:max-w-none h-screen fixed left-0 top-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-transform duration-300 md:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} admin-sidebar`}>
            {/* Brand */}
            <div className="h-[72px] flex items-center justify-between px-5 md:px-6 border-b border-gray-200">
                {!compact && (
                    <img src={expandedLogoSrc} alt="Proteccio" className="w-[154px] h-auto object-contain" />
                )}
                {compact && (
                    <div className="mx-auto">
                        <img
                            src={collapsedLogoSrc}
                            alt="Proteccio Icon"
                            className="h-11 w-11 object-contain"
                            onError={(event) => {
                                event.currentTarget.src = expandedLogoSrc;
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-5 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-10 h-14 rounded-2xl border border-gray-200/90 bg-white/95 backdrop-blur shadow-[0_10px_28px_rgba(15,23,42,0.14)] hover:border-[#1cd35c]/50 hover:shadow-[0_12px_30px_rgba(28,211,92,0.18)] transition-all duration-200 z-50 group"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                <span className="absolute -left-[3px] h-8 w-1 rounded-full bg-[#1cd35c]/75" />
                {isCollapsed ? (
                    <ChevronRight className="w-5 h-5 text-gray-700 group-hover:translate-x-0.5 transition-transform duration-200" />
                ) : (
                    <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:-translate-x-0.5 transition-transform duration-200" />
                )}
            </button>

            {/* Menu Label */}
            {!compact && (
                <div className="px-6 py-6">
                    <p className="text-[1rem] font-semibold text-[#94a3b8] uppercase tracking-wide">MENU</p>
                </div>
            )}

            {/* Nav */}
            <nav className={`flex-grow ${compact ? 'px-2' : 'px-4'} space-y-1 overflow-y-auto pb-6`}>
                {menuItems.map((item) => {
                    if (item.isHeader) {
                        if (compact) return null; // Hide headers when collapsed
                        return (
                            <div key={item.id} className="pt-6 pb-2 px-2">
                                <p className="text-[1rem] font-semibold text-[#94a3b8] uppercase tracking-wide flex items-center gap-2">
                                    <item.icon className="w-3.5 h-3.5" />
                                    {item.label}
                                </p>
                            </div>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleItemClick(item.id)}
                            className={`w-full flex items-center ${compact ? 'justify-center px-3' : 'gap-3 px-4'} py-3.5 rounded-xl transition-all duration-200 text-[1.05rem] font-medium ${activeSection === item.id
                                ? "bg-[#ccebd6] text-[#0f172a] shadow-sm"
                                : "text-[#334155] hover:bg-[#f8fafc]"
                                }`}
                            title={compact ? item.label : undefined}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!compact && <span className="whitespace-nowrap">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>
            </div>
        </>
    );
};

export default Sidebar;
