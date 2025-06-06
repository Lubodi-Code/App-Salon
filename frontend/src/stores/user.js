import {ref, onMounted, computed} from 'vue';
import { defineStore } from 'pinia';
import AuthApi from '@/api/AuthApi';
import AppointmentAPI from '@/api/AppointmentAPI';
import { useRouter } from 'vue-router';
import router from '@/router';
import api from '@/lib/axios'

export const useUserStore = defineStore('user', () => {

    const loading = ref(true);
    const user = ref({});
    const userAppointments = ref([]);

    onMounted( async() => {
       try {
        const { data } = await AuthApi.auth();
        user.value = data;
        await getUserAppointments();
       }catch (error) {
       }finally {
        loading.value = false;
       }
    });

      const isAdmin = computed(() => {
        return user.value.admin || false;
    });

    async function getUserAppointments() {
        try {
                   const { data } = await AppointmentAPI.getUserAppointments(user.value._id);
            userAppointments.value = data;
        } catch (error) {
        }
    }

    const getUserName = computed(() => {
        return user.value.name || 'Invitado';
    });

    const logout = async () => {
       localStorage.removeItem('AUTH_TOKEN');
       delete api.defaults.headers.common['Authorization'];
       user.value = {};
       userAppointments.value = [];
       router.push({name: 'login'});

    }

     const noAppointments = computed(() => {
        return userAppointments.value.length === 0;
    }
    );

async function verifyPasswordResetToken(token) {
    try {
        const { data } = await AuthApi.verifyToken(token.trim());
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.msg || 'Token no válido');
    }
}

    async function resetPassword({ token, password }) {
        try {
            const { data } = await AuthApi.resetPassword({ token, password });
            return data;
        } catch (error) {
            throw new Error(error.response?.data?.msg || 'Error al restablecer la contraseña');
        }
    }

async function forgotPassword(email) {
    try {
        const { data } = await AuthApi.forgotPassword(email);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.msg || 'Error al enviar el correo de restablecimiento de contraseña');
    }

}

    return {
        getUserName,
        loading,
        user,
        getUserAppointments,
        logout,
        userAppointments,
        noAppointments,
        verifyPasswordResetToken,
        resetPassword,
        forgotPassword,
        isAdmin
  
    };

})