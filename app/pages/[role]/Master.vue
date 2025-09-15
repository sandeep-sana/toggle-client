<template>
    <div>
        <h1>Master</h1>
        <div>
            <button @click="master.isShow = true" class="px-4 py-2 bg-blue-500 text-white rounded">
                Add Master
            </button>

            <div>
                <div v-for="list in master.lists" class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">{{ list.name }}</h5>
                        <button type="button" @click="$router.push(`/system-admin/table-${list._id}`)">Schema</button>
                        <button type="button">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Modal v-if="master.isShow">
        <template #header>
            <h2 class="text-xl font-bold text-blue-600">Add Master</h2>
        </template>
        <template #body>
            <form @submit.prevent="addMaster">
                <div class="mb-3">
                    <label for="name" class="block font-medium mb-1">Name</label>
                    <Field name="name" as="input" type="text" id="name" class="w-full border rounded px-3 py-2"
                        placeholder="name" rules="required|nospace" />
                    <ErrorMessage name="name" class="text-red-500 text-sm mt-1" />
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" @click="master.isShow = false" class="px-4 py-2 bg-gray-200 rounded">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">
                        Save
                    </button>
                </div>
            </form>
        </template>
    </Modal>
</template>

<script setup>
import STATUS from "~~/status";
import api from "~~/api.config";
import Modal from "../modal/Modal.vue";
import { useGlobalStore } from '~/stores/global';
import { Field, ErrorMessage, useForm } from "vee-validate";

const config = useRuntimeConfig();
const globalStore = useGlobalStore();

const master = reactive({
    isShow: false,
    lists: [],
})
const { $toast } = useNuxtApp();
const { handleSubmit } = useForm();

const addMaster = handleSubmit(async (values) => {
    const query = {
        ...values,
    }
    try {
        const response = await api.post(`${config.public.API}/master/add`, {
            query: JSON.stringify(query),
        });
        if (response.status === STATUS.CREATED) {
            master.lists.push(response.data.master);
            $toast.success(response.data.message);
            globalStore.setIsMaster(!globalStore.isMaster);
        }
    } catch (error) {
        console.log(error);
    } finally {
        master.isShow = false;
    }
});
const init = async () => {
    try {
        const projection = {
            name: 1,
        }
        const response = await api.get(`${config.public.API}/master/fetchs`, {
            params: {
                projection: JSON.stringify(projection),
            }
        });
        if (response.status === STATUS.OK) {
            console.log(response.data)
            master.lists = response.data.masters;
        }
    } catch (error) {
        console.log(error);
    }
}
onMounted(init);
</script>
