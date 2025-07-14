import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:3000/Videntia/v1/log',
    timeout: 5000
});

apiClient.interceptors.request.use(

    (config) => {
        const useUserDetails = localStorage.getItem('user');

        if (useUserDetails) {
            const token = JSON.parse(useUserDetails).token
            config.headers['x-token'] = token;
            config.headers['x-token'] = token;
        }

        return config;
    },
    response => response,
    error => {
        if (error.response?.status === 401) {
            window.dispatchEvent(new Event('token-expired'));
        }
        return Promise.reject(error);
    }
)

export const saveReports = async (data) => {
    try {
        return await apiClient.post('/', data)
    } catch (e) {
        const msg = e.reponse?.data?.msg || e.response?.error
        return {
            error: true,
            msg,
            e
        }
    }
}