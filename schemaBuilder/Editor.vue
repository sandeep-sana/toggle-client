<template>
    <div @drop="(event) => handleDrop(event)" @dragover="handleDragOver" class="editor-canvas">
        drop here
        <div class="schema-content">
            <div v-for="(columnValue, columnKey) in schema.columns[0]" :key="columnKey">
                <column :columnKey="columnKey" :columnValue="columnValue" :schema="schema"></column>
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
            const column = `column${Object.keys(schema.columns[0]).length}`;
            const newField = {
                [column]: { type: "String" },
            };
            schema.columns[0] = { ...schema.columns[0], ...newField };
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
/* Basic Styling */
.editor-canvas {
    border: 2px dashed #007bff;
    min-height: 150px;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.schema-content {
    margin-top: 10px;
}

pre {
    background-color: #f4f4f4;
    padding: 10px;
    border-radius: 5px;
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>
