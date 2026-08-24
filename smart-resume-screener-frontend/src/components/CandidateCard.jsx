import React from 'react';
import { ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import SkillBadge from './SkillBadge';

export default function CandidateCard({ candidate, onClick }) {
  const { name, score, recommendation, skills, experience, appliedRole } = candidate;

  // Color mapping based on recommendation status
  const getBadgeColor = (rec) => {
    switch (rec?.toUpperCase()) {
      case 'STRONG SHORTLIST':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SHORTLIST':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'REVIEW':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Color for the score circle
  const getScoreColor = (sc) => {
    if (sc >= 85) return 'text-emerald-500 stroke-emerald-500';
    if (sc >= 70) return 'text-blue-500 stroke-blue-500';
    return 'text-amber-500 stroke-amber-500';
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group animate-fade-in-up"
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Circular Progress Gauge */}
        <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="24"
              className="stroke-slate-100 fill-none"
              strokeWidth="4"
            />
            <circle
              cx="28"
              cy="28"
              r="24"
              className={`fill-none transition-all duration-500 ${getScoreColor(score)}`}
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - score / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="text-sm font-bold text-slate-800">{score}%</span>
        </div>

        {/* Candidate Details */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{name}</h4>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${getBadgeColor(recommendation)}`}>
              {recommendation}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {appliedRole} • {experience} years experience
          </p>

          {/* Quick Skill Badges preview (first 3) */}
          <div className="flex flex-wrap gap-1 mt-2">
            {skills?.slice(0, 3).map((skill, idx) => (
              <SkillBadge key={idx} name={skill.name} status={skill.status} />
            ))}
            {skills?.length > 3 && (
              <span className="text-[10px] text-slate-400 font-semibold self-center ml-1">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrow */}
      <div className="p-2 text-slate-350 bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-lg transition-all ml-4 shrink-0 border border-slate-150">
        <ChevronRight className="h-4 w-4" />
      </div>
    </div>
  );
}
