<template>
  <div class="chart-wrapper">
    <component :is="chartComponent" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Filler
} from "chart.js";

import { Bar, Line, Pie, Doughnut, Radar, Scatter  } from "vue-chartjs";
import { computed } from "vue";

// ✅ Register all modules you might need
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Filler
);

const props = defineProps({
  type: { type: String, required: true }, // "bar", "line", "pie", "doughnut", "radar"
  labels: { type: Array, required: true },
  datasets: { type: Array, required: true },
  options: { type: Object, default: () => ({ responsive: true, maintainAspectRatio: false }) }
});

// ✅ Map chart type to vue-chartjs component
const chartComponentMap = {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  Scatter,
};

// ✅ Make it reactive so it updates when props.type changes
const chartComponent = computed(() => chartComponentMap[props.type] || Bar);

// ✅ Reactive chart data
const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets
}));

// ✅ Reactive chart options
const chartOptions = computed(() => props.options);
</script>

<style scoped>
.chart-wrapper {
  height: 400px;
}
</style>
