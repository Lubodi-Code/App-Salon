<!-- Calender.vue -->
<template>
  <div ref="el"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Datepicker from 'flowbite-datepicker/Datepicker';
import { parse } from 'date-fns';
import useAppointmentsStore from '@/stores/appointments';

const props = defineProps({
  selectedDate: String   // "dd/MM/yyyy"
});

const el = ref(null);
let picker;

const setDate = (dateString) => {
  if (picker && dateString) {
    const today = new Date();
    const parsedDate = parse(dateString, "dd/MM/yyyy", today);
    picker.setDate(parsedDate);
  }
};

onMounted(() => {
  const appointmentsStore = useAppointmentsStore();

  const today = new Date();
  const max = new Date();
  max.setMonth(today.getMonth() + 3);

  picker = new Datepicker(el.value, {
    inline: true,
    autohide: false,
    format: "dd/mm/yyyy",
    defaultDate: props.selectedDate
      ? parse(props.selectedDate, "dd/MM/yyyy", today)
      : today,
    minDate: today,
    maxDate: max,
    month: "MMM",
    daysOfWeekDisabled: [0]
  });

  // Cuando el usuario cliquea otra fecha
  el.value.addEventListener('changeDate', () => {
    const d = picker.getDate();
    if (d) {
      appointmentsStore.updateSelectedDate(new Date(d));
    }
  });

  // Si hay una fecha seleccionada, establecerla
  if (props.selectedDate) {
    setDate(props.selectedDate);
  }
});

// Observar cambios en selectedDate
watch(() => props.selectedDate, (newDate) => {
  setDate(newDate);
});
</script>