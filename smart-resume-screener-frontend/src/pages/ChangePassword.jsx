import React, { useState } from 'react';
import { ShieldAlert, Check } from 'lucide-react';

export default function ChangePassword() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Change Password</h3>
        <p className="text-xs text-slate-500 font-medium">Update your administrator password here.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6">
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldAlert className="h-4 w-4 text-emerald-500" />
            <span>Administrator Credentials</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="text-xs font-bold text-slate-700 block">
                Current Password
              </label>
            </div>
            <div className="col-span-2">
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-750"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="text-xs font-bold text-slate-700 block">
                New Password
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Require min 8 chars</span>
            </div>
            <div className="col-span-2">
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-750"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="text-xs font-bold text-slate-700 block">
                Confirm Password
              </label>
            </div>
            <div className="col-span-2">
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-750"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center pt-5 border-t border-slate-150">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-500/10 transition-all hover:shadow-emerald-500/20"
          >
            {saved ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Password Updated!</span>
              </>
            ) : (
              <>
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
