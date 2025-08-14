<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Data Sources</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect to databases to build reports</p>
        </div>
        
        <!-- Connection Status -->
        <div v-if="connectionStatus.total > 0" class="flex items-center gap-2 text-xs">
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-600 dark:text-gray-400">{{ connectionStatus.connected }} connected</span>
          </div>
          <div v-if="connectionStatus.failed > 0" class="flex items-center gap-1">
            <div class="w-2 h-2 bg-red-500 rounded-full"></div>
            <span class="text-gray-600 dark:text-gray-400">{{ connectionStatus.failed }} failed</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="p-4">
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
      
      <!-- Loading State for Initial Load -->
      <div v-if="loading && dataSources.length === 0" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
        <p class="text-sm text-gray-600 dark:text-gray-400">Connecting to server...</p>
      </div>
      
      <!-- Server Connection Error -->
      <div v-else-if="error && dataSources.length === 0" class="text-center py-8">
        <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Cannot Connect to Server</h4>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ error }}</p>
        <button 
          @click="retryConnection"
          :disabled="loading"
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
        >
          {{ loading ? 'Retrying...' : 'Retry Connection' }}
        </button>
      </div>
      
      <!-- Connected Data Sources -->
      <div v-else-if="dataSources.length > 0">
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-medium text-gray-900 dark:text-white text-sm">Connected Sources</h4>
          <button 
            @click="refreshAllTables"
            :disabled="loading || isLoadingAnyTables()"
            class="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <svg 
              class="w-3 h-3"
              :class="{ 'animate-spin': loading || isLoadingAnyTables() }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh All
          </button>
        </div>
        
        <div class="space-y-2 mb-6">
          <div 
            v-for="source in dataSources" 
            :key="source.id"
            class="p-3 rounded-lg border transition-all duration-200"
            :class="[
              source.status === 'connected' 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div 
                  class="w-8 h-8 rounded-lg flex items-center justify-center"
                  :class="[
                    source.status === 'connected'
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'bg-red-100 dark:bg-red-900'
                  ]"
                >
                  <svg 
                    class="w-4 h-4"
                    :class="[
                      source.status === 'connected'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-red-600 dark:text-red-400'
                    ]"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white text-sm">{{ source.name }}</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ source.type }} • {{ getTablesCountText(source.id) }}</p>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <span 
                  :class="[
                    'px-2 py-1 text-xs rounded-full',
                    source.status === 'connected' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  ]"
                >
                  {{ source.status }}
                </span>
                
                <!-- Refresh Tables Button -->
                <button 
                  @click="refreshDataSourceTables(source.id)"
                  :disabled="loadingTables[source.id]"
                  class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors disabled:opacity-50"
                  :title="`Refresh tables for ${source.name}`"
                >
                  <svg 
                    class="w-4 h-4"
                    :class="loadingTables[source.id] ? 'animate-spin' : ''"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Available Tables Section -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-gray-900 dark:text-white text-sm">Available Tables</h4>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ availableTables.length }} tables
              </span>
              
              <!-- Tables Loading Indicator -->
              <div v-if="isLoadingAnyTables()" class="flex items-center gap-1">
                <div class="w-3 h-3 border border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <span class="text-xs text-primary-600 dark:text-primary-400">Loading...</span>
              </div>
            </div>
          </div>
          
          <!-- Tables List -->
          <div v-if="availableTables.length > 0" class="space-y-3 max-h-96 overflow-y-auto">
            <div 
              v-for="table in availableTables" 
              :key="`${table.dataSourceId}-${table.id}`"
              class="draggable-table p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-grab hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
              :class="{ 
                'opacity-50': reportStore.isTableSelected(table.id, table.dataSourceId),
                'border-green-300 dark:border-green-600': reportStore.isTableSelected(table.id, table.dataSourceId)
              }"
              :draggable="!reportStore.isTableSelected(table.id, table.dataSourceId)"
              @dragstart="handleDragStart($event, table)"
              @dragend="handleDragEnd"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <span class="text-lg">{{ getTableIcon(table.table_type) }}</span>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-medium text-gray-900 dark:text-white text-sm">{{ table.name }}</h4>
                      <span v-if="reportStore.isTableSelected(table.id, table.dataSourceId)" class="px-1 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                        Added
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ table.columns.length }} columns
                      <span v-if="table.row_count"> • {{ formatRowCount(table.row_count) }} rows</span>
                      • {{ getDataSourceName(table.dataSourceId) }}
                    </p>
                  </div>
                </div>
                
                <div class="flex items-center gap-2">
                  <!-- Table Type Badge -->
                  <span 
                    v-if="table.table_type && table.table_type !== 'table'"
                    class="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full"
                  >
                    {{ table.table_type }}
                  </span>
                  
                  <!-- Drag Handle or Selected Indicator -->
                  <svg 
                    v-if="!reportStore.isTableSelected(table.id, table.dataSourceId)"
                    class="w-4 h-4 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                  </svg>
                  
                  <svg 
                    v-else
                    class="w-4 h-4 text-green-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Column preview -->
              <div v-if="table.columns.length > 0" class="mt-2 flex flex-wrap gap-1">
                <span 
                  v-for="column in table.columns.slice(0, 4)" 
                  :key="column.name"
                  class="px-2 py-1 text-xs rounded-full"
                  :class="[
                    column.primaryKey 
                      ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  ]"
                >
                  {{ column.name }}
                  <span v-if="column.primaryKey" class="ml-1 font-bold">🔑</span>
                </span>
                <span 
                  v-if="table.columns.length > 4"
                  class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full"
                >
                  +{{ table.columns.length - 4 }} more
                </span>
              </div>
            </div>
          </div>
          
          <!-- No Tables State -->
          <div v-else-if="!isLoadingAnyTables()" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <p class="text-gray-500 dark:text-gray-400 text-sm">No tables available</p>
            <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Configure your data sources to see available tables
            </p>
          </div>
          
          <!-- Loading Tables State -->
          <div v-else class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Loading tables...</p>
          </div>
        </div>
      </div>
      
      <!-- No Data Sources State -->
      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
        </svg>
        <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Data Sources Connected</h4>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Connect to your databases to start building reports
        </p>
        <button 
          @click="showAddModal = true"
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
        >
          Add First Data Source
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useReportBuilderStore } from '@/stores/ReportBuilder'
import { useDataSources } from '@/composables/useDataSources'
import AddDataSourceModal from '@/components/report-builder/AddDataSourceModal.vue'

const reportStore = useReportBuilderStore()
const showAddModal = ref(false)

// Use the data sources composable
const {
  loading,
  error,
  dataSources,
  availableTables,
  loadingTables,
  connectionStatus,
  loadDataSources,
  createDataSource,
  refreshDataSourceTables,
  refreshAllTables,
  getDataSourceById,
  isLoadingAnyTables
} = useDataSources()

const getTableIcon = (tableType) => {
  const icons = {
    'table': '📋',
    'view': '👁️',
    'orders': '📋',
    'customers': '👥',
    'products': '📦',
    'categories': '🏷️',
    'sales': '💰',
    'inventory': '📊',
    'users': '👤',
    'payments': '💳',
    'order_items': '📝',
    'suppliers': '🏭',
    'default': '📊'
  }
  return icons[tableType?.toLowerCase()] || icons.default
}

const getDataSourceName = (dataSourceId) => {
  const source = getDataSourceById(dataSourceId)
  return source ? source.name : 'Unknown'
}

const getTablesCountText = (dataSourceId) => {
  const tables = availableTables.value.filter(t => t.dataSourceId === dataSourceId)
  const count = tables.length
  return count === 0 ? 'No tables' : `${count} table${count > 1 ? 's' : ''}`
}

const formatRowCount = (count) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

const handleDragStart = (event, table) => {
  const dragData = {
    type: 'table',
    table: {
      id: table.id,
      name: table.name,
      dataSourceId: table.dataSourceId,
      columns: table.columns,
      table_type: table.table_type,
      row_count: table.row_count
    }
  }
  
  event.dataTransfer.setData('text/plain', JSON.stringify(dragData))
  event.dataTransfer.effectAllowed = 'copy'
  event.target.style.opacity = '0.5'
  
  console.log('🎯 Drag started for table:', table.name)
}

const handleDragEnd = (event) => {
  event.target.style.opacity = '1'
  console.log('🎯 Drag ended')
}

const handleDataSourceSaved = async (dataSourceData) => {
  try {
    console.log('💾 New data source saved:', dataSourceData)
    await createDataSource(dataSourceData)
    showNotification('Data source added successfully!', 'success')
  } catch (error) {
    console.error('❌ Failed to add data source:', error)
    showNotification('Failed to add data source. Please try again.', 'error')
  }
}

const retryConnection = async () => {
  try {
    await loadDataSources()
  } catch (error) {
    // Error is already handled in loadDataSources
    console.log('Retry failed, check server status')
  }
}

const showNotification = (message, type = 'info') => {
  console.log(`${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${message}`)
}
</script>

<style scoped>
.draggable-table {
  user-select: none;
}

.draggable-table:active {
  cursor: grabbing;
}

.draggable-table:hover:not(.opacity-50) {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  border-color: #3b82f6;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
  background: #374151;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>