import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'ReportBuilder',
          component: () => import('@/views/ReportBuilder.vue')
        },
        {
          path: '/templates',
          name: 'Templates',
          component: () => import('@/views/Templates.vue')
        },
        {
          path: '/permissions',
          name: 'Permissions',
          component: () => import('@/views/Permissions.vue')
        },
        {
          path: '/exports',
          name: 'Exports',
          component: () => import('@/views/Exports.vue')
        },
        {
          path: '/analytics',
          name: 'Analytics',
          component: () => import('@/views/Analytics.vue')
        }
      ]
    }
  ]
})

export default router