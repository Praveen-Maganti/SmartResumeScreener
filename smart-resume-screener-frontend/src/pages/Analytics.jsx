import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { BarChart3, TrendingUp, Users, Award, ShieldCheck } from 'lucide-react';
import { candidatesService, jobsService } from '../services/api';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [scoreData, setScoreData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const candidates = await candidatesService.getAll();
        const jobs = await jobsService.getAll();

        // 1. Score Distribution
        const buckets = {
          '50-60%': 0,
          '60-70%': 0,
          '70-80%': 0,
          '80-90%': 0,
          '90-100%': 0
        };
        candidates.forEach(c => {
          if (c.score >= 90) buckets['90-100%']++;
          else if (c.score >= 80) buckets['80-90%']++;
          else if (c.score >= 70) buckets['70-80%']++;
          else if (c.score >= 60) buckets['60-70%']++;
          else buckets['50-60%']++;
        });
        const dist = Object.keys(buckets).map(k => ({ range: k, count: buckets[k] }));
        setScoreData(dist);

        // 2. Average score per Role
        const roleScores = jobs.map(j => ({
          role: j.title.replace('Developer', 'Dev').replace('Engineer', 'Eng').replace('Specialist', 'Spec'),
          avgScore: j.avgScore,
          count: j.candidatesScreened
        }));
        setRoleData(roleScores);

        // 3. Status Breakdown
        const recCounts = {};
        candidates.forEach(c => {
          recCounts[c.recommendation] = (recCounts[c.recommendation] || 0) + 1;
        });
        const pie = Object.keys(recCounts).map(k => ({ name: k, value: recCounts[k] }));
        setPieData(pie);

      } catch (err) {
        console.error('Error compiling analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Recruitment Analytics</h3>
        <p className="text-xs text-slate-500 font-medium">Visual trends on applicant scores, job distributions, and pipeline conversions.</p>
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Score Distribution & Average Score (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Fit score distribution */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <BarChart3 className="h-4.5 w-4.5 text-blue-500" />
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Candidate Score Distribution</h4>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    labelStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#1e293b' }}
                    itemStyle={{ fontSize: '11px', color: '#2563eb' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average match scores across roles */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Average Fit Score by Job Position</h4>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={roleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="role" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    labelStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#1e293b' }}
                    itemStyle={{ fontSize: '11px', color: '#10b981' }}
                  />
                  <Line type="monotone" dataKey="avgScore" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Side: Convert Pipeline Breakdown (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col h-full justify-between">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Award className="h-4.5 w-4.5 text-amber-500" />
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">AI Recommendation Mix</h4>
            </div>
            
            {/* Pie Chart */}
            <div className="h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span className="text-xs font-bold text-slate-400 block">Total</span>
                <span className="text-xl font-extrabold text-slate-800">
                  {pieData.reduce((acc, curr) => acc + curr.value, 0)}
                </span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="space-y-2 mt-4">
              {pieData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-slate-650">{entry.name}</span>
                  </div>
                  <strong className="text-slate-800">{entry.value} Candidates</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
