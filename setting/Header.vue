<template>
  <div
    class="layout-fab"
    :class="{ open: isOpen }"
    role="region"
    aria-label="Layout control"
    draggable="true"
    @dragstart="dragStart"
    @dragend="dragEnd"
    :style="{ top: position.y + 'px', left: position.x + 'px' }"
  >
    <div class="fab-shell" ref="shell">
      <button
        class="fab-toggle"
        type="button"
        :aria-expanded="isOpen"
        :aria-controls="ids.panel"
        @click="toggle"
        title="Header layout"
      >
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="4" width="18" height="3" rx="1" />
          <rect x="3" y="9.5" width="10" height="8" rx="1.5" opacity=".35" />
        </svg>
        <span class="fab-label" v-if="isOpen">Header Position</span>
      </button>
      <div class="divider" v-if="isOpen" aria-hidden="true"></div>
      <div class="fab-content" :id="ids.panel">
        <select
          id="position"
          name="position"
          class="mini-select"
          v-model="layout.position"
          @change="save"
        >
          <option value="top">Top</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import STATUS from '~~/status';
import api from '~~/api.config';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({ layout: { type: Object } });
const emit = defineEmits(['layoutChange']);
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();

const isOpen = ref(false);
const shell = ref(null);
const uid = Math.random().toString(36).slice(2);
const ids = { panel: `layout-panel-${uid}` };

function toggle() { isOpen.value = !isOpen.value; }
function onKeydown(e) { if (e.key === 'Escape' && isOpen.value) isOpen.value = false; }
function onClickOutside(e) { if (shell.value && !shell.value.contains(e.target)) isOpen.value = false; }

// ---- Draggable state ----
const position = ref({ x: 1480, y: 16 }); // default position (top-left)
let offset = { x: 0, y: 0 };

const dragStart = (event) => {
  offset.x = event.clientX - position.value.x;
  offset.y = event.clientY - position.value.y;
};

const dragEnd = (event) => {
  position.value = {
    x: event.clientX - offset.x,
    y: event.clientY - offset.y,
  };
};

// ---- Save / Load ----
const save = async () => {
  const projection = { layout: props.layout };
  try {
    const res = await api.post(`${config.public.API}/user/update`, { projection: JSON.stringify(projection) });
    if (res.status === STATUS.OK) $toast.success(res.data.message);
  } catch (err) { console.log(err); }
};

const init = async () => {
  try {
    const res = await api.get(`${config.public.API}/user/fetch`);
    if (res.status === STATUS.OK) emit('layoutChange', res.data.user.layout);
  } catch (err) { console.log(err); }
};

onMounted(() => {
  init();
  document.addEventListener('keydown', onKeydown);
  document.addEventListener('click', onClickOutside, true);
});
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
  document.removeEventListener('click', onClickOutside, true);
});
</script>



<style scoped>
.layout-fab {
  position: fixed;
  z-index: 1060;
  color: #111;
  font-family: inherit;
}

.fab-shell {
  --radius: 12px;
  display: inline-flex;
  align-items: center;
  height: 44px;
  gap: 8px;
  padding: 4px;
  width: 48px;                    /* closed */
  background: #fff;
  border: 1px solid #e5e7eb;      /* subtle border */
  border-radius: var(--radius);
  box-shadow: 0 4px 16px rgba(0,0,0,.08);
  overflow: hidden;
  transition: width .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.open .fab-shell {
  width: 300px;
  box-shadow: 0 8px 28px rgba(0,0,0,.10);
  border-color: #e5e7eb;
}

.fab-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 10px;
  background: transparent;
  border: 0;
  border-radius: 10px;
  color: #111;
  cursor: pointer;
}
.fab-toggle:focus-visible {
  outline: 2px solid #111;
  outline-offset: 2px;
}
.icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 1.5;
  fill: currentColor; /* header bar uses fill; content rect has opacity */
}
.fab-label {
  font-size: 13px;
  color: #6b7280; /* muted */
  font-weight: 600;
}
.divider {
  width: 1px;
  height: 24px;
  background: #e5e7eb;
}
.fab-content {
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  gap: 8px;
  opacity: 0;
  transform: translateX(6px);
  pointer-events: none;
  transition: opacity .14s ease, transform .14s ease;
}
.open .fab-content {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}
.mini-select {
  height: 32px;
  min-width: 80px;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #111;
  font-size: 14px;
  line-height: 1.2;
}
.mini-select:focus {
  outline: 2px solid #111;
  outline-offset: 1px;
  border-color: #111;
}
.visually-hidden {
  position: absolute !important;
  height: 1px; width: 1px;
  overflow: hidden; clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap; border: 0; padding: 0; margin: -1px;
}
@media (max-width: 480px) {
  .open .fab-shell { width: min(92vw, 340px); }
  .fab-shell { height: 42px; }
  .fab-toggle { height: 34px; }
  .mini-select { min-width: 140px; }
}
</style>
