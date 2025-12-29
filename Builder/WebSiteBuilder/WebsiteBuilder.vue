<template>
    <div class="flex-wrap d-flex">
        <div class="border col-12 h-40"></div>
        <div class="border col-2 h-200 p-2">
            <Tools />
        </div>
        <div class="border col-8" @dragover="(event) => $onDragover(event)" @drop="(event) => $onDrop(event, website)">
            <div v-for="(block, blockIndex) in website.blocks" @click="onProperty(block)">

                <div v-tippy="`${block.attribute.label}`" :class="block.id == property.id ? 'active-border' : 'border'">
                    <component :is="components[block.is]" :block="block">
                    </component>
                </div>
            </div>
        </div>
        <div class="border col-2">
            <Property v-if="property.id" :property="property" />
        </div>
    </div>

</template>

<script setup>
import Tools from './tools/Tools.vue';
import Property from './Property.vue';
import ColumnOne from './blocks/ColumnOne.vue';
import { reactive } from 'vue';

const props = defineProps({
    website: { type: Object },
})
const website = reactive(props.website);
const property = reactive({});

const components = {
    ColumnOne,
};

const onProperty = (block) => {
    property.id = block.id;
    property.style = block.style;
    property.attribute = block.attribute;
}

</script>

<style scoped>
.border {
    border: 1px solid var(--border-color-one);
}

.active-border {
    background-color: var(--background-color-two);
    color: var(--text-color-one);
    border: 1px solid green;
    border-radius: 10px;
    padding: 5px 10px;
}

.h-40 {
    height: 40px;
}

.h-200 {
    height: 800px;
}
</style>