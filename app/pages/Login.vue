<template> <!-- SANDEEP SANA-->
  <div class="login-page">
    <div class="login-page__card">
      <header class="login-page__head">
        <div class="login-page__brand-mark" aria-hidden="true" />
        <p class="login-page__eyebrow">Toggle</p>
        <h1 class="login-page__title">Log in</h1>
        <p class="login-page__sub">Enter your email and password to continue.</p>
      </header>

      <Form class="login-page__form" @submit="submit">
        <div class="login-page__field">
          <label class="login-page__label" for="email">Email</label>
          <Field
            id="email"
            name="email"
            type="email"
            class="login-page__input"
            autocomplete="email"
            placeholder="you@company.com"
            rules="required|nospace|email"
            v-model="login.email"
          />
          <ErrorMessage name="email" class="login-page__error" />
        </div>

        <div class="login-page__field">
          <label class="login-page__label" for="password">Password</label>
          <Field
            id="password"
            name="password"
            type="password"
            class="login-page__input"
            autocomplete="current-password"
            placeholder="••••••••"
            rules="required|nospace|min:2"
            v-model="login.password"
          />
          <ErrorMessage name="password" class="login-page__error" />
        </div>

        <button type="submit" class="login-page__submit">
          Sign in
        </button>
      </Form>

      <p class="login-page__footer">
        No account yet?
        <NuxtLink to="/signup" class="login-page__link">Create an account</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import STATUS from '~~/status';
import api from '~~/api.config';
import { ROLE } from '~~/constant';
import { Field, ErrorMessage, Form } from 'vee-validate';

const router = useRouter();
const config = useRuntimeConfig();
const { $toast, $speak } = useNuxtApp();

const login = reactive({});

useHead({
  title: 'Log in',
});

const submit = async () => {
  try {
    const response = await api.get(`${config.public.API}/user/fetch`, {
      params: {
        email: login.email,
        password: login.password,
      }
    });
    if (response.status === STATUS.OK) {
      console.log(response)
      $toast.success(response.data.message);
      $speak(response.data.message);
      const { activeRole, _id, domain } = response.data.user;
      const rolePath = `/${activeRole.toLowerCase()}/dashboard`;
      localStorage.setItem('_id', _id);
      if (domain === 'toggle') {
        if (activeRole === ROLE.SUPER_ADMIN) {
          router.push(rolePath);
        } else {
          window.location.href = `${config.public.AUTH}${domain}.${config.public.DOMAIN}`;
        }
      } else {
        router.push(rolePath);
      }
    }
  } catch (error) {
    console.log(error)
    $toast.error(error.response.data.message);
    $speak(error.response.data.message);
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem 3rem;
}

.login-page__card {
  width: 100%;
  max-width: 26rem;
  padding: 2rem 1.75rem 1.75rem;
  border-radius: 16px;
  border: 1px solid rgba(203, 213, 225, 0.2);
  background: rgba(255, 255, 255, 0.04);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 24px 48px rgba(0, 0, 0, 0.35);
}

.login-page__head {
  text-align: center;
  margin-bottom: 1.75rem;
}

.login-page__brand-mark {
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 auto 1rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a855f7 100%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
}

.login-page__eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.login-page__title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-color-one);
}

.login-page__sub {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.65);
}

.login-page__form {
  text-align: left;
}

.login-page__field {
  margin-bottom: 1.15rem;
}

.login-page__label {
  display: block;
  width: auto;
  margin: 0 0 0.4rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}

.login-page__input {
  width: 100%;
  margin: 0;
  padding: 0.65rem 0.85rem;
  font-size: 1rem;
  border-radius: 10px;
  border: 1px solid var(--border-color-one);
  background-color: rgba(35, 35, 51, 0.85);
  color: var(--text-color-one);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.login-page__input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.login-page__input:hover {
  border-color: rgba(203, 213, 225, 0.55);
}

.login-page__input:focus {
  outline: none;
  border-color: rgba(165, 180, 252, 0.65);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
}

.login-page__error {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.8125rem;
  color: #fca5a5;
}

.login-page__submit {
  width: 100%;
  margin: 0.5rem 0 0;
  padding: 0.7rem 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  color: #0f172a;
  background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 50%, #ddd6fe 100%);
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.35);
  transition: box-shadow 0.15s ease, transform 0.1s ease;
}

.login-page__submit:hover {
  box-shadow: 0 4px 18px rgba(99, 102, 241, 0.45);
}

.login-page__submit:active {
  transform: translateY(1px);
}

.login-page__footer {
  margin: 1.5rem 0 0;
  text-align: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.55);
}

.login-page__link {
  margin-left: 0.25rem;
  font-weight: 600;
  color: #c4b5fd;
  text-decoration: none;
  transition: color 0.15s ease;
}

.login-page__link:hover {
  color: #e9d5ff;
  text-decoration: underline;
}
</style>
