<template>
    <div class="editor-container">
        <div @drop="(event) => handleDrop(event)" @dragover="handleDragOver" class="editor-canvas">
            <div class="schema-content">
                <div class="w-100" v-for="(column, columnIndex) in schema.columns" :key="columnIndex">
                    <column :columnIndex="columnIndex" :schema="schema" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, reactive } from 'vue';
import column from './column/column.vue';

const props = defineProps({
    schema: { type: Object, required: true },
});
const schema = reactive(props.schema);

const handleDrop = (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('type');

    switch (type) {
        case "ADD_FIELD":
            const id = `${schema.columns.length}`;
            schema.columns.push({
                columnName: "columnName",
                id: id,
                type: "STRING",
            })
            break;
        default:
            break;
    }
};

// Handle the dragover event (necessary to allow drop)
const handleDragOver = (event) => {
    event.preventDefault();
};
</script>

<style scoped>
/* Editor Container */
.editor-container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Drop Area */
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

/* Drop area hover effect */
.editor-canvas:hover {
    background-color: #e1f4ff;
}

/* Drop message */
.drop-message {
    font-size: 1.25rem;
    font-weight: 600;
    color: #007bff;
    text-align: center;
    margin-bottom: 15px;
}

/* Schema Content */
.schema-content {
    margin-top: 15px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

/* Schema Column styling */
.schema-content .column {
    padding: 12px;
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex: 1;
    min-width: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* Hover effect on column */
.schema-content .column:hover {
    background-color: #f1faff;
    border-color: #007bff;
}

/* Scrollable schema content */
.schema-content {
    overflow-y: auto;
    max-height: 400px;
}

/* Additional styling */
pre {
    background-color: #f4f4f4;
    padding: 15px;
    border-radius: 8px;
    white-space: pre-wrap;
    word-wrap: break-word;
}

button {
    padding: 10px 15px;
    background-color: #007bff;
    color: #fff;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}
</style>
