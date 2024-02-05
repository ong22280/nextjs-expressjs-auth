import axios from "axios";

// Create an Axios instance with default options
const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_BASE_URL,
  withCredentials: true,
});


// Get token from local storage
function getToken() {
  try {
    const token = JSON.parse(localStorage.getItem("auth") || "").state.token;
    return token || null;
  } catch (e) {
    console.error("Failed to parse auth object from local storage:", e);
    return null;
  }
}



export default axiosInstance;
