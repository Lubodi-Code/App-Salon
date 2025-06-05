<script setup>
const authRoutes = [{name: 'register', text: 'Crear Cuenta'},
 {name: 'login', text: 'Iniciar Sessión'}, 
 ]
</script>

<template>
    <div class="mx-auto lg:w-4/5 mt-20">
    <RouterView />

    <nav class="mt-10 flex flex-col items-center space-y-5 lg:flex-row lg:justify-between lg:space-y-0">
        <RouterLink
          v-for="route in authRoutes"
          class="px-2 py-1 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm sm:text-base
          text-white"
          :key="route.name"
          :to="{ name: route.name }"
        >
          {{ route.text }}
        </RouterLink>
      </nav>
    </div>
  </template>
  