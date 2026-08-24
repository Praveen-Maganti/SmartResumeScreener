import React from 'react';
import { Check, Loader2 } from 'lucide-react';

export default function ProgressBar({ stages, currentStageIndex }) {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-fade-in-up">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
        AI Screening Pipeline
      </h4>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 relative">
        
        {/* Connection line for larger screens */}
        <div className="hidden md:block absolute top-5 left-8 right-8 h-0.5 bg-slate-100 -z-10">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
          />
        </div>

        {stages.map((stage, idx) => {
          const isCompleted = idx < currentStageIndex;
          const isActive = idx === currentStageIndex;
          const isPending = idx > currentStageIndex;

          return (
            <div key={stage} className="flex md:flex-col items-center gap-3 md:text-center flex-1 relative">
              {/* Step circle */}
              <div 
                className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-350 shrink-0 ${
                  isCompleted 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : isActive
                      ? 'bg-white border-blue-500 text-blue-600 shadow-md shadow-blue-500/10 animate-pulse-border'
                      : 'bg-white border-slate-200 text-slate-350'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 stroke-[2.5]" />
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="text-xs font-bold font-mono">{idx + 1}</span>
                )}
              </div>

              {/* Step info */}
              <div className="space-y-0.5">
                <span 
                  className={`text-xs font-bold tracking-tight block ${
                    isActive ? 'text-blue-600 font-extrabold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {stage}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  {isCompleted ? 'Completed' : isActive ? 'Processing...' : 'Queueing'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
