<template>
  <section class="user-page">
    <header class="user-page__header">
      <div>
        <p class="user-page__eyebrow">Users</p>
        <h1>Pending user accounts</h1>
      </div>
      <div class="user-page__header-actions">
        <span class="user-page__count">{{ users.length }} pending</span>
        <button type="button" class="btn btn--add-user" @click="openAddUserModal">
          + Add User
        </button>
      </div>
    </header>

    <div v-if="loading" class="user-page__state">Loading users...</div>

    <div v-else-if="!users.length" class="user-page__state user-page__state--empty">
      No pending users found.
    </div>

    <div v-else class="user-table-wrap">
      <table class="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Phone</th>
            <th>Description</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ `${user.firstName || ''} ${user.lastName || ''}`.trim() || '-' }}</td>
            <td>{{ user.companyName || '-' }}</td>
            <td>{{ user.phoneNumber || '-' }}</td>
            <td class="user-table__description">{{ user.description || '-' }}</td>
            <td>{{ user.email || '-' }}</td>
            <td>{{ user.role || '-' }}</td>
            <td>
              <span class="status-pill">{{ user.status || '-' }}</span>
            </td>
            <td>
              <div class="user-table__actions">
                <button
                  class="btn btn--icon btn--edit"
                  type="button"
                  title="Edit user"
                  aria-label="Edit user"
                  @click="editUser(user)"
                >
                  <span aria-hidden="true">✏️</span>
                </button>
                <button
                  class="btn btn--icon btn--delete"
                  type="button"
                  title="Delete user"
                  aria-label="Delete user"
                  @click="deleteUser(user._id)"
                >
                  <span aria-hidden="true">🗑️</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="showAddUserModal" @click.self="closeAddUserModal">
      <template #header>
        <div class="user-modal__header">
          <h3 class="user-modal__title">Add User</h3>
          <button type="button" class="user-modal__close" @click="closeAddUserModal">x</button>
        </div>
      </template>
      <template #body>
        <form class="user-modal__form" @submit.prevent="submitAddUser">
          <div class="user-modal__grid">
            <label>
              First name
              <input v-model.trim="newUser.firstName" type="text" required />
            </label>
            <label>
              Last name
              <input v-model.trim="newUser.lastName" type="text" />
            </label>
            <label>
              Company name
              <input v-model.trim="newUser.companyName" type="text" required />
            </label>
            <label>
              Domain
              <input v-model.trim="newUser.domain" type="text" required />
            </label>
            <label>
              Email
              <input v-model.trim="newUser.email" type="email" required />
            </label>
            <label>
              Phone number
              <input v-model.trim="newUser.phoneNumber" type="text" />
            </label>
            <label class="user-modal__description">
              Description
              <textarea v-model.trim="newUser.description" rows="3"></textarea>
            </label>
          </div>
          <div class="user-modal__actions">
            <button type="button" class="btn btn--modal-cancel" @click="closeAddUserModal">Cancel</button>
            <button type="submit" class="btn btn--modal-save" :disabled="submittingAddUser">
              {{ submittingAddUser ? 'Saving...' : 'Save User' }}
            </button>
          </div>
        </form>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import api from '~~/api.config';
import STATUS from '~~/status';
import Modal from '../../components/Modal.vue';
import { ROLE } from '../constant/role';

const config = useRuntimeConfig();
const { $toast } = useNuxtApp();

const users = ref([]);
const loading = ref(false);
const showAddUserModal = ref(false);
const submittingAddUser = ref(false);
const newUser = reactive({
  firstName: '',
  lastName: '',
  companyName: '',
  domain: '',
  email: '',
  phoneNumber: '',
  description: '',
});

const resetNewUser = () => {
  newUser.firstName = '';
  newUser.lastName = '';
  newUser.companyName = '';
  newUser.domain = '';
  newUser.email = '';
  newUser.phoneNumber = '';
  newUser.description = '';
};

const openAddUserModal = () => {
  showAddUserModal.value = true;
};

const closeAddUserModal = () => {
  showAddUserModal.value = false;
  resetNewUser();
};

const deleteUser = async (id) => {
  try {
    const response = await api.post(`${config.public.API}/user/change-status`, {
      _id: id,
      status: 'DELETE',
    });
    if (response.status === STATUS.OK) {
      users.value = users.value.filter((u) => u._id !== id);
      $toast.success(response.data.message);
    }
  } catch (error) {
    console.error(error);
    $toast.error('Failed to delete user.');
  }
};

const editUser = async (user) => {
  const firstName = window.prompt('First name', user.firstName || '');
  if (firstName === null) return;
  const lastName = window.prompt('Last name', user.lastName || '');
  if (lastName === null) return;
  const phoneNumber = window.prompt('Phone number', user.phoneNumber || '');
  if (phoneNumber === null) return;
  const description = window.prompt('Description', user.description || '');
  if (description === null) return;

  try {
    const query = { _id: user._id };
    const projection = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim(),
      description: description.trim(),
    };
    const response = await api.post(`${config.public.API}/user/update`, {
      query: JSON.stringify(query),
      projection: JSON.stringify(projection),
    });
    if (response.status === STATUS.OK) {
      users.value = users.value.map((u) =>
        u._id === user._id ? { ...u, ...projection } : u
      );
      $toast.success(response.data.message);
    }
  } catch (error) {
    console.error(error);
    $toast.error('Failed to edit user.');
  }
};

const submitAddUser = async () => {
  submittingAddUser.value = true;
  try {
    const payload = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      companyName: newUser.companyName,
      domain: newUser.domain.toLowerCase(),
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      description: newUser.description,
      role: [ROLE.SYSTEM_ADMIN],
      activeRole: ROLE.SYSTEM_ADMIN,
      status: 'ACCEPT',
    };
    const response = await api.post(`${config.public.API}/user/company-signup`, payload);
    if (response.status === STATUS.CREATED) {
      $toast.success(response.data.message);
      closeAddUserModal();
      const refresh = await api.get(`${config.public.API}/user/users`);
      if (refresh.status === STATUS.OK) {
        users.value = refresh.data.users || [];
      }
    }
  } catch (error) {
    console.error(error);
    $toast.error(error?.response?.data?.message || 'Failed to add user.');
  } finally {
    submittingAddUser.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    const response = await api.get(`${config.public.API}/user/users`);
    if (response.status === STATUS.OK) {
      users.value = response.data.users || [];
    } else {
      $toast.error(response.data.message);
    }
  } catch (error) {
    console.error(error);
    $toast.error('Failed to load users.');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.user-page {
  width: 100%;
  color: var(--text-color-one);
}

.user-page__header {
  border: 1px solid rgba(203, 213, 225, 0.2);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.95rem 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.user-page__header-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.user-page__eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.55);
}

.user-page__header h1 {
  margin: 0;
  font-size: 1.2rem;
}

.user-page__count {
  border: 1px solid rgba(251, 191, 36, 0.45);
  background: rgba(251, 191, 36, 0.12);
  color: #fde68a;
  border-radius: 999px;
  padding: 0.32rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.user-page__state {
  border: 1px dashed rgba(203, 213, 225, 0.35);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.user-page__state--empty {
  background: rgba(255, 255, 255, 0.02);
}

.user-table-wrap {
  border: 1px solid rgba(203, 213, 225, 0.2);
  border-radius: 12px;
  overflow: auto;
  background: rgba(255, 255, 255, 0.03);
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;
}

.user-table th,
.user-table td {
  border-bottom: 1px solid rgba(203, 213, 225, 0.14);
  padding: 0.72rem 0.8rem;
  text-align: left;
  vertical-align: top;
  font-size: 0.84rem;
}

.user-table th {
  background: rgba(15, 23, 42, 0.35);
  color: rgba(255, 255, 255, 0.72);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.72rem;
}

.user-table__description {
  max-width: 280px;
  color: rgba(255, 255, 255, 0.86);
}

.status-pill {
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(251, 191, 36, 0.45);
  background: rgba(251, 191, 36, 0.15);
  color: #fde68a;
  border-radius: 999px;
  padding: 0.14rem 0.45rem;
  font-size: 0.7rem;
  font-weight: 600;
}

.user-table__actions {
  display: flex;
  gap: 0.4rem;
}

.btn {
  width: auto;
  margin: 0;
  padding: 0.35rem 0.7rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn--icon {
  width: 2rem;
  height: 2rem;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 0.92rem;
  line-height: 1;
}

.btn--edit {
  color: #e0e7ff;
  border-color: rgba(165, 180, 252, 0.45);
  background: rgba(99, 102, 241, 0.15);
}

.btn--edit:hover {
  background: rgba(99, 102, 241, 0.25);
}

.btn--delete {
  color: #fecaca;
  border-color: rgba(248, 113, 113, 0.45);
  background: rgba(248, 113, 113, 0.12);
}

.btn--delete:hover {
  background: rgba(248, 113, 113, 0.2);
}

.btn--add-user {
  color: #0f172a;
  border-color: rgba(134, 239, 172, 0.65);
  background: linear-gradient(135deg, #86efac 0%, #4ade80 45%, #22c55e 100%);
}

.btn--add-user:hover {
  filter: brightness(1.05);
}

.user-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.user-modal__title {
  margin: 0;
  font-size: 1.05rem;
}

.user-modal__close {
  width: auto;
  margin: 0;
  padding: 0.2rem 0.55rem;
  border-radius: 8px;
}

.user-modal__form {
  display: grid;
  gap: 0.8rem;
}

.user-modal__grid {
  display: grid;
  gap: 0.65rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.user-modal__description {
  grid-column: 1 / -1;
}

.user-modal__description textarea {
  width: 100%;
  background-color: var(--background-color-one);
  border: 1px solid var(--border-color-one);
  font-size: 16px;
  padding: 10px;
  border-radius: 10px;
  color: var(--text-color-one);
  resize: vertical;
}

.user-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.55rem;
}

.btn--modal-cancel {
  border-color: rgba(203, 213, 225, 0.4);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-color-one);
}

.btn--modal-save {
  color: #0f172a;
  border-color: rgba(134, 239, 172, 0.65);
  background: linear-gradient(135deg, #86efac 0%, #4ade80 45%, #22c55e 100%);
}

.btn--modal-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .user-page__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-page__header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .user-modal__grid {
    grid-template-columns: 1fr;
  }
}
</style>