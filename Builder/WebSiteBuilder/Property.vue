<template>

    <!-- Label -->
    <div class="property">
        <label for="label">Label</label>
        <Field class="field" as="input" type="text" v-model="form.attribute.label"></Field>
        <ErrorMessage name="name"></ErrorMessage>
    </div>

    <!-- Size -->
    <div class="property">
        <label for="size">Size</label>
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
        <label for="headingType">Heading Type</label>
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
        <label for="textAlign">Text Align</label>
        <Field class="field" as="select" v-model="form.style.textAlign">
            <option value="center">Center</option>
            <option value="right">right</option>
            <option value="left">left</option>
            <option value="justify">justify</option>
        </Field>
        <ErrorMessage name="name"></ErrorMessage>
    </div>

    <!-- Font Weight -->
    <div class="property">
        <label for="fontWeight">Font Weight</label>
        <Field class="field" as="select" v-model="form.style.fontWeight">
            <option :value="100">100</option>
            <option :value="200">200</option>
            <option :value="300">300</option>
            <option :value="400">400</option>
            <option :value="500">500</option>
            <option :value="600">600</option>
            <option :value="700">700</option>
            <option :value="800">800</option>
            <option :value="900">900</option>
            <option value="normal">normal</option>
            <option value="bold">bold</option>
            <option value="bolder">bolder</option>
            <option value="lighter">lighter</option>
        </Field>
        <ErrorMessage name="name"></ErrorMessage>
    </div>

    <!-- Margin Left -->
    <div class="property">
        <label for="marginLeft">Margin Left</label>
        <Field class="field" as="input" type="number" v-model="form.style.marginLeftValue"></Field>
        <ErrorMessage name="marginLeft"></ErrorMessage>
        <select v-model="form.style.marginLeftUnit" class="unit-select">
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
            <option value="percentage">percentage</option>
            <option value="auto">auto</option>
            <option value="inherit">inherit</option>
        </select>
    </div>

    <!-- Margin Right -->
    <div class="property">
        <label for="marginRight">Margin Right</label>
        <Field class="field" as="input" type="number" v-model="form.style.marginRightValue"></Field>
        <ErrorMessage name="marginRight"></ErrorMessage>
        <select v-model="form.style.marginRightUnit" class="unit-select">
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
            <option value="percentage">percentage</option>
            <option value="auto">auto</option>
            <option value="inherit">inherit</option>
        </select>
    </div>

    <!-- Margin Top -->
    <div class="property">
        <label for="marginTop">Margin Top</label>
        <Field class="field" as="input" type="number" v-model="form.style.marginTopValue"></Field>
        <ErrorMessage name="marginTop"></ErrorMessage>
        <select v-model="form.style.marginTopUnit" class="unit-select">
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
            <option value="percentage">percentage</option>
            <option value="auto">auto</option>
            <option value="inherit">inherit</option>
        </select>
    </div>

    <!-- Margin Bottom -->
    <div class="property">
        <label for="marginBottom">Margin Bottom</label>
        <Field class="field" as="input" type="number" v-model="form.style.marginBottomValue"></Field>
        <ErrorMessage name="marginBottom"></ErrorMessage>
        <select v-model="form.style.marginBottomUnit" class="unit-select">
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
            <option value="percentage">percentage</option>
            <option value="auto">auto</option>
            <option value="inherit">inherit</option>
        </select>
    </div>

</template>

<script setup>
import { ErrorMessage, Field } from 'vee-validate';

const props = defineProps({
    form: { type: Object },
})

const form =  reactive(props.form);

form.style.marginLeft = computed(() => { return form.style.marginLeftValue + form.style.marginLeftUnit});
form.style.marginRight = computed(() => { return form.style.marginRightValue + form.style.marginRightUnit});
form.style.marginTop = computed(() => { return form.style.marginTopValue + form.style.marginTopUnit});
form.style.marginBottom = computed(() => { return form.style.marginBottomValue + form.style.marginBottomUnit});
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