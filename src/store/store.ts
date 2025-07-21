import { create } from 'zustand';
import jobAPI from '../api/jobAPi';

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary: string;
  skills: string[];
  postedDate: string;
}

interface JobFilter {
  search: string;
  location: string;
  skills: string[];
}

interface JobStore {
  jobs: Job[];
  filteredJobs: Job[];
  jobsLoading: boolean;
  savedJobs: string[];
  likedJobs: string[];

  fetchJobs: () => Promise<void>;
  filterJobs: (filters: JobFilter) => void;
  likeJob: (jobId: string) => void;
  removeLikedJob: (jobId: string) => void;
  saveJob: (jobId: string) => void;
  removeSavedJob: (jobId: string) => void;
}

const useStore = create<JobStore>((set, get) => ({
  jobs: [],
  filteredJobs: [],
  jobsLoading: false,
  savedJobs: [],
  likedJobs: [],

  fetchJobs: async () => {
    set({ jobsLoading: true });
    try {
      const data = await jobAPI.fetchJobs();

      const formatted: Job[] = data.map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company_name,
        description: job.description,
        location: job.location,
        salary: job.salary,
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
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase());

      const matchesLocation =
        location === '' || job.location.toLowerCase().includes(location.toLowerCase());

      const matchesSkills =
        skills.length === 0 ||
        skills.every((skill) =>
          job.skills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
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
    set({ likedJobs: get().likedJobs.filter((id) => id !== jobId) });
  },

  saveJob: (jobId) => {
    const savedJobs = get().savedJobs;
    if (!savedJobs.includes(jobId)) {
      set({ savedJobs: [...savedJobs, jobId] });
    }
  },

  removeSavedJob: (jobId) => {
    set({ savedJobs: get().savedJobs.filter((id) => id !== jobId) });
  }
}));

export default useStore;
