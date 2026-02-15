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

  // Logic to fill placeholders up to 3 for visual balance
  const placeholdersNeeded = Math.max(0, 3 - companies.length);
  const placeholders = Array(placeholdersNeeded).fill(0);

  return (
    <div className="flex flex-col gap-12 pb-12">
      
      {/* 1. CARDS ROW */}
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-6 min-w-max">
            {companies.map((data, idx) => {
            const iscInfo = getISCInterpretation(data.indices.ISC);
            
            return (
                <div key={idx} className="w-[380px] bg-slate-900 border border-slate-700 rounded-xl flex flex-col shrink-0 relative group shadow-xl">
                
                {/* Remove Button */}
                <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(data.company.ticker); }}
                    className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-slate-900 rounded-full p-1"
                    title="Retirer"
                >
                    <XCircle size={20} />
                </button>

                {/* Individual Export Actions (Top Right Hover) */}
                <div className="absolute top-2 right-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-slate-900 rounded-lg p-1 border border-slate-700">
                    <button onClick={(e) => {e.stopPropagation(); downloadJSON(data)}} className="p-1 hover:text-blue-400 text-slate-400" title="JSON"><FileJson size={14}/></button>
                    <button onClick={(e) => {e.stopPropagation(); downloadHTML(data)}} className="p-1 hover:text-blue-400 text-slate-400" title="HTML"><FileCode size={14}/></button>
                    <button onClick={(e) => {e.stopPropagation(); downloadMarkdown(data)}} className="p-1 hover:text-blue-400 text-slate-400" title="MD"><FileText size={14}/></button>
                </div>

                {/* Header */}
                <div className="p-5 border-b border-slate-800 bg-slate-800/50 rounded-t-xl">
                    <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-900 font-bold text-sm shadow-sm">
                        {data.company.ticker[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-white leading-tight">{data.company.name}</h3>
                        <span className="text-xs font-mono text-blue-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                        {data.company.ticker}
                        </span>
                    </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-4 flex-1">
                    
                    {/* Score ISC Box (Top) */}
                    <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 text-center">
                        <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">SCORE ISC</div>
                        <div className={`text-4xl font-black ${iscInfo.color} mb-1`}>{data.indices.ISC.toFixed(2)}</div>
                        <div className={`text-[10px] font-bold uppercase ${iscInfo.color}`}>{iscInfo.label}</div>
                    </div>

                    {/* Chart Container */}
                    <div className="border border-slate-800 rounded-lg p-2 bg-slate-900/50 relative">
                        <div className="text-xs text-slate-500 uppercase tracking-widest absolute top-3 left-3">ARCHITECTURE DU POUVOIR</div>
                        <div className="h-48">
                            <ISCRadar indices={data.indices} />
                        </div>
                        
                        {/* 5 Icons Row overlaid at bottom of chart box or separate */}
                        <div className="grid grid-cols-5 gap-1 text-center mt-2 border-t border-slate-800/50 pt-3">
                            <div className="flex flex-col items-center gap-1 group/icon relative">
                                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-blue-400"><Gavel size={16}/></div>
                                <span className="text-sm font-bold text-white">{data.indices.CF}</span>
                                <span className="absolute -bottom-6 text-[9px] w-max bg-slate-800 text-white px-1 rounded opacity-0 group-hover/icon:opacity-100">Formel</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 group/icon relative">
                                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400"><Wallet size={16}/></div>
                                <span className="text-sm font-bold text-white">{data.indices.CC}</span>
                                <span className="absolute -bottom-6 text-[9px] w-max bg-slate-800 text-white px-1 rounded opacity-0 group-hover/icon:opacity-100">Capital</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 group/icon relative">
                                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-sky-400"><Activity size={16}/></div>
                                <span className="text-sm font-bold text-white">{data.indices.CM}</span>
                                <span className="absolute -bottom-6 text-[9px] w-max bg-slate-800 text-white px-1 rounded opacity-0 group-hover/icon:opacity-100">Marché</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 group/icon relative">
                                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400"><DollarSign size={16}/></div>
                                <span className="text-sm font-bold text-white">{data.indices.CR}</span>
                                <span className="absolute -bottom-6 text-[9px] w-max bg-slate-800 text-white px-1 rounded opacity-0 group-hover/icon:opacity-100">Revenus</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 group/icon relative">
                                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-violet-400"><Cpu size={16}/></div>
                                <span className="text-sm font-bold text-white">{data.indices.CP}</span>
                                <span className="absolute -bottom-6 text-[9px] w-max bg-slate-800 text-white px-1 rounded opacity-0 group-hover/icon:opacity-100">Productif</span>
                            </div>
                        </div>
                    </div>

                    {/* Big Action Button */}
                    <button 
                        onClick={() => setSelectedCompany(data)}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all border border-slate-700 shadow-sm mt-2"
                    >
                        <Maximize2 size={16} /> Voir Analyse Complète
                    </button>
                </div>
                </div>
            );
            })}

            {/* PLACEHOLDERS */}
            {placeholders.map((_, i) => (
                <div key={`ph-${i}`} className="w-[380px] shrink-0 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-600 gap-4 bg-slate-900/20">
                    <PlusCircle size={48} className="opacity-20" />
                    <span className="text-sm font-medium">Emplacement Disponible</span>
                    <span className="text-xs opacity-50">Ajoutez une entreprise pour comparer</span>
                </div>
            ))}
        </div>
      </div>

      {/* 2. CROSS-OWNERSHIP MATRIX (Only show if we have companies) */}
      {companies.length > 0 && (
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-800/50">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="text-indigo-400" /> Matrice d'Actionnariat Croisé
            </h3>
            <p className="text-sm text-slate-400 mt-1">Comparaison directe des pourcentages de détention par investisseur.</p>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-950">
                    <tr>
                        <th className="px-6 py-4 font-medium sticky left-0 bg-slate-950 z-10 border-r border-slate-800">Investisseur</th>
                        {companies.map(c => (
                            <th key={c.company.ticker} className="px-6 py-4 font-medium text-center border-l border-slate-800">
                                <div className="text-white">{c.company.ticker}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {uniqueInvestors.map((invName, idx) => {
                        // Find family from the first company that has this investor
                        const sampleInvestor = companies.flatMap(c => c.ownership.top_holders).find(h => h.name === invName);
                        const family = sampleInvestor?.family || 'Unknown';

                        return (
                            <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-3 font-medium text-slate-300 sticky left-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-center">
                                    <span>{invName}</span>
                                    <span className="text-[10px] text-slate-500 uppercase font-normal">{family}</span>
                                </td>
                                {companies.map(c => {
                                    const holder = c.ownership.top_holders.find(h => h.name === invName);
                                    return (
                                        <td key={c.company.ticker} className="px-6 py-3 text-center border-l border-slate-800">
                                            {holder ? (
                                                <span className="font-mono text-indigo-300 font-bold">{holder.percent.toFixed(1)}%</span>
                                            ) : (
                                                <span className="text-slate-700">-</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>
      )}

      {/* 3. DETAILED MODAL OVERLAY */}
      {selectedCompany && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm overflow-y-auto">
            <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
                <div className="flex justify-end mb-4">
                    <button 
                        onClick={() => setSelectedCompany(null)}
                        className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full transition-colors border border-slate-600"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-1">
                    {/* Header */}
                    <div className="bg-slate-900/50 p-6 border-b border-slate-800 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">{selectedCompany.company.ticker}</span>
                            {selectedCompany.company.name}
                        </h2>
                        {/* Exports in Modal */}
                        <div className="flex gap-2">
                            <button onClick={() => downloadJSON(selectedCompany)} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded text-xs flex items-center gap-2 hover:bg-slate-700 border border-slate-700"><FileJson size={14}/> JSON</button>
                            <button onClick={() => downloadHTML(selectedCompany)} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded text-xs flex items-center gap-2 hover:bg-slate-700 border border-slate-700"><FileCode size={14}/> HTML</button>
                            <button onClick={() => downloadMarkdown(selectedCompany)} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded text-xs flex items-center gap-2 hover:bg-slate-700 border border-slate-700"><FileText size={14}/> MD</button>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Reuse Existing Components */}
                        <CompanyProfile data={selectedCompany} />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <ISCRadar indices={selectedCompany.indices} />
                                <div className="mt-6 space-y-3">
                                    {selectedCompany.pressure_levers.map((lever, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                                            <div className="text-sm font-medium text-slate-300">{lever.force}</div>
                                            <div className="text-xs text-rose-400 font-bold border border-rose-900 bg-rose-900/20 px-2 py-1 rounded">{lever.strength}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AnalysisCard title="Contrôle Formel" code="CF" result={selectedCompany.analysis.formal_control} color="text-blue-400" icon={<Gavel size={18} />} />
                                <AnalysisCard title="Contrôle Capital" code="CC" result={selectedCompany.analysis.capital_control} color="text-indigo-400" icon={<Wallet size={18} />} />
                                <AnalysisCard title="Contrainte Marché" code="CM" result={selectedCompany.analysis.market_constraint} color="text-sky-400" icon={<Activity size={18} />} />
                                <AnalysisCard title="Puissance Revenus" code="CR" result={selectedCompany.analysis.revenue_power} color="text-emerald-400" icon={<DollarSign size={18} />} />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800">
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