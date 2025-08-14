import axios from 'axios';
import { useAppStore } from '@/store/useAppStore';

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE==='development'? "http://localhost:8000/api/v1" : "https://mailsync.onrender.com/api/v1",
    withCredentials: true,
})

axiosInstance.interceptors.response.use(
    res => res,
    async (error) => {

        const originalRequest = error.config;

        if (originalRequest.url.includes('/auth/refresh-access-token')) {
            useAppStore.getState().logout();
            return Promise.reject(error);
        }
        if (error.response?.status === 401) {
            try {
                await axiosInstance.get('/auth/refresh-access-token');
                return axiosInstance(originalRequest); // retry original request
            } catch (refreshErr) {
                useAppStore.getState().logout();
                window.location.href = '/';

            }
        }
        return Promise.reject(error);
    }
);

export {axiosInstance}