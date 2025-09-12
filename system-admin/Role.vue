<template>
    <div>
        <h1>Role</h1>
        <button v-if="!user.isHierarchy" type="button" @click="activeHierarchy">Apply</button>
        <button type="button" @click="addRole">Add Role</button>
        <div v-for="(role, roleIndex) in roles">
            <p>{{ roleIndex }}</p>
            <p>
                {{ role.name }}
            </p>
            <p ><button type="button" @click="statusRole(role)">{{ $activeInactive('role', role.status) }}</button></p>
            <p><button type="button" @click="editRole(role)">edit</button></p>
        </div>
    </div>
    <FormModal v-if="modal.isConfirmation" :modal="modal" />
</template>

<script setup>
import STATUS from '~~/status';
import api from '~~/api.config';
import { ref, onMounted } from 'vue';
import FormModal from '~~/modal/FormModal.vue';
import { useGlobalStore } from '~/stores/global';


const config = useRuntimeConfig();
const globalStore = useGlobalStore();
const { $fetchUser, $toast, $activeInactive } = useNuxtApp();

const modal = ref({
    isConfirmation: false,
    header: null,
    fields: [],
    save: null,
});
const roles = ref([]);
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

const addRole = () => {
    modal.value.isConfirmation = true
    modal.value.header = 'Add Role'
    modal.value.fields = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            rules: 'required|min:3|max:50',
            placeholder: 'Enter role name',
        },
    ]
    modal.value.save = saveRole;
}
const editRole = (role) => {
    modal.value.isConfirmation = true;
    modal.value.header = 'Edit Role';
    modal.value.fields = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            rules: 'required|min:3|max:50',
            placeholder: 'Enter role name',
            value: role.name,
        },
    ];
    modal.value._id = role._id;
    modal.value.save = updateRole;
}

const saveRole = async (values) => {
    const response = await api.post(`${config.public.API}/role/role`, {
        query: JSON.stringify(values)
    })
    if (response.status === STATUS.CREATED) {
        roles.value.push(values)
        resetModal();
        $toast.success(response.data.message);
    }
}
const updateRole = async (values) => {
    const response = await api.post(`${config.public.API}/role/role`, {
        query: JSON.stringify(values)
    })

    if (response.status === STATUS.CREATED) {
        roles.value = roles.value.map(role => {
            if (role._id === values._id) {
                return { ...role, name: values.name };
            }
            return role;
        })
        resetModal();
        $toast.success(response.data.message);
    }
}
const statusRole = async (role) => {
    const query = {
        _id: role._id,
        status: !role.status
    }
    const response = await api.post(`${config.public.API}/role/role`, {
        query: JSON.stringify(query)
    })

    if (response.status === STATUS.OK) {
        roles.value = roles.value.map(r => {
            if (r._id === role._id) {
                return { ...role, status: !role.status };
            }
            return role;
        })
        resetModal();
        $toast.success(response.data.message);
    }
}

const activeHierarchy = async () => {
    try {
        const projection = {
            $addToSet: { modules: { $each: ['HIERARCHY'] } },
            isHierarchy: true,
        }
        const response = await api.post(`${config.public.API}/user/update`, {
            projection: JSON.stringify(projection),
        });
        if (response.status === STATUS.OK) {
            globalStore.setIsSideHeader(!globalStore.isSideHeader);
            user.value.isHierarchy = true;
        }

    } catch (error) {
        console.log(error);
    }
}

const init = async () => {
    try {
        const response = await api.get(`${config.public.API}/role/roles`);
        if (response.status === STATUS.OK) {
            roles.value = response.data.departments;
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
