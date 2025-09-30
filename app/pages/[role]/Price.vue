<template>
    <div class="price">
        <div class="header">
            <div class="left">
                <h1>Price</h1>
            </div>
            <div class="right">
                <button type="button" @click="price.isShow = true">Add Price</button>
            </div>
        </div>
        <div class="body d-flex flex-wrap">
            <div v-for="list in price.list" class="list d-flex flex-row">
                <div class="left">
                    <p>Name: {{ list.name }}</p>
                    <p>Amount: {{ list.amount }}</p>
                </div>
                <div class="right">
                    <button>Edit</button>
                    <button @click="deletePrice(list)">Delete</button>
                </div>
            </div>
        </div>
    </div>
    <!-- add price -->
    <Modal v-if="price.isShow">
        <template #header>
            <h2 class="text-center text-xl font-bold text-primary">
                <i class="fa fa-plus-circle"></i> Add Price
            </h2>
        </template>
        <template #body>
            <form @submit.prevent="addPrice">
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <Field name="name" as="input" type="text" id="name" class="form-control" placeholder="Enter name"
                        rules="required|nospace" />
                    <ErrorMessage name="name" class="text-danger mt-2" />
                </div>
                <div class="mb-3">
                    <label for="amount" class="form-label">Amount</label>
                    <Field name="amount" as="input" type="number" id="amount" class="form-control"
                        placeholder="Enter amount" rules="required|nospace" />
                    <ErrorMessage name="amount" class="text-danger mt-2" />
                </div>
                <div class="d-flex justify-content-end gap-3">
                    <button type="button" @click="price.isShow = false" class="btn btn-secondary">
                        <i class="fa fa-times-circle"></i> Cancel
                    </button>
                    <button type="submit" class="btn btn-success">
                        <i class="fa fa-save"></i> Save
                    </button>
                </div>
            </form>
        </template>
    </Modal>
</template>

<script setup>
import { ErrorMessage, Field, useForm } from 'vee-validate';
import { reactive } from 'vue';
import api from '~~/api.config';
import { STATUS } from '~~/constant';
import Modal from '~~/modal/Modal.vue';

const price = reactive({
    list: [],
    isShow: false,
})

const config = useRuntimeConfig();
const { handleSubmit } = useForm();
const { $session, $toast, $logout, $speak } = useNuxtApp();

const addPrice = handleSubmit(async (values) => {
    try {
        const response = await api.post(`${config.public.API}/price/add`, {
            query: JSON.stringify(values)
        })
        if (response.status === STATUS.CREATED) {
            $toast.success(response.data.message);
            $speak(response.data.message);
            price.list.unshift(values);
        }
    } catch (error) {
        console.log(error);
    } finally {
        price.isShow = false;
    }
})

const deletePrice = async (list) => {
    try {
        const query = {
            _id: list._id,
        }
        const response = await api.delete(`${config.public.API}/price/delete`, {
            params: {
                query: JSON.stringify(query),
            }
        });
        if(response.status === STATUS.OK){
            $toast.success(response.data.message);
            $speak(response.data.message);
            price.list = price.list.filter(l => l._id != list._id);
        }

    } catch (error) {
        console.log(error);
    }
}

const init = async () => {
    try {
        const response = await api.get(`${config.public.API}/price/fetchs`);
        if (response.status === STATUS.OK) {
            price.list = response.data.prices;
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
.price {
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