<script setup>
import { useUserStore } from '@/stores/user'
import Appointment from '@/components/Appointment.vue'
import { onMounted, ref, computed, watch } from 'vue'

const userStore = useUserStore()
const search = ref('')
const isLoading = ref(true)

async function loadAppointments() {
  isLoading.value = true
  try {
    if (userStore.user?._id) {
      await userStore.getUserAppointments()
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadAppointments()
})

const filteredAppointments = computed(() => {
  if (!search.value) return userStore.userAppointments
  const term = search.value.toLowerCase()
  return userStore.userAppointments.filter(a => {
    const dateObj = new Date(a.date)
    const dateStr = dateObj.toLocaleDateString()
    const dayStr = dateObj.toLocaleDateString('es-ES', { weekday: 'long' })
    return (
      a.user.name.toLowerCase().includes(term) ||
      a.user.email.toLowerCase().includes(term) ||
      dateStr.includes(term) ||
      dayStr.toLowerCase().includes(term) ||
      a.time.includes(term)
    )
  })
})

// Observar cambios en el usuario
watch(
  () => userStore.user,
  async (newUser) => {
    if (newUser?._id) {
      await loadAppointments()
    }
  },
  { immediate: true }
)




</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
      <p class="text-white">Total de citas: {{ userStore.userAppointments.length }}</p>
      <input
        v-model="search"
        type="text"
        placeholder="Buscar"
        class="bg-gray-700 text-white px-3 py-1 rounded focus:outline-none"
      />
    </div>

      <div class="bg-gray-800 rounded-lg p-4 sm:p-6 overflow-x-auto">
        <p v-if="isLoading" class="text-white text-center">Cargando citas...</p>
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