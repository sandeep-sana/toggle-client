<template>
system admin dashboard
</template>
<script setup>
const { $session, $speak } = useNuxtApp();


onMounted(() => {
    $session();
    $speak('hello')
});
</script>