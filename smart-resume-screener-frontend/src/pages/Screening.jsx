import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Briefcase, Play, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { jobsService, candidatesService } from '../services/api';
import ProgressBar from '../components/ProgressBar';

const PIPELINE_STAGES = [
  'Extracting Resume Text',
  'Identifying Core Skills',
  'Matching Job Requirements',
  'Generating Match Evidence'
];

export default function Screening() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [loadingJobs, setLoadingJobs] = useState(true);
  
  // File upload state
  const [files, setFiles] = useState([]);
  
  // Screening workflow state
  const [isScreening, setIsScreening] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [screenedCandidate, setScreenedCandidate] = useState(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await jobsService.getAll();
        setJobs(data);
        
        // Auto-select job from query param or fall back to first active job
        const queryJobId = searchParams.get('jobId');
        if (queryJobId && data.some(j => j.id === queryJobId)) {
          setSelectedJobId(queryJobId);
        } else {
          const activeJobs = data.filter(j => j.status === 'Active');
          if (activeJobs.length > 0) {
            setSelectedJobId(activeJobs[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoadingJobs(false);
      }
    }
    loadJobs();
  }, [searchParams]);

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    }
  });

  const handleStartScreening = async () => {
    if (!selectedJobId || files.length === 0) return;

    setIsScreening(true);
    setCurrentStageIdx(0);

    const file = files[0];

    try {
      // Stage 1: Extracting Resume
      await new Promise(r => setTimeout(r, 900));
      setCurrentStageIdx(1);

      // Stage 2: Identifying Skills
      await new Promise(r => setTimeout(r, 900));
      setCurrentStageIdx(2);

      // Stage 3: Matching Requirements
      await new Promise(r => setTimeout(r, 900));
      setCurrentStageIdx(3);

      // Stage 4: Generating Evidence + Save
      const result = await candidatesService.screenCandidate(selectedJobId, file);
      await new Promise(r => setTimeout(r, 900));
      
      setCurrentStageIdx(4); // Finished
      setScreenedCandidate(result);
    } catch (err) {
      console.error('Screening failed:', err);
      setIsScreening(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setIsScreening(false);
    setCurrentStageIdx(0);
    setScreenedCandidate(null);
  };

  if (loadingJobs) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">AI Resume Screener</h3>
          <p className="text-xs text-slate-500 font-medium">Select a job target and drop a candidate resume to evaluate semantic alignment.</p>
        </div>
      </div>

      {!isScreening ? (
        // Input phase: Job selection and file Dropzone
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6 animate-fade-in-up">
          {/* Job Select Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Select Job Profile for Screening
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white text-slate-700 appearance-none cursor-pointer"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File Dropzone */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Candidate Resume
            </label>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50/20' 
                  : files.length > 0 
                    ? 'border-emerald-350 bg-emerald-50/10' 
                    : 'border-slate-200 hover:border-blue-400/80 hover:bg-slate-50/50'
              }`}
            >
              <input {...getInputProps()} />
              {files.length > 0 ? (
                <>
                  <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-full border border-emerald-100 mb-3 shadow-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{files[0].name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">
                    {(files[0].size / 1024).toFixed(1)} KB • Ready for Screening
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-slate-50 text-slate-400 p-3.5 rounded-full border border-slate-200 mb-3 group-hover:scale-105 transition-transform duration-200">
                    <UploadCloud className="h-6 w-6 text-slate-400" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-700">Drag & drop resume PDF or Word</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                    Supports PDF, DOCX, TXT up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            {files.length > 0 && (
              <button
                onClick={() => setFiles([])}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-650 hover:bg-slate-50 transition-colors"
              >
                Clear File
              </button>
            )}
            <button
              onClick={handleStartScreening}
              disabled={files.length === 0 || !selectedJobId}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-500/10 transition-all hover:shadow-blue-500/20"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Start AI Resume Screening</span>
            </button>
          </div>
        </div>
      ) : (
        // Progress stage & completion view
        <div className="space-y-6 animate-fade-in-up">
          <ProgressBar stages={PIPELINE_STAGES} currentStageIndex={currentStageIdx} />

          {currentStageIdx === 4 && screenedCandidate && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 text-center space-y-4 animate-fade-in-up">
              <div className="inline-flex items-center justify-center p-3 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 mb-1">
                <CheckCircle className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Screening Complete!</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  AI has successfully parsed {screenedCandidate.name} and mapped their match index.
                </p>
              </div>

              {/* Match summary capsule */}
              <div className="max-w-sm mx-auto bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Candidate</span>
                  <p className="text-xs font-bold text-slate-800">{screenedCandidate.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">AI Match Fit</span>
                  <p className="text-xs font-extrabold text-blue-600">{screenedCandidate.score}%</p>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Screen Another</span>
                </button>
                <button
                  onClick={() => navigate(`/candidates/${screenedCandidate.id}`)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  View Details & Evidence
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
