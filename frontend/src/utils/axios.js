import axios from "axios";

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://cartvix-backend.onrender.com/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

export default instance;
