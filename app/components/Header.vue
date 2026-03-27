<template>
  <header class="site-header">
    <div class="site-header__inner">
      <NuxtLink to="/" class="brand" aria-label="Toggle home">
        <span class="brand__mark" aria-hidden="true" />
        <span class="brand__text">Toggle</span>
      </NuxtLink>

      <nav class="nav" aria-label="Primary">
        <NuxtLink
          to="/"
          class="nav__link"
          :class="{ 'nav__link--active': isHome }"
        >
          Home
        </NuxtLink>

        <template v-if="!isLoggedIn">
          <NuxtLink to="/login" class="nav__link" active-class="nav__link--active">
            Login
          </NuxtLink>
          <NuxtLink to="/signup" class="nav__link" active-class="nav__link--active">
            Sign up
          </NuxtLink>
        </template>

        <div
          v-else
          ref="profileRoot"
          class="profile"
        >
          <button
            type="button"
            class="profile__trigger"
            :aria-expanded="menuOpen"
            aria-haspopup="menu"
            aria-controls="profile-menu"
            @click.stop="toggleMenu"
          >
            <span class="profile__avatar" aria-hidden="true">
              <span v-if="loadingUser" class="profile__spinner" />
              <template v-else>{{ displayInitials }}</template>
            </span>
            <span class="profile__chev" aria-hidden="true" />
          </button>

          <div
            v-show="menuOpen"
            id="profile-menu"
            class="profile__dropdown"
            role="menu"
            @click.stop
          >
            <div class="profile__meta" role="presentation">
              <span class="profile__name">{{ displayName }}</span>
              <span v-if="user?.email" class="profile__email">{{ user.email }}</span>
            </div>
            <NuxtLink
              v-if="dashboardHref"
              :to="dashboardHref"
              class="profile__item"
              role="menuitem"
              @click="closeMenu"
            >
              Dashboard
            </NuxtLink>
            <button
              type="button"
              class="profile__item profile__item--danger"
              role="menuitem"
              @click="onLogout"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
const route = useRoute()
const { $session, $logout, $fetchUser } = useNuxtApp()

const isHome = computed(() => route.path === '/' || route.path === '')

const isLoggedIn = ref(false)
const user = ref(null)
const loadingUser = ref(false)
const menuOpen = ref(false)
const profileRoot = ref(null)

const displayName = computed(() => {
  const u = user.value
  if (!u) return 'Account'
  const parts = [u.firstName, u.lastName].filter(Boolean)
  if (parts.length) return parts.join(' ')
  return u.email || 'Account'
})

const displayInitials = computed(() => {
  const u = user.value
  if (!u) return '?'
  const fn = typeof u.firstName === 'string' ? u.firstName.trim() : ''
  const ln = typeof u.lastName === 'string' ? u.lastName.trim() : ''
  if (fn && ln) return (fn[0] + ln[0]).toUpperCase()
  if (fn) return fn.slice(0, 2).toUpperCase()
  if (typeof u.email === 'string' && u.email.length >= 2) {
    return u.email.slice(0, 2).toUpperCase()
  }
  return '?'
})

const dashboardHref = computed(() => {
  const u = user.value
  if (!u?.activeRole) return null
  return `/${String(u.activeRole).toLowerCase()}/dashboard`
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function onLogout() {
  closeMenu()
  $logout()
}

function onDocClick(event) {
  if (!menuOpen.value) return
  if (profileRoot.value && !profileRoot.value.contains(event.target)) {
    menuOpen.value = false
  }
}

function onEscape(event) {
  if (event.key === 'Escape') menuOpen.value = false
}

async function refreshSession() {
  if (typeof window === 'undefined') return
  const id = $session()
  isLoggedIn.value = !!id
  if (!id) {
    user.value = null
    return
  }
  loadingUser.value = true
  try {
    user.value = await $fetchUser()
  } finally {
    loadingUser.value = false
  }
}

onMounted(async () => {
  await refreshSession()
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onEscape)
})

watch(() => route.fullPath, () => {
  closeMenu()
  refreshSession()
})

onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onEscape)
})
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: linear-gradient(
    180deg,
    rgba(35, 35, 51, 0.98) 0%,
    rgba(35, 35, 51, 0.92) 100%
  );
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color-one);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04);
}

.site-header__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--text-color-one);
  font-weight: 600;
  font-size: 1.125rem;
  letter-spacing: -0.02em;
  transition: opacity 0.15s ease;
}

.brand:hover {
  opacity: 0.9;
}

.brand__mark {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a855f7 100%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
  flex-shrink: 0;
}

.brand__text {
  line-height: 1;
}

.nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.nav__link {
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
  border: 1px solid transparent;
  transition:
    color 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease;
}

.nav__link:hover {
  color: var(--text-color-one);
  background: rgba(255, 255, 255, 0.06);
}

.nav__link--active {
  color: var(--text-color-one);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(203, 213, 225, 0.35);
}

.profile {
  position: relative;
  margin-left: 0.25rem;
}

.profile__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.35rem 0.2rem 0.2rem;
  border: 1px solid rgba(203, 213, 225, 0.25);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.profile__trigger:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(203, 213, 225, 0.4);
}

.profile__trigger:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.45);
}

.profile__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #0f172a;
  background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 50%, #e9d5ff 100%);
  box-shadow: 0 0 0 2px rgba(35, 35, 51, 0.95);
}

.profile__spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(15, 23, 42, 0.2);
  border-top-color: #0f172a;
  border-radius: 50%;
  animation: profile-spin 0.65s linear infinite;
}

@keyframes profile-spin {
  to {
    transform: rotate(360deg);
  }
}

.profile__chev {
  width: 0;
  height: 0;
  margin-right: 0.35rem;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgba(255, 255, 255, 0.55);
  transition: transform 0.15s ease;
}

.profile__trigger[aria-expanded='true'] .profile__chev {
  transform: rotate(180deg);
}

.profile__dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  min-width: 13rem;
  padding: 0.35rem;
  border-radius: 12px;
  border: 1px solid rgba(203, 213, 225, 0.2);
  background: rgba(30, 30, 44, 0.98);
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  backdrop-filter: blur(12px);
}

.profile__meta {
  padding: 0.65rem 0.75rem 0.5rem;
  border-bottom: 1px solid rgba(203, 213, 225, 0.12);
  margin-bottom: 0.25rem;
}

.profile__name {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color-one);
  line-height: 1.3;
}

.profile__email {
  display: block;
  margin-top: 0.15rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  word-break: break-all;
}

.profile__item {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 0.55rem 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  background: transparent;
  cursor: pointer;
  transition: background 0.12s ease;
}

a.profile__item:hover,
button.profile__item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.profile__item--danger {
  color: #fca5a5;
}

.profile__item--danger:hover {
  background: rgba(248, 113, 113, 0.12);
}

@media (max-width: 480px) {
  .site-header__inner {
    padding: 0.65rem 1rem;
  }

  .nav {
    width: 100%;
    justify-content: flex-start;
  }

  .profile {
    margin-left: auto;
  }
}
</style>
