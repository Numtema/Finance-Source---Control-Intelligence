
import React, { useState, useEffect } from 'react';
import { CompanyData, ControlIndex } from '../types';
import { ISCRadar } from './RadarChart';
import { CompanyProfile } from './CompanyProfile';
import { AnalysisCard } from './AnalysisCard';
import { InvestorTable } from './InvestorTable';
import { downloadJSON, downloadHTML, downloadMarkdown } from '../utils/export';
import { calculateISC, calculateIDBF, getISCInterpretation } from '../utils/scoring';
import { 
  Building2, Users, Globe, TrendingUp, Shield, 
  AlertTriangle, DollarSign, Layers, Gavel, Scale, 
  Cpu, Wallet, Activity, XCircle, Maximize2, X, PlusCircle,
  FileJson, FileCode, FileText, Sliders, Zap, RefreshCcw, Calculator, ArrowRight
} from 'lucide-react';

interface Props {
  companies: CompanyData[];
  onRemove: (ticker: string) => void;
}

export const ComparisonView: React.FC<Props> = ({ companies, onRemove }) => {
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  
  // SIMULATION STATE
  const [isSimulating, setIsSimulating] = useState(false);
  const [simCompany, setSimCompany] = useState<CompanyData | null>(null);

  // Initialize simulation state when company is selected
  useEffect(() => {
    if (selectedCompany) {
        setSimCompany(JSON.parse(JSON.stringify(selectedCompany)));
        setIsSimulating(false);
    }
  }, [selectedCompany]);

  const resetSimulation = () => {
    if (selectedCompany) {
        setSimCompany(JSON.parse(JSON.stringify(selectedCompany)));
    }
  };

  const updateSimIndex = (key: keyof ControlIndex, value: number) => {
    if (!simCompany) return;
    const newIndices = { ...simCompany.indices, [key]: value };
    // Recalculate ISC Score
    newIndices.ISC = calculateISC(newIndices.CF, newIndices.CC, newIndices.CM, newIndices.CR, newIndices.CP);
    setSimCompany({ ...simCompany, indices: newIndices });
  };

  const updateSimOwner = (index: number, newPercent: number) => {
    if (!simCompany) return;
    const newHolders = [...simCompany.ownership.top_holders];
    newHolders[index] = { ...newHolders[index], percent: newPercent };
    setSimCompany({
        ...simCompany,
        ownership: { ...simCompany.ownership, top_holders: newHolders }
    });
  };

  // Derived Metrics for Header
  const getSimMetrics = () => {
      if (!selectedCompany || !simCompany) return { iscDelta: 0, idbfDelta: 0 };
      const origIDBF = calculateIDBF(selectedCompany.ownership.top_holders).idbfScore;
      const simIDBF = calculateIDBF(simCompany.ownership.top_holders).idbfScore;
      return {
          iscDelta: simCompany.indices.ISC - selectedCompany.indices.ISC,
          idbfDelta: simIDBF - origIDBF
      };
  };

  const { iscDelta, idbfDelta } = getSimMetrics();

  // Cross-Ownership Matrix Logic
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
                
                {/* MODAL HEADER */}
                <div className="flex justify-between items-center mb-6 sticky top-4 z-50 bg-[#1c202e]/80 backdrop-blur-xl p-4 rounded-full border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 px-4 py-2 rounded-full text-white font-bold flex items-center gap-3 border border-white/5">
                            <span>{selectedCompany.company.ticker}</span>
                            <span className="text-slate-500">|</span>
                            <span className="text-sm font-medium text-slate-300 hidden md:inline">{selectedCompany.company.name}</span>
                        </div>
                        
                        {/* WAR ROOM TOGGLE */}
                        <button 
                            onClick={() => setIsSimulating(!isSimulating)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all border ${
                                isSimulating 
                                ? 'bg-rose-500 text-white border-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.5)]' 
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                            }`}
                        >
                            <Zap size={16} className={isSimulating ? 'fill-current animate-pulse' : ''} />
                            {isSimulating ? 'WAR ROOM ACTIVE' : 'Lecture Seule'}
                        </button>

                        {isSimulating && (
                            <button 
                                onClick={resetSimulation}
                                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
                                title="Reset Simulation"
                            >
                                <RefreshCcw size={16} />
                            </button>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => setSelectedCompany(null)}
                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors backdrop-blur-md border border-white/10 shadow-xl"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className={`bg-[#1c202e] border rounded-[3rem] shadow-2xl overflow-hidden p-1 transition-all duration-500 ${isSimulating ? 'border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.1)]' : 'border-white/10'}`}>
                    
                    {/* CONDITIONAL CONTENT */}
                    {isSimulating && simCompany ? (
                        /* --- WAR ROOM MODE --- */
                        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             {/* Simulation Header Stats */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-rose-950/30 border border-rose-500/20 rounded-[2rem] p-6 flex justify-between items-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-rose-500/5 animate-pulse"></div>
                                    <div>
                                        <div className="text-rose-400 font-bold uppercase tracking-widest text-xs mb-1">ISC Projeté</div>
                                        <div className="text-5xl font-black text-white flex items-baseline gap-3">
                                            {simCompany.indices.ISC.toFixed(2)}
                                            {iscDelta !== 0 && (
                                                <span className={`text-lg font-bold px-2 py-1 rounded-lg ${iscDelta > 0 ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                                    {iscDelta > 0 ? '+' : ''}{iscDelta.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Calculator className="text-rose-500/20 w-24 h-24 absolute -right-6 -bottom-6" />
                                </div>
                                <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-[2rem] p-6 flex justify-between items-center relative overflow-hidden">
                                    <div>
                                        <div className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-1">IDBF Projeté</div>
                                        <div className="text-5xl font-black text-white flex items-baseline gap-3">
                                            {(calculateIDBF(simCompany.ownership.top_holders).idbfScore * 100).toFixed(0)}%
                                            {idbfDelta !== 0 && (
                                                <span className={`text-lg font-bold px-2 py-1 rounded-lg ${idbfDelta > 0 ? 'bg-indigo-500 text-white' : 'bg-slate-500 text-white'}`}>
                                                    {idbfDelta > 0 ? '+' : ''}{(idbfDelta * 100).toFixed(0)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Users className="text-indigo-500/20 w-24 h-24 absolute -right-6 -bottom-6" />
                                </div>
                             </div>

                             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* LEFT: Structural Levers */}
                                <div className="lg:col-span-5 space-y-6">
                                    <div className="bg-[#0b0d12]/50 border border-white/5 rounded-[2rem] p-6">
                                        <h3 className="text-slate-400 font-bold uppercase text-xs mb-6 flex items-center gap-2">
                                            <Sliders size={16} /> Leviers Structurels
                                        </h3>
                                        <div className="space-y-6">
                                            {(['CF', 'CC', 'CM', 'CR', 'CP'] as Array<keyof ControlIndex>).map((key) => (
                                                <div key={key}>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-sm font-bold text-slate-300">{key} Score</span>
                                                        <span className="text-sm font-mono text-rose-400">{simCompany.indices[key]}</span>
                                                    </div>
                                                    <input 
                                                        type="range" 
                                                        min="0" max="10" step="1"
                                                        value={simCompany.indices[key]}
                                                        onChange={(e) => updateSimIndex(key, parseInt(e.target.value))}
                                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-8 h-48">
                                            <ISCRadar indices={simCompany.indices} minimal />
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT: Ownership War */}
                                <div className="lg:col-span-7">
                                    <div className="bg-[#0b0d12]/50 border border-white/5 rounded-[2rem] p-6 h-full">
                                        <h3 className="text-slate-400 font-bold uppercase text-xs mb-6 flex items-center gap-2">
                                            <Wallet size={16} /> Guerre des Capitaux
                                        </h3>
                                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                            {simCompany.ownership.top_holders.map((holder, idx) => (
                                                <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <div className="font-bold text-white text-sm">{holder.name}</div>
                                                            <div className="text-[10px] text-slate-500 uppercase">{holder.family}</div>
                                                        </div>
                                                        <div className="font-mono text-indigo-400 font-bold">{holder.percent.toFixed(1)}%</div>
                                                    </div>
                                                    <input 
                                                        type="range" 
                                                        min="0" max="20" step="0.1"
                                                        value={holder.percent}
                                                        onChange={(e) => updateSimOwner(idx, parseFloat(e.target.value))}
                                                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-white/5">
                                            <InvestorTable 
                                                investors={simCompany.ownership.top_holders}
                                                institutionalPct={simCompany.ownership.institutional_percent} // Simplification: keeps original totals for now
                                                retailPct={simCompany.ownership.retail_percent}
                                                insiderPct={simCompany.ownership.insider_percent}
                                            />
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    ) : (
                        /* --- READ MODE (Existing) --- */
                        <div className="animate-in fade-in zoom-in-95 duration-300">
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
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
