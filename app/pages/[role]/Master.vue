<template>
    <div class="container mt-5">
        <!-- Header Section -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="text-primary">Master</h1>
            <button @click="master.isShow = true" class="btn btn-primary px-4 py-2">
                <i class="fa fa-plus-circle"></i> Add Master
            </button>
        </div>

        <!-- Master Lists Section -->
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div v-for="list in master.lists" :key="list._id" class="col">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title text-truncate">{{ list.name }}</h5>
                        <div class="d-flex justify-content-between">
                            <button type="button" class="btn btn-link text-decoration-none" @click="$router.push(`/system-admin/table-${list._id}`)">
                                <i class="fa fa-database"></i> Schema
                            </button>
                            <button type="button" class="btn btn-danger btn-sm" @click="deleteMaster(list._id)">
                                <i class="fa fa-trash-alt"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Adding Master -->
        <Modal v-if="master.isShow">
            <template #header>
                <h2 class="text-center text-xl font-bold text-primary">
                    <i class="fa fa-plus-circle"></i> Add Master
                </h2>
            </template>
            <template #body>
                <form @submit.prevent="addMaster">
                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <Field name="name" as="input" type="text" id="name" class="form-control" placeholder="Enter name" rules="required|nospace" />
                        <ErrorMessage name="name" class="text-danger mt-2" />
                    </div>
                    <div class="d-flex justify-content-end gap-3">
                        <button type="button" @click="master.isShow = false" class="btn btn-secondary">
                            <i class="fa fa-times-circle"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-success">
                            <i class="fa fa-save"></i> Save
                        </button>
                    </div>
                </form>
            </template>
        </Modal>
    </div>
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
    const query = { ...values }
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

const deleteMaster = async (id) => {
    try {
        const response = await api.delete(`${config.public.API}/master/delete/${id}`);
        if (response.status === STATUS.OK) {
            master.lists = master.lists.filter(item => item._id !== id);
            $toast.success('Master deleted successfully');
        }
    } catch (error) {
        console.log(error);
    }
}

const init = async () => {
    try {
        const projection = { name: 1 }
        const response = await api.get(`${config.public.API}/master/fetchs`, {
            params: {
                projection: JSON.stringify(projection),
            }
        });
        if (response.status === STATUS.OK) {
            master.lists = response.data.masters;
        }
    } catch (error) {
        console.log(error);
    }
}

onMounted(init);

const masterDelete = async(_id) => {
    try {
        const response = await api.delete(`${config.public.API}/master/delete/${_id}`);
        if (response.status === STATUS.OK) {
            $toast.success(response.data.message);
            master.lists =  master.lists.filter(list => list._id != _id);
        }
        
    } catch (error) {
        console.log(error);
    }
}
</script>

<style scoped>
/* Custom CSS for polished professional design */

/* Card Styling */
.card {
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Modal Header */
.modal-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #ddd;
}

/* Modal Footer */
.modal-footer {
    border-top: 1px solid #ddd;
}

/* Icon Button Styling */
button i {
    margin-right: 5px;
}

/* Form Inputs */
input.form-control {
    padding: 0.75rem;
}

/* Header Styling */
.text-primary {
    color: #007bff;
}

h1, h2 {
    font-family: 'Poppins', sans-serif;
}

.btn i {
    margin-right: 8px;
}

</style>
