import axiosInstance from './axiosInstance';

export const registerUserAPI = async ({ name, Emailid, password, userType }) => {
  const response = await axiosInstance.post('/register', {
    name,
    Emailid,
    password,
    userType,
  });

  return response.data;
};
