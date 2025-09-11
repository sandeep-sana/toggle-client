<template>
  <div>
    <ToastContainer />
    <HomeHeader v-if="showHomeHeader" />
    <SideHeader v-if="showSideHeader" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
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
</script>
