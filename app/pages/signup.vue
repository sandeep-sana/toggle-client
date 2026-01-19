<template>
  <div class="signup-wrapper">
    <Form class="signup-card" @submit="onSubmit">
      <h2>Create Account</h2>
      <div class="form-group">
        <label>Domain</label>
        <Field name="domain" as="input" v-model="signup.domain" rules="required|min:2" placeholder="yourdomain" />
        <ErrorMessage name="domain" class="error" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <Field name="email" as="input" v-model="signup.email" rules="required|email" placeholder="you@example.com" />
        <ErrorMessage name="email" class="error" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <div class="password-wrap">
          <Field name="password" :type="showPass ? 'text' : 'password'" as="input" v-model="signup.password"
            rules="required|min:8" />
          <button type="button" class="eye-btn" @click="showPass = !showPass">
            <i :class="showPass ? 'ri-eye-off-line' : 'ri-eye-line'"></i>
          </button>
        </div>
        <ErrorMessage name="password" class="error" />
      </div>
      <div class="form-group">
        <label>Confirm Password</label>
        <Field name="confirmpassword" :type="showPass ? 'text' : 'password'" as="input" v-model="signup.confirmpassword"
          :rules="confirmPasswordRule" placeholder="********" />
        <ErrorMessage name="confirmpassword" class="error" />
      </div>
      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? "Signing Up..." : "Sign Up" }}
      </button>
    </Form>
  </div>
</template>

<script setup>
import api from "~/api.config";
import { ROLE } from "~/constant";
import { reactive, ref } from "vue";
import { Field, ErrorMessage, Form } from "vee-validate";

const loading = ref(false);
const showPass = ref(false);
const config = useRuntimeConfig();

const signup = reactive({
  domain: "",
  email: "",
  password: "",
  confirmpassword: ""
});

// confirm password validation (matches password)
const confirmPasswordRule = (value) => {
  if (!value) return "Confirm password is required";
  if (value.length < 8) return "Minimum 8 characters";
  if (value !== signup.password) return "Password and confirm password must match";
  return true;
};

const onSubmit = async () => {
  loading.value = true;
  try {
    const query = {
      ...values,
      role: [ROLE.SYSTEM_ADMIN],
      activeRole: ROLE.SYSTEM_ADMIN,
    }
    try {
      const response = await api.post(`${config.public.API}/user/add`, {
        query: JSON.stringify(query),
      });
      if (response.status === STATUS.CREATED) {
        router.push('/');
        $toast.success(response.data.message);
        $speak(response.data.message);
      }
    } catch (error) {
      console.log(error)
      $toast.error(error.response.data.message);
      $speak(error.response.data.message);
    }
  } catch (e) {
    console.log(e);
    alert("Something went wrong");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.signup-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
}

.signup-card {
  background: #ffffff;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.signup-card h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

label {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  color: #555;
}

input {
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  width: 100%;
}

input:focus {
  outline: none;
  border-color: #4f46e5;
}

.password-wrap {
  position: relative;
  width: 100%;
}

.password-wrap input {
  width: 100%;
  padding-right: 10px;
  /* space for eye icon */
}

.eye-btn {
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #444;
  border-radius: 8px;
}

.eye-btn:focus,
.eye-btn:focus-visible {
  outline: none;
  box-shadow: none;
}

.error {
  color: #e11d48;
  font-size: 0.75rem;
  margin-top: 0.2rem;
}

.btn-primary {
  width: 100%;
  margin-top: 1rem;
  padding: 0.7rem;
  border: none;
  border-radius: 6px;
  background: #4f46e5;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
