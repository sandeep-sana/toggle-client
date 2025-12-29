<template>
  <div class="tool-wrapper">

    <!-- TOP TABS -->
    <div class="top">
      <button v-for="tab in tabs" :key="tab.key" :class="['tool-tab', { active: tools.activeTool === tab.key }]"
        @click="tools.activeTool = tab.key">
        {{ tab.label }}
      </button>
    </div>

    <!-- TOOL LIST -->
    <div class="bottom">
      <div v-for="tool in activeToolList" :key="tool.attribute?.label" class="blocks" draggable="true"
        @dragstart="(event) => $onDragStart(event, tool)">
        <div class="block-left">
          <i :class="tool.icon"></i>
        </div>

        <div class="block-right">
          <h3>{{ tool.attribute.label }}</h3>
          <p class="tool-description">{{ tool.description }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { FORM_BUILDER } from "../constant";

const { $onDragStart } = useNuxtApp();

const tools = reactive({
  activeTool: "FIELDS",
});

// Tabs definition
const tabs = [
  { key: "FIELDS", label: "Fields" },
  { key: "STATIC", label: "Static" },
  { key: "STRUCTURES", label: "Structure" },
];

// Computed list based on active tab
const activeToolList = computed(() => {
  return FORM_BUILDER.TOOLS[tools.activeTool] || [];
});
</script>

<style scoped>
.tool-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ----------------- TOP SECTION ----------------- */
.top {
  display: flex;
  gap: 10px;
  padding: 10px;
}

.tool-tab {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid var(--border-color-one);
  background-color: var(--background-color-two);
  color: var(--text-color-one);
  cursor: pointer;
  transition: 0.25s ease-in-out;
}

.tool-tab:hover {
  background-color: var(--background-color-hover);
}

.tool-tab.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  font-weight: 600;
}

/* ----------------- TOOL BLOCKS LIST ----------------- */
.bottom {
  padding: 10px;
  overflow-y: auto;
  max-height: calc(100vh - 150px);
}

/* Each Block */
.blocks {
  display: flex;
  padding: 12px;
  background-color: var(--background-color-two);
  border: 1px solid var(--border-color-one);
  border-radius: 10px;
  margin-bottom: 12px;
  cursor: grab;
  transition: 0.25s ease-in-out;
}

.blocks:active {
  cursor: grabbing;
}

.blocks:hover {
  background-color: var(--background-color-hover);
  transform: scale(1.02);
}

/* Left icon box */
.block-left {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  width: 40px;
  height: 40px;
  margin-right: 12px;
  border-radius: 8px;
  background-color: var(--background-color-three);
  border: 1px solid var(--border-color-one);
}

.block-left i {
  font-size: 18px;
}

/* Right text area */
.block-right h3 {
  font-size: 16px;
  margin: 0;
  font-weight: 600;
}

.block-right p {
  margin: 3px 0 0;
  font-size: 12px;
  color: var(--text-color-two);
}

.tool-description {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 160px;
}
</style>
