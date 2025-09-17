<template>
  <div class="container my-5">
    <!-- Page Title -->
    <h1 class="text-center text-primary mb-4">Table Configuration</h1>

        <form @submit="onSubmit">
            <div class="mb-3">
                <label for="name" class="block font-medium mb-1">Name</label>
                <Field name="name" as="input" type="text" class="form-control border rounded px-3 py-2 w-full" id="name"
                    placeholder="Enter name" rules="required|nospace|min:5" />
                <ErrorMessage name="name" class="text-red-500 text-sm mt-1" />
            </div>
            <button type="button" class="bg-green-500 text-white px-2 py-1 rounded mr-2" @click="addRow">➕</button>
            <button type="button" class="bg-green-500 text-white px-2 py-1 rounded mr-2" @click="addRow('createdAt')">CreatedAt</button>
            <button type="button" class="bg-green-500 text-white px-2 py-1 rounded mr-2" @click="addRow('updatedAt')">UpdatedAt</button>
            <table>
                <thead>
                    <tr>
                        <th>Sr No</th>
                        <th>Column Name</th>
                        <th>Data Type</th>
                        <th>Default</th>
                        <th>Unique</th>
                        <th>Enum</th>
                        <th>Validation</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Depended Master</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(field, fieldIndex) in values.fields" :key="fieldIndex">
                        <td>{{ fieldIndex + 1 }}</td>
                        <td>
                            <Field :name="`fields[${fieldIndex}].columnName`" as="input" type="text"
                                class="form-control" placeholder="Column Name" rules="required|nonumber" :disabled="['createdAt', 'updatedAt'].includes(values.fields[fieldIndex].columnName)" />
                            <ErrorMessage :name="`fields[${fieldIndex}].columnName`"
                                class="error-message text-red-500 text-sm" />
                        </td>
                        <td>
                            <Field :name="`fields[${fieldIndex}].dataType`" as="select" class="form-control"
                                rules="required" @change="manageDataType(fieldIndex)">
                                <option v-for="dataType in MASTER.DATATYPE" :key="dataType.value"
                                    :value="dataType.value">
                                    {{ dataType.label }}
                                </option>
                            </Field>
                            <ErrorMessage :name="`fields[${fieldIndex}].dataType`"
                                class="error-message text-red-500 text-sm" />
                        </td>
                        <td v-if="values.fields[fieldIndex].dataType === DATA_TYPE.BOOLEAN">
                            <Field :name="`fields[${fieldIndex}].default`" as="select" class="form-control">
                                <option v-for="dataType in MASTER.BOOLEAN" :key="dataType.value"
                                    :value="dataType.value">
                                    {{ dataType.label }}
                                </option>
                            </Field>
                            <ErrorMessage :name="`fields[${fieldIndex}].default`"
                                class="error-message text-red-500 text-sm" />
                        </td>
                        <td v-else>
                            <Field :name="`fields[${fieldIndex}].default`" as="input" type="text" class="form-control"
                                placeholder="Column Name" rules="nonumber" @change="manageDefault(fieldIndex)" />
                            <ErrorMessage :name="`fields[${fieldIndex}].default`"
                                class="error-message text-red-500 text-sm" />
                        </td>
                        <td>
                            <Field :name="`fields[${fieldIndex}].unique`" as="select" class="form-control" rules="" :disabled="values.fields[fieldIndex].default != null">
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
                                    @tag="newTag => addTag(fieldIndex, newTag)" @remove="manageEnum(fieldIndex)" />
                                <span v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</span>
                            </Field>
                        </td>
                        <td>
                            <Field :name="`fields[${fieldIndex}].validation`" v-slot="{ value, handleChange, errorMessage }">
                                <Multiselect :model-value="value" @update:model-value="handleChange" :options="MASTER.VALIDATION"
                                    :multiple="true" :close-on-select="false" placeholder="Pick some" :taggable="true"
                                    />
                                <span v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</span>
                            </Field>
                        </td>
                        <td v-if="values.fields[fieldIndex].validation && values.fields[fieldIndex].validation.length && values.fields[fieldIndex].validation.includes('min')">
                            <Field :name="`fields[${fieldIndex}].min`" as="input" type="number" class="form-control"
                                placeholder="Column Name" />
                            <ErrorMessage :name="`fields[${fieldIndex}].min`"
                                class="error-message text-red-500 text-sm" />
                        </td>
                        <td v-else>----</td>
                        <td v-if="values.fields[fieldIndex].validation && values.fields[fieldIndex].validation.length && values.fields[fieldIndex].validation.includes('max')">
                            <Field :name="`fields[${fieldIndex}].max`" as="input" type="number" class="form-control"
                                placeholder="Column Name" />
                            <ErrorMessage :name="`fields[${fieldIndex}].max`"
                                class="error-message text-red-500 text-sm" />
                        </td>
                        <td v-else>----</td>
                        <td>
                            <Field :name="`fields[${fieldIndex}].ref`" as="select" class="form-control" rules="">
                                <option value="">No Master</option>
                                <option v-for="master in values.dependedMasters" :key="master" :value="master">
                                    {{ master }}
                                </option>
                            </Field>
                            <ErrorMessage :name="`fields[${fieldIndex}].ref`"
                                class="error-message text-red-500 text-sm" />
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
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Multiselect from "vue-multiselect";
import { DATA_TYPE, MASTER } from "../../../constant/master";
import { Field, ErrorMessage, useForm } from "vee-validate";
import api from "~~/api.config";
import STATUS from "~~/status";
import { MASTER } from "../../../constant/master";

const route = useRoute();
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();
const _id = computed(() => route.params._id);

// Default field template
const defaultField = {
    columnName: "",
    dataType: "String",
    unique: null,
    enum: [],
    ref: null,
    min: null,
    max: null,
};

// Form setup with vee-validate
const { handleSubmit, isSubmitting, setValues, values } = useForm({
  initialValues: {
    name: "",
    fields: [defaultField],
  },
});

const addRow = (columnName=null) => {
    setValues({
        ...values,
        fields: [{ ...defaultField, columnName: columnName }, ...(values.fields || [])],
    });
};

// Remove Row
const removeRow = (index) => {
  setValues({
    ...values,
    fields: values.fields.filter((_, i) => i !== index),
  });
};

// API Data Initialization
const init = async () => {
    try {
        const response = await api.get(
            `${config.public.API}/master/fetch/${_id.value}`
        );
        if (response.status === STATUS.OK) {
            setValues({
                ...response.data.master,
                fields: JSON.parse(JSON.stringify(response.data.master.fields)),
            });
        }
    } catch (error) {
        console.log(error);
    }
};
const initMasters = async () => {
    try {
        const response = await api.get(`${config.public.API}/master/fetchs`);
        if (response.status === STATUS.OK) {
            console.log(response)
            setValues({
                ...values,
                dependedMasters: response.data.masters?.length
                    ? response.data.masters
                        .filter(master => master._id !== _id.value)  // Fix the filter condition
                        .map(master => master.name)                  // Map to get only names
                    : [],
            });

        }
    } catch (error) {
        console.log(error);
    }
};
onMounted(async () => {
    await init();
    await initMasters();
    addRow();
    removeRow(0);
});

// Submit Form
const onSubmit = handleSubmit(async (values) => {
    try {

        const response = await api.post(
            `${config.public.API}/master/update/${_id.value}`,
            {
                projection: JSON.stringify(values),
            }
        );
        if (response.status === STATUS.CREATED) {
            $toast.success(response.data.message);
            setValues(values);
        }
    } catch (error) {
        console.error(error);
    }
});

// Add Tag to Enum
const addTag = (rowIndex, newTag) => {
    const updatedFields = [...values.fields];
    if (!Array.isArray(updatedFields[rowIndex].enum)) {
        updatedFields[rowIndex].enum = [];
    }
    const defaultType = values.fields[rowIndex].default;
    if (defaultType) {
        updatedFields[rowIndex].enum = [...updatedFields[rowIndex].enum, defaultType];
    }
    updatedFields[rowIndex].enum = [...updatedFields[rowIndex].enum, newTag];
    setValues({
        ...values,
        fields: updatedFields,
    });
};

const manageDefault = (fieldIndex) => {
    if (fieldIndex >= 0) {
        const defaultType = values.fields[fieldIndex].default;
        const enumType = values.fields[fieldIndex].enum;
        if (enumType.length && defaultType) {
            const updatedFields = [...values.fields];
            if (!Array.isArray(updatedFields[fieldIndex].enum)) {
                updatedFields[fieldIndex].enum = [];
            }
            updatedFields[fieldIndex].enum = [...updatedFields[fieldIndex].enum, defaultType];
            setValues({
                ...values,
                fields: updatedFields,
            });
        }
    }
}

const manageEnum = (fieldIndex) => {
    if (fieldIndex >= 0) {
        const defaultType = values.fields[fieldIndex].default;
        const enumType = values.fields[fieldIndex].enum;
        if (defaultType) {
            const type = enumType.includes(defaultType);
            if (!type) {
                const updatedFields = [...values.fields];
                if (!Array.isArray(updatedFields[fieldIndex].enum)) {
                    updatedFields[fieldIndex].enum = [];
                }
                updatedFields[fieldIndex].enum = [...updatedFields[fieldIndex].enum, defaultType];
                setValues({
                    ...values,
                    fields: updatedFields,
                });
            }
        }
    }
}
const manageDataType = (fieldIndex) => {
    const dataType = values.fields[fieldIndex].dataType;
    const updatedFields = [...values.fields];
    if (dataType === DATA_TYPE.BOOLEAN) {
        updatedFields[fieldIndex].default = false;
       updatedFields[fieldIndex].unique = 'false';
    }else{
        updatedFields[fieldIndex].default = null;
    }
    setValues({
        ...values,
        fields: updatedFields,
    });
}

</script>

<style scoped>
/* Global Container */
.container {
  max-width: 900px;
  margin: auto;
  padding: 30px;
}

/* Form Styling */
.form-control {
  border-radius: 4px;
  padding: 8px 10px;
}

button {
  transition: all 0.3s ease;
}

button:hover {
  opacity: 0.9;
}

/* Table Styling */
.table {
  width: 100%;
  margin-top: 20px;
}

.table td, .table th {
  vertical-align: middle;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.table td {
  padding: 8px;
}

/* Button Styling */
.btn-outline-success {
  font-size: 14px;
}

.text-center {
  text-align: center;
}

/* Error Styling */
.text-danger {
  font-size: 12px;
  font-weight: 400;
}
</style>
