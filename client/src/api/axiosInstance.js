import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mern-lms-server.vercel.app/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = JSON.parse(sessionStorage.getItem("accessToken")) || "";

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);
export default axiosInstance;
