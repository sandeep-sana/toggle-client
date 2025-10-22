<template>
    <div class="main">
        <div class="header">
            <div class="left">
                <h1>Setting</h1>
            </div>
            <div class="right"></div>
        </div>
        <div class="container">
            <Form @submit="submit">
                <div>
                    <label for="homePageWebsite">Home Page Website</label>
                    <Field as="select" name="setting.homePageWebsite" v-model="setting.homePageWebsite">
                        <option v-for="website in websites" :value="website._id">{{ website.name }}</option>
                    </Field>

                </div>
                <button type="submit">Save</button>
            </Form>
        </div>
    </div>
</template>
<script setup>
import api from '~~/api.config';
import { Field, Form } from 'vee-validate';
import STATUS from '~~/status';

const setting = ref({});
const websites = ref([]);
const config = useRuntimeConfig();
const { $speak, $toast, } = useNuxtApp();


const submit = async () => {
    try {
        let query = {}
        if (setting.value._id) {
            query._id = setting.value._id;
        }
        const projection = setting.value;
        const options = {
            new: true,
            upsert: true,
            rawResult: true,
        }
        const response = await api.post(`${config.public.API}/setting/update`, {
            query: JSON.stringify(query),
            projection: JSON.stringify(projection),
            options: JSON.stringify(options),
        });
        if (response.status === STATUS.OK) {
            $toast.success(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

const getSetting = async () => {
    try {
        const response = await api.get(`${config.public.API}/setting/fetch`);
        if (response.status === STATUS.OK) {
            setting.value = response.data.setting;
        }
    } catch (error) {
        console.log(error);
    }
}
const getWebsites = async () => {
    try {
        const response = await api.get(`${config.public.API}/website/fetchs`);
        if (response.status === STATUS.OK) {
            websites.value = response.data.websites;
        }
    } catch (error) {
        console.log(error);
    }
}

onMounted(async () => {
    await getSetting();
    await getWebsites();
})

</script>

<style scoped>
.main {
    width: 100%;
    margin: 10px;
}

.header {
    color: var(--text-color-one);
    background-color: var(--background-color-two);
    border: 1px solid var(--border-color-one);
    padding: 10px;
    width: 100%;
    border-radius: 12px;
}

.container {
    color: var(--text-color-one);
    background-color: var(--background-color-two);
    border: 1px solid var(--border-color-one);
    border-radius: 12px;
    height: calc(100% - 90px);
    margin-top: 10px;
    padding: 10px;
}
</style>