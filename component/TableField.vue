<template>
    <div v-if="tableReactive.masterBindingRule">
        <!-- Render the data from the API response here -->
        <div v-for="(item, index) in tableReactive.masterBindingRule" :key="index">
            <!-- Displaying each item from the masterBindingRule array (adjust according to your response structure) -->
            <p>{{ item.someField }}</p>
        </div>
    </div>
    <div v-else>
        <p>Loading data...</p>
    </div>
</template>

<script setup>
import { defineProps, onMounted, computed, ref } from 'vue';
import api from '~~/api.config';

const route = useRoute();
const props = defineProps({
    field: { type: Object }
});
const config = useRuntimeConfig();
const _id = computed(() => route.params._id);
const tableReactive = ref({
    masterBindingRule: null, // Holds the fetched data
});

const init = async () => {
    try {
        const query = {
            'rules.$.inputExpression': _id.value,
        }
        const response = await api.get(`${config.public.API}/masterBindingRule/fetch/${_id.value}`, {
            params: {
                query: JSON.stringify(query),
            }
        });
        if (response.status === STATUS.OK) {
            console.log(response);
            tableReactive.value.masterBindingRule = response.data.masterBindingRule;
        }
    } catch (error) {
        console.error(error);
    }
}

onMounted(async () => {
    await init();
});
</script>
