<template> <!-- SANDEEP SANA-->
  <div class="app-shell">
    <template v-if="isPublicRoute">
      <Header />
      <main class="app-shell__public">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </main>
    </template>

    <template v-else>
      <div class="app-shell__private">
        <Sidebar class="app-shell__sidebar" />
        <main class="app-shell__content">
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </main>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const PUBLIC_ROUTES = ['/', '/login', '/signup'];

const isPublicRoute = computed(() => PUBLIC_ROUTES.includes(route.path));
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.app-shell__public {
  min-height: calc(100vh - 72px);
}

.app-shell__private {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(230px, 272px) minmax(0, 1fr);
}

.app-shell__sidebar {
  min-height: 100vh;
}

.app-shell__content {
  min-width: 0;
  padding: 1rem 1.25rem;
}

@media (max-width: 900px) {
  .app-shell__private {
    grid-template-columns: 1fr;
  }

  .app-shell__sidebar {
    min-height: auto;
  }

  .app-shell__content {
    padding: 0.85rem 1rem 1rem;
  }
}
</style>
