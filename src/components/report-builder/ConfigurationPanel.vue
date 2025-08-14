<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-full">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Configuration</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Customize your report settings</p>
    </div>
    
    <div class="p-4 space-y-6 overflow-y-auto h-[calc(100%-80px)]">
      <!-- Query Status -->
      <div v-if="reportStore.selectedTables.length > 0" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
        <div class="flex items-center gap-2 text-sm">
          <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-blue-800 dark:text-blue-200">
            {{ reportStore.hasValidQuery ? 'Query ready to execute' : 'Add columns to complete query' }}
          </span>
        </div>
      </div>

      <!-- Table Columns Section -->
      <div v-if="reportStore.selectedTables.length > 0">
        <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
          </svg>
          Select Columns
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">
            ({{ reportStore.selectedColumns.length }} selected)
          </span>
        </h4>
        
        <div class="space-y-4">
          <div v-for="table in reportStore.selectedTables" :key="`${table.dataSourceId}-${table.id}`">
            <div class="flex items-center justify-between mb-2">
              <h5 class="text-sm font-medium text-primary-600 dark:text-primary-400 flex items-center gap-2">
                <span class="text-lg">{{ getTableIcon(table.id) }}</span>
                {{ table.name }}
                <span class="text-xs text-gray-500 dark:text-gray-400">({{ table.alias }})</span>
              </h5>
              <div class="flex items-center gap-2">
                <button 
                  @click="selectAllColumns(table)"
                  class="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Select All
                </button>
                <button 
                  @click="deselectAllColumns(table)"
                  class="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div class="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
              <div v-if="getTableColumns(table).length === 0" class="text-center py-4">
                <span class="text-sm text-gray-500 dark:text-gray-400">Loading columns...</span>
              </div>
              
              <label 
                v-for="column in getTableColumns(table)" 
                :key="`${table.dataSourceId}-${table.id}.${column.name}`"
                class="flex items-center gap-2 p-2 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors cursor-pointer group"
              >
                <input 
                  type="checkbox"
                  :checked="isColumnSelected(table, column.name)"
                  @change="toggleColumn(table, column)"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-900 dark:text-white font-medium">{{ column.name }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-1 rounded">{{ column.type }}</span>
                    <div v-if="column.primaryKey" class="px-1 py-0.5 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">PK</div>
                  </div>
                  <div v-if="column.nullable === false" class="text-xs text-gray-500 dark:text-gray-400">NOT NULL</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Selected Columns Summary -->
      <div v-if="reportStore.selectedColumns.length > 0">
        <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          Selected Columns ({{ reportStore.selectedColumns.length }})
        </h4>
        
        <div class="space-y-1 max-h-32 overflow-y-auto">
          <div 
            v-for="column in reportStore.selectedColumns" 
            :key="`${column.dataSourceId}-${column.tableId}.${column.columnName}`"
            class="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700"
          >
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <span class="text-sm text-blue-800 dark:text-blue-200 font-medium">{{ column.displayName }}</span>
              <span class="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800 px-1 rounded">{{ column.columnType }}</span>
            </div>
            <button 
              @click="removeColumn(column)"
              class="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded flex-shrink-0"
              :title="`Remove ${column.displayName}`"
            >
              <svg class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Joins Section -->
      <div v-if="reportStore.selectedTables.length > 1">
        <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
          Table Joins
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">
            ({{ reportStore.joins.length }} detected)
          </span>
        </h4>
        
        <div v-if="reportStore.joins.length > 0" class="space-y-2">
          <div 
            v-for="join in reportStore.joins" 
            :key="join.id"
            class="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm">
                <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                <span class="text-green-800 dark:text-green-200 font-medium">{{ join.joinType }} JOIN</span>
              </div>
              <button 
                @click="removeJoin(join.id)"
                class="p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded"
                title="Remove join"
              >
                <svg class="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div class="mt-1 text-xs text-green-700 dark:text-green-300 font-mono">
              {{ join.condition }}
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          No joins detected. Joins will be auto-detected based on common patterns.
        </div>
      </div>
      
      <!-- Filters Section -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-medium text-gray-900 dark:text-white text-sm flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            Filters
            <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({{ reportStore.filters.length }})
            </span>
          </h4>
          <button 
            @click="addFilter"
            :disabled="reportStore.availableColumns.length === 0"
            class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded transition-colors duration-200 flex items-center gap-1"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add
          </button>
        </div>
        
        <div v-if="reportStore.filters.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          No filters applied
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="filter in reportStore.filters" 
            :key="filter.id"
            class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div class="space-y-2">
              <!-- Table and Column Selection -->
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Table</label>
                  <select 
                    v-model="filter.tableId"
                    @change="updateFilterTable(filter)"
                    class="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full"
                  >
                    <option value="">Select table...</option>
                    <option 
                      v-for="table in reportStore.selectedTables" 
                      :key="`${table.dataSourceId}-${table.id}`"
                      :value="table.id"
                    >
                      {{ table.name }} ({{ table.alias }})
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Column</label>
                  <select 
                    v-model="filter.column"
                    @change="updateFilter(filter)"
                    class="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full"
                    :disabled="!filter.tableId"
                  >
                    <option value="">Select column...</option>
                    <option 
                      v-for="column in getFilterColumns(filter.tableId, filter.dataSourceId)" 
                      :key="column.columnName"
                      :value="column.columnName"
                    >
                      {{ column.columnName }} ({{ column.columnType }})
                    </option>
                  </select>
                </div>
              </div>
              
              <!-- Operator and Value -->
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Operator</label>
                  <select 
                    v-model="filter.operator"
                    @change="updateFilter(filter)"
                    class="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full"
                  >
                    <option value="=">=</option>
                    <option value="!=">!=</option>
                    <option value=">">></option>
                    <option value="<"><</option>
                    <option value=">=">>=</option>
                    <option value="<="><=</option>
                    <option value="LIKE">Contains</option>
                    <option value="NOT LIKE">Does not contain</option>
                    <option value="IS NULL">Is empty</option>
                    <option value="IS NOT NULL">Is not empty</option>
                    <option value="IN">In list</option>
                    <option value="NOT IN">Not in list</option>
                  </select>
                </div>
                
                <div class="col-span-2">
                  <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Value</label>
                  <input 
                    v-if="filter.operator !== 'IS NULL' && filter.operator !== 'IS NOT NULL'"
                    v-model="filter.value"
                    @input="updateFilter(filter)"
                    :type="getInputType(filter.dataType)"
                    :placeholder="getPlaceholder(filter.dataType, filter.operator)"
                    class="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full"
                  />
                  <span v-else class="text-xs text-gray-500 dark:text-gray-400 italic">No value needed</span>
                </div>
              </div>
              
              <!-- Remove Filter Button -->
              <div class="flex justify-end">
                <button 
                  @click="reportStore.removeFilter(filter.id)"
                  class="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded transition-colors duration-200 flex items-center gap-1"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sorting Section -->
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
          </svg>
          Sorting
        </h4>
        
        <div class="space-y-2">
          <div>
            <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Sort By</label>
            <select 
              v-model="sortColumn"
              @change="updateSorting"
              class="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">No sorting</option>
              <option 
                v-for="column in reportStore.availableColumns" 
                :key="column.fullName"
                :value="column.fullName"
              >
                {{ column.displayName }} ({{ column.columnType }})
              </option>
            </select>
          </div>
          
          <div v-if="sortColumn">
            <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Direction</label>
            <select 
              v-model="sortDirection"
              @change="updateSorting"
              class="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="ASC">Ascending (A-Z, 1-9)</option>
              <option value="DESC">Descending (Z-A, 9-1)</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Limit Section -->
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Results Limit
        </h4>
        
        <select 
          v-model="reportStore.limit"
          @change="updateLimit"
          class="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option :value="10">10 rows</option>
          <option :value="25">25 rows</option>
          <option :value="50">50 rows</option>
          <option :value="100">100 rows</option>
          <option :value="500">500 rows</option>
          <option :value="1000">1000 rows</option>
          <option :value="null">No limit</option>
        </select>
      </div>
      
      <!-- Actions Section -->
      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="space-y-2">
          <button 
            @click="generateQuery"
            :disabled="!reportStore.hasValidQuery"
            class="w-full px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Generate Query
          </button>
          
          <button 
            @click="resetConfiguration"
            :disabled="reportStore.selectedTables.length === 0"
            class="w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Reset All
          </button>
        </div>
      </div>
      
      <!-- No Tables State -->
      <div v-if="reportStore.selectedTables.length === 0" class="text-center py-8">
        <svg class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <p class="text-gray-500 dark:text-gray-400 text-sm">No tables selected</p>
        <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">Add tables from the left panel to configure your report</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { useReportBuilderStore } from '@/stores/ReportBuilder'

const reportStore = useReportBuilderStore()
const sortColumn = ref('')
const sortDirection = ref('ASC')

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

const getTableColumns = (table) => {
  const metadata = reportStore.getTableMetadata(table.dataSourceId, table.id)
  return metadata?.columns || []
}

const isColumnSelected = (table, columnName) => {
  return reportStore.selectedColumns.some(col => 
    col.tableId === table.id && 
    col.dataSourceId === table.dataSourceId && 
    col.columnName === columnName
  )
}

const toggleColumn = (table, column) => {
  const columnData = {
    tableId: table.id,
    tableName: table.name,
    tableAlias: table.alias,
    dataSourceId: table.dataSourceId,
    columnName: column.name,
    columnType: column.type,
    primaryKey: column.primaryKey || false,
    nullable: column.nullable !== false,
    fullName: `${table.alias}.${column.name}`,
    displayName: `${table.name}.${column.name}`
  }
  
  reportStore.toggleColumn(columnData)
  
  // Regenerate SQL after column change
  nextTick(() => {
    reportStore.generateSQL()
  })
}

const selectAllColumns = (table) => {
  const columns = getTableColumns(table)
  columns.forEach(column => {
    if (!isColumnSelected(table, column.name)) {
      toggleColumn(table, column)
    }
  })
}

const deselectAllColumns = (table) => {
  const columns = getTableColumns(table)
  columns.forEach(column => {
    if (isColumnSelected(table, column.name)) {
      toggleColumn(table, column)
    }
  })
}

const removeColumn = (column) => {
  reportStore.toggleColumn(column)
  
  nextTick(() => {
    reportStore.generateSQL()
  })
}

const removeJoin = (joinId) => {
  reportStore.joins = reportStore.joins.filter(j => j.id !== joinId)
  nextTick(() => {
    reportStore.generateSQL()
  })
}

const getFilterColumns = (tableId, dataSourceId) => {
  if (!tableId) return []
  
  return reportStore.availableColumns.filter(col => 
    col.tableId === tableId && col.dataSourceId === dataSourceId
  )
}

const addFilter = () => {
  reportStore.addFilter()
}

const updateFilterTable = (filter) => {
  // Reset column when table changes
  filter.column = ''
  filter.value = ''
  
  // Update dataSourceId based on selected table
  const table = reportStore.selectedTables.find(t => t.id === filter.tableId)
  if (table) {
    filter.dataSourceId = table.dataSourceId
  }
}

const updateFilter = (filter) => {
  // Update filter data type based on column
  const column = reportStore.availableColumns.find(col => 
    col.columnName === filter.column && 
    col.tableId === filter.tableId &&
    col.dataSourceId === filter.dataSourceId
  )
  
  if (column) {
    filter.dataType = column.columnType
  }
  
  nextTick(() => {
    reportStore.generateSQL()
  })
}

const getInputType = (dataType) => {
  if (!dataType) return 'text'
  
  const lowerType = dataType.toLowerCase()
  
  if (lowerType.includes('int') || lowerType.includes('number') || lowerType.includes('decimal')) {
    return 'number'
  }
  if (lowerType.includes('date')) {
    return 'date'
  }
  if (lowerType.includes('time')) {
    return 'datetime-local'
  }
  
  return 'text'
}

const getPlaceholder = (dataType, operator) => {
  if (!dataType) return 'Enter value...'
  
  const lowerType = dataType.toLowerCase()
  
  if (operator === 'IN' || operator === 'NOT IN') {
    return 'Enter values separated by commas'
  }
  
  if (lowerType.includes('int') || lowerType.includes('number')) {
    return 'Enter number...'
  }
  if (lowerType.includes('decimal')) {
    return 'Enter decimal...'
  }
  if (lowerType.includes('date')) {
    return 'YYYY-MM-DD'
  }
  if (lowerType.includes('time')) {
    return 'YYYY-MM-DD HH:MM:SS'
  }
  
  return 'Enter text...'
}

const updateSorting = () => {
  if (sortColumn.value) {
    reportStore.sortBy = [{
      field: sortColumn.value,
      direction: sortDirection.value
    }]
  } else {
    reportStore.sortBy = []
  }
  
  nextTick(() => {
    reportStore.generateSQL()
  })
}

const updateLimit = () => {
  nextTick(() => {
    reportStore.generateSQL()
  })
}

const generateQuery = () => {
  const sql = reportStore.generateSQL()
  if (sql) {
    console.log('✅ Query generated:', sql)
    // You could emit an event here to trigger preview in the canvas
  } else {
    console.warn('⚠️ Could not generate query')
  }
}

const resetConfiguration = () => {
  if (confirm('Are you sure you want to reset all configurations? This will clear all tables, columns, filters, and settings.')) {
    reportStore.reset()
    sortColumn.value = ''
    sortDirection.value = 'ASC'
  }
}

// Watch for changes in selected tables and auto-generate SQL
watch(
  () => [reportStore.selectedTables, reportStore.selectedColumns],
  () => {
    if (reportStore.hasValidQuery) {
      nextTick(() => {
        reportStore.generateSQL()
      })
    }
  },
  { deep: true }
)
</script>

<style scoped>
/* Custom scrollbar for the configuration panel */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Dark mode scrollbar */
.dark .overflow-y-auto {
  scrollbar-color: #4a5568 #2d3748;
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
  background: #2d3748;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

/* Hover effects for interactive elements */
.group:hover .group-hover\:visible {
  visibility: visible;
}

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>