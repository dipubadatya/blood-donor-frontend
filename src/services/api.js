

import axios from "axios";

// ─── Create Axios Instance ───
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const API = axios.create({
 baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor: Attach JWT Token ───
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lifelink_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor: Handle Auth Errors ───
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("lifelink_token");
      localStorage.removeItem("lifelink_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);


// Auth API Calls
export const registerUser = (userData) => API.post("/auth/register", userData);

export const loginUser = (credentials) => API.post("/auth/login", credentials);

export const getProfile = () => API.get("/auth/me");
export const updateProfile = async (userData) => {
  return await API.put("/auth/update", userData); 
};


// Donor / User API Calls 

export const getUserProfile = () => API.get("/user/profile");

export const toggleAvailability = () => API.put("/user/toggle-availability");

export const updateLocation = (coords) => API.put("/user/update-location", coords);

export const updateUserProfile = (data) => API.put("/user/update-profile", data);



export const searchDonors = (params) =>
  API.get("/medical/search", { params });

export const getDonorStats = () => API.get("/medical/stats");

export default API;