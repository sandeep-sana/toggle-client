<template>
  <div
    class="node-wrapper"
    :class="{
      'start-node': data.label?.toLowerCase().includes('start'),
      'end-node': data.label?.toLowerCase().includes('end'),
      'task-node': !data.label?.toLowerCase().includes('start') && !data.label?.toLowerCase().includes('end'),
    }"
  >
    <!-- Input Handle -->
    <Handle
      v-if="data.allowInput"
      type="target"
      position="left"
      :style="handleStyle('input')"
    />

    <div class="node-body">
      <strong>{{ data.label }}</strong>
      <div v-if="data.taskId && !isSpecialNode" class="node-meta">
        ID: {{ data.taskId }}
      </div>
    </div>

    <!-- Output Handle -->
    <Handle
      v-if="data.allowOutput"
      type="source"
      position="right"
      :style="handleStyle('output')"
    />
  </div>
</template>

<script setup>
import { Handle } from "@vue-flow/core";
const props = defineProps(["id", "data"]);

const isSpecialNode = computed(() =>
  ["start", "end"].some((x) =>
    props.data.label?.toLowerCase().includes(x)
  )
);

const handleStyle = (type) => {
  if (props.data.label?.toLowerCase().includes("start"))
    return { background: "#2ecc71" }; // green
  if (props.data.label?.toLowerCase().includes("end"))
    return { background: "#e74c3c" }; // red
  return { background: type === "input" ? "#007bff" : "#28a745" };
};
</script>

<style scoped>
.node-wrapper {
  border-radius: 10px;
  padding: 10px;
  min-width: 160px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  color: #fff;
  position: relative;
  font-weight: 500;
}

/* 🌿 Start Node */
.start-node {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  border: 2px solid #27ae60;
}

/* 🔵 Task Node */
.task-node {
  background: #fff;
  border: 2px solid #007bff;
  color: #333;
}

/* 🔴 End Node */
.end-node {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border: 2px solid #c0392b;
}

/* Label and Meta */
.node-body {
  font-size: 14px;
}
.node-meta {
  font-size: 11px;
  color: #777;
  margin-top: 4px;
}
</style>
