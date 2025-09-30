<template>
    <div class="form-builder">
        <div class="left col-lg-2">
            <div class="block">
                <Tools />
            </div>
        </div>
        <div class="right col-lg-7"></div>
        <div class="property col-lg-3"></div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import Tools from './tools/Tools.vue';

const props = defineProps({
    form: { type: Object },
})

const form = reactive()

</script>

<style scoped>
.form-builder {
    display: flex;
}

.left {}

.block {}

.property {}

.right {}
</style>