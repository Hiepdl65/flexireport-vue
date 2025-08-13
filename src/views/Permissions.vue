<template>
  <div class="container">
    <h1 class="text-center mt-4 mb-4">User Permissions</h1>
    <div class="permissions-section">
      <div class="permission-group">
        <h3>Report Access</h3>
        <div class="permission-item">
          <label>
            <input type="checkbox" v-model="permissions.canViewReports">
            Can View Reports
          </label>
        </div>
        <div class="permission-item">
          <label>
            <input type="checkbox" v-model="permissions.canCreateReports">
            Can Create Reports
          </label>
        </div>
        <div class="permission-item">
          <label>
            <input type="checkbox" v-model="permissions.canEditReports">
            Can Edit Reports
          </label>
        </div>
      </div>
      
      <div class="permission-group">
        <h3>Data Access</h3>
        <div class="permission-item">
          <label>
            <input type="checkbox" v-model="permissions.canExportData">
            Can Export Data
          </label>
        </div>
        <div class="permission-item">
          <label>
            <input type="checkbox" v-model="permissions.canViewAnalytics">
            Can View Analytics
          </label>
        </div>
      </div>
    </div>
    
    <div class="text-center mt-4">
      <button class="btn btn-primary" @click="savePermissions">Save Permissions</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const permissions = ref({
  canViewReports: true,
  canCreateReports: false,
  canEditReports: false,
  canExportData: false,
  canViewAnalytics: false
})

const savePermissions = () => {
  console.log('Saving permissions:', permissions.value)
  // Save logic here
}
</script>

<style scoped>
.permissions-section {
  max-width: 600px;
  margin: 0 auto;
}

.permission-group {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.permission-group h3 {
  color: #333;
  margin-bottom: 1rem;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.permission-item {
  margin: 1rem 0;
}

.permission-item label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1.1rem;
}

.permission-item input[type="checkbox"] {
  margin-right: 0.5rem;
  transform: scale(1.2);
}
</style>
