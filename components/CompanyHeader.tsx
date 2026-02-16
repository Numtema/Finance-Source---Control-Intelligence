
import React from 'react';
import { CompanyData } from '../types';
import { getISCInterpretation } from '../utils/scoring';
import { Shield, Building2, TrendingUp } from 'lucide-react';

interface Props {
  data: CompanyData;
}

export const CompanyHeader: React.FC<Props> = ({ data }) => {
  const interpretation = getISCInterpretation(data.indices.ISC);

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1c202e]/40 backdrop-blur-2xl border border-white/10 shadow-2xl p-8 lg:p-10 group">
        
        {/* Modern ambient glow effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-600/25 transition-all duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-8 relative z-10">
            
            {/* Left: Identity */}
            <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-white to-slate-200 rounded-3xl flex items-center justify-center p-1 shadow-2xl shadow-white/5">
                   <span className="text-slate-900 font-extrabold text-3xl tracking-tighter">{data.company.ticker[0]}</span>
                </div>
                <div className="pt-1">
                    <h1 className="text-5xl font-extrabold text-white tracking-tight leading-none mb-3 drop-shadow-sm">{data.company.name}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-slate-400 text-sm font-medium">
                        <span className="font-mono bg-white/10 px-3 py-1 rounded-full text-white border border-white/10 shadow-inner">{data.company.ticker}</span>
                        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>{data.company.sector}</span>
                        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>{data.company.year}</span>
                    </div>
                </div>
            </div>

            {/* Right: Score Hero */}
            <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">Score ISC</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className={`text-6xl font-black ${interpretation.color} tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>{data.indices.ISC.toFixed(2)}</span>
                    <span className="text-xl text-slate-600 font-bold">/10</span>
                </div>
                <div className={`mt-2 text-sm font-bold px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md ${interpretation.color}`}>
                    {interpretation.label}
                </div>
            </div>
        </div>

        {/* Bottom Grid: Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/5">
            <div className="flex items-center gap-4 group/item">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 group-hover/item:bg-blue-500/20 transition-colors">
                   <Shield size={24} />
                </div>
                <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Mode de Contrôle</div>
                    <div className="text-base font-bold text-slate-200">{data.indices.dominant_mode}</div>
                </div>
            </div>
             <div className="flex items-center gap-4 group/item">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20 group-hover/item:bg-emerald-500/20 transition-colors">
                   <Building2 size={24} />
                </div>
                <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Centre de Gravité</div>
                    <div className="text-base font-bold text-slate-200 capitalize">{data.analysis.capital_control.summary.split(" ")[0] + "..."}</div>
                </div>
            </div>
             <div className="flex items-center gap-4 group/item">
                <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400 border border-rose-500/20 group-hover/item:bg-rose-500/20 transition-colors">
                   <TrendingUp size={24} />
                </div>
                <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Risque Majeur</div>
                    <div className="text-base font-bold text-slate-200">{data.pressure_levers[0]?.force || "N/A"}</div>
                </div>
            </div>
        </div>
    </div>
  );
};
