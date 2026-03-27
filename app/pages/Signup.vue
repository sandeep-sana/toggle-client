<template> <!-- SANDEEP SANA-->
  <div class="signup-page">
    <div class="signup-page__card">
      <header class="signup-page__head">
        <div class="signup-page__brand-mark" aria-hidden="true" />
        <p class="signup-page__eyebrow">Toggle</p>
        <h1 class="signup-page__title">Create an account</h1>
        <p class="signup-page__sub">
          Register your organization. Fields marked with validation rules apply on submit.
        </p>
      </header>

      <form class="signup-page__form" novalidate @submit="signup">
        <div class="signup-page__grid">
          <div class="signup-page__field">
            <label class="signup-page__label" for="domain">Domain</label>
            <Field
              id="domain"
              name="domain"
              as="input"
              type="text"
              class="signup-page__input"
              placeholder="your-domain"
              rules="required|nospace|nouppercase|alphabate|min:3|max:12"
            />
            <ErrorMessage name="domain" class="signup-page__error" />
          </div>

          <div class="signup-page__field">
            <label class="signup-page__label" for="firstName">First name</label>
            <Field
              id="firstName"
              name="firstName"
              as="input"
              type="text"
              class="signup-page__input"
              placeholder="First name"
              rules="required|nospace|alphabate|min:3|max:50"
            />
            <ErrorMessage name="firstName" class="signup-page__error" />
          </div>

          <div class="signup-page__field">
            <label class="signup-page__label" for="lastName">Last name</label>
            <Field
              id="lastName"
              name="lastName"
              as="input"
              type="text"
              class="signup-page__input"
              placeholder="Last name"
              rules="required|nospace|alphabate|min:3|max:50"
            />
            <ErrorMessage name="lastName" class="signup-page__error" />
          </div>

          <div class="signup-page__field">
            <label class="signup-page__label" for="companyName">Company name</label>
            <Field
              id="companyName"
              name="companyName"
              as="input"
              type="text"
              class="signup-page__input"
              placeholder="Company name"
              rules="required|min:3|max:50"
            />
            <ErrorMessage name="companyName" class="signup-page__error" />
          </div>

          <div class="signup-page__field">
            <label class="signup-page__label" for="email">Company email</label>
            <Field
              id="email"
              name="email"
              as="input"
              type="email"
              class="signup-page__input"
              autocomplete="email"
              placeholder="you@company.com"
              rules="required|nospace|email"
            />
            <ErrorMessage name="email" class="signup-page__error" />
          </div>

          <div class="signup-page__field">
            <label class="signup-page__label" for="phoneNumber">Phone</label>
            <Field
              id="phoneNumber"
              name="phoneNumber"
              as="input"
              type="tel"
              inputmode="numeric"
              class="signup-page__input"
              placeholder="10-digit number"
              rules="required|nospace|min:10|max:10"
            />
            <ErrorMessage name="phoneNumber" class="signup-page__error" />
          </div>

          <div class="signup-page__field">
            <label class="signup-page__label" for="price">Category</label>
            <Field
              id="price"
              name="price"
              as="select"
              class="signup-page__input signup-page__select"
              rules="required|nospace"
            >
              <option value="" disabled>Select a plan</option>
              <option
                v-for="category in reactiveSignup.price"
                :key="String(category.amount)"
                :value="category.amount"
              >
                {{ category.name }}
              </option>
            </Field>
            <ErrorMessage name="price" class="signup-page__error" />
          </div>

          <div class="signup-page__field signup-page__field--full">
            <label class="signup-page__label" for="description">Description</label>
            <Field
              id="description"
              name="description"
              as="textarea"
              class="signup-page__input signup-page__textarea"
              rows="4"
              placeholder="Tell us about your organization"
              rules="required"
            />
            <ErrorMessage name="description" class="signup-page__error" />
          </div>
        </div>

        <button
          type="submit"
          class="signup-page__submit"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Submitting…' : 'Create account' }}
        </button>
      </form>

      <p class="signup-page__footer">
        Already registered?
        <NuxtLink to="/login" class="signup-page__link">Log in</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import api from '~~/api.config';
import { ROLE, STATUS } from '~~/constant';
import { Field, ErrorMessage, useForm } from 'vee-validate';

const reactiveSignup = reactive({
  price: [],
});

const router = useRouter();
const config = useRuntimeConfig();
const { $toast, $speak, $session, $login } = useNuxtApp();
const { handleSubmit, isSubmitting } = useForm({});

useHead({
  title: 'Sign up',
});

const signup = handleSubmit(async (formValues) => {
  const query = {
    ...formValues,
    role: [ROLE.SYSTEM_ADMIN],
    activeRole: ROLE.SYSTEM_ADMIN,
  };
  try {
    const response = await api.post(`${config.public.API}/user/company-signup`, {
      ...query,
    });
    console.log(response);
    if (response.status === STATUS.CREATED) {
      router.push('/');
      $toast.success(response.data.message);
      $speak(response.data.message);
    }
  } catch (error) {
    console.log(error);
    $toast.error(error.response.data.message);
    $speak(error.response.data.message);
  }
});

const fetchPrices = async () => {
  try {
    const response = await api.get(`${config.public.API}/price/fetchs`);
    if (response.status === STATUS.OK) {
      reactiveSignup.price = response.data.prices;
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  const _id = $session();
  if (_id) {
    await $login();
  }
  await fetchPrices();
});
</script>

<style scoped>
.signup-page {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1.25rem 3rem;
}

.signup-page__card {
  width: 100%;
  max-width: 44rem;
  padding: 2rem 1.75rem 1.75rem;
  border-radius: 16px;
  border: 1px solid rgba(203, 213, 225, 0.2);
  background: rgba(255, 255, 255, 0.04);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 24px 48px rgba(0, 0, 0, 0.35);
}

.signup-page__head {
  text-align: center;
  margin-bottom: 1.75rem;
}

.signup-page__brand-mark {
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 auto 1rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a855f7 100%);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12) inset;
}

.signup-page__eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.signup-page__title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-color-one);
}

.signup-page__sub {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.65);
}

.signup-page__form {
  text-align: left;
}

.signup-page__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem 1.25rem;
  margin-bottom: 1.25rem;
}

@media (min-width: 560px) {
  .signup-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .signup-page__field--full {
    grid-column: 1 / -1;
  }
}

.signup-page__field {
  margin: 0;
}

.signup-page__label {
  display: block;
  width: auto;
  margin: 0 0 0.4rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}

.signup-page__input {
  width: 100%;
  margin: 0;
  padding: 0.65rem 0.85rem;
  font-size: 1rem;
  border-radius: 10px;
  border: 1px solid var(--border-color-one);
  background-color: rgba(35, 35, 51, 0.85);
  color: var(--text-color-one);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}

.signup-page__input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.signup-page__input:hover {
  border-color: rgba(203, 213, 225, 0.55);
}

.signup-page__input:focus {
  outline: none;
  border-color: rgba(165, 180, 252, 0.65);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
}

.signup-page__select {
  appearance: none;
  padding-right: 2.25rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23cbd5e1' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  cursor: pointer;
}

.signup-page__textarea {
  min-height: 6.5rem;
  resize: vertical;
  line-height: 1.5;
}

.signup-page__error {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.8125rem;
  color: #fca5a5;
}

.signup-page__submit {
  width: 100%;
  margin: 0;
  padding: 0.7rem 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  color: #0f172a;
  background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 50%, #ddd6fe 100%);
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.35);
  transition:
    box-shadow 0.15s ease,
    transform 0.1s ease,
    opacity 0.15s ease;
}

.signup-page__submit:hover:not(:disabled) {
  box-shadow: 0 4px 18px rgba(99, 102, 241, 0.45);
}

.signup-page__submit:active:not(:disabled) {
  transform: translateY(1px);
}

.signup-page__submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.signup-page__footer {
  margin: 1.5rem 0 0;
  text-align: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.55);
}

.signup-page__link {
  margin-left: 0.25rem;
  font-weight: 600;
  color: #c4b5fd;
  text-decoration: none;
  transition: color 0.15s ease;
}

.signup-page__link:hover {
  color: #e9d5ff;
  text-decoration: underline;
}
</style>
