<template>
    <div class="home-header">
        <div class="home-header-left">
            <router-link to="/">TOGGLE</router-link>
        </div>
        <div class="home-header-right">
            <router-link to="/signup" class="button">Login / Signup</router-link>
        </div>
    </div>
</template>

<style>
.home-header {
    border: 1px solid;
    height: 50px;
    background-color: var(--primary);
    justify-content: space-between;
    display: flex;
}
.home-header-left{
    display: flex;
}
.home-header-right {
    display: flex;
}

.button {
    font-size: 16px;
    background-color: white;
    border: unset;
    padding: 10px;
    border-radius: 10px;
    margin: 5px;
    cursor: pointer;
    color: black;
}
</style>