<template>
    master id {{ path }}
</template>

<script setup>
const route = useRoute();
const path = computed(() => route.params._id);
</script>