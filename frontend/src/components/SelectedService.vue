<script setup>
import { formatCurrency } from '@/helpers';
import useAppointmentsStore from '@/stores/appointments'; // Importación por defecto

const appointmentsStore = useAppointmentsStore();

defineProps({
    service: {
        type: Object,
        required: true
    }
});
</script>

<template>
    <div class="border border-gray-300 rounded-lg p-5 flex justify-between items-center">
        <div>
            <h3 class="text-lg font-bold text-white">{{ service.name }}</h3>
            <p class="text-sm text-blue-300 font-bold">
              Precio {{ formatCurrency(service.price)}}
            </p>
        </div>
        <button 
          class="bg-red-600 text-white px-4 py-2 rounded-md font-semibold ring-1 ring-red-600"
          @click="appointmentsStore.onServiceSelected(service)">
          Eliminar
        </button>
    </div>
</template>