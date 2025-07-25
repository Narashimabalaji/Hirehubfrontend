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

  fetchJobs: () => Promise<void>;
  filterJobs: (filters: JobFilter) => void;
  saveJob: (emailid: string, jobId: string) => void;
  removeSavedJob: (emailid: string, jobId: string) => void;
  fetchSavedJobs: (emailid: string) => Promise<void>;
}

const useStore = create<JobStore>((set, get) => ({
  jobs: [],
  filteredJobs: [],
  jobsLoading: false,
  savedJobs: [],

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

  saveJob: async (emailid, jobId) => {
    const savedJobs = get().savedJobs;
    if (!savedJobs.includes(jobId)) {
      set({ savedJobs: [...savedJobs, jobId] });
    }
    const response = await jobAPI.saveJob(emailid, jobId)
    return response
  },

  removeSavedJob: async (emailid, jobId) => {
    set({ savedJobs: get().savedJobs.filter((id) => id !== jobId) });
    const response = await jobAPI.removeSaveJob(emailid, jobId)
    return response
  },

  fetchSavedJobs: async (emailid) => {
    try {
      const response = await jobAPI.fetchSavedJobs(emailid);
      set({ savedJobs: response });
    } catch (error) {
      console.error("Failed to fetch saved jobs", error);
    }
  }

}));

export default useStore;
