<template>
    <div class="task">
        <div class="header">
            <div class="left">
                <h1>Tasks</h1>
            </div>
            <div class="right">
                <button type="button" v-tippy="`Add Task`" @click="task.isShow = true"><i class="ri-presentation-line"></i></button>
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
                    <tr v-for="task in tasks">
                        <td>{{ task.name }}</td>
                        <td>{{ task.createdAt }}</td>
                        <td>{{ task.updatedAt }}</td>
                        <td>
                            <button type="button" @click="edittask(task)"><i class="ri-pencil-fill"></i></button>
                            <button type="button" @click="deletetask(task)"><i
                                    class="ri-delete-bin-6-fill"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- <div class="card">
                <p>Name</p>
            </div>
            <div class="card" v-for="task in tasks">
                <p>{{ task.name }}</p>
            </div> -->
        </div>
    </div>
    <Modal v-if="task.isShow">
        <template #header>
            <h2 class="text-center text-xl font-bold text-primary">
                <i class="fa fa-plus-circle"></i> Add Task
            </h2>
            <button type="button" @click="closetask"><i class="ri-close-fill"></i></button>
        </template>
        <template #body>
            <TaskBuilder :task="task" />
        </template>
    </Modal>
</template>

<script setup>
import { onMounted } from 'vue';
import api from '~~/api.config';
import Modal from '~~/modal/Modal.vue';
import TaskBuilder from '../../../Builder/TaskBuilder/TaskBuilder.vue';
import { STATUS } from '~~/constant';


const task = reactive({
    isShow: false,
    name: 'Draft1',
})
const tasks = ref([]);
const config = useRuntimeConfig();
const { $speak, $toast, } = useNuxtApp();


const edittask = (edittask) => {
    task.name = edittask.name;
    task.blocks = edittask.blocks;
    task.isShow = true;
    task._id = edittask._id;
}

const deletetask = async (deletetask) => {
    try {
        const query = {
            _id: task._id,
        }
        const response = await api.delete(`${config.public.API}/task/delete`, {
            
        });
        if (response.status === STATUS.OK) {
            $toast.success(response.data.message);
            $speak(response.data.message);
            tasks.value = tasks.value.filter(task => task._id != deletetask._id);
        }
    } catch (error) {
        console.log(error);
    }
}

const closetask = () => {
    task.isShow = false
    task.blocks=[];
    task.name = 'Draft1';
    delete task._id;
}

watch(
    () => task,
    async (newBlocks, oldBlocks) => {
        if(task.isShow){
            await saveTask();
        }
    },
    { deep: true }
);


const saveTask = async () => {
    try {
        if (!task.name) {
            $toast.info('task Name');
            $speak('task Name');
        } else {
            const query = {
                _id: task._id,
            }
            const projection = {
                ...task,
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
                task._id = response.data.task._id;
                tasks.value = tasks.value.map(task => {
                    if(task._id == response.data.task._id ){
                        return response.data.task;
                    }else{
                        return task;
                    }
                })
                // $toast.success(response.data.message);
                // $speak(response.data.message);
            }else if(response.status === STATUS.CREATED){
                task._id = response.data.task._id;
                tasks.value.push(response.data.task);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const init = async () => {
    try {
        const response = await api.get(`${config.public.API}/task/fetchs`);
        if (response.status === STATUS.OK) {
            tasks.value = response.data.tasks;
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
.task {
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