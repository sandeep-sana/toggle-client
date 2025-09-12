<template>
    <div>
        <h1>Department</h1>
        <button type="button" @click="addDepartment">Add Department</button>
        <div v-for="(department, departmentIndex) in departments">
            <p>{{ departmentIndex }}</p>
            <p>
                {{ department.name }}
            </p>
            <p ><button type="button" @click="statusDepartment(department)">{{ $activeInactive('department', department.status) }}</button></p>
            <p><button type="button" @click="editDepartment(department)">edit</button></p>
        </div>
    </div>
    <FormModal v-if="modal.isConfirmation" :modal="modal" />
</template>

<script setup>
import STATUS from '~~/status';
import api from '~~/api.config';
import { ref, onMounted } from 'vue';
import { useGlobalStore } from '~/stores/global';
import FormModal from "../modal/FormModal.vue";


const config = useRuntimeConfig();
const globalStore = useGlobalStore();
const { $fetchUser, $toast, $activeInactive } = useNuxtApp();

const modal = ref({
    isConfirmation: false,
    header: null,
    fields: [],
    save: null,
});
const departments = ref([]);
const user = ref({
    isHierarchy: false,
});

const resetModal = () => {
    modal.value = {
        isConfirmation: false,
        header: null,
        fields: [],
        save: null,
    }
}

const addDepartment = () => {
    modal.value.isConfirmation = true
    modal.value.header = 'Add department'
    modal.value.fields = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            rules: 'required|min:3|max:50',
            placeholder: 'Enter department name',
        },
    ]
    modal.value.save = saveDepartment;
}
const editDepartment = (department) => {
    modal.value.isConfirmation = true;
    modal.value.header = 'Edit department';
    modal.value.fields = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            rules: 'required|min:3|max:50',
            placeholder: 'Enter department name',
            value: department.name,
        },
    ];
    modal.value._id = department._id;
    modal.value.save = updateDepartment;
}

const saveDepartment = async (values) => {
    const response = await api.post(`${config.public.API}/department/department`, {
        query: JSON.stringify(values)
    })
    if (response.status === STATUS.CREATED) {
        departments.value.push(values)
        resetModal();
        $toast.success(response.data.message);
    }
}
const updateDepartment = async (values) => {
    const response = await api.post(`${config.public.API}/department/department`, {
        query: JSON.stringify(values)
    })

    if (response.status === STATUS.OK) {
        departments.value = departments.value.map(department => {
            if (department._id === values._id) {
                return { ...department, name: values.name };
            }
            return department;
        })
        resetModal();
        $toast.success(response.data.message);
    }
}
const statusDepartment = async (department) => {
    const query = {
        _id: department._id,
        status: !department.status
    }
    const response = await api.post(`${config.public.API}/department/department`, {
        query: JSON.stringify(query)
    })

    if (response.status === STATUS.OK) {
        departments.value = departments.value.map(r => {
            if (r._id === department._id) {
                return { ...department, status: !department.status };
            }
            return department;
        })
        resetModal();
        $toast.success(response.data.message);
    }
}

const init = async () => {
    try {
        const response = await api.get(`${config.public.API}/department/departments`);
        if (response.status === STATUS.OK) {
            departments.value = response.data.departments;
        }
    } catch (error) {
        console.log(error);
    }
}

onMounted(async () => {
    await init();
    user.value = await $fetchUser();
});
</script>
