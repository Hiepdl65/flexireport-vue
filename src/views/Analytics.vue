<template>
  <div class="container">
    <h1 class="text-center mt-4 mb-4">Analytics Dashboard</h1>
    
    <div class="analytics-grid">
      <div class="metric-card">
        <h3>Total Reports</h3>
        <div class="metric-value">{{ metrics.totalReports }}</div>
        <div class="metric-change positive">+12% from last month</div>
      </div>
      
      <div class="metric-card">
        <h3>Active Users</h3>
        <div class="metric-value">{{ metrics.activeUsers }}</div>
        <div class="metric-change positive">+8% from last month</div>
      </div>
      
      <div class="metric-card">
        <h3>Export Count</h3>
        <div class="metric-value">{{ metrics.exportCount }}</div>
        <div class="metric-change negative">-3% from last month</div>
      </div>
      
      <div class="metric-card">
        <h3>Success Rate</h3>
        <div class="metric-value">{{ metrics.successRate }}%</div>
        <div class="metric-change positive">+2% from last month</div>
      </div>
    </div>
    
    <div class="chart-section mt-4">
      <h3>Report Generation Trends</h3>
      <div class="chart-placeholder">
        <p>Chart visualization would go here</p>
        <p>Showing report generation over time</p>
      </div>
    </div>
    
    <div class="recent-activity mt-4">
      <h3>Recent Activity</h3>
      <div class="activity-list">
        <div class="activity-item" v-for="activity in recentActivity" :key="activity.id">
          <span class="activity-icon">📊</span>
          <span class="activity-text">{{ activity.description }}</span>
          <span class="activity-time">{{ activity.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const metrics = ref({
  totalReports: 156,
  activeUsers: 89,
  exportCount: 234,
  successRate: 98.5
})

const recentActivity = ref([
  {
    id: 1,
    description: 'New report "Monthly Sales" created',
    time: '2 hours ago'
  },
  {
    id: 2,
    description: 'Report "Customer Analysis" exported to PDF',
    time: '4 hours ago'
  },
  {
    id: 3,
    description: 'User "john.doe" logged in',
    time: '6 hours ago'
  }
])
</script>

<style scoped>
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.metric-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.metric-card h3 {
  color: #666;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.metric-change {
  font-size: 0.9rem;
  font-weight: 500;
}

.metric-change.positive {
  color: #28a745;
}

.metric-change.negative {
  color: #dc3545;
}

.chart-section, .recent-activity {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.chart-section h3, .recent-activity h3 {
  color: #333;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.chart-placeholder {
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.activity-icon {
  font-size: 1.2rem;
}

.activity-text {
  flex: 1;
  color: #333;
}

.activity-time {
  color: #666;
  font-size: 0.9rem;
}
</style>
