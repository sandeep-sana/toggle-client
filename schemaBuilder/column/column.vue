<template>
    <div class="columnValue-card card shadow-sm" @click="edit">
        <div class="card-body">
            {{ schema.columns[columnIndex].columnName }}
            <template v-if="Array.isArray(columnValue)">
                <div @drop="handleDrop" @dragover="handleDragOver" class="editor-canvas">
                    <div class="schema-content">
                        <div class="w-100" v-for="(subColumnValue, subColumnKey) in columnValue" :key="columnKey">
                            <Column :columnValue="subColumnValue" :columnKey="columnKey" :subColumnKey="subColumnKey"
                                :schema="schema" />
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
    <div class="action-buttons">
        <button @click="remove" class="btn btn-danger remove-btn">
            Remove
        </button>
    </div>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
    schema: { type: Object },
    columnIndex: { type: Number },
    subColumnKey: { type: String },
});

const schema = reactive(props.schema);

// Edit function
const edit = () => {
    if (props.subColumnKey) {
        schema.property = props.columnValue[props.subColumnKey];
    } else {
        schema.property = schema.columns[props.columnIndex];
    }
};

// Remove function (for now, just a placeholder for functionality)
const remove = () => {
    schema.columns.splice(Number(props.columnIndex), 1);
};

// Dragover handler to allow dropping
const handleDragOver = (event) => {
    event.preventDefault();
};

const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const type = event.dataTransfer.getData('type');

    switch (type) {
        case "ADD_FIELD":
            const subColumnValue = `columnValue${Object.keys(props.columnValue || []).length}`;
            const newField = {
                [subColumnValue]: { type: "String" },
            };
            props.columnValue.push(newField);
            break;
        default:
            break;
    }
};

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

/* Edit Button Styling */
.edit-btn {
    background-color: #28a745;
    border: none;
    color: white;
}

.edit-btn:hover {
    background-color: #218838;
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
