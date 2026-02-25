import { MoreVertical, Search, Filter, UserPlus } from "lucide-react";

const UserManagement = () => {
    const users = [
        { id: 1, name: "Sriram R", email: "sriram@protectora.in", role: "Super Admin", status: "Active" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Compliance Officer", status: "Active" },
        { id: 3, name: "Michael Ross", email: "m.ross@logistics.co", role: "Internal Auditor", status: "Inactive" },
        { id: 4, name: "Sarah Connor", email: "sconnor@techscale.io", role: "System Admin", status: "Active" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">User Management</h1>
                    <p className="text-white/50 font-medium">Control access and define roles across the organization.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#1cd35c] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#19b850] transition-all shadow-lg shadow-[#1cd35c]/20">
                    <UserPlus size={18} />
                    <span>Provision User</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search users by name, email or role..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#1cd35c]/50 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all">
                    <Filter size={18} className="text-[#1cd35c]" />
                    <span>Filters</span>
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="px-8 py-6 text-[#1cd35c] text-xs font-black uppercase tracking-widest">Identity</th>
                            <th className="px-8 py-6 text-[#1cd35c] text-xs font-black uppercase tracking-widest">Authority</th>
                            <th className="px-8 py-6 text-[#1cd35c] text-xs font-black uppercase tracking-widest">Status</th>
                            <th className="px-8 py-6 text-[#1cd35c] text-xs font-black uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((u) => (
                            <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm tracking-wide">{u.name}</p>
                                            <p className="text-white/40 text-xs mt-0.5">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-white text-sm font-semibold">{u.role}</td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.status === 'Active' ? 'bg-[#1cd35c]/20 text-[#1cd35c]' : 'bg-red-400/20 text-red-400'
                                        }`}>
                                        {u.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
