import { Link2, ExternalLink, Settings, ShieldCheck, Database, FileSearch } from "lucide-react";

const ToolManagement = () => {
    const tools = [
        {
            id: "ropa",
            name: "RoPA Portal",
            status: "Active",
            url: "https://ropa.protecciodata.com/",
            icon: ShieldCheck,
            description: "Records of Processing Activities management system."
        },
        {
            id: "free-tools",
            name: "App Ecosystem",
            status: "Active",
            url: "https://app.protecciodata.com/",
            icon: Settings,
            description: "Core privacy tools and assessment engine."
        },
        {
            id: "pia",
            name: "PIA Master",
            status: "Development",
            url: "#",
            icon: FileSearch,
            description: "Automated Privacy Impact Assessment platform."
        },
        {
            id: "discovery",
            name: "Data Discovery",
            status: "Beta",
            url: "#",
            icon: Database,
            description: "AI-driven entity and sensitive data classification."
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Endpoint Config</h1>
                    <p className="text-white/50 font-medium">Manage external tool integrations and deployment status.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tools.map((tool) => (
                    <div key={tool.id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] hover:border-[#1cd35c]/40 transition-all duration-300 flex flex-col group">
                        <div className="flex items-start justify-between mb-8">
                            <div className="p-4 bg-[#1cd35c]/10 rounded-[1.25rem] group-hover:bg-[#1cd35c] transition-colors duration-500">
                                <tool.icon className="w-8 h-8 text-[#1cd35c] group-hover:text-white" />
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${tool.status === 'Active' ? 'bg-[#1cd35c]/20 text-[#1cd35c]' :
                                    tool.status === 'Development' ? 'bg-orange-400/20 text-orange-400' : 'bg-blue-400/20 text-blue-400'
                                }`}>
                                {tool.status}
                            </span>
                        </div>

                        <h3 className="text-2xl font-black text-white mb-2">{tool.name}</h3>
                        <p className="text-white/50 text-sm font-medium leading-relaxed mb-8 flex-grow">
                            {tool.description}
                        </p>

                        <div className="space-y-4">
                            <div className="bg-black/20 rounded-2xl p-4 flex items-center justify-between group-hover:bg-black/40 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <Link2 className="w-4 h-4 text-[#1cd35c] shrink-0" />
                                    <span className="text-white/40 text-xs font-bold truncate tracking-wide">{tool.url}</span>
                                </div>
                                <button className="text-white/40 hover:text-[#1cd35c] transition-colors shrink-0">
                                    <ExternalLink size={16} />
                                </button>
                            </div>

                            <button className="w-full py-4 border border-[#1cd35c]/30 text-[#1cd35c] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#1cd35c] hover:text-white transition-all duration-300">
                                Configure Endpoint
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Manual Add Card */}
            <div className="border-2 border-dashed border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center group hover:border-[#1cd35c]/30 transition-all cursor-pointer bg-white/5">
                <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center mb-4 group-hover:border-[#1cd35c] transition-colors">
                    <Link2 className="w-5 h-5 text-white/20 group-hover:text-[#1cd35c]" />
                </div>
                <h4 className="text-white/60 font-bold group-hover:text-white transition-colors">Add Custom Integration</h4>
                <p className="text-white/30 text-xs font-medium mt-1">Connect a proprietary compliance tool via Webhook or API.</p>
            </div>
        </div>
    );
};

export default ToolManagement;
