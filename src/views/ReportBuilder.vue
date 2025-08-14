<template>
  <div class="h-full">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Report Builder
          </h1>
          <p class="text-gray-600 dark:text-gray-300 mt-1">
            Drag and drop to create powerful reports without writing SQL
          </p>
        </div>
        
        <!-- Header Actions -->
        <div class="flex items-center gap-3">
          <!-- Quick Actions -->
          <div class="flex items-center gap-2">
            <button 
              @click="openSaveModal"
              :disabled="!reportStore.hasValidQuery"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
              </svg>
              Save Template
            </button>
            
            <button 
              @click="loadTemplate"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
              </svg>
              Load Template
            </button>
          </div>
          
          <!-- Status Indicators -->
          <div class="flex items-center gap-4 text-sm">
            <div class="flex items-center gap-1">
              <div 
                :class="[
                  'w-2 h-2 rounded-full',
                  reportStore.selectedTables.length > 0 ? 'bg-green-500' : 'bg-gray-300'
                ]"
              ></div>
              <span class="text-gray-600 dark:text-gray-400">
                {{ reportStore.selectedTables.length }} tables
              </span>
            </div>
            
            <div class="flex items-center gap-1">
              <div 
                :class="[
                  'w-2 h-2 rounded-full',
                  reportStore.selectedColumns.length > 0 ? 'bg-green-500' : 'bg-gray-300'
                ]"
              ></div>
              <span class="text-gray-600 dark:text-gray-400">
                {{ reportStore.selectedColumns.length }} columns
              </span>
            </div>
            
            <div class="flex items-center gap-1">
              <div 
                :class="[
                  'w-2 h-2 rounded-full',
                  reportStore.filters.length > 0 ? 'bg-blue-500' : 'bg-gray-300'
                ]"
              ></div>
              <span class="text-gray-600 dark:text-gray-400">
                {{ reportStore.filters.length }} filters
              </span>
            </div>
          </div>
        </div>
      </div>
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
    
    <!-- Progress Indicator -->
    <div 
      v-if="reportStore.isLoading"
      class="fixed bottom-6 right-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4"
    >
      <div class="flex items-center gap-3">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
        <span class="text-sm text-gray-600 dark:text-gray-400">Processing...</span>
      </div>
    </div>
    
    <!-- Save Template Modal -->
    <SaveTemplateModal
      :show="showSaveModal"
      @close="showSaveModal = false"
      @save="handleSaveTemplate"
    />
    
    <!-- Success Notification -->
    <div 
      v-if="showSuccessNotification"
      class="fixed bottom-6 left-6 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform"
      :class="showSuccessNotification ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'"
    >
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="font-medium">{{ successMessage }}</span>
      </div>
    </div>
    
    <!-- Keyboard Shortcuts Help -->
    <div 
      v-if="showKeyboardHelp"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showKeyboardHelp = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Keyboard Shortcuts</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Save Template</span>
            <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl + S</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Preview Report</span>
            <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl + P</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Reset All</span>
            <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl + R</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Show Help</span>
            <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">?</kbd>
          </div>
        </div>
        <button 
          @click="showKeyboardHelp = false"
          class="mt-4 w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import DataSourcesPanel from '@/components/report-builder/DataSourcesPanel.vue'
import CanvasPanel from '@/components/report-builder/CanvasPanel.vue'
import ConfigurationPanel from '@/components/report-builder/ConfigurationPanel.vue'
import SaveTemplateModal from '@/components/report-builder/SaveTemplateModal.vue'
import { useReportBuilderStore } from '@/stores/ReportBuilder'
import { templatesAPI } from '@/services/api'

const reportStore = useReportBuilderStore()
const showSaveModal = ref(false)
const showSuccessNotification = ref(false)
const showKeyboardHelp = ref(false)
const successMessage = ref('')

const openSaveModal = () => {
  if (!reportStore.hasValidQuery) {
    showNotification('Please select at least one table and column before saving')
    return
  }
  showSaveModal.value = true
}

const loadTemplate = () => {
  // Navigate to templates page or open template selection modal
  console.log('Load template functionality')
  // You can implement this to open a template picker modal
}

const handleSaveTemplate = async (templateData) => {
  try {
    // Add query configuration to template data
    const templateWithConfig = {
      ...templateData,
      query_config: reportStore.buildQueryConfig(),
      display_config: {
        theme: 'light',
        colorScheme: 'blue',
        fontSize: 'medium'
      },
      export_config: {
        pdf: true,
        excel: true,
        csv: false
      }
    }
    
    // Save template using API
    const savedTemplate = await templatesAPI.createTemplate(templateWithConfig)
    console.log('Template saved successfully:', savedTemplate)
    
    // Close modal
    showSaveModal.value = false
    
    // Show success notification
    showNotification('Template saved successfully!')
    
  } catch (error) {
    console.error('Failed to save template:', error)
    
    // Show error notification
    const errorMessage = error.response?.data?.detail || 'Failed to save template. Please try again.'
    showNotification(errorMessage, 'error')
  }
}

const showNotification = (message, type = 'success') => {
  successMessage.value = message
  showSuccessNotification.value = true
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    showSuccessNotification.value = false
  }, 3000)
}

// Keyboard shortcuts
const handleKeydown = (event) => {
  // Check for modifier keys
  const isCtrlOrCmd = event.ctrlKey || event.metaKey
  
  if (isCtrlOrCmd) {
    switch (event.key.toLowerCase()) {
      case 's':
        event.preventDefault()
        openSaveModal()
        break
      case 'p':
        event.preventDefault()
        // Trigger preview - you can emit an event to CanvasPanel
        console.log('Keyboard shortcut: Preview report')
        break
      case 'r':
        event.preventDefault()
        if (confirm('Are you sure you want to reset all configurations?')) {
          reportStore.reset()
          showNotification('Report builder reset')
        }
        break
    }
  } else {
    switch (event.key) {
      case '?':
        event.preventDefault()
        showKeyboardHelp.value = !showKeyboardHelp.value
        break
      case 'Escape':
        showKeyboardHelp.value = false
        break
    }
  }
}

onMounted(() => {
  console.log('🚀 Report Builder mounted')
  
  // Add keyboard event listeners
  document.addEventListener('keydown', handleKeydown)
  
  // Load any initial data if needed
  nextTick(() => {
    // Auto-generate SQL if there's already a valid query
    if (reportStore.hasValidQuery) {
      reportStore.generateSQL()
    }
  })
})

onUnmounted(() => {
  console.log('👋 Report Builder unmounted')
  
  // Remove keyboard event listeners
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Smooth transitions for modals and notifications */
.transition-all {
  transition: all 0.3s ease;
}

/* Status indicator styles */
.bg-green-500 {
  background-color: #10b981;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

/* Keyboard shortcut styling */
kbd {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.025em;
}

/* Gradient text for title */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-primary-600 {
  --tw-gradient-from: #2563eb;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(37, 99, 235, 0));
}

.to-purple-600 {
  --tw-gradient-to: #9333ea;
}

.bg-clip-text {
  background-clip: text;
}

.text-transparent {
  color: transparent;
}
</style>