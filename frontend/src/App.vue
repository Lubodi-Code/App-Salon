<script setup>
import { RouterView } from 'vue-router'
// ...otros imports o código existente...
</script>

<template>
  <!-- Contenedor principal con display flex en pantallas medianas en adelante y altura completa -->
  <div class="md:flex h-screen">
    
    <!-- Columna izquierda: imagen o contenido con fondo usando la clase personalizada 'app' -->
    <div class="h-64 md:h-auto md:w-1/3 bg-app">
      <!-- Aquí podrías colocar una imagen o contenido visual -->
    </div>

    <!-- Columna derecha: contenido scrollable -->
    <div class="md:w-2/3 px-10 py-5 min-h-full overflow-y-scroll">
      <!-- Vista del router (contenido dinámico) -->
      <RouterView />
    </div>

  </div>
</template>

<style scoped>
/* Aquí puedes agregar estilos CSS personalizados si los necesitas */
</style>
