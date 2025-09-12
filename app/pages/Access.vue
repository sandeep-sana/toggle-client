<template>
  <div class="flex gap-10">
    <!-- Available Modules -->
    <div class="flex-1 border p-4 rounded">
      <h2>Available Modules</h2>
      <draggable 
        v-model="availableModules" 
        :group="{ name: 'modules', pull: 'clone', put: true }" 
        item-key="name"
        class="space-y-2"
      >
        <template #item="{ element }">
          <div class="p-2 border rounded cursor-pointer bg-gray-100">
            {{ element }}
          </div>
        </template>
      </draggable>
    </div>

    <!-- Active Modules -->
    <div class="flex-1 border p-4 rounded">
      <h2>Active Modules</h2>
      <draggable 
        v-model="modules" 
        :group="{ name: 'modules', pull: true, put: true }" 
        item-key="name"
        class="space-y-2"
      >
        <template #item="{ element }">
          <div class="p-2 border rounded cursor-pointer bg-green-100">
            {{ element }}
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import draggable from "vuedraggable";
import api from '~~/api.config';
import STATUS from '~~/status';
import { MODULE } from '../../constant/module';
import { useGlobalStore } from "~/stores/global";

const modules = ref([]);               // User active modules
const availableModules = ref([]);      // Available modules to pick from
const config = useRuntimeConfig();
const { $toast } = useNuxtApp();    
const globalStore = useGlobalStore();

const init = async () => {
  try {
    const response = await api.get(`${config.public.API}/user/fetch`);
    if(response.status === STATUS.OK){
      modules.value = response.data.user.modules || [];
      
      availableModules.value = MODULE.LIST.filter(m => !modules.value.includes(m));
    }
  } catch (error) {
    console.log(error);
  }
}

onMounted(init);

const updateModule = async() => {
    const projection = {
        modules: modules.value,
    }
    try {
    const response = await api.post(`${config.public.API}/user/update`,{
        projection: JSON.stringify(projection),
    });
    if(response.status === STATUS.OK){
        $toast.success(response.data.message);
        globalStore.setIsSideHeader(!globalStore.isSideHeader);
    }
        
    } catch (error) {
        console.log(error);
    }
}

watch(modules, async (newActiveModules) => {
  availableModules.value = MODULE.LIST.filter(m => !newActiveModules.includes(m));
  await updateModule();
}, { deep: true });
</script>

