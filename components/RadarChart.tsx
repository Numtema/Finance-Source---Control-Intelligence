
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
              <PolarGrid stroke="#475569" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
              <Radar
                name="Control Score"
                dataKey="A"
                stroke="#818cf8"
                strokeWidth={2}
                fill="#6366f1"
                fillOpacity={0.4}
              />
            </RadarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="w-full h-[300px] bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex flex-col">
      <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider shrink-0">Architecture du Pouvoir</h3>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#475569" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
            <Radar
              name="Control Score"
              dataKey="A"
              stroke="#818cf8"
              strokeWidth={2}
              fill="#6366f1"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
