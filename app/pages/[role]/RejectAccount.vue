<template>
  <section class="reject-page">
    <header class="reject-page__header">
      <div class="reject-page__intro">
        <p class="reject-page__eyebrow">Rejected accounts</p>
        <h1>Previously declined signups</h1>
        <p class="reject-page__lede">
          Restore a company to pending if you want to review again, or remove the record permanently.
        </p>
      </div>
      <div class="reject-page__meta">
        <span class="reject-page__count">{{ rejectAccounts.length }} rejected</span>
      </div>
    </header>

    <div v-if="loading" class="reject-page__state" aria-busy="true">
      Loading accounts…
    </div>

    <div
      v-else-if="rejectAccounts.length === 0"
      class="reject-page__state reject-page__state--empty"
    >
      <p class="reject-page__empty-title">No rejected accounts</p>
      <p class="reject-page__empty-hint">Declined signups will appear here.</p>
    </div>

    <div v-else class="reject-page__grid">
      <article v-for="account in rejectAccounts" :key="account._id" class="reject-card">
        <div class="reject-card__top">
          <div class="reject-card__identity">
            <div class="reject-card__avatar" :title="account.companyName || account.email">
              {{ initials(account.companyName || account.email) }}
            </div>
            <div class="reject-card__titles">
              <h2 class="reject-card__company">{{ account.companyName || '—' }}</h2>
              <p class="reject-card__email">{{ account.email }}</p>
            </div>
          </div>
          <span class="reject-card__badge">{{ account.status || 'REJECT' }}</span>
        </div>

        <dl class="reject-card__list">
          <div>
            <dt>Phone</dt>
            <dd>{{ account.phoneNumber || '—' }}</dd>
          </div>
          <div class="reject-card__desc">
            <dt>Description</dt>
            <dd>{{ account.description || '—' }}</dd>
          </div>
        </dl>

        <div class="reject-card__actions">
          <button
            type="button"
            class="btn btn--pending"
            :disabled="processingId === account._id"
            @click="moveToPending(account._id)"
          >
            Back to pending
          </button>
          <button
            type="button"
            class="btn btn--delete"
            :disabled="processingId === account._id"
            @click="deleteAccount(account._id)"
          >
            Delete
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '~~/api.config';
import STATUS from '~~/status';
import { USER_STATUS } from '~~/constant/user';

const rejectAccounts = ref([]);
const loading = ref(false);
const processingId = ref(null);
const config = useRuntimeConfig();

const initials = (value = '') =>
  value
    .split('@')[0]
    .split(/\s|[.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join('') || 'NA';

const removeFromList = (id) => {
  const sid = String(id);
  rejectAccounts.value = rejectAccounts.value.filter(a => String(a._id) !== sid);
};

const moveToPending = async (id) => {
  processingId.value = id;
  try {
    const response = await api.post(`${config.public.API}/user/change-status`, {
      _id: id,
      status: USER_STATUS.PENDING,
    });
    if (response.status === STATUS.OK) {
      removeFromList(id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    processingId.value = null;
  }
};

const deleteAccount = async (id) => {
  processingId.value = id;
  try {
    const response = await api.post(`${config.public.API}/user/change-status`, {
      _id: id,
      status: USER_STATUS.DELETE,
    });
    if (response.status === STATUS.OK) {
      removeFromList(id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    processingId.value = null;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    const response = await api.get(`${config.public.API}/user/reject-accounts`);
    if (response.status === STATUS.OK) {
      rejectAccounts.value = response.data.rejectAccounts || [];
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
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
  gap: 0.75rem;
}

@media (min-width: 640px) {
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
  max-width: 40rem;
}

.reject-page__meta {
  flex-shrink: 0;
}

.reject-page__count {
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(248, 113, 113, 0.45);
  background: rgba(248, 113, 113, 0.12);
  color: #fecaca;
  border-radius: 999px;
  padding: 0.32rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
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

.btn--pending:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(35, 35, 51, 0.95), 0 0 0 4px rgba(129, 140, 248, 0.45);
}

.btn--delete {
  color: #fecaca;
  border-color: rgba(248, 113, 113, 0.45);
  background: rgba(248, 113, 113, 0.12);
}

.btn--delete:hover:not(:disabled) {
  background: rgba(248, 113, 113, 0.2);
}

.btn--delete:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(35, 35, 51, 0.95), 0 0 0 4px rgba(248, 113, 113, 0.4);
}
</style>
