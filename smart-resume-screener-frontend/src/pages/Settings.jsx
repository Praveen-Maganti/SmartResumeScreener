import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Database, ShieldAlert, Check } from 'lucide-react';

export default function Settings() {
  const [apiUrl, setApiUrl] = useState('http://localhost:8080/api');
  const [shortlistThreshold, setShortlistThreshold] = useState(85);
  const [reviewThreshold, setReviewThreshold] = useState(70);
  const [autoEmail, setAutoEmail] = useState(false);
  const [mockMode, setMockMode] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load existing settings
    const storedUrl = localStorage.getItem('screener_api_url') || 'http://localhost:8080/api';
    const storedShortlist = localStorage.getItem('screener_shortlist_threshold') || '85';
    const storedReview = localStorage.getItem('screener_review_threshold') || '70';
    const storedEmail = localStorage.getItem('screener_auto_email') === 'true';
    const storedMock = localStorage.getItem('screener_mock_mode') !== 'false'; // default to true

    setApiUrl(storedUrl);
    setShortlistThreshold(parseInt(storedShortlist, 10));
    setReviewThreshold(parseInt(storedReview, 10));
    setAutoEmail(storedEmail);
    setMockMode(storedMock);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('screener_api_url', apiUrl);
    localStorage.setItem('screener_shortlist_threshold', shortlistThreshold.toString());
    localStorage.setItem('screener_review_threshold', reviewThreshold.toString());
    localStorage.setItem('screener_auto_email', autoEmail.toString());
    localStorage.setItem('screener_mock_mode', mockMode.toString());

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetDefaults = () => {
    setApiUrl('http://localhost:8080/api');
    setShortlistThreshold(85);
    setReviewThreshold(70);
    setAutoEmail(false);
    setMockMode(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">System Settings</h3>
        <p className="text-xs text-slate-500 font-medium">Configure recruitment matching logic thresholds and backend API connections.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6">
        
        {/* Section 1: Backend Connection */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <Database className="h-4 w-4 text-blue-500" />
            <span>Spring Boot Integration</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="col-span-1">
              <label className="text-xs font-bold text-slate-700 block">
                API Base URL
              </label>
              <span className="text-[10px] text-slate-400 font-medium">URL of the Spring Boot gateway</span>
            </div>
            <div className="col-span-2">
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8080/api"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white text-slate-750 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pt-2">
            <div className="col-span-1">
              <label className="text-xs font-bold text-slate-700 block">
                Developer Mock Mode
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Use client-side local database</span>
            </div>
            <div className="col-span-2 flex items-center">
              <input
                type="checkbox"
                checked={mockMode}
                onChange={(e) => setMockMode(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
              />
              <span className="text-xs text-slate-550 font-semibold ml-2">
                Active (Recommended for testing without backend active)
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: AI Scoring Logic */}
        <div className="space-y-4 pt-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            <span>Screening Thresholds</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="text-xs font-bold text-slate-700 block">
                Strong Shortlist Limit
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Score percentage required</span>
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <input
                type="range"
                min="75"
                max="95"
                value={shortlistThreshold}
                onChange={(e) => setShortlistThreshold(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-xs font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded w-12 text-center">
                {shortlistThreshold}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="text-xs font-bold text-slate-700 block">
                Review Benchmark Limit
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Score percentage required</span>
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <input
                type="range"
                min="55"
                max="74"
                value={reviewThreshold}
                onChange={(e) => setReviewThreshold(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-xs font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded w-12 text-center">
                {reviewThreshold}%
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Notification Automation */}
        <div className="space-y-4 pt-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <SettingsIcon className="h-4 w-4 text-purple-500" />
            <span>Automation Preferences</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="text-xs font-bold text-slate-700 block">
                Shortlist Email Alerts
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Send automatic email on match</span>
            </div>
            <div className="col-span-2 flex items-center">
              <input
                type="checkbox"
                checked={autoEmail}
                onChange={(e) => setAutoEmail(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
              />
              <span className="text-xs text-slate-550 font-semibold ml-2">
                Enable auto-notify for HR on Strong Shortlist matches
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-5 border-t border-slate-150">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-650 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>
          
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-500/10 transition-all hover:shadow-blue-500/20"
          >
            {saved ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
