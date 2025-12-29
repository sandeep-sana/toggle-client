<template>
    <div class="header">
        <div class="header-left">
            <router-link to="/">Toggle</router-link>
            <router-link to="/">Home</router-link>
            <router-link to="/product">Product</router-link>
            <router-link to="/solution">Solution</router-link>
            <router-link to="template">Templates</router-link>
            <router-link to="/demo">Demo</router-link>
            <router-link to="/pricing">Pricing </router-link>
            <router-link to="/resources">Resources </router-link>
            <router-link to="/about">About</router-link>
            <router-link to="/contact">Contact</router-link>
        </div>
        <div class="header-right">
            <router-link to="/signup">Sign Up</router-link>
            <router-link to="/login">Login</router-link>
        </div>

    </div>
</template>

<script setup>

</script>

<style scoped>
.header {
    border: 1px solid var(--border-color-one);
    padding: 10px;
    display: flex;
}
.header-left{
    display: flex;
    width: 70%;
    a{
        padding: 0 10px;
    }
}
.header-right{
    display: flex;
    width: 30%;
    justify-content: end;
    a{
        padding: 0 10px;
    }
}
</style>