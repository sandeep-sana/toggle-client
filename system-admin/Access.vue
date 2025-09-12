<template>
  <div class="flex flex-col md:flex-row gap-6">
    <!-- Available Modules -->
    <div class="flex-1 bg-white border rounded-2xl shadow-sm p-5">
      <h2 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
        Available Modules
      </h2>
      <draggable 
        v-model="availableModules" 
        :group="{ name: 'modules', pull: 'clone', put: true }" 
        item-key="name"
        class="space-y-3 min-h-[200px] bg-gray-50 rounded-lg p-3"
      >
        <template #item="{ element }">
          <div
            class="p-3 rounded-lg border border-gray-200 bg-gray-100 hover:bg-gray-200 
                   transition cursor-pointer text-sm font-medium text-gray-700 shadow-sm"
          >
            {{ element }}
          </div>
        </template>
      </draggable>
    </div>

    <!-- Active Modules -->
    <div class="flex-1 bg-white border rounded-2xl shadow-sm p-5">
      <h2 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
        Active Modules
      </h2>
      <draggable 
        v-model="modules" 
        :group="{ name: 'modules', pull: true, put: true }" 
        item-key="name"
        class="space-y-3 min-h-[200px] bg-green-50 rounded-lg p-3"
      >
        <template #item="{ element }">
          <div
            class="p-3 rounded-lg border border-green-200 bg-green-100 hover:bg-green-200 
                   transition cursor-pointer text-sm font-medium text-green-800 shadow-sm"
          >
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
import { MODULE } from '../constant/module';
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

