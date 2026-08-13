import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5001/api', // Adjust if your backend port changes
});

// Add a request interceptor to include the JWT token
instance.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
