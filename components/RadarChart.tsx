
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ControlIndex } from '../types';

interface Props {
  indices: ControlIndex;
  minimal?: boolean;
}

export const ISCRadar: React.FC<Props> = ({ indices, minimal }) => {
  const data = [
    { subject: 'Formel (CF)', A: indices.CF, fullMark: 10 },
    { subject: 'Capital (CC)', A: indices.CC, fullMark: 10 },
    { subject: 'Marché (CM)', A: indices.CM, fullMark: 10 },
    { subject: 'Revenus (CR)', A: indices.CR, fullMark: 10 },
    { subject: 'Productif (CP)', A: indices.CP, fullMark: 10 },
  ];

  if (minimal) {
    return (
      <div className="w-full h-full min-h-0 min-w-0">
         <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="#475569" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
              <Radar
                name="Control Score"
                dataKey="A"
                stroke="#6366f1"
                strokeWidth={3}
                fill="#6366f1"
                fillOpacity={0.5}
              />
            </RadarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="w-full h-[320px] bg-[#1c202e]/60 backdrop-blur-md rounded-[2rem] p-6 border border-white/5 flex flex-col shadow-xl">
      <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest shrink-0">Architecture du Pouvoir</h3>
      <div className="flex-1 min-h-0 w-full -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#475569" strokeDasharray="4 4" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
            <Radar
              name="Control Score"
              dataKey="A"
              stroke="#6366f1"
              strokeWidth={3}
              fill="#6366f1"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
