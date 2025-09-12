<template>
  <component :is="currentComponent" />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import Account from "../../super-admin/Account.vue";
import Dashboard from "../../super-admin/Dashboard.vue";
import BlockAccount from "~~/super-admin/Block-Account.vue";
import AcceptAccount from "~~/super-admin/Accept-Account.vue";
import RejectAccount from "../../super-admin/Reject-Account.vue";

const route = useRoute();
const path = computed(() => route.params.path);

const componentMap = {
  account: Account, 
  dashboard: Dashboard,
  'block-account': BlockAccount,
  'reject-account': RejectAccount,
  'accept-account': AcceptAccount,
};

const currentComponent = computed(() => {
  return componentMap[path.value?.toLowerCase()] || null;
});
</script>
