<script setup>
import { useServicesStore } from '@/stores/services';
import ServiceItem from '@/components/ServiceItem.vue';
const servicesStore = useServicesStore();
</script>

<template>
  <h2 class="text-2xl sm:text-4xl font-bold text-white mt-10">Servicios</h2>
  <p class="text-base sm:text-lg text-gray-300 mt-4">
    Elije al menos un servicio para tu cita.
  </p>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10 mt-4">
    <ServiceItem 
      v-for="service in servicesStore.services" 
      :key="service._id" 
      :service="service" 
    />
  </div>
</template>