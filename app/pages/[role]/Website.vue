<template>
    <div class="website">
        <div class="header">
            <div class="left">
                <h1>Website</h1>
            </div>
            <div class="right">
                <button type="button" v-tippy="`Add Website`" @click="website.isShow = true">
                    <i class="ri-sticky-note-add-fill"></i>
                </button>
            </div>
        </div>
        <div class="body">
            <table>
                <thead>
                    <th>Name</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Action</th>
                </thead>
                <tbody>
                    <tr v-for="website in websites">
                        <td>{{ website.name }}</td>
                        <td>{{ website.createdAt }}</td>
                        <td>{{ website.updatedAt }}</td>
                        <td>
                            <button type="button" @click="editWebsite(website)"><i class="ri-pencil-fill"></i></button>
                            <button type="button" @click="deleteWebsite(website)"><i
                                    class="ri-delete-bin-6-fill"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- <div class="card">
                <p>Name</p>
            </div>
            <div class="card" v-for="website in websites">
                <p>{{ website.name }}</p>
            </div> -->
        </div>
    </div>
    <Modal v-if="website.isShow">
        <template #header>
            <h2 class="text-center text-xl font-bold text-primary">
                <i class="fa fa-plus-circle"></i> Add Website
            </h2>
            <button type="button" @click="closeWebsite"><i class="ri-close-fill"></i></button>
            <button type="button" @click="saveWebsite"><i class="ri-save-3-line"></i></button>
        </template>
        <template #body>
            <WebsiteBuilder :website="website" />
        </template>
    </Modal>
</template>

<script setup>
import { onMounted } from 'vue';
import api from '~~/api.config';
import Modal from '~~/modal/Modal.vue';
import WebsiteBuilder from '../../../Builder/WebSiteBuilder/WebsiteBuilder.vue';
import { STATUS } from '~~/constant';


const website = reactive({
    isShow: false,
    blocks: [],
    name: '',
})
const websites = ref([]);
const config = useRuntimeConfig();
const { $speak, $toast, } = useNuxtApp();


const editWebsite = (editWebsite) => {
    website.name = editWebsite.name;
    website.blocks = editWebsite.blocks;
    website.isShow = true;
    website._id = editWebsite._id;
}

const deleteWebsite = async (deleteWebsite) => {
    try {
        const query = {
            _id: website._id,
        }
        const response = await api.delete(`${config.public.API}/website/delete`, {

        });
        if (response.status === STATUS.OK) {
            $toast.success(response.data.message);
            $speak(response.data.message);
            websites.value = websites.value.filter(website => website._id != deleteWebsite._id);
        }
    } catch (error) {
        console.log(error);
    }
}

const closeWebsite = async () => {
    website.isShow = false
    website.blocks = [];
    website.name = 'Draft1';
    delete website._id;
    await saveWebsite();

}

watch(
    () => website, // Watch only the 'isShow' property
    async (newValue, oldValue) => {
        if (newValue) {
            // When website.isShow is true, call saveWebsite()
            //   await saveWebsite();
        }
    },
    { deep: true } // Deep watch to detect changes within the nested website object if needed
);



const saveWebsite = async () => {
    try {
        // if (!website.name) {
        //     $toast.info('website Name');
        //     $speak('website Name');
        // } else if (!website.blocks.length) {
        //     $toast.info('Please drag any field');
        //     $speak('Please drag any field');
        // } 
        // else {
            const query = {
                _id: website._id,
            }
            const projection = {
                ...website,
            }
            delete projection.attribute;
            delete projection.style;
            const options = {
                new: true,
                upsert: true,
                rawResult: true,
            }
            const response = await api.post(`${config.public.API}/website/update`, {
                query: JSON.stringify(query),
                projection: JSON.stringify(projection),
                options: JSON.stringify(options),
            });
            console.log(response)
            if (response.status === STATUS.OK) {
                website._id = response.data.website._id;
                websites.value = websites.value.map(website => {
                    if (website._id == response.data.website._id) {
                        return response.data.website;
                    } else {
                        return website;
                    }
                })
                // $toast.success(response.data.message);
                // $speak(response.data.message);
            } else if (response.status === STATUS.CREATED) {
                website._id = response.data.website._id;
                websites.value.push(response.data.website);
            }
        // }
    } catch (error) {
        console.log(error);
    }
}

const init = async () => {
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
    await init();
})
</script>

<style scoped>
.website {
    width: 100%;
    padding: 10px;
}

.header {
    background: var(--background-color-two);
    border: 1px solid var(--border-color-one);
    border-radius: 10px;
    padding: 10px;
    color: var(--text-color-one);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.left h1 {
    font-size: 20px;
}

.right button {
    background: var(--background-color-two);
    border: 1px solid var(--border-color-one);
    color: var(--text-color-one);
    padding: 5px 10px;
    border-radius: 10px;
}

.right button:hover {
    background-color: var(--background-color-three);
}

.body {
    background: var(--background-color-two);
    border: 1px solid var(--border-color-one);
    color: var(--text-color-one);
    padding: 5px 10px;
    border-radius: 10px;
}
</style>