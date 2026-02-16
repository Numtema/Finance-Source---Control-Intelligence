
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { CompanyHeader } from './components/CompanyHeader';
import { CompanyProfile } from './components/CompanyProfile';
import { AnalysisCard } from './components/AnalysisCard';
import { ISCRadar } from './components/RadarChart';
import { InvestorTable } from './components/InvestorTable';
import { ComparisonView } from './components/ComparisonView';
import { APPLE_DATA } from './data/appleData';
import { ORE_DATA } from './data/oreData';
import { downloadJSON, downloadMarkdown, downloadHTML } from './utils/export';
import { CompanyData } from './types';
import { 
  Gavel, Wallet, Activity, DollarSign, Cpu, Scale, AlertTriangle, 
  Search, Sparkles, FileJson, FileText, Printer, Layers, Plus, ArrowRight, FileCode, Zap, Trash2
} from 'lucide-react';

type ViewMode = 'single' | 'compare';

export default function App() {
  const [data, setData] = useState<CompanyData>(APPLE_DATA);
  const [comparisonList, setComparisonList] = useState<CompanyData[]>(() => {
      const saved = localStorage.getItem('fs_comparison_deck');
      return saved ? JSON.parse(saved) : [];
  });
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [tickerInput, setTickerInput] = useState("");

  useEffect(() => {
      localStorage.setItem('fs_comparison_deck', JSON.stringify(comparisonList));
  }, [comparisonList]);

  const handleAnalyze = async (input: string = tickerInput) => {
    const tickers = input.split(/[,]+/).map(t => t.trim()).filter(t => t.length > 0);
    if (tickers.length === 0) return;

    setLoading(true);
    
    // Auto-switch to Accumulation Mode if batch or list not empty
    const isBatch = tickers.length > 1;
    if (isBatch || viewMode === 'compare' || comparisonList.length > 0) {
        setViewMode('compare');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let processedCount = 0;

    for (const targetTicker of tickers) {
        setLoadingStatus(`Analyse de ${targetTicker}... (${processedCount + 1}/${tickers.length})`);
        try {
            const prompt = `
                You are 'Finance Source', an advanced corporate control analysis engine.
                TASK: Analyze "${targetTicker.toUpperCase()}".
                Generate a strictly typed JSON object for Control Intelligence 2025/2026.
                CRITICAL: All text summaries MUST be in FRENCH.
                REQUIREMENTS:
                1. Follow the exact JSON structure of the EXAMPLE.
                2. Determine scores (0-10) for CF, CC, CM, CR, CP.
                3. Calculate ISC properly.
                4. Real-world data for profile/products.
                5. Accurate top 10 shareholders with families (Passive Giants, etc).
                
                EXAMPLE JSON: ${JSON.stringify(APPLE_DATA)}
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: 'application/json' }
            });

            if (response.text) {
                const newData = JSON.parse(response.text);
                if (isBatch || viewMode === 'compare' || comparisonList.length > 0) {
                    setComparisonList(prev => {
                        if (prev.find(c => c.company.ticker === newData.company.ticker)) return prev;
                        return [...prev, newData];
                    });
                } else {
                    setData(newData);
                }
            }
        } catch (error) {
            console.error(`Analysis failed for ${targetTicker}:`, error);
        }
        processedCount++;
    }
    setLoading(false);
    setLoadingStatus("");
    setTickerInput("");
  };

  const loadOREScenario = () => {
      setComparisonList(prev => {
          const existingTickers = new Set(prev.map(c => c.company.ticker));
          const newOreCompanies = ORE_DATA.filter(c => !existingTickers.has(c.company.ticker));
          return [...prev, ...newOreCompanies];
      });
      setViewMode('compare');
  };

  const addToComparison = () => {
      if (!comparisonList.find(c => c.company.ticker === data.company.ticker)) {
            setComparisonList([...comparisonList, data]);
            setViewMode('compare');
      } else {
          setViewMode('compare');
      }
  };

  const clearComparison = () => {
      if(confirm("Vider tout le comparateur ?")) {
          setComparisonList([]);
          setViewMode('single');
      }
  }

  const removeFromComparison = (ticker: string) => {
      setComparisonList(comparisonList.filter(c => c.company.ticker !== ticker));
  };

  const handlePrint = () => window.print();

  if (loading) {
      return (
          <div className="min-h-screen bg-[#0b0d12] flex flex-col items-center justify-center gap-6 font-sans relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-[shimmer_2s_infinite]"></div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                  <p className="text-2xl font-semibold text-white tracking-tight mb-2">
                      {loadingStatus || "Intelligence Engine Active"}
                  </p>
                  <p className="text-sm text-slate-500 font-medium">Finance Source analyse les structures de contrôle...</p>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen text-slate-200 pb-24 selection:bg-blue-500/30 font-sans">
      
      {/* Floating Navigation */}
      <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 no-print">
        <div className="bg-[#1c202e]/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl flex items-center gap-6 max-w-5xl w-full justify-between">
            
            {/* Logo Area */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setViewMode('single')}>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
                    FS
                </div>
                <span className="font-bold text-lg text-white tracking-tight hidden md:block">Finance Source</span>
            </div>

            {/* Central Controls */}
            <div className="flex items-center gap-3">
                 <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-400 transition-colors" />
                    <input 
                        type="text" 
                        value={tickerInput}
                        onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                        placeholder={viewMode === 'compare' ? "Batch (TSLA, AAPL)..." : "Ticker..."}
                        className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 w-48 md:w-64 text-white placeholder-slate-500 transition-all"
                    />
                 </div>
                 <button 
                    onClick={() => handleAnalyze()}
                    className="bg-white text-slate-900 hover:bg-slate-200 px-4 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-white/5 flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-600" />
                    <span className="hidden sm:inline">{viewMode === 'compare' ? 'Add' : 'Analyze'}</span>
                 </button>
            </div>

            {/* View Switcher & Actions */}
            <div className="flex items-center gap-2">
                <div className="hidden md:flex bg-white/5 rounded-full p-1 border border-white/5">
                    <button 
                        onClick={() => setViewMode('single')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${viewMode === 'single' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                        Single
                    </button>
                    <button 
                        onClick={() => setViewMode('compare')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'compare' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                        Compare <span className="bg-white/10 px-1.5 rounded-md text-[10px] text-slate-300">{comparisonList.length}</span>
                    </button>
                </div>
                
                <div className="h-6 w-px bg-white/10 mx-1 hidden lg:block"></div>
                
                <button onClick={loadOREScenario} title="Charger ORE Engine" className="p-2.5 rounded-full text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors border border-transparent hover:border-indigo-500/20">
                    <Zap size={20} className="fill-current" />
                </button>
                 {comparisonList.length > 0 && (
                    <button onClick={clearComparison} title="Vider" className="p-2.5 rounded-full text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors border border-transparent hover:border-rose-500/20">
                        <Trash2 size={18} />
                    </button>
                )}
                 <button onClick={handlePrint} className="hidden lg:block p-2.5 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                    <Printer size={18} />
                </button>
            </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 print:mt-0 print:max-w-none">
        
        {viewMode === 'compare' ? (
             <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 flex items-center gap-3">
                            {comparisonList.some(c => c.company.ticker === 'VANGUARD') ? <Zap className="text-indigo-400 fill-indigo-400 w-8 h-8" /> : <Layers className="text-blue-400 w-8 h-8" />} 
                            {comparisonList.some(c => c.company.ticker === 'VANGUARD') ? 'ORE Forensic Engine' : 'Deck Comparatif'}
                        </h2>
                        <p className="text-slate-400 font-medium mt-2 max-w-2xl text-lg">
                             {comparisonList.some(c => c.company.ticker === 'VANGUARD') ? 'Analyse systémique des structures de contrôle et des fonds.' : 'Comparaison structurelle des architectures de pouvoir.'}
                        </p>
                    </div>
                </div>
                <ComparisonView companies={comparisonList} onRemove={removeFromComparison} />
             </div>
        ) : (
            /* SINGLE VIEW MODE */
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-end mb-2">
                     <button 
                        onClick={addToComparison}
                        className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-sm font-semibold flex items-center gap-2 transition-all border border-blue-500/20 hover:border-blue-500/40">
                        <Plus size={16} /> Ajouter au Deck
                     </button>
                </div>

                <div className="break-inside-avoid mb-8">
                   <CompanyHeader data={data} />
                </div>

                <div className="break-inside-avoid mb-8">
                   <CompanyProfile data={data} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                    {/* Radar & Levers - Left Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="break-inside-avoid">
                            <ISCRadar indices={data.indices} />
                        </div>
                        
                        <div className="bg-[#1c202e]/60 backdrop-blur-md rounded-3xl p-6 border border-white/5 break-inside-avoid shadow-xl">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <AlertTriangle size={14} className="text-amber-500" /> Leviers de Pression
                            </h3>
                            <div className="space-y-3">
                                {data.pressure_levers.map((lever, i) => (
                                    <div key={i} className="group flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all hover:bg-white/10">
                                        <div>
                                            <div className="text-sm font-semibold text-white">{lever.force}</div>
                                            <div className="text-xs text-slate-500">{lever.type}</div>
                                        </div>
                                        <div className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wide
                                            ${lever.strength === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                                              lever.strength === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                                              'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                                            {lever.strength}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Analysis Cards - Right Grid */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full content-start">
                            <AnalysisCard 
                                title="Contrôle Formel" 
                                code="CF" 
                                result={data.analysis.formal_control} 
                                color="text-blue-400" 
                                icon={<Gavel size={20} />}
                            />
                            <AnalysisCard 
                                title="Contrôle Capital" 
                                code="CC" 
                                result={data.analysis.capital_control} 
                                color="text-indigo-400" 
                                icon={<Wallet size={20} />}
                            />
                            <AnalysisCard 
                                title="Contrainte Marché" 
                                code="CM" 
                                result={data.analysis.market_constraint} 
                                color="text-sky-400" 
                                icon={<Activity size={20} />}
                            />
                            <AnalysisCard 
                                title="Puissance Revenus" 
                                code="CR" 
                                result={data.analysis.revenue_power} 
                                color="text-emerald-400" 
                                icon={<DollarSign size={20} />}
                            />
                            <AnalysisCard 
                                title="Puissance Productive" 
                                code="CP" 
                                result={data.analysis.productive_power} 
                                color="text-violet-400" 
                                icon={<Cpu size={20} />}
                            />
                             <AnalysisCard 
                                title="Régulation" 
                                code="REG" 
                                result={data.analysis.regulatory} 
                                color="text-rose-400" 
                                icon={<Scale size={20} />}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-20 break-inside-avoid">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-xl">
                                <ArrowRight size={24} className="text-blue-500"/>
                            </div>
                            Actionnariat & Dominance
                        </h2>
                        <span className="text-xs font-bold text-slate-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 uppercase tracking-wide">AI Powered Analysis</span>
                    </div>
                    <InvestorTable 
                        investors={data.ownership.top_holders}
                        institutionalPct={data.ownership.institutional_percent}
                        retailPct={data.ownership.retail_percent}
                        insiderPct={data.ownership.insider_percent}
                    />
                </div>
            </div>
        )}

      </main>
    </div>
  );
}
