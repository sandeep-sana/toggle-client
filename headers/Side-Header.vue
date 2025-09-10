<template>
    <component v-if="currentComponent" :is="currentComponent" />
</template>

<script setup>
import STATUS from "~~/status";
import api from "~~/api.config";
import { subDomain, useAuth } from "~~/function";
import { ref, computed, onMounted, defineAsyncComponent } from "vue";


const role = ref(null);
const dbName = ref(null);
const { session } = useAuth();
const config = useRuntimeConfig();
const componentMap = {
    SUPERADMIN: defineAsyncComponent(() => import("../common/Super-Admin-Side-Header.vue")),
    ADMIN: defineAsyncComponent(() => import("../common/Customer-Header.vue")),
};

const normalizeRole = (r) => (r ? String(r).replace(/[^A-Za-z0-9]/g, "") : "");

const currentComponent = computed(() => {
    const key = normalizeRole(role.value);
    return componentMap[key]
});

const init = async () => {
    try {
        const domain = subDomain();
        dbName.value = domain;
        const _id = session();
        console.log(_id)
        const res = await api.get(`${config.public.API}/user/user`,{
            params:{
                dbName: dbName.value,
                _id: _id,
            }
        });
        if (res.status === STATUS.OK && res.data?.user?.role) {
            role.value = res.data.user.role;
        }
    } catch (err) {
        console.error(err);
    }
};

onMounted(init);
</script>
