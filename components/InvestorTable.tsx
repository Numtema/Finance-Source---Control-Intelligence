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
  
  // Format for Chart
  const familyData = Object.entries(familyStrengths).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart Section */}
      <div className="col-span-1 bg-slate-800 rounded-xl p-5 border border-slate-700 flex flex-col items-center">
         <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 w-full">Dominance Structurelle (IDBF)</h3>
         
         <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={familyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {familyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#1e293b" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Centered Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white">{(idbfScore * 100).toFixed(0)}%</span>
                <span className="text-[10px] uppercase text-slate-500">Intensité</span>
            </div>
         </div>
         
         <div className="mt-4 w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Bloc Dominant</span>
                <span className="text-sm font-bold text-indigo-400">{dominantFamily}</span>
            </div>
             <div className="text-xs text-slate-500 text-center mt-2 border-t border-slate-700 pt-2">
                Les {dominantFamily} représentent la force gravitationnelle majeure du capital.
             </div>
         </div>
      </div>

      {/* List Section */}
      <div className="col-span-1 lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700 flex justify-between items-center">
             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Top Actionnaires & Familles</h3>
             <div className="flex gap-3 text-xs font-mono">
                <span className="text-slate-400">Inst: <span className="text-white">{institutionalPct}%</span></span>
                <span className="text-slate-400">Retail: <span className="text-white">{retailPct}%</span></span>
                <span className="text-slate-400">Insiders: <span className="text-white">{insiderPct}%</span></span>
             </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-900/50">
                    <tr>
                        <th className="px-6 py-3 font-medium">Investisseur</th>
                        <th className="px-6 py-3 font-medium">Famille</th>
                        <th className="px-6 py-3 font-medium text-right">% Détenu</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {investors.map((inv, idx) => (
                        <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-3 font-medium text-slate-200">{inv.name}</td>
                            <td className="px-6 py-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${inv.family === 'Passive Giants' ? 'bg-indigo-900/50 text-indigo-400 border border-indigo-700/50' : 
                                      inv.family === 'Active Funds' ? 'bg-amber-900/50 text-amber-400 border border-amber-700/50' : 
                                      inv.family === 'Sovereign' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50' :
                                      'bg-slate-700 text-slate-300'}`}>
                                    {inv.family}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-right font-mono text-slate-300">{inv.percent.toFixed(1)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};