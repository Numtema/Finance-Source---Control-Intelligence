
import React, { useMemo, useState } from 'react';
import { CompanyData } from '../types';
import { Globe, Navigation } from 'lucide-react';

interface Props {
  data: CompanyData;
}

// Simplified Mercator Projection Logic
const PROJECT_W = 800;
const PROJECT_H = 400;

const latLngToXY = (lat: number, lng: number) => {
  // Basic Mercator-like projection fitting in box
  const x = (lng + 180) * (PROJECT_W / 360);
  const latRad = lat * Math.PI / 180;
  const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
  const y = (PROJECT_H / 2) - (PROJECT_W * mercN / (2 * Math.PI));
  // Clamp Y to avoid poles going infinite
  const clampedY = Math.max(0, Math.min(PROJECT_H, y));
  return { x, y: clampedY };
};

// Simplified World Path (Low Poly) to avoid external massive dependencies
const WORLD_PATH = "M150,50 L250,50 L270,120 L350,100 L400,150 L380,250 L450,300 L550,280 L600,200 L650,220 L750,150 L780,350 L600,380 L500,350 L400,380 L200,350 L100,250 L50,150 Z"; 
// Note: The above path is a dummy placeholder. For a real app, I'd paste a proper SVG path string for continents.
// Since I can't paste 100KB of SVG path here, I'll use a stylistic "Dot Matrix" background instead which is cooler for "War Room".

export const GeoMap: React.FC<Props> = ({ data }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const hq = data.profile.geo;
  const investors = data.ownership.top_holders.filter(i => i.geo);

  // Project points
  const hqPoint = useMemo(() => latLngToXY(hq.lat, hq.lng), [hq]);
  const investorPoints = useMemo(() => {
    return investors.map(inv => ({
        ...inv,
        point: latLngToXY(inv.geo!.lat, inv.geo!.lng)
    }));
  }, [investors]);

  // Generate Dot Matrix Background
  const gridPoints = useMemo(() => {
    const points = [];
    for(let i=0; i<40; i++) {
        for(let j=0; j<20; j++) {
            points.push({ x: i * 20 + 10, y: j * 20 + 10 });
        }
    }
    return points;
  }, []);

  return (
    <div className="bg-[#1c202e]/60 backdrop-blur-md rounded-[2rem] border border-white/5 p-6 shadow-xl h-[400px] relative overflow-hidden flex flex-col">
       <div className="absolute top-0 right-0 p-6 z-10">
            <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/5 backdrop-blur-sm">
                <Globe size={14} className="text-emerald-400" />
                <span className="text-[10px] font-bold text-slate-300 uppercase">Geopolitics Map</span>
            </div>
       </div>

       <div className="relative flex-1 w-full bg-[#0b0d12]/50 rounded-xl overflow-hidden border border-white/5 mt-4">
            {/* SVG Layer */}
            <svg viewBox={`0 0 ${PROJECT_W} ${PROJECT_H}`} className="w-full h-full preserve-3d">
                <defs>
                    <radialGradient id="hqGlow" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                    </radialGradient>
                    <radialGradient id="invGlow" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                    </radialGradient>
                </defs>

                {/* 1. Dot Matrix Map Background */}
                {gridPoints.map((p, i) => {
                     // Simple opacity mask to simulate continents (very rough approximation for visual effect)
                     // In real app, use a real geojson mask
                     const isRoughContinent = (p.y > 50 && p.y < 350) && (p.x > 50 && p.x < 750); 
                     return (
                        <circle 
                            key={i} 
                            cx={p.x} cy={p.y} 
                            r={isRoughContinent ? 1.5 : 0.5} 
                            fill={isRoughContinent ? "#334155" : "#1e293b"} 
                            opacity={0.5}
                        />
                     )
                })}

                {/* 2. Connection Lines */}
                {investorPoints.map((inv, i) => (
                    <line 
                        key={`line-${i}`}
                        x1={inv.point.x} y1={inv.point.y}
                        x2={hqPoint.x} y2={hqPoint.y}
                        stroke={inv.family === 'Sovereign' ? '#10b981' : inv.family === 'Passive Giants' ? '#6366f1' : '#475569'}
                        strokeWidth={Math.max(0.5, inv.percent / 2)}
                        strokeOpacity={0.4}
                        strokeDasharray={inv.family === 'Sovereign' ? "4 2" : "none"}
                    >
                         <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
                    </line>
                ))}

                {/* 3. Investor Points */}
                {investorPoints.map((inv, i) => (
                    <g key={`inv-${i}`} 
                       onMouseEnter={() => setHovered(inv.name)}
                       onMouseLeave={() => setHovered(null)}
                       style={{ cursor: 'pointer' }}
                    >
                        <circle cx={inv.point.x} cy={inv.point.y} r={4 + (inv.percent/2)} fill={inv.family === 'Sovereign' ? '#10b981' : '#6366f1'} opacity={0.8} />
                        <circle cx={inv.point.x} cy={inv.point.y} r={10 + (inv.percent)} fill={`url(#invGlow)`} opacity={0.4} />
                        
                        {/* Label on Hover */}
                        {(hovered === inv.name || inv.percent > 5) && (
                            <text x={inv.point.x} y={inv.point.y - 12} fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" style={{textShadow: '0 2px 4px black'}}>
                                {inv.name}
                            </text>
                        )}
                    </g>
                ))}

                {/* 4. HQ Point */}
                <g>
                    <circle cx={hqPoint.x} cy={hqPoint.y} r={8} fill="#3b82f6" />
                    <circle cx={hqPoint.x} cy={hqPoint.y} r={20} fill="url(#hqGlow)" />
                    <circle cx={hqPoint.x} cy={hqPoint.y} r={35} fill="none" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3">
                         <animate attributeName="r" values="20;40" dur="2s" repeatCount="indefinite" />
                         <animate attributeName="opacity" values="0.5;0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x={hqPoint.x} y={hqPoint.y + 20} fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" style={{textShadow: '0 2px 4px black'}}>
                        {data.company.ticker} HQ
                    </text>
                </g>
            </svg>
       </div>
       
       <div className="flex justify-between items-center mt-4 px-2">
            <div className="flex gap-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
                    <span className="text-[10px] text-slate-400">Siège Social</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></span>
                    <span className="text-[10px] text-slate-400">Capital US/EU</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                    <span className="text-[10px] text-slate-400">Sovereign / Foreign</span>
                </div>
            </div>
       </div>
    </div>
  );
};
