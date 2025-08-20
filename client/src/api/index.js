// Communicate with the Backend API using Axios

// import { getCookie } from "@/utils/getCookies";
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true, 
});

// Request interceptor: Attach token if available
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token") || getCookie("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// Response interceptor: Global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      //   //console.log(`[${error.response.status}] ${error.config.url}:`, error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // console.error("No response received:", error.request);
      return Promise.reject({ message: "No response from server" });
    } else {
      console.error("Error setting up request:", error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default apiClient;
