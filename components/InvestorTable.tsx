
import React, { useMemo } from 'react';
import { Investor } from '../types';
import { calculateIDBF } from '../utils/scoring';
import { Sankey, Tooltip, ResponsiveContainer, Layer, Rectangle } from 'recharts';

interface Props {
  investors: Investor[];
  institutionalPct: number;
  retailPct: number;
  insiderPct: number;
}

const FAMILY_COLORS: Record<string, string> = {
  'Passive Giants': '#6366f1', // Indigo
  'Active Funds': '#3b82f6',   // Blue
  'Sovereign': '#10b981',      // Emerald
  'Insiders': '#f43f5e',       // Rose
  'Strategic/Industrial': '#f59e0b', // Amber
  'Retail': '#8b5cf6',         // Violet
  'Internal Fund': '#a855f7',
  'Family Control': '#e11d48'
};

const DEFAULT_COLOR = '#64748b'; // Slate

export const InvestorTable: React.FC<Props> = ({ investors, institutionalPct, retailPct, insiderPct }) => {
  const { dominantFamily, idbfScore } = calculateIDBF(investors);

  // PREPARE SANKEY DATA
  const { nodes, links } = useMemo(() => {
    // 1. Extract unique families (Sources)
    const families = Array.from(new Set(investors.map(i => i.family)));
    
    // Nodes: First families, then investors
    const nodesList = [
        ...families.map(f => ({ name: f, type: 'family' })),
        ...investors.map(i => ({ name: i.name, type: 'investor' }))
    ];

    const linksList: any[] = [];

    investors.forEach((inv, idx) => {
        const familyIndex = families.indexOf(inv.family);
        const investorIndex = families.length + idx;
        
        linksList.push({
            source: familyIndex,
            target: investorIndex,
            value: inv.percent,
            family: inv.family // Pass for coloring
        });
    });

    return { nodes: nodesList, links: linksList };
  }, [investors]);

  // CUSTOM NODES
  const renderNode = (props: any) => {
    const { x, y, width, height, index, payload } = props;
    // Check if payload exists to avoid errors
    if (!payload || !payload.name) return null;
    
    const isFamily = payload.type === 'family';
    const color = FAMILY_COLORS[payload.name] || (payload.type === 'family' ? DEFAULT_COLOR : '#334155');

    return (
      <Layer key={`node-${index}`}>
        <Rectangle
          x={x} y={y} width={width} height={height}
          fill={color}
          fillOpacity={1}
          radius={[4, 4, 4, 4]} // Rounded corners
        />
        {/* Text Label */}
        <text
          x={isFamily ? x - 6 : x + width + 6}
          y={y + height / 2}
          textAnchor={isFamily ? 'end' : 'start'}
          fill={isFamily ? '#cbd5e1' : '#94a3b8'} // Lighter for families
          fontSize={10}
          fontWeight={isFamily ? 700 : 500}
          dy={3}
          style={{ pointerEvents: 'none' }}
        >
          {payload.name.length > 15 && !isFamily ? payload.name.substring(0, 12) + '...' : payload.name}
        </text>
      </Layer>
    );
  };

  // CUSTOM LINKS
  const renderLink = (props: any) => {
    const { sourceX, sourceY, targetX, targetY, sourceControlX, targetControlX, linkWidth, payload } = props;
    // Check payload
    if (!payload) return null;
    
    const color = FAMILY_COLORS[payload.family] || DEFAULT_COLOR;

    return (
      <path
        d={`
          M${sourceX},${sourceY}
          C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
          L${targetX},${targetY + linkWidth}
          C${targetControlX},${targetY + linkWidth} ${sourceControlX},${sourceY + linkWidth} ${sourceX},${sourceY + linkWidth}
          Z
        `}
        fill={color}
        fillOpacity={0.2} // Translucent streams
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.4}
        style={{ transition: 'all 0.3s' }}
        className="hover:fill-opacity-50 hover:stroke-opacity-80"
      />
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Chart Section - Capital Flow */}
      <div className="col-span-1 bg-[#1c202e]/60 backdrop-blur-md rounded-[2rem] p-6 border border-white/5 flex flex-col shadow-xl h-[500px] lg:h-auto">
         <div className="flex flex-col items-center mb-4">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Flux de Capitaux (Sankey)</h3>
             <div className="text-[10px] text-slate-500 font-medium mt-1">Familles → Gestionnaires</div>
         </div>
         
         <div className="flex-1 w-full min-h-0 relative -ml-2">
            <ResponsiveContainer width="110%" height="100%">
              <Sankey
                data={{ nodes, links }}
                node={renderNode}
                link={renderLink}
                nodePadding={20}
                margin={{ left: 10, right: 80, top: 10, bottom: 10 }} // Right margin for labels
                linkCurvature={0.6}
              >
                <Tooltip 
                    content={({ payload }) => {
                        if (!payload || !payload.length) return null;
                        const data = payload[0];
                        
                        // Handle Link Hover: payload.source and payload.target should be Objects with name
                        if (data.payload?.source?.name && data.payload?.target?.name) {
                            return (
                                <div className="bg-[#0f172a] border border-white/10 p-3 rounded-xl shadow-xl text-xs">
                                    <div className="font-bold text-slate-300">Flux de Capital</div>
                                    <div className="text-white font-mono mt-1">
                                        {data.payload.source.name} → {data.payload.target.name}
                                    </div>
                                    <div className="text-emerald-400 font-bold mt-1">
                                        {data.value ? Number(data.value).toFixed(2) : 0}%
                                    </div>
                                </div>
                            )
                        }

                        // Handle Node Hover
                        if (data.payload?.name) {
                            return (
                                <div className="bg-[#0f172a] border border-white/10 p-3 rounded-xl shadow-xl text-xs">
                                    <div className="font-bold text-slate-300">{data.payload.name}</div>
                                    {data.payload.type && <div className="text-slate-500 capitalize mt-1">{data.payload.type}</div>}
                                </div>
                            )
                        }

                        return null; 
                    }}
                />
              </Sankey>
            </ResponsiveContainer>
         </div>
         
         <div className="mt-4 pt-4 border-t border-white/5 w-full text-center">
             <div className="flex justify-between items-center px-2">
                <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Intensité IDBF</span>
                    <span className="text-2xl font-black text-white tracking-tighter">{(idbfScore * 100).toFixed(0)}%</span>
                </div>
                <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Dominance</div>
                    <div className="inline-block bg-indigo-500/10 border border-indigo-500/20 rounded-md px-2 py-0.5">
                        <span className="text-xs font-bold text-indigo-400">{dominantFamily}</span>
                    </div>
                </div>
             </div>
         </div>
      </div>

      {/* List Section */}
      <div className="col-span-1 lg:col-span-2 bg-[#1c202e]/60 backdrop-blur-md rounded-[2rem] border border-white/5 overflow-hidden shadow-xl flex flex-col h-full min-h-[500px]">
        <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02]">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Actionnaires & Familles</h3>
             <div className="flex gap-4 text-xs font-medium bg-black/20 px-4 py-2 rounded-full border border-white/5">
                <span className="text-slate-400">Inst: <span className="text-white font-bold">{institutionalPct}%</span></span>
                <span className="text-slate-400">Retail: <span className="text-white font-bold">{retailPct}%</span></span>
                <span className="text-slate-400">Insiders: <span className="text-white font-bold">{insiderPct}%</span></span>
             </div>
        </div>
        <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="text-[10px] text-slate-500 uppercase bg-white/[0.02] sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                        <th className="px-8 py-4 font-bold tracking-wider">Investisseur</th>
                        <th className="px-6 py-4 font-bold tracking-wider">Famille</th>
                        <th className="px-8 py-4 font-bold tracking-wider text-right">% Détenu</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {investors.map((inv, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.03] transition-colors group">
                            <td className="px-8 py-4 font-semibold text-slate-200 group-hover:text-white transition-colors">{inv.name}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                                    ${inv.family === 'Passive Giants' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                                      inv.family === 'Active Funds' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                                      inv.family === 'Sovereign' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                      'bg-slate-700/30 text-slate-400 border border-slate-600/30'}`}>
                                    {inv.family}
                                </span>
                            </td>
                            <td className="px-8 py-4 text-right font-mono font-bold text-slate-300 group-hover:text-white">{inv.percent.toFixed(1)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
