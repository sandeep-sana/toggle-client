<template>
    <div class="com" @mouseover="(event) => $onMouseover(event, block)"
        @mouseout="(event) => $onMouseout(event, block, form)" :id="block.id">
        <div>
            <div class="head">
                <div>
                    <label for="name">{{ block.attribute.label }}</label>
                </div>
                <div>
                    <i class="ri-close-fill" @click="onDelete(block.id)"></i>
                </div>
            </div>
            <!-- <Field as="input" type="img" name="name" class="component" :disabled="formBuilder.isEditMode"></Field> -->
            <img name="name" :src="block.attribute.src" alt="Image" :disabled="formBuilder.isEditMode" />
            <ErrorMessage name="name"></ErrorMessage>
        </div>
        <div class="box">
            <div class="sizing" @mousedown="startDrag">{{ block.size }}</div>
        </div>
    </div>
</template>

<script setup>
// Remove this line
// import { type } from 'os';

import { ErrorMessage, Field } from 'vee-validate';
import { reactive, onMounted, onBeforeUnmount } from 'vue';

const { $onMouseover, $onMouseout, $speak, $onDragleave, $onDrop } = useNuxtApp();

const props = defineProps({
    block: { type: Object },
    formBuilder: { type: Object },
    form: { type: Object },
})

const block = reactive(props.block);
const form = reactive(props.form);
// const formBuilder = reactive(props.formBuilder);

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
        $speak(`${block.label} size ${newSize}`);
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

const onDelete = (id) => {
    form.blocks = form.blocks.filter(b => b.id != id);
    $speak(`${block.label} deleted`);
}
</script>
<style scoped>
.head {
    display: flex;
    justify-content: space-between;
}
.head i{
    z-index: 30;
    position: relative;
}

.head i:hover {
    background-color: var(--background-color-three);
}

.com {
    position: relative;
    cursor: pointer;
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
    top: 50%;
    z-index: 30;
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