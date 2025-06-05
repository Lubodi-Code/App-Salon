<script setup>
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
import Appointment from '@/components/Appointment.vue';
</script>

<template>
  <h2 class="text-2xl sm:text-4xl font-bold text-white mt-10">Mis Citas</h2>
  <p class="text-base sm:text-lg text-gray-300 mt-4">Esta es la vista de mis citas.</p>

  <p v-if="userStore.loading" class="text-base sm:text-lg text-gray-300 mt-4">
    Cargando citas...
  </p>
  <div v-else>
    <p v-if="userStore.noAppointments" class="text-base sm:text-lg text-gray-300 mt-4">
      No tienes citas programadas.
    </p>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <Appointment 
        v-for="appointment in userStore.userAppointments" 
        :key="appointment._id" 
        :appointment="appointment" 
      />
    </div>
  </div>
</template>