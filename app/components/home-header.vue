<template>
    <div class="home-header">
        <div class="home-header-left">
            <router-link to="/">TOGGLE</router-link>
        </div>
         <div class="home-header-components">
          <router-link to="/">Product</router-link>
          <router-link to="/">Solution</router-link>
          <router-link to="/">Templates</router-link>
          <router-link to="/">Demo</router-link>
          <router-link to="/">Pricing</router-link>
          <router-link to="/">Resources</router-link>
          <router-link to="/">About</router-link>
          <router-link to="/">Contact</router-link>
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

.home-header-components {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Router links */
.home-header-components a {
  text-decoration: none;
  color: #333;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.4rem 0;
  position: relative;
  transition: color 0.2s ease;
}

.home-header-components a:hover {
  color: #fdfdff;
}

.home-header-components a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 0%;
  height: 2px;
  background-color: var(--primary);
  transition: width 0.25s ease;
}

.home-header-components a:hover::after {
  width: 100%;
}

.home-header-components .router-link-active::after {
  width: 100%;
}

</style>