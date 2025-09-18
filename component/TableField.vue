<template>
    <template v-if="field.enum.length">
        <Field :name="`${field.columnName}`" as="select" :placeholder="field.columnName"
            :rules="handleValidation(field)">
            <option value="">Please Select</option>
            <option v-for="option in field.enum" :value="option">{{ option }}
            </option>
        </Field>
    </template>
    <template v-else-if="tableField.options.length">
        <Field :name="`${field.columnName}`" as="select" :placeholder="field.columnName"
            :rules="handleValidation(field)">
            <option value=""></option>
            <option v-for="option in tableField.options" :value="option._id">{{ option[tableField.field.columnName] }}
            </option>
        </Field>
    </template>
    <template v-else>
        <Field :name="`${field.columnName}`" as="input" type="text" :placeholder="field.columnName"
            :rules="handleValidation(field)" />
    </template>
    <ErrorMessage :name="`${field.columnName}`" />
</template>

<script setup>
import { ErrorMessage, Field } from 'vee-validate';
import { defineProps, onMounted, computed, ref } from 'vue';
import api from '~~/api.config';
import STATUS from '~~/status';
import { handleValidation } from '../common/common';

const route = useRoute();
const props = defineProps({
    field: { type: Object }
});
const tableReactive = ref({
    masterBindingRule: null,
});
const tableField = reactive({
    options: [],
    field: {},
})
const config = useRuntimeConfig();
const _id = computed(() => route.params._id);


const getDropDown = async (rule) => {
    try {
        const response = await api.get(`${config.public.API}/dynamicMaster/fetchs/${rule.inputData}`);
        if (response.status === STATUS.OK) {
            console.log(response);
            tableField.options = response.data.dynamicMasters;
        }
    } catch (error) {
        console.log(error);
    }
}

const getSchemaField = async (rule) => {
    try {
        const query = {
            'fields._id': rule.outputExpression,
        }
        const projection = { "fields.$": 1 }
        const response = await api.get(`${config.public.API}/master/fetch/${rule.inputData}`, {
            params: {
                query: JSON.stringify(query),
                projection: JSON.stringify(projection),
            }
        });
        if (response.status === STATUS.OK) {
            console.log(response)
            tableField.field = response.data.master.fields[0];
        }
        // if(response)

    } catch (error) {
        console.log(error);
    }
}

const ruleSelection = async (rule) => {
    console.log(rule);
    switch (rule.ruleMapping) {
        case "DROP_DOWN":
            await getDropDown(rule);
            await getSchemaField(rule);
            break;

        default:
            break;
    }
}

const init = async () => {
    try {
        const query = {
            "rules.inputExpression": props.field._id
        }
        const projection = { "rules.$": 1 }
        const response = await api.get(`${config.public.API}/masterBindingRule/fetch/${_id.value}`, {
            params: {
                query: JSON.stringify(query),
                projection: JSON.stringify(projection),
            }
        });
        if (response.status === STATUS.OK) {
            if (response.data.masterBindingRule) {
                await ruleSelection(response.data.masterBindingRule.rules[0])
            }

        }
    } catch (error) {
        console.error(error);
    }
}

onMounted(async () => {
    await init();
});
</script>
