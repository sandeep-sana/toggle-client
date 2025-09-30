<template>
    <div class="top">
        <Button @click="tools.activeTool = 'FIELDS'" class="col-lg-4">Fields</Button>
        <Button @click="tools.activeTool = 'STATIC'" class="col-lg-4">Static</Button>
        <Button @click="tools.activeTool = 'STRUCTURES'" class="col-lg-4">Structure</Button>
    </div>
    <div class="bottom">
        <div v-for="tool in FORM_BUILDER.TOOLS[tools.activeTool]" class="blocks">
            <div class="block-left">
                <i :class="tool.icon"></i>
            </div>
            <div class="block-right">
                <h3>{{ tool.label }}</h3>
                <p>{{ tool.description }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { FORM_BUILDER } from '../constant';
const tools = reactive({
    activeTool: 'FIELDS',
})
</script>

<style scoped>
.top {}

.top button {
    background-color: var(--background-color-two);
    color: var(--text-color-one);
    border: 1px solid var(--border-color-one);
    padding: 5px 10px;
}

.bottom {
    max-height: calc(100vh - 100px);
    overflow-y: scroll;
}

.blocks {
    border: 1px solid var(--border-color-one);
    background-color: var(--background-color-two);
    border-radius: 10px;
    display: flex;
    margin: 10px 0;
    align-items: center;
    cursor: all-scroll;
}

.block-left {
    border: 1px solid var(--border-color-one);
    padding: 2px 5px;
    margin: 5px;
    border-radius: 5px;
}

.block-right {
    width: 100%;
    text-align: left;
}

.block-right h3 {
    font-size: 16px;
    margin: 0;
}

.block-right p {
    font-size: 10px;
}
</style>