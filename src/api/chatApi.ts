import axiosInstance from './axiosInstance';

export const sendChatMessageAPI = async ({ question, resumeFile }) => {
    if (resumeFile) {
      const formData = new FormData();
      formData.append("question", question);
      formData.append("resume", resumeFile);
  
      const response = await axiosInstance.post('/upload_resume_and_chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.data;
    } else {
      const response = await axiosInstance.post('/chat', { question });
      return response.data;
    }
  };