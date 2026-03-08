import axios from "axios";
import router from "../router/index";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // garante envio do cookie JSESSIONID
});

// Interceptor para tratar sessão expirada
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 440) {
            // Só redireciona para /login se a rota atual exigir autenticação
            const currentRoute = router.currentRoute.value
            if (currentRoute.meta?.requiresAuth) {
                router.push("/login");
            }
        }
        return Promise.reject(error);
    }
);

export default api;
