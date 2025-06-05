<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppointmentsStore } from '@/stores/appointments';

const appointmentStore = useAppointmentsStore();
const activeButton = ref('servicios');
const route = useRoute();
const router = useRouter();
const loading = ref(true);

const loadAppointmentData = async () => {
  try {
    const { id } = route.params;
    if (!id) {
      router.push({ name: 'mis-reservaciones' });
      return;
    }

    const data = await appointmentStore.loadAppointment(id);
    if (!data) {
      throw new Error('No se pudo cargar la cita');
    }
    loading.value = false;
  } catch (error) {
    console.error('Error al cargar la cita:', error);
    router.push({ name: 'mis-reservaciones' });
  }
};

onMounted(async () => {
  await loadAppointmentData();
});
</script>

<template>
  <header class="bg-gray-800 text-white p-4">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Editando Cita</h1>
    </div>
  </header>

  <div class="p-4 w-full">
    <nav class="flex w-full space-x-2 sm:space-x-4">
      <RouterLink
        :to="{ name: 'editar-servicios' }"
        @click="activeButton = 'servicios'"
        class="flex-1 text-center font-bold py-1 sm:py-2 rounded transform transition duration-200 hover:scale-105 text-xs sm:text-base"
        :class="activeButton === 'servicios' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'"
      >
        Servicios
      </RouterLink>
      <RouterLink
        :to="{ name: 'editar-detalles' }"
        @click="activeButton = 'detalles'"
        class="flex-1 text-center font-bold py-1 sm:py-2 rounded transform transition duration-200 hover:scale-105 text-xs sm:text-base"
        :class="activeButton === 'detalles' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'"
      >
        Cita y Resumen
      </RouterLink>
    </nav>
  </div>

  <main class="p-4">
    <div class="mb-5">
      <RouterLink
        :to="{ name: 'mis-reservaciones' }"
        class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Volver a Mis Citas
      </RouterLink>
    </div>
    <RouterView />
  </main>
</template>