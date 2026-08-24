import axios from 'axios';

// API Gateway URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (username, password) => {
    const response = await apiClient.post('/api/auth/login', { username, password });
    return response.data;
  },
  signup: async (username, password, captcha, firstName, lastName, email) => {
    const response = await apiClient.post('/api/auth/signup', { username, password, captcha, firstName, lastName, email });
    return response.data;
  },
  getProfile: async (userId) => {
    const response = await apiClient.get(`/api/auth/profile/${userId}`);
    return response.data;
  },
  updateProfile: async (userId, data) => {
    const response = await apiClient.put(`/api/auth/profile/${userId}`, data);
    return response.data;
  }
};

export const applicationsService = {
  apply: async (jobId, candidateId, resumeId) => {
    const response = await apiClient.post('/screening/applications/apply', { jobId, candidateId, resumeId });
    return response.data;
  },
  getCandidateApplications: async (candidateId) => {
    const response = await apiClient.get(`/screening/applications/candidate/${candidateId}`);
    return response.data;
  },
  getJobApplications: async (jobId) => {
    const response = await apiClient.get(`/screening/applications/job/${jobId}`);
    return response.data;
  },
  updateStage: async (id, status) => {
    const response = await apiClient.put(`/screening/applications/${id}/stage`, { status });
    return response.data;
  },
  updateStageByResume: async (jobId, resumeId, status) => {
    const response = await apiClient.put(`/screening/applications/job/${jobId}/resume/${resumeId}/stage`, { status });
    return response.data;
  },
  getAllApplications: async () => {
    const response = await apiClient.get('/screening/applications/all');
    return response.data;
  }
};

export const jobsService = {
  getAll: async () => {
    const response = await apiClient.get('/jobs');
    const jobs = response.data;
    try {
      const screeningRes = await apiClient.get('/screening/all');
      const screenings = screeningRes.data.filter(s => !s.candidateName || !s.candidateName.includes('AI Parsing Failed'));
      
      jobs.forEach(job => {
        const jobScreenings = screenings.filter(s => s.jobId === job.id);
        job.candidatesScreened = jobScreenings.length;
        if (jobScreenings.length > 0) {
          const totalScore = jobScreenings.reduce((acc, curr) => acc + curr.score, 0);
          job.avgScore = Math.round(totalScore / jobScreenings.length);
        } else {
          job.avgScore = 0;
        }
      });
    } catch(e) {
      console.error("Could not fetch screenings for job aggregation", e);
    }
    return jobs;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data;
  },
  create: async (jobData) => {
    const response = await apiClient.post('/jobs', jobData);
    return response.data;
  }
};

export const candidatesService = {
  getAll: async (jobId) => {
    let applications = [];
    try {
      applications = await applicationsService.getAllApplications();
    } catch(e) { console.error("Could not fetch applications", e); }

    if (jobId) {
      const response = await apiClient.get(`/screening/${jobId}`);
      return response.data
        .filter(r => !r.candidateName || !r.candidateName.includes('AI Parsing Failed'))
        .map(r => {
          const app = applications.find(a => a.jobId === r.jobId && a.resumeId === r.resumeId);
          return {
            id: r.id,
            jobId: r.jobId,
            resumeId: r.resumeId,
            name: r.candidateName || 'Unknown Candidate',
            score: r.score,
            recommendation: r.score >= 80 ? 'STRONG SHORTLIST' : (r.score >= 60 ? 'SHORTLIST' : 'REVIEW'),
            appliedRole: 'Job ' + r.jobId,
            experience: 0,
            education: 'N/A',
            status: app ? app.status : 'APPLIED'
          };
        });
    }
    const response = await apiClient.get('/screening/all');
    return response.data
      .filter(r => !r.candidateName || !r.candidateName.includes('AI Parsing Failed'))
      .map(r => {
        const app = applications.find(a => a.jobId === r.jobId && a.resumeId === r.resumeId);
        return {
          id: r.id,
          jobId: r.jobId,
          resumeId: r.resumeId,
          name: r.candidateName || 'Unknown',
          appliedRole: 'Job ' + r.jobId,
          score: r.score, 
          recommendation: r.score >= 80 ? 'STRONG SHORTLIST' : (r.score >= 60 ? 'SHORTLIST' : 'REVIEW'),
          experience: 3,
          education: 'B.Tech/BS',
          status: app ? app.status : 'APPLIED'
        };
      });
  },
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/screening/result/${id}`);
      const r = response.data;
      if (r.candidateName && r.candidateName.includes('AI Parsing Failed')) return null;
      
      let applications = [];
      try {
        applications = await applicationsService.getAllApplications();
      } catch(e) {}
      const app = applications.find(a => a.jobId === r.jobId && a.resumeId === r.resumeId);

      return {
        id: r.id,
        jobId: r.jobId,
        resumeId: r.resumeId,
        name: r.candidateName || 'Unknown Candidate',
        appliedRole: 'Job ID: ' + r.jobId,
        score: r.score,
        recommendation: r.recommendation || 'REVIEW',
        experience: 3,
        education: 'N/A',
        status: app ? app.status : 'APPLIED',
        skills: [],
        strengths: r.strengths ? r.strengths.replace(/[\[\]"]/g, '').split(',').map(s=>s.trim()).filter(s=>s) : [],
        weaknesses: r.weaknesses ? r.weaknesses.replace(/[\[\]"]/g, '').split(',').map(s=>s.trim()).filter(s=>s) : [],
        summary: r.matchDetails || 'AI Evaluation Summary',
        evidence: []
      };
    } catch (e) {
      console.error("Candidate detail fetch error:", e);
      return null;
    }
  },
  screenCandidate: async (jobId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const uploadRes = await apiClient.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    const uploadedResumeId = uploadRes.data.id;
    
    const screenRes = await apiClient.post(`/screening/${jobId}/${uploadedResumeId}`);
    const candidateResult = screenRes.data;
    
    if (!candidateResult) throw new Error("Candidate not found in screening results.");

    return {
      id: candidateResult.id,
      jobId: candidateResult.jobId,
      name: candidateResult.candidateName || 'Unknown Candidate',
      score: candidateResult.score,
      recommendation: candidateResult.score >= 80 ? 'STRONG SHORTLIST' : (candidateResult.score >= 60 ? 'SHORTLIST' : 'REVIEW'),
      appliedRole: 'Job ID: ' + candidateResult.jobId,
      experience: 3, 
      education: 'B.Tech/BS', 
      skills: [],
      strengths: candidateResult.strengths || [],
      weaknesses: candidateResult.weaknesses || [],
      improvementSuggestions: candidateResult.improvementSuggestions || [],
      unfitReasons: candidateResult.unfitReasons || [],
      summary: candidateResult.matchDetails || 'Screened via backend deterministic engine.',
      evidence: [],
      resumeId: uploadedResumeId
    };
  }
};

export default apiClient;
