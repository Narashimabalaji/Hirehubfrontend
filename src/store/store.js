
import { create } from 'zustand';
import { fetchJobsAPI } from "../api/jobAPi" 

const useStore = create((set, get) => ({
  jobs: [],
  filteredJobs: [],
  jobsLoading: false,
  savedJobs: [],
  likedJobs: [],

  fetchJobs: async () => {
    set({ jobsLoading: true });
    
    try {

      const data = await fetchJobsAPI();

      const formatted = data.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company_name,
        description: job.description,
        location: job.location,
        salary:job.salary,
        skills: job.keywords || [],
        postedDate: new Date(job.created_at).toLocaleDateString(),
      }));

      set({ jobs: formatted, filteredJobs: formatted, jobsLoading: false });
    } catch (error) {
      console.error("Failed to fetch jobs", error);
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
