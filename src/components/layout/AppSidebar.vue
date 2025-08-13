<template>
  <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-4rem)] overflow-y-auto">
    <nav class="p-4 space-y-2">
      <router-link
        v-for="item in navigation"
        :key="item.name"
        :to="item.to"
        class="nav-item"
        :class="[isActive(item.to) ? 'nav-item-active' : 'nav-item-inactive']"
      >
        <component :is="item.icon" class="w-5 h-5 mr-3 flex-shrink-0" />
        <span>{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()

const navigation = [
  {
    name: 'Report Builder',
    to: '/',
    icon: WrenchScrewdriverIcon
  },
  {
    name: 'Templates',
    to: '/templates',
    icon: DocumentTextIcon
  },
  {
    name: 'Permissions',
    to: '/permissions',
    icon: ShieldCheckIcon
  },
  {
    name: 'Exports',
    to: '/exports',
    icon: ArrowDownTrayIcon
  },
  {
    name: 'Analytics',
    to: '/analytics',
    icon: ChartBarIcon
  }
]

const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
  color: #6b7280;
}

.nav-item:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.nav-item-active {
  background-color: #dbeafe;
  color: #1d4ed8;
  font-weight: 500;
}

.nav-item-inactive {
  color: #6b7280;
}

.nav-item span {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>