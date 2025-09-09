<template>
    <component v-if="currentComponent" :is="currentComponent" />
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from "vue";
import api from "~~/api.config";
import STATUS from "~~/status";


const role = ref(null);
const config = useRuntimeConfig();
const componentMap = {
    SUPERADMIN: defineAsyncComponent(() => import("../common/Super-Admin-Side-Header.vue")),
};

const normalizeRole = (r) => (r ? String(r).replace(/[^A-Za-z0-9]/g, "") : "");

const currentComponent = computed(() => {
    const key = normalizeRole(role.value);
    return componentMap[key] 
});

const init = async () => {
    try {
        const _id = localStorage.getItem("_id");
        if (!_id) return;
        const res = await api.get(`${config.public.API}/super-admin/account/${_id}`);
        if (res.status === STATUS.OK && res.data?.account?.role) {
            role.value = res.data.account.role;
        }
    } catch (err) {
        console.error(err);
    }
};

onMounted(init);
</script>
