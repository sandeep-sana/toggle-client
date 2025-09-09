<template>
    <div>
        <div v-for="sidebar in sidebars">
            <button @click="$router.push(sidebar.path)">{{ sidebar.name }}</button>
        </div>
        <button @click="logout">Logout</button>
    </div>
</template>
<script setup>
import { useAuth } from '../function';
const { logout } = useAuth()
    const sidebars = [
        {
            name: 'Dashboard',
            path: '/dashboard',
        },
        {
            name: 'Account',
            path: '/account',
        }
    ]
</script>