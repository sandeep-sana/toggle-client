<template>
    <h1>{{ table.master.name }}</h1>
    <button type="button" @click="addList">Add {{ table.master.name }}</button>
    <table>
        <thead>
            <tr>
                <th v-for="field in table.master.fields" :key="field.columnName">
                    {{ field.columnName }}
                </th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(list, listIndex) in lists" :key="listIndex">
                <td v-for="field in table.master.fields" :key="field.columnName">
                    <!-- when string -->
                    <template v-if="field.dataType === DATA_TYPE.STRING">
                        <!-- case one: enum dropdown -->
                        <template v-if="field.enum && field.enum.length">
                            <template v-if="disabledId === list._id">
                                <Field :name="`${updateList}.${field.columnName}`" as="select" class="form-control"
                                    v-model="updateList[field.columnName]">
                                    <option v-for="e in field.enum" :key="e" :value="e">{{ e }}</option>
                                </Field>
                                <ErrorMessage :name="`${updateList}.${field.columnName}`" class="error-message" />
                            </template>
                            <template v-else>
                                <Field :name="`${listIndex}.${field.columnName}`" as="select" class="form-control"
                                    v-model="list[field.columnName]" disabled>
                                    <option v-for="e in field.enum" :key="e" :value="e">{{ e }}</option>
                                </Field>
                                <ErrorMessage :name="`${listIndex}.${field.columnName}`" class="error-message" />
                            </template>
                        </template>
                        <!-- case two: plain string input -->
                        <template v-else>
                            <template v-if="disabledId === list._id">
                                <Field :name="`${updateList}.${field.columnName}`" as="input" class="form-control"
                                    v-model="updateList[field.columnName]">
                                </Field>
                                <ErrorMessage :name="`${updateList}.${field.columnName}`" class="error-message" />
                            </template>
                            <template v-else>
                                <Field :name="`${listIndex}.${field.columnName}`" as="input" class="form-control"
                                    v-model="list[field.columnName]" disabled>
                                </Field>
                                <ErrorMessage :name="`${listIndex}.${field.columnName}`" class="error-message" />
                            </template>
                        </template>
                    </template>

                    <!-- when boolean -->
                    <template v-else-if="field.dataType === DATA_TYPE.BOOLEAN">
                        <Field :name="`${listIndex}.${field.columnName}`" type="checkbox"
                            v-model="list[field.columnName]" :disabled="disabledId != list._id" />
                    </template>

                    <!-- when number -->
                    <template v-else-if="field.dataType === DATA_TYPE.NUMBER">
                        <Field :name="`${listIndex}.${field.columnName}`" as="input" type="number" class="form-control"
                            v-model="list[field.columnName]" :disabled="disabledId != list._id" />
                    </template>
                    <template v-else-if="field.dataType === DATA_TYPE.DATE">
                        <VueDatePicker v-model="list[field.columnName]" :enable-time-picker="false"
                            format="yyyy-MM-dd" auto-apply />
                    </template>
                </td>
                <td>
                    <template v-if="disabledId === list._id">
                        <button type="button" @click="saveMaster(updateList)">Save</button>
                        <button type="button" @click="disabledId = null">Cancel</button>
                    </template>
                    <template v-else>
                        <button type="button" @click="editMaster(list)">Edit</button>
                    </template>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { ref } from 'vue';
import api from '~~/api.config';
import { DATA_TYPE } from '~~/constant/master';
import { ErrorMessage, Field } from 'vee-validate';
import VueDatePicker from '@vuepic/vue-datepicker';
import STATUS from '~~/status';
const lists = ref([]);
const updateList = ref({});
const disabledId = ref(null);
const route = useRoute();
const props = defineProps({
    table: { type: Object },
})
const config = useRuntimeConfig();
const _id = computed(() => route.params._id);

const addList = async () => {
    const newRow = {}
    //   props.table.master.fields.forEach(f => {
    //     if (f.dataType === DATA_TYPE.BOOLEAN) {
    //       newRow[f.columnName] = false
    //     } else {
    //       newRow[f.columnName] = f.default || ''
    //     }
    //   })
    const query = {
        ...newRow
    }
    try {
        const response = await api.post(`${config.public.API}/dynamicMaster/add/${_id.value}`, {
            query: JSON.stringify(query),
        });
        console.log(response)
        if (response.status === STATUS.CREATED) {
            lists.value.unshift(response.data.dynamicMaster);
        }
    } catch (error) {
        console.log(error);
    }
}

const init = async () => {
    try {
        const response = await api.get(`${config.public.API}/dynamicMaster/fetchs/${_id.value}`);
        console.log(response)
        if (response.status === STATUS.OK) {
            lists.value = response.data.dynamicMasters;
        }

    } catch (error) {
        console.log(error);
    }
}

onMounted(init);

const saveMaster = async (list) => {
    try {
        disabledId.value = list._id;
        const projection = {
            ...list
        }
        const response = await api.post(`${config.public.API}/dynamicMaster/update/${_id.value}/${list._id}`, {
            projection: JSON.stringify(projection),
        });
        if (response.status === STATUS.OK) {
            console.log(response);
        }
    } catch (error) {
        console.log(error);
    }
}

const editMaster = (list) => {
    disabledId.value = list._id;
    updateList.value = JSON.parse(JSON.stringify(list));
}
</script>
