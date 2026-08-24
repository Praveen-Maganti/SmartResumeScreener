import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, FileCheck2, UserCheck, Plus, ArrowRight } from 'lucide-react';
import { jobsService, candidatesService } from '../services/api';
import ScoreCard from '../components/ScoreCard';
import CandidateCard from '../components/CandidateCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalCandidates: 0,
    screenedCount: 0,
    shortlistedCount: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentCandidates, setRecentCandidates] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const jobs = await jobsService.getAll();
        const candidates = await candidatesService.getAll();

        const activeJobs = jobs.filter(j => j.status === 'Active').length;
        const totalCandidates = candidates.length;
        const screenedCount = candidates.length; // Mock count
        const shortlistedCount = candidates.filter(
          c => c.recommendation === 'STRONG SHORTLIST' || c.recommendation === 'SHORTLIST'
        ).length;

        setStats({
          activeJobs,
          totalCandidates,
          screenedCount,
          shortlistedCount
        });

        setRecentJobs(jobs.slice(0, 3));
        setRecentCandidates(candidates.slice(0, 4));
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Welcome back, Sarah</h3>
          <p className="text-xs text-slate-500 font-medium">Here's a snapshot of your AI screening console today.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/admin/create-job')}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <Plus className="h-3.5 w-3.5 text-white" />
            <span>Create Job</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <ScoreCard 
          title="Active Jobs" 
          value={stats.activeJobs} 
          icon={Briefcase} 
          change="12%" 
          changeType="increase" 
          subtext="since last month"
          color="blue"
        />
        <ScoreCard 
          title="Total Candidates" 
          value={stats.totalCandidates} 
          icon={Users} 
          change="8%" 
          changeType="increase" 
          subtext="since last week"
          color="purple"
        />
        <ScoreCard 
          title="Screened Candidates" 
          value={stats.screenedCount} 
          icon={FileCheck2} 
          change="24" 
          changeType="increase" 
          subtext="screened today"
          color="green"
        />
        <ScoreCard 
          title="Shortlisted Candidates" 
          value={stats.shortlistedCount} 
          icon={UserCheck} 
          change="4%" 
          changeType="decrease" 
          subtext="vs last month"
          color="amber"
        />
      </div>

      {/* Bottom Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Candidates List (8 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">Recent Candidate Screenings</h3>
            <button 
              onClick={() => navigate('/candidates')}
              className="text-blue-500 hover:text-blue-700 text-xs font-bold inline-flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentCandidates.length > 0 ? (
              recentCandidates.map((candidate) => (
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate} 
                  onClick={() => navigate(`/candidates/${candidate.id}`)}
                />
              ))
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400 font-medium">
                No candidates screened yet. Upload resumes to get started.
              </div>
            )}
          </div>
        </div>

        {/* Active Jobs Overview (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">Active Jobs Overview</h3>
            <button 
              onClick={() => navigate('/jobs')}
              className="text-blue-500 hover:text-blue-700 text-xs font-bold inline-flex items-center gap-1 transition-colors"
            >
              <span>Manage Jobs</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-150 shadow-sm overflow-hidden">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div 
                  key={job.id} 
                  onClick={() => navigate(`/jobs?jobId=${job.id}`)}
                  className="p-5 hover:bg-slate-50/50 cursor-pointer transition-colors duration-150"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800 text-xs tracking-tight hover:text-blue-600 transition-colors">
                      {job.title}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      job.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' 
                        : 'bg-slate-50 text-slate-500 border border-slate-250'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Candidates: <strong className="text-slate-600">{job.candidatesScreened}</strong>
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Avg Fit Score: <strong className="text-blue-600">{job.avgScore}%</strong>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 font-medium">
                No jobs created yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
