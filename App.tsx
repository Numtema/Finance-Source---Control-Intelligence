
import React, { useState } from 'react';
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
  Search, Sparkles, FileJson, FileText, Printer, Layers, Plus, ArrowRight, FileCode, Zap
} from 'lucide-react';

type ViewMode = 'single' | 'compare';

export default function App() {
  const [data, setData] = useState<CompanyData>(APPLE_DATA);
  const [comparisonList, setComparisonList] = useState<CompanyData[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [tickerInput, setTickerInput] = useState("");

  const handleAnalyze = async (input: string = tickerInput) => {
    // 1. Parse Input (Split by comma or space)
    const tickers = input.split(/[,]+/).map(t => t.trim()).filter(t => t.length > 0);
    if (tickers.length === 0) return;

    setLoading(true);
    
    // If multiple tickers, automatically switch to comparison mode
    const isBatch = tickers.length > 1;
    if (isBatch) {
        setViewMode('compare');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let processedCount = 0;

    for (const targetTicker of tickers) {
        setLoadingStatus(`Analyse de ${targetTicker}... (${processedCount + 1}/${tickers.length})`);
        
        try {
            const prompt = `
                You are 'Finance Source', an advanced corporate control analysis engine.
                
                TASK:
                Analyze the company with ticker "${targetTicker.toUpperCase()}".
                Generate a strictly typed JSON object representing its Control Intelligence profile for the year 2025/2026.
                
                CRITICAL: All text summaries, notes, and descriptions MUST be in FRENCH.
                
                REQUIREMENTS:
                1. Follow the exact JSON structure of the EXAMPLE provided below.
                2. Determine realistic scores (0-10) for CF (Formal), CC (Capital), CM (Market), CR (Revenue), CP (Productive).
                3. Calculate ISC score properly.
                4. Fill the 'profile' and 'products' sections with accurate, descriptive real-world data.
                5. Provide ~10 realistic top shareholders with accurate recent percentages.
                
                EXAMPLE JSON STRUCTURE (Do not copy values, only structure):
                ${JSON.stringify(APPLE_DATA)}
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                responseMimeType: 'application/json'
                }
            });

            if (response.text) {
                const newData = JSON.parse(response.text);
                
                // Logic: 
                // If Batch OR already in Compare Mode -> Add to Deck
                // If Single Ticker AND in Single Mode -> Replace Main View
                if (isBatch || viewMode === 'compare') {
                    setComparisonList(prev => {
                        // Prevent duplicates
                        if (prev.find(c => c.company.ticker === newData.company.ticker)) return prev;
                        // For manual additions, we allow going over the limit if needed, or stick to a soft limit.
                        // We won't block it here to allow "Power User" batching.
                        return [...prev, newData];
                    });
                } else {
                    setData(newData);
                }
            }
        } catch (error) {
            console.error(`Analysis failed for ${targetTicker}:`, error);
            // Continue to next ticker even if one fails
        }
        processedCount++;
    }

    setLoading(false);
    setLoadingStatus("");
    setTickerInput("");
  };

  const loadOREScenario = () => {
      // Append ORE Data to the existing list instead of replacing it
      setComparisonList(prev => {
          // Create a Set of existing tickers for quick lookup to prevent duplicates
          const existingTickers = new Set(prev.map(c => c.company.ticker));
          
          // Filter ORE data to only include companies not already in the list
          const newOreCompanies = ORE_DATA.filter(c => !existingTickers.has(c.company.ticker));
          
          return [...prev, ...newOreCompanies];
      });
      setViewMode('compare');
  };

  const addToComparison = () => {
      if (!comparisonList.find(c => c.company.ticker === data.company.ticker)) {
           // Relaxed limit check for better UX
            setComparisonList([...comparisonList, data]);
            setViewMode('compare');
      } else {
          setViewMode('compare');
      }
  };

  const removeFromComparison = (ticker: string) => {
      setComparisonList(comparisonList.filter(c => c.company.ticker !== ticker));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
      return (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4 font-inter">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
                </div>
              </div>
              <p className="animate-pulse text-lg font-medium text-slate-300 tracking-tight">
                  {loadingStatus || "Finance Source AI analyse..."}
              </p>
              <div className="flex flex-col items-center gap-1 text-xs font-mono text-slate-600">
                  <span>Agrégation des blocs institutionnels...</span>
                  <span>Profilage du Business Model...</span>
                  <span>Calcul des indices ISC & IDBF...</span>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 cursor-pointer" onClick={() => setViewMode('single')}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">FS</div>
                <span className="font-bold text-lg tracking-tight text-white">Finance Source</span>
             </div>
             
             {/* View Toggles */}
             <div className="hidden md:flex bg-slate-800 rounded-lg p-1 border border-slate-700 items-center">
                <button 
                    onClick={() => setViewMode('single')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'single' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                    Analyse Unique
                </button>
                <button 
                    onClick={() => setViewMode('compare')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'compare' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                    <Layers size={14} /> 
                    Comparateur <span className="bg-slate-900 px-1.5 rounded text-xs text-slate-500">{comparisonList.length}</span>
                </button>
                <div className="w-px h-4 bg-slate-600 mx-2"></div>
                <button 
                    onClick={loadOREScenario}
                    title="Ajouter les structures de fonds (Vanguard, BlackRock...) à l'analyse courante"
                    className="px-3 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 text-indigo-400 hover:text-indigo-300 hover:bg-slate-700">
                    <Zap size={14} className="fill-indigo-400" /> + ORE Engine
                </button>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Search Bar */}
             <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
                <input 
                    type="text" 
                    value={tickerInput}
                    onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    placeholder={viewMode === 'compare' ? "Batch (ex: TSLA, MSFT, GOOG)..." : "Ticker (ex: TSLA)..."}
                    className="bg-slate-900 border border-slate-700 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-80 transition-all text-white placeholder-slate-600 shadow-inner"
                />
             </div>
             
             {/* Analysis Button */}
             <button 
                onClick={() => handleAnalyze()}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-blue-500 shadow-lg shadow-blue-900/20 flex items-center gap-2">
                <Sparkles size={14} />
                {viewMode === 'compare' ? 'Ajouter' : 'Analyser'}
             </button>

             {/* Export Actions (Global) */}
             <div className="h-6 w-px bg-slate-700 mx-2 hidden md:block"></div>
             <div className="hidden md:flex items-center gap-2">
                <button onClick={() => downloadJSON(viewMode === 'compare' ? comparisonList : data)} title="Exporter JSON" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <FileJson size={18} />
                </button>
                <button onClick={() => downloadHTML(viewMode === 'compare' ? comparisonList : data)} title="Exporter HTML (Tableaux Complets)" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <FileCode size={18} />
                </button>
                 <button onClick={() => downloadMarkdown(viewMode === 'compare' ? comparisonList : data)} title="Exporter Markdown" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <FileText size={18} />
                </button>
                <button onClick={handlePrint} title="Imprimer / PDF" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <Printer size={18} />
                </button>
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 print:mt-0 print:max-w-none">
        
        {viewMode === 'compare' ? (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            {comparisonList.some(c => c.company.ticker === 'VANGUARD') ? <Zap className="text-indigo-500 fill-indigo-500" /> : <Layers className="text-blue-500" />} 
                            {comparisonList.some(c => c.company.ticker === 'VANGUARD') ? 'Ownership Resolution Engine (ORE)' : 'Deck Comparatif'}
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                             {comparisonList.some(c => c.company.ticker === 'VANGUARD') ? 'Analyse forensic combinée : Entreprises cibles + Structures de contrôle.' : 'Comparaison structurelle côte-à-côte.'}
                        </p>
                    </div>
                    <div className="text-sm text-slate-500 font-mono">
                        {comparisonList.length} slots actifs
                    </div>
                </div>
                <ComparisonView companies={comparisonList} onRemove={removeFromComparison} />
             </div>
        ) : (
            /* SINGLE VIEW MODE */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-end mb-4">
                     <button 
                        onClick={addToComparison}
                        className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                        <Plus size={14} /> Ajouter {data.company.ticker} au Comparateur
                     </button>
                </div>

                <div className="break-inside-avoid">
                   <CompanyHeader data={data} />
                </div>

                <div className="break-inside-avoid">
                   <CompanyProfile data={data} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="break-inside-avoid">
                            <ISCRadar indices={data.indices} />
                        </div>
                        
                        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 break-inside-avoid shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertTriangle size={14} /> Leviers de Pression
                            </h3>
                            <div className="space-y-3">
                                {data.pressure_levers.map((lever, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors">
                                        <div>
                                            <div className="text-sm font-medium text-slate-200">{lever.force}</div>
                                            <div className="text-xs text-slate-500">{lever.type}</div>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold border
                                            ${lever.strength === 'high' ? 'bg-rose-950/30 text-rose-400 border-rose-900/50' : 
                                              lever.strength === 'medium' ? 'bg-amber-950/30 text-amber-400 border-amber-900/50' : 
                                              'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                            {lever.strength}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnalysisCard 
                                title="Contrôle Formel" 
                                code="CF" 
                                result={data.analysis.formal_control} 
                                color="text-blue-400" 
                                icon={<Gavel size={18} />}
                            />
                            <AnalysisCard 
                                title="Contrôle Capital" 
                                code="CC" 
                                result={data.analysis.capital_control} 
                                color="text-indigo-400" 
                                icon={<Wallet size={18} />}
                            />
                            <AnalysisCard 
                                title="Contrainte Marché" 
                                code="CM" 
                                result={data.analysis.market_constraint} 
                                color="text-sky-400" 
                                icon={<Activity size={18} />}
                            />
                            <AnalysisCard 
                                title="Puissance Revenus" 
                                code="CR" 
                                result={data.analysis.revenue_power} 
                                color="text-emerald-400" 
                                icon={<DollarSign size={18} />}
                            />
                            <AnalysisCard 
                                title="Puissance Productive" 
                                code="CP" 
                                result={data.analysis.productive_power} 
                                color="text-violet-400" 
                                icon={<Cpu size={18} />}
                            />
                             <AnalysisCard 
                                title="Régulation" 
                                code="REG" 
                                result={data.analysis.regulatory} 
                                color="text-rose-400" 
                                icon={<Scale size={18} />}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-12 break-inside-avoid">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            <ArrowRight size={20} className="text-blue-500"/> Actionnariat & Dominance
                        </h2>
                        <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">Powered by Gemini 2.0 Flash</span>
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
