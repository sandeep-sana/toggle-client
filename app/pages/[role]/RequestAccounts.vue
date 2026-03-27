<template>
  <section class="request-page">
    <header class="request-page__header">
      <div class="request-page__intro">
        <p class="request-page__eyebrow">Incoming requests</p>
        <h1>Company signup requests</h1>
        <p class="request-page__lede">
          Review pending signups and accept or reject each company.
        </p>
      </div>
      <div class="request-page__meta">
        <span class="request-page__count">{{ requestAccounts.length }} pending</span>
      </div>
    </header>

    <div v-if="loading" class="request-page__state" aria-busy="true">
      Loading requests…
    </div>

    <div
      v-else-if="requestAccounts.length === 0"
      class="request-page__state request-page__state--empty"
    >
      <p class="request-page__empty-title">No pending requests</p>
      <p class="request-page__empty-hint">New company signups will appear here.</p>
    </div>

    <div v-else class="request-page__grid">
      <article v-for="account in requestAccounts" :key="account._id" class="request-card">
        <div class="request-card__top">
          <div class="request-card__identity">
            <div class="request-card__avatar" :title="account.companyName || account.email">
              {{ initials(account.companyName || account.email) }}
            </div>
            <div class="request-card__titles">
              <h2 class="request-card__company">{{ account.companyName || '—' }}</h2>
              <p class="request-card__email">{{ account.email }}</p>
            </div>
          </div>
          <span class="request-card__badge">{{ account.status || 'PENDING' }}</span>
        </div>

        <dl class="request-card__list">
          <div>
            <dt>Phone</dt>
            <dd>{{ account.phoneNumber || '—' }}</dd>
          </div>
          <div class="request-card__desc">
            <dt>Description</dt>
            <dd>{{ account.description || '—' }}</dd>
          </div>
        </dl>

        <div class="request-card__actions">
          <button type="button" class="btn btn--accept" @click="acceptAccount(account._id)">
            Accept
          </button>
          <button type="button" class="btn btn--reject" @click="rejectAccount(account._id)">
            Reject
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

const requestAccounts = ref([]);
const loading = ref(false);
const config = useRuntimeConfig();

const initials = (value = '') =>
  value
    .split('@')[0]
    .split(/\s|[.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join('') || 'NA';

const acceptAccount = async (id) => {
  const response = await api.post(`${config.public.API}/user/change-status`, {
    _id: id,
    status: 'ACCEPT',
  });
  if (response.status === STATUS.OK) {
    requestAccounts.value = requestAccounts.value.filter(account => account._id !== id);
  }
};

const rejectAccount = async (id) => {
  const response = await api.post(`${config.public.API}/user/change-status`, {
    _id: id,
    status: 'REJECT',
  });
  if (response.status === STATUS.OK) {
    requestAccounts.value = requestAccounts.value.filter(account => account._id !== id);
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    const response = await api.get(`${config.public.API}/user/request-accounts`);
    if (response.status === STATUS.OK) {
      requestAccounts.value = response.data.requestAccounts || [];
    }
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.request-page {
  width: 100%;
  color: var(--text-color-one);
}

.request-page__header {
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
  .request-page__header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.request-page__eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.55);
}

.request-page__intro h1 {
  margin: 0;
  font-size: 1.2rem;
  letter-spacing: -0.01em;
}

.request-page__lede {
  margin: 0.45rem 0 0;
  font-size: 0.88rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.62);
  max-width: 40rem;
}

.request-page__meta {
  flex-shrink: 0;
}

.request-page__count {
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(251, 191, 36, 0.45);
  background: rgba(251, 191, 36, 0.12);
  color: #fde68a;
  border-radius: 999px;
  padding: 0.32rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.request-page__state {
  border: 1px dashed rgba(203, 213, 225, 0.35);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.request-page__state--empty {
  background: rgba(255, 255, 255, 0.02);
}

.request-page__empty-title {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
}

.request-page__empty-hint {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.55);
}

.request-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 0.85rem;
}

.request-card {
  border: 1px solid rgba(203, 213, 225, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.request-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.request-card__identity {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
}

.request-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 0.85rem;
  flex-shrink: 0;
  background: rgba(251, 191, 36, 0.12);
  color: #fde68a;
  border: 1px solid rgba(251, 191, 36, 0.35);
}

.request-card__titles {
  min-width: 0;
}

.request-card__company {
  margin: 0;
  font-size: 1.02rem;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.request-card__email {
  margin: 0.2rem 0 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.55);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.request-card__badge {
  flex-shrink: 0;
  border: 1px solid rgba(251, 191, 36, 0.5);
  background: rgba(251, 191, 36, 0.15);
  color: #fde68a;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.request-card__list {
  margin: 0;
  display: grid;
  gap: 0.45rem;
  flex: 1;
}

.request-card__list div {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 0.55rem;
}

.request-card__list dt {
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.5);
}

.request-card__list dd {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  word-break: break-word;
}

.request-card__desc {
  align-items: start;
}

.request-card__actions {
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

.btn--accept {
  color: #0f172a;
  border-color: rgba(134, 239, 172, 0.65);
  background: linear-gradient(135deg, #86efac 0%, #4ade80 45%, #22c55e 100%);
}

.btn--accept:hover {
  filter: brightness(1.05);
}

.btn--reject {
  color: #fecaca;
  border-color: rgba(248, 113, 113, 0.45);
  background: rgba(248, 113, 113, 0.12);
}

.btn--reject:hover {
  background: rgba(248, 113, 113, 0.2);
}
</style>
