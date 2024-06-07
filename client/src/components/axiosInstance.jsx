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

// customAxios.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && error.response.status === 401) {
//       // Clear any auth tokens or cookies here if necessary

//       // Optionally, redirect to login page
//       window.location.href = '/login'; // Or use a history push if using React Router
//     }
//     return Promise.reject(error);
//   }
// );

export default customAxios;
