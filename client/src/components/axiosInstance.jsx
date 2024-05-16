import axios from "axios";

const customAxios = axios.create({
  // Base url for localhost
  // baseURL: "http://localhost:5000/",
  // Base url for vercel
  baseURL: "https://user-auth-server-g8dz7u9nb-andrewymins-projects.vercel.app",
  withCredentials: true,
});

export default customAxios;
