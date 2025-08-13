import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useReportBuilderStore = defineStore('reportBuilder', () => {
  // State
  const selectedTables = ref([])
  const selectedColumns = ref([])
  const joins = ref([])
  const filters = ref([])
  const sortBy = ref([])
  const groupBy = ref([])
  const limit = ref(25)
  const isLoading = ref(false)
  const previewData = ref(null)
  const generatedSQL = ref('')
  
  // Mock data sources
  const dataSources = ref([
    {
      id: 'orders',
      name: 'Orders',
      icon: '📋',
      columns: [
        { name: 'id', type: 'number', primaryKey: true },
        { name: 'order_number', type: 'string' },
        { name: 'customer_id', type: 'number' },
        { name: 'total_amount', type: 'number' },
        { name: 'created_at', type: 'date' },
        { name: 'status', type: 'string' }
      ]
    },
    {
      id: 'customers',
      name: 'Customers',
      icon: '👥',
      columns: [
        { name: 'id', type: 'number', primaryKey: true },
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'address', type: 'string' }
      ]
    },
    {
      id: 'products',
      name: 'Products',
      icon: '📦',
      columns: [
        { name: 'id', type: 'number', primaryKey: true },
        { name: 'name', type: 'string' },
        { name: 'sku', type: 'string' },
        { name: 'price', type: 'number' },
        { name: 'category_id', type: 'number' }
      ]
    }
  ])
  
  // Computed
  const availableColumns = computed(() => {
    const columns = []
    selectedTables.value.forEach(table => {
      const tableData = dataSources.value.find(ds => ds.id === table.id)
      if (tableData) {
        tableData.columns.forEach(col => {
          columns.push({
            tableId: table.id,
            tableName: table.name,
            tableAlias: table.alias,
            columnName: col.name,
            columnType: col.type,
            fullName: `${table.alias}.${col.name}`,
            displayName: `${table.name}.${col.name}`
          })
        })
      }
    })
    return columns
  })
  
  const hasValidQuery = computed(() => {
    return selectedTables.value.length > 0 && selectedColumns.value.length > 0
  })
  
  // Actions
  const addTable = (tableId) => {
    const table = dataSources.value.find(ds => ds.id === tableId)
    if (table && !selectedTables.value.find(t => t.id === tableId)) {
      const alias = table.name.toLowerCase()
      selectedTables.value.push({
        id: table.id,
        name: table.name,
        alias: alias
      })
      
      // Auto-add joins for common relationships
      autoDetectJoins()
    }
  }
  
  const removeTable = (tableId) => {
    const table = selectedTables.value.find(t => t.id === tableId)
    if (table) {
      selectedTables.value = selectedTables.value.filter(t => t.id !== tableId)
      selectedColumns.value = selectedColumns.value.filter(c => c.tableId !== tableId)
      joins.value = joins.value.filter(j => j.leftTable !== tableId && j.rightTable !== tableId)
      filters.value = filters.value.filter(f => f.tableId !== tableId)
      
      // Clear preview data if no tables left
      if (selectedTables.value.length === 0) {
        previewData.value = null
        generatedSQL.value = ''
      }
    }
  }
  
  const toggleColumn = (column) => {
    const existingIndex = selectedColumns.value.findIndex(
      c => c.tableId === column.tableId && c.columnName === column.columnName
    )
    
    if (existingIndex >= 0) {
      selectedColumns.value.splice(existingIndex, 1)
    } else {
      selectedColumns.value.push({
        ...column,
        alias: column.columnName.charAt(0).toUpperCase() + column.columnName.slice(1).replace('_', ' '),
        visible: true
      })
    }
  }
  
  const addFilter = () => {
    if (selectedTables.value.length === 0) {
      return
    }
    
    filters.value.push({
      id: uuidv4(),
      tableId: selectedTables.value[0].id,
      column: '',
      operator: '=',
      value: '',
      dataType: 'string'
    })
  }
  
  const removeFilter = (filterId) => {
    filters.value = filters.value.filter(f => f.id !== filterId)
  }
  
  const autoDetectJoins = () => {
    // Simple auto-join logic
    const tables = selectedTables.value
    if (tables.length >= 2) {
      const ordersTable = tables.find(t => t.id === 'orders')
      const customersTable = tables.find(t => t.id === 'customers')
      
      if (ordersTable && customersTable) {
        const existingJoin = joins.value.find(
          j => (j.leftTable === 'orders' && j.rightTable === 'customers') ||
               (j.leftTable === 'customers' && j.rightTable === 'orders')
        )
        
        if (!existingJoin) {
          joins.value.push({
            id: uuidv4(),
            leftTable: 'orders',
            rightTable: 'customers',
            joinType: 'LEFT',
            condition: 'orders.customer_id = customers.id'
          })
        }
      }
    }
  }
  
  const generateSQL = () => {
    if (!hasValidQuery.value) {
      generatedSQL.value = ''
      return
    }
    
    try {
      const selectClause = selectedColumns.value
        .filter(col => col.visible)
        .map(col => `${col.fullName} AS "${col.alias}"`)
        .join(',\n    ')
      
      if (!selectClause) {
        generatedSQL.value = ''
        return
      }
      
      const fromClause = selectedTables.value[0]?.alias || ''
      
      let joinClause = ''
      joins.value.forEach(join => {
        const rightTable = selectedTables.value.find(t => t.id === join.rightTable)
        if (rightTable) {
          joinClause += `\n${join.joinType} JOIN ${rightTable.name.toLowerCase()} ${rightTable.alias} ON ${join.condition}`
        }
      })
      
      let whereClause = ''
      if (filters.value.length > 0) {
        const conditions = filters.value
          .filter(f => f.column && f.value)
          .map(f => {
            const table = selectedTables.value.find(t => t.id === f.tableId)
            if (table) {
              let value = f.value
              if (f.dataType === 'string' && f.operator !== 'IS NULL' && f.operator !== 'IS NOT NULL') {
                value = `'${value}'`
              }
              return `${table.alias}.${f.column} ${f.operator} ${value}`
            }
            return ''
          })
          .filter(condition => condition)
        
        if (conditions.length > 0) {
          whereClause = `\nWHERE ${conditions.join(' AND ')}`
        }
      }
      
      let orderByClause = ''
      if (sortBy.value.length > 0) {
        orderByClause = `\nORDER BY ${sortBy.value.map(s => `${s.field} ${s.direction}`).join(', ')}`
      }
      
      let limitClause = ''
      if (limit.value) {
        limitClause = `\nLIMIT ${limit.value}`
      }
      
      const sql = `SELECT\n    ${selectClause}\nFROM ${selectedTables.value[0]?.name?.toLowerCase()} ${fromClause}${joinClause}${whereClause}${orderByClause}${limitClause};`
      
      generatedSQL.value = sql
      return sql
    } catch (error) {
      console.error('Error generating SQL:', error)
      generatedSQL.value = ''
    }
  }
  
  const reset = () => {
    selectedTables.value = []
    selectedColumns.value = []
    joins.value = []
    filters.value = []
    sortBy.value = []
    groupBy.value = []
    limit.value = 25
    previewData.value = null
    generatedSQL.value = ''
  }
  
  const buildQueryConfig = () => {
    return {
      datasource_id: 'default',
      tables: selectedTables.value.map(table => ({
        id: table.id,
        name: table.name,
        alias: table.alias
      })),
      joins: joins.value,
      fields: selectedColumns.value
        .filter(col => col.visible)
        .map(col => ({
          table_alias: col.tableAlias,
          column: col.columnName,
          alias: col.alias,
          visible: col.visible
        })),
      filters: filters.value
        .filter(f => f.column && f.value)
        .map(filter => ({
          table_alias: selectedTables.value.find(t => t.id === filter.tableId)?.alias || filter.tableId,
          column: filter.column,
          operator: filter.operator,
          value: filter.value,
          data_type: filter.dataType
        })),
      order_by: sortBy.value,
      limit: limit.value
    }
  }
  
  return {
    // State
    selectedTables,
    selectedColumns,
    joins,
    filters,
    sortBy,
    groupBy,
    limit,
    isLoading,
    previewData,
    generatedSQL,
    dataSources,
    
    // Computed
    availableColumns,
    hasValidQuery,
    
    // Actions
    addTable,
    removeTable,
    toggleColumn,
    addFilter,
    removeFilter,
    generateSQL,
    reset,
    buildQueryConfig
  }
})