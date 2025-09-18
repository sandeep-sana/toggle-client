<template>
    <div draggable="true" @dragstart="(event) => handleDragStart(event, 'ADD_FIELD')" class="drag-item">
        Add Field
    </div>
</template>

<script setup>

const handleDragStart = (event, type) => {
    event.dataTransfer.setData('type', type);
};
</script>