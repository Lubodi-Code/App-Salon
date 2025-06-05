<template>
  <div class="p-4 w-full">
    <!-- Menú de navegación con flexbox -->
    <nav class="flex w-full space-x-2 sm:space-x-4">
      <RouterLink
        to="servicios"
        @click="activeButton = 'servicios'"
        class="flex-1 text-center font-bold py-1 sm:py-2 rounded transform transition duration-200 hover:scale-105 text-xs sm:text-base"
        :class="activeButton === 'servicios' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'"
      >
        Servicio
      </RouterLink>
      <RouterLink
        to="detalles"
        @click="activeButton = 'detalles'"
        class="flex-1 text-center font-bold py-1 sm:py-2 rounded transform transition duration-200 hover:scale-105 text-xs sm:text-base"
        :class="activeButton === 'detalles' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'"
      >
        Cita y Resumen
      </RouterLink>
    </nav>
  </div>
  <main class="p-4">
    <RouterView />
  </main>
</template>

<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import { ref, onMounted} from 'vue'
  import { useAppointmentsStore } from '../../stores/appointments'

  const appointmentsStore = useAppointmentsStore();

  onMounted(() => {
    // Cargar los servicios al montar el componente
    appointmentsStore.clearAppointment();
  });
  // Inicializamos la variable reactiva para el botón activo
  const activeButton = ref('servicios')
</script>