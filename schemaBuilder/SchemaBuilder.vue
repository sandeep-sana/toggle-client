<template>
    <div>
        <Fields />
    </div>
    <div>
        <Editor :schema="schema" />
    </div>
    <div>
        <Property v-if="schema.property" :schema="schema" />
    </div>
    <div>
        <pre>{{ schema }}</pre>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import Fields from './Fields.vue';
import Editor from './Editor.vue';
import Property from './Property.vue';
import api from '~~/api.config';
import STATUS from '~~/status';

const route = useRoute();
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();
const schema = reactive({
    columns: [],
});
const _id = computed(() => route.params._id);

watch(schema, async () => {
    let projection = {
        columns: schema.columns,
    }
    const response = await api.post(
        `${config.public.API}/master/update/${_id.value}`,
        {
            projection: JSON.stringify(projection),
        }
    );
    console.log(response)
    if (response.status === STATUS.CREATED) {
    }
})

const init = async () => {
    try {
        const response = await api.get(
            `${config.public.API}/master/fetch/${_id.value}`
        );
        if (response.status === STATUS.OK) {
            schema.columns = JSON.parse(JSON.stringify(response.data.master.columns))
            // setValues({
            //     ...response.data.master,
            //     fields: JSON.parse(JSON.stringify(response.data.master.fields)),
            // });
        }
    } catch (error) {
        console.log(error);
    }
};
onMounted(async () => {
    await init();
})

</script>


