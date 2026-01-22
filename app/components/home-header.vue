<template>
  <div class="home-header">
    <div class="home-header-left">
      <router-link to="/">TOGGLE</router-link>
    </div>
    <div class="home-header-components">
      <router-link v-for="module in modules"
        :to="`${activeRole ? '/' + activeRole.toLowerCase() : ''}/${module.path.toLowerCase()}`">
        {{module.label.toLowerCase() }}</router-link>
    </div>
    <div class="home-header-right">
      <router-link to="/signup" class="button">Login / Signup</router-link>
    </div>
  </div>
</template>

<script setup>
import api from '~/api.config';
import { MODULES, STATUS } from '~/constant';

const config = useRuntimeConfig();

const modules = ref([]);
const activeRole = ref(null);




const fetchModules = async () => {
  try {
    const query = {};
    const projection = {
      modules: 1,
      activeRole: 1,
    };
    const response = await api.get(`${config.public.API}/user/fetch`);
    console.log(response)
    if (response.status === STATUS.OK) {
      modules.value = response.data.user.modules;
      activeRole.value = response.data.user.activeRole;
    }
  } catch (error) {
    if (error.status === STATUS.NOT_FOUND) {
      modules.value = MODULES.SUPER_ADMIN;
    }
  }
}

onMounted(async () => {
  await fetchModules();
})
</script>


<style>
.home-header {
  border: 1px solid;
  height: 50px;
  background-color: var(--primary);
  justify-content: space-between;
  display: flex;
}

.home-header-left {
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