import { create } from 'zustand';

const useStore = create((set, get) => ({
  jobs: [],
  filteredJobs: [],
  jobsLoading: false,
  savedJobs: [],
  likedJobs: [],

  fetchJobs: async () => {
    set({ jobsLoading: true });

    const getAccessToken = () => localStorage.getItem('access_token');
    const getRefreshToken = () => localStorage.getItem('refreshToken');
    const setAccessToken = (token) => localStorage.setItem('access_token', token);

    const fetchWithToken = async (token) => {
      return await fetch('https://hirehubbackend-5.onrender.com/api/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    };

    try {
      let token = getAccessToken();
      let res = await fetchWithToken(token);

      // If token expired or invalid, try refresh
      if (res.status === 401) {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token found");

        const refreshRes = await fetch('https://hirehubbackend-5.onrender.com/api/token/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken })
        });

        const refreshData = await refreshRes.json();
        if (!refreshRes.ok || !refreshData.access_token) {
          throw new Error("Failed to refresh token");
        }

        // Store new access token
        setAccessToken(refreshData.access_token);
        res = await fetchWithToken(refreshData.access_token);
      }

      if (!res.ok) throw new Error("Failed after retry");

      const data = await res.json();
      const formatted = data.map((job) => ({
        id: job.id || job._id,
        title: job.title,
        description: job.description,
        company: job.created_by || "Unknown",
        location: job.location || "Remote",
        salary: job.salary || "Negotiable",
        skills: job.keywords || [],
        postedDate: new Date(job.created_at).toLocaleDateString(),
      }));

      set({ jobs: formatted, filteredJobs: formatted, jobsLoading: false });
    } catch (error) {
      console.error("Job fetch failed:", error);
      set({ jobsLoading: false });
    }
  },

  filterJobs: ({ search, location, skills }) => {
    const allJobs = get().jobs;
    const filtered = allJobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
                            job.description.toLowerCase().includes(search.toLowerCase());

      const matchesLocation = location === '' || job.location.toLowerCase().includes(location.toLowerCase());

      const matchesSkills = skills.length === 0 || skills.every(skill =>
        job.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
      );

      return matchesSearch && matchesLocation && matchesSkills;
    });

    set({ filteredJobs: filtered });
  },

  likeJob: (jobId) => {
    const likedJobs = get().likedJobs;
    if (!likedJobs.includes(jobId)) {
      set({ likedJobs: [...likedJobs, jobId] });
    }
  },

  removeLikedJob: (jobId) => {
    set({ likedJobs: get().likedJobs.filter(id => id !== jobId) });
  },

  saveJob: (jobId) => {
    const savedJobs = get().savedJobs;
    if (!savedJobs.includes(jobId)) {
      set({ savedJobs: [...savedJobs, jobId] });
    }
  },

  removeSavedJob: (jobId) => {
    set({ savedJobs: get().savedJobs.filter(id => id !== jobId) });
  }
}));

export default useStore;
