/**
 * Returns Tailwind text and background color classes based on the match score percentage.
 */
export const getScoreColorClass = (score) => {
  if (score >= 85) {
    return {
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      progress: 'bg-emerald-500'
    };
  }
  if (score >= 70) {
    return {
      text: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      progress: 'bg-blue-500'
    };
  }
  if (score >= 50) {
    return {
      text: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      progress: 'bg-amber-500'
    };
  }
  return {
    text: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    progress: 'bg-rose-500'
  };
};

/**
 * Formats a recommendation state with corresponding UI colors.
 */
export const getRecommendationBadgeClass = (rec) => {
  switch (rec?.toUpperCase()) {
    case 'STRONG SHORTLIST':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'SHORTLIST':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'REVIEW':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-55 text-slate-700 border-slate-200';
  }
};

/**
 * Truncates text with trailing ellipses.
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
