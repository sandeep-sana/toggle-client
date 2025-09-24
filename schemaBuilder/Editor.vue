<template>
  <div class="editor-container">
    <div @drop="handleDrop" @dragover="handleDragOver" class="editor-canvas">
      <p>-----------</p>
      <div class="schema-content">
        <div class="w-100" v-for="(col, columnIndex) in (schema.columns || [])" :key="col.id ?? columnIndex">
          <!-- Top-level Column -->
          <Column :schema="schema" :path="[columnIndex]" />
        </div>
      </div>
      <p>-------------</p>
    </div>
  </div>
</template>

<script setup>
import { toRef } from 'vue'
import Column from './column/column.vue';

const props = defineProps({
  schema: { type: Object, required: true },
})
// keep reactivity to the incoming object
const { $toast } = useNuxtApp();
const schema = toRef(props, 'schema')

const handleDrop = (event) => {
  event.preventDefault()
  const type = event.dataTransfer?.getData('type')
  console.log(type)

  switch (type) {
    case 'ADD_FIELD': {
      if (!Array.isArray(schema.value.columns)) schema.value.columns = []
      schema.value.columns.push(
        {
          columnName: 'columnName',
          type: 'STRING',
          default: null,
          enum: [],
        }
      )
      break
    }
    case 'ADD_TYPE': {
      // if (!Array.isArray(schema.value.columns)) schema.value.columns = []
      // schema.value.columns.push(ADD_TYPE)
      // break
      $toast.info('Sorry you can not drop here')
    }
    default:
      break
  }
  event.dataTransfer.setData('type', null);
}

const handleDragOver = (event) => {
  event.preventDefault()
}
</script>

<style scoped>
/* (styles unchanged) */
.editor-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.editor-canvas {
  border: 3px dashed #007bff;
  min-height: 200px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #f0f9ff;
  border-radius: 8px;
  transition: background-color 0.3s ease-in-out;
  cursor: pointer;
}

.editor-canvas:hover {
  background-color: #e1f4ff;
}

.schema-content {
  margin-top: 15px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  overflow-y: auto;
  max-height: 400px;
}
</style>
