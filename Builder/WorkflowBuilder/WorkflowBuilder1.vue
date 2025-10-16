<template>
  <div class="w-100 d-flex p-2">
    <!-- Workflow Canvas -->
    <div class="col-lg-9 border">
      <div
        ref="canvasRef"
        class="canvas-wrapper"
        @dragover.prevent
        @drop="onDrop"
      >
        <VueFlow
          v-model:nodes="workflow.nodes"
          v-model:edges="workflow.edges"
          :fit-view="true"
          :nodes-draggable="false"
          :nodes-connectable="true"
          connection-line-type="bezier"
          @connect="onConnect"
          @edge-click="onEdgeClick"        
          @edge-contextmenu.prevent="onEdgeRightClick"  
        >
          <!-- Special node slot -->
          <template #node-special="specialNodeProps">
            <SpecialNode v-bind="specialNodeProps" />
          </template>
        </VueFlow>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="col-lg-3 border p-2">
      <h6 class="fw-bold mb-2">Nodes</h6>

      <!-- Start Node -->
      <div
        class="border p-2 m-1 task-item"
        draggable="true"
        @dragstart="onDragStart({ name: 'Start Node', type: 'input' })"
      >
        ⏩ Start Node
      </div>

      <!-- End Node -->
      <div
        class="border p-2 m-1 task-item"
        draggable="true"
        @dragstart="onDragStart({ name: 'End Node', type: 'output' })"
      >
        🏁 End Node
      </div>

      <!-- Tasks -->
      <h6 class="fw-bold mt-3">Tasks</h6>
      <div
        v-for="task in tasks"
        :key="task.id"
        class="border p-2 m-1 task-item"
        draggable="true"
        @dragstart="onDragStart({ ...task, type: 'special' })"
      >
        {{ task.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "~~/api.config";
import { STATUS } from "~~/constant";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import SpecialNode from "./components/SpecialNode.vue";
import dagre from "dagre";

const { project } = useVueFlow();
const config = useRuntimeConfig();

const props = defineProps({
  workflow: { type: Object, default: () => ({ nodes: [], edges: [] }) },
});
const workflow = reactive(props.workflow);

const tasks = ref([]);
const draggedItem = ref(null);

/* ------------------------------------------
   Fetch Tasks
------------------------------------------ */
const init = async () => {
  try {
    const response = await api.get(`${config.public.API}/task/fetchs`);
    if (response.status === STATUS.OK) tasks.value = response.data.tasks;
  } catch (error) {
    console.log(error);
  }
};

/* ------------------------------------------
   Drag & Drop Logic
------------------------------------------ */
const onDragStart = (item) => (draggedItem.value = item);

const onDrop = (event) => {
  if (!draggedItem.value) return;

  const position = project({ x: event.clientX, y: event.clientY });
  const nodeType = draggedItem.value.type || "special";

  const allowInput = nodeType !== "input";
  const allowOutput = nodeType !== "output";

  const newNode = {
    id: `${Date.now()}`,
    type: nodeType,
    position,
    draggable: false,
    data: {
      label: draggedItem.value.name,
      taskId: draggedItem.value.id || null,
      allowInput,
      allowOutput,
    },
  };

  workflow.nodes.push(newNode);
  draggedItem.value = null;
  setTimeout(autoLayout, 50);
};

/* ------------------------------------------
   Connect Logic (Add Edge)
------------------------------------------ */
const onConnect = (connection) => {
  workflow.edges.push({
    id: `e${connection.source}-${connection.target}-${Date.now()}`,
    source: connection.source,
    target: connection.target,
    animated: true,
    style: { stroke: "#007bff" },
  });

  setTimeout(autoLayout, 50);
};

/* ------------------------------------------
   Edge Delete Logic
------------------------------------------ */
const onEdgeClick = (event, edge) => {
  event.stopPropagation(); // ✅ ensures click is captured properly
  if (confirm(`Delete connection ${edge.source} → ${edge.target}?`)) {
    workflow.edges = workflow.edges.filter((e) => e.id !== edge.id);
  }
};

// Optional: allow right-click deletion too
const onEdgeRightClick = (event, edge) => {
  event.preventDefault();
  if (confirm(`Delete this edge?`)) {
    workflow.edges = workflow.edges.filter((e) => e.id !== edge.id);
  }
};

/* ------------------------------------------
   Auto Layout (Dagre)
------------------------------------------ */
const autoLayout = () => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 100, ranksep: 100 });
  g.setDefaultEdgeLabel(() => ({}));

  workflow.nodes.forEach((n) => g.setNode(n.id, { width: 180, height: 60 }));
  workflow.edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  workflow.nodes.forEach((n) => {
    const nodeWithPos = g.node(n.id);
    n.position = {
      x: nodeWithPos.x - 90,
      y: nodeWithPos.y - 30,
    };
  });
};

onMounted(init);
</script>

<style scoped>
.canvas-wrapper {
  width: 100%;
  height: 80vh;
  background: #f9f9f9;
  border-radius: 8px;
  position: relative;
}

.task-item {
  cursor: grab;
  background: #fff;
  border-radius: 6px;
  transition: 0.2s;
  user-select: none;
}
.task-item:hover {
  background: #eef6ff;
  border-color: #007bff;
}

.border {
  border: 1px solid #ddd !important;
}

/* Make edges clickable and red on hover */
::v-deep(.vue-flow__edge-path) {
  cursor: pointer;
  transition: 0.2s;
}
::v-deep(.vue-flow__edge-path:hover) {
  stroke: #ff4d4f !important;
  stroke-width: 3px;
}
</style>
