import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthApi from '../api/AuthApi.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/reservaciones',
    name: 'reservaciones',
    component: () => import('../views/appointments/AppointmentsLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'mis-reservaciones',
        name: 'mis-reservaciones',
        component: () => import('../views/appointments/MyAppointemntsView.vue'),
      },
      {
        path: 'nueva',
        name: 'nueva-reservacion',
        component: () => import('../views/appointments/NewAppointmentLayout.vue'),
        meta: { requiresAuth: true },
        children: [
          {
            path: 'servicios',
            name: 'servicios-reservacion',
            component: () => import('../views/appointments/ServicesView.vue'),
          },
          {
            path: 'detalles',
            name: 'detalles-reservacion',
            component: () => import('../views/appointments/AppointmentView.vue'),
          },
        ],
      },
      {
        path: ':id/editar',
        name: 'editar-reservacion',
        component: () => import('../views/appointments/EditAppoinmentLayout.vue'),
        children: [
          {
            path: 'servicios',
            name: 'editar-servicios',
            component: () => import('../views/appointments/ServicesView.vue'),
          },
          {
            path: 'detalles',
            name: 'editar-detalles',
            component: () => import('../views/appointments/AppointmentView.vue'),
          },
        ],
      }
    ]
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/auth/AuthLayout.vue'),
    children: [
      {
        path: 'confirmar-cuenta/:token',
        name: 'confirm-account',
        component: () => import('../views/auth/ConfirmAccountView.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('../views/auth/RegisterView.vue'),
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('../views/auth/LoginView.vue'),
      },
      {
        path: 'olvide-password',
        name: 'forgot-password',
        component: () => import('../views/auth/ForgotPasswordView.vue'),
      },
      {
        path: 'reset-password/:token',
        name: 'reset-password',
        component: () => import('../views/auth/ResetPasswordView.vue'),
      },
    ],
  },

   {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }, // Add meta for admin
    children: [
      {
        path: '',
        name: 'appointments-admin',
        component: () => import('../views/admin/AppointmentsView.vue'),
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  if (requiresAuth) {
    try {
      const { data: user } = await AuthApi.auth()
      
      // Check if route requires admin
      if (requiresAdmin && !user.admin) {
      
        return next({ name: 'home' })
      }

      // If user is admin and tries to access non-admin pages, redirect to admin
      if (user.admin && !requiresAdmin && to.name !== 'admin') {
     
        return next({ name: 'admin' })
      }

      next()
    } catch (error) {
    
      next({ name: 'login' })
    }
  } else {
    next()
  }
})
export default router