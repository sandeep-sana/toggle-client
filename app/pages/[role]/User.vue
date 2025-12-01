<template>
    <div class="user">
        <div class="header">
            <div class="left">
                <h1>User</h1>
            </div>
            <div class="right">
                <button v-tippy="`Add User`" type="button" @click="addUser">Add User</button>
            </div>
        </div>
        <div class="body d-flex flex-wrap">
            <div v-for="list in user.list" class="list d-flex flex-row">
                <div class="left">
                    <p>First Name: {{ list.firstName }}</p>
                    <p>Last Name: {{ list.lastName }}</p>
                    <p>Email: {{ list.email }}</p>
                    <p>Password: {{ list.password }}</p>
                    <p>Status: {{ list.status }}</p>
                </div>
                <div class="right">
                    <button @click="editUser(list)">Edit</button>
                    <button @click="deleteuser(list)">Delete</button>
                </div>
            </div>
        </div>
    </div>
    <!-- add user -->
    <Modal v-if="user.isShow">
        <template #header>
            <h2 class="text-center text-xl font-bold text-primary">
                <i class="fa fa-plus-circle"></i> Add User
            </h2>
        </template>
        <template #body>
            <Form @submit="submit">
                <div class="row">
                    <div class="mb-3 col-3">
                        <label for="firstName" class="form-label">First Name</label>
                        <Field name="firstName" as="input" type="text" id="firstName" class="form-control"
                            placeholder="Enter First Name" rules="required|nospace" v-model="user.data.firstName" />
                        <ErrorMessage name="firstName" class="text-danger mt-2" />
                    </div>
                    <div class="mb-3 col-3">
                        <label for="lastName" class="form-label">Last Name</label>
                        <Field name="lastName" as="input" type="text" id="lastName" class="form-control"
                            placeholder="Enter Last Name" rules="required|nospace" v-model="user.data.lastName" />
                        <ErrorMessage name="lastName" class="text-danger mt-2" />
                    </div>
                    <div class="mb-3 col-3">
                        <label for="email" class="form-label">Email</label>
                        <Field name="email" as="input" type="text" id="email" class="form-control"
                            placeholder="Enter email" rules="required|nospace|email" v-model="user.data.email" />
                        <ErrorMessage name="email" class="text-danger mt-2" />
                    </div>
                    <div class="mb-3 col-3">
                        <label for="password" class="form-label">Password</label>
                        <Field name="password" as="input" type="password" id="password" class="form-control"
                            placeholder="Enter password" rules="required|nospace" v-model="user.data.password" />
                        <ErrorMessage name="password" class="text-danger mt-2" />
                    </div>
                    <div class="mb-3 col-3">
                        <label for="phoneNumber" class="form-label">Phone Number</label>
                        <Field name="phoneNumber" as="input" type="number" id="phoneNumber" class="form-control"
                            placeholder="Enter Phone Number" rules="required|nospace|min:10|max:10"
                            v-model="user.data.phoneNumber" />
                        <ErrorMessage name="phoneNumber" class="text-danger mt-2" />
                    </div>
                    <div class="mb-3 col-3">
                        <label for="role" class="form-label">Role</label>
                        <Multiselect v-model="user.data.role" :options="user.roles" :multiple="true"
                            :close-on-select="false" placeholder="Add or pick values" :taggable="true"
                            rules="required" />
                        <ErrorMessage name="role" class="text-danger mt-2" />
                    </div>
                </div>

                <div class="d-flex justify-content-end gap-3">
                    <button type="button" @click="user.isShow = false" class="btn btn-secondary">
                        <i class="fa fa-times-circle"></i> Cancel
                    </button>
                    <button type="submit" class="btn btn-success">
                        <i class="fa fa-save"></i> Save
                    </button>
                </div>
            </Form>
        </template>
    </Modal>
</template>

<script setup>
import { reactive } from 'vue';
import api from '~~/api.config';
import Modal from '~~/modal/Modal.vue';
import { ROLE, STATUS } from '~~/constant';
import Multiselect from 'vue-multiselect';
import { ErrorMessage, Field, Form } from 'vee-validate';

const user = reactive({
    list: [],
    isShow: false,
    roles: [],
    data: {},
})

const config = useRuntimeConfig();
const { $session, $toast, $logout, $speak } = useNuxtApp();

const addUser = async () => {
    try {
        user.isShow = true;
        await fetchRoles();
    } catch (error) {
        console.error(error);
    }
}

const editUser = async (list) => {
    try {
        user.isShow = true;
        await fetchRoles();
        user.data = list;
    } catch (error) {
        console.error(error);
    }
}

const fetchRoles = async () => {
    try {
        let query = {
            name: { $ne: ROLE.SYSTEM_ADMIN }
        }
        const response = await api.get(`${config.public.API}/role/fetchs`, {
            params: {
                query: JSON.stringify(query),
            }
        });
        if (response.status == STATUS.OK) {
            user.roles = response.data.roles.map(r => r.name);
        }
    } catch (error) {
        console.error(error);
    }
}

const submit = async () => {
    try {
        let query = { _id: user.data._id };
        let projection = {
            ...user.data,
        }
        let options = {
            new: true,
            upsert: true,
            rawResult: true,
        }
        const response = await api.post(`${config.public.API}/user/update`, {
            query: JSON.stringify(query),
            projection: JSON.stringify(projection),
            options: JSON.stringify(options),
        })
        if (response.status === STATUS.OK) {
            user.data._id = response.data.user._id;
            user.list = user.list.map(user => {
                if (user._id == response.data.user._id) {
                    return response.data.user;
                } else {
                    return user;
                }
            })
        } else if (response.status === STATUS.CREATED) {
            user.data._id = response.data.user._id;
            user.list.push(response.data.user);
        }
    } catch (error) {
        console.log(error);
    } finally {
        user.isShow = false;
    }
}

const deleteuser = async (list) => {
    try {
        const query = {
            _id: list._id,
        }
        const response = await api.delete(`${config.public.API}/user/delete`, {
            params: {
                query: JSON.stringify(query),
            }
        });
        if (response.status === STATUS.OK) {
            $toast.success(response.data.message);
            $speak(response.data.message);
            user.list = user.list.filter(l => l._id != list._id);
        }

    } catch (error) {
        console.log(error);
    }
}

const init = async () => {
    try {
        const response = await api.get(`${config.public.API}/user/fetchs`);
        if (response.status === STATUS.OK) {
            user.list = response.data.users;
        }
    } catch (error) {
        console.log(error);
    }
}
onMounted(async () => {
    await init();
})
</script>

<style scoped>
.user {
    width: 100%;
    padding: 10px;
}

.header {
    background: var(--background-color-two);
    border: 1px solid var(--border-color-one);
    border-radius: 10px;
    color: var(--text-color-one);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}

.left h1 {
    font-size: 20px;
    padding: 0;
    margin: 0;
}

.right {
    display: flex;
    flex-direction: column;
    padding: 10px;
}

.left {
    padding: 10px;
}

.right button {
    background: var(--background-color-two);
    border: 1px solid var(--border-color-one);
    border-radius: 10px;
    padding: 5px 10px;
    color: var(--text-color-one);
}

.right button:hover {
    background-color: var(--background-color-three);
}

.list {
    background: var(--background-color-two);
    border: 1px solid var(--border-color-one);
    border-radius: 10px;
    color: var(--text-color-one);
    padding: 10px;
    margin: 5px;
}
</style>