<template>
    <div class="d-flex flex-wrap gap-3">
        <div v-for="user in users" :key="user._id" class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">{{ user.companyName }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">{{ user.email }}</h6>
                <p class="card-text">{{ user.description }}</p>

                <button type="button" class="btn btn-outline-danger btn-sm me-2" @click="block(user)">Block</button>
                <a :href="`${config.public.AUTH}${user.domain}.${config.public.DOMAIN}`"
                    class="btn btn-outline-danger btn-sm me-2" target="_blank">View Website</a>
                <button type="button" class="btn btn-outline-danger btn-sm me-2"
                    @click="createDatabase(user._id)">Create Database</button>

            </div>
        </div>
    </div>
    <Confirmation v-if="modal.isConfirmation" :modal="modal" />
</template>

<script setup>
import STATUS from '~~/status';
import api from '~~/api.config';
import { session } from '../../function';
import { ref, reactive, onMounted } from 'vue';
import Confirmation from '../../modal/Confirmation.vue';

const users = ref([]);
const modal = ref({
    isConfirmation: false,
    message: null,
    reject: null,
});
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();


const block = (user) => {
    modal.value.isConfirmation = true;
    modal.value.message = `you want to block ${user.companyName}`;
    modal.value._id = user._id;
    modal.value.reject = blockUser;
}

const blockUser = async (_id) => {
    try {
        const projection = {
            status: "BLOCK",
        }
        const response = await api.post(`${config.public.API}/user/user/${_id}`, {
            projection: JSON.stringify(projection),
        });
        if (response.status === STATUS.OK) {
            $toast.success(response.data.message);
            users.value = users.value.filter(user => user._id != _id);
        }
    } catch (error) {
        console.log(error);
    }
}

const createDatabase = async (_id) => {
    const response = await api.post(`${config.public.API}/user/create-database/${_id}`);
    if (response.status === STATUS.OK) {
        $toast.success(response.data.message);
    }
}


const init = async () => {
    try {
        const query = { role: 'ADMIN', status: 'ACCEPT' }
        const res = await api.get(`${config.public.API}/user/users`, {
            params: { query: JSON.stringify(query) }
        })
        if (res.status === STATUS.OK) {
            users.value = res.data.users
        }
    } catch (e) {
        console.error(e)
    }
}

onMounted(async () => {
    session()
    await init()
})
</script>
