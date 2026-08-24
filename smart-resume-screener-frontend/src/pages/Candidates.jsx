import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Eye } from 'lucide-react';
import { candidatesService, applicationsService } from '../services/api';
import DataTable from '../components/DataTable';
import { getScoreColorClass, getRecommendationBadgeClass } from '../utils/helpers';

export default function Candidates() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandidates() {
      try {
        const data = await candidatesService.getAll();
        setCandidates(data);
      } catch (err) {
        console.error('Error fetching candidates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, []);

  const columns = [
    {
      header: 'Candidate Name',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="bg-slate-100 p-2 rounded-full text-slate-650 shrink-0">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="font-bold text-slate-800 tracking-tight block">{row.name}</span>
        </div>
      )
    },
    {
      header: 'Applied Role',
      key: 'appliedRole',
      render: (row) => (
        <span className="font-semibold text-slate-700 block">{row.appliedRole}</span>
      )
    },
    {
      header: 'Experience',
      key: 'experience',
      render: (row) => (
        <span className="text-slate-500 font-medium">{row.experience} Years</span>
      )
    },
    {
      header: 'Match Score',
      key: 'score',
      className: 'text-center',
      render: (row) => {
        const colors = getScoreColorClass(row.score);
        return (
          <span className={`font-extrabold text-sm ${colors.text}`}>
            {row.score}%
          </span>
        );
      }
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => {
        let colorClass = 'bg-gray-100 text-gray-700 border-gray-200';
        if (row.status === 'APPROVED') colorClass = 'bg-green-100 text-green-700 border-green-200';
        if (row.status === 'REJECTED') colorClass = 'bg-red-100 text-red-700 border-red-200';
        if (row.status === 'INTERVIEW') colorClass = 'bg-amber-100 text-amber-700 border-amber-200';
        if (row.status === 'APPLIED') colorClass = 'bg-blue-100 text-blue-700 border-blue-200';
        return (
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${colorClass}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      header: 'Recommendation',
      key: 'recommendation',
      render: (row) => (
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getRecommendationBadgeClass(row.recommendation)}`}>
          {row.recommendation}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/candidates/${row.id}`)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded text-[10px] font-bold transition-colors"
          >
            <Eye className="h-3 w-3 text-slate-500" />
            <span>Profile</span>
          </button>
          <button 
            onClick={async () => {
              try {
                if (!row.jobId || !row.resumeId) return alert('Cannot update: Missing Job/Resume IDs');
                await applicationsService.updateStageByResume(row.jobId, row.resumeId, 'APPROVED');
                alert(`Candidate Selected for Job ${row.jobId}!`);
              } catch (e) {
                console.error(e);
                alert('Error updating application status');
              }
            }}
            className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-[10px] font-bold hover:bg-emerald-100 transition-colors"
          >
            Select
          </button>
          <button 
            onClick={async () => {
              try {
                if (!row.jobId || !row.resumeId) return alert('Cannot update: Missing Job/Resume IDs');
                await applicationsService.updateStageByResume(row.jobId, row.resumeId, 'REJECTED');
                alert(`Candidate Rejected for Job ${row.jobId}!`);
              } catch (e) {
                console.error(e);
                alert('Error updating application status');
              }
            }}
            className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded text-[10px] font-bold hover:bg-red-100 transition-colors"
          >
            Reject
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Candidates Directory</h3>
        <p className="text-xs text-slate-500 font-medium">Browse and search profiles of candidates parsed via AI screening.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={candidates} 
        searchKey="name" 
        searchPlaceholder="Search candidates by name..." 
        onRowClick={(row) => navigate(`/candidates/${row.id}`)}
      />
    </div>
  );
}
