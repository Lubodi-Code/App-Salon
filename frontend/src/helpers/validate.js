import { defineRule, configure } from 'vee-validate'
import { required, email, min } from '@vee-validate/rules'

// Reglas core
defineRule('required', required)
defineRule('email',    email)
defineRule('min',      min)

// Regla personalizada para confirmar contraseña
defineRule('confirmed', (value, [target], ctx) => {
  // Compara los valores usando trim() para evitar espacios vacíos
  if (value.trim() === ctx.form[target]?.trim()) {
    return true
  }
  return 'Las contraseñas no coinciden.'
})

configure({
  generateMessage: (ctx) => {
    const messages = {
      required: `El campo ${ctx.field} es obligatorio.`,
      email: `El campo ${ctx.field} debe ser un correo electrónico válido.`,
      min: `El campo ${ctx.field} debe tener al menos ${ctx.rule.params[0]} caracteres.`,
      confirmed: `Las contraseñas no coinciden.`
    }
    return messages[ctx.rule.name] || `El campo ${ctx.field} no es válido.`
  },
  bails: true,
  validateOnInput: true,
  validateOnBlur: true,
  validateOnChange: true,
})