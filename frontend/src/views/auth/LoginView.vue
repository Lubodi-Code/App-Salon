<script setup>
import { Form } from 'vee-validate'
import InputField from '@/components/InputField.vue'
import AuthApi from '@/api/AuthApi'
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const toast = inject('toast')

const initialValues = {
  email: '',
  password: ''
}

async function onSubmit(values) {
  try {
    const { data } = await AuthApi.login(values)


    // Extrae y almacena el token en localStorage si está presente
   
      localStorage.setItem('AUTH_TOKEN', data.token)

      router.push({ name: 'mis-reservaciones' })
   

    const { data: user } = await AuthApi.auth()
    
    if (user.admin) {
      router.push({ name: 'admin' })
    } else {
      router.push({ name: 'mis-reservaciones' })
    }

  
  } catch (error) {
    toast.open({
      message: error.response?.data?.msg || 'Error en el inicio de sesión',
      type: 'error',
    })
    console.log(error)
  }
}
</script>

<template>
  <h1 class="text-6xl font-extrabold text-center mt-10">Iniciar Sesión</h1>

  <Form
    :initial-values="initialValues"
    @submit="onSubmit"
    class="max-w-md mx-auto space-y-6"
  >
    <InputField
      name="email"
      label="Email"
      type="email"
      placeholder="tú@ejemplo.com"
      rules="required|email"
    />
    <InputField
      name="password"
      label="Contraseña"
      type="password"
      placeholder="Tu contraseña"
      rules="required"
    />
    <button
      type="submit"
      class="w-full py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors"
    >
      Iniciar Sesión
    </button>

     <div class="text-center">
      <RouterLink 
        :to="{name: 'forgot-password'}" 
        class="text-blue-500 hover:text-blue-600 text-sm"
      >
        ¿Olvidaste tu contraseña?
      </RouterLink>
    </div>
    
  </Form>
</template>