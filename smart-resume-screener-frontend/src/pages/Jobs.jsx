import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Briefcase, Play, Eye, XOctagon } from 'lucide-react';
import { jobsService } from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function Jobs() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selected job for detailed requirements popup
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJdExpanded, setIsJdExpanded] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await jobsService.getAll();
        setJobs(data);

        // If jobId is present in searchParams, select that job
        const jobId = searchParams.get('jobId');
        if (jobId) {
          const selected = data.find(j => j.id === jobId);
          if (selected) {
            setSelectedJob(selected);
            setIsModalOpen(true);
          }
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [searchParams]);

  // If search param create=true, navigate to create job page
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      searchParams.delete('create');
      setSearchParams(searchParams);
      navigate('/admin/create-job');
    }
  }, [searchParams, navigate, setSearchParams]);

  const handleRowClick = (row) => {
    setSelectedJob(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setIsJdExpanded(false);
    // Clear search param
    if (searchParams.get('jobId')) {
      searchParams.delete('jobId');
      setSearchParams(searchParams);
    }
  };

  const columns = [
    {
      header: 'Job Title',
      key: 'title',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="bg-slate-100 p-2 rounded text-slate-600 shrink-0">
            <Briefcase className="h-4 w-4" />
          </div>
          <span className="font-bold text-slate-800 tracking-tight block">{row.title}</span>
        </div>
      )
    },
    {
      header: 'Description',
      key: 'description',
      render: (row) => (
        <span className="text-slate-400 font-medium block max-w-xs truncate">
          {row.description}
        </span>
      )
    },
    {
      header: 'Screened',
      key: 'candidatesScreened',
      className: 'text-center',
      render: (row) => (
        <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full text-[11px]">
          {row.candidatesScreened}
        </span>
      )
    },
    {
      header: 'Avg Match Score',
      key: 'avgScore',
      className: 'text-center',
      render: (row) => (
        <span className={`font-bold text-xs ${
          row.avgScore >= 80 ? 'text-emerald-600' : row.avgScore >= 65 ? 'text-blue-600' : 'text-slate-400'
        }`}>
          {row.avgScore > 0 ? `${row.avgScore}%` : 'N/A'}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
          row.status === 'Active'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
            : 'bg-slate-50 text-slate-500 border-slate-200'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleRowClick(row)}
            className="flex items-center gap-1 px-2 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-750 rounded text-[10px] font-bold transition-colors"
          >
            <Eye className="h-3 w-3 text-slate-500" />
            <span>View Job AI</span>
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
      {/* Header Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Active Jobs Directory</h3>
          <p className="text-xs text-slate-500 font-medium">Create jobs for AI to extract screening requirements automatically.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/create-job')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-500/10 focus:outline-none"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Job</span>
        </button>
      </div>

      {/* Main Table */}
      <DataTable 
        columns={columns} 
        data={jobs} 
        searchKey="title" 
        searchPlaceholder="Search active roles..." 
        onRowClick={handleRowClick}
      />

      {/* Job Details Modal (AI Extracted Criteria) */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedJob ? `${selectedJob.title} - AI Requirements Details` : ''}
      >
        {selectedJob && (
          <div className="space-y-6">
            <div className="border border-slate-200/60 rounded-xl overflow-hidden bg-slate-50/30">
              <button 
                onClick={() => setIsJdExpanded(!isJdExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors focus:outline-none"
              >
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  View Full Description
                </span>
                <div className={`transform transition-transform duration-300 ${isJdExpanded ? 'rotate-180' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${isJdExpanded ? 'max-h-[1000px] opacity-100 p-4 border-t border-slate-150' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <p className="text-xs text-slate-650 leading-relaxed font-medium">
                  {selectedJob.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Core Required Skills */}
              <div className="bg-emerald-50/20 border border-emerald-100 rounded-lg p-4">
                <h5 className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-2.5">
                  Required Core Skills (AI Extracted)
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.requiredSkills?.map(sk => (
                    <span key={sk} className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-150 shadow-sm">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred Skills */}
              <div className="bg-blue-50/20 border border-blue-100 rounded-lg p-4">
                <h5 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-2.5">
                  Preferred / Nice-to-Have Skills
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.preferredSkills?.map(sk => (
                    <span key={sk} className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-150 shadow-sm">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional parameters */}
            <div className="border-t border-slate-150 pt-5 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Min Experience</span>
                <span className="text-xs font-bold text-slate-750">{selectedJob.minExperience} years</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Min Education</span>
                <span className="text-xs font-bold text-slate-750">{selectedJob.minEducation || 'CS Degree'}</span>
              </div>
            </div>

            {/* Actions in details */}
            <div className="border-t border-slate-150 pt-5 flex justify-end gap-2.5">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
