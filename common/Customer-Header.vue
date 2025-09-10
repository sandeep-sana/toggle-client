<template>
    <div>
        <div v-for="sidebar in sidebars">
            <button @click="$router.push(sidebar.path)">{{ sidebar.name }}</button>
        </div>
        <button @click="logout">Logout</button>
    </div>
</template>
<script setup>
import { subDomain, useAuth } from '../function';

const dbName = ref(null);
const { logout } = useAuth();

const sidebars = [
    {
        name: 'Dashboard',
        path: '/dashboard',
    },
    
]
const init = () => {
    const domain = subDomain();
    dbName.value = domain;
}

onMounted(init);
</script>