import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "/api", // Vercel API routes (production) — di-proxy ke localhost:3001 saat dev
  headers: {
    "Content-Type": "application/json",
  },
});

export default AxiosInstance;
