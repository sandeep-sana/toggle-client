<template>
  <section class="container-xxl py-4">
    <!-- Title / Stats -->
    <header class="d-flex align-items-end justify-content-between mb-4">
      <div>
        <h1 class="h3 fw-bold mb-1" style="color: var(--text-color-two)">Module Access</h1>
        <small style="color: var(--text-color-one)">Drag between lists or click to add/remove. Auto-saves.</small>
      </div>
      <div class="d-none d-md-flex align-items-center gap-3">
        <span class="count-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Total: {{ totalModules }}
        </span>
        <span class="count-pill count-pill-accent">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Active: {{ modules.length }}
        </span>
      </div>
    </header>

    <div class="row g-4">
      <!-- Available -->
      <div class="col-12 col-lg-6">
        <div class="panel">
          <div class="panel-header">
            <div class="d-flex align-items-center justify-content-between">
              <h2 class="panel-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="me-2">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Available Modules
              </h2>
              <div class="d-flex align-items-center gap-2">
                <button type="button" class="icon-btn" :title="searchOpen ? 'Hide search' : 'Search'" @click="toggleSearch">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M20 20L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
                <div class="search-wrap" :class="{ open: searchOpen }">
                  <input v-model.trim="search" type="search" class="search-input" placeholder="Search modules..." aria-label="Search modules">
                </div>
                <span class="badge-count">{{ displayedAvailable.length }}</span>
              </div>
            </div>
            <p class="panel-hint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="me-1">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Drag to <strong>Active</strong> or click to add
            </p>
          </div>

          <div class="panel-body">
            <draggable
              v-model="availableModules"
              :group="{ name: 'modules', pull: true, put: true }"
              item-key="value" 
              animation="200"
              class="dropzone dropzone-neutral"
              ghost-class="drag-ghost" 
              chosen-class="drag-chosen" 
              drag-class="drag-dragging"
              @change="handleAvailableChange">
              <template #item="{ element }">
                <button 
                  v-show="isModuleVisible(element)"
                  type="button" 
                  class="module-chip module-chip-neutral" 
                  :title="element.label"
                  @click="addModule(element.value)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="chip-icon">
                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <span class="chip-label">{{ element.label }}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="chip-action">
                    <path d="M12 6v12m6-6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </template>
              <template #header>
                <div v-if="displayedAvailable.length === 0" class="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" class="empty-icon">
                    <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <div class="empty-title">No modules available</div>
                  <small class="empty-text">{{ search ? 'No matching modules found' : 'All modules are active' }}</small>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>

      <!-- Active -->
      <div class="col-12 col-lg-6">
        <div class="panel panel-accent">
          <div class="panel-header">
            <div class="d-flex align-items-center justify-content-between">
              <h2 class="panel-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="me-2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Active Modules
              </h2>
              <div class="d-flex align-items-center gap-2">
                <button type="button" class="action-btn" @click="addAll" :disabled="availableModules.length === 0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 6v12m6-6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Add All
                </button>
                <button type="button" class="action-btn action-btn-danger" @click="clearAll" :disabled="modules.length === 0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Clear
                </button>
                <span class="badge-count badge-count-accent">{{ modules.length }}</span>
              </div>
            </div>
            <p class="panel-hint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="me-1">
                <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Reorder to prioritize. Click to remove
            </p>
          </div>

          <div class="panel-body">
            <draggable
              v-model="modules"
              :group="{ name: 'modules', pull: true, put: true }"
              item-key="value" 
              animation="200"
              class="dropzone dropzone-accent"
              ghost-class="drag-ghost" 
              chosen-class="drag-chosen" 
              drag-class="drag-dragging"
              @change="handleActiveChange">
              <template #item="{ element }">
                <button type="button" class="module-chip module-chip-accent" :title="element.label" @click="removeModule(element.value)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="chip-icon">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <span class="chip-label">{{ element.label }}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="chip-action">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </template>
              <template #header>
                <div v-if="modules.length === 0" class="empty-state empty-state-accent">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" class="empty-icon">
                    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <div class="empty-title">Drop modules here</div>
                  <small class="empty-text">Or click from Available to add</small>
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
import { ref, onMounted, computed } from 'vue';
import draggable from 'vuedraggable';
import api from '~~/api.config';
import STATUS from '~~/status';
import { MODULE } from '../../../constant/module';
import { useGlobalStore } from '~/stores/global';

const modules = ref([]);
const availableModules = ref([]);
const masterModules = ref([]);
const search = ref('');
const searchOpen = ref(false);
const config = useRuntimeConfig();
const { $toast } = useNuxtApp();
const globalStore = useGlobalStore();

const totalModules = computed(() => MODULE.LIST.length + masterModules.value.length);

function isModuleVisible(module) {
  if (!search.value) return true;
  return module.label.toLowerCase().includes(search.value.toLowerCase());
}

const displayedAvailable = computed(() => {
  if (!search.value) return availableModules.value;
  return availableModules.value.filter(m => isModuleVisible(m));
});

function handleAvailableChange(evt) {
  if (evt.added || evt.removed) {
    saveModules();
  }
}

function handleActiveChange(evt) {
  if (evt.removed || evt.added) {
    saveModules();
  }
}

const init = async () => {
  try {
    const r = await api.get(`${config.public.API}/user/fetch`);
    if (r.status === STATUS.OK) {
      modules.value = (r.data.user.modules || []).map(m => ({
        label: m.label || m,
        path: m.path || '',
        value: m.value || m._id,
      }));

      availableModules.value = MODULE.LIST.filter(m =>
        !modules.value.some(active => active.path === m.path)
      );
    }
  } catch (e) {
    $toast.error('Failed to load modules');
  }
};

const initMaster = async () => {
  try {
    const projection = { name: 1 };
    const response = await api.get(`${config.public.API}/master/fetchs`, {
      params: { projection: JSON.stringify(projection) },
    });
    if (response.status === STATUS.OK) {
      masterModules.value = response.data.masters.map(el => ({
        label: el.name,
        value: el._id,
        path: 'master'
      }));
    }
  } catch (error) {
    $toast.error('Failed to load master modules');
  }
};

let saveTimeout = null;
const saveModules = async () => {
  if (saveTimeout) clearTimeout(saveTimeout);
  
  saveTimeout = setTimeout(async () => {
    try {
      const r = await api.post(`${config.public.API}/user/update`, {
        projection: JSON.stringify({ modules: modules.value }),
      });
      if (r.status === STATUS.OK) {
        $toast.success(r.data.message);
        globalStore.setIsSideHeader(!globalStore.isSideHeader);
      }
    } catch (e) {
      $toast.error('Failed to save modules');
    }
  }, 500);
};

function addModule(value) {
  const alreadyActive = modules.value.some(m => m.value === value);
  if (alreadyActive) return;
  
  const modIndex = availableModules.value.findIndex(m => m.value === value);
  if (modIndex > -1) {
    const mod = availableModules.value.splice(modIndex, 1)[0];
    modules.value.push({...mod});
    saveModules();
  }
}

function removeModule(value) {
  const mod = modules.value.find(m => m.value === value);
  if (mod) {
    modules.value = modules.value.filter(m => m.value !== value);
    availableModules.value.push({...mod});
    saveModules();
  }
}

function addAll() {
  modules.value.push(...availableModules.value.map(m => ({...m})));
  availableModules.value = [];
  saveModules();
}

function clearAll() {
  availableModules.value.push(...modules.value.map(m => ({...m})));
  modules.value = [];
  saveModules();
}

function toggleSearch() {
  if (!searchOpen.value) searchOpen.value = true;
  else if (search.value) search.value = '';
  else searchOpen.value = false;
}

onMounted(async () => {
  await Promise.all([init(), initMaster()]);
});
</script>

<style scoped>
/* Panel */
.panel {
  min-height: 460px;
  background: var(--background-color-one);
  border: 1px solid var(--border-color-one);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.panel:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.panel-accent {
  border-color: var(--accent-color-primary);
  box-shadow: 0 0 0 1px var(--accent-color-primary);
}

/* Panel Header */
.panel-header {
  background: var(--background-color-two);
  border-bottom: 1px solid var(--border-color-one);
  padding: 1.25rem 1.5rem 1rem;
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color-two);
  margin: 0;
  display: flex;
  align-items: center;
}

.panel-hint {
  font-size: 0.75rem;
  color: var(--text-color-muted);
  margin: 0.5rem 0 0;
  display: flex;
  align-items: center;
}

/* Panel Body */
.panel-body {
  padding: 1rem;
  min-height: 360px;
}

/* Count Pills */
.count-pill {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-color-two);
  background: var(--background-color-two);
  border: 1px solid var(--border-color-one);
  border-radius: 2rem;
  transition: all 0.2s ease;
}

.count-pill-accent {
  background: linear-gradient(135deg, var(--accent-color-primary), var(--accent-color-secondary));
  border-color: var(--accent-color-primary);
  color: var(--text-color-two);
}

/* Badges */
.badge-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-color-two);
  background: var(--background-color-three);
  border: 1px solid var(--border-color-one);
  border-radius: 50%;
}

.badge-count-accent {
  background: var(--complete-color-one);
  color: var(--background-color-one);
  border-color: var(--complete-color-one);
}

/* Buttons */
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: var(--background-color-three);
  border: 1px solid var(--border-color-one);
  border-radius: 0.5rem;
  color: var(--text-color-one);
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: var(--hover-background-color-one);
  color: var(--text-color-two);
  transform: translateY(-1px);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  height: 32px;
  padding: 0 0.875rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-color-two);
  background: var(--background-color-three);
  border: 1px solid var(--border-color-one);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover:not(:disabled) {
  background: var(--hover-background-color-one);
  transform: translateY(-1px);
}

.action-btn-danger:hover:not(:disabled) {
  background: var(--error-color);
  border-color: var(--error-color);
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Search */
.search-wrap {
  width: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-wrap.open {
  width: 200px;
  opacity: 1;
}

.search-input {
  width: 100%;
  height: 32px;
  padding: 0 0.75rem;
  font-size: 0.8125rem;
  color: var(--text-color-two);
  background: var(--background-color-one);
  border: 1px solid var(--border-color-one);
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: var(--text-color-muted);
}

.search-input:focus {
  border-color: var(--accent-color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Dropzone */
.dropzone {
  min-height: 320px;
  padding: 0.75rem;
  border: 2px dashed var(--border-color-one);
  border-radius: 0.75rem;
  background: var(--background-color-one);
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.dropzone-neutral:not(:empty) {
  background: linear-gradient(135deg, var(--background-color-one) 0%, var(--background-color-two) 100%);
}

.dropzone-accent {
  border-color: var(--accent-color-primary);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, var(--background-color-one) 100%);
}

/* Module Chips */
.module-chip {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.625rem;
  min-height: 44px;
  padding: 0.625rem 0.875rem;
  background: var(--background-color-two);
  border: 1px solid var(--border-color-one);
  border-radius: 0.625rem;
  color: var(--text-color-two);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.module-chip:hover {
  background: var(--background-color-three);
  border-color: var(--hover-background-color-one);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.module-chip-accent {
  border-left: 3px solid var(--complete-color-one);
}

.module-chip-accent:hover {
  border-left-color: var(--accent-color-secondary);
}

.chip-icon {
  color: var(--text-color-one);
  flex-shrink: 0;
}

.chip-label {
  text-align: left;
  font-size: 0.875rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chip-action {
  color: var(--text-color-muted);
  opacity: 0;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.module-chip:hover .chip-action {
  opacity: 1;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: 280px;
  padding: 2rem;
  text-align: center;
}

.empty-icon {
  color: var(--text-color-muted);
  opacity: 0.5;
}

.empty-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color-two);
}

.empty-text {
  color: var(--text-color-muted);
  font-size: 0.8125rem;
}

.empty-state-accent .empty-icon {
  color: var(--accent-color-primary);
}

/* Drag States */
.drag-ghost {
  opacity: 0.5;
  transform: rotate(3deg) scale(1.02);
}

.drag-chosen {
  transform: scale(1.03);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  border-color: var(--accent-color-primary);
}

.drag-dragging {
  cursor: grabbing;
  opacity: 0.85;
  transform: rotate(-2deg);
}

/* Responsive */
@media (max-width: 991px) {
  .panel {
    min-height: 400px;
  }
  
  .search-wrap.open {
    width: 160px;
  }
}
</style>
