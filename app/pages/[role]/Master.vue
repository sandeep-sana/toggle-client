<template>
    <div class="container py-4 py-md-5">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4 col-12 bg-white border-0 shadow-sm p-2 rounded">
            <div class="m-0 fw-bold">Masters</div>
            <button type="button" class="btn btn-secondary d-flex align-items-center" data-bs-toggle="modal"
                data-bs-target="#addMasterModal">
                <i class="fa fa-plus-circle me-2"></i> Add Master
            </button>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="d-flex justify-content-center py-5">
            <div class="spinner-border text-primary" role="status" aria-label="Loading"></div>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredMasters.length === 0" class="card border-0 shadow-sm">
            <div class="card-body text-center py-5">
                <div class="display-6 text-muted mb-2">
                    <i class="fa fa-database"></i>
                </div>
                <p class="mb-3 text-muted">No masters found</p>
                <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal"
                    data-bs-target="#addMasterModal">
                    Create one
                </button>
            </div>
        </div>

        <!-- Masters grid -->
        <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 g-md-4">
            <div v-for="list in filteredMasters" :key="list._id" class="col">
                <div class="card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-truncate mb-2">{{ list.name }}</h5>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <button type="button" class="btn btn-sm btn-outline-secondary"
                                @click="$router.push(`/system-admin/table-${list._id}`)" aria-label="Open schema">
                                <i class="fa fa-database me-1"></i> Schema
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger" @click="confirmDelete(list._id)"
                                aria-label="Delete master">
                                <i class="fa fa-trash-alt me-1"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Master Modal -->
        <div class="modal fade" id="addMasterModal" tabindex="-1" aria-labelledby="addMasterModalLabel"
            aria-hidden="true" ref="modalEl">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="addMasterModalLabel">
                            <i class="fa fa-plus-circle me-2"></i>Add Master
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>

                    <form @submit.prevent="addMaster" novalidate>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="name" class="form-label">Name</label>
                                <Field name="name" as="input" type="text" id="name" class="form-control"
                                    placeholder="Enter name" rules="required|nospace"
                                    :class="{ 'is-invalid': errors.name }" />
                                <ErrorMessage name="name" class="invalid-feedback d-block" />
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="fa fa-times-circle me-1"></i> Cancel
                            </button>
                            <button type="submit" class="btn btn-success">
                                <i class="fa fa-save me-1"></i> Save
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import STATUS from "~~/status";
import api from "~~/api.config";
import { Field, ErrorMessage, useForm } from "vee-validate";
import { useGlobalStore } from "~/stores/global";

const config = useRuntimeConfig();
const globalStore = useGlobalStore();
const { $toast } = useNuxtApp();

const isLoading = ref(true);
const q = ref("");

const master = reactive({
    lists: [],
});

const { handleSubmit, errors } = useForm();

const filteredMasters = computed(() => {
    const term = q.value.trim().toLowerCase();
    return term
        ? master.lists.filter((x) => (x.name || "").toLowerCase().includes(term))
        : master.lists;
});

const modalEl = ref(null);
let modalInstance = null;

const addMaster = handleSubmit(async (values) => {
    console.log(values.name)
    if(['users', 'user'].includes(values.name.toLowerCase())){
        return $toast.warning('Please change the master name')
    }
    const query = { ...values }
    try {
        const response = await api.post(`${config.public.API}/master/add`, {
            query: JSON.stringify(values),
        });
        if (response.status === STATUS.CREATED) {
            master.lists.push(response.data.master);
            $toast.success(response.data.message);
            globalStore.setIsMaster(!globalStore.isMaster);
            modalInstance?.hide();
        }
    } catch (error) {
        console.error(error);
    }
});

const confirmDelete = async (id) => {
    const ok = window.confirm("Delete this master?");
    if (!ok) return;
    try {
        const response = await api.delete(`${config.public.API}/master/delete/${id}`);
        if (response.status === STATUS.OK) {
            master.lists = master.lists.filter((item) => item._id !== id);
            $toast.success("Master deleted successfully");
        }
    } catch (error) {
        console.error(error);
    }
};

const init = async () => {
    try {
        const projection = { name: 1 };
        const response = await api.get(`${config.public.API}/master/fetchs`, {
            params: { projection: JSON.stringify(projection) },
        });
        if (response.status === STATUS.OK) {
            master.lists = response.data.masters;
        }
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
    await init();
    const { Modal } = await import("bootstrap");
    modalInstance = new Modal(modalEl.value);
});
</script>

<!-- <style scoped>

</style> -->
