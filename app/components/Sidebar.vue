<template>
  <aside class="sidebar" aria-label="App navigation">
    <div class="sidebar__brand">
      <NuxtLink :to="homeHref" class="sidebar__logo" aria-label="Toggle home">
        <span class="sidebar__mark" aria-hidden="true" />
        <span class="sidebar__brand-text">
          <span class="sidebar__brand-name">Toggle</span>
          <span class="sidebar__brand-sub">Workspace</span>
        </span>
      </NuxtLink>
    </div>

    <nav class="sidebar__nav" aria-label="Modules">
      <p class="sidebar__section-label">Modules</p>

      <ul v-if="loading" class="sidebar__list" aria-busy="true">
        <li v-for="n in 6" :key="n" class="sidebar__item">
          <div class="sidebar__skeleton" />
        </li>
      </ul>

      <p v-else-if="loadError" class="sidebar__message sidebar__message--error">
        Could not load menu.
        <button type="button" class="sidebar__retry" @click="init">Retry</button>
      </p>

      <p v-else-if="!sidebar.modules.length" class="sidebar__message">
        No modules assigned.
      </p>

      <ul v-else class="sidebar__list">
        <li v-for="mod in sidebar.modules" :key="mod.path" class="sidebar__item">
          <NuxtLink
            :to="moduleHref(mod.path)"
            class="sidebar__link"
            :class="{ 'sidebar__link--active': isActive(mod.path) }"
          >
            <span class="sidebar__icon" aria-hidden="true">{{ labelInitial(mod.label) }}</span>
            <span class="sidebar__label">{{ mod.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import api from '~~/api.config';
import STATUS from '~~/status';

const route = useRoute();
const config = useRuntimeConfig();

const loading = ref(true);
const loadError = ref(false);

const sidebar = reactive({
  modules: [],
});

const homeHref = computed(() => {
  const r = route.params.role;
  if (typeof r === 'string' && r) return `/${r}/dashboard`;
  return '/';
});

function slugPath(segment) {
  return String(segment ?? '')
    .trim()
    .replace(/^\/+/, '')
    .toLowerCase();
}

function moduleHref(segment) {
  const p = slugPath(segment);
  const r = route.params.role;
  if (typeof r === 'string' && r) return `/${r}/${p}`;
  return `/${p}`;
}

function isActive(segment) {
  const p = slugPath(segment);
  const r = route.params.role;
  if (typeof r !== 'string' || !p) return false;
  const base = `/${r}/${p}`;
  return route.path === base || route.path.startsWith(`${base}/`);
}

function labelInitial(label) {
  const s = String(label ?? '').trim();
  return s ? s[0].toUpperCase() : '?';
}

const init = async () => {
  loading.value = true;
  loadError.value = false;
  try {
    const response = await api.get(`${config.public.API}/user/modules`);
    if (response.status === STATUS.OK) {
      sidebar.modules = response.data.modules || [];
    }
  } catch (error) {
    console.log(error);
    loadError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  init();
});
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1rem 0.75rem 1.25rem;
  border-right: 1px solid rgba(203, 213, 225, 0.15);
  background: linear-gradient(
    180deg,
    rgba(28, 28, 42, 0.98) 0%,
    rgba(35, 35, 51, 0.95) 40%,
    rgba(35, 35, 51, 1) 100%
  );
  box-shadow: 1px 0 0 rgba(0, 0, 0, 0.2);
}

.sidebar__brand {
  padding: 0.35rem 0.5rem 1rem;
  margin-bottom: 0.25rem;
  border-bottom: 1px solid rgba(203, 213, 225, 0.1);
}

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: var(--text-color-one);
  transition: opacity 0.15s ease;
}

.sidebar__logo:hover {
  opacity: 0.92;
}

.sidebar__mark {
  width: 2rem;
  height: 2rem;
  border-radius: 9px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a855f7 100%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
}

.sidebar__brand-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.sidebar__brand-name {
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.sidebar__brand-sub {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.45);
}

.sidebar__nav {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.sidebar__section-label {
  margin: 0 0 0.5rem;
  padding: 0 0.5rem;
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  color: rgba(255, 255, 255, 0.38);
}

.sidebar__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.sidebar__item {
  margin: 0;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.65rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
  border: 1px solid transparent;
  transition:
    color 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease;
}

.sidebar__link:hover {
  color: var(--text-color-one);
  background: rgba(255, 255, 255, 0.06);
}

.sidebar__link--active {
  color: var(--text-color-one);
  background: rgba(99, 102, 241, 0.18);
  border-color: rgba(165, 180, 252, 0.35);
}

.sidebar__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar__link--active .sidebar__icon {
  background: rgba(99, 102, 241, 0.35);
  border-color: rgba(165, 180, 252, 0.4);
}

.sidebar__label {
  min-width: 0;
  line-height: 1.35;
}

.sidebar__skeleton {
  height: 2.45rem;
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.06) 100%
  );
  background-size: 200% 100%;
  animation: sidebar-shimmer 1.2s ease-in-out infinite;
}

@keyframes sidebar-shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.sidebar__message {
  margin: 0;
  padding: 0.65rem 0.5rem;
  font-size: 0.85rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.55);
}

.sidebar__message--error {
  color: rgba(252, 165, 165, 0.95);
}

.sidebar__retry {
  display: inline;
  margin: 0.35rem 0 0;
  padding: 0.25rem 0.6rem;
  width: auto;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid rgba(203, 213, 225, 0.35);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-color-one);
}

.sidebar__retry:hover {
  background: rgba(255, 255, 255, 0.12);
}

@media (max-width: 900px) {
  .sidebar {
    min-height: auto;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    padding: 0.75rem 1rem;
    border-right: none;
    border-bottom: 1px solid rgba(203, 213, 225, 0.15);
  }

  .sidebar__brand {
    margin-bottom: 0;
    padding: 0;
    border-bottom: none;
    flex: 0 0 auto;
  }

  .sidebar__nav {
    flex: 1 1 100%;
    margin-top: 0.75rem;
  }

  .sidebar__section-label {
    display: none;
  }

  .sidebar__list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .sidebar__link {
    padding: 0.45rem 0.55rem;
    font-size: 0.82rem;
  }

  .sidebar__icon {
    width: 1.6rem;
    height: 1.6rem;
    font-size: 0.65rem;
  }
}
</style>
