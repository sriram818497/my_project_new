import type { ElementType } from "react";

interface AdminEmptyStateProps {
  title: string;
  subtitle: string;
  icon: ElementType;
}

const AdminEmptyState = ({ title, subtitle, icon: Icon }: AdminEmptyStateProps) => {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 py-10 text-center">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#1cd35c]/30 bg-[#1cd35c]/10 text-[#16a34a]">
        <Icon className="h-6 w-6" />
      </span>
      <p className="mt-4 text-base font-black text-[#0f172a]">{title}</p>
      <p className="mt-1 text-sm font-medium text-gray-600">{subtitle}</p>
    </div>
  );
};

export default AdminEmptyState;
