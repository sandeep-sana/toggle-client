<template>
  <component :is="currentComponent" />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import Access from "~~/system-admin/Access.vue";
import Dashboard from "../../system-admin/Dashboard.vue";

const route = useRoute();
const path = computed(() => route.params.path);

const componentMap = {
  access: Access,
  dashboard: Dashboard,
};

const currentComponent = computed(() => {
  return componentMap[path.value?.toLowerCase()] || null;
});
</script>
