<template>
    <Preview :website="website" />
</template>
<script setup>
import api from '~~/api.config';
import { STATUS } from '~~/constant';
import Preview from '~~/Builder/WebSiteBuilder/Preview.vue'

const config = useRuntimeConfig();
const { $session, $logout, $login } = useNuxtApp();
const website = reactive({
    isShow: false,
    blocks: [],
    name: 'Draft1',
})
const getHomeWebsite = async () => {
    try {
        const projection = {
            homePageWebsite: 1,
        }
        const response = await api.get(`${config.public.API}/setting/fetchWebsite`, {
            params: {
                projection: JSON.stringify(projection),
            }
        });

        if (response.status === STATUS.OK) {
            console.log(response);
            website.name = response.data.website.name;
            website.blocks = response.data.website.blocks;
            website.isShow = true;
            website._id = response.data.website._id;
        }

    } catch (error) {
        console.log(error);
    }
}
onMounted(async () => {
    const _id = $session();
    if (!_id) {
        await $logout();
    } else {
        await $login();
    }
    await getHomeWebsite();
});
</script>