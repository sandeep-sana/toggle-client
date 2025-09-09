<template>
    <div class="d-flex flex-wrap gap-3">
        <div v-for="account in accounts" :key="account._id" class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">{{ account.company.name }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">{{ account.company.email }}</h6>
                <p class="card-text">{{ account.company.description }}</p>

                <button type="button" class="btn btn-outline-danger btn-sm me-2"
                    @click="reject(account)">Reject</button>
                <button type="button" class="btn btn-success btn-sm" @click="openConfirm('APPROVED', account)">
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
import { useAuth } from '../../function';
import { ref, reactive, onMounted } from 'vue';
import Confirmation from '../../modal/Confirmation.vue';

const accounts = ref([]);
const modal = ref({
    isConfirmation : false,
    message: null,
    rejectAccount: null,
});
const { session } = useAuth();
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();


const reject = (account) => {
    modal.value.isConfirmation = true;
    modal.value.message = `you want to reject ${account.company.name}`;
    modal.value._id = account._id;
    modal.value.rejectAccount = rejectAccount;
}

const rejectAccount = async (_id) => {
    try {
        console.log(_id)
        const response = await api.get(`${config.public.API}/super-admin/accountReject/${_id}`);
        if(response.status === STATUS.OK){
            $toast.success(response.data.message);
            accounts.value = accounts.value.filter(account => account._id != _id);
        }
    } catch (error) {
        console.log(error);
    }
} 


const init = async () => {
    try {
        const query = { role: 'ADMIN', status: 'PENDING' }
        const res = await api.get(`${config.public.API}/super-admin/accounts`, {
            params: { query: JSON.stringify(query) }
        })
        if (res.status === STATUS.OK) {
            accounts.value = res.data.accounts
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
