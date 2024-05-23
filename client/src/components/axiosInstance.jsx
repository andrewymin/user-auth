import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://user-auth-server-three.vercel.app"
    : "http://localhost:5000/";

const customAxios = axios.create({
  // Base url for localhost
  // baseURL: "http://localhost:5000/",
  // Base url for vercel
  // baseURL: "https://user-auth-server-three.vercel.app",
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 3000, // in ms, after 3sec will throw error if call is not returned
});

export default customAxios;
