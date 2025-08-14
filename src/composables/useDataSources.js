import { ref, reactive, onMounted } from 'vue'
import { dataSourcesAPI } from '@/services/api'
import { useReportBuilderStore } from '@/stores/ReportBuilder'

export function useDataSources() {
  const reportStore = useReportBuilderStore()
  
  // State
  const loading = ref(false)
  const error = ref(null)
  const dataSources = ref([])
  const availableTables = ref([])
  const loadingTables = reactive({})
  
  // Status tracking
  const connectionStatus = reactive({
    total: 0,
    connected: 0,
    failed: 0
  })
  
  /**
   * Load all data sources from API
   */
  const loadDataSources = async () => {
    try {
      loading.value = true
      error.value = null
      
      console.log('🔄 Loading data sources from API...')
      
      // Get data sources from API
      const sources = await dataSourcesAPI.getDataSources()
      dataSources.value = sources
      
      // Update store
      reportStore.setDataSources(sources)
      
      // Update connection status
      updateConnectionStatus()
      
      console.log(`✅ Loaded ${sources.length} data sources from API`)
      
      // Auto-load tables for all connected sources
      if (sources.length > 0) {
        await loadTablesForAllSources()
      }
      
      return sources
      
    } catch (err) {
      console.error('❌ Failed to load data sources from API:', err)
      error.value = `Failed to connect to server: ${err.message}`
      
      // Clear any existing data
      dataSources.value = []
      availableTables.value = []
      reportStore.setDataSources([])
      reportStore.setAvailableTables([])
      
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Load tables for all connected data sources
   */
  const loadTablesForAllSources = async () => {
    const connectedSources = dataSources.value.filter(ds => ds.status === 'connected')
    
    if (connectedSources.length === 0) {
      console.log('ℹ️ No connected data sources found')
      return
    }
    
    console.log(`🔄 Loading tables for ${connectedSources.length} connected sources...`)
    
    // Load tables in parallel
    const promises = connectedSources.map(source => loadTablesForDataSource(source.id))
    
    try {
      await Promise.allSettled(promises)
      console.log('✅ Finished loading tables for all sources')
    } catch (err) {
      console.error('❌ Some table loading operations failed:', err)
    }
  }
  
  /**
   * Load tables for a specific data source
   */
  const loadTablesForDataSource = async (dataSourceId) => {
    if (loadingTables[dataSourceId]) {
      console.log(`⏳ Already loading tables for data source ${dataSourceId}`)
      return
    }
    
    try {
      loadingTables[dataSourceId] = true
      console.log(`🔄 Loading tables for data source: ${dataSourceId}`)
      
      // Get tables from API
      const tables = await dataSourcesAPI.getTables(dataSourceId)
      console.log(`📋 Found ${tables.length} tables for data source ${dataSourceId}`)
      
      // Remove existing tables for this data source from availableTables
      availableTables.value = availableTables.value.filter(table => table.dataSourceId !== dataSourceId)
      
      // Load detailed information for each table
      for (const table of tables) {
        try {
          console.log(`🔍 Loading columns for table: ${table.name}`)
          
          // Get detailed column information
          const columns = await dataSourcesAPI.getTableColumns(dataSourceId, table.name)
          
          // Create table object with full metadata
          const tableWithMetadata = {
            id: table.name,
            name: table.name,
            dataSourceId: dataSourceId,
            table_type: table.type || 'table',
            row_count: table.row_count || 0,
            columns: columns.map(col => ({
              name: col.name,
              type: col.type,
              primaryKey: col.primary_key || false,
              nullable: col.nullable !== false,
              defaultValue: col.default_value || null
            }))
          }
          
          availableTables.value.push(tableWithMetadata)
          
          console.log(`✅ Loaded table ${table.name} with ${columns.length} columns`)
          
        } catch (columnError) {
          console.error(`❌ Failed to load columns for table ${table.name}:`, columnError)
          
          // Add table without detailed columns
          availableTables.value.push({
            id: table.name,
            name: table.name,
            dataSourceId: dataSourceId,
            table_type: table.type || 'table',
            row_count: table.row_count || 0,
            columns: []
          })
        }
      }
      
      // Update store with new tables
      reportStore.setAvailableTables(availableTables.value)
      
      console.log(`✅ Successfully loaded ${tables.length} tables for data source ${dataSourceId}`)
      
      return tables
      
    } catch (err) {
      console.error(`❌ Failed to load tables for data source ${dataSourceId}:`, err)
      throw err
    } finally {
      loadingTables[dataSourceId] = false
    }
  }
  
  /**
   * Test connection to a data source
   */
  const testDataSourceConnection = async (dataSourceConfig) => {
    try {
      console.log('🔌 Testing connection for:', dataSourceConfig.name)
      
      const result = await dataSourcesAPI.testConnection(dataSourceConfig)
      
      if (result.success) {
        console.log('✅ Connection test successful:', result.message)
      } else {
        console.log('❌ Connection test failed:', result.message)
      }
      
      return result
      
    } catch (err) {
      console.error('❌ Connection test error:', err)
      return {
        success: false,
        message: err.message || 'Connection test failed'
      }
    }
  }
  
  /**
   * Create a new data source
   */
  const createDataSource = async (dataSourceData) => {
    try {
      console.log('➕ Creating new data source:', dataSourceData.name)
      
      // Create data source via API
      const newDataSource = await dataSourcesAPI.createDataSource(dataSourceData)
      
      // Add to local state
      dataSources.value.unshift(newDataSource)
      reportStore.setDataSources(dataSources.value)
      
      // Update connection status
      updateConnectionStatus()
      
      // Load tables if connected
      if (newDataSource.status === 'connected') {
        await loadTablesForDataSource(newDataSource.id)
      }
      
      console.log('✅ Data source created successfully:', newDataSource)
      
      return newDataSource
      
    } catch (err) {
      console.error('❌ Failed to create data source:', err)
      throw err
    }
  }
  
  /**
   * Update a data source
   */
  const updateDataSource = async (dataSourceId, dataSourceData) => {
    try {
      console.log('📝 Updating data source:', dataSourceId)
      
      // Update data source via API
      const updatedDataSource = await dataSourcesAPI.updateDataSource(dataSourceId, dataSourceData)
      
      // Update local state
      const index = dataSources.value.findIndex(ds => ds.id === dataSourceId)
      if (index >= 0) {
        dataSources.value[index] = updatedDataSource
        reportStore.setDataSources(dataSources.value)
      }
      
      // Update connection status
      updateConnectionStatus()
      
      // Reload tables if status changed to connected
      if (updatedDataSource.status === 'connected') {
        await loadTablesForDataSource(dataSourceId)
      }
      
      console.log('✅ Data source updated successfully:', updatedDataSource)
      
      return updatedDataSource
      
    } catch (err) {
      console.error('❌ Failed to update data source:', err)
      throw err
    }
  }
  
  /**
   * Delete a data source
   */
  const deleteDataSource = async (dataSourceId) => {
    try {
      console.log('🗑️ Deleting data source:', dataSourceId)
      
      // Delete data source via API
      await dataSourcesAPI.deleteDataSource(dataSourceId)
      
      // Remove from local state
      dataSources.value = dataSources.value.filter(ds => ds.id !== dataSourceId)
      availableTables.value = availableTables.value.filter(table => table.dataSourceId !== dataSourceId)
      
      // Update stores
      reportStore.setDataSources(dataSources.value)
      reportStore.setAvailableTables(availableTables.value)
      
      // Update connection status
      updateConnectionStatus()
      
      console.log('✅ Data source deleted successfully')
      
    } catch (err) {
      console.error('❌ Failed to delete data source:', err)
      throw err
    }
  }
  
  /**
   * Refresh tables for a specific data source
   */
  const refreshDataSourceTables = async (dataSourceId) => {
    try {
      console.log(`🔄 Refreshing tables for data source: ${dataSourceId}`)
      
      // Remove existing tables for this data source
      availableTables.value = availableTables.value.filter(table => table.dataSourceId !== dataSourceId)
      reportStore.setAvailableTables(availableTables.value)
      
      // Reload tables
      await loadTablesForDataSource(dataSourceId)
      
      console.log(`✅ Refreshed tables for data source: ${dataSourceId}`)
      
    } catch (err) {
      console.error(`❌ Failed to refresh tables for data source ${dataSourceId}:`, err)
      throw err
    }
  }
  
  /**
   * Refresh all tables
   */
  const refreshAllTables = async () => {
    try {
      console.log('🔄 Refreshing all tables...')
      
      // Clear existing tables
      availableTables.value = []
      reportStore.setAvailableTables([])
      
      // Reload tables for all connected sources
      await loadTablesForAllSources()
      
      console.log('✅ Refreshed all tables')
      
    } catch (err) {
      console.error('❌ Failed to refresh all tables:', err)
      throw err
    }
  }
  
  /**
   * Update connection status statistics
   */
  const updateConnectionStatus = () => {
    connectionStatus.total = dataSources.value.length
    connectionStatus.connected = dataSources.value.filter(ds => ds.status === 'connected').length
    connectionStatus.failed = dataSources.value.filter(ds => ds.status === 'disconnected' || ds.status === 'failed').length
  }
  
  /**
   * Get data source by ID
   */
  const getDataSourceById = (dataSourceId) => {
    return dataSources.value.find(ds => ds.id === dataSourceId)
  }
  
  /**
   * Get tables for a specific data source
   */
  const getTablesForDataSource = (dataSourceId) => {
    return availableTables.value.filter(table => table.dataSourceId === dataSourceId)
  }
  
  /**
   * Check if any tables are currently loading
   */
  const isLoadingAnyTables = () => {
    return Object.values(loadingTables).some(loading => loading)
  }
  
  /**
   * Initialize data sources on mount
   */
  onMounted(async () => {
    console.log('🚀 Initializing data sources (API only)...')
    try {
      await loadDataSources()
    } catch (error) {
      // Error already handled in loadDataSources
      console.log('⚠️ Failed to initialize data sources - check server connection')
    }
  })
  
  return {
    // State
    loading,
    error,
    dataSources,
    availableTables,
    loadingTables,
    connectionStatus,
    
    // Methods
    loadDataSources,
    loadTablesForDataSource,
    testDataSourceConnection,
    createDataSource,
    updateDataSource,
    deleteDataSource,
    refreshDataSourceTables,
    refreshAllTables,
    getDataSourceById,
    getTablesForDataSource,
    isLoadingAnyTables,
    
    // Utilities
    updateConnectionStatus
  }
}