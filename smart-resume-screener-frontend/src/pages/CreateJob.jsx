import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Loader2, Check, Plus, X, Award, ShieldAlert, UploadCloud, FileText } from 'lucide-react';
import { jobsService } from '../services/api';

export default function CreateJob() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [saving, setSaving] = useState(false);

  // Custom skills builder state
  const [newReqSkill, setNewReqSkill] = useState('');
  const [newPrefSkill, setNewPrefSkill] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFileName(file.name);
      setIsUploading(true);
      // Simulate PDF parsing
      setTimeout(() => {
        setTitle('Senior Product Designer');
        setDescription('We are looking for a Senior Product Designer to lead design efforts for our core product. You will work closely with engineering, product management, and marketing to build beautiful, user-centric experiences. Required skills include Figma, prototyping, user testing, and a strong portfolio demonstrating UI/UX excellence. 5+ years of experience is required.');
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleAIAnalysis = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    setAnalyzing(true);
    try {
      // Mocking the AI extraction instead of hitting create job API directly
      setTimeout(() => {
        setAnalysisResult({
          title,
          description,
          requiredSkills: ['React', 'JavaScript', 'TailwindCSS'],
          preferredSkills: ['Node.js', 'Figma'],
          minExperience: 3,
          minEducation: "Bachelor's Degree",
          status: 'Active',
          candidatesScreened: 0,
          avgScore: 0
        });
        setAnalyzing(false);
      }, 1500);
    } catch (err) {
      console.error('Error analyzing job description:', err);
      setAnalyzing(false);
    }
  };

  const removeSkill = (type, skillName) => {
    if (!analysisResult) return;
    if (type === 'required') {
      setAnalysisResult({
        ...analysisResult,
        requiredSkills: analysisResult.requiredSkills.filter(s => s !== skillName)
      });
    } else {
      setAnalysisResult({
        ...analysisResult,
        preferredSkills: analysisResult.preferredSkills.filter(s => s !== skillName)
      });
    }
  };

  const addSkill = (type) => {
    if (!analysisResult) return;
    if (type === 'required' && newReqSkill.trim()) {
      if (!analysisResult.requiredSkills.includes(newReqSkill.trim())) {
        setAnalysisResult({
          ...analysisResult,
          requiredSkills: [...analysisResult.requiredSkills, newReqSkill.trim()]
        });
      }
      setNewReqSkill('');
    } else if (type === 'preferred' && newPrefSkill.trim()) {
      if (!analysisResult.preferredSkills.includes(newPrefSkill.trim())) {
        setAnalysisResult({
          ...analysisResult,
          preferredSkills: [...analysisResult.preferredSkills, newPrefSkill.trim()]
        });
      }
      setNewPrefSkill('');
    }
  };

  const handleSaveJob = async () => {
    setSaving(true);
    try {
      // Actually create the job opening in the backend database
      await jobsService.create({
        title: analysisResult.title,
        description: analysisResult.description,
        requiredSkills: analysisResult.requiredSkills,
        preferredSkills: analysisResult.preferredSkills,
        minExperience: analysisResult.minExperience,
        minEducation: analysisResult.minEducation
      });
      navigate('/admin/jobs');
    } catch (err) {
      console.error('Error saving job:', err);
      alert('Failed to create job');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Back button link */}
      <button 
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 font-bold transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Jobs Directory</span>
      </button>

      {/* Main Container */}
      {!analysisResult ? (
        // Phase 1: Enter job title and description
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-150">
            <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600 border border-blue-100">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">Create Job Description</h3>
              <p className="text-xs text-slate-500 font-medium">Input job specs manually or upload a JD PDF.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center space-y-3">
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                <p className="text-sm font-semibold text-slate-700">Extracting details from {pdfFileName}...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="bg-white p-3 rounded-full shadow-sm border border-slate-200">
                  <UploadCloud className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Auto-fill with PDF</h4>
                  <p className="text-xs text-slate-500 mt-1">Upload an existing job description to extract details.</p>
                </div>
                <label className="mt-2 cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Upload JD PDF</span>
                  <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">OR</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <form onSubmit={handleAIAnalysis} className="space-y-5">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Job Title / Position
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend React Developer"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium placeholder-slate-455"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Job Description & Scope
              </label>
              <textarea
                required
                rows={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Paste the job description details here. Include required frameworks, minimum years of experience, education benchmarks, and primary day-to-day responsibilities..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium placeholder-slate-455 leading-relaxed resize-y"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-650 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={analyzing || !title.trim() || !description.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-500/10 transition-all hover:shadow-blue-500/20"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Extracting AI Criteria...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Analyze Description with AI</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Phase 2: AI Analysis results & validation page
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-5 border-b border-slate-150">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600 border border-emerald-100">
                <Check className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 tracking-tight">AI Extracted Criteria Preview</h3>
                <p className="text-xs text-slate-500 font-medium">Verify and customize the requirements extracted by the AI agent.</p>
              </div>
            </div>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              AI Analysis Success
            </span>
          </div>

          <div className="space-y-6">
            {/* Required Skills Panel */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                Extracted Required Skills (Must Match)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {analysisResult.requiredSkills.map(skill => (
                  <span 
                    key={skill} 
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200"
                  >
                    <span>{skill}</span>
                    <button 
                      onClick={() => removeSkill('required', skill)}
                      className="p-0.5 hover:bg-emerald-100 rounded text-emerald-600 hover:text-emerald-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  value={newReqSkill}
                  onChange={(e) => setNewReqSkill(e.target.value)}
                  placeholder="Add custom required skill..."
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 flex-1"
                />
                <button
                  onClick={() => addSkill('required')}
                  className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Preferred Skills Panel */}
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                Extracted Preferred Skills (Nice to Have)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {analysisResult.preferredSkills.map(skill => (
                  <span 
                    key={skill} 
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-800 rounded border border-blue-200"
                  >
                    <span>{skill}</span>
                    <button 
                      onClick={() => removeSkill('preferred', skill)}
                      className="p-0.5 hover:bg-blue-100 rounded text-blue-600 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  value={newPrefSkill}
                  onChange={(e) => setNewPrefSkill(e.target.value)}
                  placeholder="Add custom preferred skill..."
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 flex-1"
                />
                <button
                  onClick={() => addSkill('preferred')}
                  className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Exp and Edu inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-150">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Minimum Experience Required (Years)
                </label>
                <input
                  type="number"
                  value={analysisResult.minExperience}
                  onChange={(e) => setAnalysisResult({
                    ...analysisResult,
                    minExperience: parseInt(e.target.value, 10) || 0
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Minimum Education Benchmarks
                </label>
                <input
                  type="text"
                  value={analysisResult.minEducation}
                  onChange={(e) => setAnalysisResult({
                    ...analysisResult,
                    minEducation: e.target.value
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-slate-700 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-slate-150">
            <button
              onClick={() => setAnalysisResult(null)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-650 hover:bg-slate-50 transition-colors"
            >
              Re-edit Description
            </button>
            <button
              onClick={handleSaveJob}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-500/10 transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Job...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Confirm & Save Job Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
