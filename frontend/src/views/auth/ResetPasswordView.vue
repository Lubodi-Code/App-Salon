<script setup>
import { Form, useForm } from 'vee-validate'
import InputField from '@/components/InputField.vue'
import { inject, onMounted } from 'vue' // Added onMounted
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const toast = inject('toast')
const { resetForm } = useForm()

const token = route.params.token

// Verify token on component mount
onMounted(async () => {
  try {
    await userStore.verifyPasswordResetToken(token)
  } catch (error) {
    toast.open({
      message: 'Token no válido o expirado',
      type: 'error'
    })
    router.push({ name: 'login' })
  }
})

const initialValues = {
  password: '',
  password_confirmation: ''
}

async function onSubmit(values) {
  if (!token) {
    toast.open({
      message: 'Token no válido',
      type: 'error'
    })
    return
  }

  try {
    const data = await userStore.resetPassword({
      token,
      password: values.password
    })

    if (data && data.msg) {
      toast.open({
        message: data.msg,
        type: 'success'
      })
      
      resetForm()
      
      // Redirect after success
      setTimeout(() => {
        router.push({ name: 'login' })
      }, 2000)
    }
  } catch (error) {
    toast.open({
      message: error.response?.data?.msg || 'Error al procesar la solicitud',
      type: 'error'
    })
  }
}
</script>

<template>
  <h1 class="text-6xl font-extrabold text-center mt-10 text-white">Restablecer Password</h1>
  <p class="text-center mt-4 text-white">Coloca tu nuevo password</p>

  <Form
    :initial-values="initialValues"
    @submit="onSubmit"
    class="max-w-md mx-auto space-y-6 mt-8"
  >
    <InputField
      name="password"
      label="Nuevo Password"
      type="password"
      placeholder="Tu Nuevo Password"
      rules="required|min:8"
      class="text-black"
    />

    <InputField
      name="password_confirmation"
      label="Repetir Password"
      type="password"
      placeholder="Repite tu Password"
      rules="required|confirmed:password"
      class="text-black"
    />

    <button
      type="submit"
      class="w-full py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors"
    >
      Guardar Password
    </button>
  </Form>
</template>

<style scoped>
:deep(.text-red-500) {
  color: white;
}
</style>