<template>
  <div class="container">
    <h1 class="text-center mt-4 mb-4">Report Templates</h1>
    <div class="templates-grid">
      <div class="template-card">
        <h3>Basic Report</h3>
        <p>A simple report template for basic data display</p>
        <button class="btn btn-primary">Use Template</button>
      </div>
      <div class="template-card">
        <h3>Chart Report</h3>
        <p>Template with charts and visualizations</p>
        <button class="btn btn-primary">Use Template</button>
      </div>
      <div class="template-card">
        <h3>Table Report</h3>
        <p>Tabular data display template</p>
        <button class="btn btn-primary">Use Template</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Template logic here
</script>

<style scoped>
.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.template-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.template-card h3 {
  color: #333;
  margin-bottom: 1rem;
}

.template-card p {
  color: #666;
  margin-bottom: 1.5rem;
}
</style>
