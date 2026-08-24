import React from 'react';
import { Check, AlertCircle, XCircle } from 'lucide-react';

export default function SkillBadge({ name, status = 'matched' }) {
  const statusStyles = {
    matched: 'bg-emerald-50/80 text-emerald-800 border-emerald-150',
    partial: 'bg-amber-50/80 text-amber-800 border-amber-150',
    missing: 'bg-rose-50/80 text-rose-800 border-rose-150',
  };

  const statusIcons = {
    matched: <Check className="h-3 w-3 text-emerald-600 shrink-0" />,
    partial: <AlertCircle className="h-3 w-3 text-amber-600 shrink-0" />,
    missing: <XCircle className="h-3 w-3 text-rose-600 shrink-0" />,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${statusStyles[status]}`}>
      {statusIcons[status]}
      <span>{name}</span>
    </span>
  );
}
