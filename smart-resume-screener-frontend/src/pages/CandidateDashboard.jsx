import React, { useState, useEffect } from 'react';
import { applicationsService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Briefcase, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CandidateDashboard() {
  const [stats, setStats] = useState({ total: 0, ongoing: 0, rejected: 0, approved: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, [user.userId]);

  const fetchAnalytics = async () => {
    try {
      const apps = await applicationsService.getCandidateApplications(user.userId);
      const total = apps.length;
      let ongoing = 0, rejected = 0, approved = 0;
      
      apps.forEach(app => {
        if (app.status === 'REJECTED') rejected++;
        else if (app.status === 'OFFERED' || app.status === 'APPROVED') approved++;
        else ongoing++; // APPLIED, IN_REVIEW, INTERVIEW
      });
      
      setStats({ total, ongoing, rejected, approved });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back, {user.username}!</h1>
        <p className="text-gray-600">Here is a snapshot of your job search progress.</p>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Briefcase size={24} />
          </div>
          <div className="text-4xl font-black text-gray-900 mb-1">{stats.total}</div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Applied</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <Clock size={24} />
          </div>
          <div className="text-4xl font-black text-gray-900 mb-1">{stats.ongoing}</div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Ongoing</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={24} />
          </div>
          <div className="text-4xl font-black text-gray-900 mb-1">{stats.approved}</div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Offers</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <XCircle size={24} />
          </div>
          <div className="text-4xl font-black text-gray-900 mb-1">{stats.rejected}</div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Rejected</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/candidate/jobs" className="group bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Briefcase size={120} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Find a Job</h2>
          <p className="text-blue-200 mb-6 max-w-sm">Browse available positions and get instant AI feedback on your resume before you apply.</p>
          <span className="bg-white/20 text-white px-6 py-2.5 rounded-lg font-bold backdrop-blur-sm group-hover:bg-white group-hover:text-blue-900 transition-colors inline-block">
            Browse Jobs &rarr;
          </span>
        </Link>
        
        <Link to="/candidate/applications" className="group bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-gray-900 group-hover:scale-110 transition-transform">
            <BarChart3 size={120} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Applications</h2>
          <p className="text-gray-500 mb-6 max-w-sm">View the status of your ongoing applications and review past feedback.</p>
          <span className="bg-gray-100 text-gray-800 px-6 py-2.5 rounded-lg font-bold group-hover:bg-gray-900 group-hover:text-white transition-colors inline-block">
            View Tracking &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
}
