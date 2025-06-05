<script setup>
import { useUserStore } from '@/stores/user'
import Appointment from '@/components/Appointment.vue'
import { onMounted, ref, computed } from 'vue'

const userStore = useUserStore()
const search = ref('')

const filteredAppointments = computed(() => {
  if(!search.value) return userStore.userAppointments
  return userStore.userAppointments.filter(a =>
    a.user.name.toLowerCase().includes(search.value.toLowerCase()) ||
    a.user.email.toLowerCase().includes(search.value.toLowerCase()) ||
    new Date(a.date).toLocaleDateString().includes(search.value)
  )
})

onMounted(async () => {
  // Fetch all appointments for admin
  await userStore.getUserAppointments(userStore.user._id)
})
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center gap-4">
      <p class="text-white">Total de citas: {{ userStore.userAppointments.length }}</p>
      <input
        v-model="search"
        type="text"
        placeholder="Buscar"
        class="bg-gray-700 text-white px-3 py-1 rounded focus:outline-none"
      />
    </div>

    <div class="bg-gray-800 rounded-lg p-6">
      <p v-if="userStore.loading" class="text-white text-center">Cargando citas...</p>
      <div v-else>
        <p v-if="userStore.noAppointments" class="text-white text-center text-lg">
          No hay citas programadas en el sistema.
        </p>
        
        <div v-else class="space-y-6">
          <div v-for="appointment in filteredAppointments"
               :key="appointment._id"
               class="bg-gray-900 rounded-lg p-4 mb-4">
            <!-- User info section -->
            <div class="mb-4 border-b border-gray-700 pb-2">
              <p class="text-blue-400">Cliente: {{ appointment.user.name }}</p>
              <p class="text-gray-400">Email: {{ appointment.user.email }}</p>
            </div>
            
            <Appointment 
              :appointment="appointment"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>