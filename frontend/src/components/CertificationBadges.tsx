const CertificationBadges = () => {
    return (
        <div className="flex items-center gap-5 mt-10">
            {/* ISO 27001 Badge */}
            <a
                href="/iso27001-certificate.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group w-22 h-22 md:w-28 md:h-28 transition-transform duration-300 hover:scale-110 cursor-pointer block"
                title="View ISO 27001 Certificate"
            >
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_10px_25px_rgba(30,58,138,0.4)]">
                    <defs>
                        {/* Top path: Clockwise arc for the title */}
                        <path id="isoTopPath" d="M 40,100 A 60,60 0 0 1 160,100" />
                        {/* Bottom path: Clockwise arc for 'Certified' - text will be upright if we handle it right */}
                        <path id="isoBottomPath" d="M 160,100 A 60,60 0 0 1 40,100" />

                        <linearGradient id="isoBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#1e3a8a" />
                        </linearGradient>
                    </defs>

                    {/* Outer translucent ring */}
                    <circle cx="100" cy="100" r="90" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.2" />

                    {/* Main Circle */}
                    <circle cx="100" cy="100" r="80" fill="url(#isoBlueGrad)" />

                    {/* Text Area Ring (subtle divider) */}
                    <circle cx="100" cy="100" r="62" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />

                    {/* Top Text: Information Security Management */}
                    <text className="text-[11px] font-bold fill-white/90 uppercase tracking-[0.05em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <textPath href="#isoTopPath" startOffset="50%" textAnchor="middle">
                            Information Security Management
                        </textPath>
                    </text>

                    {/* Bottom Text: Certified */}
                    <text className="text-[14px] font-black fill-white uppercase tracking-[0.2em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <textPath href="#isoBottomPath" startOffset="50%" textAnchor="middle">
                            Certified
                        </textPath>
                    </text>

                    {/* Center Content */}
                    <g transform="translate(100, 100)">
                        <text y="-8" textAnchor="middle" className="text-4xl font-black fill-white tracking-tighter">ISO</text>
                        <text y="22" textAnchor="middle" className="text-2xl font-bold fill-white">27001</text>

                        {/* Globe Icon Grid */}
                        <circle r="35" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
                        <ellipse cx="0" cy="0" rx="35" ry="12" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
                        <ellipse cx="0" cy="0" rx="12" ry="35" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
                    </g>
                </svg>
            </a>

            {/* ISO 27701 Badge */}
            <a
                href="/iso27701-certificate.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group w-22 h-22 md:w-28 md:h-28 transition-transform duration-300 hover:scale-110 cursor-pointer block"
                title="View ISO 27701 Certificate"
            >
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_10px_25px_rgba(28,211,92,0.3)]">
                    <defs>
                        <path id="isoTopPath2" d="M 40,100 A 60,60 0 0 1 160,100" />
                        <path id="isoBottomPath2" d="M 160,100 A 60,60 0 0 1 40,100" />

                        <linearGradient id="isoTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1cd35c" />
                            <stop offset="100%" stopColor="#065f46" />
                        </linearGradient>
                    </defs>

                    {/* Outer translucent ring */}
                    <circle cx="100" cy="100" r="90" fill="none" stroke="#1cd35c" strokeWidth="1" opacity="0.2" />

                    {/* Main Circle */}
                    <circle cx="100" cy="100" r="80" fill="url(#isoTealGrad)" />

                    {/* Text Area Ring */}
                    <circle cx="100" cy="100" r="62" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />

                    {/* Top Text: Privacy Information Management */}
                    <text className="text-[11px] font-bold fill-white/90 uppercase tracking-[0.05em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <textPath href="#isoTopPath2" startOffset="50%" textAnchor="middle">
                            Privacy Information Management
                        </textPath>
                    </text>

                    {/* Bottom Text: Certified */}
                    <text className="text-[14px] font-black fill-white uppercase tracking-[0.2em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <textPath href="#isoBottomPath2" startOffset="50%" textAnchor="middle">
                            Certified
                        </textPath>
                    </text>

                    {/* Center Content */}
                    <g transform="translate(100, 100)">
                        <text y="-8" textAnchor="middle" className="text-4xl font-black fill-white tracking-tighter">ISO</text>
                        <text y="22" textAnchor="middle" className="text-2xl font-bold fill-white">27701</text>

                        {/* Globe Icon Grid */}
                        <circle r="35" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
                        <ellipse cx="0" cy="0" rx="35" ry="12" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
                        <ellipse cx="0" cy="0" rx="12" ry="35" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
                    </g>
                </svg>
            </a>
        </div>
    );
};

export default CertificationBadges;
