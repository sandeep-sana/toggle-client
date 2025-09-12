<template>
  <div
    class="container-fluid position-relative d-flex p-0 justify-content-end sign-back"
    style="width: 60vw; height: 80vh; margin-top: 5vh; border-radius: 15px; overflow: hidden;"
  >
    <!-- Background Image -->
    <img
      src="assets/images/signupd.jpg"
      class="img-fluid image-back h-100 w-100 object-fit-cover"
      alt="Signup background"
    />

    <!-- Glassmorphic Card -->
    <div class="col-md-6 d-flex align-items-center glass-card justify-content-center position-relative shadow-lg">
      <div class="p-4 rounded-4 w-100">
        <form @submit="login" novalidate>
          <h3 class="text-center mb-4 fw-bold text-white">Login</h3>

          <div class="row">
            <!-- Email -->
            <div class="form-floating mb-3 col-12">
              <Field
                name="email"
                as="input"
                type="text"
                class="form-control"
                id="email"
                placeholder="Email"
                rules="required|nospace|email"
              />
              <label :class="`${values.email? 'fix-top': ''}`" for="email">Email</label>
              <ErrorMessage name="email" class="error-message" />
            </div>

            <!-- Password -->
            <div class="form-floating mb-3 col-12">
              <Field
                name="password"
                as="input"
                type="password"
                class="form-control"
                id="password"
                placeholder="Password"
                rules="required|nospace|min:5"
              />
              <label :class="`${values.password? 'fix-top': ''}`" for="password">Password</label>
              <ErrorMessage name="password" class="error-message" />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="d-grid">
            <button type="submit" class="btn btn-light btn-lg fw-semibold" :disabled="isSubmitting">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Field, ErrorMessage, useForm } from 'vee-validate';
import api from '~~/api.config';
import STATUS from '~~/status';
import { useRouter } from 'vue-router';
import { subDomain } from '~~/function';

const dbName = ref(null);
const router = useRouter();
const { $toast } = useNuxtApp();    
const config = useRuntimeConfig();
const { handleSubmit, isSubmitting, values } = useForm({});

const login = handleSubmit(async (values) => {
  const query = { ...values };
  try {
    const response = await api.get(`${config.public.API}/user/user`, {
      params: {
        query: JSON.stringify(query),
        dbName: dbName.value,
      }
    });

    if (response.status === STATUS.OK) {
      console.log(response);
      localStorage.setItem('_id', response.data.user._id);
      $toast.success(response.data.message);
      router.push('/dashboard');
    }
  } catch (error) {
    $toast.error(error.response.data.message);
  }
});

const init = () => {
  const domain = subDomain();
  dbName.value = domain;
};

onMounted(init);
</script>

<style scoped>
/* Glass effect */
.glass-card {
  background: #353535;
}

/* Background image */
.image-back {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

/* Custom floating labels */
.custom-label {
  color: #6c757d;
  font-size: 0.95rem;
  transition: all 0.2s ease-in-out;
}

/* Label floating outside the input */
.form-control:focus ~ .custom-label,
.form-control:not(:placeholder-shown) ~ .custom-label {
  color: #0d6efd;
  font-size: 0.8rem;
  transform: translateY(-0.8rem) translateX(-0.2rem);
  background: #fff;
  padding: 0 4px;
  border-radius: 4px;
}

/* Form control styling */
.form-control {
  background-color: #353535 !important;
  border: 1px solid #ced4da;
  color: #fff !important;
  margin: 5px;
}

/* Submit button */
.btn-light {
  background-color: #f8f9fa;
  color: #343a40;
  border: 1px solid #ced4da;
  transition: background-color 0.3s ease-in-out;
}

.btn-light:hover {
  background-color: #e2e6ea;
}

/* Error message */
.error-message {
  color: #f44336;
  font-size: 0.875rem;
}
</style>
