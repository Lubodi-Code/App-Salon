import { ref, onMounted, computed } from 'vue'
import { defineStore } from 'pinia'
import ServiceAPI from '@/api/ServiceAPI.js'

export const useServicesStore = defineStore('services', () => {
    const services = ref([])
    onMounted( async() => {
        try {
            console.log("Fetching services...")
            const { data } = await ServiceAPI.all()
            services.value = data
        }
        catch (error) {
            console.error("Error fetching services:", error)
        }
    })

    
   
    return {
 services
    }
})
