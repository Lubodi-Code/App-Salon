<script setup>
import { Form } from 'vee-validate'
import InputField from '@/components/InputField.vue'
import AuthApi from '@/api/AuthApi'
import { inject } from 'vue'

const  toast  = inject('toast')




const initialValues = {
  name: '',                  // <-- nuevo campo
  email: '',
  password: '',
  password_confirmation: ''
}




async function onSubmit({ password_confirmation, ...values }) {
  try {
    const { data } = await AuthApi.register(values)
    console.log(data)
    // Asegúrate de usar la propiedad correcta: data.msg o un fallback
    toast.open({
      message: data.msg || 'Registro completado',
      type: 'success',
    })
  } catch (error) {
    toast.open({
      message: error.response?.data?.msg || 'Error en el registro',
      type: 'error',
    })
  }
}
</script>

<template>
  <h1 class="text-6xl font-extrabold text-center mt-10">Crea Cuenta</h1>

  <Form
    :initial-values="initialValues"
    @submit="onSubmit"
    class="max-w-md mx-auto space-y-6"
  >
    <InputField
      name="name"
      label="Nombre"
      type="text"
      placeholder="Tu nombre"
      rules="required"
    />
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
      placeholder="Mínimo 8 caracteres"
      rules="required|min:8"
    />
    <InputField
      name="password_confirmation"
      label="Confirmar contraseña"
      type="password"
      placeholder="Repite tu contraseña"
      rules="required|confirmed:password"
    />
    <button
      type="submit"
      class="w-full py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors"
    >
      Crear Cuenta
    </button>
  </Form>
</template>