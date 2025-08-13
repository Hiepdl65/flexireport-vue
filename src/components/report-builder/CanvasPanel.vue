<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Report Canvas</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Drag and drop elements to build your report</p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="previewReport"
            class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200"
          >
            Preview
          </button>
          <button 
            @click="exportReport"
            class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200"
          >
            Export
          </button>
        </div>
      </div>
    </div>
    
    <div class="p-4 h-[calc(100%-80px)] overflow-auto">
      <!-- Drop Zone -->
      <div 
        class="min-h-[600px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-700"
        @drop="handleDrop"
        @dragover.prevent
        @dragenter.prevent
      >
        <!-- Empty State -->
        <div v-if="reportElements.length === 0" class="text-center py-16">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Start Building Your Report</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Drag elements from the left panel to start building your report
          </p>
          <div class="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
              </svg>
              <span>Drag from left</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
              <span>Drop here</span>
            </div>
          </div>
        </div>
        
        <!-- Report Elements -->
        <div v-else class="space-y-4">
          <div 
            v-for="(element, index) in reportElements" 
            :key="element.id"
            class="relative group"
          >
            <div 
              class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              :class="element.type === 'chart' ? 'min-h-[200px]' : 'min-h-[100px]'"
            >
              <!-- Element Header -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded flex items-center justify-center">
                    <svg class="w-3 h-3 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="element.type === 'table'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      <path v-else-if="element.type === 'chart'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <span class="font-medium text-gray-900 dark:text-white text-sm">{{ element.title }}</span>
                </div>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button 
                    @click="editElement(index)"
                    class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="removeElement(index)"
                    class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Element Content -->
              <div class="text-gray-600 dark:text-gray-300 text-sm">
                <div v-if="element.type === 'table'" class="space-y-2">
                  <div class="grid grid-cols-3 gap-2 text-xs">
                    <div class="font-medium">Column 1</div>
                    <div class="font-medium">Column 2</div>
                    <div class="font-medium">Column 3</div>
                  </div>
                  <div class="grid grid-cols-3 gap-2 text-xs">
                    <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded">Data 1</div>
                    <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded">Data 2</div>
                    <div class="bg-gray-100 dark:bg-gray-700 p-2 rounded">Data 3</div>
                  </div>
                </div>
                <div v-else-if="element.type === 'chart'" class="flex items-center justify-center h-32">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                      </svg>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Chart Preview</p>
                  </div>
                </div>
                <div v-else class="text-center py-4">
                  <p class="text-gray-500 dark:text-gray-400">{{ element.description || 'Text element' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const reportElements = ref([
  {
    id: 1,
    type: 'table',
    title: 'Sales Data Table',
    description: 'Monthly sales performance data'
  },
  {
    id: 2,
    type: 'chart',
    title: 'Revenue Chart',
    description: 'Revenue trends over time'
  }
])

const handleDrop = (event) => {
  event.preventDefault()
  const elementData = JSON.parse(event.dataTransfer.getData('text/plain'))
  
  const newElement = {
    id: Date.now(),
    type: elementData.type,
    title: elementData.title,
    description: elementData.description
  }
  
  reportElements.value.push(newElement)
}

const editElement = (index) => {
  console.log('Edit element:', index)
}

const removeElement = (index) => {
  reportElements.value.splice(index, 1)
}

const previewReport = () => {
  console.log('Preview report')
}

const exportReport = () => {
  console.log('Export report')
}
</script>
