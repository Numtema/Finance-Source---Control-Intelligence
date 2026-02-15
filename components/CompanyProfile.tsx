import React from 'react';
import { CompanyData } from '../types';
import { MapPin, Globe, History, Layers, Box } from 'lucide-react';

interface Props {
  data: CompanyData;
}

export const CompanyProfile: React.FC<Props> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Main Identity Card */}
      <div className="lg:col-span-2 bg-slate-900/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
        
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers size={16} /> Identité & Business Model
        </h3>
        
        <p className="text-lg text-slate-200 leading-relaxed font-light mb-6">
            {data.profile.description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
             <div>
                <div className="text-xs text-slate-500 uppercase mb-1 flex items-center gap-1"><MapPin size={10} /> Headquarters</div>
                <div className="text-sm font-medium text-slate-300">{data.profile.headquarters}</div>
             </div>
             <div>
                <div className="text-xs text-slate-500 uppercase mb-1 flex items-center gap-1"><History size={10} /> Founded</div>
                <div className="text-sm font-medium text-slate-300">{data.profile.founded}</div>
             </div>
             <div>
                <div className="text-xs text-slate-500 uppercase mb-1 flex items-center gap-1"><Globe size={10} /> Website</div>
                <a href={`https://${data.profile.website}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-400 hover:underline">{data.profile.website}</a>
             </div>
              <div>
                <div className="text-xs text-slate-500 uppercase mb-1">Market Cap</div>
                <div className="text-sm font-bold text-emerald-400">{data.profile.market_cap}</div>
             </div>
        </div>
      </div>

      {/* Products & Assets Card */}
      <div className="lg:col-span-1 bg-slate-900/50 border border-slate-700 rounded-xl p-6">
         <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Box size={16} /> Produits & Actifs Clés
        </h3>
        <div className="flex flex-wrap gap-2">
            {data.products.map((prod, idx) => (
                <div key={idx} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm px-3 py-1.5 rounded-lg transition-colors cursor-default">
                    {prod.name}
                </div>
            ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-800">
             <div className="text-xs text-slate-500 mb-2 uppercase">Direction Exécutive</div>
             {data.visual_assets.executives.map((exec, i) => (
                 <div key={i} className="flex items-center gap-3 mt-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 overflow-hidden">
                        {exec.name[0]}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-white">{exec.name}</div>
                        <div className="text-xs text-slate-500">{exec.role}</div>
                    </div>
                 </div>
             ))}
        </div>
      </div>
    </div>
  );
};