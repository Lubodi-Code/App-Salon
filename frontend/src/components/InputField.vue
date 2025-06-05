<script setup>
import { useField } from 'vee-validate';


const props = defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  rules: {
    type: [String, Object],
    default: ''
  }
});

const { value, errorMessage } = useField(props.name, props.rules);


</script>

<template>
  <div>
    <label :for="name" class="block mb-2 font-bold">{{ label }}</label>
    <input
      :id="name"
      :type="type"
      :placeholder="placeholder"
      v-model="value"
      class="w-full p-3 border rounded"
      :class="{ 'border-red-500': errorMessage }"
    />
    <p v-if="errorMessage" class="text-red-500 text-sm mt-1">
      {{ errorMessage }}
    </p>
  </div>
</template>