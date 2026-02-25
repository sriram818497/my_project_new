import type { ElementType } from "react";

interface AdminSectionIntroProps {
  title: string;
  subtitle: string;
  icon: ElementType;
  badge?: string;
}

const AdminSectionIntro = ({ title, subtitle, icon: Icon, badge = "Governance Module" }: AdminSectionIntroProps) => {
  return (
    <section className="admin-section-intro rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <span className="admin-intro-icon inline-flex h-11 w-11 items-center justify-center rounded-xl border text-[#16a34a]">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#0f172a] leading-tight">{title}</h2>
            <p className="text-gray-600 text-sm md:text-base mt-1.5">{subtitle}</p>
          </div>
        </div>
        <span className="admin-pill rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest">{badge}</span>
      </div>
    </section>
  );
};

export default AdminSectionIntro;
