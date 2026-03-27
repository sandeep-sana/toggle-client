<template>
  <section class="accept-page">
    <header class="accept-page__header">
      <div class="accept-page__intro">
        <p class="accept-page__eyebrow">Accept account</p>
        <h1>Review pending signups</h1>
        <p class="accept-page__lede">
          Block access for problematic signups, or reject them to decline registration.
        </p>
      </div>
      <div class="accept-page__meta">
        <span class="accept-page__count">{{ acceptAccounts.length }} pending</span>
      </div>
    </header>

    <div v-if="loading" class="accept-page__state" aria-busy="true">
      Loading accounts…
    </div>

    <div
      v-else-if="acceptAccounts.length === 0"
      class="accept-page__state accept-page__state--empty"
    >
      <p class="accept-page__empty-title">No accounts to review</p>
      <p class="accept-page__empty-hint">Pending signups will show up here.</p>
    </div>

    <div v-else class="accept-page__grid">
      <article v-for="account in acceptAccounts" :key="account._id" class="accept-card">
        <div class="accept-card__top">
          <div class="accept-card__identity">
            <div class="accept-card__avatar" :title="account.companyName || account.email">
              {{ initials(account.companyName || account.email) }}
            </div>
            <div class="accept-card__titles">
              <h2 class="accept-card__company">{{ account.companyName || '—' }}</h2>
              <p class="accept-card__email">{{ account.email }}</p>
            </div>
          </div>
          <span class="accept-card__badge">{{ account.status || 'PENDING' }}</span>
        </div>

        <dl class="accept-card__list">
          <div>
            <dt>Phone</dt>
            <dd>{{ account.phoneNumber || '—' }}</dd>
          </div>
          <div class="accept-card__desc">
            <dt>Description</dt>
            <dd>{{ account.description || '—' }}</dd>
          </div>
        </dl>

        <div class="accept-card__actions">
          <button
            type="button"
            class="btn btn--block"
            @click="blockAccount(account._id)"
          >
            Block
          </button>
          <button
            v-if="!account.isCreatedDatabase"
            type="button"
            class="btn btn--create"
            :disabled="creatingId === account._id"
            @click="createDatabase(account._id)"
          >
            {{ creatingId === account._id ? 'Creating...' : 'Create Database' }}
          </button>
          <a
            v-else
            class="btn btn--visit"
            :href="getCompanyUrl(account.domain)"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '~~/api.config';
import STATUS from '~~/status';

const acceptAccounts = ref([]);
const loading = ref(false);
const creatingId = ref(null);
const config = useRuntimeConfig();
const { $toast, $speak } = useNuxtApp();

const initials = (value = '') =>
  value
    .split('@')[0]
    .split(/\s|[.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join('') || 'NA';

const blockAccount = async (id) => {
  const response = await api.post(`${config.public.API}/user/change-status`, {
    _id: id,
    status: 'BLOCK',
  });
  if (response.status === STATUS.OK) {
    acceptAccounts.value = acceptAccounts.value.filter(account => account._id !== id);
  }
};

const createDatabase = async (id) => {
  creatingId.value = id;
  try {
    const response = await api.post(`${config.public.API}/user/create-database`, {
      _id: id,
    });
    if (response.status === STATUS.OK) {
      $toast.success(response.data.message);
      $speak(response.data.message);
      const item = acceptAccounts.value.find(account => account._id === id);
      if (item) item.isCreatedDatabase = true;
    }
  } catch (error) {
    console.error(error);
    $toast.error('Failed to create database.');
  } finally {
    creatingId.value = null;
  }
};

const getCompanyUrl = (subdomain) => {
  const rawDomain = String(config.public.DOMAIN || '').trim();
  if (!subdomain || !rawDomain) return '#';

  const cleanBase = rawDomain
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '');

  const hasProtocol = /^https?:\/\//i.test(rawDomain);
  const protocol = hasProtocol
    ? rawDomain.match(/^https?/i)?.[0].toLowerCase()
    : (/localhost|127\.0\.0\.1/i.test(cleanBase) ? 'http' : 'https');

  return `${protocol}://${subdomain}.${cleanBase}`;
};

onMounted(async () => {
  loading.value = true;
  try {
    const response = await api.get(`${config.public.API}/user/accept-accounts`);
    if (response.status === STATUS.OK) {
      acceptAccounts.value = response.data.acceptAccounts || [];
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.accept-page {
  width: 100%;
  color: var(--text-color-one);
}

.accept-page__header {
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
  .accept-page__header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.accept-page__eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.55);
}

.accept-page__intro h1 {
  margin: 0;
  font-size: 1.2rem;
  letter-spacing: -0.01em;
}

.accept-page__lede {
  margin: 0.45rem 0 0;
  font-size: 0.88rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.62);
  max-width: 40rem;
}

.accept-page__meta {
  flex-shrink: 0;
}

.accept-page__count {
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

.accept-page__state {
  border: 1px dashed rgba(203, 213, 225, 0.35);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.accept-page__state--empty {
  background: rgba(255, 255, 255, 0.02);
}

.accept-page__empty-title {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
}

.accept-page__empty-hint {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.55);
}

.accept-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 0.85rem;
}

.accept-card {
  border: 1px solid rgba(203, 213, 225, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.accept-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.accept-card__identity {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
}

.accept-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 0.85rem;
  flex-shrink: 0;
  background: rgba(251, 146, 60, 0.12);
  color: #fdba74;
  border: 1px solid rgba(251, 146, 60, 0.38);
}

.accept-card__titles {
  min-width: 0;
}

.accept-card__company {
  margin: 0;
  font-size: 1.02rem;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.accept-card__email {
  margin: 0.2rem 0 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.55);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.accept-card__badge {
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

.accept-card__list {
  margin: 0;
  display: grid;
  gap: 0.45rem;
  flex: 1;
}

.accept-card__list div {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 0.55rem;
}

.accept-card__list dt {
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.5);
}

.accept-card__list dd {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  word-break: break-word;
}

.accept-card__desc {
  align-items: start;
}

.accept-card__actions {
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

.btn--block {
  color: #fed7aa;
  border-color: rgba(251, 146, 60, 0.55);
  background: rgba(251, 146, 60, 0.14);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15) inset;
}

.btn--block:hover {
  background: rgba(251, 146, 60, 0.24);
  border-color: rgba(251, 146, 60, 0.7);
}

.btn--block:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(35, 35, 51, 0.95), 0 0 0 4px rgba(251, 146, 60, 0.45);
}

.btn--reject {
  color: #fecaca;
  border-color: rgba(248, 113, 113, 0.45);
  background: rgba(248, 113, 113, 0.12);
}

.btn--reject:hover {
  background: rgba(248, 113, 113, 0.2);
}

.btn--reject:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(35, 35, 51, 0.95), 0 0 0 4px rgba(248, 113, 113, 0.4);
}

.btn--create {
  color: #0f172a;
  border-color: rgba(134, 239, 172, 0.65);
  background: linear-gradient(135deg, #86efac 0%, #4ade80 45%, #22c55e 100%);
}

.btn--create:hover {
  filter: brightness(1.05);
}

.btn--create:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn--visit {
  color: #dbeafe;
  border-color: rgba(96, 165, 250, 0.45);
  background: rgba(59, 130, 246, 0.16);
  text-decoration: none;
}

.btn--visit:hover {
  background: rgba(59, 130, 246, 0.24);
}
</style>
