<template>
  <div class="drag-container">
    <div 
      draggable="true" 
      @dragstart="(event) => handleDragStart(event, 'ADD_FIELD')" 
      class="drag-item">
      Add Column
    </div>
    <div 
      draggable="true" 
      @dragstart="(event) => handleDragStart(event, 'ADD_TYPE')" 
      class="drag-item">
      Add Type
    </div>
  </div>
</template>

<script setup>
const handleDragStart = (event, type) => {
    event.dataTransfer.setData('type', type);
};
</script>

<style scoped>
/* Container for all drag items */
.drag-container {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Space between drag items */
  max-width: 250px; /* Optional: set a max width for the drag container */
  margin: 0 auto; /* Center the container */
}

/* Styling for individual drag items */
.drag-item {
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer; /* Hand cursor to indicate draggable item */
  transition: background-color 0.3s ease;
  text-align: center;
}

/* Hover effect for drag items */
.drag-item:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

/* Styling for when dragging starts */
.drag-item:active {
  background-color: #004085; /* Even darker blue when item is being dragged */
}
</style>
