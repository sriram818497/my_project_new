import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    ChevronRight,
    ChevronLeft,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Zap,
    Shield,
    Globe,
    AlertTriangle,
    Database,
    HardDrive,
    Activity,
    TrendingUp,
    BarChart3,
    LayoutGrid,
    Users,
    Minus,
    TrendingDown,
    Search,
    Eye,
    PieChart,
    FileText
} from "lucide-react";

import { useNavigate } from 'react-router-dom';
import { ToolConfig, ToolResult, ToolQuestion, Answers } from "../../data/toolsData";

interface TrendPoint {
    month: string;
    value: number;
}

interface ChecklistItem {
    label: string;
    status: string;
}

interface RiskIndicator {
    label: string;
    status: string;
}

interface CategoryDataPoint {
    label: string;
    value: number;
}

interface DpdpVisualData {
    type: 'dpdp_dashboard';
    subScores: { [key: string]: number };
    alerts: { impacting: number; attention: number };
    peerAverage: number;
    lastWeek: number;
}

interface DpdpEnterpriseVisualData {
    type: 'dpdp_enterprise';
    domains: { label: string; value: number; weight: number }[];
    pieData: { label: string; value: number; color: string }[];
    insights: string[];
    criticalGaps: { gap: string; area: string; priority: number }[];
    improvementAreas: string[];
    strongControls: string[];
    actionPlan: {
        days30: string;
        days60: string;
        days90: string;
    };
}

interface ScannerVisualData {
    type: 'scanner_dashboard';
    stats: {
        totalData: string;
        totalFiles: string;
        sensitiveFiles: string;
        sharedFiles: string;
        retentionViolations: string;
    };
    filesByType: { label: string; value: number }[];
    repositories: string[];
    peerAverage: number;
    lastWeek: number;
}

interface RiskVisualData {
    type: 'risk_dashboard';
    stats: {
        totalRisks: number;
        openRisks: number;
        highRisks: number;
        closedRisks: number;
        financialImpact: string;
    };
    riskDistribution: { label: string; value: number; color: string }[];
    heatmap: { x: number; y: number; label: string };
    matrix: { probability: number; impact: number; label: string }[];
    register: {
        name: string;
        rating: string;
        color: string;
        status: string;
        impact: string;
        likelihood: string;
    }[];
    trend: TrendPoint[];
}

interface VendorVisualData {
    type: 'vendor_dashboard';
    stats: {
        vendorCount: number;
        highRiskCount: number;
        complianceRate: number;
        financialImpact: string;
        managedCount: number;
        total?: number; // Added for compatibility
        highRisk?: number; // Added for compatibility
        pending?: number; // Added for compatibility
        trend?: string; // Added for compatibility
    };
    riskDistribution: { label: string; value: number; color: string }[];
    heatmap: { x: number; y: number; label: string };
    trend: string;
    vendors?: { name: string; risk: string; tier?: string }[]; // Added for compatibility if used
}


interface DataFlowVisualData {
    type: 'data_flow_map';
    subjects: string[];
    triggers: string[];
    processing: string[];
    functions: string[];
    outcomes: string[];
    external: string[];
    confidence: string;
    steps: { label: string; icon: React.ElementType }[];
    riskLevel: string;
}

interface PolicyVisualData {
    type: 'policy_dashboard';
    checklist: ChecklistItem[];
    vagueAreas: string[];
    regulatoryMatch: string;
    practiceAlignment: string;
    ownerStatus: string;
}

interface SensitiveAssessmentVisualData {
    type: 'sensitive_assessment';
    domains: { label: string; value: number; weight: number }[];
    pieData: { label: string; value: number; color: string }[];
    heatmap: { label: string; value: number; risk: string }[];
    insights: string[];
    criticalGaps: { gap: string; area: string; priority: number }[];
    actionPlan: {
        days30: string;
        days60: string;
        days90: string;
    };
    regQuestions: string[];
    classification: string;
}

interface OperationalRiskVisualData {
    type: 'operational_risk_dashboard';
    domains: { label: string; value: number; weight: number }[];
    pieData: { label: string; value: number; color: string }[];
    insights: string[];
    criticalGaps: { gap: string; area: string; priority: number }[];
    improvementAreas: string[];
    strongControls: string[];
    actionPlan: {
        days30: string;
        days60: string;
        days90: string;
    };
}

interface VendorIntelligenceVisualData {
    type: 'vendor_intelligence_dashboard';
    domains: { label: string; value: number; weight: number }[];
    pieData: { label: string; value: number; color: string }[];
    insights: string[];
    criticalGaps: { gap: string; area: string; priority: number }[];
    improvementAreas: string[];
    strongControls: string[];
    actionPlan: {
        days30: string;
        days60: string;
        days90: string;
    };
}

interface DataMappingVisualData {
    type: 'data_mapping_dashboard';
    domains: { label: string; value: number; weight: number }[];
    pieData: { label: string; value: number; color: string }[];
    insights: string[];
    criticalGaps: { gap: string; area: string; priority: number }[];
    improvementAreas: string[];
    strongControls: string[];
    actionPlan: {
        days30: string;
        days60: string;
        days90: string;
    };
    flow: {
        subjects: string[];
        triggers: string[];
        processing: string[];
        functions: string[];
        outcomes: string[];
        external: string[];
    };
}

interface PolicyHealthVisualData {
    type: 'policy_health_dashboard';
    domains: { label: string; value: number; weight: number }[];
    pieData: { label: string; value: number; color: string }[];
    insights: string[];
    criticalGaps: { gap: string; area: string; priority: number }[];
    improvementAreas: string[];
    strongControls: string[];
    actionPlan: {
        days30: string;
        days60: string;
        days90: string;
    };
}

interface IncidentReadinessVisualData {
    type: 'incident_readiness_dashboard';
    domains: { label: string; value: number }[];
    pieData: { label: string; value: number; color: string }[];
    insights: string[];
    criticalGaps: { gap: string; area: string; priority: number }[];
    improvementAreas: string[];
    strongControls: string[];
    actionPlan: {
        days30: string;
        days60: string;
        days90: string;
    };
}

interface IncidentVisualData {
    type: 'incident_dashboard';
    stats: {
        newIncidents: number;
        trend: string;
        avgResolution: string;
        efficiencyPercentage: number;
    };
    indicators: RiskIndicator[];
    categoryData: CategoryDataPoint[];
    unresolvedPressure: string;
}

interface RaciVisualData {
    type: 'raci_dashboard';
    matrix: Record<string, string>[];
    roles: { key: string; label: string }[];
    stats: {
        unassignedTasks: number;
        accountableRole: string;
        confidenceLevel: string;
    };
}

interface AccountabilityVisualData {
    type: 'accountability_dashboard';
    domains: { label: string; value: number }[];
    pieData: { label: string; value: number; color: string }[];
    insights: string[];
    criticalGaps: { gap: string; area: string; priority: number }[];
    improvementAreas: string[];
    strongControls: string[];
    actionPlan: {
        days30: string;
        days60: string;
        days90: string;
    };
}

interface TransferVisualData {
    type: 'transfer_dashboard';
    domains: { label: string; value: number }[];
    pieData: { label: string; value: number; color: string }[];
    insights: string[];
    criticalGaps: { gap: string; area: string; priority: number }[];
    improvementAreas: string[];
    strongControls: string[];
    actionPlan: {
        days30: string;
        days60: string;
        days90: string;
    };
}

interface FlowVisualData {
    type: 'flow';
    nodes: { label: string; active: boolean }[];
}

interface MapVisualData {
    type: 'map';
}

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const radius = 80;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const getColor = (s: number) => {
        if (s > 70) return "#ef4444"; // Red (High Chaos/Exposure)
        if (s > 40) return "#f59e0b"; // Amber (Medium)
        return "#1cd35c"; // Green (Low/Safe)
    };

    return (
        <div className="relative flex flex-col items-center justify-center">
            <svg
                height={radius * 2}
                width={radius * 2}
                className="transform -rotate-90"
            >
                {/* Background Track */}
                <circle
                    stroke="rgba(255,255,255,0.05)"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                {/* Progress Bar */}
                <motion.circle
                    stroke={getColor(score)}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-4xl font-black text-white"
                >
                    {Number(score).toFixed(2).replace(/\.?0+$/, '')}%
                </motion.span>
                <span className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Impact Score</span>
            </div>
        </div>
    );
};

const DataFlowVisualizer: React.FC<{ data: FlowVisualData }> = ({ data }) => {
    if (!data || data.type !== 'flow') return null;

    const sourceNode = data.nodes[0];
    const destinationNodes = data.nodes.slice(1);

    return (
        <div className="relative h-72 bg-gray-900/50 rounded-3xl p-8 border border-white/10 overflow-hidden flex items-center justify-between gap-8">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            {/* Source - Business */}
            <div className="relative z-10 w-32 h-32 bg-[#1cd35c]/10 border border-[#1cd35c]/30 rounded-full flex flex-col items-center justify-center text-center p-2 shadow-[0_0_30px_rgba(28,211,92,0.1)]">
                <Shield className="w-8 h-8 text-[#1cd35c] mb-2" />
                <span className="text-xs text-white font-bold uppercase tracking-wider">{sourceNode.label}</span>
                <span className="text-[10px] text-white/40 mt-1">Data Source</span>
            </div>

            {/* Flow Connector */}
            <div className="flex-1 h-full flex flex-col justify-center relative">
                {/* Central Flow Line */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-[#1cd35c]/50 to-transparent" />

                {/* Digital Particles */}
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        animate={{ x: [-20, 300], opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.6, ease: "linear" }}
                        className="absolute top-1/2 left-0 w-12 h-0.5 bg-gradient-to-r from-transparent via-[#1cd35c] to-transparent blur-[1px]"
                    />
                ))}

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 text-[10px] text-[#1cd35c] font-black uppercase tracking-widest animate-pulse">
                    Simulating Data Flow
                </div>
            </div>

            {/* Destinations - Tools */}
            <div className="flex flex-col gap-3 z-10 w-48">
                {destinationNodes.map((node, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${node.active
                            ? 'bg-white/10 border-[#1cd35c]/50 shadow-[0_0_15px_rgba(28,211,92,0.1)]'
                            : 'bg-white/5 border-white/5 opacity-30 grayscale'
                            }`}
                    >
                        <div className={`w-2 h-2 rounded-full ${node.active ? 'bg-[#1cd35c] shadow-[0_0_5px_#1cd35c]' : 'bg-white/20'}`} />
                        <span className={`text-xs font-bold ${node.active ? 'text-white' : 'text-white/40'}`}>{node.label}</span>
                        {node.active && <span className="ml-auto text-[9px] text-[#1cd35c] font-mono">EXPOSED</span>}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const RegulatoryMapVisualizer: React.FC<{ data: MapVisualData }> = ({ data }) => {
    if (!data || data.type !== 'map') return null;

    return (
        <div className="relative h-64 bg-blue-500/5 rounded-3xl p-6 border border-blue-500/10 overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Globe className="w-12 h-12 text-blue-400" />
            </div>
            <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6">Global Regulatory Radar</h4>

            <div className="relative w-full h-40 bg-white/5 rounded-2xl overflow-hidden">
                {/* Simplified World Dots */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            </div>
        </div>
    );
};

const PolicyPieChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    if (total === 0) return null;

    let cumulativeValue = 0;
    const size = 160;
    const center = size / 2;
    const radius = 60;

    return (
        <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90 overflow-visible">
                {data.map((slice, idx) => {
                    const startAngle = (cumulativeValue / total) * 360;
                    cumulativeValue += slice.value;
                    const endAngle = (cumulativeValue / total) * 360;

                    // SVG arc path
                    const x1 = center + radius * Math.cos((startAngle * Math.PI) / 180);
                    const y1 = center + radius * Math.sin((startAngle * Math.PI) / 180);
                    const x2 = center + radius * Math.cos((endAngle * Math.PI) / 180);
                    const y2 = center + radius * Math.sin((endAngle * Math.PI) / 180);

                    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
                    const d = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                    return (
                        <motion.path
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            d={d}
                            fill={slice.color}
                            className="transition-all hover:opacity-80 cursor-default"
                        >
                            <title>{`${slice.label}: ${slice.value}`}</title>
                        </motion.path>
                    );
                })}
                {/* Hole in the middle for donut look */}
                <circle cx={center} cy={center} r={radius * 0.6} fill="white" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-gray-900">{total}</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Domains</span>
            </div>
        </div>
    );
};

const SemiCircleGauge: React.FC<{ score: number }> = ({ score }) => {
    const radius = 90; // Decreased radius
    const stroke = 18;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center pt-6 pb-0">
            {/* SVG Container - overflow visible for shadows/glows if needed */}
            <svg
                height={radius}
                width={radius * 2}
                className="overflow-visible"
                style={{ transform: "rotate(0deg)" }} // Reset any potential rotation
            >
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#84cc16" />   {/* Lime/Yellow start */}
                        <stop offset="50%" stopColor="#22c55e" />   {/* Green middle */}
                        <stop offset="100%" stopColor="#15803d" />  {/* Dark Green end */}
                    </linearGradient>
                </defs>

                {/* Track (Background Arc) */}
                <path
                    d={`M${stroke},${radius} a${normalizedRadius},${normalizedRadius} 0 0,1 ${normalizedRadius * 2},0`}
                    fill="none"
                    stroke="#f3f4f6" // Light gray track
                    strokeWidth={stroke}
                    strokeLinecap="round"
                />

                {/* Value Arc (Gradient) */}
                <motion.path
                    d={`M${stroke},${radius} a${normalizedRadius},${normalizedRadius} 0 0,1 ${normalizedRadius * 2},0`}
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference} // Start empty
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>

            {/* Score Text Nested Inside */}
            <div className="absolute bottom-0 mb-2 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-5xl font-black text-gray-900 leading-none tracking-tighter"
                >
                    {score}<span className="text-2xl align-top text-gray-400 font-bold ml-1">%</span>
                </motion.div>
                <div className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Compliance Score</div>
            </div>
        </div>
    );
};

const AnimatedNeedleGauge: React.FC<{ score: number }> = ({ score }) => {
    const radius = 100;
    const angleRange = 180;

    // Calculate needle rotation
    const rotation = (score / 100) * angleRange;

    return (
        <div className="relative flex flex-col items-center justify-center p-4">
            <svg width={radius * 2} height={radius + 20} className="overflow-visible">
                <defs>
                    <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#1cd35c" />
                    </linearGradient>
                </defs>

                {/* Background Arc */}
                <path
                    d={`M 20 ${radius} A ${radius - 20} ${radius - 20} 0 0 1 ${radius * 2 - 20} ${radius}`}
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="24"
                    strokeLinecap="round"
                />

                {/* Score Arc */}
                <motion.path
                    d={`M 20 ${radius} A ${radius - 20} ${radius - 20} 0 0 1 ${radius * 2 - 20} ${radius}`}
                    fill="none"
                    stroke="url(#arcGradient)"
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeDasharray={251} // Approx circumference
                    initial={{ strokeDashoffset: 251 }}
                    animate={{ strokeDashoffset: 251 - (score / 100) * 251 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />

                {/* Needle */}
                <motion.g
                    initial={{ rotate: -90 }}
                    animate={{ rotate: rotation - 90 }}
                    transition={{ duration: 2, ease: "backOut" }}
                    style={{ originX: `${radius}px`, originY: `${radius}px` }}
                >
                    <line
                        x1={radius}
                        y1={radius}
                        x2={radius}
                        y2={20}
                        stroke="#111827"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <circle cx={radius} cy={radius} r="6" fill="#111827" />
                </motion.g>
            </svg>
            <div className="text-center -mt-4">
                <div className="text-5xl font-black text-gray-900">{score}%</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Compliance Index</div>
            </div>
        </div>
    );
};

const RadarChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    if (!data || data.length === 0) return null;
    const size = 260;
    const center = size / 2;
    const radius = 90;
    const totalLevels = 4;

    const angleStep = (Math.PI * 2) / data.length;

    const getPoint = (value: number, angle: number) => {
        const r = (value / 100) * radius;
        return {
            x: center + r * Math.cos(angle - Math.PI / 2),
            y: center + r * Math.sin(angle - Math.PI / 2)
        };
    };

    const points = data.map((d, i) => getPoint(d.value, i * angleStep));
    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

    return (
        <div className="relative w-full flex justify-center">
            <svg width={size} height={size} className="overflow-visible">
                {/* Levels */}
                {[...Array(totalLevels)].map((_, i) => (
                    <circle
                        key={i}
                        cx={center}
                        cy={center}
                        r={(radius / totalLevels) * (i + 1)}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        strokeDasharray="4 2"
                    />
                ))}

                {/* Axes */}
                {data.map((_, i) => {
                    const p = getPoint(100, i * angleStep);
                    return (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={p.x}
                            y2={p.y}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data Polygon */}
                <motion.path
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    d={pathData}
                    fill="#1cd35c"
                />
                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                    d={pathData}
                    fill="none"
                    stroke="#1cd35c"
                    strokeWidth="3"
                />

                {/* Data Points */}
                {points.map((p, i) => (
                    <motion.circle
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="#1cd35c"
                        stroke="white"
                        strokeWidth="2"
                    />
                ))}

                {/* Labels */}
                {data.map((d, i) => {
                    const p = getPoint(125, i * angleStep);
                    return (
                        <text
                            key={i}
                            x={p.x}
                            y={p.y}
                            textAnchor="middle"
                            className="text-[10px] font-black fill-gray-400 uppercase tracking-wider"
                        >
                            {d.label}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};

const PolicyHealthDashboard: React.FC<{ data: PolicyHealthVisualData; numericScore: number }> = ({ data, numericScore }) => {
    if (!data || data.type !== 'policy_health_dashboard') return null;

    return (
        <div className="w-full space-y-12 py-16 px-8 bg-white min-h-full">
            {/* Header / Intro */}
            <div className="text-center space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.2em] leading-none">External Trust Diagnostic</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tight">Privacy Policy Health</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                    Analyzing the defensibility of your public disclosures and the 'Reality Gap' between policy and practice.
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Col - Core Score & Breakdown (4 spans) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-emerald-50/30 border border-emerald-100 p-10 rounded-[40px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                            <Shield className="w-24 h-24 text-gray-900" />
                        </div>
                        <AnimatedNeedleGauge score={numericScore} />
                        <div className="mt-8 pt-8 border-t border-emerald-100/50">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Alignment Rating</span>
                                <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">
                                    {numericScore > 80 ? 'Strategic' : numericScore > 50 ? 'Developing' : 'Fragmented'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* STATUS PIE */}
                    <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 text-center">Disclosure Status Breakdown</h4>
                        <div className="flex flex-col items-center gap-8">
                            <div className="w-full h-4 flex rounded-full overflow-hidden bg-gray-100">
                                {data.pieData.map((d, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(d.value / 4) * 100}%` }}
                                        style={{ backgroundColor: d.color }}
                                        className="h-full"
                                    />
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-4 w-full text-center">
                                {data.pieData.map((d, i) => (
                                    <div key={i}>
                                        <div className="text-xl font-black text-gray-900">{d.value}</div>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase">{d.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Col - Visual Intelligence ( radar + benchmarks ) (5 spans) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white border border-gray-100 p-10 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.02)] flex flex-col items-center">
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-12 flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4 text-emerald-600" />
                            Policy Alignment Radar
                        </h4>
                        <RadarChart data={data.domains} />
                    </div>

                    {/* BENCHMARKS */}
                    <div className="bg-[#1a1b26] p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-10 text-left">Compliance Benchmarking (%)</h4>
                        <div className="space-y-8">
                            {data.domains.map((domain, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-white uppercase tracking-wider">{domain.label}</span>
                                        <span className="text-sm font-black text-emerald-400">{domain.value}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${domain.value}%` }}
                                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col - Alerts & Action Plan (3 spans) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Policy-to-Practice Gaps</h4>
                        {data.criticalGaps.map((gap, i) => (
                            <div key={i} className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-start gap-4">
                                <AlertTriangle className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                                <div>
                                    <div className="text-[9px] font-black text-red-400 uppercase mb-1">{gap.area}</div>
                                    <div className="text-xs font-bold text-gray-900 leading-tight">{gap.gap}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[40px] space-y-6">
                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Remediation Roadmap
                        </h4>
                        <div className="space-y-6 border-l-2 border-emerald-200 ml-2 pl-6">
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-emerald-50" />
                                <div className="text-[9px] font-black text-emerald-400 uppercase mb-1">Phase 1: 30 Days</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days30}</div>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-emerald-400 rounded-full border-4 border-emerald-50" />
                                <div className="text-[9px] font-black text-emerald-400 uppercase mb-1">Phase 2: 60 Days</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days60}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOWER SECTION: BLIND SPOTS & INSIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-gray-100">
                <div className="bg-gray-50/50 p-10 rounded-[40px] space-y-6 text-left">
                    <div className="flex items-center gap-4 mb-4">
                        <AlertCircle className="w-6 h-6 text-orange-500" />
                        <h4 className="text-lg font-black text-gray-900">Expert Risk Commentary</h4>
                    </div>
                    {data.insights.map((insight, i) => (
                        <p key={i} className="text-sm text-gray-500 font-medium leading-relaxed italic border-l-4 border-orange-200 pl-4">
                            "{insight}"
                        </p>
                    ))}
                </div>

                <div className="bg-emerald-50/50 p-10 rounded-[40px] border border-emerald-100 space-y-8 text-left">
                    <div className="flex items-center gap-4">
                        <Shield className="w-6 h-6 text-emerald-600" />
                        <h4 className="text-lg font-black text-gray-900">Governance Recommendations</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-bold text-gray-700">Enforce a 'Double-Gate' review for any code changes touching data collection scripts.</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-bold text-gray-700">Automate policy versioning and archived copy retrieval for regulatory discovery requests.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DataMappingDashboard: React.FC<{ data: DataMappingVisualData; numericScore: number }> = ({ data, numericScore }) => {
    if (!data || data.type !== 'data_mapping_dashboard') return null;

    return (
        <div className="w-full space-y-12 py-16 px-8 bg-white min-h-full">
            {/* Header / Intro */}
            <div className="text-center space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
                    <Database className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] leading-none">Operational Data Mapping</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tight">Data Flow Intelligence</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                    Visualizing your data lineage, cross-functional flows, and lifecycle governance maturity.
                </p>
            </div>

            {/* Core Visualization - The Lineage Map */}
            <div className="bg-[#0f172a] rounded-[48px] p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                <h4 className="relative z-10 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-12 text-center">Operational Lineage Snapshot</h4>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                    {/* Step 1: Subjects */}
                    <div className="space-y-4">
                        <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest text-center">Source</div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center">
                            <Users className="w-5 h-5 text-blue-400 mx-auto mb-3" />
                            <div className="text-xs font-bold text-white leading-tight">{data.flow.subjects[0]}</div>
                        </div>
                    </div>

                    <div className="hidden md:flex justify-center text-white/20"><ArrowRight /></div>

                    {/* Step 2: Collection & Internal */}
                    <div className="space-y-4">
                        <div className="text-[9px] font-black text-[#1cd35c] uppercase tracking-widest text-center">Internal Logic</div>
                        <div className="bg-[#1cd35c]/5 border border-[#1cd35c]/20 p-6 rounded-3xl space-y-4">
                            <div className="text-[10px] font-bold text-white flex items-center gap-3">
                                <Zap className="w-3 h-3 text-[#1cd35c]" />
                                {data.flow.triggers[0]}
                            </div>
                            <div className="text-[10px] font-bold text-white flex items-center gap-3">
                                <Activity className="w-3 h-3 text-[#1cd35c]" />
                                {data.flow.functions[0]}
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex justify-center text-white/20"><ArrowRight /></div>

                    {/* Step 3: Outcomes & External */}
                    <div className="space-y-4">
                        <div className="text-[9px] font-black text-purple-400 uppercase tracking-widest text-center">Destination</div>
                        <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-3xl text-center mb-4">
                            <Shield className="w-5 h-5 text-purple-400 mx-auto mb-3" />
                            <div className="text-xs font-bold text-white leading-tight">{data.flow.outcomes[0]}</div>
                        </div>
                        {data.flow.external[0] !== "Strictly internal processing" && (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl text-[9px] font-black text-red-100/60 uppercase text-center">
                                External: {data.flow.external[0]}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid Layout for Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Col - Maturity (4 spans) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-blue-50/30 border border-blue-100 p-10 rounded-[40px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                            <Database className="w-24 h-24 text-gray-900" />
                        </div>
                        <AnimatedNeedleGauge score={numericScore} />
                    </div>

                    <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 text-center">Lifecycle Health</h4>
                        <div className="flex flex-col items-center gap-8">
                            <div className="w-full h-4 flex rounded-full overflow-hidden bg-gray-100">
                                {data.pieData.map((d, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(d.value / (data.pieData.reduce((acc, curr) => acc + curr.value, 0) || 1)) * 100}%` }}
                                        style={{ backgroundColor: d.color }}
                                        className="h-full"
                                    />
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-4 w-full text-center">
                                {data.pieData.map((d, i) => (
                                    <div key={i}>
                                        <div className="text-xl font-black text-gray-900">{d.value}</div>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase">{d.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Col - Radar (5 spans) */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-white border border-gray-100 p-10 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.02)] flex flex-col items-center">
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-12 flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4 text-blue-600" />
                            Mapping Maturity Radar
                        </h4>
                        <RadarChart data={data.domains} />
                    </div>

                    {/* BENCHMARKS */}
                    <div className="bg-[#1a1b26] p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-10">Maturity Benchmarks (%)</h4>
                        <div className="space-y-8">
                            {data.domains.map((domain, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-white uppercase tracking-wider">{domain.label}</span>
                                        <span className="text-sm font-black text-blue-400">{domain.value}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${domain.value}%` }}
                                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col - Gaps & Action (3 spans) */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Detected Vulnerabilities</h4>
                        {data.criticalGaps.map((gap, i) => (
                            <div key={i} className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-start gap-4">
                                <AlertTriangle className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                                <div>
                                    <div className="text-[9px] font-black text-red-400 uppercase mb-1">{gap.area}</div>
                                    <div className="text-xs font-bold text-gray-900 leading-tight">{gap.gap}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-100 p-8 rounded-[40px] space-y-6">
                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Optimization Path
                        </h4>
                        <div className="space-y-6 border-l-2 border-blue-200 ml-2 pl-6">
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-blue-50" />
                                <div className="text-[9px] font-black text-blue-400 uppercase mb-1">D+30</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days30}</div>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-blue-400 rounded-full border-4 border-blue-50" />
                                <div className="text-[9px] font-black text-blue-400 uppercase mb-1">D+60</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days60}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOWER SECTION: COMMENTARY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-gray-100">
                <div className="bg-gray-50/50 p-10 rounded-[40px] space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                        <AlertCircle className="w-6 h-6 text-orange-500" />
                        <h4 className="text-lg font-black text-gray-900">Expert Risk Commentary</h4>
                    </div>
                    {data.insights.map((insight, i) => (
                        <p key={i} className="text-sm text-gray-500 font-medium leading-relaxed italic border-l-4 border-orange-200 pl-4">
                            "{insight}"
                        </p>
                    ))}
                </div>

                <div className="bg-blue-50/50 p-10 rounded-[40px] border border-blue-100 space-y-8">
                    <div className="flex items-center gap-4">
                        <Shield className="w-6 h-6 text-blue-600" />
                        <h4 className="text-lg font-black text-gray-900">Governance Recommendations</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold text-gray-700">Audit all Shadow IT systems identified in functional sharing.</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold text-gray-700">Implement automated Data Subject Request (DSR) routing based on lineage.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VendorIntelligenceDashboard: React.FC<{ data: VendorIntelligenceVisualData; numericScore: number }> = ({ data, numericScore }) => {
    if (!data || data.type !== 'vendor_intelligence_dashboard') return null;

    return (
        <div className="w-full space-y-12 py-16 px-8 bg-white min-h-full">
            {/* Header / Intro */}
            <div className="text-center space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-100 rounded-full">
                    <Eye className="w-4 h-4 text-purple-600" />
                    <span className="text-[10px] font-black text-purple-900 uppercase tracking-[0.2em] leading-none">Third-Party Risk Intelligence</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tight">Vendor Ecosystem Audit</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                    Visualizing risk exposure across your supply chain, data sensitivity tiers, and contractual enforcement status.
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Col - Core Stats (4 spans) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Compliance Index Widget */}
                    <div className="bg-purple-50/30 border border-purple-100 p-10 rounded-[40px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                            <Shield className="w-24 h-24 text-gray-900" />
                        </div>
                        <AnimatedNeedleGauge score={numericScore} />
                    </div>

                    {/* PIE CHART / Domain Composition */}
                    <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 text-center flex items-center justify-center gap-2">
                            Ecosystem Health Distribution
                        </h4>
                        <div className="flex flex-col items-center gap-8">
                            <div className="w-full h-4 flex rounded-full overflow-hidden bg-gray-100">
                                {data.pieData.map((d, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(d.value / (data.pieData.reduce((acc, curr) => acc + curr.value, 0) || 1)) * 100}%` }}
                                        style={{ backgroundColor: d.color }}
                                        className="h-full"
                                    />
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-4 w-full">
                                {data.pieData.map((d, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-xl font-black text-gray-900">{d.value}</div>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase">{d.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Col - Visual Intelligence (5 spans) */}
                <div className="lg:col-span-5 space-y-8">
                    {/* RADAR CHART */}
                    <div className="bg-white border border-gray-100 p-10 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.02)] flex flex-col items-center">
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-12 flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4 text-purple-600" />
                            Third-Party Risk Radar
                        </h4>
                        <RadarChart data={data.domains} />
                    </div>

                    {/* DOMAIN BAR GRAPH */}
                    <div className="bg-[#1a1b26] p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        <h4 className="relative z-10 text-[10px] font-black text-white/40 uppercase tracking-widest mb-10">Maturity Benchmarks (%)</h4>
                        <div className="space-y-8 relative z-10">
                            {data.domains.map((domain, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-white uppercase tracking-wider">{domain.label}</span>
                                        <span className="text-sm font-black text-purple-400">{domain.value}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${domain.value}%` }}
                                            transition={{ delay: 1 + i * 0.1, duration: 1.5 }}
                                            className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col - Critical Alerts & Action Plan (3 spans) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* RISK TILES */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Supply Chain Vulnerabilities</h4>
                        {data.criticalGaps.map((gap, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.2 }}
                                className="bg-red-50 border border-red-100 p-6 rounded-3xl group cursor-help transition-all hover:bg-red-100"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-500 p-2 rounded-xl mt-1">
                                        <AlertTriangle className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">{gap.area}</div>
                                        <div className="text-xs font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors">{gap.gap}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* IMPROVEMENT ROADMAP */}
                    <div className="bg-purple-50 border border-purple-100 p-8 rounded-[40px] space-y-6">
                        <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Governance Roadmap
                        </h4>
                        <div className="space-y-6 border-l-2 border-purple-200 ml-2 pl-6">
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-purple-500 rounded-full border-4 border-purple-50" />
                                <div className="text-[9px] font-black text-purple-400 uppercase mb-1">Immediate (Day 30)</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days30}</div>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-purple-400 rounded-full border-4 border-purple-50" />
                                <div className="text-[9px] font-black text-purple-400 uppercase mb-1">Short-Term (Day 60)</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days60}</div>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-purple-200 rounded-full border-4 border-purple-50" />
                                <div className="text-[9px] font-black text-purple-400 uppercase mb-1">Strategic (Day 90)</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days90}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOWER SECTION: BLIND SPOTS & INSIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-gray-100">
                <div className="space-y-6 bg-gray-50/50 p-10 rounded-[40px]">
                    <div className="flex items-center gap-4 mb-4">
                        <AlertCircle className="w-6 h-6 text-orange-500" />
                        <h4 className="text-lg font-black text-gray-900">Expert Risk Commentary</h4>
                    </div>
                    <div className="space-y-6">
                        {data.insights.map((insight, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-200 mt-2 shrink-0 group-hover:bg-orange-500 transition-colors" />
                                <p className="text-sm text-gray-500 font-medium leading-relaxed italic">"{insight}"</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8 bg-purple-50/50 p-10 rounded-[40px] border border-purple-100">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-600 p-2 rounded-xl">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-black text-gray-900">Strategic Recommendations</h4>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl border border-white">
                            <CheckCircle2 className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-bold text-gray-700">Enforce a 'No-Contract, No-Data' policy for all new vendor onboardings.</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl border border-white">
                            <CheckCircle2 className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-bold text-gray-700">Conduct deep-dive security audits for all 'Mission-Critical' vendors processing PII.</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl border border-white">
                            <CheckCircle2 className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-bold text-gray-700">Integrate real-time threat intelligence for third-party monitoring.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OperationalRiskDashboard: React.FC<{ data: OperationalRiskVisualData; numericScore: number }> = ({ data, numericScore }) => {
    if (!data || data.type !== 'operational_risk_dashboard') return null;

    return (
        <div className="w-full space-y-12 py-16 px-8 bg-white min-h-full">
            {/* Header / Intro */}
            <div className="text-center space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full">
                    <Zap className="w-4 h-4 text-[#1cd35c]" />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] leading-none">Operational Risk Intelligence</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tight">Data Operational Risk Audit</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                    Granular analysis of operational risk maturity, closure velocity, and executive oversight.
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Col - Core Stats (4 spans) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Compliance Index Widget */}
                    <div className="bg-gray-50/50 border border-gray-100 p-10 rounded-[40px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                            <Activity className="w-24 h-24 text-gray-900" />
                        </div>
                        <AnimatedNeedleGauge score={numericScore} />
                    </div>

                    {/* PIE CHART / Domain Composition */}
                    <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 text-center flex items-center justify-center gap-2">
                            Maturity Distribution
                        </h4>
                        <div className="flex flex-col items-center gap-8">
                            <div className="w-full h-4 flex rounded-full overflow-hidden bg-gray-100">
                                {data.pieData.map((d, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(d.value / (data.pieData.reduce((acc, curr) => acc + curr.value, 0) || 1)) * 100}%` }}
                                        style={{ backgroundColor: d.color }}
                                        className="h-full"
                                    />
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-4 w-full">
                                {data.pieData.map((d, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-xl font-black text-gray-900">{d.value}</div>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase">{d.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Col - Visual Intelligence (5 spans) */}
                <div className="lg:col-span-5 space-y-8">
                    {/* RADAR CHART */}
                    <div className="bg-white border border-gray-100 p-10 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.02)] flex flex-col items-center">
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-12 flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4 text-[#1cd35c]" />
                            Operational Risk Radar
                        </h4>
                        <RadarChart data={data.domains} />
                    </div>

                    {/* DOMAIN BAR GRAPH */}
                    <div className="bg-gray-900 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        <h4 className="relative z-10 text-[10px] font-black text-white/40 uppercase tracking-widest mb-10">Maturity Index (%)</h4>
                        <div className="space-y-8 relative z-10">
                            {data.domains.map((domain, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-white uppercase tracking-wider">{domain.label}</span>
                                        <span className="text-sm font-black text-[#1cd35c]">{domain.value}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${domain.value}%` }}
                                            transition={{ delay: 1 + i * 0.1, duration: 1.5 }}
                                            className="h-full bg-gradient-to-r from-[#1cd35c] to-[#1cd35c]/50"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col - Critical Alerts & Action Plan (3 spans) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* RISK TILES */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Critical Exposure Gaps</h4>
                        {data.criticalGaps.map((gap, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.2 }}
                                className="bg-red-50 border border-red-100 p-6 rounded-3xl group cursor-help transition-all hover:bg-red-100"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-500 p-2 rounded-xl mt-1">
                                        <AlertTriangle className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">{gap.area}</div>
                                        <div className="text-xs font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors">{gap.gap}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* IMPROVEMENT ROADMAP */}
                    <div className="bg-blue-50 border border-blue-100 p-8 rounded-[40px] space-y-6">
                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Remediation Plan
                        </h4>
                        <div className="space-y-6 border-l-2 border-blue-200 ml-2 pl-6">
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-blue-50" />
                                <div className="text-[9px] font-black text-blue-400 uppercase mb-1">Phase 1: Day 30</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days30}</div>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-blue-400 rounded-full border-4 border-blue-50" />
                                <div className="text-[9px] font-black text-blue-400 uppercase mb-1">Phase 2: Day 60</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days60}</div>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-blue-200 rounded-full border-4 border-blue-50" />
                                <div className="text-[9px] font-black text-blue-400 uppercase mb-1">Phase 3: Day 90</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days90}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOWER SECTION: BLIND SPOTS & INSIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-gray-100">
                <div className="space-y-6 bg-gray-50/50 p-10 rounded-[40px]">
                    <div className="flex items-center gap-4 mb-4">
                        <AlertCircle className="w-6 h-6 text-orange-500" />
                        <h4 className="text-lg font-black text-gray-900">Risk Exposure Insights</h4>
                    </div>
                    <div className="space-y-6">
                        {data.insights.map((insight, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-200 mt-2 shrink-0 group-hover:bg-orange-500 transition-colors" />
                                <p className="text-sm text-gray-500 font-medium leading-relaxed italic">"{insight}"</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8 bg-[#1cd35c]/5 p-10 rounded-[40px] border border-[#1cd35c]/10">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#1cd35c] p-2 rounded-xl">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-black text-gray-900">Recommended Next Steps</h4>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-white">
                            <CheckCircle2 className="w-5 h-5 text-[#1cd35c]" />
                            <span className="text-sm font-bold text-gray-700">Consolidate all unmanaged risks into a centralized RoPA linked register.</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-white">
                            <CheckCircle2 className="w-5 h-5 text-[#1cd35c]" />
                            <span className="text-sm font-bold text-gray-700">Assign explicit executive ownership for closure of high-residual risks.</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-white">
                            <CheckCircle2 className="w-5 h-5 text-[#1cd35c]" />
                            <span className="text-sm font-bold text-gray-700">Automate risk notifications and escalation triggers.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const IncidentReadinessDashboard: React.FC<{ data: IncidentReadinessVisualData; numericScore: number }> = ({ data, numericScore }) => {
    if (!data || data.type !== 'incident_readiness_dashboard') return null;

    return (
        <div className="w-full space-y-12 py-16 px-8 bg-white min-h-full">
            {/* Header / Intro */}
            <div className="text-center space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <span className="text-[10px] font-black text-orange-900 uppercase tracking-[0.2em] leading-none">Response Integrity Diagnostic</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tight">Incident Readiness</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                    Analyzing your detection velocity, response structural integrity, and regulatory time-to-compliance.
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Col - Core Score & Breakdown (4 spans) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-orange-50/30 border border-orange-100 p-10 rounded-[40px] relative overflow-hidden group text-center">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                            <Activity className="w-24 h-24 text-gray-900" />
                        </div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Overall Readiness Score</h4>
                        <div className="flex justify-center mb-8">
                            <AnimatedNeedleGauge score={numericScore} />
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-black text-gray-900 tracking-tight">
                                {numericScore < 40 ? "Reactive" : numericScore < 70 ? "Developing" : "Resilient"}
                            </div>
                            <div className="text-sm font-bold text-orange-600 bg-orange-100 rounded-full py-1 px-4 inline-block">
                                Impact Rating: {numericScore < 40 ? "High Exposure" : numericScore < 70 ? "Moderate" : "Advanced"}
                            </div>
                        </div>
                    </div>

                    {/* PIE CHART / DOMAIN MIX */}
                    <div className="bg-gray-50 p-10 rounded-[40px] space-y-8">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Readiness Distribution</h4>
                        <div className="flex justify-center py-4">
                            <PolicyPieChart data={data.pieData} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {data.pieData.map((d, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-lg font-black text-gray-900">{d.value}</div>
                                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{d.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center Col - Radar & Domain Bars (5 spans) */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-[#0f172a] rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
                        {/* Background subtle grid */}
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                        <div className="relative z-10 flex flex-col items-center">
                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-10">Maturity Radar</h4>
                            <RadarChart data={data.domains} />
                        </div>

                        <div className="mt-12 space-y-6 relative z-10">
                            {data.domains.map((domain, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-white/60 uppercase tracking-wider">{domain.label}</span>
                                        <span className="text-sm font-black text-orange-400">{domain.value}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${domain.value}%` }}
                                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                            className="h-full bg-gradient-to-r from-orange-500 to-orange-300"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-[40px] p-10 space-y-6 shadow-xl">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Operational Summary</h4>
                        <p className="text-white/80 text-sm font-medium leading-relaxed">
                            Your readiness score reflects a <span className="text-orange-400 font-black italic">"{numericScore < 40 ? "Reaction-Based" : numericScore < 70 ? "Standardized" : "Proactive"}"</span> posture.
                            Regulatory discovery during a breach will prioritize your detection timestamps and escalation logs.
                        </p>
                    </div>
                </div>

                {/* Right Col - Critical Gaps & Roadmap (3 spans) */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Critical Blind Spots</h4>
                        {data.criticalGaps.map((gap, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="bg-red-50 border border-red-100 p-6 rounded-3xl group transition-all hover:bg-red-100"
                            >
                                <div className="flex gap-4">
                                    <div className="bg-red-500 p-2 rounded-xl h-fit">
                                        <AlertTriangle className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[8px] font-black text-red-500 uppercase tracking-widest">{gap.area}</div>
                                        <div className="text-xs font-bold text-gray-900 leading-tight">{gap.gap}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-orange-50 border border-orange-100 p-8 rounded-[40px] space-y-8">
                        <h4 className="flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase tracking-widest">
                            <TrendingUp className="w-4 h-4" />
                            Remediation Path
                        </h4>
                        <div className="space-y-8 border-l-2 border-orange-200 ml-2 pl-6">
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-orange-500 rounded-full border-4 border-orange-50" />
                                <div className="text-[9px] font-black text-orange-400 uppercase mb-1">Phase 1: 30 Days</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days30}</div>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-orange-400 rounded-full border-4 border-orange-50" />
                                <div className="text-[9px] font-black text-orange-400 uppercase mb-1">Phase 2: 60 Days</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days60}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOWER SECTION: BLIND SPOTS & INSIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-gray-100">
                <div className="bg-gray-50/50 p-10 rounded-[40px] space-y-6 text-left">
                    <div className="flex items-center gap-4 mb-4">
                        <AlertCircle className="w-6 h-6 text-orange-500" />
                        <h4 className="text-lg font-black text-gray-900">Expert Risk Commentary</h4>
                    </div>
                    {data.insights.map((insight, i) => (
                        <p key={i} className="text-sm text-gray-500 font-medium leading-relaxed italic border-l-4 border-orange-200 pl-4">
                            "{insight}"
                        </p>
                    ))}
                </div>

                <div className="bg-orange-50/50 p-10 rounded-[40px] border border-orange-100 space-y-8 text-left">
                    <div className="flex items-center gap-4">
                        <Shield className="w-6 h-6 text-orange-600" />
                        <h4 className="text-lg font-black text-gray-900">Governance Recommendations</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl">
                            <CheckCircle2 className="w-5 h-5 text-orange-600" />
                            <span className="text-sm font-bold text-gray-700">Enforce a 'War-Room' simulation for high-severity data disclosure scenarios.</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl">
                            <CheckCircle2 className="w-5 h-5 text-orange-600" />
                            <span className="text-sm font-bold text-gray-700">Automate real-time breach logging to ensure a tamper-proof audit trail for regulators.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AccountabilityDashboard: React.FC<{ data: AccountabilityVisualData; numericScore: number }> = ({ data, numericScore }) => {
    if (!data || data.type !== 'accountability_dashboard') return null;

    return (
        <div className="w-full space-y-12 py-16 px-8 bg-white min-h-full">
            {/* Header / Intro */}
            <div className="text-center space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] leading-none">RACI Efficiency Diagnostic</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tight">Accountability Clarity</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                    Mapping the decision-making authority and execution ownership across your privacy operations.
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Col - Core Score & Breakdown (4 spans) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-blue-50/30 border border-blue-100 p-10 rounded-[40px] relative overflow-hidden group text-center">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                            <Activity className="w-24 h-24 text-gray-900" />
                        </div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Governance Maturity Score</h4>
                        <div className="flex justify-center mb-8">
                            <AnimatedNeedleGauge score={numericScore} />
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-black text-gray-900 tracking-tight">
                                {numericScore < 40 ? "Undefined" : numericScore < 70 ? "Developing" : "Optimized"}
                            </div>
                            <div className="text-sm font-bold text-blue-600 bg-blue-100 rounded-full py-1 px-4 inline-block">
                                Impact Rating: {numericScore < 40 ? "High Risk" : numericScore < 70 ? "Moderate" : "Advanced"}
                            </div>
                        </div>
                    </div>

                    {/* PIE CHART / DOMAIN MIX */}
                    <div className="bg-gray-50 p-10 rounded-[40px] space-y-8">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Control Distribution</h4>
                        <div className="flex justify-center py-4">
                            <PolicyPieChart data={data.pieData} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {data.pieData.map((d, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-lg font-black text-gray-900">{d.value}</div>
                                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{d.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center Col - Radar & Domain Bars (5 spans) */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-[#0f172a] rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
                        {/* Background subtle grid */}
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                        <div className="relative z-10 flex flex-col items-center">
                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-10">Maturity Radar</h4>
                            <RadarChart data={data.domains} />
                        </div>

                        <div className="mt-12 space-y-6 relative z-10">
                            {data.domains.map((domain, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-white/60 uppercase tracking-wider">{domain.label}</span>
                                        <span className="text-sm font-black text-blue-400">{domain.value}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${domain.value}%` }}
                                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                            className="h-full bg-gradient-to-r from-blue-500 to-blue-300"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-[40px] p-10 space-y-6 shadow-xl">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Operational Summary</h4>
                        <p className="text-white/80 text-sm font-medium leading-relaxed">
                            Your governance score reflects a <span className="text-blue-400 font-black italic">"{numericScore < 40 ? "Chaotic" : numericScore < 70 ? "Defined" : "Clear"}"</span> structure.
                            Clear accountability (the 'A' in RACI) is the primary driver of audit success.
                        </p>
                    </div>
                </div>

                {/* Right Col - Critical Gaps & Roadmap (3 spans) */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Ownership Gaps</h4>
                        {data.criticalGaps.map((gap, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="bg-red-50 border border-red-100 p-6 rounded-3xl group transition-all hover:bg-red-100"
                            >
                                <div className="flex gap-4">
                                    <div className="bg-red-500 p-2 rounded-xl h-fit">
                                        <AlertTriangle className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[8px] font-black text-red-500 uppercase tracking-widest">{gap.area}</div>
                                        <div className="text-xs font-bold text-gray-900 leading-tight">{gap.gap}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-100 p-8 rounded-[40px] space-y-8">
                        <h4 className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                            <TrendingUp className="w-4 h-4" />
                            Remediation Path
                        </h4>
                        <div className="space-y-8 border-l-2 border-blue-200 ml-2 pl-6">
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-blue-50" />
                                <div className="text-[9px] font-black text-blue-400 uppercase mb-1">Phase 1: 30 Days</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days30}</div>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-blue-400 rounded-full border-4 border-blue-50" />
                                <div className="text-[9px] font-black text-blue-400 uppercase mb-1">Phase 2: 60 Days</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days60}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOWER SECTION: BLIND SPOTS & INSIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-gray-100">
                <div className="bg-gray-50/50 p-10 rounded-[40px] space-y-6 text-left">
                    <div className="flex items-center gap-4 mb-4">
                        <AlertCircle className="w-6 h-6 text-blue-500" />
                        <h4 className="text-lg font-black text-gray-900">Expert Risk Commentary</h4>
                    </div>
                    {data.insights.map((insight, i) => (
                        <p key={i} className="text-sm text-gray-500 font-medium leading-relaxed italic border-l-4 border-blue-200 pl-4">
                            "{insight}"
                        </p>
                    ))}
                </div>

                <div className="bg-blue-50/50 p-10 rounded-[40px] border border-blue-100 space-y-8 text-left">
                    <div className="flex items-center gap-4">
                        <Shield className="w-6 h-6 text-blue-600" />
                        <h4 className="text-lg font-black text-gray-900">Governance Recommendations</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold text-gray-700">Audit assignments for 'Single Threaded Ownership' to avoid diffuse responsibility.</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold text-gray-700">Ensure 'Consulted' roles (Subject Matter Experts) are integrated into workflow triggers.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const TransferDashboard: React.FC<{ data: TransferVisualData; numericScore: number }> = ({ data, numericScore }) => {
    if (!data || data.type !== 'transfer_dashboard') return null;

    return (
        <div className="w-full space-y-12 py-16 px-8 bg-white min-h-full">
            {/* Header / Intro */}
            <div className="text-center space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    <span className="text-[10px] font-black text-indigo-900 uppercase tracking-[0.2em] leading-none">Cross-Border Diagnostic</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tight">Global Transfer Awareness</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                    Analyzing the compliance safety of your international data flows and vendor dependencies.
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Col - Core Score & Breakdown (4 spans) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-indigo-50/30 border border-indigo-100 p-10 rounded-[40px] relative overflow-hidden group text-center">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                            <Activity className="w-24 h-24 text-gray-900" />
                        </div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Transfer Safety Score</h4>
                        <div className="flex justify-center mb-8">
                            <AnimatedNeedleGauge score={numericScore} />
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl font-black text-gray-900 tracking-tight">
                                {numericScore < 40 ? "High Risk" : numericScore < 70 ? "Unsafe" : "Secure"}
                            </div>
                            <div className="text-sm font-bold text-indigo-600 bg-indigo-100 rounded-full py-1 px-4 inline-block">
                                Exposure: {numericScore < 40 ? "Critical" : numericScore < 70 ? "Moderate" : "Low"}
                            </div>
                        </div>
                    </div>

                    {/* PIE CHART / DOMAIN MIX */}
                    <div className="bg-gray-50 p-10 rounded-[40px] space-y-8">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Control Distribution</h4>
                        <div className="flex justify-center py-4">
                            <PolicyPieChart data={data.pieData} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {data.pieData.map((d, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-lg font-black text-gray-900">{d.value}</div>
                                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{d.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center Col - Radar & Domain Bars (5 spans) */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-[#0f172a] rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
                        {/* Background subtle grid */}
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                        <div className="relative z-10 flex flex-col items-center">
                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-10">Maturity Radar</h4>
                            <RadarChart data={data.domains} />
                        </div>

                        <div className="mt-12 space-y-6 relative z-10">
                            {data.domains.map((domain, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-white/60 uppercase tracking-wider">{domain.label}</span>
                                        <span className="text-sm font-black text-indigo-400">{domain.value}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${domain.value}%` }}
                                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-300"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-[40px] p-10 space-y-6 shadow-xl">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Operational Summary</h4>
                        <p className="text-white/80 text-sm font-medium leading-relaxed">
                            Your global data footprint is <span className="text-indigo-400 font-black italic">"{numericScore < 40 ? "Unmapped" : numericScore < 70 ? "Partially Controlled" : "Well Managed"}"</span>.
                            Cross-border flows without TIAs are the #1 target for GDPR/DPDP fines.
                        </p>
                    </div>
                </div>

                {/* Right Col - Critical Gaps & Roadmap (3 spans) */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Transfer Risks</h4>
                        {data.criticalGaps.map((gap, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="bg-red-50 border border-red-100 p-6 rounded-3xl group transition-all hover:bg-red-100"
                            >
                                <div className="flex gap-4">
                                    <div className="bg-red-500 p-2 rounded-xl h-fit">
                                        <AlertTriangle className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[8px] font-black text-red-500 uppercase tracking-widest">{gap.area}</div>
                                        <div className="text-xs font-bold text-gray-900 leading-tight">{gap.gap}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[40px] space-y-8">
                        <h4 className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                            <TrendingUp className="w-4 h-4" />
                            Safety Roadmap
                        </h4>
                        <div className="space-y-8 border-l-2 border-indigo-200 ml-2 pl-6">
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-indigo-500 rounded-full border-4 border-indigo-50" />
                                <div className="text-[9px] font-black text-indigo-400 uppercase mb-1">Phase 1: 30 Days</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days30}</div>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-indigo-400 rounded-full border-4 border-indigo-50" />
                                <div className="text-[9px] font-black text-indigo-400 uppercase mb-1">Phase 2: 60 Days</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days60}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOWER SECTION: BLIND SPOTS & INSIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-gray-100">
                <div className="bg-gray-50/50 p-10 rounded-[40px] space-y-6 text-left">
                    <div className="flex items-center gap-4 mb-4">
                        <AlertCircle className="w-6 h-6 text-indigo-500" />
                        <h4 className="text-lg font-black text-gray-900">Expert Risk Commentary</h4>
                    </div>
                    {data.insights.map((insight, i) => (
                        <p key={i} className="text-sm text-gray-500 font-medium leading-relaxed italic border-l-4 border-indigo-200 pl-4">
                            "{insight}"
                        </p>
                    ))}
                </div>

                <div className="bg-indigo-50/50 p-10 rounded-[40px] border border-indigo-100 space-y-8 text-left">
                    <div className="flex items-center gap-4">
                        <Shield className="w-6 h-6 text-indigo-600" />
                        <h4 className="text-lg font-black text-gray-900">Safety Recommendations</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl">
                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                            <span className="text-sm font-bold text-gray-700">Audit all API integrations for hidden cross-border data leaks.</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl">
                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                            <span className="text-sm font-bold text-gray-700">Ensure 'Standard Contractual Clauses' (SCCs) are appended to all foreign vendor contracts.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DpdpEnterpriseDashboard: React.FC<{ data: DpdpEnterpriseVisualData; numericScore: number }> = ({ data, numericScore }) => {
    if (!data || data.type !== 'dpdp_enterprise') return null;

    return (
        <div className="w-full space-y-12 py-16 px-8 bg-white min-h-full">
            {/* Header / Intro */}
            <div className="text-center space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full">
                    <Shield className="w-4 h-4 text-[#1cd35c]" />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] leading-none">Enterprise Compliance Intelligence</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tight">DPDP Readiness Audit</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                    Granular readiness breakdown across four critical regulatory domains with real-time risk assessment.
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Col - Core Stats (4 spans) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Compliance Index Widget */}
                    <div className="bg-gray-50/50 border border-gray-100 p-10 rounded-[40px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                            <Activity className="w-24 h-24 text-gray-900" />
                        </div>
                        <AnimatedNeedleGauge score={numericScore} />
                    </div>

                    {/* PIE CHART / Domain Composition */}
                    <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 text-center flex items-center justify-center gap-2">
                            Domain Health Composition
                        </h4>
                        <div className="flex flex-col items-center gap-8">
                            {/* Simple Linear Composition instead of SVG Pie for cleaner look */}
                            <div className="w-full h-4 flex rounded-full overflow-hidden bg-gray-100">
                                {data.pieData.map((d, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(d.value / (data.pieData.reduce((acc, curr) => acc + curr.value, 0))) * 100}%` }}
                                        style={{ backgroundColor: d.color }}
                                        className="h-full"
                                    />
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-4 w-full">
                                {data.pieData.map((d, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-xl font-black text-gray-900">{d.value}</div>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase">{d.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Col - Visual Intelligence (5 spans) */}
                <div className="lg:col-span-5 space-y-8">
                    {/* RADAR CHART */}
                    <div className="bg-white border border-gray-100 p-10 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.02)] flex flex-col items-center">
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-12 flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4 text-[#1cd35c]" />
                            Multi-Domain Coverage Map
                        </h4>
                        <RadarChart data={data.domains} />
                    </div>

                    {/* DOMAIN BAR GRAPH */}
                    <div className="bg-gray-900 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        <h4 className="relative z-10 text-[10px] font-black text-white/40 uppercase tracking-widest mb-10">Domain Readiness (Normalized %)</h4>
                        <div className="space-y-8 relative z-10">
                            {data.domains.map((domain, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-white uppercase tracking-wider">{domain.label}</span>
                                        <span className="text-sm font-black text-[#1cd35c]">{domain.value}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${domain.value}%` }}
                                            transition={{ delay: 1 + i * 0.1, duration: 1.5 }}
                                            className="h-full bg-gradient-to-r from-[#1cd35c] to-[#1cd35c]/50"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col - Critical Alerts & Action Plan (3 spans) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* RISK TILES */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Critical Risk Gaps</h4>
                        {data.criticalGaps.map((gap, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.2 }}
                                className="bg-red-50 border border-red-100 p-6 rounded-3xl group cursor-help transition-all hover:bg-red-100"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-500 p-2 rounded-xl mt-1">
                                        <AlertTriangle className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">{gap.area}</div>
                                        <div className="text-xs font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors">{gap.gap}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {data.criticalGaps.length === 0 && (
                            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
                                <div className="text-xs font-bold text-emerald-600">No critical gaps identified. Your operational base is secure.</div>
                            </div>
                        )}
                    </div>

                    {/* IMPROVEMENT ROADMAP */}
                    <div className="bg-blue-50 border border-blue-100 p-8 rounded-[40px] space-y-6">
                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            90-Day Roadmap
                        </h4>
                        <div className="space-y-6 border-l-2 border-blue-200 ml-2 pl-6">
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-blue-50" />
                                <div className="text-[9px] font-black text-blue-400 uppercase mb-1">Phase 1: Day 30</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days30}</div>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-blue-300 rounded-full border-4 border-blue-50" />
                                <div className="text-[9px] font-black text-blue-400 uppercase mb-1">Phase 2: Day 60</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days60}</div>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-blue-100 rounded-full border-4 border-blue-50" />
                                <div className="text-[9px] font-black text-blue-400 uppercase mb-1">Phase 3: Day 90</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days90}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOWER SECTION: BLIND SPOTS & INSIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-gray-100">
                <div className="space-y-6 bg-gray-50/50 p-10 rounded-[40px]">
                    <div className="flex items-center gap-4 mb-4">
                        <Users className="w-6 h-6 text-orange-500" />
                        <h4 className="text-lg font-black text-gray-900">Governance & Stakeholder Insights</h4>
                    </div>
                    <div className="space-y-6">
                        {data.insights.map((insight, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-200 mt-2 shrink-0 group-hover:bg-orange-500 transition-colors" />
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{insight}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8 bg-[#1cd35c]/5 p-10 rounded-[40px] border border-[#1cd35c]/10">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#1cd35c] p-2 rounded-xl">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-black text-gray-900">Recommended Next Steps</h4>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-white">
                            <CheckCircle2 className="w-5 h-5 text-[#1cd35c]" />
                            <span className="text-sm font-bold text-gray-700">Automate RoPA (Record of Processing Activities)</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-white">
                            <CheckCircle2 className="w-5 h-5 text-[#1cd35c]" />
                            <span className="text-sm font-bold text-gray-700">Implement Vendor Risk Assessment Workflows</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-white">
                            <CheckCircle2 className="w-5 h-5 text-[#1cd35c]" />
                            <span className="text-sm font-bold text-gray-700">Deploy Tested Incident Management Framework</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SensitiveAssessmentDashboard: React.FC<{ data: SensitiveAssessmentVisualData; numericScore: number }> = ({ data, numericScore }) => {
    if (!data || data.type !== 'sensitive_assessment') return null;

    return (
        <div className="w-full space-y-12 py-16 px-8 bg-white min-h-full">
            {/* Header / Intro */}
            <div className="text-center space-y-4 mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full">
                    <Search className="w-4 h-4 text-[#1cd35c]" />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] leading-none">Enterprise Compliance Intelligence</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tight">Sensitive Data Readiness</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                    Granular structural maturity analysis across identification, lifecycle, and exposure governance domains.
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Col - Core Stats (4 spans) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Compliance Index Widget */}
                    <div className="bg-gray-50/50 border border-gray-100 p-10 rounded-[40px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                            <Activity className="w-24 h-24 text-gray-900" />
                        </div>
                        <AnimatedNeedleGauge score={numericScore} />
                    </div>

                    {/* PIE CHART / Domain Composition */}
                    <div className="bg-white border border-gray-100 p-8 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 text-center flex items-center justify-center gap-2">
                            Control Maturity Health
                        </h4>
                        <div className="flex flex-col items-center gap-8">
                            <div className="w-full h-4 flex rounded-full overflow-hidden bg-gray-100">
                                {data.pieData.map((d, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(d.value / (data.pieData.reduce((acc, curr) => acc + curr.value, 0) || 1)) * 100}%` }}
                                        style={{ backgroundColor: d.color }}
                                        className="h-full"
                                    />
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-4 w-full">
                                {data.pieData.map((d, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-xl font-black text-gray-900">{d.value}</div>
                                        <div className="text-[9px] font-bold text-gray-400 uppercase">{d.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Col - Visual Intelligence (5 spans) */}
                <div className="lg:col-span-5 space-y-8">
                    {/* RADAR CHART */}
                    <div className="bg-white border border-gray-100 p-10 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.02)] flex flex-col items-center">
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-12 flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4 text-[#1cd35c]" />
                            Multi-Domain Coverage Map
                        </h4>
                        <RadarChart data={data.domains.map(d => ({ label: d.label, value: d.value }))} />
                    </div>

                    {/* DOMAIN BAR GRAPH */}
                    <div className="bg-gray-900 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        <h4 className="relative z-10 text-[10px] font-black text-white/40 uppercase tracking-widest mb-10">Domain Maturity Index (%)</h4>
                        <div className="space-y-8 relative z-10">
                            {data.domains.map((domain, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-white uppercase tracking-wider">{domain.label}</span>
                                        <span className="text-sm font-black text-[#1cd35c]">{domain.value}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${domain.value}%` }}
                                            transition={{ delay: 1 + i * 0.1, duration: 1.5 }}
                                            className="h-full bg-gradient-to-r from-[#1cd35c] to-[#1cd35c]/50"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col - Critical Alerts & Action Plan (3 spans) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* RISK TILES */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Critical Exposure Areas</h4>
                        {data.criticalGaps.map((gap, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.2 }}
                                className="bg-red-50 border border-red-100 p-6 rounded-3xl group cursor-help transition-all hover:bg-red-100"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-500 p-2 rounded-xl mt-1">
                                        <AlertTriangle className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">{gap.area}</div>
                                        <div className="text-xs font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors">{gap.gap}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* IMPROVEMENT ROADMAP */}
                    <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[40px] space-y-6">
                        <h4 className="text-[10px] font-black text-[#1cd35c] uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            90-Day Roadmap
                        </h4>
                        <div className="space-y-6 border-l-2 border-[#1cd35c]/20 ml-2 pl-6">
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-[#1cd35c] rounded-full border-4 border-emerald-50" />
                                <div className="text-[9px] font-black text-[#1cd35c]/60 uppercase mb-1">Phase 1: Day 30</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days30}</div>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-[#1cd35c]/50 rounded-full border-4 border-emerald-50" />
                                <div className="text-[9px] font-black text-[#1cd35c]/60 uppercase mb-1">Phase 2: Day 60</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days60}</div>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-[#1cd35c]/20 rounded-full border-4 border-emerald-50" />
                                <div className="text-[9px] font-black text-[#1cd35c]/60 uppercase mb-1">Phase 3: Day 90</div>
                                <div className="text-xs font-bold text-gray-900">{data.actionPlan.days90}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOWER SECTION: BLIND SPOTS & INSIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-gray-100">
                <div className="space-y-6 bg-gray-50/50 p-10 rounded-[40px]">
                    <div className="flex items-center gap-4 mb-4">
                        <Eye className="w-6 h-6 text-orange-500" />
                        <h4 className="text-lg font-black text-gray-900">Intelligent Blind-Spot Insights</h4>
                    </div>
                    <div className="space-y-6">
                        {data.insights.map((insight, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-200 mt-2 shrink-0 group-hover:bg-orange-500 transition-colors" />
                                <p className="text-sm text-gray-500 font-medium leading-relaxed italic">"{insight}"</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8 bg-[#1cd35c]/5 p-10 rounded-[40px] border border-[#1cd35c]/10">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#1cd35c] p-2 rounded-xl">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-black text-gray-900">Regulatory Exposure Audit</h4>
                    </div>
                    <div className="space-y-6">
                        {data.regQuestions.map((q, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white/50 p-4 rounded-2xl border border-white">
                                <CheckCircle2 className="w-4 h-4 text-[#1cd35c]" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-gray-400 uppercase">Potential Auditor Query</span>
                                    <span className="text-sm font-bold text-gray-700 italic">"{q}"</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-100 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">
                    Mandatory Disclaimer: This assessment provides indicative insights based on user responses. It does not constitute legal advice or certification of compliance.
                </p>
            </div>
        </div>
    );
};

const DpdpDashboardVisualizer: React.FC<{ data: DpdpVisualData }> = ({ data }) => {
    if (!data || data.type !== 'dpdp_dashboard') return null;

    const { alerts, peerAverage, lastWeek, subScores } = data;

    return (
        <div className="w-full max-w-5xl mx-auto flex justify-center py-8">
            <div className="bg-white border border-gray-100 rounded-[50px] shadow-[0_30px_100px_rgba(0,0,0,0.04)] p-12 md:p-16 w-full relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1cd35c]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    {/* Left: Score Gauge */}
                    <div className="flex flex-col items-center justify-center space-y-8 bg-gray-50/50 p-10 rounded-[40px] border border-gray-100/50">
                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white border text-gray-600 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap border-gray-200"
                            >
                                <span className="font-black text-gray-800">{peerAverage}%</span> Peer Average
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 }}
                                className="bg-[#ecfdf5] border border-[#d1fae5] text-[#059669] text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap"
                            >
                                <span className="font-black">{lastWeek}%</span> Last Week
                            </motion.div>
                        </div>

                        <div className="mt-8">
                            <SemiCircleGauge score={subScores.inventory || 0} />
                        </div>
                    </div>

                    {/* Right: Insights & Stats */}
                    <div className="space-y-10">
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black text-[#1cd35c] uppercase tracking-[0.2em]">Operational Insights</h4>
                            <h3 className="text-3xl font-black text-gray-900 leading-tight">Readiness Diagnostic</h3>
                        </div>

                        <div className="space-y-10">
                            {/* Statistic 1 */}
                            <div className="flex items-center gap-8 group cursor-pointer hover:translate-x-1 transition-transform">
                                <span className="text-4xl font-black text-gray-900 w-16 text-right tabular-nums">{alerts.impacting}</span>
                                <div className="flex flex-col">
                                    <span className="text-[#ff6b6b] font-bold text-sm">Alerts Impacting Compliance</span>
                                    <span className="text-xs text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Click to view details</span>
                                </div>
                            </div>

                            {/* Statistic 2 */}
                            <div className="flex items-center gap-8 group cursor-pointer hover:translate-x-1 transition-transform">
                                <span className="text-4xl font-black text-gray-900 w-16 text-right tabular-nums opacity-60">{alerts.attention}</span>
                                <div className="flex flex-col">
                                    <span className="text-gray-500 font-bold text-sm">Alerts Need Your Attention</span>
                                    <span className="text-xs text-gray-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity">View non-critical alerts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="mt-16 pt-0 text-center md:text-left">
                    <p className="inline-block text-sm font-bold text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                        <span className="text-gray-900">{alerts.impacting} of 730 Employees</span> have <span className="text-[#ff6b6b] border-b-2 border-[#ff6b6b]/20">compliance alerts.</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

const ScannerDashboardVisualizer: React.FC<{ data: ScannerVisualData }> = ({ data }) => {
    if (!data || data.type !== 'scanner_dashboard') return null;

    const { stats, filesByType, repositories, peerAverage } = data;

    return (
        <div className="w-full space-y-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] space-y-2">
                    <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
                        <HardDrive className="w-3 h-3" />
                        Total Data
                    </div>
                    <div className="text-2xl font-black text-white">{stats.totalData} <span className="text-sm font-bold text-white/40">GB</span></div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] space-y-2">
                    <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
                        Total Files
                    </div>
                    <div className="text-2xl font-black text-white">{stats.totalFiles}</div>
                </div>
                <div className="bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 p-6 rounded-[24px] space-y-2">
                    <div className="flex items-center gap-2 text-[#ff6b6b] text-[10px] font-black uppercase tracking-widest">
                        Sensitive
                    </div>
                    <div className="text-2xl font-black text-[#ff6b6b]">{stats.sensitiveFiles}</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] space-y-2">
                    <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
                        Shared
                    </div>
                    <div className="text-2xl font-black text-white">{stats.sharedFiles}</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] space-y-2">
                    <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
                        Violations
                    </div>
                    <div className="text-2xl font-black text-white">{stats.retentionViolations}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-6">
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <PieChart className="w-4 h-4" />
                        File Distribution
                    </h4>

                    <div className="space-y-4">
                        {filesByType.map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-white/70">{item.label}</span>
                                    <span className="text-white">{item.value}%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        className="h-full bg-[#1cd35c]"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-6">
                        <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            Scanned Repositories
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {repositories.map((repo: string, i: number) => (
                                <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white/70">
                                    {repo}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#1cd35c]/5 border border-[#1cd35c]/10 p-8 rounded-[40px] flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="text-xs font-black text-[#1cd35c] uppercase tracking-widest">Compliance Health</h4>
                            <p className="text-white/50 text-xs font-medium">Comparison with industry peer average</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-[#1cd35c]">{peerAverage}%</div>
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Peer Average</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RiskDashboardVisualizer: React.FC<{ data: RiskVisualData }> = ({ data }) => {
    if (!data || data.type !== 'risk_dashboard') return null;

    const { matrix, stats, riskDistribution, trend, register } = data;

    return (
        <div className="w-full space-y-12 py-8">
            {/* Executive Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] space-y-2 text-left">
                    <div className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        Total Risks
                    </div>
                    <div className="text-3xl font-black text-white">{stats.totalRisks}</div>
                </div>
                <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 p-6 rounded-[24px] space-y-2 text-left">
                    <div className="text-[#ef4444] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle className="w-3 h-3" />
                        Open Risks
                    </div>
                    <div className="text-3xl font-black text-[#ef4444]">{stats.highRisks}</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] space-y-2 text-left">
                    <div className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" />
                        Closed
                    </div>
                    <div className="text-3xl font-black text-white">{stats.closedRisks}</div>
                </div>
                <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 p-6 rounded-[24px] space-y-2 text-left">
                    <div className="text-[#f59e0b] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-3 h-3" />
                        Est. Impact
                    </div>
                    <div className="text-3xl font-black text-[#f59e0b]">{stats.financialImpact}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Risk Heatmap / Matrix */}
                <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] space-y-6">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4" />
                            Risk Matrix
                        </h4>
                        <span className="text-[10px] font-black text-[#1cd35c] uppercase tracking-widest bg-[#1cd35c]/10 px-3 py-1 rounded-full">Likelihood vs Impact</span>
                    </div>

                    <div className="relative aspect-square w-full max-w-[300px] mx-auto grid grid-cols-3 grid-rows-3 gap-1 border-l-2 border-b-2 border-white/10">
                        {/* Matrix Labels */}
                        <div className="absolute -left-12 top-1/2 -rotate-90 text-[10px] font-black text-white/30 uppercase tracking-widest text-left">Impact</div>
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-white/30 uppercase tracking-widest text-left">Likelihood</div>

                        {/* Rendering the Matrix Grid */}
                        {[3, 2, 1].map(y => (
                            [1, 2, 3].map(x => {
                                const activeRisk = matrix.find((risk: { probability: number; impact: number; label: string }) => risk.probability === x && risk.impact === y);
                                return (
                                    <div key={`${x}-${y}`} className="relative bg-white/5 rounded-md flex items-center justify-center">
                                        {activeRisk && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-12 h-12 rounded-full flex flex-col items-center justify-center text-[8px] font-black text-white shadow-2xl z-10"
                                                style={{ backgroundColor: activeRisk.label === 'Extreme' ? '#ef4444' : activeRisk.label === 'High' ? '#f59e0b' : activeRisk.label === 'Medium' ? '#3b82f6' : '#1cd35c' }}
                                            >
                                                <span>{activeRisk.label}</span>
                                                <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: activeRisk.label === 'Extreme' ? '#ef4444' : activeRisk.label === 'High' ? '#f59e0b' : activeRisk.label === 'Medium' ? '#3b82f6' : '#1cd35c' }} />
                                            </motion.div>
                                        )}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>

                {/* Risk Distribution & Monthly Trend */}
                <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-6">
                        <h4 className="text-xs font-black text-white/40 uppercase tracking-widest text-left">Risk Composition</h4>
                        <div className="space-y-4 text-left">
                            {riskDistribution.map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-white/50 w-16">{item.label}</span>
                                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.value}%` }}
                                            className="h-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-black text-white">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-6">
                        <div className="flex justify-between items-center text-left">
                            <h4 className="text-xs font-black text-white/40 uppercase tracking-widest">Monthly Trend</h4>
                            <TrendingUp className="w-4 h-4 text-[#1cd35c]" />
                        </div>
                        <div className="flex items-end justify-between h-24 pt-4 px-2">
                            {trend.map((d, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(d.value / 100) * 100}%` }}
                                        className="w-8 bg-[#1cd35c]/20 border-t-2 border-[#1cd35c] rounded-t-sm group-hover:bg-[#1cd35c]/40 transition-colors"
                                    />
                                    <span className="text-[8px] font-black text-white/30 uppercase">{d.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Register Table */}
            <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden text-left">
                <div className="p-8 border-b border-white/10 flex justify-between items-center">
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <PieChart className="w-4 h-4" />
                        Active Risk Register
                    </h4>
                    <span className="text-[10px] font-black text-white/30 italic">Target remediation: 30-90 days</span>
                </div>
                <div className="overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02]">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">Risk Identity</th>
                                <th className="px-8 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">Impact</th>
                                <th className="px-8 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">Rating</th>
                                <th className="px-8 py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {register.map((risk, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white group-hover:text-[#1cd35c] transition-colors">{risk.name}</span>
                                            <span className="text-[10px] text-white/30 font-medium">Likelihood: {risk.likelihood}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 text-white/50">
                                            {risk.impact}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: risk.rating === 'Extreme' ? '#ef4444' : risk.rating === 'High' ? '#f59e0b' : risk.rating === 'Medium' ? '#3b82f6' : '#1cd35c' }} />
                                            <span className="text-xs font-black text-white">{risk.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${risk.status === 'Open' ? 'bg-[#ef4444]' : 'bg-[#1cd35c]'}`} />
                                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{risk.status}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const VendorDashboardVisualizer: React.FC<{ data: VendorVisualData }> = ({ data }) => {
    if (!data || data.type !== 'vendor_dashboard') return null;

    const { riskDistribution, stats } = data;
    const vendors = data.vendors || riskDistribution.map(rd => ({ name: rd.label, risk: rd.label, tier: 'T3' }));

    return (
        <div className="w-full space-y-12 py-8">
            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] space-y-2 text-left">
                    <div className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        Monitored
                    </div>
                    <div className="text-3xl font-black text-white">{stats.total || stats.vendorCount}</div>
                </div>
                <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 p-6 rounded-[24px] space-y-2 text-left">
                    <div className="text-[#ef4444] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" />
                        High Risk
                    </div>
                    <div className="text-3xl font-black text-[#ef4444]">{stats.highRisk || stats.highRiskCount}</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] space-y-2 text-left">
                    <div className="text-[#1cd35c] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" />
                        Compliance
                    </div>
                    <div className="text-3xl font-black text-white">{stats.complianceRate}%</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[24px] space-y-2 text-left">
                    <div className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <PieChart className="w-3 h-3" />
                        Managed
                    </div>
                    <div className="text-3xl font-black text-white">{stats.pending || stats.managedCount}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Risk Distribution Card */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-6">
                    <div className="flex justify-between items-center mb-4 text-left">
                        <h4 className="text-xs font-black text-white/40 uppercase tracking-widest">Risk Posture</h4>
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Distribution</span>
                    </div>
                    <div className="space-y-4 text-left">
                        {vendors.map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-white/50 w-20">{item.name}</span>
                                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.risk === 'Extreme' ? 100 : item.risk === 'High' ? 70 : item.risk === 'Medium' ? 40 : 20}%` }}
                                        className="h-full"
                                        style={{ backgroundColor: item.risk === 'Extreme' ? '#ef4444' : item.risk === 'High' ? '#f59e0b' : item.risk === 'Medium' ? '#3b82f6' : '#1cd35c' }}
                                    />
                                </div>
                                <span className="text-[10px] font-black text-white">{item.risk}</span>
                            </div>
                        ))}
                    </div>
                    <div className="pt-8 flex flex-col items-center gap-2">
                        <div className="text-[#f59e0b] font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                            Exposure Trend
                            {stats.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : stats.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        </div>
                        <div className="text-white/30 text-[8px] font-medium uppercase tracking-tighter text-center">Based on recent event history</div>
                    </div>
                </div>

                {/* Heatmap Matrix Mini */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-6 text-left">
                    <div className="flex justify-between items-center text-left">
                        <h4 className="text-xs font-black text-white/40 uppercase tracking-widest">Business Impact Matrix</h4>
                        <div className="text-[#1cd35c]"><Zap className="w-4 h-4" /></div>
                    </div>
                    <div className="relative aspect-square w-full max-w-[200px] mx-auto grid grid-cols-3 grid-rows-3 gap-1 border-l-2 border-b-2 border-white/10">
                        {/* Matrix Labels */}
                        <div className="absolute -left-10 top-1/2 -rotate-90 text-[8px] font-black text-white/20 uppercase">Impact</div>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-black text-white/20 uppercase">Severity</div>

                        {[3, 2, 1].map(y => (
                            [1, 2, 3].map(x => {
                                const activeVendor = vendors.find(v => (v.tier === 'T1' && x === 3 && y === 3) || (v.tier === 'T2' && x === 2 && y === 2) || (v.tier === 'T3' && x === 1 && y === 1));
                                const isActive = activeVendor !== undefined;
                                const label = activeVendor?.risk || "Medium";
                                return (
                                    <div key={`${x}-${y}`} className="relative bg-white/[0.03] rounded-sm flex items-center justify-center">
                                        {isActive && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-[6px] font-black text-white shadow-2xl z-10"
                                                style={{ backgroundColor: label === 'Extreme' ? '#ef4444' : label === 'High' ? '#f59e0b' : label === 'Medium' ? '#3b82f6' : '#1cd35c' }}
                                            >
                                                {label}
                                            </motion.div>
                                        )}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                    <div className="pt-4 text-center">
                        <div className="text-lg font-black text-white">{stats.financialImpact}</div>
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Est. Weighted Risk Value</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DataFlowMapVisualizer: React.FC<{ data: DataFlowVisualData }> = ({ data }) => {
    if (!data || data.type !== 'data_flow_map') return null;

    const { steps, riskLevel, subjects, functions, outcomes, processing, external, confidence } = data;

    return (
        <div className="w-full space-y-8 py-8">
            <div className="bg-[#0f172a] border border-white/10 rounded-[40px] p-8 overflow-x-auto">
                <div className="min-w-[800px] flex items-center justify-between gap-4 relative">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-blue-500/20 via-[#1cd35c]/20 to-purple-500/20 -z-10" />

                    <div className="flex flex-col gap-4 w-48 shrink-0">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40 text-center mb-2">Data Subjects</h5>
                        {subjects.map((s, idx) => (
                            <div key={idx} className="bg-blue-500/10 border border-blue-500/20 px-4 py-3 rounded-xl text-[11px] font-bold text-blue-400 text-center shadow-lg shadow-blue-500/5 transition-all hover:scale-105">
                                {s}
                            </div>
                        ))}
                    </div>

                    <ChevronRight className="w-5 h-5 text-white/10 shrink-0" />

                    <div className="flex flex-col gap-4 w-48 shrink-0">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40 text-center mb-2">Entry Points</h5>
                        {steps.map((step, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 px-4 py-3 rounded-full text-[11px] font-bold text-white/80 text-center flex items-center justify-center gap-2 transition-all hover:bg-white/10">
                                {step.icon && <step.icon className="w-3 h-3 text-[#1cd35c]" />}
                                {step.label}
                            </div>
                        ))}
                    </div>

                    <ChevronRight className="w-5 h-5 text-white/10 shrink-0" />

                    <div className="flex flex-col gap-4 w-56 shrink-0">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40 text-center mb-2">Internal Processing</h5>
                        <div className="bg-[#1cd35c]/5 border border-[#1cd35c]/20 p-4 rounded-3xl space-y-4">
                            {functions.map((f, idx) => (
                                <div key={idx} className="text-[11px] font-black text-white p-2 border-b border-white/5 last:border-0 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1cd35c]" />
                                    {f}
                                </div>
                            ))}
                            {processing.map((p, idx) => (
                                <div key={idx} className="text-[10px] font-medium text-white/40 p-1 flex items-center gap-2 italic">
                                    {p}
                                </div>
                            ))}
                        </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-white/10 shrink-0" />

                    <div className="flex flex-col gap-4 w-48 shrink-0">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40 text-center mb-2">Outcomes</h5>
                        {outcomes.map((o, idx) => (
                            <div key={idx} className="bg-purple-500/10 border border-purple-500/20 px-4 py-3 rounded-xl text-[11px] font-bold text-purple-400 text-center shadow-lg shadow-purple-500/5 transition-all hover:scale-105">
                                {o}
                            </div>
                        ))}
                    </div>

                    {external.length > 0 && (
                        <>
                            <ChevronRight className="w-5 h-5 text-white/10 shrink-0" />
                            <div className="flex flex-col gap-4 w-48 shrink-0">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40 text-center mb-2">External Flows</h5>
                                {external.map((ext, idx) => (
                                    <div key={idx} className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl text-[11px] font-bold text-red-100/60 text-center flex items-center justify-center gap-2 transition-all hover:bg-red-500/20">
                                        <Shield className="w-3 h-3 text-red-400" />
                                        {ext}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${riskLevel === 'high' ? 'bg-[#ef4444]' : riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-[#1cd35c]'}`} />
                    <span className="text-xs font-bold text-white/60">Flow Confidence: <span className="text-white uppercase tracking-wider">{confidence}% ({riskLevel})</span></span>
                </div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    Operational Mapping Mode
                </div>
            </div>
        </div>
    );
};

const PolicyHealthVisualizer: React.FC<{ data: PolicyVisualData }> = ({ data }) => {
    if (!data || data.type !== 'policy_dashboard') return null;

    const { checklist, vagueAreas, regulatoryMatch, practiceAlignment, ownerStatus } = data;

    return (
        <div className="w-full space-y-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mandatory Elements Checklist */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#1cd35c]" />
                        Mandatory Disclosures
                    </h4>
                    <div className="space-y-3">
                        {checklist.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/5">
                                <span className="text-sm font-bold text-white/80">{item.label}</span>
                                <div className={`w-2 h-2 rounded-full ${item.status === 'green' ? 'bg-[#1cd35c] shadow-[0_0_8px_#1cd35c]' : 'bg-[#ef4444] shadow-[0_0_8px_#ef4444]'}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Alignment & Governance */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                        <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-400" />
                            Operational Alignment
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                                <div className="text-[10px] font-black text-white/30 uppercase mb-1">Practice</div>
                                <div className={`text-xs font-bold ${practiceAlignment === 'aligned' ? 'text-[#1cd35c]' : practiceAlignment === 'partial' ? 'text-yellow-500' : 'text-[#ef4444]'}`}>
                                    {practiceAlignment === 'aligned' ? 'Fully Aligned' : practiceAlignment === 'partial' ? 'Partially Aligned' : 'Not Aligned'}
                                </div>
                            </div>
                            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                                <div className="text-[10px] font-black text-white/30 uppercase mb-1">Governance</div>
                                <div className={`text-xs font-bold ${ownerStatus === 'yes' ? 'text-[#1cd35c]' : ownerStatus === 'informal' ? 'text-yellow-500' : 'text-[#ef4444]'}`}>
                                    {ownerStatus === 'yes' ? 'Defined Owner' : ownerStatus === 'informal' ? 'Informal' : 'No Owner'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {vagueAreas.length > 0 && (
                        <div className="bg-[#ef4444]/5 border border-[#ef4444]/10 rounded-[32px] p-8 space-y-4">
                            <h4 className="text-[10px] font-black text-[#ef4444] uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle className="w-3 h-3" />
                                Vague / Broad Language Detected
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {vagueAreas.map((area, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg text-[10px] font-bold text-[#ef4444] uppercase">
                                        {area}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-[32px] p-8 flex items-center justify-between">
                        <div>
                            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Regulatory Radar</h4>
                            <div className="text-white text-xs font-bold uppercase tracking-wider">{regulatoryMatch} Mapping</div>
                        </div>
                        <Globe className="w-6 h-6 text-blue-400 opacity-50" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const IncidentReadinessVisualizer: React.FC<{ data: IncidentVisualData }> = ({ data }) => {
    if (!data || data.type !== 'incident_dashboard') return null;

    const { stats, indicators, categoryData, unresolvedPressure } = data;

    return (
        <div className="w-full space-y-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Metric Cards */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                    <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">New Incidents</div>
                    <div className="flex items-end gap-2 text-3xl font-bold text-white">
                        {stats.newIncidents}
                        {stats.trend !== 'flat' && (
                            <span className={`text-sm mb-1 ${stats.trend === 'up' ? 'text-[#ef4444]' : 'text-[#1cd35c]'}`}>
                                {stats.trend === 'up' ? '▲' : '▼'}
                            </span>
                        )}
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                    <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Avg Resolution</div>
                    <div className="text-3xl font-bold text-blue-400">{stats.avgResolution}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                    <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Efficiency</div>
                    <div className="text-3xl font-bold text-[#1cd35c]">{stats.efficiencyPercentage}%</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                    <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Open Pressure</div>
                    <div className={`text-3xl font-bold uppercase ${unresolvedPressure === 'high' ? 'text-[#ef4444]' : unresolvedPressure === 'medium' ? 'text-yellow-500' : 'text-blue-400'}`}>
                        {unresolvedPressure}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Readiness Indicators */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        Readiness signals
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        {indicators.map((ind: RiskIndicator) => (
                            <div key={ind.label} className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-between">
                                <span className="text-xs font-bold text-white/80">{ind.label}</span>
                                <div className={`w-3 h-3 rounded-full ${ind.status === 'green' ? 'bg-[#1cd35c] shadow-[0_0_8px_#1cd35c]' :
                                    ind.status === 'yellow' ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' :
                                        'bg-[#ef4444] shadow-[0_0_8px_#ef4444]'
                                    }`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories Bar Chart */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                        Incidents by Category
                    </h4>
                    <div className="space-y-4">
                        {categoryData.length > 0 ? categoryData.map((cat: CategoryDataPoint) => (
                            <div key={cat.label} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-white/60">
                                    <span>{cat.label}</span>
                                    <span>{cat.value}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500/50"
                                        style={{ width: `${cat.value}%` }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex items-center justify-center text-white/20 italic text-sm py-8">
                                No specific categories selected
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AccountabilityVisualizer: React.FC<{ data: RaciVisualData }> = ({ data }) => {
    if (!data || data.type !== 'raci_dashboard') return null;

    const { matrix, roles, stats } = data;

    const getMarkerColor = (marker: string) => {
        if (marker.includes('A')) return 'text-red-400 bg-red-400/10 border-red-400/20';
        if (marker.includes('R')) return 'text-[#1cd35c] bg-[#1cd35c]/10 border-[#1cd35c]/20';
        if (marker.includes('C')) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        if (marker.includes('I')) return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
        return 'text-white/10';
    };

    return (
        <div className="w-full space-y-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                    <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Decision Owner</div>
                    <div className="text-3xl font-bold text-white">{stats.accountableRole}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                    <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Unassigned Tasks</div>
                    <div className={`text-3xl font-bold ${stats.unassignedTasks > 0 ? 'text-[#ef4444]' : 'text-[#1cd35c]'}`}>
                        {stats.unassignedTasks}
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-2">
                    <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Governance Maturity</div>
                    <div className={`text-3xl font-bold uppercase ${stats.confidenceLevel === 'high' ? 'text-[#1cd35c]' :
                        stats.confidenceLevel === 'med' ? 'text-yellow-500' :
                            'text-[#ef4444]'
                        }`}>
                        {stats.confidenceLevel === 'high' ? 'High' : stats.confidenceLevel === 'med' ? 'Medium' : 'Low'}
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
                <div className="p-8 border-b border-white/10">
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        Governance RACI Matrix
                    </h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02]">
                                <th className="p-6 text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/5 min-w-[200px]">Activity / Responsibility</th>
                                {roles.map((role) => (
                                    <th key={role.key} className="p-6 text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/5 text-center">
                                        {role.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {matrix.map((row, idx) => (
                                <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 text-sm font-bold text-white/80">{row.task}</td>
                                    {roles.map((role) => {
                                        const marker = (row as Record<string, string>)[role.key];
                                        return (
                                            <td key={role.key} className="p-6 text-center">
                                                {marker ? (
                                                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-black ${getMarkerColor(marker)}`}>
                                                        {marker}
                                                    </div>
                                                ) : (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/5 mx-auto" />
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-blue-500/5 border-t border-white/5 flex flex-wrap gap-6 justify-center">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
                        <span className="w-2 h-2 rounded-full bg-[#1cd35c]" /> R = Responsible
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
                        <span className="w-2 h-2 rounded-full bg-[#ef4444]" /> A = Accountable
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
                        <span className="w-2 h-2 rounded-full bg-blue-400" /> C = Consulted
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
                        <span className="w-2 h-2 rounded-full bg-purple-400" /> I = Informed
                    </div>
                </div>
            </div>
        </div>
    );
};



interface ToolExperienceProps {
    tool: ToolConfig;
    onClose: () => void;
}

// Main Component
const ToolExperience: React.FC<ToolExperienceProps> = ({ tool, onClose }) => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Answers>({});
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState<ToolResult | null>(null);

    const currentQuestion = tool.questions[currentStep];
    const progress = ((currentStep + 1) / tool.questions.length) * 100;

    const handleOptionClick = (value: string | number) => {
        const isMultiselect = currentQuestion.type === "multiselect";

        if (isMultiselect) {
            const currentSelections = (answers[currentQuestion.id] as (string | number)[]) || [];
            const newSelections = currentSelections.includes(value)
                ? currentSelections.filter(v => v !== value)
                : [...currentSelections, value];

            setAnswers({ ...answers, [currentQuestion.id]: newSelections });
        } else {
            const newAnswers = { ...answers, [currentQuestion.id]: value };
            setAnswers(newAnswers);
            // Auto-advance for single select
            setTimeout(() => handleNext(newAnswers), 300);
        }
    };

    const handleNext = (currentAnswers: Answers = answers) => {
        if (currentStep < tool.questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            const finalResult = tool.calculateResult(currentAnswers);
            setResult(finalResult);
            setShowResult(true);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`relative bg-gray-900 border border-white/10 w-full ${showResult ? 'max-w-6xl' : 'max-w-2xl'} rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-500`}
            >
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-[#1cd35c]/10 rounded-xl">
                            <tool.icon className="w-6 h-6 text-[#1cd35c]" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold leading-tight">{tool.name}</h3>
                            {!showResult && (
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-[#1cd35c]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">
                                        Step {currentStep + 1} of {tool.questions.length}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 text-white/30 hover:text-white transition-colors hover:bg-white/5 rounded-2xl"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className={`flex-1 overflow-y-auto ${showResult ? 'p-0' : 'p-10'} custom-scrollbar`}>
                    <AnimatePresence mode="wait">
                        {!showResult ? (
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <span className="text-[#1cd35c] text-xs font-black uppercase tracking-widest">Question</span>
                                    <h2 className="text-2xl font-bold text-white leading-tight">
                                        {currentQuestion.text}
                                    </h2>
                                    {currentQuestion.type === "multiselect" && (
                                        <p className="text-white/30 text-xs italic">Select all that apply</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {currentQuestion.options.map((option: ToolQuestion['options'][0]) => {
                                        const isSelected = currentQuestion.type === "multiselect"
                                            ? (answers[currentQuestion.id] as unknown[])?.includes(option.value)
                                            : answers[currentQuestion.id] === option.value;

                                        return (
                                            <button
                                                key={option.label}
                                                onClick={() => handleOptionClick(option.value)}
                                                className={`p-5 rounded-2xl text-left transition-all border-2 flex items-center justify-between group ${isSelected
                                                    ? "bg-[#1cd35c]/10 border-[#1cd35c] text-white"
                                                    : "bg-white/5 border-transparent hover:bg-white/[0.08] text-white/60"
                                                    }`}
                                            >
                                                <span className="font-bold">{option.label}</span>
                                                {isSelected ? (
                                                    <CheckCircle2 className="w-5 h-5 text-[#1cd35c]" />
                                                ) : (
                                                    <div className={`w-5 h-5 rounded-full border-2 border-white/10 group-hover:border-[#1cd35c]/30`} />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`result-${tool.id}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-10"
                            >
                                {(!['dpdp_enterprise', 'sensitive_assessment', 'operational_risk_dashboard', 'vendor_intelligence_dashboard', 'data_mapping_dashboard', 'policy_health_dashboard', 'incident_readiness_dashboard', 'accountability_dashboard', 'transfer_dashboard'].includes(result?.visualData?.type as string)) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/[0.02] p-8 rounded-[40px] border border-white/5">
                                        <div className="flex justify-center">
                                            <ScoreGauge score={result?.numericScore || 50} />
                                        </div>
                                        <div className="text-center md:text-left space-y-4">
                                            <h2 className="text-3xl font-black text-white">Diagnostic Complete</h2>
                                            <p className="text-white/40 text-sm font-medium leading-relaxed">
                                                We've analyzed your responses and identified significant structural risks in your current posture.
                                            </p>
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest">
                                                    Status: {result?.score}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* NEW: Secondary Visualizer (Dynamic) */}
                                {result?.visualData?.type === 'sensitive_assessment' && (
                                    <SensitiveAssessmentDashboard data={result.visualData as unknown as SensitiveAssessmentVisualData} numericScore={result.numericScore || 0} />
                                )}
                                {result?.visualData?.type === 'incident_readiness_dashboard' && (
                                    <IncidentReadinessDashboard data={result.visualData as unknown as IncidentReadinessVisualData} numericScore={result.numericScore || 0} />
                                )}
                                {result?.visualData?.type === 'accountability_dashboard' && (
                                    <AccountabilityDashboard data={result.visualData as unknown as AccountabilityVisualData} numericScore={result.numericScore || 0} />
                                )}
                                {result?.visualData?.type === 'transfer_dashboard' && (
                                    <TransferDashboard data={result.visualData as unknown as TransferVisualData} numericScore={result.numericScore || 0} />
                                )}
                                {result?.visualData?.type === 'dpdp_enterprise' && (
                                    <DpdpEnterpriseDashboard data={result.visualData as unknown as DpdpEnterpriseVisualData} numericScore={result.numericScore || 0} />
                                )}
                                {result?.visualData?.type === 'operational_risk_dashboard' && (
                                    <OperationalRiskDashboard data={result.visualData as unknown as OperationalRiskVisualData} numericScore={result.numericScore || 0} />
                                )}
                                {result?.visualData?.type === 'vendor_intelligence_dashboard' && (
                                    <VendorIntelligenceDashboard data={result.visualData as unknown as VendorIntelligenceVisualData} numericScore={result.numericScore || 0} />
                                )}
                                {result?.visualData?.type === 'data_mapping_dashboard' && (
                                    <DataMappingDashboard data={result.visualData as unknown as DataMappingVisualData} numericScore={result.numericScore || 0} />
                                )}
                                {result?.visualData?.type === 'policy_health_dashboard' && (
                                    <PolicyHealthDashboard data={result.visualData as unknown as PolicyHealthVisualData} numericScore={result.numericScore || 0} />
                                )}
                                {result?.visualData?.type === 'dpdp_dashboard' && (
                                    <DpdpDashboardVisualizer data={result.visualData as unknown as DpdpVisualData} />
                                )}
                                {result?.visualData?.type === 'flow' && (
                                    <DataFlowVisualizer data={result.visualData as unknown as FlowVisualData} />
                                )}
                                {result?.visualData?.type === 'map' && (
                                    <RegulatoryMapVisualizer data={result.visualData as unknown as MapVisualData} />
                                )}
                                {result?.visualData?.type === 'scanner_dashboard' && (
                                    <ScannerDashboardVisualizer data={result.visualData as unknown as ScannerVisualData} />
                                )}
                                {result?.visualData?.type === 'risk_dashboard' && (
                                    <RiskDashboardVisualizer data={result.visualData as unknown as RiskVisualData} />
                                )}
                                {result?.visualData?.type === 'vendor_dashboard' && (
                                    <VendorDashboardVisualizer data={result.visualData as unknown as VendorVisualData} />
                                )}
                                {result?.visualData?.type === 'data_flow_map' && (
                                    <DataFlowMapVisualizer data={result.visualData as unknown as DataFlowVisualData} />
                                )}
                                {result?.visualData?.type === "policy_dashboard" && (
                                    <PolicyHealthVisualizer data={result.visualData as unknown as PolicyVisualData} />
                                )}
                                {result?.visualData?.type === "incident_dashboard" && (
                                    <IncidentReadinessVisualizer data={result.visualData as unknown as IncidentVisualData} />
                                )}
                                {result?.visualData?.type === "raci_dashboard" && (
                                    <AccountabilityVisualizer data={result.visualData as unknown as RaciVisualData} />
                                )}


                                <div className="grid grid-cols-1 gap-6">
                                    <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                                        <h4 className="flex items-center gap-2 text-[#1cd35c] font-black text-xs uppercase tracking-widest">
                                            <Zap className="w-4 h-4" />
                                            Interpretation
                                        </h4>
                                        <p className="text-white text-lg font-medium leading-relaxed">
                                            {result?.interpretation}
                                        </p>
                                        <p className="text-white/40 text-sm leading-relaxed italic">
                                            “{result?.whatItMeans}”
                                        </p>
                                    </div>

                                    <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl space-y-6">
                                        <h4 className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest">
                                            <AlertCircle className="w-4 h-4" />
                                            Identified Blind Spots
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {result?.gaps.map((gap, i) => (
                                                <div key={i} className="flex gap-3 bg-white/[0.03] p-4 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-colors">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                                    <span className="text-white/70 text-xs font-bold leading-relaxed">{gap}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-10 bg-[#1cd35c]/5 border border-[#1cd35c]/20 rounded-[40px] space-y-6 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Shield className="w-32 h-32 text-[#1cd35c]" />
                                        </div>
                                        <div className="relative z-10">
                                            <h4 className="text-white text-xl font-bold mb-3">Build Defensible Compliance</h4>
                                            <p className="text-white/50 text-base leading-relaxed mb-8 italic max-w-lg">
                                                “{result?.bridge}”
                                            </p>
                                            <button
                                                onClick={() => navigate('/solutions')}
                                                className="px-8 py-4 bg-[#1cd35c] text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#19b850] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#1cd35c]/20"
                                            >
                                                Explore Proteccio Platform
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    {!showResult ? (
                        <>
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className="px-6 py-3 text-white/30 hover:text-white disabled:opacity-0 transition-all flex items-center gap-2 font-bold"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Back
                            </button>

                            {currentQuestion.type === "multiselect" ? (
                                <button
                                    onClick={() => handleNext()}
                                    className="px-8 py-3 bg-[#1cd35c] text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#1cd35c]/20"
                                >
                                    Continue
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <div className="text-white/20 text-xs font-bold uppercase tracking-widest">
                                    Diagnostic in progress...
                                </div>
                            )}
                        </>
                    ) : null}
                </div>
            </motion.div>
        </div>
    );
};

export default ToolExperience;
