<template>
  <component :is="currentComponent" />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import Role from "~~/system-admin/Role.vue";
import Access from "~~/system-admin/Access.vue";
import Dashboard from "../../system-admin/Dashboard.vue";
import Department from "../../system-admin/Department.vue";

const route = useRoute();
const path = computed(() => route.params.path);

const componentMap = {
  access: Access,
  dashboard: Dashboard,
  department: Department,
  role: Role,
};

const currentComponent = computed(() => {
  return componentMap[path.value?.toLowerCase()] || null;
});
</script>
