<script setup>
    import { useUserStore } from '../../stores/user'
    const user = useUserStore()
</script>


<template>
    <div class="flex flex-col md:flex-row justify-between gap-4">
        <div>
            <h1 class="text-2xl lg:text-6xl font-black text-white">App Salón</h1>
            <h2 class="text-xl lg:text-2xl font-black text-white">Panel de Administración</h2>
        </div>

        <div class="flex flex-col space-y-5 items-start md:items-end">
              <div class="flex gap-2 items-center">
                  <p class="text-white text-right">Hola: {{ user.getUserName }}</p>
                  <button
                      type="button"
                      class="bg-red-600 hover:bg-red-700 p-2 text-white uppercase text-xs font-extrabold rounded-lg"
                      @click="user.logout"
                  >
                      Cerrar Sesión
                  </button>
              </div>
              <nav class="flex flex-col sm:flex-row gap-2">
                <RouterLink
                  to="/admin"
                  class="text-xs bg-gray-700 text-white px-2 py-1 rounded"
                >Panel</RouterLink>
                <RouterLink
                  to="/reservaciones/nueva/servicios"
                  class="text-xs bg-gray-700 text-white px-2 py-1 rounded"
                >Agendar Cita</RouterLink>
              </nav>
          </div>
    </div>
    <main class="space-y-6">
       <RouterView />
    </main>
</template>