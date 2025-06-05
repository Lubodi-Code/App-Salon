<script setup>
import { Form } from 'vee-validate'
import InputField from '@/components/InputField.vue'
import { useUserStore } from '@/stores/user'
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = inject('toast')
const userStore = useUserStore()

const initialValues = {
  email: ''
}

async function onSubmit(values) {
  try {
    const { data } = await userStore.forgotPassword(values)
    toast.open({
      message: data.msg || 'Hemos enviado un correo de restablecimiento de contraseña ',
      type: 'success'
    })
  } catch (error) {
    toast.open({
      message: error.response?.data?.msg || 'Error al procesar la solicitud',
      type: 'error'
    })
  }
}

const handleBack = () => {
  router.push({ name: 'login' })
}
</script>

<template>
  <h1 class="text-6xl font-extrabold text-center mt-10 text-white">Recuperar Contraseña</h1>
  <p class="text-center mt-4 text-white">Ingresa tu email para correo de restablecimiento</p>

  <Form
    :initial-values="initialValues"
    @submit="onSubmit"
    class="max-w-md mx-auto space-y-6 mt-8 "
  >
    <InputField
      name="email"
      label="Email"
      type="email"
      placeholder="tú@ejemplo.com"
      rules="required|email"
      class="text-black"
    />
    <div class="space-y-4">
      <button
        type="submit"
        class="w-full py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors"
      >
        Enviar Email de Recuperación
      </button>
      
      <button
        type="button"
        @click="handleBack"
        class="w-full py-3 bg-gray-600 text-white font-bold rounded hover:bg-gray-700 transition-colors"
      >
        Volver al Login
      </button>
    </div>
  </Form>
</template>

<style scoped>
:deep(.text-red-500) {
  color: white;
}
</style>