<script setup>
import { formatCurrency } from '@/helpers';
import useAppointmentsStore from '@/stores/appointments';   

const appointmentsStore = useAppointmentsStore();

defineProps({
  service: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div 
    class="p-6 rounded-lg shadow-md transition transform duration-200 cursor-pointer active:scale-95"
    :class="appointmentsStore.isServiceSelected(service) 
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-800'" 
    @click="appointmentsStore.onServiceSelected(service)">
    <h2 class="text-2xl font-medium">{{ service.name }}</h2>
    <p class="text-4xl font-bold">{{ formatCurrency(service.price) }}</p>
  </div>
</template>