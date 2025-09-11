<template>
    <div>
        <draggable v-model="modules" item-key="name" animation="200">
            <template #item="{ element }">
                <button class="m-2 p-2 bg-blue-500 text-white rounded"
                    @click="$router.push(`/${element.toLowerCase()}`)">
                    {{ element.toLowerCase() }}
                </button>
            </template>
        </draggable>
        <button @click="logout">Logout</button>
    </div>
</template>

<script setup>
import STATUS from "~~/status";
import api from "~~/api.config";
import { ref, onMounted } from "vue";
import draggable from "vuedraggable";
import { subDomain, session, logout } from "~~/function";
import { useGlobalStore } from "~/stores/global";

const _id = ref(null);
const modules = ref([]);
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();
const globalStore = useGlobalStore();

const updateModules = async () => {
    try {
        const projection = {
            modules: modules.value,
        }
        const response = await api.post(`${config.public.API}/user/user/${_id.value}`, {
            projection: JSON.stringify(projection),
        });
        if (response.status === STATUS.OK) {
            // $toast.success(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

watch(modules, async () => {
    await updateModules();
})

watch(globalStore.isSideHeader, () => {
    console.log(globalStore)
})

const init = async () => {
    try {
        subDomain();
        _id.value = session();
        const res = await api.get(`${config.public.API}/user/user/${_id.value}`);
        if (res.status === STATUS.OK && res.data?.user?.role) {
            modules.value = res.data.user.modules;
        }
    } catch (err) {
        console.error(err);
    }
};

onMounted(init);
</script>
