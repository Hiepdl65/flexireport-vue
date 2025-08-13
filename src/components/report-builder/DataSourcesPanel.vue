<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Data Sources</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Available data connections</p>
    </div>
    
    <div class="p-4">
      <!-- Loading State -->
      <LoadingSpinner :loading="loading" message="Loading data sources..." />
      
      <!-- Error State -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
        <p class="text-red-800 dark:text-red-200 text-sm">{{ error }}</p>
      </div>
      
      <!-- Add New Data Source Button -->
      <button 
        @click="showAddModal = true"
        class="w-full mb-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Data Source
      </button>
      
      <!-- Add Data Source Modal -->
      <AddDataSourceModal
        :show="showAddModal"
        @close="showAddModal = false"
        @saved="handleDataSourceSaved"
      />
      
      <!-- Data Sources List -->
      <div class="space-y-3">
        <div 
          v-for="source in dataSources" 
          :key="source.id"
          class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          @click="selectDataSource(source)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white text-sm">{{ source.name }}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ source.type }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span 
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  source.status === 'connected' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                ]"
              >
                {{ source.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="dataSources.length === 0" class="text-center py-8">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
        </svg>
        <p class="text-gray-500 dark:text-gray-400 text-sm">No data sources configured</p>
        <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">Add your first data source to get started</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { dataSourcesAPI } from '@/services/api'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import AddDataSourceModal from '@/components/report-builder/AddDataSourceModal.vue'

const showAddModal = ref(false)
const dataSources = ref([])
const loading = ref(false)
const error = ref(null)

const selectDataSource = (source) => {
  // Emit event or handle data source selection
  console.log('Selected data source:', source)
}

const loadDataSources = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Load data sources from API
    const response = await dataSourcesAPI.getDataSources()
    dataSources.value = response
    
  } catch (err) {
    console.error('Failed to load data sources:', err)
    error.value = 'Failed to load data sources'
    
    // Fallback to mock data if API fails
    dataSources.value = [
      {
        id: 1,
        name: 'MySQL Database',
        type: 'MySQL',
        status: 'connected',
        connectionString: 'mysql://localhost:3306/reports'
      },
      {
        id: 2,
        name: 'PostgreSQL DB',
        type: 'PostgreSQL',
        status: 'connected',
        connectionString: 'postgresql://localhost:5432/analytics'
      },
      {
        id: 3,
        name: 'CSV Files',
        type: 'File System',
        status: 'disconnected',
        connectionString: '/data/csv/'
      }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDataSources()
})

const handleDataSourceSaved = async (dataSourceData) => {
  try {
    console.log('New data source saved:', dataSourceData)
    
    // Add the saved data source to the local list
    const newDataSource = {
      id: dataSourceData.id,
      name: dataSourceData.name,
      type: dataSourceData.type,
      status: dataSourceData.status,
      connectionString: getConnectionString(dataSourceData)
    }
    
    dataSources.value.unshift(newDataSource)
    
    // Show success notification
    alert('Data source added successfully!')
    
  } catch (error) {
    console.error('Failed to add data source:', error)
    alert('Failed to add data source. Please try again.')
  }
}

const getConnectionString = (dataSource) => {
  switch (dataSource.type) {
    case 'mysql':
      return `mysql://${dataSource.username}@${dataSource.host}:${dataSource.port}/${dataSource.database}`
    case 'postgresql':
      return `postgresql://${dataSource.username}@${dataSource.host}:${dataSource.port}/${dataSource.database}`
    case 'csv':
    case 'excel':
      return dataSource.file_path
    case 'api':
      return dataSource.api_url
    default:
      return 'Unknown connection type'
  }
}
</script>
