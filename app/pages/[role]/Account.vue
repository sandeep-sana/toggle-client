<template>
  <div class="account">
    <div class="heading">
      <div class="left">
        <h1>Accounts</h1>
      </div>
    </div>
    <div class="body d-flex flex-wrap">
      <div v-for="user in users" class="card d-flex flex-row">
        <div class="left">
          <p>Email: {{ user.email }}</p>
          <p>Domain: {{ user.domain }}</p>
          <p>LastName: {{ user.lastName }}</p>
          <p>FirstName: {{ user.firstName }}</p>
          <p>CompanyName: {{ user.companyName }}</p>
          <p>PhoneNumber: {{ user.phoneNumber }}</p>
          <p>Description: {{ user.description }}</p>
          <p>Status: {{ user.status }}</p>
          <p>Price: {{ user.price }}</p>
        </div>
        <div class="right">
          <button class="accept" @click="openAccept(user)">Accept</button>
          <button class="reject" @click="openReject(user)">Reject</button>
        </div>
      </div>
    </div>
  </div>
  <Confirmation v-if="modal.isConfirmation" :modal="modal" />
</template>

<script setup>
import api from '~~/api.config';
import Confirmation from '../../modal/Confirmation.vue';
import { ROLE, STATUS, USER_STATUS } from '~~/constant';
import { ref, reactive, computed, onMounted } from 'vue';

const users = ref([]);
const loading = ref(false);
const config = useRuntimeConfig();
const { $session, $toast, $logout, $speak } = useNuxtApp();

const modal = ref({
  isConfirmation: false,
  message: null,
  _id: null,
  reject: null
});

const init = async () => {
  loading.value = true;
  try {
    const query = { role: ROLE.SYSTEM_ADMIN, status: USER_STATUS.PENDING };
    const res = await api.get(`${config.public.API}/user/fetchs`, {
      params: { query: JSON.stringify(query) }
    });
    if (res.status === STATUS.OK) {
      users.value = res.data.users || [];
    }
  } catch (e) {
    console.error(e);
    $toast.error('Failed to load users.');
  } finally {
    loading.value = false;
  }
};

const openAccept = (user) => {
  modal.value.isConfirmation = true;
  modal.value.message = `Do you want to accept “${user.companyName || user.email}”?`;
  modal.value._id = user._id;
  modal.value.reject = acceptUser;
};
const acceptUser = async (_id) => {
  try {
    const query = {
      _id
    }
    const projection = { status: USER_STATUS.ACCEPT };
    const response = await api.post(`${config.public.API}/user/update`, {
      query: JSON.stringify(query),
      projection: JSON.stringify(projection),
    });
    if (response.status === STATUS.OK) {
      $toast.success(response.data.message);
      $speak(response.data.message);
      users.value = users.value.filter(u => u._id !== _id);
    }
  } catch (error) {
    console.error(error);
    $toast.error('Failed to accept. Please try again.');
  } finally {
    modal.value.isConfirmation = false;
  }
};
const openReject = (user) => {
  modal.value.isConfirmation = true;
  modal.value.message = `Do you want to reject “${user.companyName || user.email}”?`;
  modal.value._id = user._id;
  modal.value.reject = rejectUser;
};
const rejectUser = async (_id) => {
  try {
    const query = {
      _id
    }
    const projection = { status: USER_STATUS.REJECT };
    const response = await api.post(`${config.public.API}/user/update`, {
      query: JSON.stringify(query),
      projection: JSON.stringify(projection),
    });
    if (response.status === STATUS.OK) {
      $toast.success(response.data.message);
      $speak(response.data.message);
      users.value = users.value.filter(u => u._id !== _id);
    }
  } catch (error) {
    console.error(error);
    $toast.error('Failed to reject. Please try again.');
  } finally {
    modal.value.isConfirmation = false;
  }
};

onMounted(async () => {
  const _id = $session();
  if (!_id) return $logout();
  await init();
});
</script>

<style scoped>
.account {
  width: 100%;
  padding: 10px;
  color: var(--text-color-one);
}

.heading {
  background: var(--background-color-two);
  padding: 10px;
  border: 1px solid var(--border-color-one);
  border-radius: 12px;
}

.left h1 {
  font-size: 24px;
  padding: 0;
  margin: 0;
}

.body {
  padding: 5px 0;
}

.left {}

.right {
  display: flex;
  flex-direction: column;
}

.right .accept {
  background: var(--background-color-two);
  border: 1px solid var(--border-color-one);
  border-radius: 10px;
  padding: 5px 10px;
  color: var(--text-color-one);
  margin: 5px;
}

.right .reject {
  padding: 5px 10px;
  border: 1px solid var(--border-color-one);
  border-radius: 10px;
  background-color: var(--background-color-two);
  color: var(--text-color-one);
  margin: 5px;
}

.right .accept:hover {
  background-color: var(--background-color-three);

}

.right .reject:hover {
  background-color: var(--background-color-three);
}

.card {
  background: var(--background-color-two);
  border: 1px solid var(--border-color-one);
  color: var(--text-color-one);
  padding: 10px;
  margin: 5px;
}
</style>