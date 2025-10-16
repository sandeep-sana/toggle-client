<template>

    <!-- Label -->
    <div class="property">
        <label for="name">Label</label>
        <Field class="field" as="input" type="text" v-model="form.attribute.label"></Field>
        <ErrorMessage name="name"></ErrorMessage>
    </div>

    <!-- Size -->
    <div class="property">
        <label for="name">Size</label>
        <Field class="field" as="select" v-model="form.attribute.size">
            <option :value="1">1</option>
            <option :value="2">2</option>
            <option :value="3">3</option>
            <option :value="4">4</option>
            <option :value="5">5</option>
            <option :value="6">6</option>
            <option :value="7">7</option>
            <option :value="8">8</option>
            <option :value="9">9</option>
            <option :value="10">10</option>
            <option :value="11">11</option>
            <option :value="12">12</option>
        </Field>
        <ErrorMessage name="name"></ErrorMessage>
    </div>

    <!-- headingType -->
    <div v-if="form.attribute.headingType" class="property">
        <label for="name">Heading Type</label>
        <Field class="field" as="select" v-model="form.attribute.headingType">
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
            <option value="h4">H4</option>
            <option value="h5">H5</option>
            <option value="h6">H6</option>
        </Field>
        <ErrorMessage name="name"></ErrorMessage>
    </div>
    <!-- Text Align -->
    <div class="property">
        <label for="name">Text Align</label>
        <Field class="field" as="select" v-model="form.style.textAlign">
            <option value="center">Center</option>
            <option value="right">right</option>
            <option value="left">left</option>
            <option value="justify">justify</option>
        </Field>
        <ErrorMessage name="name"></ErrorMessage>
    </div>
</template>

<script setup>
import { ErrorMessage, Field } from 'vee-validate';

const props = defineProps({
    form: { type: Object },
})
</script>

<style scoped>
.property {
    padding: 10px;
    color: var(--text-color-one);
    display: flex;
    align-items: center;
}

.property label {
    width: 20%;
}

.property .field {
    border: 1px solid var(--border-color-one);
    border-radius: 10px;
    color: var(--text-color-one);
    background-color: var(--background-color-two);
    padding: 10px;
    width: 80%;
}
</style>