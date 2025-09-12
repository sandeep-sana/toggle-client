<template>
    <!-- Parent div that controls layout -->
    <div :class="layout.position">
        <div class="custom-header p-4">
            <draggable v-model="sideHeader.user.modules" item-key="name" animation="200">
                <template #item="{ element }">
                    <button class="m-2 p-2 bg-blue-500 text-white rounded"
                        @click="$router.push(`/${sideHeader.user.role.toLowerCase()}-${element.toLowerCase()}`)">
                        {{ element.toLowerCase() }}
                    </button>
                </template>
            </draggable>
            <button @click="$logout" class="logout-btn">Logout</button>
        </div>
    </div>
</template>



<script setup>
import STATUS from "~~/status";
import api from "~~/api.config";
import { onMounted, reactive } from "vue";
import draggable from "vuedraggable";
import { subDomain } from "~~/function";
import { useGlobalStore } from "~/stores/global";
const props = defineProps({
    layout: { type: Object }
});

const sideHeader = reactive({
    user: {
        modules: [],
    }
});
const config = useRuntimeConfig();
const globalStore = useGlobalStore();
const { $logout, $session } = useNuxtApp();

const updateModules = async () => {
    try {
        const projection = { modules: sideHeader.user.modules };
        const response = await api.post(`${config.public.API}/user/user/${sideHeader.user._id}`, {
            projection: JSON.stringify(projection),
        });
        if (response.status === STATUS.OK) {
        }
    } catch (error) {
        console.log(error);
    }
};

watch(sideHeader.user.modules, async () => {
    await updateModules();
})

watch(() => globalStore.isSideHeader, async() => {
    await init();
})

const init = async () => {
    try {
        subDomain();
        sideHeader.user._id = $session();
        const res = await api.get(`${config.public.API}/user/user/${sideHeader.user._id}`);
        if (res.status === STATUS.OK) {
            sideHeader.user = res.data.user;
        }
    } catch (err) {
        console.error(err);
    }
};

onMounted(init);
</script>
<style scoped>
/* General styles for custom header */
.custom-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: 15px;
    background: #f8f9fa;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
    transition: all 0.3s ease;
    padding: 20px;
}

.custom-header button {
    border: none;
    outline: none;
    background-color: transparent;
    color: black!important;
    text-transform: capitalize;
}

/* For left layout (vertical sidebar) */
.left .custom-header {
    width: 250px;
    flex-direction: column;
    justify-content: flex-start;
    height: 100vh;
}

/* For right layout (vertical sidebar) */
.right .custom-header {
    width: 250px;
    flex-direction: column;
    justify-content: flex-start;
    height: 100vh;
}

/* For top layout (horizontal header) */
.top .custom-header {
    width: 100%;
    flex-direction: row;
    justify-content: center;
    height: auto;
}

/* Button and logout styling */
.custom-header button {
    margin: 5px;
}

.logout-btn {
    margin-left: 20px;
    padding: 8px 16px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.logout-btn:hover {
    background-color: #c82333;
}

/* Add transition when switching layouts */
.custom-header {
    transition: flex-direction 0.3s ease, width 0.3s ease;
}
</style>
