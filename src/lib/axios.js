import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://vercel-frontend-njko.onrender.com": "/api",
  withCredentials: true,
});
