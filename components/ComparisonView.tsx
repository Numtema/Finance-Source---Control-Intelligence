
import React, { useState } from 'react';
import { CompanyData } from '../types';
import { ISCRadar } from './RadarChart';
import { CompanyProfile } from './CompanyProfile';
import { AnalysisCard } from './AnalysisCard';
import { InvestorTable } from './InvestorTable';
import { downloadJSON, downloadHTML, downloadMarkdown } from '../utils/export';
import { 
  Building2, Users, Globe, TrendingUp, Shield, 
  AlertTriangle, DollarSign, Layers, Gavel, Scale, 
  Cpu, Wallet, Activity, XCircle, Maximize2, X, PlusCircle,
  FileJson, FileCode, FileText
} from 'lucide-react';
import { getISCInterpretation } from '../utils/scoring';

interface Props {
  companies: CompanyData[];
  onRemove: (ticker: string) => void;
}

export const ComparisonView: React.FC<Props> = ({ companies, onRemove }) => {
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);

  // Calculate unique investors for the Matrix
  const allInvestors = new Set<string>();
  companies.forEach(c => {
    c.ownership.top_holders.forEach(h => allInvestors.add(h.name));
  });
  const uniqueInvestors = Array.from(allInvestors).sort();

  const placeholdersNeeded = Math.max(0, 3 - companies.length);
  const placeholders = Array(placeholdersNeeded).fill(0);

  const getFamilyStyle = (family: string) => {
    switch(family) {
      case 'Internal Fund': return 'text-slate-500 italic';
      case 'Direct Clients': return 'text-emerald-400 font-bold';
      case 'Partnership': return 'text-amber-400';
      case 'Family Control': return 'text-rose-400 font-bold underline';
      case 'Passive Giants': return 'text-indigo-300';
      case 'Active Funds': return 'text-blue-300';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="flex flex-col gap-12 pb-12">
      
      {/* 1. CARDS ROW */}
      <div className="overflow-x-auto pb-10 -mx-4 px-4 snap-x">
        <div className="flex gap-8 min-w-max">
            {companies.map((data, idx) => {
            const iscInfo = getISCInterpretation(data.indices.ISC);
            
            return (
                <div key={idx} className="w-[400px] bg-[#1c202e]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] flex flex-col shrink-0 relative group shadow-2xl hover:-translate-y-2 transition-transform duration-300 snap-center">
                
                <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(data.company.ticker); }}
                    className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-[#1c202e] rounded-full p-2 border border-white/10 shadow-lg"
                    title="Retirer"
                >
                    <XCircle size={20} />
                </button>

                <div className="absolute top-4 right-14 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button onClick={(e) => {e.stopPropagation(); downloadJSON(data)}} className="p-2 bg-[#1c202e] rounded-full border border-white/10 text-slate-400 hover:text-blue-400"><FileJson size={14}/></button>
                </div>

                {/* Header */}
                <div className="p-6 pb-0 pt-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-white to-slate-300 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl shadow-lg shadow-white/10">
                            {data.company.ticker[0]}
                        </div>
                        <div>
                            <h3 className="font-extrabold text-2xl text-white leading-tight">{data.company.name}</h3>
                            <span className="text-[11px] font-bold text-blue-300 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20 uppercase tracking-wide">
                                {data.company.ticker}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col gap-6 flex-1">
                    
                    {/* Score ISC Box */}
                    <div className="bg-[#0b0d12]/50 rounded-2xl border border-white/5 p-6 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">Global ISC Score</div>
                        <div className={`text-5xl font-black ${iscInfo.color} mb-2 drop-shadow-lg`}>{data.indices.ISC.toFixed(2)}</div>
                        <div className={`text-xs font-bold uppercase px-3 py-1 rounded-full bg-white/5 inline-block ${iscInfo.color}`}>{iscInfo.label}</div>
                    </div>

                    {/* Chart Container */}
                    <div className="border border-white/5 rounded-2xl p-4 bg-white/[0.02] relative min-h-[220px]">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest absolute top-4 left-4">Power Shape</div>
                        <div className="h-40 mt-6 -ml-2">
                            <ISCRadar indices={data.indices} minimal />
                        </div>
                        
                        <div className="grid grid-cols-5 gap-1 text-center mt-2 pt-3 border-t border-white/5">
                            <div className="flex flex-col items-center gap-1"><span className="text-blue-400 font-bold text-sm">{data.indices.CF}</span><span className="text-[8px] text-slate-500 uppercase">Formel</span></div>
                            <div className="flex flex-col items-center gap-1"><span className="text-indigo-400 font-bold text-sm">{data.indices.CC}</span><span className="text-[8px] text-slate-500 uppercase">Capital</span></div>
                            <div className="flex flex-col items-center gap-1"><span className="text-sky-400 font-bold text-sm">{data.indices.CM}</span><span className="text-[8px] text-slate-500 uppercase">Marché</span></div>
                            <div className="flex flex-col items-center gap-1"><span className="text-emerald-400 font-bold text-sm">{data.indices.CR}</span><span className="text-[8px] text-slate-500 uppercase">Rev</span></div>
                            <div className="flex flex-col items-center gap-1"><span className="text-violet-400 font-bold text-sm">{data.indices.CP}</span><span className="text-[8px] text-slate-500 uppercase">Prod</span></div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setSelectedCompany(data)}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all border border-white/5 hover:border-white/20 shadow-lg mt-auto"
                    >
                        <Maximize2 size={16} /> Open Full Dossier
                    </button>
                </div>
                </div>
            );
            })}

            {/* PLACEHOLDERS */}
            {placeholders.map((_, i) => (
                <div key={`ph-${i}`} className="w-[400px] shrink-0 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-slate-600 gap-4 bg-transparent">
                    <div className="p-6 rounded-full bg-white/5">
                        <PlusCircle size={40} className="opacity-40" />
                    </div>
                    <span className="text-sm font-bold">Slot Available</span>
                </div>
            ))}
        </div>
      </div>

      {/* 2. CROSS-OWNERSHIP MATRIX */}
      {companies.length > 0 && (
      <div className="bg-[#1c202e]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Users className="text-indigo-400" /> Matrice d'Actionnariat Croisé 
                {companies.some(c => c.company.ticker === 'VANGUARD') && <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-1 rounded ml-2 border border-indigo-500/30">ORE ENGINE ACTIVE</span>}
            </h3>
            <p className="text-sm text-slate-400 mt-2 font-medium">Comparaison directe des pourcentages de détention par investisseur et cumul par entreprise.</p>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left border-collapse">
                <thead>
                    <tr className="bg-[#0b0d12]/50 border-b border-white/5">
                        <th className="px-8 py-5 font-bold text-xs text-slate-400 uppercase tracking-wider sticky left-0 bg-[#0b0d12] z-10">Investisseur</th>
                        {companies.map(c => (
                            <th key={c.company.ticker} className="px-6 py-5 font-bold text-center text-white min-w-[120px] border-l border-white/5">
                                {c.company.ticker}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {uniqueInvestors.map((invName, idx) => {
                        const sampleInvestor = companies.flatMap(c => c.ownership.top_holders).find(h => h.name === invName);
                        const family = sampleInvestor?.family || 'Unknown';

                        return (
                            <tr key={idx} className="hover:bg-white/[0.03] transition-colors group">
                                <td className="px-8 py-4 font-medium text-slate-200 sticky left-0 bg-[#1c202e] group-hover:bg-[#232736] border-r border-white/5 shadow-[2px_0_10px_rgba(0,0,0,0.2)]">
                                    <div className="flex flex-col">
                                        <span>{invName}</span>
                                        <span className={`text-[10px] uppercase font-bold tracking-wide mt-0.5 ${getFamilyStyle(family)}`}>{family}</span>
                                    </div>
                                </td>
                                {companies.map(c => {
                                    const holder = c.ownership.top_holders.find(h => h.name === invName);
                                    return (
                                        <td key={c.company.ticker} className="px-6 py-4 text-center border-l border-white/5">
                                            {holder ? (
                                                <span className="font-mono text-indigo-300 font-bold bg-indigo-500/10 px-2 py-1 rounded">{holder.percent.toFixed(1)}%</span>
                                            ) : (
                                                <span className="text-slate-700 opacity-30">-</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot className="bg-[#0b0d12]/80 font-bold border-t border-white/10">
                    <tr>
                         <td className="px-8 py-5 text-white sticky left-0 bg-[#0b0d12] border-r border-white/5 uppercase text-xs tracking-wider">
                            Total Visible
                        </td>
                        {companies.map(c => {
                            const total = c.ownership.top_holders.reduce((acc, h) => acc + h.percent, 0);
                            return (
                                <td key={`total-${c.company.ticker}`} className="px-6 py-5 text-center border-l border-white/5 font-mono text-emerald-400">
                                    {total.toFixed(1)}%
                                </td>
                            );
                        })}
                    </tr>
                </tfoot>
            </table>
        </div>
      </div>
      )}

      {/* 3. MODAL */}
      {selectedCompany && (
        <div className="fixed inset-0 z-[100] bg-[#0b0d12]/95 backdrop-blur-xl overflow-y-auto">
            <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-300">
                <div className="flex justify-end mb-6 sticky top-4 z-50">
                    <button 
                        onClick={() => setSelectedCompany(null)}
                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors backdrop-blur-md border border-white/10 shadow-xl"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="bg-[#1c202e] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden p-1">
                    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 border-b border-white/5 flex justify-between items-center">
                        <h2 className="text-3xl font-black text-white flex items-center gap-4">
                            <span className="bg-white text-slate-900 px-4 py-1 rounded-xl text-xl shadow-lg">{selectedCompany.company.ticker}</span>
                            {selectedCompany.company.name}
                        </h2>
                    </div>

                    <div className="p-8 space-y-12">
                        <CompanyProfile data={selectedCompany} />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <ISCRadar indices={selectedCompany.indices} />
                                <div className="mt-8 space-y-4">
                                    {selectedCompany.pressure_levers.map((lever, i) => (
                                        <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="text-sm font-semibold text-slate-300">{lever.force}</div>
                                            <div className="text-xs text-rose-400 font-bold border border-rose-500/20 bg-rose-500/10 px-3 py-1 rounded-lg">{lever.strength}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AnalysisCard title="Contrôle Formel" code="CF" result={selectedCompany.analysis.formal_control} color="text-blue-400" icon={<Gavel size={18} />} />
                                <AnalysisCard title="Contrôle Capital" code="CC" result={selectedCompany.analysis.capital_control} color="text-indigo-400" icon={<Wallet size={18} />} />
                                <AnalysisCard title="Contrainte Marché" code="CM" result={selectedCompany.analysis.market_constraint} color="text-sky-400" icon={<Activity size={18} />} />
                                <AnalysisCard title="Puissance Revenus" code="CR" result={selectedCompany.analysis.revenue_power} color="text-emerald-400" icon={<DollarSign size={18} />} />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <InvestorTable 
                                investors={selectedCompany.ownership.top_holders}
                                institutionalPct={selectedCompany.ownership.institutional_percent}
                                retailPct={selectedCompany.ownership.retail_percent}
                                insiderPct={selectedCompany.ownership.insider_percent}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
