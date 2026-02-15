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
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl mb-6 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
                    {/* Placeholder for Logo if image fails, text fallback */}
                   <span className="text-slate-900 font-bold text-xl">{data.company.ticker[0]}</span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{data.company.name}</h1>
                    <div className="flex items-center gap-3 text-slate-400 text-sm mt-1">
                        <span className="font-mono bg-slate-900 px-2 py-0.5 rounded text-blue-400 border border-slate-700">{data.company.ticker}</span>
                        <span>{data.company.sector}</span>
                        <span>•</span>
                        <span>{data.company.year}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-2">
                    <span className="text-sm text-slate-400 uppercase font-semibold">Score ISC</span>
                    <span className={`text-4xl font-bold ${interpretation.color}`}>{data.indices.ISC.toFixed(2)}</span>
                    <span className="text-slate-500 text-sm">/ 10</span>
                </div>
                <div className={`text-sm mt-1 font-medium ${interpretation.color} bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700`}>
                    {interpretation.label}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-700/50">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 rounded-lg text-blue-400 border border-slate-800">
                   <Shield size={20} />
                </div>
                <div>
                    <div className="text-xs text-slate-500 uppercase">Mode de Contrôle</div>
                    <div className="text-sm font-medium text-slate-200">{data.indices.dominant_mode}</div>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 rounded-lg text-emerald-400 border border-slate-800">
                   <Building2 size={20} />
                </div>
                <div>
                    <div className="text-xs text-slate-500 uppercase">Centre de Gravité</div>
                    <div className="text-sm font-medium text-slate-200 capitalize">{data.analysis.capital_control.summary.split(" ")[0] + "..."}</div>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 rounded-lg text-rose-400 border border-slate-800">
                   <TrendingUp size={20} />
                </div>
                <div>
                    <div className="text-xs text-slate-500 uppercase">Vulnérabilité Principale</div>
                    <div className="text-sm font-medium text-slate-200">{data.pressure_levers[0]?.force}</div>
                </div>
            </div>
        </div>
    </div>
  );
};