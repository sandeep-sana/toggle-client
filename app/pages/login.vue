<template>
    <div class="login-wrapper">
            <Form class="login-card">
                <div class="form-group">
                    <label>Email</label>
                    <Field name="email" v-model="login.email" rules='required|email' />
                    <ErrorMessage name="email" class="error" />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <Field name="password" type="password" v-model="login.password" rules='required' />
                    <ErrorMessage name="password" class="error" />
                </div>
                <button type="submit" class="btn-primary">Login</button>
            </Form>
    </div>

</template>

<script setup>
import { reactive } from 'vue';
import { Field, ErrorMessage, Form } from 'vee-validate'

const login = reactive({
    email: '',
    password: ''
})
</script>

<style scoped>
.login-wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(255, 255, 255);
    min-height: 100vh;
}

.login-card {
    background: #ffffff;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
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
</style>