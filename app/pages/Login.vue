<template>
  <div class="login">
    <div class="login-box">
      <Form @submit="submit">
        <div>
          <!-- Email -->
          <label for="email">Email</label>
          <Field name="email" placeholder="Email" rules="required|nospace|email" v-model="login.email"></Field>
          <ErrorMessage name="email"></ErrorMessage>
        </div>
        <div>
          <!-- Password -->
          <label for="password">Password</label>
          <Field name="password" placeholder="Password" rules="required|nospace|min:2" v-model="login.password"></Field>
          <ErrorMessage name="password"></ErrorMessage>
        </div>
        <button type="submit">Submit</button>
      </Form>
    </div>
  </div>
</template>

<script setup>
import STATUS from '~~/status';
import api from '~~/api.config';
import { Field, ErrorMessage, Form } from 'vee-validate';

const router = useRouter();
const config = useRuntimeConfig();
const { $toast, $speak } = useNuxtApp();

// variables
const login = reactive({});

// methods
const submit = async () => {
  try {
    const query = { ...login };
    const response = await api.get(`${config.public.API}/user/fetch`, {
      params: {
        query: JSON.stringify(query),
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
.login {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.login-box {
  padding: 10px;
  text-align: center;
}
</style>