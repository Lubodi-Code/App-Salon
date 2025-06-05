<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, inject } from 'vue';
import AuthApi from '@/api/AuthApi';
const route = useRoute()
const router = useRouter()
const toast = inject('toast')
const { token } = route.params

onMounted(async () => {
   try {
     const { data } = await AuthApi.verifyAccount(token);
     toast.open({
       message: data.msg || 'Cuenta confirmada con éxito',
       type: 'success',
     });
        // Redirigir a la página de inicio o a otra página después de la confirmación
        router.push({ name: 'login' });
   } catch (error) {
    toast.open({
        message: error.response?.data?.msg || 'Error en el registro',
       type: 'error',
     });
   }
});
</script>

<template>
  <h1 class="text-6xl font-extrabold text-center mt-10">Confirmar Cuenta</h1>
</template>