<template>
  <div class="dashboard">
    <!-- Top Header -->
    <div class="header">
      <div class="left">
        <h1><i class="ri-dashboard-fill"></i> Dashboard</h1>
      </div>
      <div class="right">
        <button type="button" v-tippy="`Add Chart`" @click="addMatrix">
          <i class="ri-function-add-fill"></i> Add Chart
        </button>
      </div>
    </div>

    <!-- Body -->
    <div class="body d-flex flex-wrap">
      <div v-for="(matrix, index) in dashboard.matrixs" :key="index" class="matrix">
        <div class="matrix-header">
          <h3>{{ matrix.label }}</h3>
          <div class="settings">
            <button type="button" @click="toggleSelect(index)">
              <i class="ri-equalizer-2-fill"></i>
            </button>

            <!-- Settings Dropdown -->
            <div v-if="matrix.showSelect" class="select-wrapper">
              <label>Select Chart Type</label>
              <select v-model="matrix.type" @change="save">
                <option value="Bar">Bar</option>
                <option value="Line">Line</option>
                <option value="Pie">Pie</option>
                <option value="Doughnut">Doughnut</option>
                <option value="Radar">Radar</option>
                <option value="Scatter">Scatter</option>
              </select>
              <label>Select Master</label>
              <select v-model="matrix.master" @change="save">
                <option value="" disabled>Select Module</option>
                <option v-for="module in dashboard.modules" :value="module._id">{{ module.label }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Chart -->
        <DynamicChart :type="matrix.type" :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May']" :datasets="[
          { label: 'Sales', backgroundColor: '#3b82f6', data: [30, 50, 40, 60, 80] },
          { label: 'Revenue', backgroundColor: '#10b981', data: [20, 40, 35, 55, 70] }
        ]" />
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "~~/api.config";
import DynamicChart from "../../../component/Chart.vue";
import { STATUS } from "~~/constant";

const config = useRuntimeConfig();
const { $session, $logout, $login, $fetchUser } = useNuxtApp();

const dashboard = reactive({
  matrixs: [],
  modules: [],
});

const toggleSelect = (index) => {
  dashboard.matrixs[index].showSelect = !dashboard.matrixs[index].showSelect;
};

const addMatrix = async () => {
  dashboard.matrixs.push({ label: "New Chart", type: "Line", showSelect: false });
  await save();
};

const save = async () => {
  try {
    console.log(dashboard)
    const query = {
      _id: $session(),
    }
    const projection = {
      _id: $session(),
      ...dashboard,
    }
    const options = {
      new: true,
      upsert: true,
      rawResult: true,
    }
    const response = await api.post(`${config.public.API}/dashboard/update`, {
      query: JSON.stringify(query),
      projection: JSON.stringify(projection),
      options: JSON.stringify(options),
    });
  } catch (error) {
    console.log(error);
  }
}
const init = async() => {
  try {
    const query = {
      _id: $session(),
    }
    const response = await api.get(`${config.public.API}/dashboard/fetch`, {
      params:{
        query: JSON.stringify(query),
      }
    });
    console.log(response)
    if(response.status === STATUS.OK){
      dashboard.matrixs = response.data.dashboard.matrixs;
    }
    
  } catch (error) {
    console.log(error);
  }
}
onMounted(async () => {
  const _id = $session();
  if (!_id) return $logout();
  await $login();
  const user = await $fetchUser();
  if (user) {
    dashboard.modules = user.modules;
  }
  await init();
});
</script>

<style scoped>
/* Dashboard Wrapper */
.dashboard {
  width: 100%;
  padding: 10px;
  background: var(--background-color-one);
  border-radius: 12px;
}

/* Top Header */
.header {
  color: var(--text-color-one);
  border: 1px solid var(--border-color-one);
  padding: 12px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--background-color-two);
  margin-bottom: 10px;
}

.left h1 {
  font-size: 22px;
  margin: 0;
  font-weight: 600;
}

.right button {
  background-color: var(--background-color-three);
  color: var(--text-color-one);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  padding: 6px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s ease;
}

.right button:hover {
  background: var(--hover-background-color-one);
}

/* Body */
.body {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

/* Chart Matrix Card */
.matrix {
  flex: 1 1 45%;
  min-width: 400px;
  max-width: 600px;
  color: var(--text-color-one);
  background: var(--background-color-two);
  border-radius: 12px;
  padding: 10px;
  border: 1px solid var(--border-color-one);
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}

/* Matrix Header */
.matrix-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.matrix-header h3 {
  font-size: 18px;
  margin: 0;
  font-weight: 500;
}

/* Settings Button */
.settings {
  position: relative;
  display: inline-block;
}

.settings button {
  background: var(--background-color-three);
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  color: var(--text-color-one);
  transition: background 0.2s ease;
}

.settings button:hover {
  background: var(--hover-background-color-one);
}

/* Dropdown */
.select-wrapper {
  position: absolute;
  top: 35px;
  right: 0;
  background: var(--background-color-one);
  border: 1px solid var(--border-color-one);
  padding: 10px;
  border-radius: 8px;
  z-index: 20;
  width: 180px;
}

.select-wrapper label {
  font-size: 12px;
  color: var(--text-color-one);
  margin-bottom: 6px;
  display: block;
}

.select-wrapper select {
  width: 100%;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid var(--border-color-one);
  background: var(--background-color-two);
  color: var(--text-color-two);
  font-size: 14px;
  outline: none;
}

.select-wrapper select:hover {
  border-color: var(--border-color-one);
}
</style>
