import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Award, Briefcase, ChevronRight, Filter, ShieldCheck, UserCheck } from 'lucide-react';
import { candidatesService, jobsService } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import { getScoreColorClass, getRecommendationBadgeClass } from '../utils/helpers';

export default function ScreeningResults() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const jobsData = await jobsService.getAll();
        setJobs(jobsData);

        // Preselect job based on query param or default to first job
        const queryJobId = searchParams.get('jobId') || '';
        if (queryJobId && jobsData.some(j => j.id === queryJobId)) {
          setSelectedJobId(queryJobId);
        } else if (jobsData.length > 0) {
          setSelectedJobId(jobsData[0].id);
        }
      } catch (err) {
        console.error('Error fetching jobs for results:', err);
      }
    }
    loadData();
  }, [searchParams]);

  useEffect(() => {
    async function loadCandidates() {
      if (!selectedJobId) return;
      setLoading(true);
      try {
        const data = await candidatesService.getAll(selectedJobId);
        // Sort descending by score
        const sorted = [...data].sort((a, b) => b.score - a.score);
        setCandidates(sorted);
      } catch (err) {
        console.error('Error loading candidates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, [selectedJobId]);

  const handleJobChange = (e) => {
    const id = e.target.value;
    setSelectedJobId(id);
    setSearchParams({ jobId: id });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header and Job Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">AI Screening Results</h3>
          <p className="text-xs text-slate-500 font-medium">Ranked matches for current positions based on semantic alignment models.</p>
        </div>

        {/* Job selector dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-bold uppercase whitespace-nowrap">Filter Role:</span>
          <div className="relative">
            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <select
              value={selectedJobId}
              onChange={handleJobChange}
              className="bg-white border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-700 appearance-none cursor-pointer"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Leaderboard List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : candidates.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-150">
          
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-12 px-6 py-3.5 bg-slate-50/50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-3">Candidate</div>
            <div className="col-span-2 text-center">Match Score</div>
            <div className="col-span-2 text-center">Recommendation</div>
            <div className="col-span-3">Skills Map Preview</div>
            <div className="col-span-1 text-right">Profile</div>
          </div>

          {/* Table Rows */}
          {candidates.map((candidate, index) => {
            const colors = getScoreColorClass(candidate.score);
            const rank = index + 1;

            return (
              <div 
                key={candidate.id}
                onClick={() => navigate(`/candidates/${candidate.id}`)}
                className="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-4 hover:bg-slate-50/50 cursor-pointer transition-colors duration-150 gap-4 md:gap-0"
              >
                {/* Rank Badge */}
                <div className="col-span-1 flex justify-start md:justify-center items-center gap-2 md:gap-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block md:hidden">Rank:</span>
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    rank === 1 
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                      : rank === 2 
                        ? 'bg-slate-100 text-slate-700 border border-slate-200' 
                        : rank === 3 
                          ? 'bg-orange-50 text-orange-800 border border-orange-200'
                          : 'bg-white text-slate-400 border border-slate-200'
                  }`}>
                    #{rank}
                  </span>
                </div>

                {/* Candidate Name */}
                <div className="col-span-3">
                  <h4 className="font-bold text-slate-800 hover:text-blue-650 transition-colors text-sm">
                    {candidate.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    {candidate.experience} years experience
                  </span>
                </div>

                {/* Match Score Bar */}
                <div className="col-span-2 flex md:flex-col items-center justify-between md:justify-center gap-2 md:gap-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block md:hidden">Score:</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-extrabold ${colors.text}`}>
                      {candidate.score}%
                    </span>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden md:block">
                      <div className={`h-full ${colors.progress}`} style={{ width: `${candidate.score}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Recommendation Status */}
                <div className="col-span-2 flex items-center justify-between md:justify-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block md:hidden">Rec:</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getRecommendationBadgeClass(candidate.recommendation)}`}>
                    {candidate.recommendation}
                  </span>
                </div>

                {/* Skills map */}
                <div className="col-span-3 flex flex-wrap gap-1">
                  {candidate.skills?.slice(0, 3).map((sk, idx) => (
                    <SkillBadge key={idx} name={sk.name} status={sk.status} />
                  ))}
                  {candidate.skills?.length > 3 && (
                    <span className="text-[9px] text-slate-400 font-semibold self-center ml-1">
                      +{candidate.skills.length - 3} more
                    </span>
                  )}
                </div>

                {/* Action button */}
                <div className="col-span-1 flex justify-end">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/candidates/${candidate.id}`);
                    }}
                    className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-450 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4">
          <div className="inline-flex p-4 bg-slate-50 border border-slate-200 rounded-full text-slate-400">
            <Filter className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">No candidates screened yet for this job</h4>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Select "Screen Resumes" to parse candidate applications and generate scores.
            </p>
          </div>
          <button
            onClick={() => navigate(`/screening?jobId=${selectedJobId}`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            Start Screening
          </button>
        </div>
      )}
    </div>
  );
}
