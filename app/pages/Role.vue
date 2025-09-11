<template>
    <div>
        <h1>Role</h1>
        <button type="button" @click="addRole()">Add Role</button>
        <div v-for="(role, roleIndex) in roles">
            <p>{{ roleIndex }}</p>
            <p>
                {{ role.name }}
            </p>
            <p><button type="button">edit</button></p>
        </div>
    </div>
    <FormModal v-if="modal.isConfirmation" :modal="modal" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FormModal from '../../modal/FormModal.vue'
import api from '~~/api.config'
import STATUS from '~~/status';

const { $toast } = useNuxtApp();
const config = useRuntimeConfig();


const modal = ref({
    isConfirmation: false,
    header: null,
    fields: [],   
    save: null,
});
const roles = ref([]);

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
    modal.value.save = saveRole
}

const saveRole = async (values) => {
    const response = await api.post(`${config.public.API}/role/role`, {
        query: JSON.stringify(values)
    })
    if(response.status === STATUS.CREATED){
        $toast.success(response.data.message);
    }
}

const init = async () => {
    try {
        const response = await api.get(`${config.public.API}/role/roles`);
        if(response.status ===  STATUS.OK){
            roles.value = response.data.roles;
        }
    } catch (error) {
        console.log(error);
    }
}

onMounted(init);
</script>
