import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView/HomeView.vue'
import DashboardView from '@/views/DasbhoardView/DashboardView.vue'
import {
  authenticate,
  redirectToDashboardIfLoggedIn,
  checkIfOnboarded,
} from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      beforeEnter: [redirectToDashboardIfLoggedIn],
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      beforeEnter: [authenticate],
      component: DashboardView,
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter: [redirectToDashboardIfLoggedIn],
      component: () => import('../views/LoginView/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      beforeEnter: [redirectToDashboardIfLoggedIn],
      component: () => import('../views/SignupView/SignupView.vue'),
    },
    {
      // to go to onboarding you have to be logged in and onboarded has to be false
      path: '/onboarding',
      name: 'onboarding',
      beforeEnter: [checkIfOnboarded],
      component: () => import('../views/OnboardingView/OnboardingView.vue'),
    },
    {
      path: '/:catchAll(.*)',
      name: 'notFound',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

export default router
