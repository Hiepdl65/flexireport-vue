<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Report Canvas</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ reportStore.selectedTables.length > 0 ? getStatusText() : 'Drag and drop elements to build your report' }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="previewReport"
            :disabled="!reportStore.hasValidQuery || isLoading"
            class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-1"
          >
            <svg 
              v-if="isLoading" 
              class="animate-spin w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <svg 
              v-else
              class="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            {{ isLoading ? 'Running...' : 'Preview' }}
          </button>
          
          <button 
            @click="clearCanvas"
            :disabled="reportStore.selectedTables.length === 0"
            class="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Clear
          </button>
          
          <button 
            @click="exportReport"
            :disabled="!previewData || isLoading"
            class="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export
          </button>
        </div>
      </div>
    </div>
    
    <div class="p-4 h-[calc(100%-80px)] overflow-auto">
      <!-- Drop Zone -->
      <div 
        ref="dropZone"
        class="min-h-[600px] border-2 border-dashed rounded-lg p-6 transition-all duration-300"
        :class="[
          isDragOver ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700',
          reportStore.selectedTables.length > 0 ? 'bg-white dark:bg-gray-800' : ''
        ]"
        @drop="handleDrop"
        @dragover.prevent="handleDragOver"
        @dragenter.prevent="handleDragEnter"
        @dragleave="handleDragLeave"
      >
        <!-- Empty State -->
        <div v-if="reportStore.selectedTables.length === 0" class="text-center py-16">
          <div class="relative">
            <!-- Animated Drop Icon -->
            <svg 
              class="w-16 h-16 text-gray-400 mx-auto mb-4 transition-all duration-300"
              :class="isDragOver ? 'text-primary-500 scale-110' : ''"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            
            <!-- Drop indicator -->
            <div 
              v-if="isDragOver"
              class="absolute inset-0 flex items-center justify-center"
            >
              <div class="w-20 h-20 border-4 border-primary-500 border-dashed rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ isDragOver ? 'Drop here to add table' : 'Start Building Your Report' }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {{ isDragOver ? 'Release to add the table to your report' : 'Drag tables from the left panel to start building your report' }}
          </p>
          
          <div v-if="!isDragOver" class="flex items-center justify-center gap-4 text-sm text-gray-400">
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
        
        <!-- Selected Tables -->
        <div v-else class="space-y-4">
          <!-- Tables Summary -->
          <div class="flex flex-wrap gap-2 mb-4">
            <div 
              v-for="table in reportStore.selectedTables" 
              :key="`${table.dataSourceId}-${table.id}`"
              class="flex items-center gap-2 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-2 rounded-lg"
            >
              <span class="text-lg">{{ getTableIcon(table.id) }}</span>
              <span class="font-medium text-sm">{{ table.name }}</span>
              <span class="text-xs opacity-70">({{ table.alias }})</span>
              <button 
                @click="removeTable(table.id, table.dataSourceId)"
                class="p-1 hover:bg-primary-200 dark:hover:bg-primary-800 rounded"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Data Sources Info -->
          <div v-if="reportStore.selectedDataSources.length > 0" class="mb-4">
            <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-2">Connected Data Sources:</h4>
            <div class="flex flex-wrap gap-2">
              <div 
                v-for="ds in reportStore.selectedDataSources" 
                :key="ds.id"
                class="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                </svg>
                {{ ds.name }} ({{ ds.type }})
              </div>
            </div>
          </div>
          
          <!-- SQL Preview Section -->
          <div v-if="reportStore.generatedSQL" class="mt-6">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-900 dark:text-white">Generated SQL Query</h4>
              <div class="flex gap-2">
                <button 
                  @click="formatSQL"
                  class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors duration-200"
                >
                  Format
                </button>
                <button 
                  @click="copySQL"
                  class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors duration-200"
                >
                  Copy
                </button>
              </div>
            </div>
            <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto max-h-48">
              <pre>{{ reportStore.generatedSQL }}</pre>
            </div>
          </div>
          
          <!-- Query Execution Info -->
          <div v-if="queryExecutionInfo" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span class="text-blue-800 dark:text-blue-200">
                  Query executed in {{ queryExecutionInfo.executionTime }}ms
                </span>
              </div>
              <span class="text-blue-600 dark:text-blue-400 font-medium">
                {{ queryExecutionInfo.rowCount }} rows
              </span>
            </div>
          </div>
          
          <!-- Data Preview Section -->
          <div v-if="previewData && previewData.data" class="mt-6">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-900 dark:text-white">
                Data Preview ({{ previewData.rowCount || previewData.data.length }} rows)
              </h4>
              <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Showing {{ Math.min(10, previewData.data.length) }} of {{ previewData.rowCount || previewData.data.length }}</span>
              </div>
            </div>
            
            <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <table class="w-full text-sm bg-white dark:bg-gray-800">
                <thead>
                  <tr class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th 
                      v-for="(column, index) in previewData.columns" 
                      :key="index"
                      class="px-4 py-3 text-left font-medium text-gray-900 dark:text-white"
                    >
                      {{ column }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(row, rowIndex) in previewData.data.slice(0, 10)" 
                    :key="rowIndex"
                    class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td 
                      v-for="(value, colIndex) in row" 
                      :key="colIndex"
                      class="px-4 py-3 text-gray-900 dark:text-white"
                    >
                      {{ formatCellValue(value) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination Info -->
            <div v-if="previewData.data.length > 10" class="mt-2 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Showing first 10 rows. Use the full report to see all {{ previewData.rowCount || previewData.data.length }} rows.
              </p>
            </div>
          </div>
          
          <!-- Error Display -->
          <div v-if="queryError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="font-medium text-red-800 dark:text-red-200">Query Execution Error</span>
            </div>
            <p class="text-red-700 dark:text-red-300 text-sm">{{ queryError }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useReportBuilderStore } from '@/stores/ReportBuilder'
import { reportsAPI } from '@/services/api'

const reportStore = useReportBuilderStore()
const dropZone = ref(null)
const isDragOver = ref(false)
const isLoading = ref(false)
const previewData = ref(null)
const queryExecutionInfo = ref(null)
const queryError = ref(null)

const getStatusText = () => {
  const tableCount = reportStore.selectedTables.length
  const columnCount = reportStore.selectedColumns.length
  const filterCount = reportStore.filters.length
  
  let parts = []
  if (tableCount > 0) parts.push(`${tableCount} table${tableCount > 1 ? 's' : ''}`)
  if (columnCount > 0) parts.push(`${columnCount} column${columnCount > 1 ? 's' : ''}`)
  if (filterCount > 0) parts.push(`${filterCount} filter${filterCount > 1 ? 's' : ''}`)
  
  return parts.length > 0 ? parts.join(', ') : 'No configuration yet'
}

const getTableIcon = (tableId) => {
  const icons = {
    'orders': '📋',
    'customers': '👥',
    'products': '📦',
    'categories': '🏷️',
    'order_items': '📝',
    'payments': '💳',
    'inventory': '📊',
    'suppliers': '🏭',
    'default': '📊'
  }
  return icons[tableId] || icons.default
}

const handleDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
}

const handleDragEnter = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  // Only set to false if we're actually leaving the drop zone
  if (!dropZone.value?.contains(event.relatedTarget)) {
    isDragOver.value = false
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  try {
    const dragDataStr = event.dataTransfer.getData('text/plain')
    const dragData = JSON.parse(dragDataStr)
    
    if (dragData.type === 'table') {
      const table = dragData.table
      console.log('Dropped table:', table.name)
      
      // Add table to report store using the enhanced addTable method
      const success = reportStore.addTable(table)
      
      if (success) {
        // Generate SQL after adding table
        nextTick(() => {
          reportStore.generateSQL()
        })
        
        // Show success feedback
        showSuccessMessage(`Added ${table.name} to report`)
        
        // Clear any previous errors
        queryError.value = null
      } else {
        showErrorMessage(`Table ${table.name} is already added`)
      }
    }
  } catch (error) {
    console.error('Error handling drop:', error)
    showErrorMessage('Failed to add table to report')
  }
}

const removeTable = (tableId, dataSourceId) => {
  const success = reportStore.removeTable(tableId, dataSourceId)
  
  if (success) {
    // Clear preview data if no tables left
    if (reportStore.selectedTables.length === 0) {
      previewData.value = null
      queryExecutionInfo.value = null
      queryError.value = null
    }
    
    nextTick(() => {
      reportStore.generateSQL()
    })
    
    showSuccessMessage('Table removed from report')
  }
}

const previewReport = async () => {
  if (!reportStore.hasValidQuery) {
    showErrorMessage('Please select at least one table and column before previewing')
    return
  }
  
  isLoading.value = true
  queryError.value = null
  queryExecutionInfo.value = null
  
  try {
    // Generate SQL first
    const sql = reportStore.generateSQL()
    if (!sql) {
      throw new Error('Failed to generate SQL query')
    }
    
    console.log('Executing query:', sql)
    
    // Use the first selected data source for execution
    const dataSourceId = reportStore.selectedTables[0]?.dataSourceId
    if (!dataSourceId) {
      throw new Error('No data source selected')
    }
    
    // Execute query using API
    const result = await reportsAPI.executeQuery(dataSourceId, sql, reportStore.limit)
    
    // Set preview data
    previewData.value = result
    queryExecutionInfo.value = {
      executionTime: result.executionTime || 0,
      rowCount: result.rowCount || result.data?.length || 0
    }
    
    console.log('✅ Query executed successfully:', result)
    showSuccessMessage(`Query executed successfully! Retrieved ${result.rowCount || result.data?.length || 0} rows`)
    
  } catch (error) {
    console.error('❌ Query execution failed:', error)
    queryError.value = error.response?.data?.detail || error.message || 'Failed to execute query'
    previewData.value = null
    queryExecutionInfo.value = null
    
    showErrorMessage(`Query failed: ${queryError.value}`)
  } finally {
    isLoading.value = false
  }
}

const clearCanvas = () => {
  if (confirm('Are you sure you want to clear the canvas? This will remove all tables, columns, and filters.')) {
    reportStore.reset()
    previewData.value = null
    queryExecutionInfo.value = null
    queryError.value = null
    showSuccessMessage('Canvas cleared')
  }
}

const exportReport = () => {
  if (!previewData.value) {
    showErrorMessage('No data to export. Please run a preview first.')
    return
  }
  
  // Convert data to CSV format
  try {
    const csvContent = convertToCSV(previewData.value)
    downloadCSV(csvContent, 'report_export.csv')
    showSuccessMessage('Report exported successfully')
  } catch (error) {
    console.error('Export failed:', error)
    showErrorMessage('Failed to export report')
  }
}

const convertToCSV = (data) => {
  if (!data.columns || !data.data) {
    throw new Error('Invalid data format for CSV export')
  }
  
  // Create CSV header
  const header = data.columns.join(',')
  
  // Create CSV rows
  const rows = data.data.map(row => 
    row.map(cell => {
      // Escape commas and quotes
      const value = String(cell || '')
      return value.includes(',') || value.includes('"') ? `"${value.replace(/"/g, '""')}"` : value
    }).join(',')
  )
  
  return [header, ...rows].join('\n')
}

const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const formatCellValue = (value) => {
  if (value === null || value === undefined) {
    return '-'
  }
  
  if (typeof value === 'number') {
    // Format large numbers with commas
    if (Math.abs(value) >= 1000) {
      return value.toLocaleString()
    }
  }
  
  if (typeof value === 'string' && value.length > 50) {
    return value.substring(0, 47) + '...'
  }
  
  return String(value)
}

const copySQL = async () => {
  try {
    await navigator.clipboard.writeText(reportStore.generatedSQL)
    showSuccessMessage('SQL copied to clipboard')
  } catch (error) {
    console.error('Failed to copy SQL:', error)
    showErrorMessage('Failed to copy SQL')
  }
}

const formatSQL = () => {
  // Simple SQL formatting - you could use a proper SQL formatter library
  const formatted = reportStore.generatedSQL
    .replace(/SELECT/gi, 'SELECT')
    .replace(/FROM/gi, '\nFROM')
    .replace(/WHERE/gi, '\nWHERE')
    .replace(/ORDER BY/gi, '\nORDER BY')
    .replace(/LIMIT/gi, '\nLIMIT')
    .replace(/LEFT JOIN/gi, '\nLEFT JOIN')
    .replace(/INNER JOIN/gi, '\nINNER JOIN')
    .replace(/RIGHT JOIN/gi, '\nRIGHT JOIN')
  
  reportStore.generatedSQL = formatted
  showSuccessMessage('SQL formatted')
}

const showSuccessMessage = (message) => {
  console.log('✅', message)
  // You can implement a proper toast notification system here
}

const showErrorMessage = (message) => {
  console.error('❌', message)
  // You can implement a proper toast notification system here
}
</script>

<style scoped>
.drop-zone-active {
  transform: scale(1.02);
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>