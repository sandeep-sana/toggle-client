<template>
    <div class="position-absolute">
        <div>
            <h1>Layout Control</h1>
            <div>
                <label for="position">Header Position</label>
                <select name="position" v-model="layout.position" @change="save">
                    <option value="top">Top</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
import api from '~~/api.config';
import STATUS from '~~/status';


const props = defineProps({
    layout: { type: Object },
});
const emit = defineEmits(['layoutChange']);
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();

const save = async () => {
    const projection = {
        layout: props.layout,
    }
    try {
        const response = await api.post(`${config.public.API}/user/update`, {
            projection: JSON.stringify(projection),
        });
        if (response.status === STATUS.OK) {
            $toast.success(response.data.message);
        }

    } catch (error) {
        console.log(error);
    }
}

const init = async () => {
    try {
        const response = await api.get(`${config.public.API}/user/fetch`);
        if (response.status === STATUS.OK) {
            emit('layoutChange', response.data.user.layout);
        }

    } catch (error) {
        console.log(error);
    }
}

onMounted(init);
</script>