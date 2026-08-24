import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import { User, Mail, Shield, ChevronRight, Phone, Edit2, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CandidateProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (user?.userId) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const data = await authService.getProfile(user.userId);
      setProfile(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || ''
      });
    } catch (e) {
      console.error("Failed to load profile", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updated = await authService.updateProfile(user.userId, formData);
      setProfile(updated);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (e) {
      alert("Failed to update profile.");
    }
  };

  if (loading || !profile) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>;

  const initial = profile.firstName ? profile.firstName.charAt(0).toUpperCase() : (profile.username ? profile.username.charAt(0).toUpperCase() : 'U');

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link to="/candidate/dashboard" className="hover:text-gray-900 transition">Dashboard</Link>
        <ChevronRight size={14} />
        <span className="font-medium text-gray-900">My Profile</span>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 w-full"></div>
        
        <div className="px-8 pb-8">
          {/* Avatar floating over banner */}
          <div className="relative flex justify-between items-end -mt-12 mb-8">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl text-white font-bold">
                {initial}
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold border border-green-200">
                Active Candidate
              </div>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-1.5 rounded-full text-sm font-bold border border-gray-200 flex items-center gap-1.5 transition"
                >
                  <Edit2 size={14} /> Edit Profile
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        firstName: profile.firstName || '',
                        lastName: profile.lastName || '',
                        email: profile.email || '',
                        phoneNumber: profile.phoneNumber || ''
                      });
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-1.5 rounded-full text-sm font-bold border border-gray-200 flex items-center gap-1.5 transition"
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow flex items-center gap-1.5 transition"
                  >
                    <Save size={14} /> Save
                  </button>
                </>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">
            {profile.firstName || profile.lastName ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : profile.username}
          </h1>
          <p className="text-gray-500 font-medium mb-8">Candidate Portal Account</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-gray-500">
                <User size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Username</p>
                <p className="font-bold text-gray-900">{profile.username}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-gray-500">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email Address</p>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm font-bold outline-none focus:border-blue-500" 
                  />
                ) : (
                  <p className="font-bold text-gray-900">{profile.email || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-gray-500">
                <User size={20} />
              </div>
              <div className="flex-1 flex gap-2">
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">First Name</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.firstName} 
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm font-bold outline-none focus:border-blue-500" 
                    />
                  ) : (
                    <p className="font-bold text-gray-900">{profile.firstName || '-'}</p>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Last Name</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.lastName} 
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm font-bold outline-none focus:border-blue-500" 
                    />
                  ) : (
                    <p className="font-bold text-gray-900">{profile.lastName || '-'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-gray-500">
                <Phone size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone Number</p>
                {isEditing ? (
                  <input 
                    type="tel" 
                    value={formData.phoneNumber} 
                    onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm font-bold outline-none focus:border-blue-500" 
                  />
                ) : (
                  <p className="font-bold text-gray-900">{profile.phoneNumber || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4 md:col-span-2">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-gray-500">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Account Role</p>
                <p className="font-bold text-gray-900 flex items-center gap-2">
                  {profile.role} 
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold">Standard Access</span>
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
