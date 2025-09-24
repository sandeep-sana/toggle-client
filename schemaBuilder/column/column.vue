<template>
    <div class="columnValue-card card shadow-sm" @click="(event) => edit(event)" v-if="currentCol">
        <div class="card-body">
            {{ currentCol.columnName }}

            <p>-------------</p>
            <template v-if="currentCol.type === 'ARRAY'">
                <div @drop="handleDrop" @dragover="handleDragOver" class="editor-canvas">
                    <div class="schema-content">
                        <div class="w-100" v-for="(subCol, subIndex) in (currentCol.columns || [])"
                            :key="[...path, subIndex].join('-')">
                            <!-- recursive call with extended path -->
                            <Column :schema="schema" :path="[...path, subIndex]" />
                        </div>
                    </div>
                </div>
            </template>
            <p>-------------</p>
        </div>
    </div>

    <div class="action-buttons">
        <button @click="remove" class="btn btn-danger remove-btn">
            Remove
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
defineOptions({ name: 'Column' })

const props = defineProps({
    schema: { type: Object, required: true },
    // e.g. top-level = [columnIndex], nested = [columnIndex, subIndex, ...]
    path: { type: Array, required: true },
})

/** Resolve the current column from schema using the path */
const currentCol = computed(() => {
    let list = props.schema?.columns
    let col = null
    for (const idx of props.path) {
        if (!Array.isArray(list) || idx < 0 || idx >= list.length) return null
        col = list[idx]
        list = col?.columns
    }
    return col
})

/** Remove the current column from its parent list */
const remove = () => {
    if (!props.path.length) return
    const parentPath = props.path.slice(0, -1)
    const idx = props.path[props.path.length - 1]

    let list = props.schema.columns
    for (const i of parentPath) {
        if (!Array.isArray(list) || i < 0 || i >= list.length) return
        const parentCol = list[i]
        list = parentCol.columns
    }
    if (Array.isArray(list) && idx >= 0 && idx < list.length) list.splice(idx, 1)
}

const edit = (event) => {
    event.stopPropagation();
    // whatever you want to do with the selected node
    // e.g., expose it on schema for an editor drawer
    props.schema.property = currentCol.value
}

const handleDragOver = (e) => e.preventDefault()

const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const col = currentCol.value
    if (!col || col.type !== 'ARRAY') return
    const type = e.dataTransfer?.getData('type')
    if (type === 'ADD_FIELD') {
        if (!Array.isArray(col.columns)) col.columns = []
        col.columns.push({
            columnName: 'columnName',
            type: 'STRING',
            default: null,
            enum: [],
        })
    } else if (type === 'ADD_TYPE') {
        if (!Array.isArray(col.columns)) col.columns = []
        col.columns = [{ type: 'STRING', }]
    }
}
</script>

<style scoped>
/* Card-like structure for the columnValue */
.columnValue-card {
    margin: 20px 0;
    border-radius: 8px;
}

/* Header section for the columnValue name */
.card-header {
    background-color: #007bff;
    color: white;
    padding: 10px;
    font-weight: bold;
    border-radius: 8px 8px 0 0;
}

/* Body section for displaying values */
.card-body {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 0 0 8px 8px;
}

/* Display the columnValue's value */
.columnValue-value {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 10px;
}

/* Drag-and-drop area */
.editor-canvas {
    border: 2px dashed #007bff;
    min-height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #e9f7ff;
    border-radius: 8px;
    padding: 20px;
}

.drop-message {
    font-size: 1.1rem;
    color: #007bff;
    font-weight: 600;
    text-align: center;
}

/* Action buttons section */
.action-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.action-buttons button {
    width: 45%;
    padding: 10px;
    font-size: 1rem;
    border-radius: 5px;
    font-weight: bold;
}

/* Remove Button Styling */
.remove-btn {
    background-color: #dc3545;
    border: none;
    color: white;
}

.remove-btn:hover {
    background-color: #c82333;
}
</style>
