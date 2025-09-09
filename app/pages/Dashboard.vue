<template>

</template>
<script setup>
import { useAuth } from '../../function';

const router = useRouter();
const { session } = useAuth();

onMounted(session);
</script>