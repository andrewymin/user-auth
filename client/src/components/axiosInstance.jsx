import axios from "axios";

const customAxios = axios.create({
  // Add axios requirements
  baseURL: "http://localhost:5000/",
  withCredentials: true,
});

export default customAxios;
