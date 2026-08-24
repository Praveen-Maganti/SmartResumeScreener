import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Admin Pages
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import CreateJob from './pages/CreateJob';
import Screening from './pages/Screening';
import Candidates from './pages/Candidates';
import CandidateDetails from './pages/CandidateDetails';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ChangePassword from './pages/ChangePassword';

// Auth & Candidate Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateJobs from './pages/CandidateJobs';
import CandidateApplications from './pages/CandidateApplications';
import CandidateProfile from './pages/CandidateProfile';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/candidate/dashboard'} replace />;
  }
  return children;
};

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-[#f8fafc] flex">
    <Sidebar />
    <div className="flex-1 pl-64 flex flex-col min-h-screen">
      <Topbar />
      <main className="flex-1 mt-16 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
);

const CandidateLayout = ({ children }) => {
  const { user } = useAuth();
  const initial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'U');
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Topbar for Candidate */}
      <header className="bg-white border-b h-16 flex items-center justify-between px-8 shrink-0 shadow-sm z-10 sticky top-0">
        <Link to="/candidate/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">SmartHire</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/candidate/profile" 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition transform cursor-pointer border-2 border-white ring-2 ring-transparent hover:ring-blue-100"
            title="View Profile"
          >
            {initial}
          </Link>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <CandidateLogoutButton />
        </div>
      </header>
      <main className="flex-1 p-8 overflow-y-auto w-full max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
};

const CandidateLogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <button onClick={() => { logout(); navigate('/login'); }} className="text-sm px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 font-bold transition">
      Sign Out
    </button>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="jobs" element={<Jobs />} />
                  <Route path="create-job" element={<CreateJob />} />
                  <Route path="screening" element={<Screening />} />
                  <Route path="candidates" element={<Candidates />} />
                  <Route path="candidates/:id" element={<CandidateDetails />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="change-password" element={<ChangePassword />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* Candidate Routes */}
          <Route path="/candidate/*" element={
            <ProtectedRoute allowedRole="CANDIDATE">
              <CandidateLayout>
                <Routes>
                  <Route path="dashboard" element={<CandidateDashboard />} />
                  <Route path="jobs" element={<CandidateJobs />} />
                  <Route path="applications" element={<CandidateApplications />} />
                  <Route path="profile" element={<CandidateProfile />} />
                </Routes>
              </CandidateLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
