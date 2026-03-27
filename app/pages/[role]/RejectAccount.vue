<template>
  <section class="reject-page">
    <header class="reject-page__header">
      <div class="reject-page__intro">
        <p class="reject-page__eyebrow">Rejected accounts</p>
        <h1>System admin registrations</h1>
        <p class="reject-page__lede">
          Accounts you previously rejected. You can move one back to pending or remove it permanently.
        </p>
      </div>
      <div class="reject-page__toolbar">
        <label class="reject-page__search">
          <span class="visually-hidden">Search by company, email, or domain</span>
          <input
            v-model.trim="search"
            type="search"
            class="reject-page__input"
            placeholder="Search company, email, domain…"
            :disabled="loading"
            autocomplete="off"
          />
        </label>
        <span class="reject-page__count">{{ filteredUsers.length }} shown</span>
        <button
          type="button"
          class="reject-page__refresh"
          :disabled="loading"
          @click="refresh"
        >
          <span v-if="!loading">Refresh</span>
          <span v-else class="reject-page__refresh-loading">
            <span class="reject-page__spinner" aria-hidden="true" />
            Loading…
          </span>
        </button>
      </div>
    </header>

    <div v-if="loading" class="reject-page__state" aria-busy="true">
      Loading rejected accounts…
    </div>

    <div
      v-else-if="filteredUsers.length === 0"
      class="reject-page__state reject-page__state--empty"
    >
      <p class="reject-page__empty-title">No matching accounts</p>
      <p class="reject-page__empty-hint">
        {{ users.length === 0 ? 'There are no rejected accounts right now.' : 'Try a different search or clear the filter.' }}
      </p>
    </div>

    <div v-else class="reject-page__grid">
      <article v-for="user in filteredUsers" :key="user._id" class="reject-card">
        <div class="reject-card__top">
          <div class="reject-card__identity">
            <div class="reject-card__avatar" :title="user.companyName || user.email">
              {{ initials(user.companyName || user.email) }}
            </div>
            <div class="reject-card__titles">
              <h2 class="reject-card__company">{{ user.companyName || '—' }}</h2>
              <p class="reject-card__email">{{ user.email }}</p>
            </div>
          </div>
          <span class="reject-card__badge">{{ user.status || 'REJECT' }}</span>
        </div>

        <dl class="reject-card__list">
          <div>
            <dt>Domain</dt>
            <dd>{{ user.domain || '—' }}</dd>
          </div>
          <div>
            <dt>Name</dt>
            <dd>{{ displayName(user) }}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{{ user.phoneNumber || '—' }}</dd>
          </div>
          <div>
            <dt>Price</dt>
            <dd>{{ user.price ?? '—' }}</dd>
          </div>
          <div class="reject-card__desc">
            <dt>Description</dt>
            <dd>{{ user.description || '—' }}</dd>
          </div>
        </dl>

        <div class="reject-card__actions">
          <button
            type="button"
            class="btn btn--pending"
            :disabled="isProcessing(user._id)"
            @click="openMove(user)"
          >
            <span
              v-if="processing.id === user._id && processing.type === 'MOVE'"
              class="reject-page__spinner reject-page__spinner--btn"
              aria-hidden="true"
            />
            Back to pending
          </button>
          <button
            type="button"
            class="btn btn--delete"
            :disabled="isProcessing(user._id)"
            @click="openDelete(user)"
          >
            <span
              v-if="processing.id === user._id && processing.type === 'DELETE'"
              class="reject-page__spinner reject-page__spinner--btn"
              aria-hidden="true"
            />
            Delete
          </button>
        </div>
      </article>
    </div>

    <Confirmation v-if="modal.isConfirmation" :modal="modal" />
  </section>
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
const processing = reactive({ id: null, type: null });

const modal = ref({
  isConfirmation: false,
  message: null,
  _id: null,
  reject: null,
});

const config = useRuntimeConfig();
const { $toast, $session } = useNuxtApp();

const initials = (value = '') =>
  value
    .split('@')[0]
    .split(/\s|[.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join('') || 'NA';

const displayName = (user) => {
  const n = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return n || '—';
};

const isProcessing = (id) => processing.id === id;

const filteredUsers = computed(() => {
  if (!search.value) return users.value;
  const q = search.value.toLowerCase();
  return users.value.filter((u) => {
    const hay = [
      u.companyName,
      u.email,
      u.domain,
      u.phoneNumber,
      u.description,
      u.firstName,
      u.lastName,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
});

const openMove = (user) => {
  modal.value.isConfirmation = true;
  modal.value.message = `Do you want to move “${user.companyName || user.email}” back to pending?`;
  modal.value._id = user._id;
  modal.value.reject = pendingUser;
};

const openDelete = (user) => {
  modal.value.isConfirmation = true;
  modal.value.message = `Do you want to delete “${user.companyName || user.email}”?`;
  modal.value._id = user._id;
  modal.value.reject = userDelete;
};

const pendingUser = async (_id) => {
  processing.id = _id;
  processing.type = 'MOVE';
  try {
    const projection = { status: USER_STATUS.PENDING };
    const response = await api.post(`${config.public.API}/user/user/${_id}`, {
      projection: JSON.stringify(projection),
    });
    if (response.status === STATUS.OK) {
      $toast.success(response.data.message);
      users.value = users.value.filter(user => user._id !== _id);
    }
  } catch (error) {
    console.log(error);
    $toast.error('Failed to move. Please try again.');
  } finally {
    processing.id = null;
    processing.type = null;
    modal.value.isConfirmation = false;
  }
};

const userDelete = async (_id) => {
  processing.id = _id;
  processing.type = 'DELETE';
  try {
    const projection = { status: USER_STATUS.DELETE };
    const response = await api.post(`${config.public.API}/user/user/${_id}`, {
      projection: JSON.stringify(projection),
    });
    if (response.status === STATUS.OK) {
      $toast.success(response.data.message);
      users.value = users.value.filter(user => user._id !== _id);
    }
  } catch (error) {
    console.log(error);
    $toast.error('Failed to delete. Please try again.');
  } finally {
    processing.id = null;
    processing.type = null;
    modal.value.isConfirmation = false;
  }
};

const init = async () => {
  loading.value = true;
  try {
    const query = { role: ROLE.SYSTEM_ADMIN, status: USER_STATUS.REJECT };
    const res = await api.get(`${config.public.API}/user/users`, {
      params: { query: JSON.stringify(query) },
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

const refresh = async () => {
  await init();
};

onMounted(async () => {
  $session();
  await init();
});
</script>

<style scoped>
.reject-page {
  width: 100%;
  color: var(--text-color-one);
}

.reject-page__header {
  border: 1px solid rgba(203, 213, 225, 0.2);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.95rem 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 900px) {
  .reject-page__header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.reject-page__eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.55);
}

.reject-page__intro h1 {
  margin: 0;
  font-size: 1.2rem;
  letter-spacing: -0.01em;
}

.reject-page__lede {
  margin: 0.45rem 0 0;
  font-size: 0.88rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.62);
  max-width: 42rem;
}

.reject-page__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
  flex-shrink: 0;
}

.reject-page__search {
  flex: 1;
  min-width: min(100%, 220px);
}

.reject-page__input {
  width: 100%;
  margin: 0;
  border-radius: 10px;
  border: 1px solid rgba(203, 213, 225, 0.35);
  background: rgba(15, 23, 42, 0.35);
  color: var(--text-color-one);
  padding: 0.45rem 0.65rem;
  font-size: 0.88rem;
}

.reject-page__input::placeholder {
  color: rgba(255, 255, 255, 0.38);
}

.reject-page__input:focus {
  outline: none;
  border-color: rgba(165, 180, 252, 0.65);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.reject-page__input:disabled {
  opacity: 0.55;
}

.reject-page__count {
  border: 1px solid rgba(203, 213, 225, 0.3);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 999px;
  padding: 0.32rem 0.7rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
}

.reject-page__refresh {
  margin: 0;
  border-radius: 10px;
  padding: 0.42rem 0.85rem;
  font-size: 0.84rem;
  font-weight: 600;
  border: 1px solid rgba(203, 213, 225, 0.35);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-color-one);
  cursor: pointer;
}

.reject-page__refresh:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
}

.reject-page__refresh:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.reject-page__refresh-loading {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.reject-page__state {
  border: 1px dashed rgba(203, 213, 225, 0.35);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.reject-page__state--empty {
  background: rgba(255, 255, 255, 0.02);
}

.reject-page__empty-title {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
}

.reject-page__empty-hint {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.55);
}

.reject-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 0.85rem;
}

.reject-card {
  border: 1px solid rgba(203, 213, 225, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.reject-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.reject-card__identity {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
}

.reject-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 0.85rem;
  flex-shrink: 0;
  background: rgba(248, 113, 113, 0.12);
  color: #fecaca;
  border: 1px solid rgba(248, 113, 113, 0.35);
}

.reject-card__titles {
  min-width: 0;
}

.reject-card__company {
  margin: 0;
  font-size: 1.02rem;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reject-card__email {
  margin: 0.2rem 0 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.55);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reject-card__badge {
  flex-shrink: 0;
  border: 1px solid rgba(248, 113, 113, 0.45);
  background: rgba(248, 113, 113, 0.12);
  color: #fecaca;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.reject-card__list {
  margin: 0;
  display: grid;
  gap: 0.45rem;
  flex: 1;
}

.reject-card__list div {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 0.55rem;
}

.reject-card__list dt {
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.5);
}

.reject-card__list dd {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  word-break: break-word;
}

.reject-card__desc {
  align-items: start;
}

.reject-card__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.55rem;
  margin-top: 0.85rem;
  flex-wrap: wrap;
}

.btn {
  margin: 0;
  width: auto;
  border-radius: 9px;
  padding: 0.48rem 0.95rem;
  font-size: 0.84rem;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn--pending {
  color: #e0e7ff;
  border-color: rgba(165, 180, 252, 0.45);
  background: rgba(99, 102, 241, 0.15);
}

.btn--pending:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.25);
}

.btn--delete {
  color: #fecaca;
  border-color: rgba(248, 113, 113, 0.45);
  background: rgba(248, 113, 113, 0.12);
}

.btn--delete:hover:not(:disabled) {
  background: rgba(248, 113, 113, 0.2);
}

.reject-page__spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-top-color: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  animation: reject-spin 0.7s linear infinite;
}

.reject-page__spinner--btn {
  width: 0.85rem;
  height: 0.85rem;
}

@keyframes reject-spin {
  to {
    transform: rotate(360deg);
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
