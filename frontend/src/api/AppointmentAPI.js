import api from "../lib/axios.js";

export default {
    create(data) {
        return api.post("appointment", data);
    },
    getByDate(date) {

        return api.get("appointment", {
            params: { date },
        });
    },
    getUserAppointments(userId) {
        return api.get(`user/${userId}/appointments`);
    },
    getById(id) {
        return api.get(`appointment/${id}`);
    },
    update(id, data) {
        return api.put(`appointment/${id}`, data);
    },
    delete(id) {
        return api.delete(`appointment/${id}`);
    },
    search(params) {
        return api.get('appointment/search', { params });
    }
};