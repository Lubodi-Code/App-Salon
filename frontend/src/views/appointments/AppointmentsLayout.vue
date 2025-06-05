<template>
  <!-- Header del layout -->
  <header class="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-800 text-white">
    <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
      <!-- Título -->
      <h1 class="text-3xl sm:text-5xl font-bold">App Salon</h1>
      <!-- Barra de navegación -->
      <nav class="flex space-x-2 sm:space-x-4">
        <RouterLink
          :to="{ name: 'mis-reservaciones' }"
          class="px-2 py-1 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm sm:text-base"
        >
          Mis Citas
        </RouterLink>
        <!-- Botón "Nueva Cita" con redirección -->
        <RouterLink
          to="/reservaciones/nueva/servicios"
          class="px-2 py-1 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm sm:text-base"
        >
          Nueva Cita
        </RouterLink>


           <RouterLink
          v-if="userStore.isAdmin"
          :to="{ name: 'appointments-admin' }"
          class="px-2 py-1 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 rounded transition-colors text-sm sm:text-base"
        >
          Panel Admin
        </RouterLink>
      </nav>
    </div>
    <!-- Área de usuario -->
    <div class="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
      <span class="font-medium text-sm sm:text-base">{{ userStore.getUserName }}</span>
      <button 
      @click="userStore.logout()"
      class="px-2 py-1 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 rounded transition-colors text-sm sm:text-base">
        Cerrar Sesión
      </button>
    </div>
  </header>

  <!-- Espacio inferior donde se renderiza el contenido extra -->
  <main class="p-4">
    <RouterView />
  </main>
</template>

<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import { useUserStore } from '@/stores/user'; // Importa el store de usuario
  const userStore = useUserStore(); // Crea una instancia del store de usuario
</script>