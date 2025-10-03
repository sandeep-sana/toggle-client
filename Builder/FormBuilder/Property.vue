<template>
    {{ form.property }}
    <div class="property">
        <label for="name">Lable</label>
        <Field class="field" as="input" type="text" v-model="form.property.label"></Field>
        <ErrorMessage name="name"></ErrorMessage>
    </div>
    <div class="property">
        <label for="name">Size</label>
        <Field class="field" as="select" v-model="form.property.size">
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

.property label{
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