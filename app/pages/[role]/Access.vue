<template>
  <section class="container-xxl py-4">
    <!-- Title / Stats -->
    <header class="d-flex align-items-end justify-content-between mb-3">
      <div>
        <h1 class="h4 fw-semibold text-dark mb-1">Module Access</h1>
        <small class="text-muted">Drag between lists or click to add/remove. Auto-saves.</small>
      </div>
      <div class="d-none d-md-flex align-items-center gap-2">
        <span class="count-pill">Total: {{ MODULE.LIST.length }}</span>
        <span class="count-pill">Active: {{ modules.length }}</span>
      </div>
    </header>

    <div class="row g-4">
      <!-- Available -->
      <div class="col-12 col-md-6">
        <div class="card border rounded-4 shadow-sm panel">
          <div class="panel-header d-flex align-items-center justify-content-between px-3 py-3 border-bottom bg-white rounded-top-4 position-sticky top-0">
            <h2 class="h6 fw-semibold mb-0">Available Modules</h2>
            <div class="d-flex align-items-center">
              <button type="button" class="btn btn-outline-secondary btn-sm p-2 me-2 rounded-2"
                      :title="searchOpen ? 'Hide search' : 'Search'" @click="toggleSearch">
                <!-- search icon -->
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M20 20L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
              <div class="search-wrap" :class="{ open: searchOpen }">
                <input v-model.trim="search" type="search" class="form-control form-control-sm"
                       placeholder="Search modules" aria-label="Search modules">
              </div>
              <span class="count ms-2">{{ filteredAvailable.length }}</span>
            </div>
          </div>

          <div class="panel-subhead px-3 pt-2"><small class="text-muted">Drag to <b>Active</b> or click to add</small></div>

          <div class="panel-body p-3">
            <draggable
              v-model="availableModules"
              :group="{ name: 'modules', pull: 'clone', put: true }"
              item-key="name" animation="180"
              class="dropzone dropzone-neutral"
              ghost-class="drag-ghost" chosen-class="drag-chosen" drag-class="drag-dragging">
              <template #item="{ element }">
                <button type="button" class="chip chip-neutral text-start" @click="addModule(element)" :title="element">
                  <span class="text-truncate">{{ element }}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                </button>
              </template>
              <template #header>
                <div v-if="filteredAvailable.length === 0" class="empty">
                  <div class="fw-semibold text-dark">No modules</div>
                  <small class="text-muted">All modules are active.</small>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>

      <!-- Active -->
      <div class="col-12 col-md-6">
        <div class="card border rounded-4 shadow-sm panel">
          <div class="panel-header d-flex align-items-center justify-content-between px-3 py-3 border-bottom bg-white rounded-top-4 position-sticky top-0">
            <h2 class="h6 fw-semibold mb-0">Active Modules</h2>
            <div class="d-flex align-items-center gap-2">
              <button type="button" class="btn btn-outline-secondary btn-sm" @click="addAll">Add All</button>
              <button type="button" class="btn btn-outline-secondary btn-sm" @click="clearAll">Clear</button>
              <span class="count count-accent">{{ modules.length }}</span>
            </div>
          </div>

          <div class="panel-subhead px-3 pt-2"><small class="text-muted">Reorder to prioritize. Click to remove</small></div>

          <div class="panel-body p-3">
            <draggable
              v-model="modules"
              :group="{ name: 'modules', pull: true, put: true }"
              item-key="name" animation="180"
              class="dropzone dropzone-accent"
              ghost-class="drag-ghost" chosen-class="drag-chosen" drag-class="drag-dragging">
              <template #item="{ element }">
                <button type="button" class="chip chip-accent text-start" @click="removeModule(element)" :title="element">
                  <span class="text-truncate">{{ element }}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                </button>
              </template>
              <template #header>
                <div v-if="modules.length === 0" class="empty empty-accent">
                  <div class="fw-semibold text-dark">Drop modules here</div>
                  <small class="text-muted">Or click from Available to add.</small>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import draggable from 'vuedraggable';
import api from '~~/api.config';
import STATUS from '~~/status';
import { MODULE } from '../../../constant/module';
import { useGlobalStore } from '~/stores/global';

const modules = ref([]);
const availableModules = ref([]);
const search = ref('');
const searchOpen = ref(false);
const config = useRuntimeConfig();
const { $toast } = useNuxtApp();
const globalStore = useGlobalStore();

const filteredAvailable = computed(() => {
  const q = search.value.toLowerCase();
  return q ? availableModules.value.filter(m => m.toLowerCase().includes(q)) : availableModules.value;
});

const init = async () => {
  try {
    const r = await api.get(`${config.public.API}/user/fetch`);
    if (r.status === STATUS.OK) {
      modules.value = r.data.user.modules || [];
      availableModules.value = MODULE.LIST.filter(m => !modules.value.includes(m));
    }
  } catch (e) { console.log(e); }
};
onMounted(init);

const updateModule = async () => {
  try {
    const r = await api.post(`${config.public.API}/user/update`, {
    projection: JSON.stringify({ modules: modules.value }),
    });
    if (r.status === STATUS.OK) {
      $toast.success(r.data.message);
      globalStore.setIsSideHeader(!globalStore.isSideHeader);
    }
  } catch (e) { console.log(e); }
};

watch(modules, async (active) => {
  availableModules.value = MODULE.LIST.filter(m => !active.includes(m));
  await updateModule();
}, { deep: true });

function addModule(name) { if (!modules.value.includes(name)) modules.value = [...modules.value, name]; }
function removeModule(name) { modules.value = modules.value.filter(m => m !== name); }
function addAll() { modules.value = [...MODULE.LIST]; }
function clearAll() { modules.value = []; }
function toggleSearch() { if (!searchOpen.value) searchOpen.value = true; else if (search.value) search.value = ''; else searchOpen.value = false; }
</script>

<style scoped>
.panel{min-height:420px}
.panel-body{display:flex;flex-direction:column}
.count-pill{display:inline-flex;align-items:center;justify-content:center;height:26px;padding:0 .6rem;font-size:12px;font-weight:700;color:#495057;background:#f8f9fa;border:1px solid #dee2e6;border-radius:50rem}
.count{display:inline-flex;align-items:center;justify-content:center;min-width:26px;height:26px;padding:0 .5rem;font-size:12px;font-weight:700;color:#495057;background:#f8f9fa;border:1px solid #dee2e6;border-radius:50rem}
.count-accent{color:#0f5132;background:#e9f7ef;border-color:#c6f0d6}
.dropzone{min-height:300px;padding:.75rem;border-radius:1rem;border:1px dashed;display:grid;gap:.5rem;align-content:start;overflow:auto}
.dropzone-neutral{border-color:#dee2e6;background:#f8f9fa}
.dropzone-accent{border-color:#c6f0d6;background:#e9f7ef}
.chip{display:grid;grid-template-columns:1fr auto;align-items:center;gap:.5rem;height:40px;padding:0 .75rem;border-radius:.75rem;border:1px solid;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.05);cursor:pointer}
.chip-neutral{color:#212529;border-color:#dee2e6}
.chip-neutral:hover{background:#f8f9fa}
.chip-accent{color:#0f5132;border-color:#c6f0d6;background:#e9f7ef}
.chip-accent:hover{background:#d9f1e4}
.empty{display:grid;place-items:center;gap:.25rem;height:240px;border-radius:.75rem;background:#fff;border:1px dashed #dee2e6;text-align:center}
.empty-accent{background:#e9f7ef;border-color:#c6f0d6}
.drag-ghost{opacity:.6}
.drag-chosen{transform:translateY(-1px)}
.drag-dragging{cursor:grabbing}
.search-wrap{width:0;opacity:0;overflow:hidden;transition:width .2s ease,opacity .2s ease}
.search-wrap.open{width:14rem;opacity:1}
</style>
