import React from 'react';
import { Quote, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import SkillBadge from './SkillBadge';

export default function EvidenceCard({ evidence }) {
  const { skill, required, status, text, resumeSnippet } = evidence;

  const statusThemes = {
    matched: {
      border: 'border-emerald-200 bg-emerald-50/10',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
      title: 'Requirement Fulfilled'
    },
    partial: {
      border: 'border-amber-200 bg-amber-50/10',
      icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
      title: 'Partially Fulfilled'
    },
    missing: {
      border: 'border-rose-200 bg-rose-50/10',
      icon: <HelpCircle className="h-4 w-4 text-rose-600" />,
      title: 'Gap Identified'
    }
  };

  const theme = statusThemes[status] || statusThemes.matched;

  return (
    <div className={`border rounded-xl p-5 shadow-sm bg-white ${theme.border} transition-all duration-200 hover:shadow-md animate-fade-in-up`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {theme.icon}
          <span className="font-bold text-slate-800 text-sm tracking-tight">{skill}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Requirement:</span>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            {required}
          </span>
          <SkillBadge name={status.toUpperCase()} status={status} />
        </div>
      </div>

      {/* Rationale Explanation */}
      <div className="space-y-3">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
            AI Screening Analysis
          </span>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            {text}
          </p>
        </div>

        {/* Resume Quote Highlight */}
        {resumeSnippet && (
          <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-3.5 relative overflow-hidden group">
            <Quote className="absolute right-3 top-2 h-10 w-10 text-slate-100 shrink-0 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Resume Snippet / Evidence
            </span>
            <p className="text-xs text-slate-600 italic font-mono leading-relaxed relative z-10">
              "{resumeSnippet}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
