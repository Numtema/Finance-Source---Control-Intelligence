
import React from 'react';
import { CompanyData } from '../types';
import { MapPin, Globe, History, Layers, Box, Link2 } from 'lucide-react';

interface Props {
  data: CompanyData;
}

export const CompanyProfile: React.FC<Props> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Identity Card */}
      <div className="lg:col-span-2 bg-[#1c202e]/60 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group shadow-xl">
        {/* Subtle decorative blob */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-700"></div>
        
        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Layers size={14} /> Identité & Business Model
        </h3>
        
        <p className="text-xl text-slate-200 leading-relaxed font-normal mb-8 max-w-2xl">
            {data.profile.description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/5">
             <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1.5 flex items-center gap-1.5"><MapPin size={12} /> Headquarters</div>
                <div className="text-sm font-semibold text-white">{data.profile.headquarters}</div>
             </div>
             <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1.5 flex items-center gap-1.5"><History size={12} /> Founded</div>
                <div className="text-sm font-semibold text-white">{data.profile.founded}</div>
             </div>
             <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1.5 flex items-center gap-1.5"><Globe size={12} /> Website</div>
                <a href={`https://${data.profile.website}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline decoration-blue-400/30">
                    {data.profile.website} <Link2 size={10} />
                </a>
             </div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1.5">Market Cap</div>
                <div className="text-sm font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md inline-block">{data.profile.market_cap}</div>
             </div>
        </div>
      </div>

      {/* Products & Assets Card */}
      <div className="lg:col-span-1 bg-[#1c202e]/60 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 shadow-xl flex flex-col justify-between">
         <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Box size={14} /> Produits & Actifs Clés
            </h3>
            <div className="flex flex-wrap gap-2">
                {data.products.map((prod, idx) => (
                    <span key={idx} className="bg-white/5 hover:bg-white/10 border border-white/5 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-full transition-colors cursor-default">
                        {prod.name}
                    </span>
                ))}
            </div>
         </div>
        
        <div className="mt-8 pt-6 border-t border-white/5">
             <div className="text-[10px] text-slate-500 font-bold mb-3 uppercase tracking-widest">Leadership</div>
             {data.visual_assets.executives.map((exec, i) => (
                 <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white overflow-hidden ring-2 ring-white/10">
                        {exec.name[0]}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white leading-none mb-1">{exec.name}</div>
                        <div className="text-xs text-indigo-400 font-medium">{exec.role}</div>
                    </div>
                 </div>
             ))}
        </div>
      </div>
    </div>
  );
};
