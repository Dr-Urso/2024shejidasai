import axios from 'axios';

// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: '/', // Django 后端地址
    withCredentials: true
});

// 获取 CSRF Token 并配置 Axios 默认头
const getCsrfToken = async () => {
    try {
        const response = await axiosInstance.get('/api/test/csrf/');
        axiosInstance.defaults.headers.common['X-CSRFToken'] = response.data.csrfToken;
    } catch (error) {
        console.error('Failed to fetch CSRF token', error);
    }
};

// 在应用启动时获取 CSRF Token
getCsrfToken();

export default axiosInstance;