<template>
    <div>
        <h1>Table</h1>

        <form @submit="onSubmit">
            <div class="mb-3">
                <label for="name" class="block font-medium mb-1">Name</label>
                <Field name="name" as="input" type="text" class="form-control border rounded px-3 py-2 w-full" id="name"
                    placeholder="Enter name" rules="required|nospace|min:5" />
                <ErrorMessage name="name" class="text-red-500 text-sm mt-1" />
            </div>
            <button type="button" class="bg-green-500 text-white px-2 py-1 rounded mr-2" @click="addRow">
                ➕
            </button>
            <table>
                <thead>
                    <tr>
                        <th>Sr No</th>
                        <th>Column Name</th>
                        <th>Data Type</th>
                        <th>Default</th>
                        <th>Unique</th>
                        <th>Enum</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(field, fieldIndex) in values.fields" :key="fieldIndex">
                        <td>{{ fieldIndex + 1 }}</td>
                        <td>
                            <Field :name="`fields[${fieldIndex}].columnName`" as="input" type="text"
                                class="form-control" placeholder="Column Name" rules="required|nonumber" />
                            <ErrorMessage :name="`fields[${fieldIndex}].columnName`"
                                class="error-message text-red-500 text-sm" />
                        </td>
                        <td>
                            <Field :name="`fields[${fieldIndex}].dataType`" as="select" class="form-control"
                                rules="required">
                                <option v-for="dataType in MASTER.DATATYPE" :key="dataType.value"
                                    :value="dataType.value">
                                    {{ dataType.label }}
                                </option>
                            </Field>
                            <ErrorMessage :name="`fields[${fieldIndex}].dataType`"
                                class="error-message text-red-500 text-sm" />
                        </td>
                        <td>
                            <Field :name="`fields[${fieldIndex}].default`" as="input" type="text" class="form-control"
                                placeholder="Column Name" rules="nonumber" />
                            <ErrorMessage :name="`fields[${fieldIndex}].default`"
                                class="error-message text-red-500 text-sm" />
                        </td>
                        <td>
                            <Field :name="`fields[${fieldIndex}].unique`" as="select" class="form-control" rules="">
                                <option v-for="dataType in MASTER.UNIQUE" :key="dataType.value" :value="dataType.value">
                                    {{ dataType.label }}
                                </option>
                            </Field>
                            <ErrorMessage :name="`fields[${fieldIndex}].unique`"
                                class="error-message text-red-500 text-sm" />
                        </td>
                        <td>
                            <Field :name="`fields[${fieldIndex}].enum`" v-slot="{ value, handleChange, errorMessage }">
                                <Multiselect :model-value="value" @update:model-value="handleChange" :options="[]"
                                    :multiple="true" :close-on-select="false" placeholder="Pick some" :taggable="true"
                                    @tag="newTag => addTag(fieldIndex, newTag)" />
                                <span v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</span>
                            </Field>
                        </td>





                        <td>
                            <button v-if="values.fields.length > 1" type="button"
                                class="bg-red-500 text-white px-2 py-1 rounded" @click="removeRow(fieldIndex)">
                                ❌
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded mt-4" :disabled="isSubmitting">
                Save
            </button>
        </form>
    </div>
</template>

<script setup>
import STATUS from "~~/status";
import api from "~~/api.config";
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import Multiselect from "vue-multiselect";
import { MASTER } from "../../../constant/master";
import { Field, ErrorMessage, useForm } from "vee-validate";

const route = useRoute();
const config = useRuntimeConfig();
const _id = computed(() => route.params._id);

// Default field template
const defaultField = {
    columnName: "",
    dataType: "String",
    unique: null,
    enum: [],
};

// Vee-Validate form setup
const { handleSubmit, isSubmitting, setValues, values } = useForm({
    initialValues: {
        name: "",
        fields: [defaultField],
    },
});

const addRow = () => {
    setValues({
        ...values,
        fields: [...(values.fields || []), { ...defaultField }],
    });
};

const removeRow = (index) => {
    setValues({
        ...values,
        fields: values.fields.filter((_, i) => i !== index),
    });
};


// Init API data
const init = async () => {
    try {
        const response = await api.get(
            `${config.public.API}/master/fetch/${_id.value}`
        );
        if (response.status === STATUS.OK) {
            setValues({
                ...response.data.master,
                fields: response.data.master.fields?.length
                    ? response.data.master.fields
                    : [defaultField],
            });
        }
    } catch (error) {
        console.log(error);
    }
};
onMounted(init);

// Submit
const onSubmit = handleSubmit(async (values) => {
    try {
        const response = await api.post(
            `${config.public.API}/master/update/${_id.value}`,
            {
                projection: JSON.stringify(values),
            }
        );
        if (response.status === STATUS.OK) {
            console.log("Saved successfully:", response.data);
            setValues(values);
        }
    } catch (error) {
        console.error(error);
    }
});

const addTag = (rowIndex, newTag) => {
    const updatedFields = [...values.fields];
    if (!Array.isArray(updatedFields[rowIndex].enum)) {
        updatedFields[rowIndex].enum = [];
    }
    updatedFields[rowIndex].enum = [...updatedFields[rowIndex].enum, newTag];
    setValues({
        ...values,
        fields: updatedFields,
    });
};


</script>
