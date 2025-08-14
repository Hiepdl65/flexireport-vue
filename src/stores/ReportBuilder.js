import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  
  // Dynamic data sources - populated from API only
  const dataSources = ref([])
  const availableTables = ref([])
  const tablesMetadata = ref({}) // Store detailed table metadata
  
  // Computed
  const availableColumns = computed(() => {
    const columns = []
    selectedTables.value.forEach(table => {
      const tableMetadata = tablesMetadata.value[`${table.dataSourceId}-${table.id}`]
      if (tableMetadata && tableMetadata.columns) {
        tableMetadata.columns.forEach(col => {
          columns.push({
            tableId: table.id,
            tableName: table.name,
            tableAlias: table.alias,
            dataSourceId: table.dataSourceId,
            columnName: col.name,
            columnType: col.type,
            primaryKey: col.primaryKey || false,
            nullable: col.nullable !== false,
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
  
  const selectedDataSources = computed(() => {
    const dataSourceIds = [...new Set(selectedTables.value.map(t => t.dataSourceId))]
    return dataSources.value.filter(ds => dataSourceIds.includes(ds.id))
  })
  
  // Actions
  const setDataSources = (sources) => {
    dataSources.value = sources
    console.log(`📊 Updated data sources: ${sources.length}`)
  }
  
  const setAvailableTables = (tables) => {
    availableTables.value = tables
    
    // Update tables metadata
    tables.forEach(table => {
      const key = `${table.dataSourceId}-${table.id}`
      tablesMetadata.value[key] = {
        id: table.id,
        name: table.name,
        dataSourceId: table.dataSourceId,
        tableType: table.table_type,
        columns: table.columns || [],
        rowCount: table.row_count
      }
    })
    
    console.log(`📋 Updated available tables: ${tables.length}`)
  }
  
  const addTableMetadata = (dataSourceId, tableId, metadata) => {
    const key = `${dataSourceId}-${tableId}`
    tablesMetadata.value[key] = metadata
  }
  
  const getTableMetadata = (dataSourceId, tableId) => {
    const key = `${dataSourceId}-${tableId}`
    return tablesMetadata.value[key]
  }
  
  const addTable = (tableData) => {
    // tableData should include: id, name, dataSourceId, columns
    const existingTable = selectedTables.value.find(t => 
      t.id === tableData.id && t.dataSourceId === tableData.dataSourceId
    )
    
    if (existingTable) {
      console.log(`⚠️ Table ${tableData.name} already selected`)
      return false
    }
    
    // Generate unique alias
    const baseName = tableData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')
    let alias = baseName
    let counter = 1
    
    while (selectedTables.value.find(t => t.alias === alias)) {
      alias = `${baseName}_${counter}`
      counter++
    }
    
    const newTable = {
      id: tableData.id,
      name: tableData.name,
      alias: alias,
      dataSourceId: tableData.dataSourceId
    }
    
    selectedTables.value.push(newTable)
    
    // Store table metadata if provided
    if (tableData.columns) {
      addTableMetadata(tableData.dataSourceId, tableData.id, {
        id: tableData.id,
        name: tableData.name,
        dataSourceId: tableData.dataSourceId,
        tableType: tableData.table_type || 'table',
        columns: tableData.columns,
        rowCount: tableData.row_count
      })
    }
    
    // Auto-add joins for common relationships
    autoDetectJoins()
    
    console.log(`✅ Added table: ${tableData.name} (${alias})`)
    return true
  }
  
  const removeTable = (tableId, dataSourceId = null) => {
    const table = selectedTables.value.find(t => 
      t.id === tableId && (dataSourceId === null || t.dataSourceId === dataSourceId)
    )
    
    if (table) {
      selectedTables.value = selectedTables.value.filter(t => 
        !(t.id === tableId && t.dataSourceId === table.dataSourceId)
      )
      
      selectedColumns.value = selectedColumns.value.filter(c => 
        !(c.tableId === tableId && c.dataSourceId === table.dataSourceId)
      )
      
      joins.value = joins.value.filter(j => 
        !(j.leftTable === tableId || j.rightTable === tableId)
      )
      
      filters.value = filters.value.filter(f => 
        !(f.tableId === tableId && f.dataSourceId === table.dataSourceId)
      )
      
      // Clear preview data if no tables left
      if (selectedTables.value.length === 0) {
        previewData.value = null
        generatedSQL.value = ''
      }
      
      console.log(`🗑️ Removed table: ${table.name}`)
      return true
    }
    
    console.log(`⚠️ Table not found for removal: ${tableId}`)
    return false
  }
  
  const toggleColumn = (column) => {
    const existingIndex = selectedColumns.value.findIndex(
      c => c.tableId === column.tableId && 
           c.columnName === column.columnName &&
           c.dataSourceId === column.dataSourceId
    )
    
    if (existingIndex >= 0) {
      selectedColumns.value.splice(existingIndex, 1)
      console.log(`➖ Removed column: ${column.displayName}`)
    } else {
      selectedColumns.value.push({
        ...column,
        alias: formatColumnAlias(column.columnName),
        visible: true
      })
      console.log(`➕ Added column: ${column.displayName}`)
    }
  }
  
  const formatColumnAlias = (columnName) => {
    return columnName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  const addFilter = () => {
    if (selectedTables.value.length === 0) {
      console.warn('⚠️ No tables selected for filter')
      return
    }
    
    const filterId = `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const firstTable = selectedTables.value[0]
    
    filters.value.push({
      id: filterId,
      tableId: firstTable.id,
      dataSourceId: firstTable.dataSourceId,
      column: '',
      operator: '=',
      value: '',
      dataType: 'string'
    })
    
    console.log(`🔍 Added new filter: ${filterId}`)
  }
  
  const removeFilter = (filterId) => {
    const initialLength = filters.value.length
    filters.value = filters.value.filter(f => f.id !== filterId)
    
    if (filters.value.length < initialLength) {
      console.log(`🗑️ Removed filter: ${filterId}`)
    }
  }
  
  const autoDetectJoins = () => {
    // Enhanced auto-join logic based on common naming patterns
    const tables = selectedTables.value
    
    if (tables.length < 2) return
    
    // Common join patterns based on naming conventions
    const joinPatterns = [
      // orders.customer_id = customers.id
      { 
        left: 'orders', 
        right: 'customers', 
        condition: 'orders.customer_id = customers.id',
        type: 'LEFT'
      },
      // order_items.order_id = orders.id
      { 
        left: 'order_items', 
        right: 'orders', 
        condition: 'order_items.order_id = orders.id',
        type: 'LEFT'
      },
      // order_items.product_id = products.id
      { 
        left: 'order_items', 
        right: 'products', 
        condition: 'order_items.product_id = products.id',
        type: 'LEFT'
      },
      // products.category_id = categories.id
      { 
        left: 'products', 
        right: 'categories', 
        condition: 'products.category_id = categories.id',
        type: 'LEFT'
      },
      // payments.order_id = orders.id
      { 
        left: 'payments', 
        right: 'orders', 
        condition: 'payments.order_id = orders.id',
        type: 'LEFT'
      },
      // inventory.product_id = products.id
      { 
        left: 'inventory', 
        right: 'products', 
        condition: 'inventory.product_id = products.id',
        type: 'LEFT'
      },
      // users.id = orders.user_id
      { 
        left: 'orders', 
        right: 'users', 
        condition: 'orders.user_id = users.id',
        type: 'LEFT'
      }
    ]
    
    joinPatterns.forEach(pattern => {
      const leftTable = tables.find(t => t.name.toLowerCase() === pattern.left)
      const rightTable = tables.find(t => t.name.toLowerCase() === pattern.right)
      
      if (leftTable && rightTable) {
        const existingJoin = joins.value.find(j => 
          (j.leftTable === leftTable.id && j.rightTable === rightTable.id) ||
          (j.leftTable === rightTable.id && j.rightTable === leftTable.id)
        )
        
        if (!existingJoin) {
          // Adjust condition with actual table aliases
          const condition = pattern.condition
            .replace(pattern.left, leftTable.alias)
            .replace(pattern.right, rightTable.alias)
          
          joins.value.push({
            id: `join_${Date.now()}_${leftTable.id}_${rightTable.id}`,
            leftTable: leftTable.id,
            rightTable: rightTable.id,
            joinType: pattern.type,
            condition: condition
          })
          
          console.log(`🔗 Auto-detected join: ${leftTable.name} -> ${rightTable.name}`)
        }
      }
    })
  }
  
  const generateSQL = () => {
    if (!hasValidQuery.value) {
      generatedSQL.value = ''
      console.log('❌ Cannot generate SQL: No valid query configuration')
      return ''
    }
    
    try {
      // SELECT clause
      const selectClause = selectedColumns.value
        .filter(col => col.visible)
        .map(col => `${col.fullName} AS "${col.alias}"`)
        .join(',\n    ')
      
      if (!selectClause) {
        generatedSQL.value = ''
        console.log('❌ Cannot generate SQL: No columns selected')
        return ''
      }
      
      // FROM clause
      const mainTable = selectedTables.value[0]
      const fromClause = `${mainTable.name} ${mainTable.alias}`
      
      // JOIN clauses
      let joinClause = ''
      joins.value.forEach(join => {
        const rightTable = selectedTables.value.find(t => t.id === join.rightTable)
        if (rightTable) {
          joinClause += `\n${join.joinType} JOIN ${rightTable.name} ${rightTable.alias} ON ${join.condition}`
        }
      })
      
      // WHERE clause
      let whereClause = ''
      if (filters.value.length > 0) {
        const conditions = filters.value
          .filter(f => f.column && f.value)
          .map(f => {
            const table = selectedTables.value.find(t => 
              t.id === f.tableId && t.dataSourceId === f.dataSourceId
            )
            if (table) {
              let value = f.value
              
              // Handle different data types and operators
              if (f.operator === 'IS NULL' || f.operator === 'IS NOT NULL') {
                return `${table.alias}.${f.column} ${f.operator}`
              }
              
              if (f.dataType === 'string' || f.dataType === 'varchar' || f.dataType === 'text') {
                if (f.operator === 'LIKE' || f.operator === 'NOT LIKE') {
                  value = `'%${value}%'`
                } else {
                  value = `'${value}'`
                }
              } else if (f.dataType === 'date' || f.dataType === 'timestamp') {
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
      
      // ORDER BY clause
      let orderByClause = ''
      if (sortBy.value.length > 0) {
        orderByClause = `\nORDER BY ${sortBy.value.map(s => `${s.field} ${s.direction}`).join(', ')}`
      }
      
      // LIMIT clause
      let limitClause = ''
      if (limit.value) {
        limitClause = `\nLIMIT ${limit.value}`
      }
      
      // Combine all parts
      const sql = `SELECT\n    ${selectClause}\nFROM ${fromClause}${joinClause}${whereClause}${orderByClause}${limitClause};`
      
      generatedSQL.value = sql
      console.log('✅ SQL generated successfully')
      return sql
      
    } catch (error) {
      console.error('❌ Error generating SQL:', error)
      generatedSQL.value = ''
      return ''
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
    console.log('🔄 Report builder reset')
  }
  
  const buildQueryConfig = () => {
    return {
      dataSources: selectedDataSources.value.map(ds => ({
        id: ds.id,
        name: ds.name,
        type: ds.type
      })),
      tables: selectedTables.value.map(table => ({
        id: table.id,
        name: table.name,
        alias: table.alias,
        dataSourceId: table.dataSourceId
      })),
      joins: joins.value,
      fields: selectedColumns.value
        .filter(col => col.visible)
        .map(col => ({
          table_id: col.tableId,
          table_alias: col.tableAlias,
          data_source_id: col.dataSourceId,
          column: col.columnName,
          column_type: col.columnType,
          alias: col.alias,
          visible: col.visible
        })),
      filters: filters.value
        .filter(f => f.column && f.value)
        .map(filter => ({
          table_id: filter.tableId,
          data_source_id: filter.dataSourceId,
          table_alias: selectedTables.value.find(t => 
            t.id === filter.tableId && t.dataSourceId === filter.dataSourceId
          )?.alias || filter.tableId,
          column: filter.column,
          operator: filter.operator,
          value: filter.value,
          data_type: filter.dataType
        })),
      order_by: sortBy.value,
      limit: limit.value,
      generated_sql: generatedSQL.value
    }
  }
  
  const getTableData = (tableId, dataSourceId = null) => {
    return availableTables.value.find(table => 
      table.id === tableId && (dataSourceId === null || table.dataSourceId === dataSourceId)
    )
  }
  
  const isTableSelected = (tableId, dataSourceId = null) => {
    return selectedTables.value.some(t => 
      t.id === tableId && (dataSourceId === null || t.dataSourceId === dataSourceId)
    )
  }
  
  const getSelectedTableColumns = (tableId, dataSourceId = null) => {
    return selectedColumns.value.filter(col => 
      col.tableId === tableId && (dataSourceId === null || col.dataSourceId === dataSourceId)
    )
  }
  
  const getDataSourceById = (dataSourceId) => {
    return dataSources.value.find(ds => ds.id === dataSourceId)
  }
  
  const getTablesForDataSource = (dataSourceId) => {
    return availableTables.value.filter(table => table.dataSourceId === dataSourceId)
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
    availableTables,
    tablesMetadata,
    
    // Computed
    availableColumns,
    hasValidQuery,
    selectedDataSources,
    
    // Actions
    setDataSources,
    setAvailableTables,
    addTableMetadata,
    getTableMetadata,
    addTable,
    removeTable,
    toggleColumn,
    addFilter,
    removeFilter,
    generateSQL,
    reset,
    buildQueryConfig,
    getTableData,
    isTableSelected,
    getSelectedTableColumns,
    getDataSourceById,
    getTablesForDataSource
  }
})