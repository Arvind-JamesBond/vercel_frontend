import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000" // backend local
      : "https://vercel-backend-1-n7di.onrender.com", // backend on Render

  withCredentials: true,
});
