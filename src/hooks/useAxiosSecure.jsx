import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = () => {
    const navigate = useNavigate();

    // Interceptor to add authorization header
    axiosSecure.interceptors.request.use(function (config) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    // Interceptor to handle 401/403 unauthorized errors globally
    axiosSecure.interceptors.response.use(function (response) {
        return response;
    }, async (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            // Token expired or invalid, log the user out
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
        return Promise.reject(error);
    });

    return axiosSecure;
};

export default useAxiosSecure;