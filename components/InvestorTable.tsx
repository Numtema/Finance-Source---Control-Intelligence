
import React from 'react';
import { Investor } from '../types';
import { calculateIDBF } from '../utils/scoring';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  investors: Investor[];
  institutionalPct: number;
  retailPct: number;
  insiderPct: number;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

export const InvestorTable: React.FC<Props> = ({ investors, institutionalPct, retailPct, insiderPct }) => {
  const { dominantFamily, idbfScore, familyStrengths } = calculateIDBF(investors);
  
  const familyData = Object.entries(familyStrengths).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Chart Section */}
      <div className="col-span-1 bg-[#1c202e]/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/5 flex flex-col items-center shadow-xl">
         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 w-full text-center">Dominance Structurelle (IDBF)</h3>
         
         <div className="h-56 w-full relative min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={familyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {familyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#f8fafc', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Centered Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-white tracking-tighter">{(idbfScore * 100).toFixed(0)}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">Intensité</span>
            </div>
         </div>
         
         <div className="mt-6 w-full text-center">
            <div className="inline-block bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-3">
                <span className="text-sm font-bold text-indigo-400">{dominantFamily}</span>
            </div>
             <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[80%] mx-auto">
                Les {dominantFamily} représentent la force gravitationnelle majeure du capital.
             </p>
         </div>
      </div>

      {/* List Section */}
      <div className="col-span-1 lg:col-span-2 bg-[#1c202e]/60 backdrop-blur-md rounded-[2rem] border border-white/5 overflow-hidden shadow-xl flex flex-col">
        <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02]">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Actionnaires & Familles</h3>
             <div className="flex gap-4 text-xs font-medium bg-black/20 px-4 py-2 rounded-full border border-white/5">
                <span className="text-slate-400">Inst: <span className="text-white font-bold">{institutionalPct}%</span></span>
                <span className="text-slate-400">Retail: <span className="text-white font-bold">{retailPct}%</span></span>
                <span className="text-slate-400">Insiders: <span className="text-white font-bold">{insiderPct}%</span></span>
             </div>
        </div>
        <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="text-[10px] text-slate-500 uppercase bg-white/[0.02]">
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
