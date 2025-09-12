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
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import "vue3-toastify/dist/index.css";
import ToastContainer from "vue3-toastify";
import HomeHeader from "~~/headers/Home-Header.vue";
import SideHeader from "~~/headers/Side-Header.vue";

const route = useRoute();
const ACCESS = ["/", "/login", "/signup"];
const showHomeHeader = computed(() => ACCESS.includes(route.fullPath));
const showSideHeader = computed(() => !ACCESS.includes(route.fullPath));

const layout = reactive({
  position: 'top',
  width: 20 || 'auto',
  height: 100 || 'auto',
})

const flexDirectionClass = computed(() => {
  switch (layout.position) {
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

</script>
