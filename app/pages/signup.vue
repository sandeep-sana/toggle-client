<template>
  <div class="signup-wrapper">
    <Form class="signup-card">
      <h2>Create Account</h2>

      <div class="form-group">
        <label>Domain</label>
        <Field name="domain" v-model="signup.domain" rules="required|min:2" />
        <ErrorMessage name="domain" class="error" />
      </div>

      <div class="form-group">
        <label>Email</label>
        <Field name="email" v-model="signup.email" rules="required|email" />
        <ErrorMessage name="email" class="error" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <Field
          name="password"
          type="password"
          v-model="signup.password"
          rules="required|min:8"
        />
        <ErrorMessage name="password" class="error" />
      </div>

      <div class="form-group">
        <label>Confirm Password</label>
        <Field
          name="confirmpassword"
          type="password"
          v-model="signup.confirmpassword"
          rules="required|min:8"
        />
        <ErrorMessage name="confirmpassword" class="error" />
      </div>

      <button type="submit" class="btn-primary">Sign Up</button>
    </Form>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import { Field, ErrorMessage, Form } from 'vee-validate'

const signup = reactive({
  domain: '',
  email: '',
  password: '',
  confirmpassword: ''
})
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
}

input:focus {
  outline: none;
  border-color: #4f46e5;
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
</style>
