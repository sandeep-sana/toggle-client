<template>
    <div class="form">
        <div class="header">
            <div class="left">
                <h1>Tasks</h1>
            </div>
            <div class="right">
                <button type="button" v-tippy="`Add Task`" @click="workflow.isShow = true"><i class="ri-presentation-line"></i></button>
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
                    <tr v-for="form in forms">
                        <td>{{ form.name }}</td>
                        <td>{{ form.createdAt }}</td>
                        <td>{{ form.updatedAt }}</td>
                        <td>
                            <button type="button" @click="editForm(form)"><i class="ri-pencil-fill"></i></button>
                            <button type="button" @click="deleteForm(form)"><i
                                    class="ri-delete-bin-6-fill"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- <div class="card">
                <p>Name</p>
            </div>
            <div class="card" v-for="form in forms">
                <p>{{ form.name }}</p>
            </div> -->
        </div>
    </div>
    <Modal v-if="workflow.isShow">
        <template #header>
            <h2 class="text-center text-xl font-bold text-primary">
                <i class="fa fa-plus-circle"></i> Add Task
            </h2>
            <button type="button" @click="closeForm"><i class="ri-close-fill"></i></button>
        </template>
        <template #body>
            <WorkflowBuilder :workflow="workflow" />
        </template>
    </Modal>
</template>

<script setup>
import { onMounted } from 'vue';
import api from '~~/api.config';
import Modal from '~~/modal/Modal.vue';
import WorkflowBuilder from '../../../Builder/WorkflowBuilder/WorkflowBuilder.vue';
import { STATUS } from '~~/constant';


const workflow = reactive({
    isShow: false,
    name: 'Draft1',
    nodes:[],
    edges:[],
})
const forms = ref([]);
const tasks = ref([]);
const config = useRuntimeConfig();
const { $speak, $toast, } = useNuxtApp();


const editForm = (editForm) => {
    workflow.name = editForm.name;
    workflow.blocks = editForm.blocks;
    workflow.isShow = true;
    workflow._id = editForm._id;
}

const deleteForm = async (deleteForm) => {
    try {
        const query = {
            _id: workflow._id,
        }
        const response = await api.delete(`${config.public.API}/form/delete`, {
            
        });
        if (response.status === STATUS.OK) {
            $toast.success(response.data.message);
            $speak(response.data.message);
            forms.value = forms.value.filter(form => form._id != deleteForm._id);
        }
    } catch (error) {
        console.log(error);
    }
}

const closeForm = () => {
    workflow.isShow = false
    workflow.blocks=[];
    workflow.name = 'Draft1';
    delete workflow._id;
}

watch(
    () => workflow,
    async (newBlocks, oldBlocks) => {
        if(workflow.isShow){
            await saveTask();
        }
    },
    { deep: true }
);


const saveTask = async () => {
    try {
        if (!workflow.name) {
            $toast.info('Form Name');
            $speak('Form Name');
        } else {
            const query = {
                _id: workflow._id,
            }
            const projection = {
                ...workflow,
            }
            const options = {
                new: true,
                upsert: true,
                rawResult: true,
            }
            const response = await api.post(`${config.public.API}/task/update`, {
                query: JSON.stringify(query),
                projection: JSON.stringify(projection),
                options: JSON.stringify(options),
            });
            if (response.status === STATUS.OK) {
                workflow._id = response.data.task._id;
                forms.value = forms.value.map(task => {
                    if(task._id == response.data.task._id ){
                        return response.data.task;
                    }else{
                        return task;
                    }
                })
                // $toast.success(response.data.message);
                // $speak(response.data.message);
            }else if(response.status === STATUS.CREATED){
                workflow._id = response.data.task._id;
                forms.value.push(response.data.task);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const init = async () => {
    try {
        const response = await api.get(`${config.public.API}/form/fetchs`);
        if (response.status === STATUS.OK) {
            forms.value = response.data.forms;
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
.form {
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