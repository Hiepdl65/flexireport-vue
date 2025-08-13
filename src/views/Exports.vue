<template>
  <div class="container">
    <h1 class="text-center mt-4 mb-4">Export Reports</h1>
    
    <div class="export-options">
      <div class="export-card">
        <h3>PDF Export</h3>
        <p>Export your reports as PDF documents</p>
        <button class="btn btn-primary" @click="exportPDF">Export as PDF</button>
      </div>
      
      <div class="export-card">
        <h3>Excel Export</h3>
        <p>Export data to Excel spreadsheets</p>
        <button class="btn btn-primary" @click="exportExcel">Export as Excel</button>
      </div>
      
      <div class="export-card">
        <h3>CSV Export</h3>
        <p>Export data in CSV format</p>
        <button class="btn btn-primary" @click="exportCSV">Export as CSV</button>
      </div>
    </div>
    
    <div class="export-history mt-4">
      <h3>Recent Exports</h3>
      <div class="history-list">
        <div class="history-item" v-for="export in exportHistory" :key="export.id">
          <span class="export-name">{{ export.name }}</span>
          <span class="export-format">{{ export.format }}</span>
          <span class="export-date">{{ export.date }}</span>
          <button class="btn btn-primary" @click="downloadExport(export.id)">Download</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const exportHistory = ref([
  {
    id: 1,
    name: 'Monthly Sales Report',
    format: 'PDF',
    date: '2024-01-15'
  },
  {
    id: 2,
    name: 'Customer Data',
    format: 'Excel',
    date: '2024-01-14'
  }
])

const exportPDF = () => {
  console.log('Exporting as PDF...')
  // PDF export logic
}

const exportExcel = () => {
  console.log('Exporting as Excel...')
  // Excel export logic
}

const exportCSV = () => {
  console.log('Exporting as CSV...')
  // CSV export logic
}

const downloadExport = (id) => {
  console.log('Downloading export:', id)
  // Download logic
}
</script>

<style scoped>
.export-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.export-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.export-card h3 {
  color: #333;
  margin-bottom: 1rem;
}

.export-card p {
  color: #666;
  margin-bottom: 1.5rem;
}

.export-history {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.export-history h3 {
  color: #333;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.history-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.history-item:last-child {
  border-bottom: none;
}

.export-name {
  font-weight: bold;
}

.export-format {
  color: #007bff;
  font-weight: 500;
}

.export-date {
  color: #666;
}
</style>
