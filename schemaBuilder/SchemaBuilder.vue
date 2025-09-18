<template>
    <div class="schema-editor">
        <Fields />
        <Editor :schema="schema" />
        <Property :schema="schema" />
        <pre>{{ schema }}</pre>
    </div>
</template>

<script setup>
import Fields from '../../../schemaBuilder/Fields.vue';
import Editor from '../../../schemaBuilder/Editor.vue';
import Property from '../../../schemaBuilder/Property.vue';

const schema = reactive({
    columns: [{},{
        timestamps: true,
    }],
    property: {},
})


</script>

<style scoped>
/* Basic Styling */
.schema-editor {
    padding: 20px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
}

.draggable-item {
    margin-bottom: 20px;
}

.drag-item {
    cursor: pointer;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    text-align: center;
}

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
