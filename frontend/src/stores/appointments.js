import AppointmentAPI from "@/api/AppointmentAPI";
import { inject } from "vue";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { parse } from "date-fns";
import { generateHours, convertToDateISO } from "@/helpers/date";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

export const useAppointmentsStore = defineStore("appointments", () => {
  // State
  const state = {
    currentAppointmentId: ref(null),
    currentAppointmentTime: ref(""),
    services: ref([]),
    selectedDate: ref(""),
    availableHours: ref([]),
    time: ref(""),
  };
  const userStore = useUserStore();

  // Composables
  const toast = inject("toast");
  const router = useRouter();

  // Computed
  const totalAmount = computed(() =>
    state.services.value.reduce((sum, s) => sum + s.price, 0)
  
  );

  const canConfirmReservation = computed(
    () => state.selectedDate.value && state.time.value && state.services.value.length > 0
  );

  // Methods
  const loadAppointment = async (appointmentId) => {
    try {
      const { data } = await AppointmentAPI.getById(appointmentId);
      
      // Actualizar el estado con los datos de la cita
      state.currentAppointmentId.value = data._id;
      state.currentAppointmentTime.value = data.time;
      state.services.value = data.services;
      state.time.value = data.time;

      // Formatear y establecer la fecha
      const appointmentDate = new Date(data.date);
      const day = String(appointmentDate.getDate()).padStart(2, '0');
      const month = String(appointmentDate.getMonth() + 1).padStart(2, '0');
      const year = appointmentDate.getFullYear();
      state.selectedDate.value = `${day}/${month}/${year}`;

      // Actualizar las horas disponibles
      await updateAvailableHours(state.selectedDate.value);

      return data;
    } catch (error) {
      toast.open({
        message: 'Error al cargar la cita',
        type: 'error'
      });
    }
  };

  const handleAppointmentSubmit = async () => {
    try {
      const isoDate = convertToDateISO(state.selectedDate.value);
      const appointmentData = {
        services: state.services.value.map(s => s._id),
        date: isoDate,
        time: state.time.value,
        totalAmount: totalAmount.value,
      };

      if (state.currentAppointmentId.value) {
        // Actualizar cita existente
        await AppointmentAPI.update(state.currentAppointmentId.value, appointmentData);
        toast.open({ 
          message: 'Cita actualizada exitosamente', 
          type: 'success' 
        });
      } else {
        // Crear nueva cita
        await AppointmentAPI.create(appointmentData);
        toast.open({ 
          message: 'Cita creada exitosamente', 
          type: 'success' 
        });
      }

     await userStore.getUserAppointments(); 
      router.push({ name: 'mis-reservaciones' });
      clearAppointment();
      
    } catch (error) {
      const errorMessage = state.currentAppointmentId.value 
        ? 'Error al actualizar la cita'
        : 'Error al crear la cita';
        
      toast.open({
        message: errorMessage,
        type: 'error'
      });
    }
  };

  const updateSelectedDate = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    state.selectedDate.value = `${day}/${month}/${year}`;
    updateAvailableHours(state.selectedDate.value);
  };

  const updateTime = (newTime) => {
    state.time.value = newTime;
  };

  const onServiceSelected = (service) => {
    const idx = state.services.value.findIndex(s => s._id === service._id);
    if (idx >= 0) {
      state.services.value.splice(idx, 1);
    } else if (state.services.value.length < 2) {
      state.services.value.push(service);
    } else {
      toast.open({ message: "No puedes seleccionar más de 2 servicios", type: 'warning' });
    }
  };

  const clearAppointment = () => {
    Object.keys(state).forEach(key => {
      if (Array.isArray(state[key].value)) {
        state[key].value = [];
      } else {
        state[key].value = "";
      }
    });
  };

  const updateAvailableHours = async (formattedDate) => {
    if (!formattedDate) {
      state.availableHours.value = [];
      return;
    }

    const dateObj = parse(formattedDate, "dd/MM/yyyy", new Date());
    const hours = generateHours(dateObj);
    const now = new Date();

    try {
      const { data } = await AppointmentAPI.getByDate(formattedDate);
      const reserved = data
        .filter(a => a._id !== state.currentAppointmentId.value)
        .map(a => a.time);

      const availableHours = filterAvailableHours(hours, dateObj, now, reserved);
      state.availableHours.value = availableHours;
    } catch (error) {
      state.availableHours.value = [];
    }
  };

  const filterAvailableHours = (hours, dateObj, now, reserved) => {
    let available = hours.filter(h => {
      const [hourStr, minuteStr] = h.split(':');
      const appointmentTime = new Date(dateObj);
      appointmentTime.setHours(parseInt(hourStr), parseInt(minuteStr), 0);

      if (dateObj.toDateString() === now.toDateString()) {
        const compareTime = new Date(now);
        compareTime.setHours(now.getHours() + 1);
        return appointmentTime > compareTime && !reserved.includes(h);
      }
      
      return dateObj > now ? !reserved.includes(h) : false;
    });

    if (shouldIncludeOriginalTime(dateObj, now)) {
      available.push(state.currentAppointmentTime.value);
    }

    return available.sort((a, b) => hours.indexOf(a) - hours.indexOf(b));
  };

  const shouldIncludeOriginalTime = (dateObj, now) => {
    if (!state.currentAppointmentTime.value) return false;
    
    const originalDate = parse(state.selectedDate.value, "dd/MM/yyyy", new Date());
    return originalDate.getTime() === dateObj.getTime() && 
           dateObj > now && 
           !state.availableHours.value.includes(state.currentAppointmentTime.value);
  };

  const isServiceSelected = (service) => {
    return state.services.value.some(s => s._id === service._id);
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await AppointmentAPI.delete(appointmentId);
      toast.open({ 
        message: 'Cita cancelada exitosamente', 
        type: 'success' 
      });
      await userStore.getUserAppointments();
      router.push({ name: 'mis-reservaciones' });
    } catch (error) {
      toast.open({ 
        message: 'Error al cancelar la cita', 
        type: 'error' 
      });
    }
  };

  const searchAppointments = async (params) => {
    try {
      const { data } = await AppointmentAPI.search(params);
      return data;
    } catch (error) {
      throw error;
    }
  };

  return {
    ...state,
    totalAmount,
    canConfirmReservation,
    updateSelectedDate,
    updateTime,
    onServiceSelected,
    isServiceSelected,
    handleAppointmentSubmit,
    clearAppointment,
    loadAppointment,
    cancelAppointment,
    searchAppointments
  };
});

export default useAppointmentsStore;