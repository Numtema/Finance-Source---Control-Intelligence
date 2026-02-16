
import React from 'react';
import { StepResult } from '../types';

interface Props {
  title: string;
  code: string;
  result: StepResult;
  color: string;
  icon: React.ReactNode;
}

export const AnalysisCard: React.FC<Props> = ({ title, code, result, color, icon }) => {
  return (
    <div className="h-full bg-[#1c202e]/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:bg-[#1c202e]/80 hover:border-white/10 transition-all duration-300 group flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1">
      <div>
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-white/5 ${color} border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-lg text-slate-200 leading-tight">{title}</h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-60">{code} SCORE</span>
            </div>
            </div>
            <div className={`text-2xl font-black ${color} bg-white/5 px-3 py-1 rounded-xl border border-white/5 min-w-[3rem] text-center`}>{result.score}</div>
        </div>
        
        <p className="text-[15px] text-slate-300 font-medium mb-4 leading-relaxed opacity-90">
            {result.summary}
        </p>
      </div>
      
      {result.notes && (
        <div className="text-xs text-slate-500 mt-4 pt-4 border-t border-white/5 leading-relaxed font-medium bg-white/[0.02] -mx-6 -mb-6 p-6 rounded-b-3xl">
          {result.notes}
        </div>
      )}
    </div>
  );
};
