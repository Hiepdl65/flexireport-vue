<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  console.log('🚀 App.vue mounted successfully')
  console.log('✅ Router ready:', router.currentRoute.value.path)
})
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
}
</style>