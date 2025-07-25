import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE==='development'? "http://localhost:8000/api/v1" : "https://mailsync.onrender.com/api/v1",
    withCredentials: true,
})