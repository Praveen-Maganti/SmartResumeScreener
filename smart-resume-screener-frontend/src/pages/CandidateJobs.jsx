import React, { useState, useEffect } from 'react';
import { jobsService, candidatesService, applicationsService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  Briefcase, UploadCloud, CheckCircle, XCircle, AlertTriangle, Lightbulb, 
  TrendingUp, MapPin, Building2, DollarSign, Clock, Search, Filter, Bookmark, Star
} from 'lucide-react';

export default function CandidateJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeJobId, setActiveJobId] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [screeningResult, setScreeningResult] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState({});
  const [applicationDates, setApplicationDates] = useState({});
  const [savedJobs, setSavedJobs] = useState({});
  const [expandedJDs, setExpandedJDs] = useState({});
  
  const safeParseArray = (data) => {
    if (Array.isArray(data)) return data;
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return [data]; // fallback to array with raw string
    }
  };

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("All");

  const { user } = useAuth();

  useEffect(() => {
    fetchJobsAndApplications();
  }, [user.userId]);

  const fetchJobsAndApplications = async () => {
    try {
      const allJobs = await jobsService.getAll();
      setJobs(allJobs);
      
      const apps = await applicationsService.getCandidateApplications(user.userId);
      const appMap = {};
      const dateMap = {};
      apps.forEach(app => {
        appMap[app.jobId] = app.status;
        dateMap[app.jobId] = new Date(app.appliedAt).toLocaleDateString();
      });
      setApplicationStatus(appMap);
      setApplicationDates(dateMap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleScreening = async (jobId) => {
    if (!resumeFile) return alert("Please select a resume first");
    try {
      const result = await candidatesService.screenCandidate(jobId, resumeFile);
      setScreeningResult(result);
    } catch (e) {
      alert("Error screening resume");
    }
  };

  const handleApply = async (jobId, explicitResumeId = null) => {
    try {
      const resumeIdToUse = explicitResumeId || (screeningResult ? screeningResult.resumeId : null);
      if (!resumeIdToUse) return alert("Missing resume ID for application");
      
      await applicationsService.apply(jobId, user.userId, resumeIdToUse);
      setApplicationStatus(prev => ({ ...prev, [jobId]: 'APPLIED' }));
      setApplicationDates(prev => ({ ...prev, [jobId]: new Date().toLocaleDateString() }));
      setScreeningResult(null);
      alert("Application submitted successfully!");
    } catch (e) {
      alert("Failed to apply");
    }
  };

  const handleApplyImmediately = async (jobId) => {
    if (!resumeFile) return alert("Please select a resume first");
    try {
      alert("Auto-uploading resume and applying...");
      const result = await candidatesService.screenCandidate(jobId, resumeFile);
      await handleApply(jobId, result.resumeId);
    } catch (e) {
      alert("Failed to apply immediately");
    }
  };

  const handleWithdraw = async (jobId) => {
    if (window.confirm("Are you sure you want to withdraw your application?")) {
      try {
        // Need to find the application ID for this job
        const apps = await applicationsService.getCandidateApplications(user.userId);
        const app = apps.find(a => a.jobId === jobId);
        if (app) {
          await applicationsService.updateStage(app.id, 'WITHDRAWN');
          setApplicationStatus(prev => ({ ...prev, [jobId]: 'WITHDRAWN' }));
        }
      } catch (e) {
        alert("Failed to withdraw application.");
      }
    }
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => ({...prev, [jobId]: !prev[jobId]}));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'APPLIED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'IN_REVIEW': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'INTERVIEW': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'OFFERED': 
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      case 'WITHDRAWN': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Derived Stats
  const totalApplied = Object.values(applicationStatus).filter(s => s !== 'WITHDRAWN' && s !== 'REJECTED').length;
  const shortlisted = Object.values(applicationStatus).filter(s => s === 'IN_REVIEW' || s === 'INTERVIEW' || s === 'OFFERED' || s === 'APPROVED').length;
  const interviews = Object.values(applicationStatus).filter(s => s === 'INTERVIEW').length;

  // Filtering
  const filteredJobs = jobs.filter(j => {
    const title = j.title || "";
    const company = j.companyName || "";
    const search = searchTerm || "";
    
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) || company.toLowerCase().includes(search.toLowerCase());
    const matchesMode = filterMode === "All" || j.workMode === filterMode;
    return matchesSearch && matchesMode;
  });

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>;

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="text-sm font-bold text-gray-500 uppercase">Total Jobs</div>
          <div className="text-2xl font-black text-gray-900">{jobs.length}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm text-center">
          <div className="text-sm font-bold text-blue-600 uppercase">Applied</div>
          <div className="text-2xl font-black text-blue-900">{totalApplied}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm text-center">
          <div className="text-sm font-bold text-purple-600 uppercase">Shortlisted</div>
          <div className="text-2xl font-black text-purple-900">{shortlisted}</div>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 shadow-sm text-center">
          <div className="text-sm font-bold text-amber-600 uppercase">Interviews</div>
          <div className="text-2xl font-black text-amber-900">{interviews}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm text-center">
          <div className="text-sm font-bold text-green-600 uppercase">Avg Match Score</div>
          <div className="text-2xl font-black text-green-900">--%</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between sticky top-16 z-20">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by job title or company..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={filterMode} 
            onChange={e => setFilterMode(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Job Board */}
      <div className="grid gap-6">
        {filteredJobs.map(job => {
          const appStatus = applicationStatus[job.id];
          const isApplied = appStatus && appStatus !== 'WITHDRAWN' && appStatus !== 'REJECTED';
          const isSaved = savedJobs[job.id];
          
          return (
          <div key={job.id} className={`bg-white rounded-2xl shadow-sm border ${isApplied ? 'border-blue-200' : 'border-gray-200'} overflow-hidden transition hover:shadow-md`}>
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                    {appStatus && (
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(appStatus)}`}>
                        {appStatus.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-medium text-gray-600 mb-4">
                    <span className="flex items-center gap-1.5"><Building2 size={16} className="text-blue-500"/> {job.companyName}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-red-500"/> {job.location}</span>
                    <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-purple-500"/> {job.workMode}</span>
                    <span className="flex items-center gap-1.5"><DollarSign size={16} className="text-green-500"/> {job.salaryRange}</span>
                    <span className="flex items-center gap-1.5"><Clock size={16} className="text-amber-500"/> Posted 2d ago</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Required Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {(job.requiredSkills || []).map((skill, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-bold">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
                    <button 
                      onClick={() => setExpandedJDs(prev => ({...prev, [job.id]: !prev[job.id]}))}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors focus:outline-none"
                    >
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        View Job Description
                      </span>
                      <div className={`transform transition-transform duration-300 ${expandedJDs[job.id] ? 'rotate-180' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </button>
                    
                    <div className={`transition-all duration-300 ease-in-out ${expandedJDs[job.id] ? 'max-h-[1000px] opacity-100 p-4 border-t border-gray-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons Column */}
                <div className="flex flex-col items-end gap-3 min-w-[200px] border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                  {isApplied ? (
                    <div className="w-full text-right">
                      <div className="text-sm font-medium text-gray-500 mb-4">Applied on {applicationDates[job.id]}</div>
                      <button 
                        onClick={() => handleWithdraw(job.id)}
                        className="w-full bg-white border border-red-200 text-red-600 px-5 py-2.5 rounded-lg font-bold hover:bg-red-50 transition shadow-sm mb-2"
                      >
                        Withdraw Application
                      </button>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={() => toggleSaveJob(job.id)}
                        className={`w-full border px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition ${isSaved ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                      >
                        <Bookmark size={18} className={isSaved ? "fill-current" : ""} />
                        {isSaved ? 'Saved' : 'Save Job'}
                      </button>
                      <button 
                        onClick={() => setActiveJobId(activeJobId === job.id ? null : job.id)}
                        className={`w-full px-5 py-2.5 rounded-lg font-bold transition shadow-sm ${activeJobId === job.id ? 'bg-gray-900 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'}`}
                      >
                        {activeJobId === job.id ? 'Cancel' : 'Evaluate & Apply'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* AI Evaluation Drawer */}
            {activeJobId === job.id && !isApplied && (
              <div className="bg-gray-50 p-6 border-t border-gray-100">
                {!screeningResult ? (
                  <div className="space-y-4 max-w-xl mx-auto">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UploadCloud size={32} />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Upload Resume for AI Match</h4>
                      <p className="text-sm text-gray-500 mb-6">See exactly how well your skills match this role before you apply.</p>
                      
                      <div className="flex flex-col gap-3">
                        <input 
                          type="file" 
                          onChange={(e) => setResumeFile(e.target.files[0])} 
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer border border-gray-200 rounded-lg p-1"
                        />
                        <div className="flex gap-3 mt-2">
                          <button 
                            onClick={() => handleScreening(job.id)}
                            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-gray-800 flex-1 flex items-center justify-center gap-2 transition"
                          >
                            <Star size={18} />
                            Get AI Match Score
                          </button>
                          <button 
                            onClick={() => handleApplyImmediately(job.id)}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 flex-1 flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/20"
                          >
                            <CheckCircle size={18} />
                            Apply Immediately
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Match Score UI */}
                      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100 min-w-[200px]">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                            <circle 
                              cx="50" cy="50" r="45" fill="none" 
                              stroke={screeningResult.score >= 80 ? '#22c55e' : screeningResult.score >= 50 ? '#f59e0b' : '#ef4444'} 
                              strokeWidth="10" 
                              strokeDasharray={`${screeningResult.score * 2.83} 283`}
                              className="transition-all duration-1000 ease-out"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-gray-900">{screeningResult.score}%</span>
                            <span className="text-xs font-bold text-gray-500 uppercase">Match</span>
                          </div>
                        </div>
                        <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-bold border ${
                          screeningResult.score >= 80 ? 'bg-green-100 text-green-700 border-green-200' : 
                          screeningResult.score >= 50 ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                          'bg-red-100 text-red-700 border-red-200'
                        }`}>
                          {screeningResult.score >= 80 ? 'Excellent Fit' : screeningResult.score >= 50 ? 'Potential Fit' : 'Not a Fit'}
                        </div>
                      </div>
                      
                      {/* AI Feedback */}
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">AI Evaluation Results</h4>
                        <p className="text-gray-600 mb-6">{screeningResult.summary}</p>
                        
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-bold flex items-center gap-2 text-green-700 mb-2"><CheckCircle size={16}/> Matched Strengths</h5>
                              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                                {safeParseArray(screeningResult.strengths).map((s, i) => <li key={i}>{s}</li>)}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-bold flex items-center gap-2 text-red-700 mb-2"><XCircle size={16}/> Missing Skills</h5>
                              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                                {safeParseArray(screeningResult.weaknesses).map((s, i) => <li key={i}>{s}</li>)}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-bold flex items-center gap-2 text-blue-700 mb-2"><TrendingUp size={16}/> How to Improve</h5>
                              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                                {safeParseArray(screeningResult.improvementSuggestions).map((s, i) => <li key={i}>{s}</li>)}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-bold flex items-center gap-2 text-orange-700 mb-2"><AlertTriangle size={16}/> Dealbreakers</h5>
                              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                                {safeParseArray(screeningResult.unfitReasons).map((s, i) => <li key={i}>{s}</li>)}
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                          <button onClick={() => setScreeningResult(null)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Discard & Try Again</button>
                          <button onClick={() => handleApply(job.id)} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-500/30 transition">
                            <CheckCircle size={18} />
                            Submit Application
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )})}
      </div>
    </div>
  );
}
