<template>
  <div class="task-container">
    <h1>Task List</h1>
    <div class="task">
      <ul class="task-item" v-for="(task, taskIndex) in taskList.tasks">
        <li @click="speaker(task)">
          <p>{{ ++taskIndex }}.</p>
          <p class="task-name" v-tippy="`${task.name}`">{{task.name}}</p>
          <p class="pending" v-if="!task.status">
            <i v-tippy="'pending task'" class="ri-information-line"></i>
          </p>
          <p class="complete" v-else>
            <i v-tippy="'completed task'" class="ri-checkbox-circle-line"></i>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import STATUS from '~~/status';
import { onMounted } from 'vue';
import api from '~~/api.config';
import { useRouter, useRoute } from 'vue-router';
import { useGlobalStore } from '~/stores/global';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const globalStore = useGlobalStore();
const { $speak, $session } = useNuxtApp();

const taskList = reactive({
  tasks: [],
  user: null,
})

const initTasks = async () => {
  try {
    const query = {
      userId: $session(),
    }
    const response = await api.get(`${config.public.API}/task/fetchs`, {
      params: {
        query: JSON.stringify(query),
      }
    });
    if (response.status === STATUS.OK) {
      taskList.tasks = response.data.task.tasks;
    }

  } catch (error) {
    console.log(error);
  }
}
const initUser = async () => {
  try {
    const response = await api.get(`${config.public.API}/user/fetch`);
    if (response.status === STATUS.OK) {
      taskList.user = response.data.user;
    }

  } catch (error) {
    console.log(error);
  }
}

const updateTask = async(task) => {
  try {
    const query = {
      'tasks._id': task._id,
    }
    const projection = {
      $set: { "tasks.$.status": true } 
    }
    const response = await api.post(`${config.public.API}/task/update`,{
      query: JSON.stringify(query),
      projection: JSON.stringify(projection),
    });
    
  } catch (error) {
    console.log(error);
  }
}

watch(() => globalStore.isLogin, async () => {
  await initUser();
  await initTasks();
})

watch(route, async(newRoute) => {
  console.log(newRoute)  // Log the entire route object
  taskList.tasks.forEach(async task => {
    if(task.path){
      if(newRoute.path.includes(task.path)){
        await updateTask(task);
        task.status = true;
      }
    }
  })
})

onMounted(async () => {
  await initUser();
  await initTasks();
})

const speaker = (task) => {
  console.log(taskList)
  if(!task.status){
    $speak(task.name)
    if(task.path){
      router.push(`/${taskList.user.role.toLowerCase()}/${task.path}`)
    }
  }
} 

</script>


<style scoped>
.task-container {
  position: absolute;
  bottom: 5px;
  right: 5px;
  height: 300px;
  border: 1px solid var(--border-color);
  width: 300px;
  border-radius: 10px;
  background: #0c234d;
}

.task-container h1 {
  color: var(--text-color);
  font-size: 30px;
  text-align: center;
  padding: 0;
  margin: 0;
}

.task-container .task {
  border: 1px solid var(--border-color);
  width: 90%;
  height: calc(100% - 42px);
  margin: auto;
  border-radius: 10px;
}

.task-item {
  color: var(--text-color);
  width: 100%;
  padding: 0 10px;
  margin: 0;
}

.task-item li {
  margin: 5px 0;
  padding: 0;
  border: 1px solid var(--border-color);
  list-style: none;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}

.task-item li .task-name {
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 170px;
  overflow: hidden;
}

.task-item li:hover {
  background-color: var(--hover-background-color);
  color: var(--hover-color);
}

.task-icon {
  font-size: 24px;
  /* Adjust icon size */
  color: var(--text-color);
  /* Adjust color */
}

.pending {
  color: var(--pending-color);
}
.complete {
  color: var(--complete-color);
}
</style>
