<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="$emit('close')"
      ></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Add New Data Source
              </h3>
              <div class="mt-4 space-y-4">
                <!-- Data Source Type Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Source Type *
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      v-for="type in dataSourceTypes"
                      :key="type.value"
                      @click="selectDataSourceType(type.value)"
                      :class="[
                        'p-3 border-2 rounded-lg text-left transition-all duration-200',
                        selectedType === type.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      ]"
                    >
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                          <span class="text-lg">{{ type.icon }}</span>
                        </div>
                        <div>
                          <div class="font-medium text-gray-900 dark:text-white text-sm">{{ type.name }}</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">{{ type.description }}</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Connection Details -->
                <div v-if="selectedType" class="space-y-4">
                  <!-- Basic Info -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data Source Name *
                    </label>
                    <input 
                      v-model="formData.name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter a descriptive name"
                    />
                  </div>

                  <!-- Database Connection Fields -->
                  <div v-if="isDatabaseType" class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Host *
                      </label>
                      <input 
                        v-model="formData.host"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="localhost"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Port *
                      </label>
                      <input 
                        v-model="formData.port"
                        type="number"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        :placeholder="getDefaultPort()"
                      />
                    </div>
                    <div class="col-span-2">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Database Name *
                      </label>
                      <input 
                        v-model="formData.database"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter database name"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Username *
                      </label>
                      <input 
                        v-model="formData.username"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Password *
                      </label>
                      <input 
                        v-model="formData.password"
                        type="password"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter password"
                      />
                    </div>
                  </div>

                  <!-- File Path for CSV/Excel -->
                  <div v-if="isFileType">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      File Path *
                    </label>
                    <input 
                      v-model="formData.file_path"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="/path/to/your/files"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Enter the directory path containing your data files
                    </p>
                  </div>

                  <!-- API Configuration -->
                  <div v-if="isApiType" class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        API URL *
                      </label>
                      <input 
                        v-model="formData.api_url"
                        type="url"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://api.example.com/data"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        API Key
                      </label>
                      <input 
                        v-model="formData.api_key"
                        type="password"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter API key if required"
                      />
                    </div>
                  </div>

                  <!-- Test Connection Button -->
                  <div class="pt-2">
                    <button
                      @click="testConnection"
                      :disabled="!canTestConnection || testing"
                      class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg v-if="testing" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      {{ testing ? 'Testing...' : 'Test Connection' }}
                    </button>
                  </div>

                  <!-- Connection Test Result -->
                  <div v-if="connectionResult" class="p-3 rounded-lg" :class="connectionResult.success ? 'bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700' : 'bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700'">
                    <div class="flex items-center gap-2">
                      <svg v-if="connectionResult.success" class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <svg v-else class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      <span class="text-sm font-medium" :class="connectionResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'">
                        {{ connectionResult.message }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            @click="handleSave"
            :disabled="!canSave || saving"
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
          >
            <svg v-if="saving" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ saving ? 'Saving...' : 'Save Data Source' }}
          </button>
          <button 
            @click="$emit('close')"
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { dataSourcesAPI } from '@/services/api'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'saved'])

const selectedType = ref('')
const testing = ref(false)
const saving = ref(false)
const connectionResult = ref(null)

const formData = ref({
  name: '',
  type: '',
  host: '',
  port: '',
  database: '',
  username: '',
  password: '',
  file_path: '',
  api_url: '',
  api_key: ''
})

const dataSourceTypes = [
  {
    value: 'mysql',
    name: 'MySQL',
    icon: '🐬',
    description: 'MySQL database connection'
  },
  {
    value: 'postgresql',
    name: 'PostgreSQL',
    icon: '🐘',
    description: 'PostgreSQL database connection'
  },
  {
    value: 'csv',
    name: 'CSV Files',
    icon: '📄',
    description: 'CSV file directory'
  },
  {
    value: 'excel',
    name: 'Excel Files',
    icon: '📊',
    description: 'Excel file directory'
  },
  {
    value: 'api',
    name: 'API',
    icon: '🔌',
    description: 'REST API endpoint'
  }
]

const isDatabaseType = computed(() => ['mysql', 'postgresql'].includes(selectedType.value))
const isFileType = computed(() => ['csv', 'excel'].includes(selectedType.value))
const isApiType = computed(() => selectedType.value === 'api')

const canTestConnection = computed(() => {
  if (!selectedType.value || !formData.value.name) return false
  
  if (isDatabaseType.value) {
    return formData.value.host && formData.value.port && formData.value.database && formData.value.username && formData.value.password
  }
  
  if (isFileType.value) {
    return formData.value.file_path
  }
  
  if (isApiType.value) {
    return formData.value.api_url
  }
  
  return false
})

const canSave = computed(() => {
  if (!selectedType.value || !formData.value.name) return false
  
  if (isDatabaseType.value) {
    return formData.value.host && formData.value.port && formData.value.database && formData.value.username && formData.value.password
  }
  
  if (isFileType.value) {
    return formData.value.file_path
  }
  
  if (isApiType.value) {
    return formData.value.api_url
  }
  
  return false
})

const selectDataSourceType = (type) => {
  selectedType.value = type
  formData.value.type = type
  connectionResult.value = null
  
  // Set default port for database types
  if (isDatabaseType.value) {
    formData.value.port = getDefaultPort()
  }
}

const getDefaultPort = () => {
  switch (selectedType.value) {
    case 'mysql': return '3306'
    case 'postgresql': return '5432'
    default: return ''
  }
}

const testConnection = async () => {
  try {
    testing.value = true
    connectionResult.value = null
    
    const testData = {
      name: formData.value.name,
      type: formData.value.type,
      host: formData.value.host,
      port: parseInt(formData.value.port),
      database: formData.value.database,
      username: formData.value.username,
      password: formData.value.password,
      file_path: formData.value.file_path,
      api_url: formData.value.api_url,
      api_key: formData.value.api_key
    }
    
    const result = await dataSourcesAPI.testConnection(testData)
    connectionResult.value = result
    
  } catch (error) {
    console.error('Connection test failed:', error)
    connectionResult.value = {
      success: false,
      message: error.response?.data?.detail || 'Connection test failed'
    }
  } finally {
    testing.value = false
  }
}

const handleSave = async () => {
  try {
    saving.value = true
    
    const saveData = {
      name: formData.value.name,
      type: formData.value.type,
      host: formData.value.host,
      port: parseInt(formData.value.port),
      database: formData.value.database,
      username: formData.value.username,
      password: formData.value.password,
      file_path: formData.value.file_path,
      api_url: formData.value.api_url,
      api_key: formData.value.api_key
    }
    
    // Save data source using API
    const savedDataSource = await dataSourcesAPI.createDataSource(saveData)
    console.log('Data source saved successfully:', savedDataSource)
    
    // Emit the saved data source
    emit('saved', savedDataSource)
    
    // Close modal
    emit('close')
    
  } catch (error) {
    console.error('Failed to save data source:', error)
    
    // Show error notification
    if (error.response?.data?.detail) {
      alert(`Failed to save data source: ${error.response.data.detail}`)
    } else {
      alert('Failed to save data source. Please try again.')
    }
  } finally {
    saving.value = false
  }
}

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    selectedType.value = ''
    connectionResult.value = null
    formData.value = {
      name: '',
      type: '',
      host: '',
      port: '',
      database: '',
      username: '',
      password: '',
      file_path: '',
      api_url: '',
      api_key: ''
    }
  }
})
</script>
