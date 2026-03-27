<template> <!-- SANDEEP SANA-->
  <main class="home">
    <section class="home__hero" aria-labelledby="home-title">
      <p class="home__eyebrow">Welcome</p>
      <h1 id="home-title" class="home__title">
        Build and run your workspace on <span class="home__brand">Toggle</span>
      </h1>
      <p class="home__lead">
        Sign in to manage dashboards, workflows, and settings—or create an account to get started.
      </p>
      <div class="home__actions">
        <NuxtLink to="/signup" class="home__btn home__btn--primary">
          Create account
        </NuxtLink>
        <NuxtLink to="/login" class="home__btn home__btn--ghost">
          Log in
        </NuxtLink>
      </div>
    </section>

    <section class="home__features" aria-labelledby="features-title">
      <h2 id="features-title" class="home__features-title">What you can do</h2>
      <ul class="home__grid">
        <li class="home__card">
          <span class="home__card-icon" aria-hidden="true" />
          <h3 class="home__card-title">Dashboards</h3>
          <p class="home__card-text">Role-based views tailored to how your team works.</p>
        </li>
        <li class="home__card">
          <span class="home__card-icon home__card-icon--b" aria-hidden="true" />
          <h3 class="home__card-title">Workflows</h3>
          <p class="home__card-text">Connect processes and keep everyone aligned.</p>
        </li>
        <li class="home__card">
          <span class="home__card-icon home__card-icon--c" aria-hidden="true" />
          <h3 class="home__card-title">Settings</h3>
          <p class="home__card-text">Configure access, hierarchy, and domain options in one place.</p>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup>
useHead({
  title: 'Toggle',
  meta: [
    { name: 'description', content: 'Toggle — workspace dashboards, workflows, and settings.' },
  ],
})
</script>

<style scoped>
.home {
  max-width: 960px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
}

.home__hero {
  text-align: center;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(203, 213, 225, 0.2);
}

.home__eyebrow {
  margin: 0 0 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.home__title {
  margin: 0 0 1rem;
  font-size: clamp(1.75rem, 4vw, 2.35rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.03em;
  color: var(--text-color-one);
}

.home__brand {
  background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 45%, #e9d5ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.home__lead {
  margin: 0 auto 1.75rem;
  max-width: 34rem;
  font-size: 1.0625rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.72);
}

.home__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
}

.home__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 10rem;
  padding: 0.65rem 1.35rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  border: 1px solid transparent;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;
}

.home__btn--primary {
  color: #0f172a;
  background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 50%, #ddd6fe 100%);
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.35);
}

.home__btn--primary:hover {
  box-shadow: 0 4px 18px rgba(99, 102, 241, 0.45);
}

.home__btn--ghost {
  color: var(--text-color-one);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(203, 213, 225, 0.35);
}

.home__btn--ghost:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(203, 213, 225, 0.5);
}

.home__features {
  padding-top: 3rem;
}

.home__features-title {
  margin: 0 0 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
}

.home__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .home__grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
}

.home__card {
  margin: 0;
  padding: 1.25rem 1.15rem;
  border-radius: 12px;
  border: 1px solid rgba(203, 213, 225, 0.18);
  background: rgba(255, 255, 255, 0.03);
  transition: border-color 0.15s ease, background 0.15s ease;
}

.home__card:hover {
  border-color: rgba(203, 213, 225, 0.28);
  background: rgba(255, 255, 255, 0.05);
}

.home__card-icon {
  display: block;
  width: 2.25rem;
  height: 2.25rem;
  margin-bottom: 0.85rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a855f7 100%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.home__card-icon--b {
  background: linear-gradient(135deg, #22d3ee 0%, #6366f1 100%);
}

.home__card-icon--c {
  background: linear-gradient(135deg, #f472b6 0%, #a855f7 100%);
}

.home__card-title {
  margin: 0 0 0.4rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color-one);
}

.home__card-text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.65);
}
</style>
