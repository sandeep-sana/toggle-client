<template>
    <div class="row">
        <div v-for="(block, blockIndex) in website.blocks" :key="block.id"
            :class="`position-relative col-lg-${block.attribute.size}`">
            <div>
                <component :is="components[block.is]" :block="block" :websiteBuilder="websiteBuilder"
                    :website="website">
                </component>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import Image from './blocks/Image.vue';
import Heading from './blocks/Heading.vue';
import TextInput from './blocks/TextInput.vue';
import Paragraph from './blocks/Paragraph.vue';

const websiteBuilder = reactive({
    isEditMode: false,
});

const props = defineProps({
    website: { type: Object },
})

const components = {
    Image,
    Heading,
    Paragraph,
    TextInput,
};
const website = reactive(props.website);
</script>