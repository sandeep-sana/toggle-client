<template>
    <div>
        <Table :table="table" />
    </div>
    <div>
    </div>
</template>
<script setup>
import api from '~~/api.config';
import STATUS from '~~/status';
import Table from '../../../../component/Table.vue';

const route = useRoute();
const config = useRuntimeConfig();

const table = ref({
    master: {},
});

const role = computed(() => route.params.role);
const _id = computed(() => route.params._id);

const init = async () => {
    try {
        const response = await api.get(`${config.public.API}/master/fetch/${_id.value}`);
        if(response.status === STATUS.OK){
            table.value.master = response.data.master;
        }
    } catch (error) {
        console.log(error);
    }
}
onMounted(init);

</script>