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
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-slate-900 ${color} border border-slate-800`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-200">{title}</h3>
            <span className="text-xs font-mono text-slate-500">{code} SCORE</span>
          </div>
        </div>
        <div className={`text-xl font-bold ${color}`}>{result.score}</div>
      </div>
      
      <p className="text-sm text-slate-300 font-medium mb-2 leading-relaxed">
        {result.summary}
      </p>
      
      {result.notes && (
        <div className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-700/50 leading-relaxed">
          {result.notes}
        </div>
      )}
    </div>
  );
};