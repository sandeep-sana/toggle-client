<template>
    <div class="com">
        <div>
            <Field as="input" type="text" name="name" class="component"></Field>
            <ErrorMessage name="name"></ErrorMessage>
        </div>
        <div class="box">
            <div class="sizing" @mousedown="startDrag">{{ block.size }}</div>
        </div>
    </div>
</template>

<script setup>
import { ErrorMessage, Field } from 'vee-validate';
import { reactive, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    block: { type: Object },
})

const block = reactive(props.block);
let startX = 0;
let isDragging = false;
let startSize = 0;

const startDrag = (event) => {
    isDragging = true;
    startX = event.clientX;
    startSize = block.size;

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
};

const drag = (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - startX;
    const sizeChange = Math.floor(deltaX / 10); // Adjust this value for sensitivity
    const newSize = startSize + sizeChange;

    if (newSize >= 1 && newSize <= 12) { // Set min/max size
        block.size = newSize;
    }
};

const stopDrag = () => {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
};

// Optional: Clean up event listeners on component unmount
onBeforeUnmount(() => {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
});
</script>
<style scoped>
.com {
    position: relative;
}

.component {
    background-color: var(--background-color-two);
    width: 100%;
    border: 1px solid var(--border-color-one);
    border-radius: 10px;
    height: 40px;
    margin-bottom: 10px;
}

.box {
    position: absolute;
    right: -4px;
    top: 25%;
}

.sizing {
    border: 1px solid var(--border-color-one);
    width: 15px;
    height: 15px;
    border-radius: 2px;
    background-color: var(--background-color-three);
    cursor: e-resize;
    font-size: 10px;
    align-items: center;
    text-align: center;
}
</style>