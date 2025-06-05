<script setup>
import { computed } from 'vue';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'vue-router';
import { formatCurrency } from '@/helpers';
import { useAppointmentsStore } from '@/stores/appointments';
const appointmentsStore = useAppointmentsStore();



const router = useRouter();

const props = defineProps({
  appointment: {
    type: Object,
    required: true
  }
});

// Propiedad computada para la fecha formateada.
const formattedDate = computed(() => 
  format(new Date(props.appointment.date), 'PPPP', { locale: es })
);

// Utilizamos directamente los servicios del appointment (si se actualizan en el editor, se reflejarán aquí)
const services = computed(() => props.appointment.services);

// Si queremos recalcular el total a partir de los precios actuales de los servicios:
const totalAmount = computed(() =>
  services.value.reduce((sum, service) => sum + service.price, 0)
);

const handleEditClick = () => {
  router.push({
    name: 'editar-servicios',
    params: { id: props.appointment._id },
  });
  
};

const handleCancelClick = () => {
  appointmentsStore.cancelAppointment(props.appointment._id);
};
</script>

<template>
  <div class="bg-white p-6 space-y-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
    <!-- Fecha y Hora -->
    <div class="border-b pb-3">
      <p class="text-2xl font-bold text-blue-800 mb-1">
        {{ formattedDate }}
      </p>
      <p class="text-lg text-blue-600">
        Hora: {{ appointment.time }}
      </p>
    </div>

    <!-- Servicios -->
    <div class="py-3">
      <h3 class="font-bold text-blue-900 mb-2">Servicios:</h3>
      <ul class="space-y-2">
        <li
          v-for="(service, index) in services"
          :key="index"
          class="flex justify-between items-center p-3 border rounded-lg bg-blue-100">
          <span class="text-lg font-semibold text-blue-800">
            {{ service.name }}
          </span>
          <span class="text-lg font-bold text-blue-600">
            {{ formatCurrency(service.price) }}
          </span>
        </li> 
      </ul>
    </div>

    <!-- Total -->
    <div class="pt-3 border-t">
      <p class="text-xl font-bold text-blue-900 flex justify-between items-center">
        Total a Pagar:
        <span class="text-blue-600">
          {{ formatCurrency(totalAmount) }}
        </span>
      </p>
    </div>

    <!-- Buttons -->
    <div class="flex gap-4 pt-4 border-t">
      <button 
        @click="handleEditClick"
        class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
        Editar Cita
      </button>
      <button 
      @click="handleCancelClick"
        class="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        Cancelar Cita
      </button>
    </div>
  </div>
</template>