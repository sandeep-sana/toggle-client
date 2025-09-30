<template>
    home
</template>
<script setup>
const { $session, $logout, $login } = useNuxtApp();
onMounted(async () => {
    const _id = $session();
    if (!_id) return $logout();
    await $login();
});
</script>