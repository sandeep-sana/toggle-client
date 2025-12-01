<!-- Fields.vue -->
<template>
  <div class="card shadow-sm">
    <div class="card-header bg-light fw-semibold">Toolbox</div>
    <div class="card-body p-2">
      <p class="text-muted small mb-3">Drag a block into the canvas</p>

      <div class="d-grid gap-2">
        <button draggable="true" @dragstart="(e)=>start(e,'STRING')" class="btn btn-outline-primary text-start">
          <i class="fa fa-font me-2"></i> Text
        </button>
        <button draggable="true" @dragstart="(e)=>start(e,'NUMBER')" class="btn btn-outline-primary text-start">
          <i class="fa fa-hashtag me-2"></i> Number
        </button>
        <button draggable="true" @dragstart="(e)=>start(e,'DATE')" class="btn btn-outline-primary text-start">
          <i class="fa fa-calendar me-2"></i> Date
        </button>
        <button draggable="true" @dragstart="(e)=>start(e,'BOOLEAN')" class="btn btn-outline-primary text-start">
          <i class="fa fa-toggle-on me-2"></i> Boolean
        </button>
        <button draggable="true" @dragstart="(e)=>start(e,'ARRAY')" class="btn btn-outline-primary text-start">
          <i class="fa fa-list-ul me-2"></i> Array
        </button>
      </div>
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
const start = (e, fieldType) => {
  e.dataTransfer.setData('type', 'ADD_FIELD');
  e.dataTransfer.setData('fieldType', fieldType);
  e.dataTransfer.setData('application/json', JSON.stringify({ kind: 'ADD_FIELD', type: fieldType }));
  e.dataTransfer.effectAllowed = 'copy';
};
</script>
