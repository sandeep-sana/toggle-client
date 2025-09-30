<template>
  <div>
    <ToastContainer />
    <div :class="['d-flex', flexDirectionClass]">
      <HomeHeader v-if="showHomeHeader" />
      <SideHeader v-if="showSideHeader" :layout="layout" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <HeaderSetting :layout="layout" @layoutChange="layoutChange" />
    <!-- <TaskList /> -->
  </div>
</template>

<script setup>
import STATUS from "~~/status";
import api from "~~/api.config";
import { useRoute } from "vue-router";
import "vue3-toastify/dist/index.css";
import { computed, onMounted } from "vue";
import ToastContainer from "vue3-toastify";
import TaskList from "../setting/TaskList.vue";
import HeaderSetting from "../setting/Header.vue";
import HomeHeader from "~~/headers/Home-Header.vue";
import SideHeader from "~~/headers/Side-Header.vue";

const route = useRoute();
const config = useRuntimeConfig();
const { $applyTheme, $session } = useNuxtApp();


const ACCESS = ["/", "/login", "/signup"];
const showHomeHeader = computed(() => ACCESS.includes(route.fullPath));
const showSideHeader = computed(() => !ACCESS.includes(route.fullPath));
const layout = ref({
  position: 'top',
  width: 20 || 'auto',
  height: 100 || 'auto',
})

const flexDirectionClass = computed(() => {
  if (!layout.value?.position) {
    layout.value = { position: 'top' };
  }
  switch (layout.value.position) {
    case 'top':
      return 'flex-column';
    case 'left':
      return 'flex-row';
    case 'right':
      return 'flex-row-reverse';
    default:
      return 'flex-row'; // fallback
  }
});

const layoutChange = (value) => {
  layout.value = value;
}

const fetchSetting = async () => {
  try {
    const query = {
      _id: $session(),
    }
    const response = await api.get(`${config.public.API}/setting/fetch`, {
      params: {
        query: JSON.stringify(query),
      }
    });
    if (response.status === STATUS.OK) {
      // layout.value.position = response.data.setting.headerPosition || 'left';
      layout.value.position =  'left';
    }

  } catch (error) {
    console.log(error)
  }
}
onMounted(async() => {
  await fetchSetting();

})

</script>
