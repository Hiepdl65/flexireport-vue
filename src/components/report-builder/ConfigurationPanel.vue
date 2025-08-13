<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Configuration</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Customize report settings</p>
    </div>
    
    <div class="p-4 space-y-6">
      <!-- Report Properties -->
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-3">Report Properties</h4>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Report Title
            </label>
            <input 
              v-model="reportConfig.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter report title"
            />
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea 
              v-model="reportConfig.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter report description"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Report Type
            </label>
            <select 
              v-model="reportConfig.type"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="dashboard">Dashboard</option>
              <option value="report">Report</option>
              <option value="chart">Chart</option>
              <option value="table">Table</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Display Settings -->
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-3">Display Settings</h4>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Theme
            </label>
            <select 
              v-model="reportConfig.theme"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color Scheme
            </label>
            <div class="grid grid-cols-5 gap-2">
              <div 
                v-for="color in colorSchemes" 
                :key="color.name"
                @click="reportConfig.colorScheme = color.value"
                class="w-8 h-8 rounded-lg border-2 cursor-pointer transition-all duration-200"
                :class="[
                  color.value,
                  reportConfig.colorScheme === color.value ? 'border-gray-900 dark:border-white scale-110' : 'border-gray-300 dark:border-gray-600'
                ]"
                :title="color.name"
              ></div>
            </div>
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Font Size
            </label>
            <select 
              v-model="reportConfig.fontSize"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Export Options -->
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-3">Export Options</h4>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-700 dark:text-gray-300">PDF Export</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="reportConfig.exportOptions.pdf"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-700 dark:text-gray-300">Excel Export</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="reportConfig.exportOptions.excel"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-700 dark:text-gray-300">CSV Export</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="reportConfig.exportOptions.csv"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex gap-2">
          <button 
            @click="resetConfig"
            class="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Reset
          </button>
          <button 
            @click="saveConfig"
            class="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const reportConfig = reactive({
  title: 'Sales Report',
  description: 'Monthly sales performance analysis',
  type: 'dashboard',
  theme: 'light',
  colorScheme: 'bg-blue-500',
  fontSize: 'medium',
  exportOptions: {
    pdf: true,
    excel: true,
    csv: false
  }
})

const colorSchemes = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Red', value: 'bg-red-500' }
]

const resetConfig = () => {
  Object.assign(reportConfig, {
    title: 'Sales Report',
    description: 'Monthly sales performance analysis',
    type: 'dashboard',
    theme: 'light',
    colorScheme: 'bg-blue-500',
    fontSize: 'medium',
    exportOptions: {
      pdf: true,
      excel: true,
      csv: false
    }
  })
}

const saveConfig = () => {
  console.log('Saving configuration:', reportConfig)
  // Save configuration logic here
}
</script>
