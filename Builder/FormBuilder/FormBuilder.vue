<template>
    <div class="form-builder">
        <div class="left col-lg-2">
            <div class="block">
                <Tools />
            </div>
        </div>
        <div class="editor-container" @dragover="(event) => $onDragover(event)"
            @dragleave="(event) => $onDragleave(event)" @drop="(event) => $onDrop(event, form)">
            <div class="row">
                <div v-for="block in form.blocks" :key="block.id" :class="`col-lg-${block.size}`">
                    <component :is="components[block.is]" :block="block"></component>
                </div>
            </div>
        </div>
        <div class="property col-lg-3"></div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import Tools from './tools/Tools.vue';
import TextInput from './blocks/TextInput.vue';

const { $onMouseover, $onMouseout, $onDragover, $onDragleave, $onDrop } = useNuxtApp();

const props = defineProps({
    form: { type: Object },
})

const components = { TextInput };

const form = reactive(props.form);

</script>

<style scoped>
.form-builder {
    display: flex;
}

.left {}

.block {}

.property {}

.editor-container {
    flex-basis: 70%;
    border: 1px solid var(--border-color-one);
    border-radius: 10px;
    cursor: crosshair;
    padding: 10px;
}

.element {
    margin: 10px;
}
</style>