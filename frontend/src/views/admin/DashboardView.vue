<script setup>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
</script>

<template>
  <div class="space-y-5">
    <h2 class="text-4xl font-black text-white">Panel de Administración</h2>
    
    <div class="bg-white shadow rounded-lg p-6">
      <p class="text-2xl font-bold">
        Bienvenido: {{ userStore.getUserName }}
      </p>
    </div>
  </div>
</template>