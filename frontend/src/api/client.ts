import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

export default apiClient;

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const refreshToken = localStorage.getItem("refresh");

            if (refreshToken) {
                try {
                    const response = await axios.post(
                        "http://localhost:8000/api/auth/refresh/",
                        {
                            refresh: refreshToken,
                        }
                    );

                    const newAccessToken = response.data.access;

                    localStorage.setItem("access", newAccessToken);

                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;

                    return apiClient(error.config);
                } catch {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                }
            }
        }

        return Promise.reject(error);
    }
);