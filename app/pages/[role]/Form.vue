<template>
    <section class="container-xxl py-4">
        <!-- Header -->
        <header class="page-header">
            <div class="header-content">
                <div class="header-left">
                    <h1 class="page-title">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="title-icon">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        Forms
                    </h1>
                    <p class="page-subtitle">Create and manage your forms</p>
                </div>
                <div class="header-right">
                    <button type="button" class="btn-primary" v-tippy="`Create New Form`" @click="form.isShow = true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M12 6v12m6-6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <span class="d-none d-md-inline">Add Form</span>
                    </button>
                </div>
            </div>
        </header>

        <!-- Body -->
        <div class="content-panel">
            <div v-if="forms.length === 0" class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" class="empty-icon">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <div class="empty-title">No forms yet</div>
                <p class="empty-text">Get started by creating your first form</p>
                <button type="button" class="btn-primary mt-3" @click="form.isShow = true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 6v12m6-6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Create First Form
                </button>
            </div>

            <div v-else class="table-container">
                <table class="modern-table">
                    <thead>
                        <tr>
                            <th>
                                <div class="th-content">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="me-2">
                                        <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                    Name
                                </div>
                            </th>
                            <th>
                                <div class="th-content">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="me-2">
                                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                    Created
                                </div>
                            </th>
                            <th>
                                <div class="th-content">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="me-2">
                                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                    Updated
                                </div>
                            </th>
                            <th class="text-center">
                                <div class="th-content justify-content-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="me-2">
                                        <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                    Actions
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="formItem in forms" :key="formItem._id" class="table-row">
                            <td>
                                <div class="td-content">
                                    <div class="form-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                        </svg>
                                    </div>
                                    <span class="form-name">{{ formItem.name }}</span>
                                </div>
                            </td>
                            <td>
                                <span class="date-text">{{ formatDate(formItem.createdAt) }}</span>
                            </td>
                            <td>
                                <span class="date-text">{{ formatDate(formItem.updatedAt) }}</span>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button type="button" class="action-btn action-btn-edit" v-tippy="`Edit Form`" @click="editForm(formItem)">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                        </svg>
                                    </button>
                                    <button type="button" class="action-btn action-btn-delete" v-tippy="`Delete Form`" @click="deleteForm(formItem)">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <!-- Modal -->
    <Modal v-if="form.isShow">
        <template #header>
            <h2 class="modal-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="me-2">
                    <path d="M12 6v12m6-6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ form._id ? 'Edit Form' : 'Create Form' }}
            </h2>
            <button type="button" class="modal-close" @click="closeForm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </template>
        <template #body>
            <FormBuilder :form="form" />
        </template>
    </Modal>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import api from '~~/api.config';
import Modal from '~~/modal/Modal.vue';
import FormBuilder from '../../../Builder/FormBuilder/FormBuilder.vue';
import { STATUS } from '~~/constant';

const form = reactive({
    isShow: false,
    blocks: [],
    name: 'Draft1',
})
const forms = ref([]);
const config = useRuntimeConfig();
const { $speak, $toast } = useNuxtApp();

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

const editForm = (editForm) => {
    form.name = editForm.name;
    form.blocks = editForm.blocks;
    form.isShow = true;
    form._id = editForm._id;
}

const deleteForm = async (deleteForm) => {
    try {
        const query = {
            _id: deleteForm._id,
        }
        const response = await api.delete(`${config.public.API}/form/delete`, {
            params: { query: JSON.stringify(query) }
        });
        if (response.status === STATUS.OK) {
            $toast.success(response.data.message);
            $speak(response.data.message);
            forms.value = forms.value.filter(form => form._id != deleteForm._id);
        }
    } catch (error) {
        $toast.error('Failed to delete form');
    }
}

const closeForm = () => {
    form.isShow = false
    form.blocks = [];
    form.name = 'Draft1';
    delete form._id;
}

watch(
    () => form,
    async (newBlocks, oldBlocks) => {
        if (form.isShow) {
            await saveForm();
        }
    },
    { deep: true }
);

const saveForm = async () => {
    try {
        if (!form.name) {
            $toast.info('Form Name Required');
            $speak('Form Name');
        } else if (!form.blocks.length) {
            $toast.info('Please drag any field');
            $speak('Please drag any field');
        } else {
            const query = {
                _id: form._id,
            }
            const projection = {
                ...form,
            }
            const options = {
                new: true,
                upsert: true,
                rawResult: true,
            }
            const response = await api.post(`${config.public.API}/form/update`, {
                query: JSON.stringify(query),
                projection: JSON.stringify(projection),
                options: JSON.stringify(options),
            });
            if (response.status === STATUS.OK) {
                form._id = response.data.form._id;
                forms.value = forms.value.map(form => {
                    if (form._id == response.data.form._id) {
                        return response.data.form;
                    } else {
                        return form;
                    }
                })
            } else if (response.status === STATUS.CREATED) {
                form._id = response.data.form._id;
                forms.value.push(response.data.form);
            }
        }
    } catch (error) {
        $toast.error('Failed to save form');
    }
}

const init = async () => {
    try {
        const response = await api.get(`${config.public.API}/form/fetchs`);
        if (response.status === STATUS.OK) {
            forms.value = response.data.forms;
        }
    } catch (error) {
        $toast.error('Failed to load forms');
    }
}

onMounted(async () => {
    await init();
})
</script>

<style scoped>
/* Page Header */
.page-header {
    background: var(--background-color-two);
    border: 1px solid var(--border-color-one);
    border-radius: 0.75rem;
    padding: 1.25rem;
    margin-bottom: 1.25rem;
    transition: all 0.3s ease;
}

.page-header:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.header-left {
    flex: 1;
}

.page-title {
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--text-color-two);
    margin: 0 0 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.625rem;
}

.title-icon {
    color: var(--accent-color-primary);
}

.page-subtitle {
    font-size: 0.8125rem;
    color: var(--text-color-muted);
    margin: 0;
}

.header-right {
    display: flex;
    gap: 0.625rem;
}

/* Buttons */
.btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    height: 38px;
    padding: 0 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-color-two);
    background: linear-gradient(135deg, var(--accent-color-primary), var(--accent-color-secondary));
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.35);
}

.btn-primary:active {
    transform: translateY(0);
}

/* Content Panel */
.content-panel {
    background: var(--background-color-one);
    border: 1px solid var(--border-color-one);
    border-radius: 0.75rem;
    padding: 0;
    min-height: 300px;
    overflow: hidden;
}

/* Empty State */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    text-align: center;
}

.empty-icon {
    color: var(--text-color-muted);
    opacity: 0.4;
    margin-bottom: 1rem;
}

.empty-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-color-two);
    margin-bottom: 0.375rem;
}

.empty-text {
    color: var(--text-color-one);
    font-size: 0.875rem;
    margin-bottom: 0;
}

/* Table */
.table-container {
    overflow-x: auto;
}

.modern-table {
    width: 100%;
    border-collapse: collapse;
}

.modern-table thead {
    background: var(--background-color-two);
    position: sticky;
    top: 0;
    z-index: 10;
}

.modern-table thead tr th {
    padding: 0.875rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-color-one);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--border-color-one);
    text-align: left;
    white-space: nowrap;
}

.th-content {
    display: flex;
    align-items: center;
}

.modern-table tbody tr {
    background: var(--background-color-one);
    border-bottom: 1px solid var(--border-color-one);
    transition: background-color 0.2s ease;
}

.modern-table tbody tr:hover {
    background: var(--background-color-two);
}

.modern-table tbody tr:last-child {
    border-bottom: none;
}

.modern-table tbody tr td {
    padding: 0.75rem 1rem;
    color: var(--text-color-two);
    font-size: 0.875rem;
    vertical-align: middle;
}

.td-content {
    display: flex;
    align-items: center;
    gap: 0.625rem;
}

.form-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, var(--accent-color-primary), var(--accent-color-secondary));
    border-radius: 0.375rem;
    color: var(--text-color-two);
    flex-shrink: 0;
}

.form-name {
    font-weight: 500;
    color: var(--text-color-two);
}

.date-text {
    color: var(--text-color-one);
    font-size: 0.8125rem;
    white-space: nowrap;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--background-color-two);
    border: 1px solid var(--border-color-one);
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn-edit {
    color: var(--accent-color-primary);
}

.action-btn-edit:hover {
    background: var(--accent-color-primary);
    color: var(--text-color-two);
    border-color: var(--accent-color-primary);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.action-btn-delete {
    color: var(--error-color);
}

.action-btn-delete:hover {
    background: var(--error-color);
    color: var(--text-color-two);
    border-color: var(--error-color);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(248, 113, 113, 0.3);
}

/* Modal Styles */
.modal-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-color-two);
    margin: 0;
    display: flex;
    align-items: center;
}

.modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--background-color-three);
    border: 1px solid var(--border-color-one);
    border-radius: 0.375rem;
    color: var(--text-color-one);
    cursor: pointer;
    transition: all 0.2s ease;
}

.modal-close:hover {
    background: var(--error-color);
    border-color: var(--error-color);
    color: var(--text-color-two);
    transform: rotate(90deg);
}

/* Responsive */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .page-title {
        font-size: 1.125rem;
    }
    
    .content-panel {
        border-radius: 0.5rem;
    }
    
    .modern-table thead tr th {
        padding: 0.75rem 0.625rem;
        font-size: 0.6875rem;
    }
    
    .modern-table tbody tr td {
        padding: 0.625rem;
    }
}

@media (max-width: 576px) {
    .page-header {
        padding: 1rem;
        border-radius: 0.5rem;
    }
    
    .modern-table thead tr th,
    .modern-table tbody tr td {
        padding: 0.5rem 0.5rem;
        font-size: 0.75rem;
    }
    
    .form-icon {
        width: 28px;
        height: 28px;
    }
    
    .action-btn {
        width: 28px;
        height: 28px;
    }
    
    .td-content {
        gap: 0.5rem;
    }
}
</style>

