<template> <!-- SANDEEP SANA-->
    <div class="price-page">
        <div class="price-page__header">
            <div class="price-page__heading">
                <p class="price-page__eyebrow">Pricing</p>
                <h1>Price Management</h1>
            </div>
            <button type="button" class="price-page__add-btn" @click="openAddModal">
                Add Price
            </button>
        </div>

        <div v-if="price.list.length" class="price-grid">
            <div v-for="list in price.list" :key="list._id || list.name" class="price-card">
                <div class="price-card__left">
                    <p class="price-card__label">Name</p>
                    <h3 class="price-card__name">{{ list.name }}</h3>
                    <p class="price-card__label">Amount</p>
                    <p class="price-card__amount">{{ list.amount }}</p>
                </div>
                <div class="price-card__actions">
                    <button type="button" class="price-card__btn price-card__btn--muted" @click="openEditModal(list)">Edit</button>
                    <button type="button" class="price-card__btn price-card__btn--danger" @click="deletePrice(list)">Delete</button>
                </div>
            </div>
        </div>
        <div v-else class="price-empty">
            <p>No pricing entries yet.</p>
        </div>
    </div>

    <!-- add price -->
    <div v-if="price.isShow" class="price-modal__backdrop">
        <div class="price-modal__dialog" role="dialog" aria-modal="true">
            <div class="price-modal__header">
                <div>
                    <p class="price-modal__eyebrow">Pricing</p>
                    <h2 class="price-modal__title">{{ isEditMode ? 'Update Price' : 'Add Price' }}</h2>
                </div>
                <button
                    type="button"
                    class="price-modal__close"
                    aria-label="Close add price dialog"
                    @click="closeModal"
                >
                    ×
                </button>
            </div>
            <form class="price-modal__form" @submit.prevent="submitPrice">
                <p class="price-modal__subtext">
                    {{ isEditMode ? 'Update the label and amount for this pricing plan.' : 'Add a label and amount for a new pricing plan.' }}
                </p>
                <div class="price-modal__field">
                    <label for="name">Name</label>
                    <Field name="name" as="input" type="text" id="name" class="price-modal__input" placeholder="Enter name"
                        rules="required|nospace" />
                    <ErrorMessage name="name" class="price-modal__error" />
                </div>
                <div class="price-modal__field">
                    <label for="amount">Amount</label>
                    <Field name="amount" as="input" type="number" id="amount" class="price-modal__input"
                        placeholder="Enter amount" rules="required|nospace" />
                    <ErrorMessage name="amount" class="price-modal__error" />
                </div>
                <div class="price-modal__actions">
                    <button type="button" class="price-modal__btn price-modal__btn--cancel" @click="closeModal">Cancel</button>
                    <button type="submit" class="price-modal__btn price-modal__btn--save">{{ isEditMode ? 'Update' : 'Save' }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ErrorMessage, Field, useForm } from 'vee-validate';
import { reactive } from 'vue';
import api from '~~/api.config';
import { STATUS } from '~~/constant';

const price = reactive({
    list: [],
    isShow: false,
    editId: null,
})

const config = useRuntimeConfig();
const { handleSubmit, setValues, resetForm } = useForm({
    initialValues: {
        name: '',
        amount: '',
    },
});
const { $session, $toast, $logout, $speak } = useNuxtApp();

const isEditMode = computed(() => !!price.editId);

const closeModal = () => {
    price.isShow = false;
    price.editId = null;
    resetForm({
        values: {
            name: '',
            amount: '',
        },
    });
};

const openAddModal = () => {
    closeModal();
    price.isShow = true;
};

const openEditModal = (list) => {
    price.editId = list._id;
    setValues({
        name: list.name || '',
        amount: list.amount ?? '',
    });
    price.isShow = true;
};

const submitPrice = handleSubmit(async (values) => {
    try {
        if (isEditMode.value) {
            const payload = {
                _id: price.editId,
                ...values,
            };
            const response = await api.put(`${config.public.API}/price/update`, {
                query: JSON.stringify(payload),
            });
            if (response.status === STATUS.OK) {
                $toast.success(response.data.message);
                $speak(response.data.message);
                price.list = price.list.map((item) =>
                    item._id === price.editId ? (response.data.price || { ...item, ...values }) : item
                );
            }
        } else {
            const response = await api.post(`${config.public.API}/price/add`, {
                query: JSON.stringify(values)
            });
            if (response.status === STATUS.CREATED) {
                $toast.success(response.data.message);
                $speak(response.data.message);
                price.list.unshift(response.data.price || values);
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        closeModal();
    }
});

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
        const response = await api.get(`${config.public.API}/price/fetchs`, {
            params: {
                options: JSON.stringify({
                    sort: { createdAt: -1 },
                }),
            },
        });
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
.price-page {
    width: 100%;
    padding: 0.25rem;
}

.price-page__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
    border: 1px solid rgba(203, 213, 225, 0.2);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.03);
    padding: 0.9rem 1rem;
    margin-bottom: 1rem;
}

.price-page__heading h1 {
    margin: 0;
    font-size: 1.25rem;
    letter-spacing: -0.01em;
}

.price-page__eyebrow {
    margin: 0 0 0.2rem;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.55);
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.price-page__add-btn {
    width: auto;
    margin: 0;
    border: none;
    border-radius: 10px;
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #0f172a;
    background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 45%, #ddd6fe 100%);
    cursor: pointer;
}

.price-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.8rem;
}

.price-card {
    border: 1px solid rgba(203, 213, 225, 0.2);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.03);
    padding: 0.9rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.8rem;
}

.price-card__label {
    margin: 0;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.5);
}

.price-card__name {
    margin: 0.15rem 0 0.7rem;
    font-size: 1.05rem;
}

.price-card__amount {
    margin: 0.15rem 0 0;
    font-size: 1rem;
    font-weight: 600;
    color: #c4b5fd;
}

.price-card__actions {
    display: grid;
    gap: 0.4rem;
}

.price-card__btn {
    margin: 0;
    width: auto;
    padding: 0.42rem 0.75rem;
    border-radius: 8px;
    font-size: 0.82rem;
    border: 1px solid rgba(203, 213, 225, 0.35);
    background: rgba(255, 255, 255, 0.06);
    color: var(--text-color-one);
    cursor: pointer;
}

.price-card__btn--muted {
    color: rgba(255, 255, 255, 0.85);
}

.price-card__btn--danger {
    color: #fecaca;
    border-color: rgba(248, 113, 113, 0.45);
    background: rgba(248, 113, 113, 0.12);
}

.price-empty {
    border: 1px dashed rgba(203, 213, 225, 0.35);
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.65);
}

.price-modal__backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background:
        radial-gradient(circle at 20% 10%, rgba(99, 102, 241, 0.16), transparent 45%),
        radial-gradient(circle at 80% 90%, rgba(168, 85, 247, 0.14), transparent 45%),
        rgba(2, 6, 23, 0.72);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
}

.price-modal__dialog {
    width: min(34rem, 100%);
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
    overflow-x: hidden;
    background: linear-gradient(180deg, rgba(42, 42, 64, 0.98) 0%, rgba(24, 24, 36, 0.98) 100%);
    padding: 1rem;
    border: 1px solid rgba(203, 213, 225, 0.24);
    color: var(--text-color-one);
    border-radius: 16px;
    box-shadow:
        0 32px 80px rgba(0, 0, 0, 0.58),
        0 0 0 1px rgba(255, 255, 255, 0.06) inset,
        0 0 28px rgba(129, 140, 248, 0.16);
    box-sizing: border-box;
}

.price-modal__title {
    margin: 0;
    font-size: 1.8rem;
    line-height: 1.1;
    letter-spacing: -0.02em;
    font-weight: 700;
}

.price-modal__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    padding-bottom: 0.9rem;
    border-bottom: 1px solid rgba(203, 213, 225, 0.18);
}

.price-modal__eyebrow {
    margin: 0 0 0.2rem;
    font-size: 0.74rem;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-weight: 600;
}

.price-modal__close {
    width: auto;
    margin: 0;
    border: 1px solid rgba(203, 213, 225, 0.28);
    background: rgba(255, 255, 255, 0.06);
    color: var(--text-color-one);
    border-radius: 10px;
    padding: 0.22rem 0.68rem;
    line-height: 1;
    font-size: 1.15rem;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
}

.price-modal__close:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(203, 213, 225, 0.45);
}

.price-modal__close:active {
    transform: translateY(1px);
}

.price-modal__form {
    display: grid;
    gap: 0.9rem;
    margin-top: 0.85rem;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
}

.price-modal__subtext {
    margin: 0;
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.95rem;
    line-height: 1.5;
}

.price-modal__field label {
    width: auto;
    display: block;
    margin: 0 0 0.35rem;
    font-size: 0.84rem;
    letter-spacing: 0.02em;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.82);
}

.price-modal__input {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0.62rem 0.78rem;
    border-radius: 10px;
    border: 1px solid rgba(203, 213, 225, 0.42);
    background-color: rgba(24, 24, 36, 0.7);
    color: var(--text-color-one);
    box-sizing: border-box;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.price-modal__input::placeholder {
    color: rgba(255, 255, 255, 0.34);
}

.price-modal__input:hover {
    border-color: rgba(203, 213, 225, 0.58);
}

.price-modal__input:focus {
    outline: none;
    border-color: rgba(165, 180, 252, 0.85);
    background-color: rgba(24, 24, 36, 0.88);
    box-shadow:
        0 0 0 3px rgba(99, 102, 241, 0.22),
        0 0 20px rgba(99, 102, 241, 0.2);
}

.price-modal__error {
    display: block;
    margin-top: 0.3rem;
    color: #fca5a5;
    font-size: 0.8rem;
}

.price-modal__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.55rem;
    flex-wrap: wrap;
    margin-top: 0.35rem;
}

.price-modal__btn {
    width: auto;
    margin: 0;
    min-width: 88px;
    padding: 0.58rem 1.05rem;
    border-radius: 11px;
    border: 1px solid rgba(203, 213, 225, 0.22);
    font-weight: 600;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: transform 0.1s ease, border-color 0.15s ease, box-shadow 0.2s ease, background 0.15s ease;
}

.price-modal__btn--cancel {
    color: var(--text-color-one);
    border-color: rgba(203, 213, 225, 0.35);
    background: rgba(255, 255, 255, 0.06);
}

.price-modal__btn--save {
    color: #0f172a;
    background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 45%, #ddd6fe 100%);
    border-color: rgba(196, 181, 253, 0.75);
    box-shadow: 0 6px 16px rgba(129, 140, 248, 0.35);
}

.price-modal__btn:hover {
    transform: translateY(-1px);
}

.price-modal__btn--cancel:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(203, 213, 225, 0.48);
}

.price-modal__btn--save:hover {
    box-shadow: 0 10px 24px rgba(129, 140, 248, 0.45);
}

@media (max-width: 560px) {
    .price-page__header {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>