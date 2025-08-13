import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Data Sources API
export const dataSourcesAPI = {
  // Get all data sources
  getDataSources: () => api.get('/data-sources/'),
  
  // Create new data source
  createDataSource: (data) => api.post('/data-sources/', data),
  
  // Test connection to data source
  testConnection: (data) => api.post('/data-sources/test-connection', data),
  
  // Get tables from data source
  getTables: (dataSourceId) => api.get(`/data-sources/${dataSourceId}/tables`),
  
  // Get columns from table
  getTableColumns: (dataSourceId, tableName) => 
    api.get(`/data-sources/${dataSourceId}/tables/${tableName}/columns`),
}

// Templates API
export const templatesAPI = {
  // Get all templates
  getTemplates: (params = {}) => api.get('/templates/', { params }),
  
  // Get specific template
  getTemplate: (templateId) => api.get(`/templates/${templateId}`),
  
  // Create new template
  createTemplate: (data) => api.post('/templates/', data),
  
  // Update template
  updateTemplate: (templateId, data) => api.put(`/templates/${templateId}`, data),
  
  // Delete template
  deleteTemplate: (templateId) => api.delete(`/templates/${templateId}`),
  
  // Duplicate template
  duplicateTemplate: (templateId) => api.post(`/templates/${templateId}/duplicate`),
}

// Reports API
export const reportsAPI = {
  // Run report
  runReport: (data) => api.post('/reports/run', data),
  
  // Preview report
  previewReport: (data) => api.post('/reports/preview', data),
  
  // Get report history
  getReportHistory: (params = {}) => api.get('/reports/history', { params }),
}

// Permissions API
export const permissionsAPI = {
  // Grant permissions
  grantPermissions: (data) => api.post('/permissions/grant', data),
  
  // Get template permissions
  getTemplatePermissions: (templateId) => api.get(`/permissions/template/${templateId}`),
  
  // Revoke permission
  revokePermission: (templateId, userId) => 
    api.delete(`/permissions/template/${templateId}/user/${userId}`),
  
  // Check permission
  checkPermission: (templateId, permission) => 
    api.get(`/permissions/check/${templateId}`, { params: { permission } }),
}

// Health check API
export const healthAPI = {
  // Get health status
  getHealth: () => api.get('/health'),
}

export default api
