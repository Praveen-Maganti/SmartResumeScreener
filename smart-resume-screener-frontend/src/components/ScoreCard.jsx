import React from 'react';

export default function ScoreCard({ title, value, icon: Icon, change, changeType, subtext, color = 'blue' }) {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-50/80 border-blue-100',
    green: 'text-emerald-600 bg-emerald-50/80 border-emerald-100',
    amber: 'text-amber-600 bg-amber-50/80 border-amber-100',
    red: 'text-rose-600 bg-rose-50/80 border-rose-100',
    purple: 'text-violet-600 bg-violet-50/80 border-violet-100'
  };

  const borderMap = {
    blue: 'border-l-blue-500',
    green: 'border-l-emerald-500',
    amber: 'border-l-amber-500',
    red: 'border-l-rose-500',
    purple: 'border-l-violet-500'
  };

  return (
    <div className={`bg-white p-5 rounded-xl border border-slate-200 border-l-4 ${borderMap[color]} shadow-sm flex items-start justify-between transition-all duration-200 hover:shadow-md animate-fade-in-up`}>
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{title}</span>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
        
        {change && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
              changeType === 'increase' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {changeType === 'increase' ? '↑' : '↓'} {change}
            </span>
            <span className="text-slate-400 text-[10px] font-medium">{subtext}</span>
          </div>
        )}
        
        {!change && subtext && (
          <p className="text-[10px] text-slate-400 font-medium mt-1.5">{subtext}</p>
        )}
      </div>
      
      {Icon && (
        <div className={`p-2.5 rounded-lg border ${colorMap[color]}`}>
          <Icon className="h-5 w-5 shrink-0" />
        </div>
      )}
    </div>
  );
}
