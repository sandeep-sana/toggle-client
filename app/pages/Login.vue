<template>
  <div>
    <Form @submit="submit">
      <!-- Email -->
      <div>
        <label for="email">Email</label>
        <Field name="email" placeholder="Email" rules="required|nospace|email" v-model="login.email"></Field>
        <ErrorMessage name="email"></ErrorMessage>
      </div>
      <button type="submit">Submit</button>
    </Form>
  </div>
</template>

<script setup>
import { Field, ErrorMessage, Form } from 'vee-validate';

// variables
const login = reactive({});

// methods
const submit = async() => {
  
}



</script>

<style scoped></style>