import axiosInstance from './axiosInstance';

const jobAPI = {
  // Fetch list of jobs
  fetchJobs: async () => {
    const response = await axiosInstance.get('/api/jobs');
    return response.data;
  },

  // Upload resume for a specific job
  uploadResume: async (jobId, { name, email, resumeFile }) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('resume', resumeFile);

    const response = await axiosInstance.post(`/upload_resume/${jobId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Post a new job
  postJob: async ({ formData, emailid }) => {
    const payload = {
      ...formData,
      hirer_emailid: emailid,
      keywords: formData.keywords,
    };

    const response = await axiosInstance.post('/post-job', payload);
    return response.data;
  },

  // Generate a job description based on parameters
  generateJobDescription: async ({ title, category, experience, keywords }) => {
    try {
      const response = await axiosInstance.post('/generatedescription', {
        title,
        category,
        experience,
        keywords,
      });

      return response.data.description;
    } catch (error) {
      console.error('Error generating job description:', error);
      throw error;
    }
  },

  fetchHirerJobs: async (emailid) => {
    const response = await axiosInstance.post('/posted/hirer_jobs', {
      emailid,
    });

    return response.data;
  },

  fetchJobDetails: async (jobId) => {
    const response = await axiosInstance.get(`/particularjob/${jobId}`);
    return response.data;
  }
};

export default jobAPI;
