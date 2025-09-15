<template>
  <div class="pending-wrapper">
    <!-- Header Bar -->
    <header class="headerbar">
      <div class="header-inner container-xxl">
        <!-- Left: Search -->
        <div class="left d-flex align-items-center gap-2">
          <div class="search-box">
            <input
              v-model.trim="search"
              type="search"
              class="form-control form-control-sm"
              placeholder="Search company or email…"
              :disabled="loading"
              aria-label="Search blocked users by company or email"
            />
          </div>
        </div>

        <!-- Right: Title + Counter + Refresh -->
        <div class="right d-flex align-items-center gap-3">
          <h6 class="title mb-0">Blocked Accounts</h6>
          <span class="counter-chip">{{ users.length }}</span>
          <button class="btn btn-sm btn-light" @click="refresh" :disabled="loading">
            <span v-if="!loading">Refresh</span>
            <span v-else class="d-inline-flex align-items-center gap-2">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Loading…
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="content container-xxl">
      <!-- Empty state -->
      <div v-if="!loading && filteredUsers.length === 0" class="empty-state text-center py-5">
        <div class="empty-emoji">🗂️</div>
        <h5 class="mt-3 mb-1 text-white">No matching accounts</h5>
        <p class="text-muted mb-0">Try a different search, or click Refresh.</p>
      </div>

      <!-- Cards Grid -->
      <div class="cards-container">
        <div class="row g-4" v-if="!loading && filteredUsers.length > 0">
          <div v-for="user in filteredUsers" :key="user._id" class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card user-card h-100">
              <div class="card-body d-flex flex-column">
                <div class="identity d-flex align-items-center gap-3 mb-2">
                  <div class="avatar" :title="user.companyName">
                    {{ initials(user.companyName || user.email) }}
                  </div>
                  <div class="flex-grow-1 overflow-hidden">
                    <h6 class="card-title mb-0 text-truncate">{{ user.companyName || '—' }}</h6>
                    <small class="text-secondary text-truncate d-block">{{ user.email }}</small>
                  </div>
                </div>

                <p class="card-text text-secondary line-clamp mt-2 mb-3">
                  {{ user.description || 'No description provided.' }}
                </p>

                <div class="mt-auto d-flex gap-2">
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm flex-fill"
                    @click="moveTouser(user)"
                    :disabled="isProcessing(user._id)"
                  >
                    <span
                      v-if="processing.id === user._id && processing.type === 'MOVE'"
                      class="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Move to user
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skeletons -->
        <div class="row g-4" v-if="loading" aria-busy="true">
          <div v-for="n in 8" :key="n" class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card user-card h-100 skeleton-card">
              <div class="card-body">
                <div class="skeleton avatar-skeleton mb-3"></div>
                <div class="skeleton skeleton-text w-75 mb-2"></div>
                <div class="skeleton skeleton-text w-50 mb-3"></div>
                <div class="skeleton skeleton-text w-100 mb-1"></div>
                <div class="skeleton skeleton-text w-100 mb-1"></div>
                <div class="skeleton skeleton-text w-75 mb-3"></div>
                <div class="d-flex gap-2">
                  <div class="skeleton skeleton-btn flex-fill"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Confirmation v-if="modal.isConfirmation" :modal="modal" />
  </div>
</template>

<script setup>
import STATUS from '~~/status';
import api from '~~/api.config';
import { ref, reactive, computed, onMounted } from 'vue';
import Confirmation from '../../modal/Confirmation.vue';
import { ROLE } from '../constant/role';
import { USER_STATUS } from '~~/constant/user';

const users = ref([]);
const loading = ref(false);
const search = ref('');
const processing = reactive({ id: null, type: null }); // 'MOVE' | null

const modal = ref({
  isConfirmation: false,
  message: null,
  reject: null,
  _id: null
});
const config = useRuntimeConfig();
const { $toast, $session } = useNuxtApp();

const initials = (value = '') =>
  value
    .split('@')[0]
    .split(/\s|[\.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join('') || 'NA';

const isProcessing = (id) => processing.id === id;

const filteredUsers = computed(() => {
  if (!search.value) return users.value;
  const q = search.value.toLowerCase();
  return users.value.filter(u =>
    (u.companyName || '').toLowerCase().includes(q) ||
    (u.email || '').toLowerCase().includes(q)
  );
});

const moveTouser = (user) => {
  modal.value.isConfirmation = true;
  modal.value.message = `Do you want to move “${user.companyName || user.email}” back to pending?`;
  modal.value._id = user._id;
  modal.value.reject = pendingUser;
};

const pendingUser = async (_id) => {
  processing.id = _id; processing.type = 'MOVE';
  try {
    const projection = { status: USER_STATUS.PENDING };
    const response = await api.post(`${config.public.API}/user/user/${_id}`, {
      projection: JSON.stringify(projection),
    });
    if (response.status === STATUS.OK) {
      $toast.success(response.data.message);
      users.value = users.value.filter(user => user._id != _id);
    }
  } catch (error) {
    console.log(error);
    $toast.error('Failed to move. Please try again.');
  } finally {
    processing.id = null; processing.type = null;
    modal.value.isConfirmation = false;
  }
};

const init = async () => {
  loading.value = true;
  try {
    const query = { role: ROLE.SYSTEM_ADMIN, status: USER_STATUS.BLOCK };
    const res = await api.get(`${config.public.API}/user/users`, {
      params: { query: JSON.stringify(query) }
    });
    if (res.status === STATUS.OK) {
      users.value = res.data.users || [];
    }
  } catch (e) {
    console.error(e);
    $toast.error('Failed to load users.');
  } finally {
    loading.value = false;
  }
};

const refresh = async () => { await init(); };

onMounted(async () => {
  $session();
  await init();
});
</script>

<style scoped>
/* --- Theme (Black & White) --- */
.pending-wrapper {
  --bg: #ffffff;
  --fg: #fff;
  --muted: rgba(255,255,255,0.6);
  --card-bg: #fff;
  --card-fg: #000;
  --border: rgba(255,255,255,0.12);
  background: var(--bg);
  color: var(--fg);
  min-height: 100vh;
}

/* --- Header Bar --- */
.headerbar {
  background: #ffffff;
  border-bottom: 1px solid var(--border);
}
.header-inner {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  margin-top: 10px;
  gap: 12px;
  padding: 12px 12px;
  border: 1px solid #e2e2e2;
  border-radius: 12px;
}
.title { letter-spacing: .2px; font-weight: 600; color: var(--fg); }
.counter-chip {
  display: inline-flex; align-items: center; justify-content: center;
  height: 26px; min-width: 26px; padding: 0 8px;
  font-weight: 700; font-size: 12px;
  color: #000; background: #fff; border-radius: 999px; border: 1px solid #000;
}
.search-box { min-width: 260px; }
.search-box .form-control {
  background: #fff; color: #000; border: 1px solid #000; border-radius: 8px;
  margin-bottom: 0px!important;
}
.search-box .form-control:focus {
  box-shadow: none; border-color: #000; outline: 2px solid #fff;
}

/* --- Content layout --- */
.content { padding-top: 18px; padding-bottom: 28px; }
.cards-container { margin: 12px 6px 8px; }
@media (min-width: 576px) { .cards-container { margin: 16px 10px 10px; } }
@media (min-width: 992px) { .cards-container { margin: 20px 2px 12px; } }

/* --- Card --- */
.user-card {
  background: var(--card-bg);
  color: var(--card-fg);
  border: 1px solid #eaeaea;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,.08);
  transition: transform .15s ease, box-shadow .15s ease;
}
.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(0,0,0,.12);
}
.card-title { font-weight: 700; letter-spacing: .2px; }
.text-secondary { color: #6b7280 !important; }

/* Avatar (monogram) */
.avatar {
  width: 44px; height: 44px; border-radius: 999px;
  display: grid; place-items: center; font-weight: 800;
  background: #f5f5f5; color: #111; border: 1px solid #e5e5e5; flex: 0 0 44px;
}

/* Clamp */
.line-clamp {
  display: -webkit-box;
  /* -webkit-line-clamp: 3; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Buttons */
.btn-dark { border-radius: 10px; }
.btn-outline-dark { border-radius: 10px; }
.btn-light { border-radius: 10px; }

/* Empty */
.empty-state .empty-emoji { font-size: 40px; }
.empty-state p { color: var(--muted) !important; }

/* Skeletons */
.skeleton-card { border-radius: 16px; }
.skeleton {
  position: relative; border-radius: 8px; background: #eee; overflow: hidden;
}
.skeleton::after {
  content: ""; position: absolute; inset: 0; transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent);
  animation: shimmer 1.6s infinite;
}
.skeleton-text { height: 12px; }
.avatar-skeleton { width: 44px; height: 44px; border-radius: 999px; }
.skeleton-btn { height: 32px; border-radius: 8px; }
@keyframes shimmer { 100% { transform: translateX(100%); } }
</style>
