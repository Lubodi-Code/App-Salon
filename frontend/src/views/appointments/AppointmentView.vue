<template>
  <div class="p-4 sm:p-8 w-full">
    <!-- Sección de Detalles y Servicios -->
    <section class="mb-4">
      <h2 class="text-2xl sm:text-4xl font-bold text-white">Detalles Cita y Resumen</h2>
      <p class="text-base sm:text-lg text-gray-300 mt-4">
        Verifica la información y confirma tu cita.
      </p>

      <h3 class="text-xl sm:text-3xl font-extrabold text-white mt-6">Servicios</h3>
      <div class="flex flex-col gap-4 mt-4 w-full">
        <SelectedService 
          v-for="service in appointmentsStore.services" 
          :key="service._id" 
          :service="service"
        />
      </div>

      <div class="mt-4">
        <p 
          v-if="appointmentsStore.selectedServiceMessage"
          class="text-center text-white text-xl sm:text-2xl font-bold">
          {{ appointmentsStore.selectedServiceMessage }}
        </p>
        <p
          v-else
          class="text-right text-white text-xl sm:text-2xl font-bold">
          Total a pagar: {{ formatCurrency(appointmentsStore.totalAmount) }}
        </p>
      </div>
    </section>
    
    <!-- Sección de Fecha y Hora: Se muestra solo si hay servicios seleccionados -->
    <section class="relative" v-if="appointmentsStore.services.length > 0">
      <h3 class="text-2xl sm:text-4xl font-extrabold text-white mb-2">Fecha y Hora</h3>
      <div class="flex flex-col sm:flex-row gap-5 items-start">
        <!-- Calendario -->
    <Calender :selectedDate="appointmentsStore.selectedDate" />


        <!-- Lista de Horas: grid de 1 columna en dispositivos pequeños y 2 en dispositivos grandes -->
        <ul class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          <li 
            v-for="(hour, index) in appointmentsStore.availableHours" 
            :key="index" 
            @click="appointmentsStore.updateTime(hour)"
            :class="[
              'p-4',
              'rounded',
              'text-center',
              'cursor-pointer',
              'text-xl', 'lg:text-2xl',
              'font-bold',
              'transition-colors',
              'duration-200',
              'transform',
              'active:scale-95',
              appointmentsStore.time === hour 
                ? 'bg-blue-500 text-white border border-blue-500'
                : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
            ]">
            {{ hour }}
          </li>
        </ul>
      </div>

      <!-- Botón para confirmar la reservación (visible si se cumple que hay fecha, hora y servicio seleccionados) -->
      <div v-if="appointmentsStore.canConfirmReservation" class="mt-8 text-center">
        <button class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded transition-colors duration-200"
          @click="appointmentsStore.handleAppointmentSubmit">
          Confirmar Reservación
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useAppointmentsStore from '@/stores/appointments';
import SelectedService from '@/components/SelectedService.vue';
import Calender from '@/components/Calender.vue';
import { formatCurrency } from '@/helpers';

const appointmentsStore = useAppointmentsStore();
const selectedDate = ref(null);
</script>
