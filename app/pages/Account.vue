<template>
    <div class="d-flex flex-wrap gap-3">
        <div v-for="user in users" :key="user._id" class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">{{ user.companyName }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">{{ user.email }}</h6>
                <p class="card-text">{{ user.description }}</p>

                <button type="button" class="btn btn-outline-danger btn-sm me-2"
                    @click="reject(user)">Reject</button>
                <button type="button" class="btn btn-success btn-sm" @click="accept(user)">
                    Accept
                </button>
            </div>
        </div>
    </div>
    <Confirmation v-if="modal.isConfirmation" :modal="modal" />
</template>

<script setup>
import STATUS from '~~/status';
import api from '~~/api.config';

import { ref, reactive, onMounted } from 'vue';
import Confirmation from '../../modal/Confirmation.vue';

const users = ref([]);
const modal = ref({
    isConfirmation: false,
    message: null,
    reject: null,
});
const config = useRuntimeConfig();
const { $session, $toast } = useNuxtApp();


const reject = (user) => {
    modal.value.isConfirmation = true;
    modal.value.message = `you want to reject ${user.companyName}`;
    modal.value._id = user._id;
    modal.value.reject = rejectUser;
}
const accept = (user) => {
    modal.value.isConfirmation = true;
    modal.value.message = `you want to accept ${user.companyName}`;
    modal.value._id = user._id;
    modal.value.reject = acceptUser;
}

const acceptUser = async (_id) => {
    try {
        const projection = {
            status: "ACCEPT",
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
const rejectUser = async (_id) => {
    try {
        const projection = {
            status: "REJECT",
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


const init = async () => {
    try {
        const query = { role: 'ADMIN', status: 'PENDING' }
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
    $session();
    await init()
})
</script>
