import api from "../lib/axios.js";

export default {
    register(data) {
        return api.post("auth/register", data);
    },
    verifyAccount(token) {
        return api.post(`/auth/verify/${token}`);
    },

    login(data) {
        return api.post("auth/login", data);
    },

    auth() {
        return api.get("auth/user", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
            },
        });
    },
    
    resetPassword({ token, ...data }) {
       
        return api.post(`auth/reset-password/${token}`, data);
    },
    verifyToken(token) {
        return api.get(`auth/reset-password/${token}`);
    },
    forgotPassword(email) {
        return api.post("auth/forgot-password", { email });
    },
    
}