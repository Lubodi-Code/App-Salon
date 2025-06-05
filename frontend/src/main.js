import './assets/main.css'
import "flowbite/dist/flowbite.turbo.js";
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import "./helpers/validate.js";
import {  useToast } from 'vue-toast-notification';

import App from './App.vue'
import router from './router'
import "vue-toast-notification/dist/theme-sugar.css";

const $toast = useToast({
    position: 'top-right',
    duration: 6000,
    dismissible: true,
    pauseOnHover: true,
    closeOnClick: true,
    type: 'default',
    theme: 'sugar',
});

const app = createApp(App)
app.provide('toast', $toast)
app.use(createPinia())
app.use(router)

app.mount('#app')
