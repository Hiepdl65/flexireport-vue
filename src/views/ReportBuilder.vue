<template>
  <div class="h-full">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <h1 class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
        Report Builder
      </h1>
      <p class="text-gray-600 dark:text-gray-300 mt-1">
        Drag and drop to create powerful reports without writing SQL
      </p>
    </div>
    
    <!-- Builder Container -->
    <div class="p-6">
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[800px]">
        <!-- Data Sources Panel -->
        <div class="xl:col-span-3">
          <DataSourcesPanel />
        </div>
        
        <!-- Canvas Panel -->
        <div class="xl:col-span-6">
          <CanvasPanel />
        </div>
        
        <!-- Configuration Panel -->
        <div class="xl:col-span-3">
          <ConfigurationPanel />
        </div>
      </div>
    </div>
    
    <!-- Save Template Modal -->
    <SaveTemplateModal
      :show="showSaveModal"
      @close="showSaveModal = false"
      @save="handleSaveTemplate"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataSourcesPanel from '@/components/report-builder/DataSourcesPanel.vue'
import CanvasPanel from '@/components/report-builder/CanvasPanel.vue'
import ConfigurationPanel from '@/components/report-builder/ConfigurationPanel.vue'
import SaveTemplateModal from '@/components/report-builder/SaveTemplateModal.vue'
import { useReportBuilderStore } from '@/stores/ReportBuilder'
import { templatesAPI } from '@/services/api'

const reportStore = useReportBuilderStore()
const showSaveModal = ref(false)

const handleSaveTemplate = async (templateData) => {
  try {
    // Save template using API
    const savedTemplate = await templatesAPI.createTemplate(templateData)
    console.log('Template saved successfully:', savedTemplate)
    
    // Close modal
    showSaveModal.value = false
    
    // Show success notification (you can implement a toast notification system)
    alert('Template saved successfully!')
    
  } catch (error) {
    console.error('Failed to save template:', error)
    
    // Show error notification
    if (error.response?.data?.detail) {
      alert(`Failed to save template: ${error.response.data.detail}`)
    } else {
      alert('Failed to save template. Please try again.')
    }
  }
}
</script>