<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Container -->
    <div class="flex">
      <!-- Sidebar -->
      <AppSidebar />
      
      <!-- Main Content -->
      <main class="flex-1 min-h-[calc(100vh-4rem)]">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>