import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, User, AlertCircle, Briefcase, GraduationCap } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('candidate'); // 'candidate' or 'admin'
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(username, password);
      // Extra verification to ensure they logged into the correct portal
      if (activeTab === 'admin' && user.role !== 'ADMIN') {
        setError('Unauthorized: Not an Admin account.');
        return;
      }
      if (activeTab === 'candidate' && user.role !== 'CANDIDATE') {
        setError('Please use the Admin portal to login.');
        return;
      }
      
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
        
        {/* Tab Selector */}
        <div className="flex bg-gray-900 rounded-xl p-1 mb-8 shadow-inner border border-gray-700">
          <button
            type="button"
            onClick={() => { setActiveTab('candidate'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'candidate' 
                ? 'bg-gray-800 text-blue-400 shadow shadow-black/20' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <GraduationCap size={18} />
            Candidate
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'admin' 
                ? 'bg-gray-800 text-indigo-400 shadow shadow-black/20' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Briefcase size={18} />
            Admin
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {activeTab === 'admin' ? 'Admin Portal' : 'Welcome Back'}
          </h1>
          <p className="text-gray-400">
            {activeTab === 'admin' ? 'Sign in to manage candidates and jobs' : 'Sign in to Smart Resume Screener'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-500">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full text-white font-medium py-3 rounded-xl transition-colors shadow-lg ${
              activeTab === 'admin' 
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
            }`}
          >
            Sign In
          </button>
        </form>

        {activeTab === 'candidate' && (
          <p className="mt-6 text-center text-gray-400 text-sm">
            Are you a new candidate? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">Create an account</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
