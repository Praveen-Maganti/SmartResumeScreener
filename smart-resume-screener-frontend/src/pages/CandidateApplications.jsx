import React, { useState, useEffect } from 'react';
import { applicationsService, jobsService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Clock, XCircle, CheckCircle, Briefcase, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CandidateApplications() {
  const [applications, setApplications] = useState([]);
  const [jobsData, setJobsData] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [user.userId]);

  const fetchData = async () => {
    try {
      const apps = await applicationsService.getCandidateApplications(user.userId);
      setApplications(apps);
      
      // Fetch job details for each application
      const allJobs = await jobsService.getAll();
      const jobMap = {};
      allJobs.forEach(job => {
        jobMap[job.id] = job;
      });
      setJobsData(jobMap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>;

  const ongoingApps = applications.filter(app => app.status !== 'REJECTED' && app.status !== 'WITHDRAWN');
  const archivedApps = applications.filter(app => app.status === 'REJECTED');

  const getStatusColor = (status) => {
    switch(status) {
      case 'APPLIED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'IN_REVIEW': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'INTERVIEW': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'OFFERED': 
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusDescription = (status) => {
    switch(status) {
      case 'APPLIED': return 'Application Received';
      case 'IN_REVIEW': return 'Under HR Review';
      case 'INTERVIEW': return 'Selected for Interview';
      case 'OFFERED': 
      case 'APPROVED': return 'Offer Extended';
      case 'REJECTED': return 'Not Moving Forward';
      default: return status;
    }
  };

  const AppCard = ({ app }) => {
    const job = jobsData[app.jobId];
    if (!job) return null;

    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Briefcase size={14}/> Job #{job.id}</span>
            <span>&bull;</span>
            <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Stage</div>
            <div className={`px-4 py-1.5 rounded-full font-bold text-sm border inline-block ${getStatusColor(app.status)}`}>
              {getStatusDescription(app.status)}
            </div>
          </div>
          
          {app.status !== 'REJECTED' && app.status !== 'WITHDRAWN' && (
            <button 
              onClick={async () => {
                if (window.confirm("Are you sure you want to withdraw your application?")) {
                  try {
                    await applicationsService.updateStage(app.id, 'WITHDRAWN');
                    fetchData();
                  } catch (e) {
                    alert("Failed to withdraw application.");
                  }
                }
              }}
              className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition border border-transparent hover:border-red-200"
            >
              Withdraw
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/candidate/dashboard" className="hover:text-gray-900 transition">Dashboard</Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-900">Application Tracking</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Applications</h1>
        <p className="text-gray-600">Monitor the status of your ongoing interviews and past applications.</p>
      </div>

      {/* Ongoing Section */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 mb-4 pb-2 border-b border-gray-200">
          <Clock size={20} className="text-blue-500"/> 
          Ongoing ({ongoingApps.length})
        </h2>
        
        {ongoingApps.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200 border-dashed">
            <p className="text-gray-500">You don't have any ongoing applications right now.</p>
            <Link to="/candidate/jobs" className="text-blue-600 font-medium hover:underline mt-2 inline-block">Find a job to apply to</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ongoingApps.map(app => <AppCard key={app.id} app={app} />)}
          </div>
        )}
      </div>

      {/* Archived Section */}
      <div className="pt-8">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 mb-4 pb-2 border-b border-gray-200">
          <XCircle size={20} className="text-gray-500"/> 
          Rejected ({archivedApps.length})
        </h2>
        
        {archivedApps.length === 0 ? (
          <p className="text-gray-500 italic">No rejected applications.</p>
        ) : (
          <div className="space-y-4 opacity-75 grayscale hover:grayscale-0 transition duration-500">
            {archivedApps.map(app => <AppCard key={app.id} app={app} />)}
          </div>
        )}
      </div>
    </div>
  );
}
