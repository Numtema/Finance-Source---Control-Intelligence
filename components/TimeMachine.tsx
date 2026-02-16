
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoricalPoint } from '../types';
import { History, Zap } from 'lucide-react';

interface Props {
  history?: HistoricalPoint[];
  onGenerate: () => void;
  isLoading: boolean;
}

export const TimeMachine: React.FC<Props> = ({ history, onGenerate, isLoading }) => {
  if (!history) {
    return (
      <div className="bg-[#1c202e]/60 backdrop-blur-md rounded-[2rem] border border-white/5 p-8 flex flex-col items-center justify-center h-[350px] shadow-xl relative overflow-hidden group">
         {/* Animated background */}
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
         
         <div className="bg-white/5 p-6 rounded-full mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500">
            <History size={48} className="text-slate-400 group-hover:text-white transition-colors" />
         </div>
         
         <h3 className="text-xl font-bold text-white mb-2">Time Machine Inactive</h3>
         <p className="text-slate-400 text-center max-w-sm mb-8 text-sm">
            Activez l'Intelligence Artificielle pour reconstruire l'historique actionnarial et projeter les tendances.
         </p>
         
         <button 
            onClick={onGenerate}
            disabled={isLoading}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
         >
            {isLoading ? (
                <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Reconstruction Temporelle...
                </>
            ) : (
                <>
                    <Zap size={18} /> Générer Historique (2015-2025)
                </>
            )}
         </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1c202e]/60 backdrop-blur-md rounded-[2rem] border border-white/5 p-6 shadow-xl h-[350px] flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <History size={14} /> Dynamique Temporelle
            </h3>
            <div className="text-[10px] text-slate-500 font-medium mt-1">Évolution de la détention (Passive vs Active)</div>
        </div>
        <div className="flex gap-4">
             <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Passive
             </div>
             <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-600"></span> Active
             </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPassive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#475569" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#475569" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
            <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10 }} 
                tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: '#94a3b8', marginBottom: '5px', fontSize: '10px' }}
            />
            <Area 
                type="monotone" 
                dataKey="active_percent" 
                stackId="1" 
                stroke="#475569" 
                fill="url(#colorActive)" 
                strokeWidth={2}
                name="Active Funds"
            />
            <Area 
                type="monotone" 
                dataKey="passive_percent" 
                stackId="2" // Stacked to show total institutional roughly? Or separate lines. Let's do separate lines for clarity on trends.
                stroke="#6366f1" 
                fill="url(#colorPassive)" 
                strokeWidth={3}
                name="Passive Giants"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
