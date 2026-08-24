import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ShieldCheck, Mail, Calendar, FileDown, CheckCircle, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import { candidatesService, applicationsService } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import EvidenceCard from '../components/EvidenceCard';
import { getScoreColorClass, getRecommendationBadgeClass } from '../utils/helpers';

export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandidate() {
      setLoading(true);
      try {
        const data = await candidatesService.getById(id);
        setCandidate(data);
      } catch (err) {
        console.error('Error loading candidate:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm font-semibold text-slate-500">Candidate profile not found.</p>
        <button 
          onClick={() => navigate('/candidates')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  const scoreColors = getScoreColorClass(candidate.score);

  // Split skills into categories
  const matchedSkills = candidate.skills?.filter(s => s.status === 'matched') || [];
  const partialSkills = candidate.skills?.filter(s => s.status === 'partial') || [];
  const missingSkills = candidate.skills?.filter(s => s.status === 'missing') || [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Back to Leaderboard */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 font-bold transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Candidate Rankings</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Detailed Evidence & Profile (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 tracking-tight">{candidate.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-slate-500 font-medium">{candidate.appliedRole}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    candidate.status === 'APPROVED' ? 'bg-green-100 text-green-700 border-green-200' :
                    candidate.status === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-200' :
                    candidate.status === 'INTERVIEW' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    'bg-blue-100 text-blue-700 border-blue-200'
                  }`}>
                    {candidate.status}
                  </span>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors">
              <FileDown className="h-3.5 w-3.5 text-blue-500" />
              <span>Export PDF Report</span>
            </button>
          </div>

          {/* AI Fit Analysis Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span>AI Fit Evaluation & Summary</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-150">
              {candidate.summary}
            </p>
          </div>

          {/* Core Match Breakdown (Slider Categories) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">Requirement Fit Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Category 1: Skills */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Skills Matching</span>
                  <span className="text-blue-600">
                    {Math.round(candidate.score * 0.95)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${candidate.score * 0.95}%` }}></div>
                </div>
              </div>

              {/* Category 2: Experience */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Experience Alignment</span>
                  <span className="text-emerald-600">
                    {candidate.experience >= 4 ? '100%' : '75%'}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: candidate.experience >= 4 ? '100%' : '75%' }}></div>
                </div>
              </div>

              {/* Category 3: Education */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Education Match</span>
                  <span className="text-indigo-600">100%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '100%' }}></div>
                </div>
              </div>

            </div>
          </div>

          {/* Matched Evidence explaining WHY each skill was matched (MOST IMPORTANT) */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">AI Generated Verification Evidence</h3>
            <div className="space-y-4">
              {candidate.evidence?.map((ev, idx) => (
                <EvidenceCard key={idx} evidence={ev} />
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - Score & Action details (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Fit score circle card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Overall AI Fit Score
            </span>
            
            {/* Visual circle progress */}
            <div className="relative h-28 w-28 mx-auto flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="48" className="stroke-slate-100 fill-none" strokeWidth="6" />
                <circle 
                  cx="56" 
                  cy="56" 
                  r="48" 
                  className={`fill-none transition-all duration-700 ${scoreColors.text} stroke-current`} 
                  strokeWidth="6" 
                  strokeDasharray={`${2 * Math.PI * 48}`}
                  strokeDashoffset={`${2 * Math.PI * 48 * (1 - candidate.score / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center">
                <span className="text-2xl font-extrabold text-slate-800 block leading-none">{candidate.score}%</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Fit Index</span>
              </div>
            </div>

            <div className="pt-2">
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${getRecommendationBadgeClass(candidate.recommendation)}`}>
                {candidate.recommendation}
              </span>
            </div>
          </div>

          {/* Experience and Education attributes */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Candidate Profile Parameters</h4>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-150">
                <span className="text-slate-400 font-semibold">Experience</span>
                <strong className="text-slate-800">{candidate.experience} Years</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold col-span-1">Education</span>
                <strong className="text-slate-800 text-right truncate pl-4">{candidate.education}</strong>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses (Skill Gaps) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            {/* Strengths */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-emerald-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Extracted Strengths</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 font-medium pl-1 list-disc list-inside">
                {candidate.strengths?.map((st, idx) => (
                  <li key={idx} className="leading-relaxed">{st}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses / Gaps */}
            <div className="space-y-2.5 pt-4 border-t border-slate-150">
              <h4 className="font-bold text-rose-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-rose-600" />
                <span>Gaps / Weaknesses</span>
              </h4>
              {candidate.weaknesses?.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-slate-600 font-medium pl-1 list-disc list-inside">
                  {candidate.weaknesses.map((wk, idx) => (
                    <li key={idx} className="leading-relaxed">{wk}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 font-semibold italic">No significant technology gaps discovered.</p>
              )}
            </div>
          </div>

          {/* Application Pipeline Stage Tracker */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Application Pipeline</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><CheckCircle size={16} /></div>
                <div className="flex-1 border-b pb-1">
                  <p className="text-sm font-bold text-gray-900">Applied</p>
                  <p className="text-xs text-gray-500">Initial Application Received</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><CheckCircle size={16} /></div>
                <div className="flex-1 border-b pb-1">
                  <p className="text-sm font-bold text-gray-900">AI Screened</p>
                  <p className="text-xs text-gray-500">Matched via LlmService</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">3</div>
                <div className="flex-1 border-b pb-1">
                  <p className="text-sm font-bold text-gray-500">Interview</p>
                  <p className="text-xs text-gray-400">Pending Scheduling</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-6">
              <button 
                onClick={async () => {
                  try {
                    await applicationsService.updateStageByResume(candidate.jobId, candidate.resumeId, 'APPROVED');
                    alert('Candidate moved to Interview stage!');
                  } catch (e) {
                    alert('Error updating status');
                  }
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Move to Interview</span>
              </button>
              <button 
                onClick={async () => {
                  try {
                    await applicationsService.updateStageByResume(candidate.jobId, candidate.resumeId, 'REJECTED');
                    alert('Candidate rejected.');
                  } catch (e) {
                    alert('Error updating status');
                  }
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold border border-rose-200/50 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
