<template>
    <!-- Parent div that controls layout -->
    <div :class="layout.position">
        <div class="custom-header p-4">
            <draggable v-model="modules" item-key="name" animation="200">
                <template #item="{ element }">
                    <button class="m-2 p-2 bg-blue-500 text-white rounded"
                        @click="$router.push(`/${element.toLowerCase()}`)">
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
import { ref, onMounted, computed } from "vue";
import draggable from "vuedraggable";
import { subDomain } from "~~/function";
import { useGlobalStore } from "~/stores/global";
const props = defineProps({
    layout: { type: Object }
});

const _id = ref(null);
const modules = ref([]);
const router = useRouter();
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();
const { $logout, $session } = useNuxtApp();
const globalStore = useGlobalStore();
const layoutType = ref("top");  // Default layout type (top, left, right)

const updateModules = async () => {
    try {
        const projection = { modules: modules.value };
        const response = await api.post(`${config.public.API}/user/user/${_id.value}`, {
            projection: JSON.stringify(projection),
        });
        if (response.status === STATUS.OK) {
            // $toast.success(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
};

watch(modules, async () => {
    await updateModules();
})

watch(() => globalStore.isSideHeader, async() => {
    await init();
})

const init = async () => {
    try {
        subDomain();
        _id.value = $session();
        const res = await api.get(`${config.public.API}/user/user/${_id.value}`);
        if (res.status === STATUS.OK && res.data?.user?.role) {
            modules.value = res.data.user.modules;
        }
    } catch (err) {
        console.error(err);
    }
};

onMounted(init);

// Computed class based on the layout type (top, left, right)
const headerClass = computed(() => {
    return {
        'header-top': layoutType.value === 'top',
        'header-left': layoutType.value === 'left',
        'header-right': layoutType.value === 'right',
        'dynamic-header': true
    };
});

// Dynamic layout change (use this to change header placement)
const changeLayout = (newLayout) => {
    layoutType.value = newLayout;
};

// Logout functionality
const logout = () => {
    // Add logout logic
    console.log("Logging out...");
    $toast.success("Logged out successfully.");
};
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
