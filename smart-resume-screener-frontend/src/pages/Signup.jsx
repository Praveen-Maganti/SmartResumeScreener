import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, KeyRound, AlertCircle, ShieldCheck, RefreshCw, Mail, Type } from 'lucide-react';

const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const Signup = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [captchaInput, setCaptchaInput] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [error, setError] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setGeneratedCaptcha(generateCaptcha());
  }, []);

  const handleRefreshCaptcha = () => {
    setGeneratedCaptcha(generateCaptcha());
    setCaptchaInput('');
  };

  const handleMockGoogleLogin = async () => {
    // Mocking an OAuth callback response
    const mockEmail = `user${Math.floor(Math.random() * 1000)}@gmail.com`;
    const mockUsername = mockEmail.split('@')[0];
    
    setFirstName('Google');
    setLastName('User');
    setEmail(mockEmail);
    setUsername(mockUsername);
    setPassword('oauth_mock_password');
    setCaptchaInput(generatedCaptcha); // bypass captcha for oauth
    
    setError('Google OAuth Successful! Form auto-filled. Please click Create Account.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== generatedCaptcha) {
      setError('Captcha does not match. Please try again.');
      handleRefreshCaptcha();
      return;
    }

    try {
      await signup(username, password, captchaInput, firstName, lastName, email);
      navigate('/candidate/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Username might be taken.');
      handleRefreshCaptcha();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Join the Platform</h1>
          <p className="text-gray-400">Create your Candidate profile</p>
        </div>

        {/* Mock Google OAuth Button */}
        <button 
          onClick={handleMockGoogleLogin}
          type="button" 
          className="w-full mb-6 bg-white hover:bg-gray-50 text-gray-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center py-2 mb-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">or sign up with email</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-500">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">First Name</label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">Last Name</label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-medium text-gray-400 mb-2">Security Verification</label>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 flex-1 text-center select-none">
                <span className="text-xl font-mono font-bold tracking-widest text-blue-400 line-through decoration-gray-500 decoration-2">
                  {generatedCaptcha}
                </span>
              </div>
              <button 
                type="button" 
                onClick={handleRefreshCaptcha}
                className="p-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300"
                title="Refresh Captcha"
              >
                <RefreshCw size={18} />
              </button>
            </div>

            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase"
                placeholder="Enter the code above"
                maxLength={4}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/25"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
