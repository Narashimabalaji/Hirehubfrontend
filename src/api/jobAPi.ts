import axiosInstance from './axiosInstance';

export const fetchJobsAPI = async () => {
  const response = await axiosInstance.get('/api/jobs');
  return response.data;
};

export const uploadResumeAPI = async (jobId, { name, email, resumeFile }) => {
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
  };

export const postJobAPI = async ({ formData, emailid, hirerId }) => {
  const payload = {
    ...formData,
    hirer_id: hirerId,
    hirer_emailid: emailid,
    keywords: formData.keywords,
  };

  const response = await axiosInstance.post('/post-job', payload);
  return response.data;
};

export const generateJobDescription = async ({ title, category, experience, keywords }) => {
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
};