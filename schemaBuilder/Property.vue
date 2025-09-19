<template>
    <div class="schema-editor">
        <h1 class="title">Property</h1>
        <div class="form-container">
            <div class="form-group">
                <label for="columnName" class="form-label">Column Name</label>
                <Field name="columnName" rules="required" as="input" type="text" v-model="schema.property.columnName"
                    id="columnName" class="form-input" />
                <ErrorMessage name="columnName" class="error-message" />
            </div>

            <div class="form-group">
                <label for="type" class="form-label">Data Type</label>
                <Field name="type" rules="required" as="select" v-model="schema.property.type" id="type"
                    class="form-input" @change="handleData()">
                    <option value="" disabled>Select Data Type</option>
                    <option v-for="dataType in DATA_TYPE" :key="dataType.value" :value="dataType.value">{{
                        dataType.label }}</option>
                </Field>
                <ErrorMessage name="type" class="error-message" />
            </div>

            <button type="button" class="submit-btn" @click="delete schema.property">close</button>
        </div>
    </div>
</template>

<script setup>
import { DATA_TYPE } from './constant';
import { defineProps, reactive, watch } from 'vue';
import { ErrorMessage, Field, useForm } from 'vee-validate';

const props = defineProps({
    schema: { type: Object, required: true },
});

const schema = reactive(props.schema);

const { handleSubmit, values, setValues } = useForm({
    initialValues: { columnName: '', type: '' },
});

// Submit handler
const submit = handleSubmit((values) => {
    const targetColumn = Object.keys(schema.property);
    const newColumnName = values.columnName;
    const newColumnValue = { type: values.type };

    if (schema.columns && schema.columns[targetColumn]) {
        delete schema.columns[targetColumn];
        schema.columns[newColumnName] = newColumnValue;
        schema.property = null;
    }
});
const handleData = () => {
    if (values.type === 'Array') {
        const targetColumn = Object.keys(schema.property);
        const newColumnName = values.columnName;
        const newColumnValue = [];

        if (schema.columns && schema.columns[targetColumn]) {
            delete schema.columns[targetColumn];
            schema.columns[newColumnName] = newColumnValue;
            schema.property = null;
        }
    }
}
</script>

<style scoped>
/* Styling for the schema editor */
.schema-editor {
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    max-width: 600px;
    margin: 0 auto;
}

.title {
    text-align: center;
    font-size: 2rem;
    color: #343a40;
}

.schema-content {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.schema-item {
    padding: 8px 0;
    border-bottom: 1px solid #f1f1f1;
}

.schema-item:last-child {
    border-bottom: none;
}

.form-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 15px;
}

.form-label {
    font-size: 1rem;
    color: #343a40;
    margin-bottom: 5px;
}

.form-input {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 5px;
    box-sizing: border-box;
}

.form-input:focus {
    border-color: #007bff;
    outline: none;
}

.submit-btn {
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
}

.submit-btn:hover {
    background-color: #0056b3;
}

.error-message {
    color: #e74c3c;
    font-size: 0.875rem;
    margin-top: 5px;
}
</style>
