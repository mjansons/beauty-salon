import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView/HomeView.vue'
import { authenticate } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // {
    //   path: '/dashboard',
    //   component: MainLayout,
    //   beforeEnter: [authenticate], // guard
    //   children: [
    //     // all routes here will be protected by the authenticate guard
    //   ],
    // },
    {
      path: '/:catchAll(.*)',
      name: 'notFound',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

export default router
