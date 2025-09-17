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
                    {{ list[field.columnName] }}
                </td>
                <td>
                    <button type="button" @click="editMaster(list)">Edit</button>
                    <button type="button" @click="deleteMaster(list._id)">Delete</button>
                </td>
            </tr>
        </tbody>
    </table>

    <Modal v-if="tableReactive.isAdd">
        <template #header>
            <h2 class="text-xl font-bold text-blue-600">Add Master</h2>
        </template>
        <template #body>
            <form @submit="saveMaster">
                <div class="mb-3" v-for="field in table.master.fields">
                    <label for="name" class="block font-medium mb-1">{{ field.columnName }}</label>
                    <!-- ONLY FOR STRING -->
                    <template v-if="field.dataType === DATA_TYPE.STRING">
                        <Field :name="`${field.columnName}`" as="input" type="text"
                            class="w-full border rounded px-3 py-2" :placeholder="field.columnName"
                            :rules="handleValidation(field)" />
                    </template>
                    <!-- ONLY FOR NUMBER -->
                    <template v-else-if="field.dataType === DATA_TYPE.NUMBER">
                        <Field :name="`${field.columnName}`" as="input" type="number"
                            class="w-full border rounded px-3 py-2" :placeholder="field.columnName" rules="" />
                    </template>
                    <!-- ONLY FOR DATE -->
                    <template v-else-if="field.dataType === DATA_TYPE.DATE">
                        <VueDatePicker :name="`${field.columnName}`" :enable-time-picker="false"
                            class="w-full border rounded px-3 py-2" format="yyyy-MM-dd" auto-apply />
                    </template>
                    <ErrorMessage :name="`${field.columnName}`" class="text-red-500 text-sm mt-1" />
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" @click="tableReactive.isAdd = false" class="px-4 py-2 bg-gray-200 rounded">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">
                        Save
                    </button>
                </div>
            </form>
        </template>
    </Modal>
</template>

<script setup>
import { ref } from 'vue';
import STATUS from '~~/status';
import api from '~~/api.config';
import Modal from '../modal/Modal.vue';
import { DATA_TYPE } from '~~/constant/master';
import VueDatePicker from '@vuepic/vue-datepicker';
import { handleValidation } from '../common/common';
import { ErrorMessage, Field, useForm } from 'vee-validate';

const lists = ref([]);
const tableReactive = reactive({
    isAdd: false,
});
const route = useRoute();
const updateList = ref({});
const props = defineProps({
    table: { type: Object },
});

const disabledId = ref(null);
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();
const { handleSubmit, setValues, values } = useForm();
const _id = computed(() => route.params._id);

const addList = async () => {
    tableReactive.isAdd = true;
    // const newRow = {}
    // //   props.table.master.fields.forEach(f => {
    // //     if (f.dataType === DATA_TYPE.BOOLEAN) {
    // //       newRow[f.columnName] = false
    // //     } else {
    // //       newRow[f.columnName] = f.default || ''
    // //     }
    // //   })
    // const query = {
    //     ...newRow
    // }
    // try {
    //     const response = await api.post(`${config.public.API}/dynamicMaster/add/${_id.value}`, {
    //         query: JSON.stringify(query),
    //     });
    //     console.log(response)
    //     if (response.status === STATUS.CREATED) {
    //         lists.value.unshift(response.data.dynamicMaster);
    //     }
    // } catch (error) {
    //     console.log(error);
    // }
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

const saveMaster = handleSubmit(async (values) => {
  
    try {
        if (values?._id) {
            const response = await api.post(`${config.public.API}/dynamicMaster/update/${_id.value}/${values._id}`, {
                projection: JSON.stringify(values),
            });
            if (response.status === STATUS.OK) {
                $toast.success(response.data.message);
                lists.value = lists.value.map(list =>  list._id === values._id ? values : list);
            }
        } else {
            const response = await api.post(`${config.public.API}/dynamicMaster/add/${_id.value}`, {
                query: JSON.stringify(values),
            });
            if (response.status === STATUS.CREATED) {
                $toast.success(response.data.message);
                lists.value.unshift(response.data.dynamicMaster);
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        tableReactive.isAdd = false;
    }
})

const editMaster = (list) => {
    tableReactive.isAdd = true;
    setValues({
        ...list,
    })
    // disabledId.value = list._id;
    // updateList.value = JSON.parse(JSON.stringify(list));
}
const deleteMaster = async (_listId) => {
    try {
        const response = await api.delete(`${config.public.API}/dynamicMaster/delete/${_id.value}/${_listId}`);
        if (response.status === STATUS.OK) {
            $toast.success(response.data.message);
            lists.value = lists.value.filter(list => list._id != _listId);
        }
    } catch (error) {
        console.log(error);
    }
}
</script>
